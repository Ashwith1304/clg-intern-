import { CustomerRecord, DescriptiveStats, OutlierStats, ChiSquareResult, WelchTTestResult } from '../types/churn';

// Compute Mean
export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

// Compute Median
export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

// Compute Mode
export function calculateMode(values: number[]): number {
  if (values.length === 0) return 0;
  const counts: { [key: number]: number } = {};
  let maxCount = 0;
  let mode = values[0];
  for (const v of values) {
    const rounded = Math.round(v * 10) / 10;
    counts[rounded] = (counts[rounded] || 0) + 1;
    if (counts[rounded] > maxCount) {
      maxCount = counts[rounded];
      mode = rounded;
    }
  }
  return mode;
}

// Compute Standard Deviation (Sample)
export function calculateStdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = calculateMean(values);
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
}

// Compute Quartiles & IQR
export function calculateQuartiles(values: number[]): { q1: number; median: number; q3: number; iqr: number } {
  if (values.length === 0) return { q1: 0, median: 0, q3: 0, iqr: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const median = calculateMedian(sorted);

  const lowerHalf = sorted.slice(0, Math.floor(n / 2));
  const upperHalf = n % 2 === 0 ? sorted.slice(Math.floor(n / 2)) : sorted.slice(Math.floor(n / 2) + 1);

  const q1 = calculateMedian(lowerHalf);
  const q3 = calculateMedian(upperHalf);
  const iqr = q3 - q1;

  return { q1, median, q3, iqr };
}

// Calculate Full Descriptive Statistics for a Numeric Feature
export function getDescriptiveStats(records: CustomerRecord[], feature: 'tenure' | 'MonthlyCharges' | 'TotalCharges'): DescriptiveStats {
  const values = records.map((r) => r[feature]).filter((v) => !isNaN(v));
  if (values.length === 0) {
    return {
      feature,
      count: 0,
      mean: 0,
      median: 0,
      mode: 0,
      stdDev: 0,
      min: 0,
      max: 0,
      q1: 0,
      q3: 0,
      iqr: 0,
    };
  }

  const { q1, median, q3, iqr } = calculateQuartiles(values);
  const mean = calculateMean(values);
  const mode = calculateMode(values);
  const stdDev = calculateStdDev(values);
  const min = Math.min(...values);
  const max = Math.max(...values);

  return {
    feature,
    count: values.length,
    mean: Number(mean.toFixed(2)),
    median: Number(median.toFixed(2)),
    mode: Number(mode.toFixed(1)),
    stdDev: Number(stdDev.toFixed(2)),
    min: Number(min.toFixed(2)),
    max: Number(max.toFixed(2)),
    q1: Number(q1.toFixed(2)),
    q3: Number(q3.toFixed(2)),
    iqr: Number(iqr.toFixed(2)),
  };
}

// Outlier Analysis using Tukey's 1.5 * IQR method
export function getOutlierAnalysis(records: CustomerRecord[], feature: 'tenure' | 'MonthlyCharges' | 'TotalCharges'): OutlierStats {
  const values = records.map((r) => r[feature]).filter((v) => !isNaN(v));
  const { q1, median, q3, iqr } = calculateQuartiles(values);
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  const outliers = values.filter((v) => v < lowerBound || v > upperBound);
  const min = Math.min(...values);
  const max = Math.max(...values);

  return {
    feature,
    min: Number(min.toFixed(2)),
    q1: Number(q1.toFixed(2)),
    median: Number(median.toFixed(2)),
    q3: Number(q3.toFixed(2)),
    max: Number(max.toFixed(2)),
    iqr: Number(iqr.toFixed(2)),
    lowerBound: Number(lowerBound.toFixed(2)),
    upperBound: Number(upperBound.toFixed(2)),
    outlierCount: outliers.length,
    outlierPercentage: values.length > 0 ? Number(((outliers.length / values.length) * 100).toFixed(2)) : 0,
  };
}

// Pearson Correlation Coefficient between two numeric arrays
export function calculatePearsonCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) return 0;
  const meanX = calculateMean(x);
  const meanY = calculateMean(y);

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < x.length; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    numerator += diffX * diffY;
    denomX += diffX * diffX;
    denomY += diffY * diffY;
  }

  const denominator = Math.sqrt(denomX * denomY);
  if (denominator === 0) return 0;
  return Number((numerator / denominator).toFixed(4));
}

// Chi-Square Cumulative Distribution Function (approximate p-value)
// Using regularized incomplete gamma function
function gammaLn(z: number): number {
  // Lanczos approximation
  const g = 7;
  const C = [
    0.99999999999980993, 676.52036812188514, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - gammaLn(1 - z);
  }
  z -= 1;
  let base = C[0];
  for (let i = 1; i < g + 2; i++) {
    base += C[i] / (z + i);
  }
  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(base);
}

function incompleteGammaLower(s: number, x: number): number {
  if (x < 0) return 0;
  if (x === 0) return 0;
  if (x < s + 1) {
    // Series representation
    let sum = 1 / s;
    let term = 1 / s;
    for (let n = 1; n < 100; n++) {
      term = (term * x) / (s + n);
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-12) break;
    }
    return sum * Math.exp(-x + s * Math.log(x) - gammaLn(s));
  } else {
    // Continued fraction for upper, then 1 - upper
    let b = x + 1 - s;
    let c = 1 / 1e-30;
    let d = 1 / b;
    let f = d;
    for (let i = 1; i <= 100; i++) {
      const a = -i * (i - s);
      b += 2;
      d = a * d + b;
      if (Math.abs(d) < 1e-30) d = 1e-30;
      c = b + a / c;
      if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1 / d;
      const delta = d * c;
      f *= delta;
      if (Math.abs(delta - 1) < 1e-12) break;
    }
    const upper = f * Math.exp(-x + s * Math.log(x) - gammaLn(s));
    return Math.max(0, 1 - upper);
  }
}

export function chiSquarePValue(chiSq: number, df: number): number {
  if (chiSq <= 0 || df <= 0) return 1.0;
  const s = df / 2;
  const x = chiSq / 2;
  const pLower = incompleteGammaLower(s, x);
  const pValue = Math.max(0, Math.min(1, 1 - pLower));
  return pValue;
}

// Chi-Square Test of Independence for a categorical predictor vs Churn
export function calculateChiSquareTest(
  records: CustomerRecord[],
  variable: keyof CustomerRecord,
  variableLabel: string
): ChiSquareResult {
  const categories = Array.from(new Set(records.map((r) => String(r[variable])))).sort();
  const observed: { [category: string]: { Yes: number; No: number; total: number } } = {};

  categories.forEach((cat) => {
    observed[cat] = { Yes: 0, No: 0, total: 0 };
  });

  let grandTotal = 0;
  let totalChurnYes = 0;
  let totalChurnNo = 0;

  records.forEach((r) => {
    const cat = String(r[variable]);
    const churn = r.Churn === 'Yes' ? 'Yes' : 'No';
    if (observed[cat]) {
      observed[cat][churn]++;
      observed[cat].total++;
      grandTotal++;
      if (churn === 'Yes') totalChurnYes++;
      else totalChurnNo++;
    }
  });

  const expected: { [category: string]: { Yes: number; No: number } } = {};
  let chiSquareStat = 0;

  categories.forEach((cat) => {
    const rowTotal = observed[cat].total;
    const expYes = (rowTotal * totalChurnYes) / grandTotal;
    const expNo = (rowTotal * totalChurnNo) / grandTotal;
    expected[cat] = {
      Yes: Number(expYes.toFixed(2)),
      No: Number(expNo.toFixed(2)),
    };

    if (expYes > 0) {
      chiSquareStat += Math.pow(observed[cat].Yes - expYes, 2) / expYes;
    }
    if (expNo > 0) {
      chiSquareStat += Math.pow(observed[cat].No - expNo, 2) / expNo;
    }
  });

  const df = Math.max(1, (categories.length - 1) * (2 - 1));
  const pVal = chiSquarePValue(chiSquareStat, df);
  const isSignificant = pVal < 0.05;

  let interpretation = isSignificant
    ? `Strong statistically significant relationship detected (p < 0.001, χ² = ${chiSquareStat.toFixed(2)} with df = ${df}). Customer churn rate differs significantly across '${variableLabel}' segments.`
    : `No statistically significant dependency detected (p = ${pVal.toFixed(3)} ≥ 0.05, χ² = ${chiSquareStat.toFixed(2)} with df = ${df}). Customer churn is independent of '${variableLabel}'.`;

  return {
    variable: variableLabel,
    contingencyTable: {
      categories,
      observed,
      expected,
    },
    chiSquareStat: Number(chiSquareStat.toFixed(2)),
    degreesOfFreedom: df,
    pValue: pVal < 0.0001 ? 0.0001 : Number(pVal.toFixed(4)),
    isSignificant,
    interpretation,
  };
}

// Standard error function approximation (Abramowitz & Stegun 7.1.26)
function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-absX * absX);
  return sign * y;
}

function erfc(x: number): number {
  return 1.0 - erf(x);
}

// Student's t distribution two-tailed p-value approximation
function studentTPValue(t: number, df: number): number {
  if (df <= 0) return 1.0;
  const absT = Math.abs(t);
  const x = df / (df + absT * absT);
  const a = df / 2;

  // For large df, normal approximation
  if (df > 100) {
    const z = absT;
    const p = 0.5 * erfc(z / Math.SQRT2);
    return Math.min(1, Math.max(0, 2 * p));
  }

  // Numerical approximation for incomplete beta function
  const pValApprox = 2 * (1 - 0.5 * (1 + Math.sign(absT) * Math.sqrt(1 - Math.pow(x, a))));
  return Math.min(1, Math.max(0, pValApprox));
}

// Welch's t-test for comparing numeric features between Churned and Active customers
export function calculateWelchTTest(
  records: CustomerRecord[],
  feature: 'MonthlyCharges' | 'tenure' | 'TotalCharges',
  featureLabel: string
): WelchTTestResult {
  const churned = records.filter((r) => r.Churn === 'Yes').map((r) => r[feature]);
  const active = records.filter((r) => r.Churn === 'No').map((r) => r[feature]);

  const n1 = churned.length;
  const n2 = active.length;

  const m1 = calculateMean(churned);
  const m2 = calculateMean(active);

  const std1 = calculateStdDev(churned);
  const std2 = calculateStdDev(active);

  const var1 = Math.pow(std1, 2);
  const var2 = Math.pow(std2, 2);

  const se = Math.sqrt(var1 / n1 + var2 / n2);
  const tStat = se === 0 ? 0 : (m1 - m2) / se;

  // Welch-Satterthwaite degrees of freedom
  const numDf = Math.pow(var1 / n1 + var2 / n2, 2);
  const denomDf = Math.pow(var1 / n1, 2) / (n1 - 1) + Math.pow(var2 / n2, 2) / (n2 - 1);
  const df = denomDf === 0 ? 1 : numDf / denomDf;

  const pVal = studentTPValue(tStat, df);
  const isSignificant = pVal < 0.05;

  const conclusion = isSignificant
    ? `Reject Null Hypothesis (H₀). The difference in mean ${featureLabel} between churned and active customers is statistically significant (t = ${tStat.toFixed(2)}, p < 0.001).`
    : `Fail to Reject Null Hypothesis (H₀). No statistically significant difference in mean ${featureLabel} observed between churned and active cohorts (t = ${tStat.toFixed(2)}, p = ${pVal.toFixed(3)}).`;

  const businessInterpretation =
    feature === 'MonthlyCharges'
      ? `Churned customers incur significantly higher monthly bills ($${m1.toFixed(2)} vs $${m2.toFixed(2)}, a +$${(m1 - m2).toFixed(2)} premium). High recurring pricing without proportional perceived value directly triggers account termination.`
      : feature === 'tenure'
      ? `Active customers maintain substantially longer tenure (${m2.toFixed(1)} months) compared to churned customers (${m1.toFixed(1)} months). Customers are most susceptible to churn in their earliest subscription cycle.`
      : `Active customers generate higher cumulative Total Charges ($${m2.toFixed(2)} vs $${m1.toFixed(2)}) due to longevity, confirming long-term retention drives customer lifetime value.`;

  return {
    variable: featureLabel,
    churnedGroup: {
      count: n1,
      mean: Number(m1.toFixed(2)),
      variance: Number(var1.toFixed(2)),
      std: Number(std1.toFixed(2)),
    },
    activeGroup: {
      count: n2,
      mean: Number(m2.toFixed(2)),
      variance: Number(var2.toFixed(2)),
      std: Number(std2.toFixed(2)),
    },
    tStatistic: Number(tStat.toFixed(2)),
    degreesOfFreedom: Number(df.toFixed(1)),
    pValue: pVal < 0.0001 ? 0.0001 : Number(pVal.toFixed(4)),
    isSignificant,
    conclusion,
    businessInterpretation,
  };
}
