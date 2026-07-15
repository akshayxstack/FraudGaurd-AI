from pydantic import BaseModel, Field, ConfigDict
from typing import List
from enum import Enum

class RiskLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

class Transaction(BaseModel):
    """
    Represents a single transaction with all its numerical features.
    These must match your feature_names.json order exactly.
    V1-V28 come from the training data's PCA-transformed columns.
    """
    features: List[float] = Field(
        ...,
        description="A flat list of 30 numerical features for the transaction.",
        json_schema_extra={
            "example": [
                0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 
                0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 
                0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
            ]
        }
    )

class PredictionRequest(BaseModel):
    """
    Request model for the /predict endpoint containing a batch of transactions.
    """
    transactions: List[Transaction] = Field(
        ...,
        description="List of transactions to evaluate."
    )

class PredictionResult(BaseModel):
    """
    Prediction outcome for a single transaction.
    """
    fraud_probability: float = Field(
        ...,
        description="Probability that the transaction is fraudulent (0.0 to 1.0).",
        json_schema_extra={"example": 0.9654}
    )
    is_fraud: bool = Field(
        ...,
        description="True if the probability meets or exceeds the threshold.",
        json_schema_extra={"example": True}
    )
    risk_level: RiskLevel = Field(
        ...,
        description="Categorical risk level: 'Low', 'Medium', or 'High'.",
        json_schema_extra={"example": "High"}
    )

class PredictionResponse(BaseModel):
    """
    Response model for the /predict endpoint containing predictions for the batch.
    """
    predictions: List[PredictionResult] = Field(
        ...,
        description="List of prediction results corresponding to the input transactions."
    )