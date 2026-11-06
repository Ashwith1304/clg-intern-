import React from 'react';
import { Filter, Download, Upload, RotateCcw, ChevronRight } from 'lucide-react';
import { FilterState, PageId } from '../types/churn';

interface TopBarProps {
  activePage: PageId;
  filters: FilterState;
  resetFilters: () => void;
  filteredCount: number;
  totalCount: number;
  openFilterDrawer: () => void;
  openUploadModal: () => void;
  onExportCleanedCsv: () => void;
}

const PAGE_TITLES: Record<PageId, { title: string; subtitle: string }> = {
  overview: {
    title: 'Executive Overview',
    subtitle: 'High-level retention KPIs, churn distributions, and revenue impact analysis',
  },
  explorer: {
    title: 'Customer Data Explorer',
    subtitle: 'Granular subscriber ledger with multi-column filtering, search, and dynamic CSV export',
  },
  quality: {
    title: 'Data Quality & Validation Report',
    subtitle: 'Missing-value imputation audit, duplicate detection, and Tukey IQR outlier boundaries',
  },
  eda: {
    title: 'Exploratory Data Analysis (EDA)',
    subtitle: 'Univariate and bivariate distributions across tenure, contracts, charges, and services',
  },
  statistics: {
    title: 'Statistical Hypothesis & Inferential Analysis',
    subtitle: 'Parametric and non-parametric tests: Pearson Correlation, Chi-Square, and Welch’s t-test',
  },
  sql: {
    title: 'SQL Business Analytics Engine',
    subtitle: 'SQLite relational querying: 10 structured business investigations plus live SQL console',
  },
  segmentation: {
    title: 'Descriptive Customer Segmentation',
    subtitle: 'Multi-attribute behavioral grouping across contract tenure, charge tiers, and service bundles',
  },
  recommendations: {
    title: 'Actionable Business Recommendations',
    subtitle: 'Empirical strategic retention pillars with data proof, financial implications, and interventions',
  },
  about: {
    title: 'Project Architecture & Academic Credits',
    subtitle: 'Sreenidhi Institute of Science and Technology · B.Tech CSE Data Science Capstone Project',
  },
};

export const TopBar: React.FC<TopBarProps> = ({
  activePage,
  filters,
  resetFilters,
  filteredCount,
  totalCount,
  openFilterDrawer,
  openUploadModal,
  onExportCleanedCsv,
}) => {
  const current = PAGE_TITLES[activePage];

  // Count active filters
  let activeFilterCount = 0;
  if (filters.gender !== 'All') activeFilterCount++;
  if (filters.contract !== 'All') activeFilterCount++;
  if (filters.internetService !== 'All') activeFilterCount++;
  if (filters.paymentMethod !== 'All') activeFilterCount++;
  if (filters.churnFilter !== 'All') activeFilterCount++;
  if (filters.tenureMin > 0 || filters.tenureMax < 72) activeFilterCount++;
  if (filters.searchTerm.trim() !== '') activeFilterCount++;

  return (
    <header className="h-16 px-6 bg-[#0B1830] border-b border-[#263B59] flex items-center justify-between gap-6 sticky top-0 z-20">
      {/* Zone 1: Breadcrumb and Title */}
      <div className="flex items-center gap-2 text-xs truncate">
        <span className="text-[#9BAFC8] font-medium hidden sm:inline">Telco Retention BI</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#263B59] hidden sm:inline" />
        <span className="text-[#F5F7FA] font-semibold truncate text-sm">{current.title}</span>
      </div>

      {/* Zone 2: Filter Summary Pill and Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Filter Toggle */}
        <button
          onClick={openFilterDrawer}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            activeFilterCount > 0
              ? 'bg-[#2684FF]/20 border-[#2684FF] text-[#19C5E8]'
              : 'bg-[#12243F] border-[#263B59] text-[#9BAFC8] hover:text-[#F5F7FA] hover:border-[#2684FF]/50'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 ? (
            <span className="px-1.5 py-0.2 rounded-full bg-[#2684FF] text-white text-[10px] font-mono font-bold">
              {activeFilterCount}
            </span>
          ) : (
            <span className="text-[11px] text-[#9BAFC8] hidden md:inline font-mono">
              ({filteredCount.toLocaleString()}/{totalCount.toLocaleString()})
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            title="Reset active filters"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#9BAFC8] hover:text-[#F5F7FA] bg-[#12243F] border border-[#263B59] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}

        {/* Upload Custom CSV */}
        <button
          onClick={openUploadModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#12243F] border border-[#263B59] text-[#F5F7FA] hover:border-[#2684FF]/60 hover:bg-[#12243F]/80 transition-colors"
        >
          <Upload className="w-3.5 h-3.5 text-[#19C5E8]" />
          <span className="hidden md:inline">Upload CSV</span>
        </button>

        {/* Download Cleaned CSV */}
        <button
          onClick={onExportCleanedCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#2684FF] text-white hover:bg-[#2684FF]/90 transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export Clean CSV</span>
        </button>
      </div>
    </header>
  );
};
