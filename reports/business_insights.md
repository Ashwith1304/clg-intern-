# EXECUTIVE BUSINESS INTELLIGENCE REPORT
## Customer Churn Analysis & Empirical Retention Strategy
**Institution:** Sreenidhi Institute of Science and Technology (SNIST)  
**Department:** Computer Science and Engineering — Data Science (CSE-DS)  
**Authors:** G Mythili (24311A67H8), K Ashiwith (24311A67H6), D Niyati (24311A67H7)  
**Dataset:** IBM Telco Customer Churn (7,043 Records, 21 Attributes)  

---

## 1. Executive Summary

This business intelligence report synthesizes statistical hypothesis testing, relational SQLite queries, and exploratory data analysis conducted on the 7,043 subscriber accounts within the IBM Telco Customer Churn dataset.

### Core Key Performance Indicators (Baseline)
- **Total Registered Accounts:** 7,043
- **Active Retained Customers:** 5,174 accounts (73.46%)
- **Churned Accounts:** 1,869 accounts (26.54%)
- **Average Monthly Recurring Charge (ARPU):** $64.76
- **Total Monthly Recurring Revenue (MRR):** $456,116.60
- **Total Customer Lifetime Spend (LTV):** $16,056,168.70

---

## 2. Key Empirical Findings

### 2.1 The Contract Commitment Moat
- **Month-to-Month Contracts:** 3,875 accounts (55.02% of subscriber base) suffer a **42.71% churn rate** (1,655 accounts lost).
- **One-Year Contracts:** 1,473 accounts suffer an **11.27% churn rate** (166 accounts lost).
- **Two-Year Contracts:** 1,695 accounts achieve an outstanding **2.83% churn rate** (only 48 accounts lost).
- **Inference:** Contract duration is the single strongest statistical determinant of account retention ($\chi^2 = 1184.81, p < 0.0001$). A two-year contract provides a **15.1x reduction in churn risk** compared to monthly billing.

### 2.2 Payment Method Friction
- **Electronic Check:** 2,365 accounts exhibit a **45.29% churn rate** (1,071 lost accounts, representing 57.3% of all churn company-wide).
- **Credit Card (Automatic):** 1,522 accounts exhibit a **15.24% churn rate**.
- **Bank Transfer (Automatic):** 1,544 accounts exhibit a **16.71% churn rate**.
- **Inference:** Manual monthly payments force customers into recurring friction and re-evaluation cycles. Automated payment methods provide frictionless recurring transactions that yield a **+30% net retention gain**.

### 2.3 The Fiber Optic Dissatisfaction Paradox
- **Fiber Optic Subscribers:** 3,096 accounts experience an alarming **41.89% churn rate** (1,297 lost accounts).
- **DSL Subscribers:** 2,421 accounts experience an **18.96% churn rate** (459 accounts lost).
- **Non-Internet Users:** 1,526 accounts experience a **7.40% churn rate**.
- **Inference:** Despite paying premium fees ($87.02/month average), Fiber Optic subscribers exhibit double the attrition of DSL customers. Cross-tabulation indicates that fiber subscribers who lack Tech Support and Online Security churn at over 45%, pointing to unresolved connectivity glitches and lack of perceived value.

### 2.4 The Early Tenure Hazard ("The 90-Day Cliff")
- **0–6 Months Tenure:** 1,389 accounts exhibit an extreme **52.99% churn rate** (736 lost accounts).
- **7–12 Months Tenure:** 766 accounts exhibit a **38.25% churn rate** (293 lost accounts).
- **49–72 Months Tenure:** 1,878 accounts experience an **8.47% churn rate**.
- **Inference:** Churn risk decays rapidly over customer lifespan. Over 55% of all cancellations occur within the first 12 months. Once a customer crosses 24 months, retention probability exceeds 85%.

---

## 3. Inferential Hypothesis Testing Results

### 3.1 Chi-Square ($\chi^2$) Tests of Independence ($\alpha = 0.05$)
| Predictor Feature | Chi-Square ($\chi^2$) | df | p-value | Decision | Interpretation |
|---|---|---|---|---|---|
| Contract Agreement | 1,184.81 | 2 | < 0.0001 | Reject $H_0$ | Extremely strong dependency on contract length. |
| Online Security | 849.99 | 2 | < 0.0001 | Reject $H_0$ | Security add-ons drastically increase stickiness. |
| Tech Support | 828.19 | 2 | < 0.0001 | Reject $H_0$ | Technical assistance prevents customer rage-quits. |
| Internet Service | 732.31 | 2 | < 0.0001 | Reject $H_0$ | Fiber technology experiences higher vulnerability. |
| Payment Method | 648.41 | 3 | < 0.0001 | Reject $H_0$ | Electronic check payment causes severe churn. |
| Paperless Billing | 258.28 | 1 | < 0.0001 | Reject $H_0$ | Paperless notifications trigger bill-shock. |
| Senior Citizen | 159.43 | 1 | < 0.0001 | Reject $H_0$ | Older demographic has elevated attrition (41.7%). |
| Gender | 0.58 | 1 | 0.447 | Fail to Reject $H_0$ | Gender is independent of customer churn. |

### 3.2 Welch's Two-Sample t-test ($H_0: \mu_{\text{churned}} = \mu_{\text{retained}}$)
- **Monthly Charges:**
  - Churned Mean ($\mu_1$): **$74.44** (std = 24.67)
  - Retained Mean ($\mu_2$): **$61.27** (std = 31.09)
  - Welch $t$-statistic: **16.54**, df: 4007.1, $p < 0.0001$
  - **Verdict:** Reject $H_0$. Churned customers pay an average premium of +$13.18/month, corroborating that high unbundled charges without support trigger account cancellation.
- **Customer Tenure:**
  - Churned Mean: **17.98 months**
  - Retained Mean: **37.57 months**
  - Welch $t$-statistic: **-31.57**, df: 3491.7, $p < 0.0001$
  - **Verdict:** Reject $H_0$. Retained customers have over double the active lifespan of churned customers.

---

## 4. Strategic Retention Roadmap

| Pillar | Intervention Target | Empirical Baseline | Recommended Action | Projected Annual Impact |
|---|---|---|---|---|
| 1 | Month-to-Month Migration | 42.7% Churn | 12% discount for 1-year contract commitment | Retain ~300 accounts ($265k/yr MRR) |
| 2 | Auto-Pay Onboarding | 45.3% Churn (E-check) | $10 bill credit for switching to ACH/Card Auto-pay | Retain ~240 accounts ($214k/yr MRR) |
| 3 | Fiber Support Bundling | 41.9% Churn (Fiber) | Bundle Tech Support & Security into base plan | Retain ~520 accounts ($540k/yr MRR) |
| 4 | First-Year Success Track | 53.0% Churn (<6 mo) | Proactive Day-7, Day-30, and Day-90 check-in calls | Retain ~150 accounts ($180k/yr MRR) |
| 5 | Senior Citizen Care | 41.7% Churn (Seniors) | Zero-hold dedicated helpline & clear paper billing | Retain ~200 accounts ($191k/yr MRR) |
| 6 | Bill Shock Prevention | 33.6% Churn (Paperless) | 5-day pre-debit SMS alerts before promo expirations | Retain ~180 accounts ($140k/yr MRR) |

**Total Estimated Annual Revenue Preservation:** **$1,350,000+**
