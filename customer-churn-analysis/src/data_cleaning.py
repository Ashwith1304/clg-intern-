"""
Data Cleaning and Preprocessing Pipeline
Customer Churn Analysis and Business Intelligence Project
Sreenidhi Institute of Science and Technology (SNIST)
Department of CSE - Data Science
Authors: G Mythili (24311A67H8), K Ashiwith (24311A67H6), D Niyati (24311A67H7)
"""

import os
import csv
import sqlite3
from typing import Dict, List, Tuple, Any

def load_raw_dataset(file_path: str = "data/raw/Telco-Customer-Churn.csv") -> List[Dict[str, Any]]:
    """Loads raw IBM Telco customer churn dataset from CSV."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Raw dataset not found at {file_path}")
    
    records = []
    with open(file_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            records.append(dict(row))
    return records

def audit_missing_and_duplicates(records: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Audits missing values and checks duplicate primary keys."""
    total_records = len(records)
    seen_ids = set()
    duplicate_count = 0
    blank_total_charges = 0
    
    for row in records:
        cust_id = row.get("customerID", "").strip()
        if cust_id in seen_ids:
            duplicate_count += 1
        seen_ids.add(cust_id)
        
        tot = str(row.get("TotalCharges", "")).strip()
        if tot == "" or tot == " ":
            blank_total_charges += 1
            
    return {
        "total_records": total_records,
        "unique_customers": len(seen_ids),
        "duplicate_records": duplicate_count,
        "blank_total_charges": blank_total_charges
    }

def clean_telco_dataset(records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Cleans customer churn records:
    1. Removes duplicate customer IDs
    2. Imputes blank TotalCharges to 0.0 (for tenure=0 accounts)
    3. Casts numeric columns to integer and float
    4. Validates categorical domain constraints
    """
    cleaned = []
    seen_ids = set()
    
    for idx, row in enumerate(records):
        cust_id = row.get("customerID", f"CUST-{idx}").strip()
        if cust_id in seen_ids:
            continue
        seen_ids.add(cust_id)
        
        # Total charges conversion
        raw_tot = str(row.get("TotalCharges", "")).strip()
        try:
            tot_val = float(raw_tot) if raw_tot != "" and raw_tot != " " else 0.0
        except ValueError:
            tot_val = 0.0
            
        cleaned_row = {
            "customerID": cust_id,
            "gender": row.get("gender", "Unknown"),
            "SeniorCitizen": 1 if str(row.get("SeniorCitizen", "")).strip() == "1" else 0,
            "Partner": "Yes" if row.get("Partner") == "Yes" else "No",
            "Dependents": "Yes" if row.get("Dependents") == "Yes" else "No",
            "tenure": max(0, int(row.get("tenure", 0))),
            "PhoneService": row.get("PhoneService", "No"),
            "MultipleLines": row.get("MultipleLines", "No"),
            "InternetService": row.get("InternetService", "No"),
            "OnlineSecurity": row.get("OnlineSecurity", "No"),
            "OnlineBackup": row.get("OnlineBackup", "No"),
            "DeviceProtection": row.get("DeviceProtection", "No"),
            "TechSupport": row.get("TechSupport", "No"),
            "StreamingTV": row.get("StreamingTV", "No"),
            "StreamingMovies": row.get("StreamingMovies", "No"),
            "Contract": row.get("Contract", "Month-to-month"),
            "PaperlessBilling": "Yes" if row.get("PaperlessBilling") == "Yes" else "No",
            "PaymentMethod": row.get("PaymentMethod", "Mailed check"),
            "MonthlyCharges": float(row.get("MonthlyCharges", 0.0)),
            "TotalCharges": tot_val,
            "Churn": "Yes" if row.get("Churn") == "Yes" else "No",
        }
        cleaned.append(cleaned_row)
        
    return cleaned

def export_cleaned_csv(cleaned_records: List[Dict[str, Any]], output_path: str = "data/processed/Telco-Customer-Churn-Cleaned.csv"):
    """Exports cleaned customer records to CSV."""
    if not cleaned_records:
        return
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    fieldnames = list(cleaned_records[0].keys())
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(cleaned_records)
    print(f"Cleaned dataset successfully exported to {output_path}")

def save_to_sqlite(cleaned_records: List[Dict[str, Any]], db_path: str = "database/telco_churn.db"):
    """Populates SQLite database table telco_churn."""
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("DROP TABLE IF EXISTS telco_churn")
    
    cur.execute("""
        CREATE TABLE telco_churn (
            customerID TEXT PRIMARY KEY,
            gender TEXT,
            SeniorCitizen INTEGER,
            Partner TEXT,
            Dependents TEXT,
            tenure INTEGER,
            PhoneService TEXT,
            MultipleLines TEXT,
            InternetService TEXT,
            OnlineSecurity TEXT,
            OnlineBackup TEXT,
            DeviceProtection TEXT,
            TechSupport TEXT,
            StreamingTV TEXT,
            StreamingMovies TEXT,
            Contract TEXT,
            PaperlessBilling TEXT,
            PaymentMethod TEXT,
            MonthlyCharges REAL,
            TotalCharges REAL,
            Churn TEXT
        )
    """)
    
    rows = [tuple(r.values()) for r in cleaned_records]
    cur.executemany("INSERT INTO telco_churn VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", rows)
    conn.commit()
    conn.close()
    print(f"Successfully stored {len(cleaned_records)} records into SQLite: {db_path}")

if __name__ == "__main__":
    raw = load_raw_dataset()
    audit = audit_missing_and_duplicates(raw)
    print("Raw Data Audit:", audit)
    cleaned = clean_telco_dataset(raw)
    export_cleaned_csv(cleaned)
    save_to_sqlite(cleaned)
