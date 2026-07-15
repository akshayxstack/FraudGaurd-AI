import pandas as pd

# ==============================
# Load the Dataset
# ==============================

# Update the path if your dataset is stored elsewhere
df = pd.read_csv("data/creditcard.csv")

# ==============================
# Dataset Overview
# ==============================

print("=" * 60)
print("DATASET OVERVIEW")
print("=" * 60)

print(f"Dataset Shape: {df.shape}")
print(f"Number of Rows: {df.shape[0]}")
print(f"Number of Columns: {df.shape[1]}")

# ==============================
# First 5 Rows
# ==============================

print("\n" + "=" * 60)
print("FIRST 5 ROWS")
print("=" * 60)

print(df.head())

# ==============================
# Column Names
# ==============================

print("\n" + "=" * 60)
print("COLUMN NAMES")
print("=" * 60)

print(df.columns.tolist())

# ==============================
# Dataset Information
# ==============================

print("\n" + "=" * 60)
print("DATASET INFORMATION")
print("=" * 60)

df.info()

# ==============================
# Missing Values
# ==============================

print("\n" + "=" * 60)
print("MISSING VALUES")
print("=" * 60)

print(df.isnull().sum())

# ==============================
# Class Distribution
# ==============================

print("\n" + "=" * 60)
print("CLASS DISTRIBUTION")
print("=" * 60)

class_counts = df["Class"].value_counts()

normal = class_counts[0]
fraud = class_counts[1]

print(f"Normal Transactions : {normal}")
print(f"Fraud Transactions  : {fraud}")

# ==============================
# Fraud Percentage
# ==============================

fraud_percentage = (fraud / len(df)) * 100

print(f"\nFraud Percentage : {fraud_percentage:.4f}%")
print(f"Normal Percentage: {100 - fraud_percentage:.4f}%")

# ==============================
# Basic Statistics
# ==============================

print("\n" + "=" * 60)
print("BASIC STATISTICS")
print("=" * 60)

print(df.describe())

print("\nAnalysis Completed Successfully!")