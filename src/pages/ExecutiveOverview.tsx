import React, { useMemo } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Percent,
  DollarSign,
  TrendingDown,
  CreditCard,
  Calendar,
  AlertCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { CustomerRecord, KPISummary } from '../types/churn';

interface ExecutiveOverviewProps {
  records: CustomerRecord[];
  allRecords: CustomerRecord[];
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({ records, allRecords }) => {
  // Compute KPIs dynamically based on current filtered records
  const kpis: KPISummary = useMemo(() => {
    const total = records.length;
    if (total === 0) {
      return {
        totalCustomers: 0,
        activeCustomers: 0,
        churnedCustomers: 0,
        churnRate: 0,
        avgMonthlyCharges: 0,
        totalMonthlyRevenue: 0,
        totalLifetimeValue: 0,
        avgTenure: 0,
      };
    }

    const churned = records.filter((r) => r.Churn === 'Yes').length;
    const active = total - churned;
    const churnRate = Number(((churned / total) * 100).toFixed(2));
    const totalMonthly = records.reduce((sum, r) => sum + r.MonthlyCharges, 0);
    const avgMonthly = Number((totalMonthly / total).toFixed(2));
    const totalLTV = records.reduce((sum, r) => sum + r.TotalCharges, 0);
    const avgTenure = Number((records.reduce((sum, r) => sum + r.tenure, 0) / total).toFixed(1));

    return {
      totalCustomers: total,
      activeCustomers: active,
      churnedCustomers: churned,
      churnRate,
      avgMonthlyCharges: avgMonthly,
      totalMonthlyRevenue: totalMonthly,
      totalLifetimeValue: totalLTV,
      avgTenure,
    };
  }, [records]);

  // Contract Breakdown
  const contractData = useMemo(() => {
    const contracts = ['Month-to-month', 'One year', 'Two year'];
    return contracts.map((c) => {
      const subset = records.filter((r) => r.Contract === c);
      const churned = subset.filter((r) => r.Churn === 'Yes').length;
      const rate = subset.length > 0 ? (churned / subset.length) * 100 : 0;
      const revenue = subset.reduce((sum, r) => sum + r.MonthlyCharges, 0);
      return {
        contract: c,
        total: subset.length,
        churned,
        rate: Number(rate.toFixed(1)),
        revenue: Number(revenue.toFixed(0)),
      };
    });
  }, [records]);

  // Payment Method Breakdown
  const paymentData = useMemo(() => {
    const methods = [
      'Electronic check',
      'Mailed check',
      'Bank transfer (automatic)',
      'Credit card (automatic)',
    ];
    return methods.map((m) => {
      const subset = records.filter((r) => r.PaymentMethod === m);
      const churned = subset.filter((r) => r.Churn === 'Yes').length;
      const rate = subset.length > 0 ? (churned / subset.length) * 100 : 0;
      const shortName = m.replace(' (automatic)', '').replace('Electronic check', 'Electronic Check');
      return {
        method: shortName,
        fullName: m,
        total: subset.length,
        churned,
        rate: Number(rate.toFixed(1)),
      };
    });
  }, [records]);

  // Tenure Cohorts Breakdown (0-12m, 13-24m, 25-36m, 37-48m, 49-60m, 61-72m)
  const tenureCohorts = useMemo(() => {
    const bins = [
      { label: '0–12m', min: 0, max: 12 },
      { label: '13–24m', min: 13, max: 24 },
      { label: '25–36m', min: 25, max: 36 },
      { label: '37–48m', min: 37, max: 48 },
      { label: '49–60m', min: 49, max: 60 },
      { label: '61–72m', min: 61, max: 72 },
    ];

    return bins.map((bin) => {
      const subset = records.filter((r) => r.tenure >= bin.min && r.tenure <= bin.max);
      const churned = subset.filter((r) => r.Churn === 'Yes').length;
      const active = subset.length - churned;
      const rate = subset.length > 0 ? (churned / subset.length) * 100 : 0;
      return {
        label: bin.label,
        total: subset.length,
        churned,
        active,
        rate: Number(rate.toFixed(1)),
      };
    });
  }, [records]);

  const maxCohortTotal = Math.max(...tenureCohorts.map((c) => c.total), 1);
  const maxContractRevenue = Math.max(...contractData.map((c) => c.revenue), 1);

  return (
    <div className="space-y-6">
      {/* 6 Executive KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* KPI 1: Total Customers */}
        <div className="p-4 rounded-xl bg-[#12243F] border border-[#263B59] hover:border-[#2684FF]/50 transition-colors">
          <div className="flex items-center justify-between text-[#9BAFC8] text-xs">
            <span className="font-medium">Total Customers</span>
            <Users className="w-4 h-4 text-[#2684FF]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#F5F7FA] tabular-nums">
            {kpis.totalCustomers.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-[#9BAFC8]">
            {records.length === allRecords.length ? '100% full dataset' : `Filtered from ${allRecords.length.toLocaleString()}`}
          </div>
        </div>

        {/* KPI 2: Active Customers */}
        <div className="p-4 rounded-xl bg-[#12243F] border border-[#263B59] hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-[#9BAFC8] text-xs">
            <span className="font-medium">Active Retained</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {kpis.activeCustomers.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-[#9BAFC8] font-mono">
            {kpis.totalCustomers > 0
              ? `${((kpis.activeCustomers / kpis.totalCustomers) * 100).toFixed(1)}% loyalty share`
              : '0%'}
          </div>
        </div>

        {/* KPI 3: Churned Customers */}
        <div className="p-4 rounded-xl bg-[#12243F] border border-[#263B59] hover:border-red-500/40 transition-colors">
          <div className="flex items-center justify-between text-[#9BAFC8] text-xs">
            <span className="font-medium">Churned Customers</span>
            <UserX className="w-4 h-4 text-red-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-red-400 tabular-nums">
            {kpis.churnedCustomers.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-[#9BAFC8]">Subscribers lost</div>
        </div>

        {/* KPI 4: Churn Rate */}
        <div className="p-4 rounded-xl bg-[#12243F] border border-[#263B59] hover:border-[#19C5E8]/40 transition-colors">
          <div className="flex items-center justify-between text-[#9BAFC8] text-xs">
            <span className="font-medium">Churn Rate</span>
            <Percent className="w-4 h-4 text-[#19C5E8]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#19C5E8] tabular-nums">
            {kpis.churnRate.toFixed(2)}%
          </div>
          <div className="mt-1 text-[11px] text-[#9BAFC8]">Industry avg ~21%</div>
        </div>

        {/* KPI 5: Average Monthly Charges */}
        <div className="p-4 rounded-xl bg-[#12243F] border border-[#263B59] hover:border-[#2684FF]/50 transition-colors">
          <div className="flex items-center justify-between text-[#9BAFC8] text-xs">
            <span className="font-medium">Avg Monthly Charge</span>
            <DollarSign className="w-4 h-4 text-[#2684FF]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#F5F7FA] tabular-nums">
            ${kpis.avgMonthlyCharges.toFixed(2)}
          </div>
          <div className="mt-1 text-[11px] text-[#9BAFC8]">ARPU per account</div>
        </div>

        {/* KPI 6: Total Monthly Revenue */}
        <div className="p-4 rounded-xl bg-[#12243F] border border-[#263B59] hover:border-[#2684FF]/50 transition-colors">
          <div className="flex items-center justify-between text-[#9BAFC8] text-xs">
            <span className="font-medium">Monthly MRR</span>
            <TrendingDown className="w-4 h-4 text-[#19C5E8]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#F5F7FA] tabular-nums">
            ${(kpis.totalMonthlyRevenue / 1000).toFixed(1)}k
          </div>
          <div className="mt-1 text-[11px] text-[#9BAFC8]">Recurring monthly</div>
        </div>
      </div>

      {/* Row 2: Two Central Visualizations (Churn Distribution & Contract-Wise Churn Rate) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual 1: Churn Distribution Donut Breakdown */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-[#12243F] border border-[#263B59]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#F5F7FA]">Customer Retention vs Attrition Split</h3>
              <p className="text-xs text-[#9BAFC8]">Distribution of active vs cancelled accounts</p>
            </div>
            <span className="text-[11px] font-mono text-[#9BAFC8] bg-[#0B1830] px-2.5 py-1 rounded border border-[#263B59]">
              N = {kpis.totalCustomers.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
            {/* SVG Donut */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background ring */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0B1830" strokeWidth="14" />
                {/* Retained slice (Green/Blue) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#2684FF"
                  strokeWidth="14"
                  strokeDasharray={`${(100 - kpis.churnRate) * 2.513} 251.3`}
                  strokeDashoffset="0"
                />
                {/* Churned slice (Cyan/Red) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#19C5E8"
                  strokeWidth="14"
                  strokeDasharray={`${kpis.churnRate * 2.513} 251.3`}
                  strokeDashoffset={`-${(100 - kpis.churnRate) * 2.513}`}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold font-mono text-[#F5F7FA] tabular-nums">
                  {kpis.churnRate.toFixed(1)}%
                </span>
                <span className="text-[10px] text-[#9BAFC8] uppercase tracking-wider font-medium">
                  Churn Rate
                </span>
              </div>
            </div>

            {/* Legend & Breakdown stats */}
            <div className="space-y-3 w-full sm:w-auto">
              <div className="p-3 rounded-lg bg-[#0B1830] border border-[#263B59]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2684FF]" />
                  <span className="text-xs font-medium text-[#F5F7FA]">Active Retained</span>
                </div>
                <div className="flex items-baseline justify-between gap-4 font-mono">
                  <span className="text-sm font-bold text-[#F5F7FA]">
                    {kpis.activeCustomers.toLocaleString()}
                  </span>
                  <span className="text-xs text-emerald-400">
                    {kpis.totalCustomers > 0 ? (100 - kpis.churnRate).toFixed(1) : 0}%
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#0B1830] border border-[#263B59]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#19C5E8]" />
                  <span className="text-xs font-medium text-[#F5F7FA]">Churned Accounts</span>
                </div>
                <div className="flex items-baseline justify-between gap-4 font-mono">
                  <span className="text-sm font-bold text-[#19C5E8]">
                    {kpis.churnedCustomers.toLocaleString()}
                  </span>
                  <span className="text-xs text-red-400">{kpis.churnRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual 2: Contract-wise Churn Rate Comparison */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-[#12243F] border border-[#263B59]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#F5F7FA]">Contract Commitment vs Churn Propensity</h3>
              <p className="text-xs text-[#9BAFC8]">Comparison of attrition percentages across contract agreements</p>
            </div>
            <Calendar className="w-4 h-4 text-[#19C5E8]" />
          </div>

          <div className="space-y-4 pt-1">
            {contractData.map((item) => (
              <div key={item.contract} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#F5F7FA]">{item.contract}</span>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-[#9BAFC8]">
                      {item.churned.toLocaleString()} / {item.total.toLocaleString()} lost
                    </span>
                    <span
                      className={`font-bold ${
                        item.rate > 30 ? 'text-red-400' : item.rate > 10 ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {item.rate}%
                    </span>
                  </div>
                </div>

                {/* Progress track */}
                <div className="h-3 w-full rounded-full bg-[#0B1830] border border-[#263B59] overflow-hidden flex">
                  <div
                    style={{ width: `${Math.min(item.rate, 100)}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.rate > 30 ? 'bg-red-500' : item.rate > 10 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick takeaway note */}
          <div className="mt-5 p-3 rounded-lg bg-[#0B1830] border border-[#263B59] flex items-start gap-2.5 text-xs text-[#9BAFC8]">
            <AlertCircle className="w-4 h-4 text-[#19C5E8] shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#F5F7FA]">Primary Strategic Vulnerability:</strong> Month-to-month contracts
              suffer an attrition rate of <span className="text-red-400 font-mono font-semibold">42.7%</span>, compared to
              just <span className="text-emerald-400 font-mono font-semibold">2.8%</span> on two-year agreements—a{' '}
              <strong className="text-[#F5F7FA]">15x stability difference</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Row 3: Revenue Distribution, Tenure Cohorts, & Payment Method Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart 3: Monthly Revenue Distribution by Contract */}
        <div className="p-5 rounded-xl bg-[#12243F] border border-[#263B59]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#F5F7FA]">Monthly MRR by Contract</h3>
            <DollarSign className="w-4 h-4 text-[#2684FF]" />
          </div>
          <p className="text-xs text-[#9BAFC8] mb-4">Total recurring monthly billing contribution</p>

          <div className="space-y-3.5">
            {contractData.map((c) => {
              const widthPct = (c.revenue / maxContractRevenue) * 100;
              return (
                <div key={c.contract} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#F5F7FA]">{c.contract}</span>
                    <span className="font-mono text-[#19C5E8] font-semibold">${c.revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#0B1830] overflow-hidden">
                    <div
                      style={{ width: `${widthPct}%` }}
                      className="h-full bg-linear-to-r from-[#2684FF] to-[#19C5E8] rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 4: Customer Tenure Distribution & Churn Rate */}
        <div className="p-5 rounded-xl bg-[#12243F] border border-[#263B59]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#F5F7FA]">Tenure Cohorts (Months)</h3>
            <Clock className="w-4 h-4 text-[#19C5E8]" />
          </div>
          <p className="text-xs text-[#9BAFC8] mb-4">Subscribers and attrition by longevity bracket</p>

          <div className="space-y-2">
            {tenureCohorts.map((cohort) => {
              const barWidth = (cohort.total / maxCohortTotal) * 100;
              return (
                <div key={cohort.label} className="text-xs flex items-center justify-between gap-2">
                  <span className="w-14 shrink-0 text-[#9BAFC8] font-mono">{cohort.label}</span>
                  <div className="flex-1 h-3 rounded bg-[#0B1830] overflow-hidden flex">
                    <div
                      style={{ width: `${barWidth}%` }}
                      className="h-full bg-[#2684FF]/60 flex items-center justify-end pr-1 text-[9px] font-mono text-white"
                    />
                  </div>
                  <span className="w-12 text-right font-mono font-medium text-red-400 text-[11px]">
                    {cohort.rate}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 5: Payment Method Analysis */}
        <div className="p-5 rounded-xl bg-[#12243F] border border-[#263B59]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#F5F7FA]">Payment Method Analysis</h3>
            <CreditCard className="w-4 h-4 text-[#2684FF]" />
          </div>
          <p className="text-xs text-[#9BAFC8] mb-4">Churn vulnerability by billing channel</p>

          <div className="space-y-3">
            {paymentData.map((p) => (
              <div key={p.method} className="space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#F5F7FA] truncate max-w-[170px]" title={p.fullName}>
                    {p.method}
                  </span>
                  <span
                    className={`font-mono font-semibold ${
                      p.rate > 35 ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {p.rate}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#0B1830] overflow-hidden">
                  <div
                    style={{ width: `${p.rate}%` }}
                    className={`h-full rounded-full ${p.rate > 35 ? 'bg-red-500' : 'bg-emerald-500'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Key Business Insights Section */}
      <div className="p-6 rounded-xl bg-[#12243F] border border-[#263B59]">
        <div className="flex items-center gap-2 mb-4">
          <ArrowUpRight className="w-5 h-5 text-[#19C5E8]" />
          <h3 className="text-sm font-bold text-[#F5F7FA] uppercase tracking-wide">
            Key Business Intelligence Insights
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-[#9BAFC8] leading-relaxed">
          <div className="p-4 rounded-lg bg-[#0B1830] border border-[#263B59] space-y-2">
            <div className="text-[#F5F7FA] font-semibold flex items-center justify-between">
              <span>The 90-Day Cliff</span>
              <span className="font-mono text-red-400 text-[11px]">47.4% Early Churn</span>
            </div>
            <p>
              Customers in their first 12 months exhibit an extreme attrition rate of nearly 50%. Once a customer
              crosses 24 months, churn drops dramatically to below 15%, establishing the critical need for first-year onboarding programs.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#0B1830] border border-[#263B59] space-y-2">
            <div className="text-[#F5F7FA] font-semibold flex items-center justify-between">
              <span>Electronic Check Risk</span>
              <span className="font-mono text-red-400 text-[11px]">45.3% Attrition</span>
            </div>
            <p>
              Subscribers paying via manual electronic checks churn at three times the rate of those enrolled in automated
              credit card or bank transfer billing (15.2% vs 45.3%). Transitioning users to auto-pay yields immediate retention gains.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#0B1830] border border-[#263B59] space-y-2">
            <div className="text-[#F5F7FA] font-semibold flex items-center justify-between">
              <span>Fiber Optic Disconnect</span>
              <span className="font-mono text-amber-400 text-[11px]">41.9% Churn Rate</span>
            </div>
            <p>
              Despite commanding premium prices ($80+), Fiber Optic subscribers churn at more than double DSL subscribers (41.9% vs 18.9%),
              driven by missing tech support and device security bundling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
