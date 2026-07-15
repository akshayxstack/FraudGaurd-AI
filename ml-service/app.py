import json
import logging
from contextlib import asynccontextmanager
from datetime import datetime
from pathlib import Path
from typing import Any, Dict

import joblib
import numpy as np
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from schemas import PredictionRequest, PredictionResponse, PredictionResult, RiskLevel

# ==========================================
# Logging Setup
# ==========================================
logging.basicConfig(
    level=logging.INFO if not settings.debug_mode else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# ==========================================
# Global State for ML Assets
# ==========================================
ml_assets: Dict[str, Any] = {
    "model": None,
    "feature_names": None,
    "model_config": None,
    "model_metrics": None,
    "amount_scaler": None,
    "time_scaler": None,
    "threshold": None
}

# ==========================================
# Lifespan Events
# ==========================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan manager.
    Loads ML models and related configurations during startup.
    Ensures they are loaded exactly once and safely stored.
    Fails fast (raises RuntimeError) if required assets are missing.
    """
    logger.info("Application starting up. Loading ML assets...")
    base_dir = Path(__file__).resolve().parent
    model_dir = settings.model_dir if settings.model_dir.is_absolute() else base_dir / settings.model_dir
    
    try:
        if not model_dir.exists():
            raise FileNotFoundError(f"Model directory not found at {model_dir}")
            
        # Load XGBoost Model
        model_path = model_dir / "fraud_model.pkl"
        if not model_path.exists():
            raise FileNotFoundError(f"Model file not found at {model_path}")
        ml_assets["model"] = joblib.load(model_path)
        logger.info("XGBoost model loaded successfully.")

        # Load Feature Names
        feature_names_path = model_dir / "feature_names.json"
        if feature_names_path.exists():
            with open(feature_names_path, "r", encoding="utf-8") as f:
                ml_assets["feature_names"] = json.load(f)
            logger.info("Feature names loaded successfully.")
        else:
            raise FileNotFoundError(f"Feature names file missing at {feature_names_path}")
            
        # Load Model Config
        model_config_path = model_dir / "model_config.json"
        if model_config_path.exists():
            with open(model_config_path, "r", encoding="utf-8") as f:
                ml_assets["model_config"] = json.load(f)
                if "threshold" not in ml_assets["model_config"]:
                    raise ValueError("Threshold is missing in model_config.json")
                ml_assets["threshold"] = ml_assets["model_config"]["threshold"]
            logger.info("Model configuration loaded successfully.")
        else:
            raise FileNotFoundError(f"Model config file missing at {model_config_path}")

        # Load Model Metrics
        model_metrics_path = model_dir / "model_metrics.json"
        if model_metrics_path.exists():
            with open(model_metrics_path, "r", encoding="utf-8") as f:
                ml_assets["model_metrics"] = json.load(f)
            logger.info("Model metrics loaded successfully.")
            
        # Load Scalers
        # NOTE: amount_scaler.pkl and time_scaler.pkl are loaded here for future scenarios
        # such as real-time feature engineering (where raw amounts/times need scaling dynamically).
        # Currently, they are NOT required by the /predict endpoint, as the frontend sends pre-scaled PCA features.
        amount_scaler_path = model_dir / "amount_scaler.pkl"
        if amount_scaler_path.exists():
            ml_assets["amount_scaler"] = joblib.load(amount_scaler_path)
            logger.info("Amount scaler loaded successfully.")
            
        time_scaler_path = model_dir / "time_scaler.pkl"
        if time_scaler_path.exists():
            ml_assets["time_scaler"] = joblib.load(time_scaler_path)
            logger.info("Time scaler loaded successfully.")

        logger.info("All required ML assets loaded successfully.")
        yield
        
    except Exception as e:
        logger.exception(f"Failed to load ML assets during startup: {str(e)}")
        # Raise RuntimeError to stop app startup immediately if critical assets are missing or corrupted.
        raise RuntimeError(f"Application startup failed due to ML asset loading error: {str(e)}") from e
        
    finally:
        logger.info("Application shutting down. Cleaning up resources...")
        ml_assets.clear()

# ==========================================
# Application Setup
# ==========================================
app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="Microservice for predicting fraudulent transactions using XGBoost.",
    lifespan=lifespan,
    debug=settings.debug_mode
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# Helpers
# ==========================================
def get_risk_level(probability: float) -> RiskLevel:
    """
    Determine the risk level Enum based on the probability.
    """
    threshold = ml_assets["threshold"]
    if probability >= threshold:
        return RiskLevel.HIGH
    elif probability >= 0.5:
        return RiskLevel.MEDIUM
    return RiskLevel.LOW

# ==========================================
# Endpoints
# ==========================================
@app.get(
    "/",
    tags=["General"],
    summary="Root Endpoint",
    description="Returns general information about the service."
)
def root():
    """
    Root endpoint to verify the service is running.
    """
    return {
        "service": settings.app_name,
        "version": settings.version,
        "status": "running",
        "documentation": "/docs",
        "health": "/health"
    }


@app.get(
    "/health",
    tags=["Monitoring"],
    summary="Health Check",
    description="Returns detailed health status of the application and ML assets."
)
def health_check():
    """
    Health check endpoint for monitoring systems.
    Verifies if all necessary ML models and configs are loaded in memory.
    """
    is_model_loaded = ml_assets.get("model") is not None
    is_feature_names_loaded = ml_assets.get("feature_names") is not None
    
    status_msg = "ok" if (is_model_loaded and is_feature_names_loaded) else "degraded"
    
    return {
        "status": status_msg,
        "model_loaded": is_model_loaded,
        "scalers_loaded": {
            "amount_scaler": ml_assets.get("amount_scaler") is not None,
            "time_scaler": ml_assets.get("time_scaler") is not None,
        },
        "feature_names_loaded": is_feature_names_loaded,
        "model_version": settings.version,
        "threshold": ml_assets["threshold"],
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get(
    "/model-info",
    tags=["Model Info"],
    summary="Model Information",
    description="Returns non-sensitive metadata about the currently loaded XGBoost model."
)
def get_model_info():
    """
    Endpoint providing metadata about the ML model.
    Does not expose the model file, sensitive training data, raw configs, or training metrics.
    """
    feature_names = ml_assets.get("feature_names", [])
    
    return {
        "model_name": "FraudGuard XGBoost Model",
        "model_version": settings.version,
        "threshold": ml_assets["threshold"],
        "expected_features": len(feature_names) if feature_names else 0
    }


@app.post(
    "/predict",
    response_model=PredictionResponse,
    tags=["Predictions"],
    summary="Fraud Prediction",
    description="Accepts a batch of transaction features and returns fraud probabilities and risk levels.",
    responses={
        200: {"description": "Successfully predicted fraud probabilities."},
        400: {"description": "Invalid input format or incorrect number of features."},
        503: {"description": "ML Model is not currently available."}
    }
)
def predict(request: PredictionRequest):
    """
    Main prediction endpoint.
    
    - Validates feature count against the expected training features.
    - Computes fraud probability via XGBoost.
    - Determines risk level using the loaded threshold.
    """
    model = ml_assets.get("model")
    feature_names = ml_assets.get("feature_names")
    
    if model is None or feature_names is None:
        logger.error("Prediction attempted, but model or feature names are not loaded.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model is currently unavailable."
        )

    expected_features_count = len(feature_names)
    results = []

    for idx, txn in enumerate(request.transactions):
        if len(txn.features) != expected_features_count:
            logger.warning(
                f"Invalid feature count in transaction {idx}: "
                f"Expected {expected_features_count}, got {len(txn.features)}"
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Transaction {idx} invalid: Expected {expected_features_count} features, got {len(txn.features)}"
            )

        try:
            # Reshape feature array for XGBoost predict_proba
            feature_array = np.array(txn.features, dtype=float).reshape(1, -1)
            probability = float(model.predict_proba(feature_array)[0][1])
            is_fraud = probability >= ml_assets["threshold"]

            results.append(PredictionResult(
                fraud_probability=round(probability, 4),
                is_fraud=is_fraud,
                risk_level=get_risk_level(probability)
            ))
        except Exception as e:
            logger.error(f"Prediction failure for transaction {idx}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred during prediction processing."
            )

    logger.info(f"Successfully processed {len(request.transactions)} transaction(s) for prediction.")
    return PredictionResponse(predictions=results)