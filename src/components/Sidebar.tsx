import React from 'react';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  BarChart3,
  Sigma,
  Database,
  PieChart,
  Lightbulb,
  GraduationCap,
  Sparkles,
  Layers,
} from 'lucide-react';
import { PageId } from '../types/churn';

interface SidebarProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  totalRecords: number;
}

const NAV_ITEMS: { id: PageId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
  { id: 'explorer', label: 'Customer Data Explorer', icon: Users },
  { id: 'quality', label: 'Data Quality Report', icon: ShieldCheck },
  { id: 'eda', label: 'Exploratory Data Analysis', icon: BarChart3 },
  { id: 'statistics', label: 'Statistical Analysis', icon: Sigma },
  { id: 'sql', label: 'SQL Business Analytics', icon: Database },
  { id: 'segmentation', label: 'Customer Segmentation', icon: PieChart },
  { id: 'recommendations', label: 'Business Recommendations', icon: Lightbulb },
  { id: 'about', label: 'About Project', icon: GraduationCap },
];

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, totalRecords }) => {
  return (
    <aside className="w-68 shrink-0 bg-[#0B1830] border-r border-[#263B59] flex flex-col h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#263B59]/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#2684FF]/20 border border-[#2684FF]/40 flex items-center justify-center text-[#19C5E8] shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-tight text-[#F5F7FA] leading-tight">
              Customer Churn BI
            </h1>
            <p className="text-[11px] text-[#9BAFC8] font-normal leading-tight mt-0.5">
              Enterprise Retention Analytics
            </p>
          </div>
        </div>

        {/* Dataset Live Indicator */}
        <div className="mt-3.5 px-3 py-1.5 rounded-md bg-[#12243F] border border-[#263B59] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#19C5E8]" />
            <span className="text-[#9BAFC8] text-[11px] font-medium">IBM Telco Live</span>
          </div>
          <span className="font-mono text-[11px] text-[#F5F7FA] tabular-nums font-medium">
            {totalRecords.toLocaleString()} rows
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] uppercase font-semibold text-[#9BAFC8]/60 tracking-wider">
          Analytics Modules
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left group ${
                isActive
                  ? 'bg-[#2684FF] text-white shadow-sm shadow-[#2684FF]/20 font-semibold'
                  : 'text-[#9BAFC8] hover:text-[#F5F7FA] hover:bg-[#12243F]/80'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-[#9BAFC8] group-hover:text-[#19C5E8]'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* College Project Credit Footer */}
      <div className="p-4 border-t border-[#263B59]/80 bg-[#0B1830]">
        <div className="rounded-lg p-3 bg-[#12243F]/60 border border-[#263B59]">
          <div className="text-[11px] font-semibold text-[#F5F7FA] leading-tight">
            SNIST · CSE Data Science
          </div>
          <div className="text-[10px] text-[#9BAFC8] mt-1 leading-snug">
            G Mythili · K Ashiwith · D Niyati
          </div>
        </div>
      </div>
    </aside>
  );
};
