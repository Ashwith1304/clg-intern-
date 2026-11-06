import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Check,
} from 'lucide-react';
import { CustomerRecord } from '../types/churn';
import { exportToCsv } from '../utils/export';

interface CustomerExplorerProps {
  records: CustomerRecord[];
  allRecords: CustomerRecord[];
}

const ALL_COLUMNS: { key: keyof CustomerRecord; label: string; align?: 'left' | 'right' }[] = [
  { key: 'customerID', label: 'Customer ID' },
  { key: 'gender', label: 'Gender' },
  { key: 'SeniorCitizen', label: 'Senior' },
  { key: 'Partner', label: 'Partner' },
  { key: 'Dependents', label: 'Dependents' },
  { key: 'tenure', label: 'Tenure (mo)', align: 'right' },
  { key: 'PhoneService', label: 'Phone' },
  { key: 'MultipleLines', label: 'Multi Lines' },
  { key: 'InternetService', label: 'Internet' },
  { key: 'OnlineSecurity', label: 'Online Sec' },
  { key: 'OnlineBackup', label: 'Backup' },
  { key: 'DeviceProtection', label: 'Device Prot' },
  { key: 'TechSupport', label: 'Tech Support' },
  { key: 'StreamingTV', label: 'TV' },
  { key: 'StreamingMovies', label: 'Movies' },
  { key: 'Contract', label: 'Contract' },
  { key: 'PaperlessBilling', label: 'Paperless' },
  { key: 'PaymentMethod', label: 'Payment Method' },
  { key: 'MonthlyCharges', label: 'Monthly ($)', align: 'right' },
  { key: 'TotalCharges', label: 'Total ($)', align: 'right' },
  { key: 'Churn', label: 'Churn Status' },
];

export const CustomerExplorer: React.FC<CustomerExplorerProps> = ({ records, allRecords }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof CustomerRecord>('tenure');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [showColPicker, setShowColPicker] = useState(false);

  // Column visibility
  const [visibleCols, setVisibleCols] = useState<Record<keyof CustomerRecord, boolean>>({
    customerID: true,
    gender: true,
    SeniorCitizen: true,
    Partner: false,
    Dependents: false,
    tenure: true,
    PhoneService: false,
    MultipleLines: false,
    InternetService: true,
    OnlineSecurity: true,
    OnlineBackup: false,
    DeviceProtection: false,
    TechSupport: true,
    StreamingTV: false,
    StreamingMovies: false,
    Contract: true,
    PaperlessBilling: false,
    PaymentMethod: true,
    MonthlyCharges: true,
    TotalCharges: true,
    Churn: true,
  });

  // Filter and search
  const filteredRows = useMemo(() => {
    let result = records;
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.customerID.toLowerCase().includes(term) ||
          r.Contract.toLowerCase().includes(term) ||
          r.InternetService.toLowerCase().includes(term) ||
          r.PaymentMethod.toLowerCase().includes(term) ||
          r.gender.toLowerCase().includes(term)
      );
    }

    return [...result].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
    });
  }, [records, searchTerm, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, currentPage, rowsPerPage]);

  const toggleSort = (field: keyof CustomerRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const toggleCol = (key: keyof CustomerRecord) => {
    setVisibleCols((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeColList = ALL_COLUMNS.filter((c) => visibleCols[c.key]);

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="p-4 rounded-xl bg-[#12243F] border border-[#263B59] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9BAFC8]" />
          <input
            type="text"
            placeholder="Search by ID, contract, payment, service..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-[#0B1830] border border-[#263B59] rounded-lg text-[#F5F7FA] placeholder-[#9BAFC8]/60 focus:outline-hidden focus:border-[#2684FF]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Column Picker Button */}
          <div className="relative">
            <button
              onClick={() => setShowColPicker(!showColPicker)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0B1830] border border-[#263B59] text-[#9BAFC8] hover:text-[#F5F7FA] transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Columns ({activeColList.length})</span>
            </button>

            {showColPicker && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0B1830] border border-[#263B59] rounded-xl p-3 shadow-2xl z-30 space-y-1 max-h-80 overflow-y-auto">
                <div className="text-[11px] font-semibold text-[#F5F7FA] pb-2 border-b border-[#263B59] flex justify-between items-center">
                  <span>Toggle Columns</span>
                  <button
                    onClick={() => {
                      const allTrue = Object.keys(visibleCols).reduce((acc, k) => ({ ...acc, [k]: true }), {});
                      setVisibleCols(allTrue as any);
                    }}
                    className="text-[#2684FF] hover:underline text-[10px]"
                  >
                    Select All
                  </button>
                </div>
                {ALL_COLUMNS.map((col) => (
                  <button
                    key={col.key}
                    onClick={() => toggleCol(col.key)}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-[#12243F] text-left text-xs transition-colors"
                  >
                    <span className={visibleCols[col.key] ? 'text-[#F5F7FA]' : 'text-[#9BAFC8]/50'}>
                      {col.label}
                    </span>
                    {visibleCols[col.key] && <Check className="w-3.5 h-3.5 text-[#19C5E8]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Filtered CSV */}
          <button
            onClick={() => exportToCsv(filteredRows, 'telco_filtered_customers')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2684FF] text-white hover:bg-[#2684FF]/90 font-medium transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV ({filteredRows.length.toLocaleString()})</span>
          </button>
        </div>
      </div>

      {/* Dataset Summary Banner */}
      <div className="px-4 py-2.5 rounded-lg bg-[#0B1830] border border-[#263B59] flex flex-wrap items-center justify-between text-xs text-[#9BAFC8]">
        <div className="flex items-center gap-4">
          <span>
            Showing <strong className="text-[#F5F7FA] font-mono">{filteredRows.length.toLocaleString()}</strong> of{' '}
            <strong className="text-[#F5F7FA] font-mono">{allRecords.length.toLocaleString()}</strong> subscribers
          </span>
          <span>·</span>
          <span>
            Active: <strong className="text-emerald-400 font-mono">{filteredRows.filter((r) => r.Churn === 'No').length.toLocaleString()}</strong>
          </span>
          <span>·</span>
          <span>
            Churned: <strong className="text-red-400 font-mono">{filteredRows.filter((r) => r.Churn === 'Yes').length.toLocaleString()}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="bg-[#12243F] border border-[#263B59] rounded px-2 py-1 text-[#F5F7FA] font-mono text-xs focus:outline-hidden"
          >
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* High-Density Data Grid Table */}
      <div className="rounded-xl bg-[#12243F] border border-[#263B59] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0B1830] border-b border-[#263B59] text-[#9BAFC8] select-none">
                {activeColList.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className={`py-3 px-4 font-semibold hover:text-[#F5F7FA] cursor-pointer whitespace-nowrap transition-colors ${
                      col.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div className={`inline-flex items-center gap-1.5 ${col.align === 'right' ? 'flex-row-reverse' : ''}`}>
                      <span>{col.label}</span>
                      <ArrowUpDown
                        className={`w-3 h-3 ${sortField === col.key ? 'text-[#19C5E8]' : 'opacity-40'}`}
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263B59]/60">
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={activeColList.length} className="py-12 text-center text-[#9BAFC8]">
                    No customer records match the active search or filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((r) => {
                  const isChurned = r.Churn === 'Yes';
                  return (
                    <tr
                      key={r.customerID}
                      className="hover:bg-[#0B1830]/80 transition-colors group"
                    >
                      {activeColList.map((col) => {
                        const val = r[col.key];

                        if (col.key === 'customerID') {
                          return (
                            <td key={col.key} className="py-2.5 px-4 font-mono font-medium text-[#19C5E8]">
                              {val}
                            </td>
                          );
                        }

                        if (col.key === 'Churn') {
                          return (
                            <td key={col.key} className="py-2.5 px-4">
                              <span
                                className={`font-semibold ${
                                  isChurned ? 'text-red-400' : 'text-emerald-400'
                                }`}
                              >
                                {isChurned ? 'Churned (Yes)' : 'Active (No)'}
                              </span>
                            </td>
                          );
                        }

                        if (col.key === 'MonthlyCharges' || col.key === 'TotalCharges') {
                          return (
                            <td key={col.key} className="py-2.5 px-4 text-right font-mono tabular-nums text-[#F5F7FA]">
                              ${Number(val).toFixed(2)}
                            </td>
                          );
                        }

                        if (col.key === 'tenure') {
                          return (
                            <td key={col.key} className="py-2.5 px-4 text-right font-mono tabular-nums text-[#F5F7FA]">
                              {val}m
                            </td>
                          );
                        }

                        if (col.key === 'SeniorCitizen') {
                          return (
                            <td key={col.key} className="py-2.5 px-4 text-[#9BAFC8]">
                              {val === 1 ? 'Yes' : 'No'}
                            </td>
                          );
                        }

                        return (
                          <td key={col.key} className="py-2.5 px-4 text-[#F5F7FA] whitespace-nowrap">
                            {String(val)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-[#263B59] bg-[#0B1830] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="text-[#9BAFC8]">
            Page <span className="font-mono text-[#F5F7FA] font-bold">{currentPage}</span> of{' '}
            <span className="font-mono text-[#F5F7FA] font-bold">{totalPages}</span> ({filteredRows.length.toLocaleString()} records)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[#263B59] bg-[#12243F] text-[#9BAFC8] hover:text-[#F5F7FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[#263B59] bg-[#12243F] text-[#9BAFC8] hover:text-[#F5F7FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 text-[#F5F7FA] font-mono font-medium">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-[#263B59] bg-[#12243F] text-[#9BAFC8] hover:text-[#F5F7FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-[#263B59] bg-[#12243F] text-[#9BAFC8] hover:text-[#F5F7FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
