import React, { useState, useEffect } from 'react';
import {
  Database,
  Terminal,
  Play,
  Copy,
  Check,
  AlertCircle,
  Clock,
  Download,
  Info,
  ChevronDown,
} from 'lucide-react';
import { CustomerRecord } from '../types/churn';
import {
  BUSINESS_SQL_QUESTIONS,
  executeSqlQuery,
  initSqlDatabase,
} from '../utils/sqlRunner';
import { exportToCsv } from '../utils/export';

interface SqlAnalyticsProps {
  records: CustomerRecord[];
}

export const SqlAnalytics: React.FC<SqlAnalyticsProps> = ({ records }) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Custom SQL Console state
  const [customQuery, setCustomQuery] = useState<string>(
    `SELECT Contract, PaymentMethod, COUNT(*) AS total_users, ROUND(AVG(MonthlyCharges), 2) AS avg_monthly_bill, SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) AS churned_count, ROUND(100.0 * SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) / COUNT(*), 2) AS churn_rate_pct FROM telco_churn GROUP BY Contract, PaymentMethod ORDER BY churn_rate_pct DESC LIMIT 10;`
  );
  const [customResult, setCustomResult] = useState<{
    success: boolean;
    data?: any[];
    columns?: string[];
    error?: string;
    executionTimeMs: number;
  } | null>(null);

  // Pre-computed query results for the 10 questions
  const [questionResults, setQuestionResults] = useState<{
    [id: number]: { data?: any[]; columns?: string[]; executionTimeMs: number };
  }>({});

  // Ensure SQL table is loaded and execute all 10 queries
  useEffect(() => {
    initSqlDatabase(records);

    const resultsMap: {
      [id: number]: { data?: any[]; columns?: string[]; executionTimeMs: number };
    } = {};

    BUSINESS_SQL_QUESTIONS.forEach((q) => {
      const res = executeSqlQuery(q.query);
      if (res.success) {
        resultsMap[q.id] = {
          data: res.data,
          columns: res.columns,
          executionTimeMs: res.executionTimeMs,
        };
      }
    });

    setQuestionResults(resultsMap);

    // Run initial custom query
    const initCustom = executeSqlQuery(customQuery);
    setCustomResult(initCustom);
  }, [records]);

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunCustomQuery = () => {
    const res = executeSqlQuery(customQuery);
    setCustomResult(res);
  };

  const currentQ = BUSINESS_SQL_QUESTIONS.find((q) => q.id === selectedQuestionId) || BUSINESS_SQL_QUESTIONS[0];
  const currentRes = questionResults[currentQ.id];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-xl bg-[#12243F] border border-[#263B59] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#2684FF]" />
            <h3 className="text-sm font-semibold text-[#F5F7FA]">SQLite In-Memory Relational Engine</h3>
          </div>
          <p className="text-xs text-[#9BAFC8] mt-1">
            Running direct SQL DQL queries against table <code className="text-[#19C5E8] font-mono">telco_churn</code> ({records.length.toLocaleString()} rows).
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-[#0B1830] border border-[#263B59] text-emerald-400 font-medium">
            SQLite Dialect Active
          </span>
          <span className="px-2.5 py-1 rounded bg-[#0B1830] border border-[#263B59] text-[#19C5E8]">
            10 Standard Questions Ready
          </span>
        </div>
      </div>

      {/* Grid: Left Column (10 Business Questions Selector) & Right Column (SQL Query, Execution Result & Interpretation) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 10 Questions Navigation List */}
        <div className="lg:col-span-5 space-y-2">
          <div className="text-xs uppercase font-semibold text-[#9BAFC8] px-1 tracking-wider">
            10 Core Business Questions
          </div>
          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {BUSINESS_SQL_QUESTIONS.map((q) => {
              const isSelected = selectedQuestionId === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuestionId(q.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 group ${
                    isSelected
                      ? 'bg-[#12243F] border-[#2684FF] shadow-sm'
                      : 'bg-[#0B1830] border-[#263B59] hover:bg-[#12243F]/60'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? 'bg-[#2684FF] text-white'
                        : 'bg-[#12243F] border border-[#263B59] text-[#9BAFC8] group-hover:text-[#19C5E8]'
                    }`}
                  >
                    {q.id}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-medium leading-snug line-clamp-2 ${
                        isSelected ? 'text-[#F5F7FA]' : 'text-[#9BAFC8] group-hover:text-[#F5F7FA]'
                      }`}
                    >
                      {q.question}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Question Inspector */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-xl bg-[#12243F] border border-[#263B59] space-y-4">
            {/* Title & Copy */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-[#19C5E8]">
                  Business Investigation #{currentQ.id}
                </span>
                <h4 className="text-sm font-bold text-[#F5F7FA] mt-0.5 leading-snug">
                  {currentQ.question}
                </h4>
              </div>
              <button
                onClick={() => handleCopy(currentQ.id, currentQ.query)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0B1830] border border-[#263B59] text-xs text-[#9BAFC8] hover:text-[#F5F7FA] transition-colors shrink-0 font-medium"
              >
                {copiedId === currentQ.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL</span>
                  </>
                )}
              </button>
            </div>

            {/* SQL Code Block */}
            <div className="relative rounded-lg bg-[#081426] border border-[#263B59] p-3.5 overflow-x-auto font-mono text-xs text-[#19C5E8] leading-relaxed">
              <pre className="whitespace-pre-wrap">{currentQ.query}</pre>
            </div>

            {/* Execution Result Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#9BAFC8]">
                <span className="font-semibold text-[#F5F7FA]">Query Execution Output</span>
                {currentRes && (
                  <span className="font-mono text-[11px] text-[#19C5E8]">
                    ⏱ {currentRes.executionTimeMs} ms · {currentRes.data?.length || 0} rows returned
                  </span>
                )}
              </div>

              {currentRes && currentRes.data && currentRes.data.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-[#263B59] bg-[#0B1830]">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="bg-[#12243F] border-b border-[#263B59] text-[#9BAFC8]">
                        {currentRes.columns?.map((col) => (
                          <th key={col} className="py-2 px-3 font-semibold">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#263B59]/60">
                      {currentRes.data.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#12243F]/50">
                          {currentRes.columns?.map((col) => (
                            <td key={col} className="py-2 px-3 text-[#F5F7FA] whitespace-nowrap">
                              {row[col] !== null && row[col] !== undefined ? String(row[col]) : 'NULL'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-[#0B1830] border border-[#263B59] text-center text-xs text-[#9BAFC8]">
                  Executing query against SQLite table...
                </div>
              )}
            </div>

            {/* Business Interpretation Box */}
            <div className="p-3.5 rounded-lg bg-[#0B1830] border border-[#263B59] text-xs text-[#9BAFC8] space-y-1">
              <div className="font-semibold text-[#F5F7FA] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#19C5E8]" />
                <span>Executive Business Interpretation:</span>
              </div>
              <p className="leading-relaxed pl-5">{currentQ.interpretation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Live SQL Console */}
      <div className="p-5 rounded-xl bg-[#12243F] border border-[#263B59] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#19C5E8]" />
            <h4 className="text-sm font-semibold text-[#F5F7FA]">Interactive SQLite Query Console</h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (customResult?.data) {
                  exportToCsv(customResult.data, 'sql_query_result');
                }
              }}
              disabled={!customResult?.data || customResult.data.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1830] border border-[#263B59] text-xs text-[#9BAFC8] hover:text-[#F5F7FA] disabled:opacity-40 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Result (CSV)</span>
            </button>
            <button
              onClick={handleRunCustomQuery}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#2684FF] text-white hover:bg-[#2684FF]/90 text-xs font-semibold transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Execute SQL</span>
            </button>
          </div>
        </div>

        {/* Textarea for custom query */}
        <div className="relative">
          <textarea
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            rows={3}
            placeholder="SELECT * FROM telco_churn WHERE MonthlyCharges > 80 LIMIT 10;"
            className="w-full p-3.5 rounded-lg bg-[#081426] border border-[#263B59] font-mono text-xs text-[#F5F7FA] placeholder-[#9BAFC8]/50 focus:outline-hidden focus:border-[#2684FF] resize-y"
          />
        </div>

        {/* Console Result Output */}
        {customResult && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#9BAFC8]">
                Status:{' '}
                <strong className={customResult.success ? 'text-emerald-400' : 'text-red-400'}>
                  {customResult.success ? 'Query Succeeded' : 'Syntax / Execution Error'}
                </strong>
              </span>
              <span className="text-[#19C5E8]">
                {customResult.executionTimeMs} ms · {customResult.data?.length || 0} rows
              </span>
            </div>

            {customResult.error ? (
              <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/40 text-xs font-mono text-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{customResult.error}</span>
              </div>
            ) : customResult.data && customResult.data.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-[#263B59] bg-[#0B1830] max-h-64">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead className="sticky top-0 bg-[#12243F]">
                    <tr className="border-b border-[#263B59] text-[#9BAFC8]">
                      {customResult.columns?.map((col) => (
                        <th key={col} className="py-2 px-3 font-semibold">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#263B59]/60">
                    {customResult.data.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#12243F]/50">
                        {customResult.columns?.map((col) => (
                          <td key={col} className="py-2 px-3 text-[#F5F7FA] whitespace-nowrap">
                            {row[col] !== null && row[col] !== undefined ? String(row[col]) : 'NULL'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-[#0B1830] border border-[#263B59] text-center text-xs text-[#9BAFC8]">
                0 records matched query.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
