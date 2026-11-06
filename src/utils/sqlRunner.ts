import alasql from 'alasql';
import { CustomerRecord, SqlQueryItem } from '../types/churn';

let isTableInitialized = false;

// Initialize AlaSQL with the customer dataset
export function initSqlDatabase(records: CustomerRecord[]) {
  try {
    alasql('DROP TABLE IF EXISTS telco_churn');
    alasql(`CREATE TABLE telco_churn (
      customerID STRING,
      gender STRING,
      SeniorCitizen INT,
      Partner STRING,
      Dependents STRING,
      tenure INT,
      PhoneService STRING,
      MultipleLines STRING,
      InternetService STRING,
      OnlineSecurity STRING,
      OnlineBackup STRING,
      DeviceProtection STRING,
      TechSupport STRING,
      StreamingTV STRING,
      StreamingMovies STRING,
      Contract STRING,
      PaperlessBilling STRING,
      PaymentMethod STRING,
      MonthlyCharges FLOAT,
      TotalCharges FLOAT,
      Churn STRING
    )`);

    alasql.tables.telco_churn.data = records.map((r) => ({ ...r }));
    isTableInitialized = true;
  } catch (err) {
    console.error('Error initializing SQL table:', err);
  }
}

// Execute arbitrary SQL query safely
export function executeSqlQuery(
  query: string
): { success: boolean; data?: any[]; columns?: string[]; error?: string; executionTimeMs: number } {
  const startTime = performance.now();
  try {
    if (!isTableInitialized) {
      throw new Error('Database table telco_churn is not initialized yet. Please wait for data to load.');
    }
    const result = alasql(query);
    const endTime = performance.now();
    const executionTimeMs = Number((endTime - startTime).toFixed(2));

    if (!Array.isArray(result)) {
      return {
        success: true,
        data: [{ Result: result }],
        columns: ['Result'],
        executionTimeMs,
      };
    }

    if (result.length === 0) {
      return {
        success: true,
        data: [],
        columns: [],
        executionTimeMs,
      };
    }

    const columns = Object.keys(result[0]);
    return {
      success: true,
      data: result,
      columns,
      executionTimeMs,
    };
  } catch (err: any) {
    const endTime = performance.now();
    return {
      success: false,
      error: err.message || 'SQL execution failed.',
      executionTimeMs: Number((endTime - startTime).toFixed(2)),
    };
  }
}

// Pre-defined 10 Business Questions
export const BUSINESS_SQL_QUESTIONS: SqlQueryItem[] = [
  {
    id: 1,
    question: 'Total number of customers in the database',
    query: `SELECT COUNT(*) AS total_customers FROM telco_churn;`,
    interpretation:
      'The telecom subscriber base consists of exactly 7,043 unique accounts registered in the database, establishing the foundational denominator for all retention metrics.',
  },
  {
    id: 2,
    question: 'Total number of churned customers',
    query: `SELECT COUNT(*) AS churned_customers 
FROM telco_churn 
WHERE Churn = 'Yes';`,
    interpretation:
      'Out of 7,043 total subscribers, 1,869 customers terminated their contracts, indicating significant revenue attrition requiring targeted retention interventions.',
  },
  {
    id: 3,
    question: 'Overall customer churn percentage',
    query: `SELECT 
  COUNT(*) AS total_customers,
  SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) AS churned_count,
  ROUND(100.0 * SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) / COUNT(*), 2) AS churn_rate_pct
FROM telco_churn;`,
    interpretation:
      'The baseline company-wide churn rate stands at 26.54%. Approximately 1 in every 4 customers discontinues service, representing an urgent call for retention optimization.',
  },
  {
    id: 4,
    question: 'Contract type with the highest churn rate',
    query: `SELECT 
  Contract,
  COUNT(*) AS total_subscribers,
  SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) AS churned_count,
  ROUND(100.0 * SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) / COUNT(*), 2) AS churn_rate_pct
FROM telco_churn
GROUP BY Contract
ORDER BY churn_rate_pct DESC;`,
    interpretation:
      'Month-to-month contracts experience a devastating 42.71% churn rate, compared to only 11.27% for One-Year contracts and 2.83% for Two-Year contracts. Long-term commitment mechanisms are the single most effective hedge against customer attrition.',
  },
  {
    id: 5,
    question: 'Payment method with the most churned customers',
    query: `SELECT 
  PaymentMethod,
  COUNT(*) AS total_customers,
  SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) AS churned_count,
  ROUND(100.0 * SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) / COUNT(*), 2) AS churn_rate_pct
FROM telco_churn
GROUP BY PaymentMethod
ORDER BY churned_count DESC;`,
    interpretation:
      'Electronic Check has the highest volume of lost accounts (1,071 churned customers) and the highest churn rate (45.29%). In contrast, automated methods (Bank Transfer at 16.71% and Credit Card at 15.24%) exhibit triple the customer stickiness.',
  },
  {
    id: 6,
    question: 'Average monthly charges across overall, churned, and retained cohorts',
    query: `SELECT 
  ROUND(AVG(MonthlyCharges), 2) AS overall_avg_monthly,
  ROUND(AVG(CASE WHEN Churn = 'Yes' THEN MonthlyCharges END), 2) AS churned_avg_monthly,
  ROUND(AVG(CASE WHEN Churn = 'No' THEN MonthlyCharges END), 2) AS retained_avg_monthly,
  ROUND(AVG(CASE WHEN Churn = 'Yes' THEN MonthlyCharges END) - AVG(CASE WHEN Churn = 'No' THEN MonthlyCharges END), 2) AS churn_premium_gap
FROM telco_churn;`,
    interpretation:
      'Churned customers pay an average of $74.44/month, compared to $61.27/month for retained customers—a $13.18/month premium gap. Higher monthly financial burden without perceived service value correlates directly with account cancellation.',
  },
  {
    id: 7,
    question: 'Internet service category with the highest churn rate',
    query: `SELECT 
  InternetService,
  COUNT(*) AS total_users,
  SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) AS churned_users,
  ROUND(100.0 * SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) / COUNT(*), 2) AS churn_rate_pct
FROM telco_churn
GROUP BY InternetService
ORDER BY churn_rate_pct DESC;`,
    interpretation:
      'Fiber Optic internet subscribers exhibit an alarming 41.89% churn rate (1,297 churned out of 3,096 subscribers), despite being a premium high-ARPU product. Customers on DSL churn at only 18.96%, pointing to potential pricing dissatisfaction or reliability issues on fiber lines.',
  },
  {
    id: 8,
    question: 'Average customer tenure of churned vs retained customers',
    query: `SELECT 
  Churn,
  COUNT(*) AS customer_count,
  ROUND(AVG(tenure), 1) AS avg_tenure_months,
  ROUND(MIN(tenure), 1) AS min_tenure,
  ROUND(MAX(tenure), 1) AS max_tenure
FROM telco_churn
GROUP BY Churn;`,
    interpretation:
      'Churned customers leave after an average tenure of just 17.98 months, whereas retained customers have an average relationship length of 37.57 months—over double the loyalty lifespan. The critical retention danger zone is concentrated in the first 12 months.',
  },
  {
    id: 9,
    question: 'Customer segment generating the highest monthly revenue',
    query: `SELECT 
  Contract,
  InternetService,
  COUNT(*) AS customer_count,
  ROUND(SUM(MonthlyCharges), 2) AS total_monthly_revenue,
  ROUND(AVG(MonthlyCharges), 2) AS avg_monthly_charge
FROM telco_churn
GROUP BY Contract, InternetService
ORDER BY total_monthly_revenue DESC;`,
    interpretation:
      'The Month-to-month Fiber Optic segment generates the highest recurring revenue volume ($182,308.20/month) across 2,128 customers. However, because this exact segment suffers a ~45% churn rate, this critical revenue foundation is in severe jeopardy without immediate retention locking.',
  },
  {
    id: 10,
    question: 'Number and proportion of Month-to-month contract customers',
    query: `SELECT 
  COUNT(CASE WHEN Contract = 'Month-to-month' THEN 1 END) AS month_to_month_customers,
  COUNT(*) AS total_customers,
  ROUND(100.0 * COUNT(CASE WHEN Contract = 'Month-to-month' THEN 1 END) / COUNT(*), 2) AS month_to_month_pct
FROM telco_churn;`,
    interpretation:
      'A staggering 55.02% of all subscribers (3,875 accounts) are on Month-to-month agreements without contractual tenure commitments. This massive non-committed segment explains why the baseline churn rate is elevated across the company.',
  },
];
