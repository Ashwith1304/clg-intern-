export interface CustomerRecord {
  customerID: string;
  gender: 'Female' | 'Male' | string;
  SeniorCitizen: number;
  Partner: 'Yes' | 'No' | string;
  Dependents: 'Yes' | 'No' | string;
  tenure: number;
  PhoneService: 'Yes' | 'No' | string;
  MultipleLines: 'No phone service' | 'No' | 'Yes' | string;
  InternetService: 'DSL' | 'Fiber optic' | 'No' | string;
  OnlineSecurity: 'No internet service' | 'No' | 'Yes' | string;
  OnlineBackup: 'No internet service' | 'No' | 'Yes' | string;
  DeviceProtection: 'No internet service' | 'No' | 'Yes' | string;
  TechSupport: 'No internet service' | 'No' | 'Yes' | string;
  StreamingTV: 'No internet service' | 'No' | 'Yes' | string;
  StreamingMovies: 'No internet service' | 'No' | 'Yes' | string;
  Contract: 'Month-to-month' | 'One year' | 'Two year' | string;
  PaperlessBilling: 'Yes' | 'No' | string;
  PaymentMethod:
    | 'Electronic check'
    | 'Mailed check'
    | 'Bank transfer (automatic)'
    | 'Credit card (automatic)'
    | string;
  MonthlyCharges: number;
  TotalCharges: number;
  Churn: 'Yes' | 'No' | string;
}

export interface FilterState {
  gender: string;
  contract: string;
  internetService: string;
  paymentMethod: string;
  tenureMin: number;
  tenureMax: number;
  churnFilter: string; // 'All' | 'Yes' | 'No'
  searchTerm: string;
}

export interface KPISummary {
  totalCustomers: number;
  activeCustomers: number;
  churnedCustomers: number;
  churnRate: number; // percentage, e.g. 26.54
  avgMonthlyCharges: number;
  totalMonthlyRevenue: number;
  totalLifetimeValue: number;
  avgTenure: number;
}

export interface OutlierStats {
  feature: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  iqr: number;
  lowerBound: number;
  upperBound: number;
  outlierCount: number;
  outlierPercentage: number;
}

export interface DescriptiveStats {
  feature: string;
  count: number;
  mean: number;
  median: number;
  mode: number | string;
  stdDev: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  iqr: number;
}

export interface ChiSquareResult {
  variable: string;
  contingencyTable: {
    categories: string[];
    observed: { [category: string]: { Yes: number; No: number; total: number } };
    expected: { [category: string]: { Yes: number; No: number } };
  };
  chiSquareStat: number;
  degreesOfFreedom: number;
  pValue: number;
  isSignificant: boolean;
  interpretation: string;
}

export interface WelchTTestResult {
  variable: string;
  churnedGroup: { count: number; mean: number; variance: number; std: number };
  activeGroup: { count: number; mean: number; variance: number; std: number };
  tStatistic: number;
  degreesOfFreedom: number;
  pValue: number;
  isSignificant: boolean;
  conclusion: string;
  businessInterpretation: string;
}

export interface SqlQueryItem {
  id: number;
  question: string;
  query: string;
  interpretation: string;
}

export type PageId =
  | 'overview'
  | 'explorer'
  | 'quality'
  | 'eda'
  | 'statistics'
  | 'sql'
  | 'segmentation'
  | 'recommendations'
  | 'about';
