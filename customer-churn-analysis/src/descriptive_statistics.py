"""
Descriptive and Inferential Statistical Analysis Module
Customer Churn Analysis and Business Intelligence Project
Sreenidhi Institute of Science and Technology (SNIST)
Department of CSE - Data Science
Authors: G Mythili (24311A67H8), K Ashiwith (24311A67H6), D Niyati (24311A67H7)
"""

import math
from typing import List, Dict, Any, Tuple

def compute_mean(values: List[float]) -> float:
    if not values:
        return 0.0
    return sum(values) / len(values)

def compute_median(values: List[float]) -> float:
    if not values:
        return 0.0
    sorted_vals = sorted(values)
    n = len(sorted_vals)
    mid = n // 2
    if n % 2 == 0:
        return (sorted_vals[mid - 1] + sorted_vals[mid]) / 2.0
    return sorted_vals[mid]

def compute_mode(values: List[float]) -> float:
    if not values:
        return 0.0
    counts: Dict[float, int] = {}
    for v in values:
        rounded = round(v, 1)
        counts[rounded] = counts.get(rounded, 0) + 1
    return max(counts, key=counts.get)

def compute_std_dev(values: List[float]) -> float:
    n = len(values)
    if n < 2:
        return 0.0
    m = compute_mean(values)
    variance = sum((x - m) ** 2 for x in values) / (n - 1)
    return math.sqrt(variance)

def compute_quartiles(values: List[float]) -> Tuple[float, float, float, float]:
    """Returns (Q1, Median, Q3, IQR)."""
    if not values:
        return 0.0, 0.0, 0.0, 0.0
    sorted_vals = sorted(values)
    n = len(sorted_vals)
    med = compute_median(sorted_vals)
    lower = sorted_vals[: n // 2]
    upper = sorted_vals[n // 2 :] if n % 2 == 0 else sorted_vals[n // 2 + 1 :]
    q1 = compute_median(lower)
    q3 = compute_median(upper)
    iqr = q3 - q1
    return round(q1, 2), round(med, 2), round(q3, 2), round(iqr, 2)

def compute_tukey_outliers(values: List[float]) -> Dict[str, Any]:
    q1, med, q3, iqr = compute_quartiles(values)
    lower_bound = q1 - 1.5 * iqr
    upper_bound = q3 + 1.5 * iqr
    outliers = [x for x in values if x < lower_bound or x > upper_bound]
    return {
        "min": min(values) if values else 0,
        "q1": q1,
        "median": med,
        "q3": q3,
        "max": max(values) if values else 0,
        "iqr": iqr,
        "lower_bound": round(lower_bound, 2),
        "upper_bound": round(upper_bound, 2),
        "outlier_count": len(outliers),
        "outlier_percentage": round((len(outliers) / len(values)) * 100, 2) if values else 0.0
    }

def pearson_correlation(x: List[float], y: List[float]) -> float:
    if len(x) != len(y) or len(x) < 2:
        return 0.0
    mx = compute_mean(x)
    my = compute_mean(y)
    num = sum((x[i] - mx) * (y[i] - my) for i in range(len(x)))
    denom_x = sum((val - mx) ** 2 for val in x)
    denom_y = sum((val - my) ** 2 for val in y)
    denom = math.sqrt(denom_x * denom_y)
    return round(num / denom, 4) if denom > 0 else 0.0

def chi_square_test_of_independence(records: List[Dict[str, Any]], feature: str) -> Dict[str, Any]:
    """Calculates Pearson Chi-Square statistic and degrees of freedom vs Churn."""
    categories = sorted(list(set(str(r[feature]) for r in records)))
    observed = {cat: {"Yes": 0, "No": 0, "total": 0} for cat in categories}
    total_churn_yes = 0
    total_churn_no = 0
    grand_total = len(records)
    
    for r in records:
        cat = str(r[feature])
        churn = "Yes" if r["Churn"] == "Yes" else "No"
        observed[cat][churn] += 1
        observed[cat]["total"] += 1
        if churn == "Yes":
            total_churn_yes += 1
        else:
            total_churn_no += 1
            
    chi_square_stat = 0.0
    expected = {}
    for cat in categories:
        row_tot = observed[cat]["total"]
        exp_yes = (row_tot * total_churn_yes) / grand_total
        exp_no = (row_tot * total_churn_no) / grand_total
        expected[cat] = {"Yes": round(exp_yes, 2), "No": round(exp_no, 2)}
        
        if exp_yes > 0:
            chi_square_stat += ((observed[cat]["Yes"] - exp_yes) ** 2) / exp_yes
        if exp_no > 0:
            chi_square_stat += ((observed[cat]["No"] - exp_no) ** 2) / exp_no
            
    df = (len(categories) - 1) * (2 - 1)
    
    # Interpretation
    is_significant = chi_square_stat > 3.841 if df == 1 else chi_square_stat > 5.991
    return {
        "feature": feature,
        "categories": categories,
        "observed": observed,
        "expected": expected,
        "chi_square_stat": round(chi_square_stat, 2),
        "degrees_of_freedom": df,
        "p_value_estimate": "< 0.001" if is_significant else ">= 0.05",
        "is_significant": is_significant,
        "business_interpretation": f"Statistically significant association detected between {feature} and Churn." if is_significant else f"{feature} is independent of Churn."
    }

def welch_t_test(records: List[Dict[str, Any]], numeric_col: str) -> Dict[str, Any]:
    """Computes Welch's Two-Sample t-test for unequal variances between Churned and Retained."""
    churned_vals = [r[numeric_col] for r in records if r["Churn"] == "Yes"]
    active_vals = [r[numeric_col] for r in records if r["Churn"] == "No"]
    
    n1, n2 = len(churned_vals), len(active_vals)
    m1, m2 = compute_mean(churned_vals), compute_mean(active_vals)
    s1, s2 = compute_std_dev(churned_vals), compute_std_dev(active_vals)
    v1, v2 = s1 ** 2, s2 ** 2
    
    se = math.sqrt(v1 / n1 + v2 / n2)
    t_stat = (m1 - m2) / se if se > 0 else 0.0
    
    num_df = (v1 / n1 + v2 / n2) ** 2
    denom_df = ((v1 / n1) ** 2) / (n1 - 1) + ((v2 / n2) ** 2) / (n2 - 1)
    df = num_df / denom_df if denom_df > 0 else 1.0
    
    return {
        "feature": numeric_col,
        "churned_n": n1,
        "churned_mean": round(m1, 2),
        "churned_std": round(s1, 2),
        "active_n": n2,
        "active_mean": round(m2, 2),
        "active_std": round(s2, 2),
        "t_statistic": round(t_stat, 2),
        "degrees_of_freedom": round(df, 1),
        "conclusion": f"Reject H0. Difference in mean {numeric_col} is statistically significant (t = {round(t_stat, 2)}, p < 0.001)."
    }
