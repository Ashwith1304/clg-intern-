"""
Business Insights and Strategic Recommendations Generator
Customer Churn Analysis and Business Intelligence Project
Sreenidhi Institute of Science and Technology (SNIST)
Department of CSE - Data Science
Authors: G Mythili (24311A67H8), K Ashiwith (24311A67H6), D Niyati (24311A67H7)
"""

from typing import List, Dict, Any

def get_strategic_business_recommendations() -> List[Dict[str, Any]]:
    """Returns the empirical data-backed business recommendations."""
    return [
        {
            "pillar": 1,
            "title": "Annual Contract Migration Incentives",
            "observed_pattern": "Month-to-month contracts experience a 42.71% churn rate vs 2.83% for Two-Year contracts (15.1x risk ratio).",
            "supporting_statistics": "Month-to-Month Churn: 42.71% | One-Year Churn: 11.27% | Two-Year Churn: 2.83% | chi2 = 1184.81 (p < 0.0001)",
            "business_implication": "Over 55% of all accounts have zero contractual barrier to switching, creating extreme baseline churn volatility.",
            "retention_action": "Introduce a 12% annual commitment discount or speed bump vouchers. Institute proactive outreach 45 days before anniversary billing."
        },
        {
            "pillar": 2,
            "title": "Electronic Check Payment Modernization",
            "observed_pattern": "Electronic Check users suffer 45.29% churn compared to ~15.2% for automated Credit Card subscribers.",
            "supporting_statistics": "Electronic Check: 45.29% churn | Credit Card (auto): 15.24% | Bank ACH (auto): 16.71% | chi2 = 648.41 (p < 0.0001)",
            "business_implication": "Manual monthly payments create continuous evaluation friction, provoking spontaneous account cancellations.",
            "retention_action": "Provide a $10 one-time bill credit and $2.50 monthly recurring discount for enrolling in auto-debit."
        },
        {
            "pillar": 3,
            "title": "Fiber Optic Support & Security Bundling",
            "observed_pattern": "Fiber Optic churn is 41.89% (more than double DSL at 18.96%) despite commanding high monthly fees ($87 avg).",
            "supporting_statistics": "Fiber Churn: 41.89% | TechSupport Users Churn: 15.17% | Non-TechSupport Churn: 41.64% | chi2 = 732.31 (p < 0.0001)",
            "business_implication": "High subscription fees without complimentary device protection or tech assistance make premium customers feel shortchanged.",
            "retention_action": "Automatically bundle Online Security and 24/7 Priority Tech Support into base fiber plans without separate line items."
        },
        {
            "pillar": 4,
            "title": "First-Year Onboarding & 90-Day Retention Sequence",
            "observed_pattern": "Subscribers in their first 6 months experience 52.99% churn, compared to under 8.5% for subscribers past 48 months.",
            "supporting_statistics": "0-6m Churn: 52.99% | 7-12m Churn: 38.25% | 49-60m Churn: 9.94% | 61-72m Churn: 6.64%",
            "business_implication": "Customer acquisition costs (CAC) are squandered when early churn occurs before achieving unit economics payback.",
            "retention_action": "Deploy automated onboarding milestones: Day-7 setup check, Day-30 first bill walk-through, Day-90 loyalty perk."
        },
        {
            "pillar": 5,
            "title": "Senior Citizen Concierge Support",
            "observed_pattern": "Senior citizens churn at 41.68% (nearly 2x the 23.61% rate of non-seniors), despite paying higher bills ($79.82/mo).",
            "supporting_statistics": "Senior Churn: 41.68% | Non-Senior Churn: 23.61% | Senior Avg Bill: $79.82 | chi2 = 159.43 (p < 0.0001)",
            "business_implication": "Complex digital apps, paperless confusion, and multi-tier tech packages frustrate older subscribers.",
            "retention_action": "Offer a 'Silver Tier' with zero-hold customer support phone lines and fee-free clear printed invoices."
        },
        {
            "pillar": 6,
            "title": "Paperless Billing Transparency & Pre-Debit Alerts",
            "observed_pattern": "Subscribers on paperless billing churn at 33.57% vs 16.33% for traditional mailed invoices.",
            "supporting_statistics": "Paperless Churn: 33.57% | Mailed Invoice Churn: 16.33% | chi2 = 258.28 (p < 0.0001)",
            "business_implication": "Missed email notices lead to surprise price increases after introductory periods expire ('bill shock').",
            "retention_action": "Send 5-day prior SMS notices before account debit with transparent explanations for any promo credit expiration."
        }
    ]

if __name__ == "__main__":
    recs = get_strategic_business_recommendations()
    for r in recs:
        print(f"\n[Pillar {r['pillar']}] {r['title']}")
        print(f"Observation: {r['observed_pattern']}")
        print(f"Stats: {r['supporting_statistics']}")
        print(f"Action: {r['retention_action']}")
