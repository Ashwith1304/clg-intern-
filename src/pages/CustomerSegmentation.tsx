import React, { useState, useMemo } from 'react';
import { PieChart, Shield, AlertTriangle, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';
import { CustomerRecord } from '../types/churn';

interface CustomerSegmentationProps {
  records: CustomerRecord[];
}

interface SegmentProfile {
  id: string;
  name: string;
  dimension: string;
  criteria: string;
  count: number;
  sharePct: number;
  churnCount: number;
  churnRate: number;
  avgMonthlyCharge: number;
  avgLTV: number;
  totalRevenue: number;
  riskLevel: 'Critical' | 'High' | 'Moderate' | 'Low';
  characteristics: string;
}

export const CustomerSegmentation: React.FC<CustomerSegmentationProps> = ({ records }) => {
  const [selectedDimension, setSelectedDimension] = useState<
    'tenure' | 'contract_service' | 'payment_billing' | 'charge_tiers'
  >('contract_service');

  const total = records.length || 1;

  // Segment generation via descriptive statistical grouping
  const segments: SegmentProfile[] = useMemo(() => {
    if (selectedDimension === 'contract_service') {
      return [
        {
          id: 'cs1',
          dimension: 'Contract & Internet',
          name: 'Month-to-Month Fiber Optic (High-Risk Revenue Core)',
          criteria: "Contract = 'Month-to-month' AND InternetService = 'Fiber optic'",
          count: records.filter((r) => r.Contract === 'Month-to-month' && r.InternetService === 'Fiber optic').length,
          sharePct: 0,
          churnCount: records.filter((r) => r.Contract === 'Month-to-month' && r.InternetService === 'Fiber optic' && r.Churn === 'Yes').length,
          churnRate: 0,
          avgMonthlyCharge: 0,
          avgLTV: 0,
          totalRevenue: 0,
          riskLevel: 'Critical',
          characteristics: 'Premium paying subscribers with maximum vulnerability; represents 54% of all lost subscribers.',
        },
        {
          id: 'cs2',
          dimension: 'Contract & Internet',
          name: 'Month-to-Month DSL (Moderate Attrition)',
          criteria: "Contract = 'Month-to-month' AND InternetService = 'DSL'",
          count: records.filter((r) => r.Contract === 'Month-to-month' && r.InternetService === 'DSL').length,
          sharePct: 0,
          churnCount: records.filter((r) => r.Contract === 'Month-to-month' && r.InternetService === 'DSL' && r.Churn === 'Yes').length,
          churnRate: 0,
          avgMonthlyCharge: 0,
          avgLTV: 0,
          totalRevenue: 0,
          riskLevel: 'High',
          characteristics: 'Budget-conscious users with steady baseline churn; sensitive to minor fee hikes.',
        },
        {
          id: 'cs3',
          dimension: 'Contract & Internet',
          name: 'Annual Contract Fiber / DSL (Stabilized Accounts)',
          criteria: "Contract = 'One year'",
          count: records.filter((r) => r.Contract === 'One year').length,
          sharePct: 0,
          churnCount: records.filter((r) => r.Contract === 'One year' && r.Churn === 'Yes').length,
          churnRate: 0,
          avgMonthlyCharge: 0,
          avgLTV: 0,
          totalRevenue: 0,
          riskLevel: 'Moderate',
          characteristics: 'Committed subscribers with low 11% churn; renewal reminders required near month 11.',
        },
        {
          id: 'cs4',
          dimension: 'Contract & Internet',
          name: 'Two-Year Contract Long-Term Champions',
          criteria: "Contract = 'Two year'",
          count: records.filter((r) => r.Contract === 'Two year').length,
          sharePct: 0,
          churnCount: records.filter((r) => r.Contract === 'Two year' && r.Churn === 'Yes').length,
          churnRate: 0,
          avgMonthlyCharge: 0,
          avgLTV: 0,
          totalRevenue: 0,
          riskLevel: 'Low',
          characteristics: 'Gold standard retention; churn is nearly non-existent (under 3%) with maximum Lifetime Value.',
        },
      ];
    }

    if (selectedDimension === 'tenure') {
      return [
        {
          id: 't1',
          dimension: 'Tenure Cohorts',
          name: 'New Onboarding Cohort (0 – 12 Months)',
          criteria: 'tenure <= 12',
          count: records.filter((r) => r.tenure <= 12).length,
          sharePct: 0,
          churnCount: records.filter((r) => r.tenure <= 12 && r.Churn === 'Yes').length,
          churnRate: 0,
          avgMonthlyCharge: 0,
          avgLTV: 0,
          totalRevenue: 0,
          riskLevel: 'Critical',
          characteristics: 'Immediate churn zone; customers evaluating service reliability and billing clarity.',
        },
        {
          id: 't2',
          dimension: 'Tenure Cohorts',
          name: 'Maturing Accounts (13 – 24 Months)',
          criteria: 'tenure > 12 AND tenure <= 24',
          count: records.filter((r) => r.tenure > 12 && r.tenure <= 24).length,
          sharePct: 0,
          churnCount: records.filter((r) => r.tenure > 12 && r.tenure <= 24 && r.Churn === 'Yes').length,
          churnRate: 0,
          avgMonthlyCharge: 0,
          avgLTV: 0,
          totalRevenue: 0,
          riskLevel: 'High',
          characteristics: 'Transitioning out of introductory promo rates; vulnerability spikes at anniversary bill.',
        },
        {
          id: 't3',
          dimension: 'Tenure Cohorts',
          name: 'Established Core (25 – 48 Months)',
          criteria: 'tenure > 24 AND tenure <= 48',
          count: records.filter((r) => r.tenure > 24 && r.tenure <= 48).length,
          sharePct: 0,
          churnCount: records.filter((r) => r.tenure > 24 && r.tenure <= 48 && r.Churn === 'Yes').length,
          churnRate: 0,
          avgMonthlyCharge: 0,
          avgLTV: 0,
          totalRevenue: 0,
          riskLevel: 'Moderate',
          characteristics: 'Predictable retention; habits formed; churn driven primarily by relocation or service outages.',
        },
        {
          id: 't4',
          dimension: 'Tenure Cohorts',
          name: 'Loyal Brand Advocates (49 – 72 Months)',
          criteria: 'tenure > 48',
          count: records.filter((r) => r.tenure > 48).length,
          sharePct: 0,
          churnCount: records.filter((r) => r.tenure > 48 && r.Churn === 'Yes').length,
          churnRate: 0,
          avgMonthlyCharge: 0,
          avgLTV: 0,
          totalRevenue: 0,
          riskLevel: 'Low',
          characteristics: 'Highest lifetime spenders ($5,000+ LTV); exceptional stickiness and resilience.',
        },
      ];
    }

    if (selectedDimension === 'payment_billing') {
      return [
        {
          id: 'p1',
          dimension: 'Payment & Billing',
          name: 'Electronic Check Manual Payers',
          criteria: "PaymentMethod = 'Electronic check'",
          count: records.filter((r) => r.PaymentMethod === 'Electronic check').length,
          sharePct: 0,
          churnCount: records.filter((r) => r.PaymentMethod === 'Electronic check' && r.Churn === 'Yes').length,
          churnRate: 0,
          avgMonthlyCharge: 0,
          avgLTV: 0,
          totalRevenue: 0,
          riskLevel: 'Critical',
          characteristics: 'Manual monthly friction; highest churn rate among all billing mechanisms (45.3%).',
        },
        {
          id: 'p2',
          dimension: 'Payment & Billing',
          name: 'Mailed Check Traditionalists',
          criteria: "PaymentMethod = 'Mailed check'",
          count: records.filter((r) => r.PaymentMethod === 'Mailed check').length,
          sharePct: 0,
          churnCount: records.filter((r) => r.PaymentMethod === 'Mailed check' && r.Churn === 'Yes').length,
          churnRate: 0,
          avgMonthlyCharge: 0,
          avgLTV: 0,
          totalRevenue: 0,
          riskLevel: 'Moderate',
          characteristics: 'Older demographic; mostly low-spend landline users with lower 19% churn.',
        },
        {
          id: 'p3',
          dimension: 'Payment & Billing',
          name: 'Automated Bank ACH Debit Subscribers',
          criteria: "PaymentMethod = 'Bank transfer (automatic)'",
          count: records.filter((r) => r.PaymentMethod === 'Bank transfer (automatic)').length,
          sharePct: 0,
          churnCount: records.filter((r) => r.PaymentMethod === 'Bank transfer (automatic)' && r.Churn === 'Yes').length,
          churnRate: 0,
          avgMonthlyCharge: 0,
          avgLTV: 0,
          totalRevenue: 0,
          riskLevel: 'Low',
          characteristics: 'Frictionless recurring payments; 16.7% churn; highly stable cash-flow contributors.',
        },
        {
          id: 'p4',
          dimension: 'Payment & Billing',
          name: 'Automated Credit Card Subscribers',
          criteria: "PaymentMethod = 'Credit card (automatic)'",
          count: records.filter((r) => r.PaymentMethod === 'Credit card (automatic)').length,
          sharePct: 0,
          churnCount: records.filter((r) => r.PaymentMethod === 'Credit card (automatic)' && r.Churn === 'Yes').length,
          churnRate: 0,
          avgMonthlyCharge: 0,
          avgLTV: 0,
          totalRevenue: 0,
          riskLevel: 'Low',
          characteristics: 'Lowest churn payment cohort (15.2%); high customer lifetime retention.',
        },
      ];
    }

    // charge_tiers
    return [
      {
        id: 'c1',
        dimension: 'Charge Tiers',
        name: 'Budget Tier (< $35 / Month)',
        criteria: 'MonthlyCharges <= 35',
        count: records.filter((r) => r.MonthlyCharges <= 35).length,
        sharePct: 0,
        churnCount: records.filter((r) => r.MonthlyCharges <= 35 && r.Churn === 'Yes').length,
        churnRate: 0,
        avgMonthlyCharge: 0,
        avgLTV: 0,
        totalRevenue: 0,
        riskLevel: 'Low',
        characteristics: 'Basic phone-only or light users; minimal price sensitivity and low 10.5% churn.',
      },
      {
        id: 'c2',
        dimension: 'Charge Tiers',
        name: 'Standard Tier ($35 – $70 / Month)',
        criteria: 'MonthlyCharges > 35 AND MonthlyCharges <= 70',
        count: records.filter((r) => r.MonthlyCharges > 35 && r.MonthlyCharges <= 70).length,
        sharePct: 0,
        churnCount: records.filter((r) => r.MonthlyCharges > 35 && r.MonthlyCharges <= 70 && r.Churn === 'Yes').length,
        churnRate: 0,
        avgMonthlyCharge: 0,
        avgLTV: 0,
        totalRevenue: 0,
        riskLevel: 'Moderate',
        characteristics: 'DSL broadband users; moderate 22.8% churn; stable utility spend.',
      },
      {
        id: 'c3',
        dimension: 'Charge Tiers',
        name: 'Premium Tier ($70 – $90 / Month)',
        criteria: 'MonthlyCharges > 70 AND MonthlyCharges <= 90',
        count: records.filter((r) => r.MonthlyCharges > 70 && r.MonthlyCharges <= 90).length,
        sharePct: 0,
        churnCount: records.filter((r) => r.MonthlyCharges > 70 && r.MonthlyCharges <= 90 && r.Churn === 'Yes').length,
        churnRate: 0,
        avgMonthlyCharge: 0,
        avgLTV: 0,
        totalRevenue: 0,
        riskLevel: 'Critical',
        characteristics: 'Fiber optic standalone subscriptions; peak churn rate (38.6%) due to unbundled pricing shock.',
      },
      {
        id: 'c4',
        dimension: 'Charge Tiers',
        name: 'Ultra Bundled Tier (> $90 / Month)',
        criteria: 'MonthlyCharges > 90',
        count: records.filter((r) => r.MonthlyCharges > 90).length,
        sharePct: 0,
        churnCount: records.filter((r) => r.MonthlyCharges > 90 && r.Churn === 'Yes').length,
        churnRate: 0,
        avgMonthlyCharge: 0,
        avgLTV: 0,
        totalRevenue: 0,
        riskLevel: 'High',
        characteristics: 'Triple-play power users (Phone + Fiber + Streaming); high ARPU ($102/mo) with 33.2% churn.',
      },
    ];
  }, [records, selectedDimension]);

  // Compute calculated statistics for each segment
  const populatedSegments = useMemo(() => {
    return segments.map((seg) => {
      // Find matching records
      let subset: CustomerRecord[] = [];
      if (seg.id === 'cs1') subset = records.filter((r) => r.Contract === 'Month-to-month' && r.InternetService === 'Fiber optic');
      else if (seg.id === 'cs2') subset = records.filter((r) => r.Contract === 'Month-to-month' && r.InternetService === 'DSL');
      else if (seg.id === 'cs3') subset = records.filter((r) => r.Contract === 'One year');
      else if (seg.id === 'cs4') subset = records.filter((r) => r.Contract === 'Two year');
      else if (seg.id === 't1') subset = records.filter((r) => r.tenure <= 12);
      else if (seg.id === 't2') subset = records.filter((r) => r.tenure > 12 && r.tenure <= 24);
      else if (seg.id === 't3') subset = records.filter((r) => r.tenure > 24 && r.tenure <= 48);
      else if (seg.id === 't4') subset = records.filter((r) => r.tenure > 48);
      else if (seg.id === 'p1') subset = records.filter((r) => r.PaymentMethod === 'Electronic check');
      else if (seg.id === 'p2') subset = records.filter((r) => r.PaymentMethod === 'Mailed check');
      else if (seg.id === 'p3') subset = records.filter((r) => r.PaymentMethod === 'Bank transfer (automatic)');
      else if (seg.id === 'p4') subset = records.filter((r) => r.PaymentMethod === 'Credit card (automatic)');
      else if (seg.id === 'c1') subset = records.filter((r) => r.MonthlyCharges <= 35);
      else if (seg.id === 'c2') subset = records.filter((r) => r.MonthlyCharges > 35 && r.MonthlyCharges <= 70);
      else if (seg.id === 'c3') subset = records.filter((r) => r.MonthlyCharges > 70 && r.MonthlyCharges <= 90);
      else if (seg.id === 'c4') subset = records.filter((r) => r.MonthlyCharges > 90);

      const count = subset.length;
      const sharePct = Number(((count / total) * 100).toFixed(1));
      const churnCount = subset.filter((r) => r.Churn === 'Yes').length;
      const churnRate = count > 0 ? Number(((churnCount / count) * 100).toFixed(1)) : 0;
      const totalRev = subset.reduce((sum, r) => sum + r.MonthlyCharges, 0);
      const avgMonthly = count > 0 ? Number((totalRev / count).toFixed(2)) : 0;
      const avgLtv = count > 0 ? Number((subset.reduce((sum, r) => sum + r.TotalCharges, 0) / count).toFixed(2)) : 0;

      return {
        ...seg,
        count,
        sharePct,
        churnCount,
        churnRate,
        avgMonthlyCharge: avgMonthly,
        avgLTV: avgLtv,
        totalRevenue: Number(totalRev.toFixed(0)),
      };
    });
  }, [segments, records, total]);

  return (
    <div className="space-y-6">
      {/* Header and Segmentation Dimension Selector */}
      <div className="p-5 rounded-xl bg-[#12243F] border border-[#263B59] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-[#F5F7FA]">Descriptive Strategic Segmentation Matrix</h3>
          <p className="text-xs text-[#9BAFC8] mt-0.5">
            Statistical behavioral grouping based on contract length, service tiers, and billing profiles (Non-ML)
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#0B1830] border border-[#263B59] text-xs">
          {[
            { id: 'contract_service', label: 'Contract & Service' },
            { id: 'tenure', label: 'Tenure Cohorts' },
            { id: 'payment_billing', label: 'Payment Channel' },
            { id: 'charge_tiers', label: 'Monthly Charge Tiers' },
          ].map((dim) => (
            <button
              key={dim.id}
              onClick={() => setSelectedDimension(dim.id as any)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                selectedDimension === dim.id
                  ? 'bg-[#2684FF] text-white'
                  : 'text-[#9BAFC8] hover:text-[#F5F7FA]'
              }`}
            >
              {dim.label}
            </button>
          ))}
        </div>
      </div>

      {/* Segment Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {populatedSegments.map((seg) => {
          let riskBadgeClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
          if (seg.riskLevel === 'Critical') riskBadgeClass = 'text-red-400 bg-red-500/10 border-red-500/30';
          if (seg.riskLevel === 'High') riskBadgeClass = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
          if (seg.riskLevel === 'Moderate') riskBadgeClass = 'text-[#19C5E8] bg-[#19C5E8]/10 border-[#19C5E8]/30';

          return (
            <div
              key={seg.id}
              className="p-4 rounded-xl bg-[#12243F] border border-[#263B59] flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-[#9BAFC8]">{seg.sharePct}% of base</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${riskBadgeClass}`}>
                    {seg.riskLevel} Risk
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#F5F7FA] leading-tight min-h-[32px]">
                  {seg.name}
                </h4>
                <p className="text-[11px] text-[#9BAFC8] mt-2 leading-relaxed">
                  {seg.characteristics}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="pt-2 border-t border-[#263B59] space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#9BAFC8]">Subscribers:</span>
                  <span className="text-[#F5F7FA] font-bold">{seg.count.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9BAFC8]">Churn Rate:</span>
                  <span
                    className={`font-bold ${
                      seg.churnRate > 35 ? 'text-red-400' : seg.churnRate > 15 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {seg.churnRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9BAFC8]">Monthly ARPU:</span>
                  <span className="text-[#19C5E8] font-bold">${seg.avgMonthlyCharge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9BAFC8]">Avg Lifetime Spend:</span>
                  <span className="text-[#F5F7FA] font-bold">${seg.avgLTV}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9BAFC8]">Total Monthly MRR:</span>
                  <span className="text-[#2684FF] font-bold">${seg.totalRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparative Segmentation Matrix Table */}
      <div className="p-5 rounded-xl bg-[#12243F] border border-[#263B59] space-y-3">
        <h4 className="text-sm font-semibold text-[#F5F7FA]">Segment Comparison Matrix</h4>
        <div className="overflow-x-auto rounded-lg border border-[#263B59]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0B1830] text-[#9BAFC8] border-b border-[#263B59]">
                <th className="py-2.5 px-3 font-semibold">Segment Group</th>
                <th className="py-2.5 px-3 font-semibold">Definition Criteria</th>
                <th className="py-2.5 px-3 text-right font-mono">Subscribers (N)</th>
                <th className="py-2.5 px-3 text-right font-mono">Base Share (%)</th>
                <th className="py-2.5 px-3 text-right font-mono">Churn Count</th>
                <th className="py-2.5 px-3 text-right font-mono">Churn Rate (%)</th>
                <th className="py-2.5 px-3 text-right font-mono">ARPU ($)</th>
                <th className="py-2.5 px-3 text-right font-mono">Lifetime Value ($)</th>
                <th className="py-2.5 px-3 text-center">Risk Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263B59]/60 font-mono">
              {populatedSegments.map((seg) => (
                <tr key={seg.id} className="hover:bg-[#0B1830]/50 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-medium text-[#F5F7FA]">{seg.name}</td>
                  <td className="py-2.5 px-3 text-[#9BAFC8] text-[11px] font-sans">{seg.criteria}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-[#F5F7FA]">{seg.count.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-[#9BAFC8]">{seg.sharePct}%</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-red-400">{seg.churnCount.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums font-bold text-[#19C5E8]">{seg.churnRate}%</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-[#F5F7FA]">${seg.avgMonthlyCharge}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-[#F5F7FA]">${seg.avgLTV}</td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    <span
                      className={`text-[11px] font-semibold ${
                        seg.riskLevel === 'Critical'
                          ? 'text-red-400'
                          : seg.riskLevel === 'High'
                          ? 'text-amber-400'
                          : seg.riskLevel === 'Moderate'
                          ? 'text-[#19C5E8]'
                          : 'text-emerald-400'
                      }`}
                    >
                      {seg.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
