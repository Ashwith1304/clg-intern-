import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { FilterDrawer } from './components/FilterDrawer';
import { CsvUploadModal } from './components/CsvUploadModal';

import { ExecutiveOverview } from './pages/ExecutiveOverview';
import { CustomerExplorer } from './pages/CustomerExplorer';
import { DataQualityReport } from './pages/DataQualityReport';
import { ExploratoryAnalysis } from './pages/ExploratoryAnalysis';
import { StatisticalAnalysis } from './pages/StatisticalAnalysis';
import { SqlAnalytics } from './pages/SqlAnalytics';
import { CustomerSegmentation } from './pages/CustomerSegmentation';
import { BusinessRecommendations } from './pages/BusinessRecommendations';
import { AboutProject } from './pages/AboutProject';

import { CustomerRecord, FilterState, PageId } from './types/churn';
import { exportToCsv } from './utils/export';
import { initSqlDatabase } from './utils/sqlRunner';

const INITIAL_FILTERS: FilterState = {
  gender: 'All',
  contract: 'All',
  internetService: 'All',
  paymentMethod: 'All',
  tenureMin: 0,
  tenureMax: 72,
  churnFilter: 'All',
  searchTerm: '',
};

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('overview');
  const [allRecords, setAllRecords] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Modals
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Load default dataset on launch
  const loadDefaultDataset = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try to load pre-built JSON for speed
      const res = await fetch('/data/telco-customer-churn.json');
      if (res.ok) {
        const data = await res.json();
        setAllRecords(data);
        initSqlDatabase(data);
        setLoading(false);
        return;
      }

      // Fallback: load CSV
      const csvRes = await fetch('/data/telco-customer-churn.csv');
      if (!csvRes.ok) throw new Error('Could not load Telco dataset.');
      const text = await csvRes.text();
      const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
      const rawRows = parsed.data as any[];

      const cleaned: CustomerRecord[] = rawRows.map((r, idx) => {
        const rawTot = r.TotalCharges !== undefined ? String(r.TotalCharges).trim() : '';
        const totalVal = rawTot === '' || rawTot === ' ' || isNaN(Number(rawTot)) ? 0.0 : parseFloat(rawTot);
        return {
          customerID: r.customerID ? String(r.customerID).trim() : `CUST-${idx}`,
          gender: r.gender || 'Unknown',
          SeniorCitizen: Number(r.SeniorCitizen) === 1 ? 1 : 0,
          Partner: r.Partner === 'Yes' ? 'Yes' : 'No',
          Dependents: r.Dependents === 'Yes' ? 'Yes' : 'No',
          tenure: parseInt(r.tenure, 10) || 0,
          PhoneService: r.PhoneService || 'No',
          MultipleLines: r.MultipleLines || 'No',
          InternetService: r.InternetService || 'No',
          OnlineSecurity: r.OnlineSecurity || 'No',
          OnlineBackup: r.OnlineBackup || 'No',
          DeviceProtection: r.DeviceProtection || 'No',
          TechSupport: r.TechSupport || 'No',
          StreamingTV: r.StreamingTV || 'No',
          StreamingMovies: r.StreamingMovies || 'No',
          Contract: r.Contract || 'Month-to-month',
          PaperlessBilling: r.PaperlessBilling === 'Yes' ? 'Yes' : 'No',
          PaymentMethod: r.PaymentMethod || 'Mailed check',
          MonthlyCharges: parseFloat(r.MonthlyCharges) || 0,
          TotalCharges: totalVal,
          Churn: r.Churn === 'Yes' ? 'Yes' : 'No',
        };
      });

      setAllRecords(cleaned);
      initSqlDatabase(cleaned);
      setLoading(false);
    } catch (err: any) {
      console.error('Error loading dataset:', err);
      setError(err.message || 'Failed to load initial dataset.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDefaultDataset();
  }, []);

  // Filter records dynamically based on active filter state
  const filteredRecords = useMemo(() => {
    return allRecords.filter((record) => {
      // Gender filter
      if (filters.gender !== 'All' && record.gender !== filters.gender) return false;

      // Contract filter
      if (filters.contract !== 'All' && record.Contract !== filters.contract) return false;

      // Internet service filter
      if (filters.internetService !== 'All' && record.InternetService !== filters.internetService) return false;

      // Payment method filter
      if (filters.paymentMethod !== 'All' && record.PaymentMethod !== filters.paymentMethod) return false;

      // Churn status filter
      if (filters.churnFilter === 'Yes' && record.Churn !== 'Yes') return false;
      if (filters.churnFilter === 'No' && record.Churn !== 'No') return false;

      // Tenure range filter
      if (record.tenure < filters.tenureMin || record.tenure > filters.tenureMax) return false;

      // Search term
      if (filters.searchTerm.trim() !== '') {
        const term = filters.searchTerm.toLowerCase();
        if (
          !record.customerID.toLowerCase().includes(term) &&
          !record.Contract.toLowerCase().includes(term) &&
          !record.PaymentMethod.toLowerCase().includes(term) &&
          !record.InternetService.toLowerCase().includes(term)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [allRecords, filters]);

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleCustomDatasetLoaded = (newRecords: CustomerRecord[], sourceName: string) => {
    setAllRecords(newRecords);
    initSqlDatabase(newRecords);
    resetFilters();
  };

  const handleExportCleanedCsv = () => {
    exportToCsv(allRecords, 'telco_customer_churn_cleaned_master');
  };

  return (
    <div className="min-h-screen bg-[#081426] text-[#F5F7FA] flex flex-row">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        totalRecords={allRecords.length}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          activePage={activePage}
          filters={filters}
          resetFilters={resetFilters}
          filteredCount={filteredRecords.length}
          totalCount={allRecords.length}
          openFilterDrawer={() => setIsFilterDrawerOpen(true)}
          openUploadModal={() => setIsUploadModalOpen(true)}
          onExportCleanedCsv={handleExportCleanedCsv}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
              <div className="w-10 h-10 border-3 border-[#2684FF] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-[#9BAFC8]">
                Initializing IBM Telco Relational & Statistical Engine...
              </p>
            </div>
          ) : error ? (
            <div className="p-6 rounded-xl bg-red-950/40 border border-red-500/40 text-center space-y-3 max-w-lg mx-auto mt-12">
              <p className="text-sm text-red-200">{error}</p>
              <button
                onClick={loadDefaultDataset}
                className="px-4 py-2 bg-[#2684FF] text-white text-xs font-semibold rounded-lg hover:bg-[#2684FF]/90 transition-colors"
              >
                Retry Dataset Load
              </button>
            </div>
          ) : (
            <>
              {activePage === 'overview' && (
                <ExecutiveOverview records={filteredRecords} allRecords={allRecords} />
              )}
              {activePage === 'explorer' && (
                <CustomerExplorer records={filteredRecords} allRecords={allRecords} />
              )}
              {activePage === 'quality' && <DataQualityReport records={filteredRecords} />}
              {activePage === 'eda' && <ExploratoryAnalysis records={filteredRecords} />}
              {activePage === 'statistics' && <StatisticalAnalysis records={filteredRecords} />}
              {activePage === 'sql' && <SqlAnalytics records={filteredRecords} />}
              {activePage === 'segmentation' && <CustomerSegmentation records={filteredRecords} />}
              {activePage === 'recommendations' && <BusinessRecommendations records={filteredRecords} />}
              {activePage === 'about' && <AboutProject />}
            </>
          )}
        </main>
      </div>

      {/* Global Filter Drawer Modal */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
        totalCount={allRecords.length}
        filteredCount={filteredRecords.length}
      />

      {/* CSV Upload & Dataset Ingestion Modal */}
      <CsvUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDatasetLoaded={handleCustomDatasetLoaded}
        onResetDefaultDataset={loadDefaultDataset}
      />
    </div>
  );
}
