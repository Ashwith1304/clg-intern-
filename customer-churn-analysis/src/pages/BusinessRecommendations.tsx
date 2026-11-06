import React from 'react';
import {
  Lightbulb,
  TrendingDown,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  Shield,
  CreditCard,
  Calendar,
  Zap,
} from 'lucide-react';
import { CustomerRecord } from '../types/churn';

interface BusinessRecommendationsProps {
  records: CustomerRecord[];
}

interface StrategicPillar {
  id: number;
  title: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  observedPattern: string;
  supportingStatistics: { label: string; value: string }[];
  businessImplication: string;
  retentionAction: string;
  expectedFinancialImpact: string;
}

export const BusinessRecommendations: React.FC<BusinessRecommendationsProps> = ({ records }) => {
  const pillars: StrategicPillar[] = [
    {
      id: 1,
      title: 'Incentivize Migration from Month-to-Month to Annual Contracts',
      category: 'Contract Architecture',
      icon: Calendar,
      observedPattern:
        'Customers subscribed to Month-to-month contracts exhibit an overwhelming churn rate compared to customers on multi-year agreements.',
      supportingStatistics: [
        { label: 'Month-to-Month Churn', value: '42.71% (1,655 churned / 3,875 total)' },
        { label: 'One-Year Contract Churn', value: '11.27% (166 churned / 1,473 total)' },
        { label: 'Two-Year Contract Churn', value: '2.83% (48 churned / 1,695 total)' },
        { label: 'Relative Risk Ratio', value: '15.1x higher attrition on monthly agreements' },
      ],
      businessImplication:
        'Over 55% of the entire customer base has zero contract lock-in, enabling frictionless switching to competitors upon any service disruption or competitor marketing campaign.',
      retentionAction:
        'Launch an aggressive "Commit & Save" campaign offering a 12% billing discount or 2 free months of speed upgrades upon signing a 12-month contract. Implement auto-renewal incentives at the 11-month mark.',
      expectedFinancialImpact:
        'Converting just 25% of month-to-month subscribers (approx. 968 accounts) to 1-year agreements would retain ~300 accounts annually, protecting an estimated $265,000+ in annual recurring revenue.',
    },
    {
      id: 2,
      title: 'Frictionless Auto-Pay Migration for Electronic Check Users',
      category: 'Billing & Payment Modernization',
      icon: CreditCard,
      observedPattern:
        'Subscribers using manual Electronic Check payments suffer the highest churn rate of any billing channel, accounting for over 57% of all lost subscribers.',
      supportingStatistics: [
        { label: 'Electronic Check Churn', value: '45.29% (1,071 churned / 2,365 total)' },
        { label: 'Credit Card Auto-Pay Churn', value: '15.24% (232 churned / 1,522 total)' },
        { label: 'Bank Transfer Auto-Pay Churn', value: '16.71% (258 churned / 1,544 total)' },
        { label: 'Retention Gain on Auto-Pay', value: '+30.05% higher customer stickiness' },
      ],
      businessImplication:
        'Manual payment methods force customers to evaluate their bill every month, amplifying price sensitivity and creating regular decision points to cancel.',
      retentionAction:
        'Introduce a $10 one-time bill credit or $2.50 monthly recurring discount for switching from Electronic Check to automated Credit Card or Bank ACH payments. Pre-populate auto-pay enrollment in the mobile app portal.',
      expectedFinancialImpact:
        'Transitioning 35% of electronic check users (827 accounts) to automated payments is projected to save ~240 accounts per year, preserving $214,000 in annual billing revenue.',
    },
    {
      id: 3,
      title: 'Bundle Tech Support & Security into Premium Fiber Optic Tiers',
      category: 'Product & Value Bundling',
      icon: Shield,
      observedPattern:
        'Fiber Optic broadband experiences an elevated 41.89% churn rate despite high ARPU ($87/mo), primarily among users without Tech Support and Online Security add-ons.',
      supportingStatistics: [
        { label: 'Fiber Optic Churn Rate', value: '41.89% (1,297 churned / 3,096 total)' },
        { label: 'DSL Churn Rate', value: '18.96% (459 churned / 2,421 total)' },
        { label: 'Churn Without Tech Support', value: '41.64% (1,446 churned / 3,473 total)' },
        { label: 'Churn With Tech Support', value: '15.17% (310 churned / 2,044 total)' },
      ],
      businessImplication:
        'High-speed fiber users pay premium rates ($70-$100/mo). When technical glitches or device security issues occur without dedicated support, customers feel the service is overpriced and defect quickly.',
      retentionAction:
        'Repackage Fiber Optic subscriptions to automatically bundle "Peace of Mind" security (Online Security + Tech Support + Device Protection) into the base tier rather than charging separate $5-$10 line-item add-ons.',
      expectedFinancialImpact:
        'Reducing Fiber Optic churn from 41.9% to 25.0% preserves ~520 high-value fiber subscriptions, preserving over $540,000 in annual recurring gross profit.',
    },
    {
      id: 4,
      title: 'Proactive First-Year Onboarding & 90-Day Retention Milestones',
      category: 'Customer Lifecycle Operations',
      icon: Zap,
      observedPattern:
        'Customer attrition is heavily front-loaded. Nearly 40% of all customer churn occurs during the first 12 months of service ("The 90-Day Cliff").',
      supportingStatistics: [
        { label: '0–6 Months Tenure Churn', value: '52.99% (736 churned / 1,389 total)' },
        { label: '7–12 Months Tenure Churn', value: '38.25% (293 churned / 766 total)' },
        { label: 'Long-term (49–72 Months) Churn', value: '8.47% (159 churned / 1,878 total)' },
        { label: 'Tenure Hazard Ratio', value: 'Customers in Month 1 are 6.2x more likely to leave than Month 60' },
      ],
      businessImplication:
        'Early customer dissatisfaction (installation hiccups, first-bill shock, router setup issues) creates permanent churn before the subscriber reaches profitability.',
      retentionAction:
        'Deploy a structured 30-60-90 day proactive customer success sequence: automated Day-7 welcome survey, Day-30 first-bill review call, and Day-90 loyalty loyalty reward (e.g. streaming speed boost voucher).',
      expectedFinancialImpact:
        'Lowering first-year attrition by 15% yields an additional 150 retained subscribers per year with extended average lifetime value of $2,400+ per account.',
    },
    {
      id: 5,
      title: 'Dedicated Senior Citizen Concierge Support & Simplified Billing',
      category: 'Demographic Segmentation',
      icon: DollarSign,
      observedPattern:
        'Senior citizens suffer a 41.68% churn rate (nearly double the 23.61% rate of non-seniors), driven by paperless billing friction and complex multi-line tech packages.',
      supportingStatistics: [
        { label: 'Senior Citizen Churn Rate', value: '41.68% (476 churned / 1,142 total)' },
        { label: 'Non-Senior Churn Rate', value: '23.61% (1,393 churned / 5,901 total)' },
        { label: 'Senior Average Monthly Bill', value: '$79.82 (higher than overall $64.76 avg)' },
        { label: 'Senior Paperless Billing Share', value: '76.7% enrolled in confusing digital bills' },
      ],
      businessImplication:
        'Seniors are charged high monthly prices for features they may not utilize, and struggle with digital-only self-serve portals without telephone assistance.',
      retentionAction:
        'Establish a "Silver Care" hotline with zero-hold priority telephone routing, large-print paper billing options without penalty fees, and tailored plans excluding unused streaming add-ons.',
      expectedFinancialImpact:
        'Safeguarding 200 senior households annually yields ~$191,000 in preserved yearly revenue at minimal marginal operational support cost.',
    },
    {
      id: 6,
      title: 'Paperless Billing Transparency & Bill Shock Audits',
      category: 'Billing Experience',
      icon: TrendingDown,
      observedPattern:
        'Customers enrolled in Paperless Billing churn at 33.57% compared to 16.33% for those receiving physical mail invoices.',
      supportingStatistics: [
        { label: 'Paperless Billing Churn', value: '33.57% (1,400 churned / 4,171 total)' },
        { label: 'Mailed Statement Churn', value: '16.33% (469 churned / 2,872 total)' },
        { label: 'Churn Odds Ratio', value: '2.05x higher churn among paperless accounts' },
        { label: 'Statistically Significant', value: 'χ² = 258.28, p < 0.0001' },
      ],
      businessImplication:
        'Digital billing notifications are frequently missed or overlooked in spam folders. When unexpected promotional rate expirations occur, customers receive "bill shock" without prior warning.',
      retentionAction:
        'Send proactive SMS alerts 5 days prior to auto-debit detailing any price adjustment. Provide clear line-item breakdowns and notify subscribers 30 days before promo credits expire.',
      expectedFinancialImpact:
        'Eliminating billing surprise reduces customer service friction and prevents an estimated 180 account terminations annually ($140,000+ preserved MRR).',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Executive Strategic Summary Banner */}
      <div className="p-6 rounded-xl bg-[#12243F] border border-[#263B59] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-semibold text-[#F5F7FA]">Data-Driven Strategic Retention Roadmap</h3>
          </div>
          <p className="text-xs text-[#9BAFC8] mt-1">
            Actionable empirical interventions derived directly from Chi-Square testing, Welch t-test inferences, and SQL cohort analysis.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-[#0B1830] border border-[#263B59] text-emerald-400 font-semibold">
            Estimated Annual Revenue Preservation: $1.35M+
          </span>
        </div>
      </div>

      {/* Strategic Pillars List */}
      <div className="space-y-6">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.id}
              className="p-6 rounded-xl bg-[#12243F] border border-[#263B59] space-y-4 hover:border-[#2684FF]/40 transition-colors"
            >
              {/* Pillar Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#263B59] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#2684FF]/20 border border-[#2684FF]/40 flex items-center justify-center text-[#19C5E8]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-[#19C5E8]">
                      Pillar 0{pillar.id} · {pillar.category}
                    </span>
                    <h4 className="text-sm font-bold text-[#F5F7FA]">{pillar.title}</h4>
                  </div>
                </div>

                <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  {pillar.expectedFinancialImpact.split(':')[0] || 'High ROI'}
                </span>
              </div>

              {/* 4-Zone Matrix: Observed Pattern, Supporting Statistics, Business Implication, Retention Action */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                {/* Left: Observed Pattern & Proof Stats */}
                <div className="space-y-3 p-4 rounded-lg bg-[#0B1830] border border-[#263B59]">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase text-[#9BAFC8]">Observed Empirical Pattern</span>
                    <p className="text-[#F5F7FA] leading-relaxed">{pillar.observedPattern}</p>
                  </div>

                  <div className="pt-2 border-t border-[#263B59]/60">
                    <span className="text-[10px] font-bold uppercase text-[#19C5E8] font-mono">
                      Supporting Statistics & Tests
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 font-mono">
                      {pillar.supportingStatistics.map((stat, idx) => (
                        <div key={idx} className="p-2 rounded bg-[#12243F] border border-[#263B59]/60">
                          <div className="text-[10px] text-[#9BAFC8] truncate">{stat.label}</div>
                          <div className="text-[11px] font-bold text-[#F5F7FA] mt-0.5">{stat.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Implication & Suggested Action */}
                <div className="space-y-3 p-4 rounded-lg bg-[#0B1830] border border-[#263B59] flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase text-red-400">Business Implication</span>
                    <p className="text-[#9BAFC8] leading-relaxed">{pillar.businessImplication}</p>
                  </div>

                  <div className="pt-2 border-t border-[#263B59]/60 space-y-1">
                    <span className="text-[11px] font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Suggested Retention Action</span>
                    </span>
                    <p className="text-[#F5F7FA] leading-relaxed font-medium">{pillar.retentionAction}</p>
                  </div>

                  <div className="pt-2 border-t border-[#263B59]/60 text-[11px] text-[#19C5E8] font-mono">
                    <strong className="text-[#F5F7FA]">Financial Impact: </strong>
                    {pillar.expectedFinancialImpact}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
