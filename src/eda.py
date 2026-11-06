"""
Exploratory Data Analysis (EDA) Module
Customer Churn Analysis and Business Intelligence Project
Sreenidhi Institute of Science and Technology (SNIST)
Department of CSE - Data Science
Authors: G Mythili (24311A67H8), K Ashiwith (24311A67H6), D Niyati (24311A67H7)
"""

from typing import List, Dict, Any

def analyze_bivariate_churn(records: List[Dict[str, Any]], column_name: str) -> List[Dict[str, Any]]:
    """Analyzes customer churn rate and volume across any categorical dimension."""
    categories = sorted(list(set(str(r[column_name]) for r in records)))
    summary = []
    
    for cat in categories:
        subset = [r for r in records if str(r[column_name]) == cat]
        total = len(subset)
        churned = len([r for r in subset if r["Churn"] == "Yes"])
        active = total - churned
        rate = round((churned / total) * 100, 2) if total > 0 else 0.0
        avg_monthly = round(sum(r["MonthlyCharges"] for r in subset) / total, 2) if total > 0 else 0.0
        
        summary.append({
            "category": cat,
            "total_subscribers": total,
            "active_count": active,
            "churned_count": churned,
            "churn_rate_pct": rate,
            "avg_monthly_charges": avg_monthly
        })
    return summary

def analyze_tenure_cohorts(records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Analyzes churn rates across 6 standard tenure cohorts."""
    cohort_bins = [
        ("0-12m", 0, 12),
        ("13-24m", 13, 24),
        ("25-36m", 25, 36),
        ("37-48m", 37, 48),
        ("49-60m", 49, 60),
        ("61-72m", 61, 72),
    ]
    results = []
    for label, min_t, max_t in cohort_bins:
        subset = [r for r in records if min_t <= r["tenure"] <= max_t]
        total = len(subset)
        churned = len([r for r in subset if r["Churn"] == "Yes"])
        rate = round((churned / total) * 100, 2) if total > 0 else 0.0
        results.append({
            "cohort": label,
            "subscribers": total,
            "churned": churned,
            "churn_rate_pct": rate
        })
    return results

def analyze_monthly_charge_tiers(records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Analyzes churn distribution across pricing brackets."""
    tiers = [
        ("Budget (< $35)", 0.0, 35.0),
        ("Standard ($35-$70)", 35.01, 70.0),
        ("Premium ($70-$90)", 70.01, 90.0),
        ("Ultra (> $90)", 90.01, 999.0),
    ]
    results = []
    for label, min_p, max_p in tiers:
        subset = [r for r in records if min_p <= r["MonthlyCharges"] <= max_p]
        total = len(subset)
        churned = len([r for r in subset if r["Churn"] == "Yes"])
        rate = round((churned / total) * 100, 2) if total > 0 else 0.0
        results.append({
            "tier": label,
            "subscribers": total,
            "churned": churned,
            "churn_rate_pct": rate
        })
    return results
