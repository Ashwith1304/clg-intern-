import React from 'react';
import { X, RotateCcw, Filter, Check } from 'lucide-react';
import { FilterState } from '../types/churn';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  resetFilters,
  totalCount,
  filteredCount,
}) => {
  if (!isOpen) return null;

  const handleChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0B1830] border-l border-[#263B59] h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#263B59] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Filter className="w-4 h-4 text-[#19C5E8]" />
            <div>
              <h2 className="text-sm font-semibold text-[#F5F7FA]">Global Dynamic Filters</h2>
              <p className="text-xs text-[#9BAFC8] mt-0.5">
                Matches: <span className="font-mono text-[#19C5E8] font-bold">{filteredCount.toLocaleString()}</span> of{' '}
                <span className="font-mono text-[#F5F7FA]">{totalCount.toLocaleString()}</span> subscribers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9BAFC8] hover:text-[#F5F7FA] hover:bg-[#12243F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-xs">
          {/* Churn Status */}
          <div>
            <label className="block font-medium text-[#F5F7FA] mb-2">Churn Status</label>
            <div className="grid grid-cols-3 gap-2">
              {['All', 'No', 'Yes'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleChange('churnFilter', opt)}
                  className={`py-2 px-3 rounded-lg border text-center font-medium transition-colors ${
                    filters.churnFilter === opt
                      ? 'bg-[#2684FF] border-[#2684FF] text-white'
                      : 'bg-[#12243F] border-[#263B59] text-[#9BAFC8] hover:text-[#F5F7FA]'
                  }`}
                >
                  {opt === 'All' ? 'All' : opt === 'Yes' ? 'Churned' : 'Retained'}
                </button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block font-medium text-[#F5F7FA] mb-2">Customer Gender</label>
            <div className="grid grid-cols-3 gap-2">
              {['All', 'Female', 'Male'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleChange('gender', opt)}
                  className={`py-2 px-3 rounded-lg border text-center font-medium transition-colors ${
                    filters.gender === opt
                      ? 'bg-[#2684FF] border-[#2684FF] text-white'
                      : 'bg-[#12243F] border-[#263B59] text-[#9BAFC8] hover:text-[#F5F7FA]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Contract Type */}
          <div>
            <label className="block font-medium text-[#F5F7FA] mb-2">Contract Agreement</label>
            <div className="space-y-1.5">
              {['All', 'Month-to-month', 'One year', 'Two year'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleChange('contract', opt)}
                  className={`w-full py-2 px-3 rounded-lg border text-left font-medium transition-colors flex items-center justify-between ${
                    filters.contract === opt
                      ? 'bg-[#2684FF]/20 border-[#2684FF] text-[#19C5E8]'
                      : 'bg-[#12243F] border-[#263B59] text-[#9BAFC8] hover:text-[#F5F7FA]'
                  }`}
                >
                  <span>{opt === 'All' ? 'All Contracts' : opt}</span>
                  {filters.contract === opt && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Internet Service */}
          <div>
            <label className="block font-medium text-[#F5F7FA] mb-2">Internet Service Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['All', 'DSL', 'Fiber optic', 'No'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleChange('internetService', opt)}
                  className={`py-2 px-3 rounded-lg border text-center font-medium transition-colors ${
                    filters.internetService === opt
                      ? 'bg-[#2684FF] border-[#2684FF] text-white'
                      : 'bg-[#12243F] border-[#263B59] text-[#9BAFC8] hover:text-[#F5F7FA]'
                  }`}
                >
                  {opt === 'All' ? 'All Services' : opt === 'No' ? 'No Internet' : opt}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block font-medium text-[#F5F7FA] mb-2">Billing & Payment Method</label>
            <div className="space-y-1.5">
              {[
                { id: 'All', label: 'All Payment Methods' },
                { id: 'Electronic check', label: 'Electronic check (High Churn)' },
                { id: 'Mailed check', label: 'Mailed check' },
                { id: 'Bank transfer (automatic)', label: 'Bank transfer (automatic)' },
                { id: 'Credit card (automatic)', label: 'Credit card (automatic)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleChange('paymentMethod', opt.id)}
                  className={`w-full py-2 px-3 rounded-lg border text-left font-medium transition-colors flex items-center justify-between ${
                    filters.paymentMethod === opt.id
                      ? 'bg-[#2684FF]/20 border-[#2684FF] text-[#19C5E8]'
                      : 'bg-[#12243F] border-[#263B59] text-[#9BAFC8] hover:text-[#F5F7FA]'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {filters.paymentMethod === opt.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Tenure Range (Months) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-medium text-[#F5F7FA]">Tenure Range (Months)</label>
              <span className="font-mono text-[#19C5E8] font-semibold text-xs tabular-nums">
                {filters.tenureMin}m – {filters.tenureMax}m
              </span>
            </div>
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#9BAFC8] w-7">Min:</span>
                <input
                  type="range"
                  min="0"
                  max="72"
                  value={filters.tenureMin}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val <= filters.tenureMax) handleChange('tenureMin', val);
                  }}
                  className="flex-1 accent-[#2684FF]"
                />
                <span className="font-mono text-[11px] text-[#F5F7FA] w-6 text-right tabular-nums">
                  {filters.tenureMin}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#9BAFC8] w-7">Max:</span>
                <input
                  type="range"
                  min="0"
                  max="72"
                  value={filters.tenureMax}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= filters.tenureMin) handleChange('tenureMax', val);
                  }}
                  className="flex-1 accent-[#2684FF]"
                />
                <span className="font-mono text-[11px] text-[#F5F7FA] w-6 text-right tabular-nums">
                  {filters.tenureMax}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-[#263B59] flex items-center gap-3 bg-[#0B1830]">
          <button
            onClick={resetFilters}
            className="flex-1 py-2.5 px-3 rounded-lg border border-[#263B59] bg-[#12243F] text-[#9BAFC8] hover:text-[#F5F7FA] text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-lg bg-[#2684FF] text-white hover:bg-[#2684FF]/90 text-xs font-semibold flex items-center justify-center transition-colors shadow-sm"
          >
            <span>Apply & View</span>
          </button>
        </div>
      </div>
    </div>
  );
};
