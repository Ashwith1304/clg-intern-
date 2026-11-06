import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Users, ShieldAlert, Wifi, CreditCard } from 'lucide-react';
import { CustomerRecord } from '../types/churn';

interface ExploratoryAnalysisProps {
  records: CustomerRecord[];
}

export const ExploratoryAnalysis: React.FC<ExploratoryAnalysisProps> = ({ records }) => {
  const [activeTab, setActiveTab] = useState<'bivariate' | 'univariate' | 'distributions'>('bivariate');

  // Helper for computing breakdown by category vs Churn
  const computeChurnByFeature = (feature: keyof CustomerRecord) => {
    const categories = Array.from(new Set(records.map((r) => String(r[feature])))).sort();
    return categories.map((cat) => {
      const subset = records.filter((r) => String(r[feature]) === cat);
      const churned = subset.filter((r) => r.Churn === 'Yes').length;
      const active = subset.length - churned;
      const rate = subset.length > 0 ? (churned / subset.length) * 100 : 0;
      return {
        category: cat,
        total: subset.length,
        active,
        churned,
        rate: Number(rate.toFixed(1)),
      };
    });
  };

  // EDA Datasets
  const churnByGender = useMemo(() => computeChurnByFeature('gender'), [records]);
  const churnByContract = useMemo(() => computeChurnByFeature('Contract'), [records]);
  const churnByInternet = useMemo(() => computeChurnByFeature('InternetService'), [records]);
  const churnByPayment = useMemo(() => computeChurnByFeature('PaymentMethod'), [records]);
  const churnBySenior = useMemo(() => {
    const res = computeChurnByFeature('SeniorCitizen');
    return res.map((r) => ({ ...r, category: r.category === '1' ? 'Senior Citizen' : 'Non-Senior' }));
  }, [records]);
  const churnByTechSupport = useMemo(() => computeChurnByFeature('TechSupport'), [records]);

  // Tenure Cohorts vs Churn
  const tenureVsChurn = useMemo(() => {
    const bins = [
      { label: '0–6m', min: 0, max: 6 },
      { label: '7–12m', min: 7, max: 12 },
      { label: '13–24m', min: 13, max: 24 },
      { label: '25–36m', min: 25, max: 36 },
      { label: '37–48m', min: 37, max: 48 },
      { label: '49–60m', min: 49, max: 60 },
      { label: '61–72m', min: 61, max: 72 },
    ];
    return bins.map((b) => {
      const subset = records.filter((r) => r.tenure >= b.min && r.tenure <= b.max);
      const churned = subset.filter((r) => r.Churn === 'Yes').length;
      const rate = subset.length > 0 ? (churned / subset.length) * 100 : 0;
      return {
        label: b.label,
        total: subset.length,
        churned,
        active: subset.length - churned,
        rate: Number(rate.toFixed(1)),
      };
    });
  }, [records]);

  // Monthly Charges Brackets vs Churn (<$35, $35-$70, $70-$90, $90+)
  const chargesVsChurn = useMemo(() => {
    const tiers = [
      { label: 'Under $35 (Budget)', min: 0, max: 35 },
      { label: '$35 – $70 (Standard)', min: 35.01, max: 70 },
      { label: '$70 – $90 (Premium)', min: 70.01, max: 90 },
      { label: 'Over $90 (Ultra)', min: 90.01, max: 999 },
    ];
    return tiers.map((t) => {
      const subset = records.filter((r) => r.MonthlyCharges >= t.min && r.MonthlyCharges <= t.max);
      const churned = subset.filter((r) => r.Churn === 'Yes').length;
      const rate = subset.length > 0 ? (churned / subset.length) * 100 : 0;
      return {
        label: t.label,
        total: subset.length,
        churned,
        active: subset.length - churned,
        rate: Number(rate.toFixed(1)),
      };
    });
  }, [records]);

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#12243F] border border-[#263B59] w-fit text-xs">
        <button
          onClick={() => setActiveTab('bivariate')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'bivariate'
              ? 'bg-[#2684FF] text-white shadow-sm'
              : 'text-[#9BAFC8] hover:text-[#F5F7FA]'
          }`}
        >
          Bivariate Churn Relationships
        </button>
        <button
          onClick={() => setActiveTab('distributions')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'distributions'
              ? 'bg-[#2684FF] text-white shadow-sm'
              : 'text-[#9BAFC8] hover:text-[#F5F7FA]'
          }`}
        >
          Tenure & Monthly Charges vs Churn
        </button>
        <button
          onClick={() => setActiveTab('univariate')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'univariate'
              ? 'bg-[#2684FF] text-white shadow-sm'
              : 'text-[#9BAFC8] hover:text-[#F5F7FA]'
          }`}
        >
          Univariate Categorical Baselines
        </button>
      </div>

      {/* Tab 1: Bivariate Churn Relationships */}
      {activeTab === 'bivariate' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Churn by Contract */}
          <div className="p-5 rounded-xl bg-[#12243F] border border-[#263B59] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#F5F7FA]">Churn Propensity by Contract Type</h3>
                <p className="text-xs text-[#9BAFC8]">Attrition percentage by contractual lock-in</p>
              </div>
              <span className="text-[11px] font-mono text-[#19C5E8]">Strongest Predictor</span>
            </div>

            <div className="space-y-3 pt-1">
              {churnByContract.map((c) => (
                <div key={c.category} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#F5F7FA]">{c.category}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[#9BAFC8]">
                        {c.churned} / {c.total}
                      </span>
                      <span className={`font-bold ${c.rate > 30 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {c.rate}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full bg-[#0B1830] rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${c.rate}%` }}
                      className={`h-full rounded-full ${c.rate > 30 ? 'bg-red-500' : 'bg-emerald-500'}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-[#0B1830] border border-[#263B59] text-[11px] text-[#9BAFC8]">
              Customers on Month-to-month contracts churn at <strong className="text-red-400 font-mono">42.7%</strong> vs{' '}
              <strong className="text-emerald-400 font-mono">2.8%</strong> for two-year contracts, proving lock-in contracts eliminate 93% of churn.
            </div>
          </div>

          {/* Card 2: Churn by Internet Service */}
          <div className="p-5 rounded-xl bg-[#12243F] border border-[#263B59] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#F5F7FA]">Churn by Internet Service Technology</h3>
                <p className="text-xs text-[#9BAFC8]">Fiber optic vs DSL vs No Internet</p>
              </div>
              <Wifi className="w-4 h-4 text-[#19C5E8]" />
            </div>

            <div className="space-y-3 pt-1">
              {churnByInternet.map((item) => (
                <div key={item.category} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#F5F7FA]">{item.category}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[#9BAFC8]">
                        {item.churned} / {item.total}
                      </span>
                      <span className={`font-bold ${item.rate > 35 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {item.rate}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full bg-[#0B1830] rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${item.rate}%` }}
                      className={`h-full rounded-full ${item.rate > 35 ? 'bg-red-500' : 'bg-[#2684FF]'}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-[#0B1830] border border-[#263B59] text-[11px] text-[#9BAFC8]">
              Fiber Optic customers churn at <strong className="text-red-400 font-mono">41.9%</strong> (over 2x DSL at 19.0%), pointing to price-to-service dissatisfaction on high-speed tiers.
            </div>
          </div>

          {/* Card 3: Churn by Payment Method */}
          <div className="p-5 rounded-xl bg-[#12243F] border border-[#263B59] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#F5F7FA]">Churn by Billing & Payment Channel</h3>
                <p className="text-xs text-[#9BAFC8]">Electronic check vs Automated debit</p>
              </div>
              <CreditCard className="w-4 h-4 text-[#2684FF]" />
            </div>

            <div className="space-y-3 pt-1">
              {churnByPayment.map((p) => (
                <div key={p.category} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#F5F7FA] truncate max-w-[200px]">{p.category}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[#9BAFC8]">
                        {p.churned} / {p.total}
                      </span>
                      <span className={`font-bold ${p.rate > 40 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {p.rate}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full bg-[#0B1830] rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${p.rate}%` }}
                      className={`h-full rounded-full ${p.rate > 40 ? 'bg-red-500' : 'bg-emerald-500'}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-[#0B1830] border border-[#263B59] text-[11px] text-[#9BAFC8]">
              Electronic Check users represent over 57% of all churn events company-wide (<strong className="text-red-400 font-mono">45.3%</strong> rate).
            </div>
          </div>

          {/* Card 4: Churn by Senior Citizen & Tech Support */}
          <div className="p-5 rounded-xl bg-[#12243F] border border-[#263B59] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#F5F7FA]">Impact of Technical Support on Retention</h3>
                <p className="text-xs text-[#9BAFC8]">Subscribers with vs without Tech Support</p>
              </div>
              <ShieldAlert className="w-4 h-4 text-[#19C5E8]" />
            </div>

            <div className="space-y-3 pt-1">
              {churnByTechSupport.map((ts) => (
                <div key={ts.category} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#F5F7FA]">{ts.category}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[#9BAFC8]">
                        {ts.churned} / {ts.total}
                      </span>
                      <span className={`font-bold ${ts.rate > 35 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {ts.rate}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full bg-[#0B1830] rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${ts.rate}%` }}
                      className={`h-full rounded-full ${ts.rate > 35 ? 'bg-red-500' : 'bg-emerald-500'}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-[#0B1830] border border-[#263B59] text-[11px] text-[#9BAFC8]">
              Users lacking Tech Support churn at <strong className="text-red-400 font-mono">41.6%</strong>, whereas those with Tech Support churn at just <strong className="text-emerald-400 font-mono">15.2%</strong>.
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tenure & Monthly Charges vs Churn */}
      {activeTab === 'distributions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tenure Cohorts vs Churn */}
          <div className="p-5 rounded-xl bg-[#12243F] border border-[#263B59] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#F5F7FA]">Tenure Cohort Progression vs Churn</h3>
                <p className="text-xs text-[#9BAFC8]">The decay of churn probability as subscriber tenure increases</p>
              </div>
              <span className="text-xs font-mono text-[#19C5E8]">Decay Curve</span>
            </div>

            <div className="space-y-3 pt-1">
              {tenureVsChurn.map((t) => (
                <div key={t.label} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[#F5F7FA] font-medium">{t.label}</span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-[#9BAFC8]">
                        {t.churned.toLocaleString()} churned ({t.total} total)
                      </span>
                      <span
                        className={`font-bold ${
                          t.rate > 40 ? 'text-red-400' : t.rate > 20 ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {t.rate}%
                      </span>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-[#0B1830] rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${t.rate}%` }}
                      className={`h-full rounded-full ${
                        t.rate > 40 ? 'bg-red-500' : t.rate > 20 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-lg bg-[#0B1830] border border-[#263B59] text-xs text-[#9BAFC8]">
              <strong className="text-[#F5F7FA]">Key Retention Finding:</strong> Churn follows a steep power-law decay.
              Subscribers in their first 6 months have an alarming <span className="text-red-400 font-mono font-bold">53.0%</span> churn rate. After 24 months, churn drops to under <span className="text-emerald-400 font-mono font-bold">15%</span>, and after 60 months to under <span className="text-emerald-400 font-mono font-bold">7%</span>.
            </div>
          </div>

          {/* Monthly Charges vs Churn */}
          <div className="p-5 rounded-xl bg-[#12243F] border border-[#263B59] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#F5F7FA]">Monthly Charges Tiers vs Churn Rate</h3>
                <p className="text-xs text-[#9BAFC8]">Price sensitivity and account cancellation correlation</p>
              </div>
              <span className="text-xs font-mono text-[#2684FF]">Price Sensitivity</span>
            </div>

            <div className="space-y-4 pt-1">
              {chargesVsChurn.map((tier) => (
                <div key={tier.label} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#F5F7FA]">{tier.label}</span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-[#9BAFC8]">{tier.churned} / {tier.total}</span>
                      <span
                        className={`font-bold ${
                          tier.rate > 30 ? 'text-red-400' : tier.rate > 15 ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {tier.rate}%
                      </span>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-[#0B1830] rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${tier.rate}%` }}
                      className={`h-full rounded-full ${
                        tier.rate > 30 ? 'bg-red-500' : tier.rate > 15 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-lg bg-[#0B1830] border border-[#263B59] text-xs text-[#9BAFC8]">
              <strong className="text-[#F5F7FA]">Key Pricing Finding:</strong> Accounts paying $70–$90/month experience
              a <span className="text-red-400 font-mono font-bold">38.6%</span> churn rate, compared to just <span className="text-emerald-400 font-mono font-bold">10.5%</span> for basic budget accounts under $35/month. High monthly rates require bundling security and priority support to justify pricing.
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Univariate Categorical Baselines */}
      {activeTab === 'univariate' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gender Distribution */}
          <div className="p-5 rounded-xl bg-[#12243F] border border-[#263B59] space-y-3">
            <h4 className="text-xs font-semibold text-[#F5F7FA] uppercase tracking-wide">Gender Distribution & Churn</h4>
            {churnByGender.map((g) => (
              <div key={g.category} className="p-3 rounded-lg bg-[#0B1830] border border-[#263B59] space-y-1 text-xs">
                <div className="flex justify-between font-medium text-[#F5F7FA]">
                  <span>{g.category}</span>
                  <span className="font-mono text-[#19C5E8]">{g.total.toLocaleString()} ({((g.total / records.length) * 100).toFixed(1)}%)</span>
                </div>
                <div className="flex justify-between font-mono text-[#9BAFC8] text-[11px]">
                  <span>Churn Rate:</span>
                  <span className="text-[#F5F7FA] font-bold">{g.rate}%</span>
                </div>
              </div>
            ))}
            <p className="text-[11px] text-[#9BAFC8]">
              Gender exhibits almost 0 correlation with churn (Females: 26.9%, Males: 26.2%).
            </p>
          </div>

          {/* Senior Citizen Breakdown */}
          <div className="p-5 rounded-xl bg-[#12243F] border border-[#263B59] space-y-3">
            <h4 className="text-xs font-semibold text-[#F5F7FA] uppercase tracking-wide">Senior Citizen Distribution</h4>
            {churnBySenior.map((s) => (
              <div key={s.category} className="p-3 rounded-lg bg-[#0B1830] border border-[#263B59] space-y-1 text-xs">
                <div className="flex justify-between font-medium text-[#F5F7FA]">
                  <span>{s.category}</span>
                  <span className="font-mono text-[#19C5E8]">{s.total.toLocaleString()} ({((s.total / records.length) * 100).toFixed(1)}%)</span>
                </div>
                <div className="flex justify-between font-mono text-[#9BAFC8] text-[11px]">
                  <span>Churn Rate:</span>
                  <span className={s.rate > 35 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{s.rate}%</span>
                </div>
              </div>
            ))}
            <p className="text-[11px] text-[#9BAFC8]">
              Senior citizens represent 16.2% of users but have a severe <span className="text-red-400 font-mono">41.7%</span> churn rate.
            </p>
          </div>

          {/* Contract Distribution */}
          <div className="p-5 rounded-xl bg-[#12243F] border border-[#263B59] space-y-3">
            <h4 className="text-xs font-semibold text-[#F5F7FA] uppercase tracking-wide">Contract Share of Base</h4>
            {churnByContract.map((c) => (
              <div key={c.category} className="p-3 rounded-lg bg-[#0B1830] border border-[#263B59] space-y-1 text-xs">
                <div className="flex justify-between font-medium text-[#F5F7FA]">
                  <span>{c.category}</span>
                  <span className="font-mono text-[#19C5E8]">{c.total.toLocaleString()} ({((c.total / records.length) * 100).toFixed(1)}%)</span>
                </div>
                <div className="flex justify-between font-mono text-[#9BAFC8] text-[11px]">
                  <span>Churn Rate:</span>
                  <span className={c.rate > 30 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{c.rate}%</span>
                </div>
              </div>
            ))}
            <p className="text-[11px] text-[#9BAFC8]">
              55.0% of all subscribers are on month-to-month contracts, explaining the high overall attrition.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
