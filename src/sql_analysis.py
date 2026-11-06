"""
SQL Business Analytics Engine Module
Customer Churn Analysis and Business Intelligence Project
Sreenidhi Institute of Science and Technology (SNIST)
Department of CSE - Data Science
Authors: G Mythili (24311A67H8), K Ashiwith (24311A67H6), D Niyati (24311A67H7)
"""

import sqlite3
import os
from typing import List, Dict, Any, Tuple

DB_PATH = "database/telco_churn.db"

BUSINESS_QUESTIONS = [
    {
        "id": 1,
        "question": "Total number of customers in the database",
        "sql": "SELECT COUNT(*) AS total_customers FROM telco_churn;",
        "interpretation": "The total subscriber base is 7,043 unique accounts."
    },
    {
        "id": 2,
        "question": "Total churned customers",
        "sql": "SELECT COUNT(*) AS churned_customers FROM telco_churn WHERE Churn = 'Yes';",
        "interpretation": "A total of 1,869 customers terminated their contracts."
    },
    {
        "id": 3,
        "question": "Overall customer churn percentage",
        "sql": """SELECT 
  COUNT(*) AS total_customers,
  SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) AS churned_count,
  ROUND(100.0 * SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) / COUNT(*), 2) AS churn_rate_pct
FROM telco_churn;""",
        "interpretation": "Company baseline churn rate is 26.54%."
    },
    {
        "id": 4,
        "question": "Contract type with the highest churn rate",
        "sql": """SELECT 
  Contract,
  COUNT(*) AS total_subscribers,
  SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) AS churned_count,
  ROUND(100.0 * SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) / COUNT(*), 2) AS churn_rate_pct
FROM telco_churn
GROUP BY Contract
ORDER BY churn_rate_pct DESC;""",
        "interpretation": "Month-to-month contracts experience the highest churn rate at 42.71%."
    },
    {
        "id": 5,
        "question": "Payment method with the most churned customers",
        "sql": """SELECT 
  PaymentMethod,
  COUNT(*) AS total_customers,
  SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) AS churned_count,
  ROUND(100.0 * SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) / COUNT(*), 2) AS churn_rate_pct
FROM telco_churn
GROUP BY PaymentMethod
ORDER BY churned_count DESC;""",
        "interpretation": "Electronic check leads in lost accounts (1,071 churned, 45.29% churn rate)."
    },
    {
        "id": 6,
        "question": "Average monthly charges across cohorts",
        "sql": """SELECT 
  ROUND(AVG(MonthlyCharges), 2) AS overall_avg,
  ROUND(AVG(CASE WHEN Churn = 'Yes' THEN MonthlyCharges END), 2) AS churned_avg,
  ROUND(AVG(CASE WHEN Churn = 'No' THEN MonthlyCharges END), 2) AS retained_avg,
  ROUND(AVG(CASE WHEN Churn = 'Yes' THEN MonthlyCharges END) - AVG(CASE WHEN Churn = 'No' THEN MonthlyCharges END), 2) AS premium_gap
FROM telco_churn;""",
        "interpretation": "Churned customers paid an average of $74.44/mo vs $61.27/mo for retained users (+$13.18 gap)."
    },
    {
        "id": 7,
        "question": "Internet service with the highest churn rate",
        "sql": """SELECT 
  InternetService,
  COUNT(*) AS total_users,
  SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) AS churned_users,
  ROUND(100.0 * SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) / COUNT(*), 2) AS churn_rate_pct
FROM telco_churn
GROUP BY InternetService
ORDER BY churn_rate_pct DESC;""",
        "interpretation": "Fiber optic internet exhibits a 41.89% churn rate, more than double DSL (18.96%)."
    },
    {
        "id": 8,
        "question": "Average tenure of churned customers",
        "sql": """SELECT 
  Churn,
  COUNT(*) AS customer_count,
  ROUND(AVG(tenure), 1) AS avg_tenure_months,
  ROUND(MIN(tenure), 1) AS min_tenure,
  ROUND(MAX(tenure), 1) AS max_tenure
FROM telco_churn
GROUP BY Churn;""",
        "interpretation": "Churned customers leave after an average tenure of 18.0 months vs 37.6 months for retained accounts."
    },
    {
        "id": 9,
        "question": "Customer segment generating highest monthly revenue",
        "sql": """SELECT 
  Contract,
  InternetService,
  COUNT(*) AS customer_count,
  ROUND(SUM(MonthlyCharges), 2) AS total_monthly_revenue,
  ROUND(AVG(MonthlyCharges), 2) AS avg_monthly_charge
FROM telco_churn
GROUP BY Contract, InternetService
ORDER BY total_monthly_revenue DESC;""",
        "interpretation": "Month-to-month Fiber Optic generates highest MRR ($182,308/mo) but has the highest attrition risk."
    },
    {
        "id": 10,
        "question": "Number of month-to-month contract customers",
        "sql": """SELECT 
  COUNT(CASE WHEN Contract = 'Month-to-month' THEN 1 END) AS month_to_month_customers,
  COUNT(*) AS total_customers,
  ROUND(100.0 * COUNT(CASE WHEN Contract = 'Month-to-month' THEN 1 END) / COUNT(*), 2) AS month_to_month_pct
FROM telco_churn;""",
        "interpretation": "55.02% of all subscribers (3,875 accounts) have no contract lock-in."
    }
]

def run_all_sql_questions(db_path: str = DB_PATH) -> List[Dict[str, Any]]:
    """Executes all 10 standard business queries against SQLite."""
    if not os.path.exists(db_path):
        raise FileNotFoundError(f"Database file not found: {db_path}. Please run data_cleaning.py first.")
        
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    outputs = []
    for item in BUSINESS_QUESTIONS:
        cur.execute(item["sql"])
        columns = [desc[0] for desc in cur.description]
        rows = cur.fetchall()
        outputs.append({
            "id": item["id"],
            "question": item["question"],
            "sql": item["sql"],
            "columns": columns,
            "rows": rows,
            "interpretation": item["interpretation"]
        })
        
    conn.close()
    return outputs

if __name__ == "__main__":
    results = run_all_sql_questions()
    for r in results:
        print(f"\n[{r['id']}] {r['question']}")
        print(f"Columns: {r['columns']}")
        print(f"Result: {r['rows']}")
        print(f"Interpretation: {r['interpretation']}")
