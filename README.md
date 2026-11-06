# Customer Churn Analysis and Business Intelligence Dashboard
### An Interactive Data Analytics Platform for Understanding Customer Retention

**Academic Institution:** Sreenidhi Institute of Science and Technology (SNIST)  
**Department:** Computer Science and Engineering — Data Science (CSE-DS)  
**Authors:**
- **G Mythili** — Roll No: `24311A67H8`
- **K Ashiwith** — Roll No: `24311A67H6`
- **D Niyati** — Roll No: `24311A67H7`

---

## 1. Project Overview & Problem Statement

Customer churn is one of the most critical operational challenges in the telecommunications and subscription SaaS sectors. Acquiring new subscribers costs 5 to 7 times more than retaining existing accounts. When customers terminate their contracts without warning, recurring revenue declines and long-term customer lifetime value (LTV) is destroyed.

This project delivers a comprehensive, college-level Business Intelligence and Data Science platform built upon the authentic IBM Telco Customer Churn dataset (7,043 subscriber records across 21 attributes). It provides end-to-end data cleaning, parametric and non-parametric exploratory data analysis, inferential hypothesis testing (Chi-Square Independence and Welch's Two-Sample t-test), a relational SQLite querying engine answering 10 executive business questions, multi-attribute customer segmentation, and 6 empirical strategic retention recommendations.

> **Scope Note:** This project strictly focuses on Data Analytics, Descriptive and Inferential Statistics, SQL Engineering, and Business Intelligence. No predictive machine learning models (Logistic Regression, Random Forests, Neural Networks) are used.

---

## 2. Core Project Objectives

1. **Quantify Churn Dynamics:** Determine the exact company-wide baseline churn rate (26.54%) and isolate high-risk customer cohorts.
2. **Evaluate Contractual Influence:** Measure the impact of contract lock-in on subscriber stickiness (Month-to-month vs One-year vs Two-year).
3. **Analyze Billing Channels:** Investigate why manual payment methods (Electronic Check) suffer over triple the churn of automated debit methods.
4. **Identify Pricing Sensitivity:** Determine the threshold monthly charges ($70+) that trigger defection and evaluate the effect of value-added service bundling (Tech Support, Online Security).
5. **Conduct Hypothesis Testing:** Statistically validate whether churn is truly dependent on categorical features using Pearson's Chi-Square ($\chi^2$) tests and whether monthly charges and tenure differences are significant using Welch's t-test ($\alpha = 0.05$).
6. **Relational SQLite Business Investigations:** Answer 10 core business questions using standard SQL DQL and provide an interactive SQL console.
7. **Empirical Action Plan:** Formulate 6 concrete, data-grounded business retention recommendations with estimated annual revenue protection.

---

## 3. Dataset Description

The project utilizes the benchmark **IBM Telco Customer Churn Dataset** (Blastchar):
- **Records:** 7,043 unique customer accounts
- **Attributes:** 21 features (1 Primary Key, 17 Categorical features, 3 Continuous numeric features)
- **Primary Key:** `customerID` (100% unique, zero duplicates detected)
- **Target Variable:** `Churn` ('Yes' / 'No')

### Key Features
| Category | Attribute Names | Description |
|---|---|---|
| Demographic | `gender`, `SeniorCitizen`, `Partner`, `Dependents` | Subscriber demographic profile and family status |
| Account & Tenure | `tenure`, `Contract`, `PaperlessBilling`, `PaymentMethod` | Longevity in months, contract terms, and billing channels |
| Subscribed Services | `PhoneService`, `MultipleLines`, `InternetService`, `OnlineSecurity`, `OnlineBackup`, `DeviceProtection`, `TechSupport`, `StreamingTV`, `StreamingMovies` | Service bundle mix (DSL, Fiber optic, value-add addons) |
| Financials | `MonthlyCharges`, `TotalCharges` | Monthly billing rate and cumulative lifetime spend (USD) |

---

## 4. End-to-End Architecture

```
                      +-----------------------------+
                      |   IBM Telco Raw Dataset     |
                      |   (7,043 rows, 21 cols)     |
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      |  Data Cleaning & Imputation |
                      |  - 11 blank TotalCharges    |
                      |  - Duplicate Key Check      |
                      |  - Tukey IQR Outlier Bounds |
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      |    SQLite Database Engine   |
                      |    (table: telco_churn)     |
                      +--------------+--------------+
                                     |
         +---------------------------+---------------------------+
         |                                                       |
         v                                                       v
+-----------------------------+                         +-----------------------------+
|    Statistical Engine       |                         |    SQL Analytics Engine     |
| - Descriptive Stats (Quart.)|                         | - 10 Core Business Queries  |
| - Pearson Correlation Heatmap|                        | - DQL Group By & Aggregation|
| - Chi-Square Tests (df, p)  |                         | - Interactive Query Console |
| - Welch's Two-Sample t-test |                         +--------------+--------------+
+--------------+--------------+                                        |
               |                                                       |
               +---------------------------+---------------------------+
                                           |
                                           v
                            +-----------------------------+
                            |  Business Intelligence UI   |
                            |  - 6 Real-time KPI Cards    |
                            |  - Interactive Charts       |
                            |  - Global Dynamic Filters   |
                            |  - Customer Data Explorer   |
                            |  - Strategic Action Plan    |
                            +-----------------------------+
```

---

## 5. Data Cleaning & Quality Audit

The ingestion pipeline (`src/data_cleaning.py`) executes automatic schema validation and audits:
1. **TotalCharges Whitespace Imputation:** In the raw dataset, 11 customer accounts with `tenure = 0` contained a whitespace string `" "` in place of a float. These brand-new accounts had not completed their first billing cycle. The pipeline safely converts these values to `0.00` float without dropping rows.
2. **Duplicate Detection:** Verified that all 7,043 `customerID` values are strictly distinct (0 duplicate records).
3. **Data Type Standardization:** Enforces numeric casting for `tenure` (int), `MonthlyCharges` (float), `TotalCharges` (float), and binary integer flags for `SeniorCitizen` (0/1).
4. **Tukey 1.5 × IQR Outlier Analysis:**
   - **MonthlyCharges:** $Q_1 = \$35.50$, $Q_3 = \$89.85$, $IQR = \$54.35$. Lower bound: $-\$46.03$, Upper bound: $\$171.38$. Outlier count = 0 (0.0%).
   - **tenure:** $Q_1 = 9$ mo, $Q_3 = 55$ mo, $IQR = 46$ mo. Outlier count = 0 (0.0%).
   - **TotalCharges:** $Q_1 = \$401.45$, $Q_3 = \$3,794.74$, $IQR = \$3,393.29$. Outlier count = 0 (0.0%).

---

## 6. Statistical Analysis & Hypothesis Testing

### 6.1 Pearson Correlation Analysis ($r$)
- **Tenure vs Churn ($r = -0.35$):** Moderate-to-strong negative correlation. Longer subscriber tenure significantly decreases the probability of churn.
- **Monthly Charges vs Churn ($r = +0.19$):** Positive correlation indicating price sensitivity.
- **Total Charges vs Tenure ($r = +0.83$):** High collinearity representing cumulative billing across longevity.

### 6.2 Chi-Square ($\chi^2$) Independence Tests ($\alpha = 0.05$)
The Null Hypothesis ($H_0$) states that the categorical predictor and Customer Churn are independent.
- **Contract Type:** $\chi^2 = 1184.81$, $df = 2$, $p < 0.0001 \implies$ **Reject $H_0$**
- **Online Security:** $\chi^2 = 849.99$, $df = 2$, $p < 0.0001 \implies$ **Reject $H_0$**
- **Tech Support:** $\chi^2 = 828.19$, $df = 2$, $p < 0.0001 \implies$ **Reject $H_0$**
- **Internet Service:** $\chi^2 = 732.31$, $df = 2$, $p < 0.0001 \implies$ **Reject $H_0$**
- **Payment Method:** $\chi^2 = 648.41$, $df = 3$, $p < 0.0001 \implies$ **Reject $H_0$**
- **Paperless Billing:** $\chi^2 = 258.28$, $df = 1$, $p < 0.0001 \implies$ **Reject $H_0$**
- **Senior Citizen:** $\chi^2 = 159.43$, $df = 1$, $p < 0.0001 \implies$ **Reject $H_0$**
- **Gender:** $\chi^2 = 0.58$, $df = 1$, $p = 0.447 \implies$ **Fail to Reject $H_0$** (Gender has no relationship with churn).

### 6.3 Welch's Two-Sample t-test for Continuous Metrics
- **Monthly Charges:**
  - Churned Mean: **$74.44**, Retained Mean: **$61.27**
  - Welch $t = 16.54$, $df = 4007.1$, $p < 0.0001 \implies$ **Reject $H_0$**. Churned customers incur a statistically significant +$13.18/month premium.
- **Tenure:**
  - Churned Mean: **17.98 months**, Retained Mean: **37.57 months**
  - Welch $t = -31.57$, $df = 3491.7$, $p < 0.0001 \implies$ **Reject $H_0$**. Retained subscribers remain active more than twice as long.

---

## 7. The 10 Core SQL Business Questions

All queries run against table `telco_churn` in `database/telco_churn.db`:

1. **Total Customers:**
   ```sql
   SELECT COUNT(*) AS total_customers FROM telco_churn;
   ```
   *Result:* `7,043`
2. **Total Churned Customers:**
   ```sql
   SELECT COUNT(*) AS churned_customers FROM telco_churn WHERE Churn = 'Yes';
   ```
   *Result:* `1,869`
3. **Overall Churn Percentage:**
   ```sql
   SELECT ROUND(100.0 * SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) / COUNT(*), 2) AS churn_rate_pct FROM telco_churn;
   ```
   *Result:* `26.54%`
4. **Contract Type with Highest Churn Rate:**
   ```sql
   SELECT Contract, COUNT(*) AS total, SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) AS churned,
          ROUND(100.0 * SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) / COUNT(*), 2) AS churn_pct
   FROM telco_churn GROUP BY Contract ORDER BY churn_pct DESC;
   ```
   *Result:* `Month-to-month: 42.71% | One year: 11.27% | Two year: 2.83%`
5. **Payment Method with Most Churned Customers:**
   ```sql
   SELECT PaymentMethod, COUNT(*) AS total, SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) AS churned,
          ROUND(100.0 * SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) / COUNT(*), 2) AS churn_pct
   FROM telco_churn GROUP BY PaymentMethod ORDER BY churned DESC;
   ```
   *Result:* `Electronic check: 1,071 churned (45.29%)`
6. **Average Monthly Charges Across Cohorts:**
   ```sql
   SELECT ROUND(AVG(MonthlyCharges), 2) AS overall_avg,
          ROUND(AVG(CASE WHEN Churn = 'Yes' THEN MonthlyCharges END), 2) AS churned_avg,
          ROUND(AVG(CASE WHEN Churn = 'No' THEN MonthlyCharges END), 2) AS retained_avg
   FROM telco_churn;
   ```
   *Result:* `Overall: $64.76 | Churned: $74.44 | Retained: $61.27`
7. **Internet Service with Highest Churn Rate:**
   ```sql
   SELECT InternetService, COUNT(*) AS total,
          ROUND(100.0 * SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) / COUNT(*), 2) AS churn_pct
   FROM telco_churn GROUP BY InternetService ORDER BY churn_pct DESC;
   ```
   *Result:* `Fiber optic: 41.89% | DSL: 18.96% | No Internet: 7.40%`
8. **Average Tenure of Churned vs Retained Accounts:**
   ```sql
   SELECT Churn, COUNT(*) AS count, ROUND(AVG(tenure), 1) AS avg_tenure_months FROM telco_churn GROUP BY Churn;
   ```
   *Result:* `Churned: 18.0 months | Retained: 37.6 months`
9. **Customer Segment Generating Highest Monthly Revenue:**
   ```sql
   SELECT Contract, InternetService, COUNT(*) AS count, ROUND(SUM(MonthlyCharges), 2) AS total_mrr
   FROM telco_churn GROUP BY Contract, InternetService ORDER BY total_mrr DESC LIMIT 1;
   ```
   *Result:* `Month-to-month + Fiber optic ($185,181.10/mo across 2,128 subscribers)`
10. **Number of Month-to-Month Contract Customers:**
    ```sql
    SELECT COUNT(*) AS m2m_count, ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM telco_churn), 2) AS m2m_pct
    FROM telco_churn WHERE Contract = 'Month-to-month';
    ```
    *Result:* `3,875 customers (55.02% of total subscriber base)`

---

## 8. Dashboard Pages Overview

The interactive web platform provides 9 dedicated pages:
- **Page 1: Executive Overview:** 6 real-time KPI cards, customer retention donut, contract churn rate bars, monthly revenue contribution, tenure progression, and payment method vulnerabilities.
- **Page 2: Customer Data Explorer:** Paginated high-density table with instant text search, column visibility selector, sortable headers, and CSV export.
- **Page 3: Data Quality Report:** Whitespace imputation log for TotalCharges, 0-duplicate verification, 21-column schema audit table, and Tukey IQR outlier box plots.
- **Page 4: Exploratory Data Analysis (EDA):** Bivariate churn distributions, tenure hazard progression, price bracket sensitivity, and service cross-tabulations.
- **Page 5: Statistical Analysis:** Full descriptive statistics table (mean, median, mode, std, min, max, quartiles), 8×8 Pearson correlation matrix, Chi-Square contingency tables, and Welch t-test results.
- **Page 6: SQL Business Analytics:** The 10 business questions with copyable queries, execution results, business interpretations, and a live custom SQL query runner with CSV export.
- **Page 7: Customer Segmentation:** Descriptive behavioral segmentation across tenure brackets, charge tiers, and service bundles with comparative matrices.
- **Page 8: Business Recommendations:** 6 empirical retention pillars detailing observed patterns, statistical proof, business implications, recommended actions, and projected financial ROI ($1.35M+ annual preservation).
- **Page 9: About Project:** Project objectives, student team members, Sreenidhi Institute of Science and Technology credentials, and end-to-end architecture.

---

## 9. Technology Stack

- **Data Analytics & Statistics:** Python 3.10, Pandas, NumPy, SciPy, Statsmodels
- **Database:** SQLite 3 (`database/telco_churn.db`), AlaSQL In-Memory Engine
- **Visualization:** Plotly Express, Matplotlib, Seaborn
- **Frontend & Web:** React 19, TypeScript, Tailwind CSS v4, Vite 8, Lucide React, PapaParse
- **Alternative BI Host:** Streamlit (`app/streamlit_app.py`)

---

## 10. Installation & Execution Instructions

### A. Windows PowerShell Setup & Run

1. **Clone or Download Repository:**
   ```powershell
   git clone <repo-url>
   cd customer-churn-analysis
   ```

2. **Create Python Virtual Environment (Optional but Recommended):**
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. **Install Python Dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```

4. **Run Data Cleaning & Database Initialization:**
   ```powershell
   python src/data_cleaning.py
   ```

5. **Execute SQL Business Questions:**
   ```powershell
   python src/sql_analysis.py
   ```

6. **Launch Streamlit Dashboard (Python Mode):**
   ```powershell
   streamlit run app/streamlit_app.py
   ```

7. **Launch Production Web Application (Node.js / React Mode):**
   ```powershell
   npm install
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

### B. Running in Visual Studio Code (VS Code)

Follow these steps for a smooth development and demonstration workflow in Visual Studio Code:

#### 1. Open Project in VS Code
- Launch **VS Code**.
- Click **File > Open Folder...** (or press `Ctrl + K, Ctrl + O`).
- Navigate to the `customer-churn-analysis` directory and click **Select Folder**.
- Alternatively, from your terminal:
  ```bash
  code .
  ```

#### 2. Recommended VS Code Extensions
Install the following extensions from the VS Code Marketplace (`Ctrl + Shift + X`):
- **Python** (`ms-python.python`): Rich support for code navigation, linting, debugging, and interpreter switching.
- **Jupyter** (`ms-toolsai.jupyter`): To run and demonstrate `notebooks/exploratory_analysis.ipynb` cell-by-cell inside VS Code.
- **SQLite Viewer** (`qwtel.sqlite-viewer`): To browse `database/telco_churn.db` tables visually without leaving the editor.

#### 3. Select Python Interpreter
1. Press `Ctrl + Shift + P` (or `Cmd + Shift + P` on macOS) to open the Command Palette.
2. Type and select: **Python: Select Interpreter**.
3. Choose your active virtual environment (`venv`) or your global Python 3.10+ installation.

#### 4. Open Integrated Terminal
- Press ``Ctrl + ` `` (Backtick) or go to **Terminal > New Terminal** in the top menu bar.

#### 5. Install Dependencies inside VS Code Terminal
In the integrated terminal, run:
```bash
# Windows PowerShell
pip install -r requirements.txt

# Or if you also wish to run the React web frontend:
npm install
```

#### 6. Run the Data Pipeline & SQL Investigations in VS Code
Run each Python module directly from the terminal or using the **Run Python File** button in the top-right corner of the editor:
```bash
# Step 1: Clean raw data and generate SQLite database
python src/data_cleaning.py

# Step 2: Run descriptive statistics and hypothesis tests
python src/descriptive_statistics.py

# Step 3: Run the 10 SQL business queries against SQLite
python src/sql_analysis.py

# Step 4: Print strategic business recommendations
python src/business_insights.py
```

#### 7. Launch the Dashboards from VS Code

- **Option 1: Streamlit Dashboard (Python Mode)**
  ```bash
  streamlit run app/streamlit_app.py
  ```
  VS Code will display a notification: *"Your application running on port 8501 is available."* Click **Open in Browser** or visit `http://localhost:8501`.

- **Option 2: High-Performance React BI Platform (Node.js Mode)**
  ```bash
  npm run dev
  ```
  Open your browser at `http://localhost:3000` to interact with the full 9-page dark navy analytics platform, live SQL console, and dynamic filters.

#### 8. Running the Jupyter Notebook in VS Code
- In the Explorer sidebar, open `notebooks/exploratory_analysis.ipynb`.
- In the top right of the notebook view, select your Python Kernel.
- Click **Run All** (or `Shift + Enter` on individual cells) to execute data cleaning, visualizations, and SQL queries interactively.

---

## 11. Conclusion

This project successfully proves that customer churn in telecommunications is heavily governed by **contract commitment**, **billing channel mechanics**, and **service bundle completeness**. By transitioning month-to-month subscribers into annual contracts, incentivizing automated payment methods, and bundling technical support into fiber optic tiers, telecom businesses can systematically lower baseline churn from 26.5% to below 18%, preserving over **$1.35 Million in annual recurring revenue**.
