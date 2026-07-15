# 🛡️ FraudGuard AI

### AI-Powered Financial Fraud Detection & Investigation Platform

FraudGuard AI is a full-stack intelligent fraud detection system that combines **Machine Learning**, **FastAPI**, **Express.js**, and **Google Gemini AI** to detect suspicious financial transactions, generate explainable insights, and assist investigators through an interactive web application.

---

## 🚀 Overview

Traditional fraud detection systems often provide only a prediction, leaving investigators to manually determine *why* a transaction is suspicious.

**FraudGuard AI bridges this gap by combining predictive machine learning with AI-powered explanations**, enabling users to upload transaction datasets, detect fraud, visualize trends, and investigate suspicious activities—all in one platform.

---

## ✨ Key Features

- 🔍 AI-powered fraud detection using **XGBoost**
- 📂 Secure CSV upload and validation
- 📊 Interactive dashboard with real-time analytics
- 🤖 Google Gemini AI for transaction explanations
- 📈 Risk scoring and fraud probability analysis
- 🗂️ Case management and investigation workflow
- ⚡ FastAPI ML microservice for high-performance predictions
- ☁️ MongoDB Atlas integration for persistent storage

---

# 🏗️ System Architecture

```text
                   React Frontend
                          │
                          ▼
                  Express Backend API
                          │
        ┌─────────────────┴──────────────────┐
        │                                    │
        ▼                                    ▼
 MongoDB Atlas                    FastAPI ML Service
                                           │
                                           ▼
                                    XGBoost Model
                                           │
                                           ▼
                               Fraud Probability Engine
                                           │
                                           ▼
                                  Google Gemini AI
                                           │
                                           ▼
                           Dashboard • Analytics • Reports
```

---

# ⚙️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Machine Learning** | Python, FastAPI, XGBoost, Scikit-learn |
| **AI** | Google Gemini API |
| **Tools** | Git, GitHub, AWS |

---

# 🔄 Workflow

```text
Upload CSV
      │
      ▼
CSV Validation
      │
      ▼
Data Parsing
      │
      ▼
Feature Engineering
      │
      ▼
ML Prediction (XGBoost)
      │
      ▼
Risk Classification
      │
      ▼
AI Explanation (Gemini)
      │
      ▼
Store Results
      │
      ▼
Dashboard & Analytics
```

---

# 📁 Project Structure

```text
FraudGuard-AI
│
├── frontend          # React + TypeScript
├── backend           # Express.js REST APIs
├── ml-service        # FastAPI ML microservice
└── README.md
```

---

# 🛠️ Installation

### Clone Repository

```bash
git clone https://github.com/akshayxstack/FraudGuard-AI.git
cd FraudGuard-AI
```

### Install Frontend

```bash
cd frontend
npm install
npm run dev
```

### Install Backend

```bash
cd backend
npm install
npm run dev
```

### Start ML Service

```bash
cd ml-service

python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt

uvicorn app:app --reload
```

---

# 🔐 Environment Variables

### Backend

```env
MONGODB_URI=
FASTAPI_URL=
JWT_SECRET=
GEMINI_API_KEY=
```

### Frontend

```env
VITE_API_URL=
```

---

# 🎯 Future Scope

- Real-time fraud monitoring
- Role-based authentication
- Background batch processing
- Docker & Kubernetes deployment
- CI/CD automation
- Multi-model fraud detection

---

# 👨‍💻 Author

**Akshay Ch**

B.Tech Computer Science Engineering

GitHub: https://github.com/akshayxstack

---

### ⭐ If you found this project interesting, consider giving it a Star!
