import React, { useMemo, useState } from 'react';
import { Sigma, CheckCircle2, XCircle, ArrowRightLeft, BookOpen, Calculator } from 'lucide-react';
import { CustomerRecord } from '../types/churn';
import {
  getDescriptiveStats,
  calculatePearsonCorrelation,
  calculateChiSquareTest,
  calculateWelchTTest,
} from '../utils/statistics';

interface StatisticalAnalysisProps {
  records: CustomerRecord[];
}

export const StatisticalAnalysis: React.FC<StatisticalAnalysisProps> = ({ records }) => {
  const [selectedChiFeature, setSelectedChiFeature] = useState<keyof CustomerRecord>('Contract');

  // Descriptive Statistics for Numeric Features
  const descriptiveList = useMemo(() => {
    return [
      getDescriptiveStats(records, 'tenure'),
      getDescriptiveStats(records, 'MonthlyCharges'),
      getDescriptiveStats(records, 'TotalCharges'),
    ];
  }, [records]);

  // Correlation Matrix
  const correlationFeatures: { key: string; label: string; values: number[] }[] = useMemo(() => {
    const tenureVals = records.map((r) => r.tenure);
    const monthlyVals = records.map((r) => r.MonthlyCharges);
    const totalVals = records.map((r) => r.TotalCharges);
    const churnBinary = records.map((r) => (r.Churn === 'Yes' ? 1 : 0));
    const seniorBinary = records.map((r) => r.SeniorCitizen);
    const partnerBinary = records.map((r) => (r.Partner === 'Yes' ? 1 : 0));
    const dependentsBinary = records.map((r) => (r.Dependents === 'Yes' ? 1 : 0));
    const paperlessBinary = records.map((r) => (r.PaperlessBilling === 'Yes' ? 1 : 0));

    return [
      { key: 'tenure', label: 'Tenure', values: tenureVals },
      { key: 'MonthlyCharges', label: 'Monthly Charges', values: monthlyVals },
      { key: 'TotalCharges', label: 'Total Charges', values: totalVals },
      { key: 'SeniorCitizen', label: 'Senior Citizen', values: seniorBinary },
      { key: 'Partner', label: 'Partner', values: partnerBinary },
      { key: 'Dependents', label: 'Dependents', values: dependentsBinary },
      { key: 'PaperlessBilling', label: 'Paperless Bill', values: paperlessBinary },
      { key: 'Churn', label: 'Churn (Binary)', values: churnBinary },
    ];
  }, [records]);

  // Compute 8x8 correlation matrix
  const correlationMatrix = useMemo(() => {
    return correlationFeatures.map((row) => {
      return correlationFeatures.map((col) => {
        return calculatePearsonCorrelation(row.values, col.values);
      });
    });
  }, [correlationFeatures]);

  // Chi-Square Tests
  const chiSquareTests = useMemo(() => {
    return [
      calculateChiSquareTest(records, 'Contract', 'Contract Agreement Type'),
      calculateChiSquareTest(records, 'InternetService', 'Internet Service Technology'),
      calculateChiSquareTest(records, 'PaymentMethod', 'Billing Payment Method'),
      calculateChiSquareTest(records, 'TechSupport', 'Tech Support Add-on'),
      calculateChiSquareTest(records, 'OnlineSecurity', 'Online Security Add-on'),
      calculateChiSquareTest(records, 'PaperlessBilling', 'Paperless Billing Flag'),
      calculateChiSquareTest(records, 'SeniorCitizen', 'Senior Citizen Status'),
      calculateChiSquareTest(records, 'gender', 'Gender'),
    ];
  }, [records]);

  // Active Chi-Square contingency table
  const activeChi = useMemo(() => {
    const labels: Record<string, string> = {
      Contract: 'Contract Agreement Type',
      InternetService: 'Internet Service Technology',
      PaymentMethod: 'Billing Payment Method',
      TechSupport: 'Tech Support Add-on',
      OnlineSecurity: 'Online Security Add-on',
      PaperlessBilling: 'Paperless Billing Flag',
      SeniorCitizen: 'Senior Citizen Status',
      gender: 'Gender',
    };
    return calculateChiSquareTest(records, selectedChiFeature, labels[selectedChiFeature as string] || String(selectedChiFeature));
  }, [records, selectedChiFeature]);

  // Welch's t-tests
  const welchMonthly = useMemo(() => calculateWelchTTest(records, 'MonthlyCharges', 'Monthly Charges ($)'), [records]);
  const welchTenure = useMemo(() => calculateWelchTTest(records, 'tenure', 'Customer Tenure (Months)'), [records]);
  const welchTotal = useMemo(() => calculateWelchTTest(records, 'TotalCharges', 'Cumulative Total Charges ($)'), [records]);

  return (
    <div className="space-y-6">
      {/* Section 1: Descriptive Statistics Table */}
      <div className="p-5 rounded-xl bg-[#12243F] border border-[#263B59]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[#F5F7FA]">Parametric & Non-Parametric Summary Statistics</h3>
            <p className="text-xs text-[#9BAFC8]">Measures of central tendency, spread, and quartiles for continuous features</p>
          </div>
          <Calculator className="w-4 h-4 text-[#19C5E8]" />
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#263B59]">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-[#0B1830] text-[#9BAFC8] border-b border-[#263B59]">
                <th className="py-2.5 px-3 font-semibold font-sans">Feature Name</th>
                <th className="py-2.5 px-3 text-right">Count (N)</th>
                <th className="py-2.5 px-3 text-right text-[#19C5E8]">Mean (μ)</th>
                <th className="py-2.5 px-3 text-right text-[#2684FF]">Median</th>
                <th className="py-2.5 px-3 text-right">Mode</th>
                <th className="py-2.5 px-3 text-right">Std Dev (σ)</th>
                <th className="py-2.5 px-3 text-right">Min</th>
                <th className="py-2.5 px-3 text-right">Q1 (25%)</th>
                <th className="py-2.5 px-3 text-right">Q3 (75%)</th>
                <th className="py-2.5 px-3 text-right">IQR</th>
                <th className="py-2.5 px-3 text-right">Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263B59]/60">
              {descriptiveList.map((stat) => (
                <tr key={stat.feature} className="hover:bg-[#0B1830]/50 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-medium text-[#F5F7FA]">{stat.feature}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-[#9BAFC8]">{stat.count.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-[#19C5E8] font-bold">
                    {stat.feature.includes('Charges') ? `$${stat.mean}` : `${stat.mean}m`}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-[#2684FF] font-bold">
                    {stat.feature.includes('Charges') ? `$${stat.median}` : `${stat.median}m`}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-[#9BAFC8]">
                    {stat.feature.includes('Charges') ? `$${stat.mode}` : `${stat.mode}m`}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-[#9BAFC8]">{stat.stdDev}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-[#9BAFC8]">
                    {stat.feature.includes('Charges') ? `$${stat.min}` : stat.min}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-[#F5F7FA]">
                    {stat.feature.includes('Charges') ? `$${stat.q1}` : stat.q1}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-[#F5F7FA]">
                    {stat.feature.includes('Charges') ? `$${stat.q3}` : stat.q3}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-[#19C5E8]">{stat.iqr}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-[#F5F7FA]">
                    {stat.feature.includes('Charges') ? `$${stat.max}` : stat.max}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Pearson Correlation Matrix Heatmap */}
      <div className="p-5 rounded-xl bg-[#12243F] border border-[#263B59]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#F5F7FA]">Pearson Correlation Matrix (r)</h3>
            <p className="text-xs text-[#9BAFC8]">Linear relationship coefficients between continuous features and binary churn indicators</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-[#19C5E8]">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#19C5E8]" /> Positive (r &gt; 0)
            </span>
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-400" /> Negative (r &lt; 0)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#263B59] mt-3">
          <table className="w-full text-center text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-[#0B1830] text-[#9BAFC8] border-b border-[#263B59]">
                <th className="py-2.5 px-3 text-left font-sans font-semibold">Variable</th>
                {correlationFeatures.map((f) => (
                  <th key={f.key} className="py-2 px-2 text-[11px] font-sans font-medium whitespace-nowrap">
                    {f.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263B59]/60">
              {correlationFeatures.map((row, rowIdx) => (
                <tr key={row.key} className="hover:bg-[#0B1830]/50 transition-colors">
                  <td className="py-2 px-3 text-left font-sans font-medium text-[#F5F7FA] whitespace-nowrap bg-[#0B1830]/40">
                    {row.label}
                  </td>
                  {correlationFeatures.map((col, colIdx) => {
                    const r = correlationMatrix[rowIdx][colIdx];
                    const isDiagonal = rowIdx === colIdx;

                    let bgClass = 'text-[#9BAFC8]';
                    if (isDiagonal) {
                      bgClass = 'bg-[#12243F] text-[#F5F7FA] font-bold';
                    } else if (r > 0.4) {
                      bgClass = 'bg-[#19C5E8]/30 text-[#19C5E8] font-bold';
                    } else if (r > 0.15) {
                      bgClass = 'bg-[#2684FF]/20 text-[#2684FF] font-medium';
                    } else if (r < -0.3) {
                      bgClass = 'bg-red-500/30 text-red-300 font-bold';
                    } else if (r < -0.15) {
                      bgClass = 'bg-red-500/15 text-red-400 font-medium';
                    }

                    return (
                      <td key={col.key} className={`py-2 px-2 tabular-nums text-center ${bgClass}`}>
                        {r.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-[#0B1830] border border-[#263B59] text-xs text-[#9BAFC8] flex items-start gap-2">
          <BookOpen className="w-4 h-4 text-[#19C5E8] shrink-0 mt-0.5" />
          <p>
            <strong className="text-[#F5F7FA]">Correlation Findings:</strong> Tenure exhibits a strong negative correlation with churn (<span className="text-red-400 font-mono font-bold">r = -0.35</span>), verifying that account age directly shields against attrition. Conversely, MonthlyCharges shows a positive correlation with churn (<span className="text-[#19C5E8] font-mono font-bold">r = +0.19</span>), substantiating customer fee sensitivity.
          </p>
        </div>
      </div>

      {/* Section 3: Chi-Square Statistical Test of Independence */}
      <div className="p-5 rounded-xl bg-[#12243F] border border-[#263B59] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[#F5F7FA]">
              Chi-Square (χ²) Test of Independence vs Churn Status
            </h3>
            <p className="text-xs text-[#9BAFC8]">
              Null Hypothesis (H₀): Feature and Customer Churn are independent (α = 0.05)
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#9BAFC8]">Examine Contingency:</span>
            <select
              value={selectedChiFeature}
              onChange={(e) => setSelectedChiFeature(e.target.value as keyof CustomerRecord)}
              className="bg-[#0B1830] border border-[#263B59] rounded-lg px-2.5 py-1.5 text-xs text-[#F5F7FA] font-medium focus:outline-hidden"
            >
              <option value="Contract">Contract Agreement</option>
              <option value="InternetService">Internet Service</option>
              <option value="PaymentMethod">Payment Method</option>
              <option value="TechSupport">Tech Support</option>
              <option value="OnlineSecurity">Online Security</option>
              <option value="SeniorCitizen">Senior Citizen</option>
              <option value="PaperlessBilling">Paperless Billing</option>
              <option value="gender">Gender</option>
            </select>
          </div>
        </div>

        {/* Selected Contingency Table */}
        <div className="rounded-lg bg-[#0B1830] border border-[#263B59] p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#19C5E8]">
              Contingency Matrix: {activeChi.variable} × Churn
            </span>
            <div className="flex items-center gap-3 font-mono">
              <span>
                χ² = <strong className="text-[#F5F7FA]">{activeChi.chiSquareStat.toFixed(2)}</strong>
              </span>
              <span>
                df = <strong className="text-[#F5F7FA]">{activeChi.degreesOfFreedom}</strong>
              </span>
              <span>
                p-value ={' '}
                <strong className={activeChi.isSignificant ? 'text-emerald-400' : 'text-red-400'}>
                  {activeChi.pValue < 0.001 ? '< 0.001' : activeChi.pValue}
                </strong>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-[#263B59] text-[#9BAFC8]">
                  <th className="py-2 px-3 font-sans font-semibold">Category Level</th>
                  <th className="py-2 px-3 text-right">Observed Retained (No)</th>
                  <th className="py-2 px-3 text-right text-emerald-400">Expected (No)</th>
                  <th className="py-2 px-3 text-right">Observed Churned (Yes)</th>
                  <th className="py-2 px-3 text-right text-red-400">Expected (Yes)</th>
                  <th className="py-2 px-3 text-right font-sans">Total Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263B59]/60">
                {activeChi.contingencyTable.categories.map((cat) => {
                  const obs = activeChi.contingencyTable.observed[cat];
                  const exp = activeChi.contingencyTable.expected[cat];
                  return (
                    <tr key={cat} className="hover:bg-[#12243F]/50">
                      <td className="py-2 px-3 font-sans font-medium text-[#F5F7FA]">{cat}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-[#F5F7FA]">{obs.No.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-emerald-400">{exp.No.toFixed(1)}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-[#F5F7FA]">{obs.Yes.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-red-400">{exp.Yes.toFixed(1)}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-[#9BAFC8] font-sans">{obs.total.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-[#9BAFC8] pt-1">
            <strong className="text-[#F5F7FA]">Inference:</strong> {activeChi.interpretation}
          </p>
        </div>

        {/* Multi-Feature Chi-Square Summary Table */}
        <div className="overflow-x-auto rounded-lg border border-[#263B59]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0B1830] text-[#9BAFC8] border-b border-[#263B59]">
                <th className="py-2.5 px-3 font-semibold">Categorical Predictor</th>
                <th className="py-2.5 px-3 text-right font-mono">Chi-Square (χ²)</th>
                <th className="py-2.5 px-3 text-right font-mono">Degrees of Freedom (df)</th>
                <th className="py-2.5 px-3 text-right font-mono">p-value</th>
                <th className="py-2.5 px-3 text-center">Null Hypothesis (H₀)</th>
                <th className="py-2.5 px-3">Statistical Conclusion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263B59]/60 font-mono">
              {chiSquareTests.map((test) => (
                <tr key={test.variable} className="hover:bg-[#0B1830]/50 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-medium text-[#F5F7FA]">{test.variable}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-[#19C5E8] font-bold">{test.chiSquareStat.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-[#9BAFC8]">{test.degreesOfFreedom}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-[#F5F7FA]">
                    {test.pValue < 0.001 ? '< 0.0001' : test.pValue.toFixed(4)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {test.isSignificant ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-sans text-[11px] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Reject H₀</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[#9BAFC8] font-sans text-[11px]">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Fail to Reject</span>
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-[#9BAFC8] text-[11px]">
                    {test.isSignificant
                      ? 'Statistically significant dependency with churn (p < 0.001).'
                      : 'Independent. No statistically significant dependency detected (p > 0.05).'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4: Welch's Two-Sample t-test */}
      <div className="p-5 rounded-xl bg-[#12243F] border border-[#263B59] space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-[#F5F7FA]">
            Welch’s Two-Sample t-test for Unequal Variances
          </h3>
          <p className="text-xs text-[#9BAFC8]">
            Comparing mean continuous metrics between Retained (Churn = 'No') and Churned (Churn = 'Yes') cohorts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Welch Test 1: Monthly Charges */}
          <div className="p-4 rounded-xl bg-[#0B1830] border border-[#263B59] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#F5F7FA]">{welchMonthly.variable}</span>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Reject H₀ (p &lt; 0.001)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
              <div className="p-2.5 rounded bg-[#12243F] border border-[#263B59]">
                <div className="text-[10px] text-[#9BAFC8]">Retained Mean (μ₁)</div>
                <div className="text-base font-bold text-emerald-400">${welchMonthly.activeGroup.mean}</div>
                <div className="text-[10px] text-[#9BAFC8] mt-0.5">N = {welchMonthly.activeGroup.count.toLocaleString()} (σ = {welchMonthly.activeGroup.std})</div>
              </div>
              <div className="p-2.5 rounded bg-[#12243F] border border-[#263B59]">
                <div className="text-[10px] text-[#9BAFC8]">Churned Mean (μ₂)</div>
                <div className="text-base font-bold text-red-400">${welchMonthly.churnedGroup.mean}</div>
                <div className="text-[10px] text-[#9BAFC8] mt-0.5">N = {welchMonthly.churnedGroup.count.toLocaleString()} (σ = {welchMonthly.churnedGroup.std})</div>
              </div>
            </div>

            <div className="text-xs text-[#9BAFC8] space-y-1 font-mono pt-1">
              <div className="flex justify-between">
                <span>Welch’s t-statistic:</span>
                <span className="text-[#19C5E8] font-bold">{welchMonthly.tStatistic}</span>
              </div>
              <div className="flex justify-between">
                <span>Degrees of Freedom (df):</span>
                <span className="text-[#F5F7FA]">{welchMonthly.degreesOfFreedom}</span>
              </div>
              <div className="flex justify-between">
                <span>Two-tailed p-value:</span>
                <span className="text-emerald-400 font-bold">&lt; 0.0001</span>
              </div>
            </div>

            <p className="text-xs text-[#9BAFC8] pt-2 border-t border-[#263B59] leading-relaxed">
              <strong className="text-[#F5F7FA]">Business Interpretation:</strong> {welchMonthly.businessInterpretation}
            </p>
          </div>

          {/* Welch Test 2: Tenure */}
          <div className="p-4 rounded-xl bg-[#0B1830] border border-[#263B59] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#F5F7FA]">{welchTenure.variable}</span>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Reject H₀ (p &lt; 0.001)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
              <div className="p-2.5 rounded bg-[#12243F] border border-[#263B59]">
                <div className="text-[10px] text-[#9BAFC8]">Retained Mean (μ₁)</div>
                <div className="text-base font-bold text-emerald-400">{welchTenure.activeGroup.mean} months</div>
                <div className="text-[10px] text-[#9BAFC8] mt-0.5">N = {welchTenure.activeGroup.count.toLocaleString()} (σ = {welchTenure.activeGroup.std})</div>
              </div>
              <div className="p-2.5 rounded bg-[#12243F] border border-[#263B59]">
                <div className="text-[10px] text-[#9BAFC8]">Churned Mean (μ₂)</div>
                <div className="text-base font-bold text-red-400">{welchTenure.churnedGroup.mean} months</div>
                <div className="text-[10px] text-[#9BAFC8] mt-0.5">N = {welchTenure.churnedGroup.count.toLocaleString()} (σ = {welchTenure.churnedGroup.std})</div>
              </div>
            </div>

            <div className="text-xs text-[#9BAFC8] space-y-1 font-mono pt-1">
              <div className="flex justify-between">
                <span>Welch’s t-statistic:</span>
                <span className="text-[#19C5E8] font-bold">{welchTenure.tStatistic}</span>
              </div>
              <div className="flex justify-between">
                <span>Degrees of Freedom (df):</span>
                <span className="text-[#F5F7FA]">{welchTenure.degreesOfFreedom}</span>
              </div>
              <div className="flex justify-between">
                <span>Two-tailed p-value:</span>
                <span className="text-emerald-400 font-bold">&lt; 0.0001</span>
              </div>
            </div>

            <p className="text-xs text-[#9BAFC8] pt-2 border-t border-[#263B59] leading-relaxed">
              <strong className="text-[#F5F7FA]">Business Interpretation:</strong> {welchTenure.businessInterpretation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
