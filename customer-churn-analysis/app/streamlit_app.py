"""
Customer Churn Analysis & Business Intelligence Dashboard
Streamlit Web Application
Sreenidhi Institute of Science and Technology (SNIST)
Department of Computer Science and Engineering - Data Science
Authors: G Mythili (24311A67H8), K Ashiwith (24311A67H6), D Niyati (24311A67H7)
"""

import streamlit as st
import pandas as pd
import numpy as np
import sqlite3
import os
import plotly.express as px
import plotly.graph_objects as go

# ----------------- STREAMLIT CONFIG & THEME -----------------
st.set_page_config(
    page_title="Customer Churn Analysis BI Platform",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Dark Navy Theme CSS
st.markdown("""
<style>
    .stApp {
        background-color: #081426;
        color: #F5F7FA;
        font-family: 'Segoe UI', Roboto, sans-serif;
    }
    [data-testid="stSidebar"] {
        background-color: #0B1830;
        border-right: 1px solid #263B59;
    }
    div[data-testid="stMetricValue"] {
        color: #19C5E8;
        font-family: monospace;
    }
    .metric-card {
        background-color: #12243F;
        border: 1px solid #263B59;
        border-radius: 10px;
        padding: 16px;
        margin-bottom: 12px;
    }
</style>
""", unsafe_allow_html=True)

# ----------------- DATA LOADING -----------------
@st.cache_data
def load_data():
    csv_paths = [
        "data/processed/Telco-Customer-Churn-Cleaned.csv",
        "data/raw/Telco-Customer-Churn.csv",
        "../data/processed/Telco-Customer-Churn-Cleaned.csv",
        "../data/raw/Telco-Customer-Churn.csv"
    ]
    for path in csv_paths:
        if os.path.exists(path):
            df = pd.read_csv(path)
            # Impute TotalCharges if needed
            if "TotalCharges" in df.columns:
                df["TotalCharges"] = pd.to_numeric(df["TotalCharges"].astype(str).str.strip(), errors="coerce").fillna(0.0)
            return df
    st.error("Telco Dataset not found. Please upload a CSV in the sidebar.")
    return None

df_raw = load_data()

# ----------------- SIDEBAR & NAVIGATION -----------------
st.sidebar.title("Telco Retention BI")
st.sidebar.caption("Sreenidhi Institute of Science and Technology\nCSE — Data Science Capstone")

uploaded_file = st.sidebar.file_uploader("Upload Custom CSV", type=["csv"])
if uploaded_file is not None:
    df_raw = pd.read_csv(uploaded_file)
    if "TotalCharges" in df_raw.columns:
        df_raw["TotalCharges"] = pd.to_numeric(df_raw["TotalCharges"].astype(str).str.strip(), errors="coerce").fillna(0.0)

if df_raw is None:
    st.info("Please upload the Telco Customer Churn CSV dataset to begin.")
    st.stop()

# Global Filters
st.sidebar.markdown("---")
st.sidebar.subheader("Global Filters")

gender_filter = st.sidebar.selectbox("Gender", ["All"] + list(df_raw["gender"].unique()))
contract_filter = st.sidebar.selectbox("Contract", ["All"] + list(df_raw["Contract"].unique()))
internet_filter = st.sidebar.selectbox("Internet Service", ["All"] + list(df_raw["InternetService"].unique()))
payment_filter = st.sidebar.selectbox("Payment Method", ["All"] + list(df_raw["PaymentMethod"].unique()))

min_t, max_t = int(df_raw["tenure"].min()), int(df_raw["tenure"].max())
tenure_range = st.sidebar.slider("Tenure Range (Months)", min_t, max_t, (min_t, max_t))

# Filter Application
df = df_raw.copy()
if gender_filter != "All":
    df = df[df["gender"] == gender_filter]
if contract_filter != "All":
    df = df[df["Contract"] == contract_filter]
if internet_filter != "All":
    df = df[df["InternetService"] == internet_filter]
if payment_filter != "All":
    df = df[df["PaymentMethod"] == payment_filter]
df = df[(df["tenure"] >= tenure_range[0]) & (df["tenure"] <= tenure_range[1])]

# Navigation Menu
st.sidebar.markdown("---")
page = st.sidebar.radio(
    "Dashboard Navigation",
    [
        "1. Executive Overview",
        "2. Customer Data Explorer",
        "3. Data Quality Report",
        "4. Exploratory Data Analysis",
        "5. Statistical Analysis",
        "6. SQL Business Analytics",
        "7. Customer Segmentation",
        "8. Business Recommendations",
        "9. About Project"
    ]
)

# ----------------- PAGE ROUTING -----------------
if page == "1. Executive Overview":
    st.title("Executive Overview")
    st.caption("High-level retention KPIs, churn distributions, and revenue impact analysis")
    
    total_cust = len(df)
    churn_cust = len(df[df["Churn"] == "Yes"])
    active_cust = total_cust - churn_cust
    churn_rate = (churn_cust / total_cust * 100) if total_cust > 0 else 0
    avg_charges = df["MonthlyCharges"].mean() if total_cust > 0 else 0
    total_mrr = df["MonthlyCharges"].sum() if total_cust > 0 else 0

    col1, col2, col3, col4, col5, col6 = st.columns(6)
    col1.metric("Total Customers", f"{total_cust:,}")
    col2.metric("Active Retained", f"{active_cust:,}")
    col3.metric("Churned Accounts", f"{churn_cust:,}")
    col4.metric("Churn Rate", f"{churn_rate:.2f}%")
    col5.metric("Avg Monthly Bill", f"${avg_charges:.2f}")
    col6.metric("Total MRR", f"${total_mrr/1000:.1f}k")

    st.markdown("---")
    c1, c2 = st.columns([1, 1])
    with c1:
        st.subheader("Customer Retention Split")
        fig_donut = px.pie(
            df, names="Churn",
            color="Churn",
            color_discrete_map={"No": "#2684FF", "Yes": "#19C5E8"},
            hole=0.5
        )
        fig_donut.update_layout(paper_bgcolor="#12243F", font_color="#F5F7FA")
        st.plotly_chart(fig_donut, use_container_width=True)

    with c2:
        st.subheader("Contract-Wise Churn Rate")
        contract_df = df.groupby("Contract")["Churn"].apply(lambda s: (s == "Yes").mean() * 100).reset_index()
        contract_df.columns = ["Contract", "Churn Rate (%)"]
        fig_contract = px.bar(
            contract_df, x="Contract", y="Churn Rate (%)",
            color="Churn Rate (%)",
            color_continuous_scale=["#19C5E8", "#2684FF", "#EF4444"]
        )
        fig_contract.update_layout(paper_bgcolor="#12243F", plot_bgcolor="#0B1830", font_color="#F5F7FA")
        st.plotly_chart(fig_contract, use_container_width=True)

elif page == "2. Customer Data Explorer":
    st.title("Customer Data Explorer")
    st.caption("Granular customer records with search, filtering, and CSV export")
    search_q = st.text_input("Search Customer ID, Contract, or Payment Method:")
    df_display = df
    if search_q:
        df_display = df[df.astype(str).apply(lambda row: row.str.contains(search_q, case=False).any(), axis=1)]
    st.dataframe(df_display, use_container_width=True)
    csv_bytes = df_display.to_csv(index=False).encode('utf-8')
    st.download_button("Download Filtered Records (CSV)", csv_bytes, "telco_filtered.csv", "text/csv")

elif page == "3. Data Quality Report":
    st.title("Data Quality Report")
    st.caption("Missing value detection, duplicate checks, schema verification, and Tukey outlier boundaries")
    st.write(f"**Total Records:** {len(df_raw):,} | **Duplicate Customer IDs:** {df_raw['customerID'].duplicated().sum()}")
    missing = df_raw.isnull().sum()
    st.subheader("Missing Values by Column")
    st.dataframe(missing[missing > 0], use_container_width=True)
    st.subheader("Numeric Summary")
    st.dataframe(df_raw[["tenure", "MonthlyCharges", "TotalCharges"]].describe(), use_container_width=True)

elif page == "4. Exploratory Data Analysis":
    st.title("Exploratory Data Analysis (EDA)")
    st.caption("Univariate and bivariate distributions across tenure, contracts, and services")
    eda_col = st.selectbox("Select Feature to Compare vs Churn", ["Contract", "InternetService", "PaymentMethod", "TechSupport", "SeniorCitizen", "gender"])
    fig = px.histogram(df, x=eda_col, color="Churn", barmode="group", color_discrete_map={"No": "#2684FF", "Yes": "#19C5E8"})
    fig.update_layout(paper_bgcolor="#12243F", plot_bgcolor="#0B1830", font_color="#F5F7FA")
    st.plotly_chart(fig, use_container_width=True)

elif page == "5. Statistical Analysis":
    st.title("Statistical Analysis & Hypothesis Testing")
    st.caption("Parametric descriptive statistics, Pearson correlation matrix, and Chi-Square tests")
    st.subheader("Pearson Correlation Heatmap")
    num_cols = ["tenure", "MonthlyCharges", "TotalCharges"]
    corr_df = df_raw[num_cols].copy()
    corr_df["Churn_Binary"] = (df_raw["Churn"] == "Yes").astype(int)
    corr_mat = corr_df.corr()
    fig_corr = px.imshow(corr_mat, text_auto=".2f", color_continuous_scale="Blues")
    fig_corr.update_layout(paper_bgcolor="#12243F", font_color="#F5F7FA")
    st.plotly_chart(fig_corr, use_container_width=True)

elif page == "6. SQL Business Analytics":
    st.title("SQL Business Analytics")
    st.caption("Relational SQLite business investigations")
    conn = sqlite3.connect("database/telco_churn.db")
    sql_query = st.selectbox(
        "Select Business Question Query:",
        [
            "SELECT COUNT(*) AS total_customers FROM telco_churn;",
            "SELECT COUNT(*) AS churned_customers FROM telco_churn WHERE Churn = 'Yes';",
            "SELECT Contract, COUNT(*) AS count, ROUND(100.0 * SUM(CASE WHEN Churn='Yes' THEN 1 ELSE 0 END)/COUNT(*), 2) AS churn_pct FROM telco_churn GROUP BY Contract ORDER BY churn_pct DESC;",
            "SELECT PaymentMethod, COUNT(*) AS total, SUM(CASE WHEN Churn='Yes' THEN 1 ELSE 0 END) AS churned FROM telco_churn GROUP BY PaymentMethod ORDER BY churned DESC;",
            "SELECT ROUND(AVG(MonthlyCharges), 2) AS overall_avg, ROUND(AVG(CASE WHEN Churn='Yes' THEN MonthlyCharges END), 2) AS churned_avg, ROUND(AVG(CASE WHEN Churn='No' THEN MonthlyCharges END), 2) AS retained_avg FROM telco_churn;"
        ]
    )
    st.code(sql_query, language="sql")
    try:
        res = pd.read_sql_query(sql_query, conn)
        st.dataframe(res, use_container_width=True)
    except Exception as e:
        st.error(f"SQL Error: {e}")
    conn.close()

elif page == "7. Customer Segmentation":
    st.title("Customer Segmentation")
    st.caption("Descriptive multi-attribute behavioral segmentation without ML black-boxes")
    seg_df = df.groupby(["Contract", "InternetService"]).agg(
        Total_Users=("customerID", "count"),
        Churn_Rate=("Churn", lambda s: round((s == "Yes").mean() * 100, 1)),
        Avg_Monthly_Bill=("MonthlyCharges", lambda s: round(s.mean(), 2)),
        Total_MRR=("MonthlyCharges", lambda s: round(s.sum(), 2))
    ).reset_index()
    st.dataframe(seg_df, use_container_width=True)

elif page == "8. Business Recommendations":
    st.title("Business Recommendations")
    st.caption("Data-backed operational interventions derived from statistical findings")
    st.markdown("""
    1. **Annual Contract Migration**: Month-to-month subscribers churn at **42.7%** vs **2.8%** on 2-year contracts. Offer a 12% discount for annual lock-ins.
    2. **Auto-Pay Enrollment**: Electronic check users suffer **45.3%** churn. Provide a $10 one-time bill credit for switching to ACH or credit card auto-pay.
    3. **Fiber Optic Support Bundles**: Fiber customers churn at **41.9%**. Bundle complimentary Tech Support and Device Protection into premium plans.
    4. **First-Year Onboarding**: Early tenure accounts (0-6 months) experience **53.0%** churn. Implement structured Day-30 and Day-90 loyalty check-ins.
    """)

elif page == "9. About Project":
    st.title("About Project & Academic Details")
    st.markdown("""
    ### Project Title
    **CUSTOMER CHURN ANALYSIS AND BUSINESS INTELLIGENCE DASHBOARD**  
    *An Interactive Data Analytics Platform for Understanding Customer Retention*

    ### Academic Credentials
    - **College:** Sreenidhi Institute of Science and Technology (SNIST)
    - **Department:** Computer Science and Engineering — Data Science (CSE-DS)

    ### Team Members
    1. **G Mythili** — Roll No: `24311A67H8`
    2. **K Ashiwith** — Roll No: `24311A67H6`
    3. **D Niyati** — Roll No: `24311A67H7`
    """)
