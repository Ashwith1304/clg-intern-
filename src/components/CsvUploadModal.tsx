import React, { useState } from 'react';
import Papa from 'papaparse';
import { Upload, X, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { CustomerRecord } from '../types/churn';

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDatasetLoaded: (records: CustomerRecord[], sourceName: string) => void;
  onResetDefaultDataset: () => void;
}

export const CsvUploadModal: React.FC<CsvUploadModalProps> = ({
  isOpen,
  onClose,
  onDatasetLoaded,
  onResetDefaultDataset,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [stats, setStats] = useState<{
    totalRows: number;
    cleanedRows: number;
    missingTotalCharges: number;
    duplicatesRemoved: number;
    preview: CustomerRecord[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setError(null);
      parseFile(selected);
    }
  };

  const parseFile = (fileToParse: File) => {
    setParsing(true);
    setError(null);

    Papa.parse(fileToParse, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rawRows = results.data as any[];
          if (!rawRows || rawRows.length === 0) {
            throw new Error('The CSV file is empty.');
          }

          // Check required columns
          const requiredCols = ['customerID', 'gender', 'tenure', 'Contract', 'MonthlyCharges', 'Churn'];
          const firstRow = rawRows[0];
          const missingCols = requiredCols.filter((col) => !(col in firstRow));

          if (missingCols.length > 0) {
            throw new Error(
              `Invalid schema. Missing required columns: ${missingCols.join(', ')}. Please supply a valid Telco dataset.`
            );
          }

          let missingTotalCharges = 0;
          const seenIds = new Set<string>();
          const cleanedRecords: CustomerRecord[] = [];
          let duplicatesRemoved = 0;

          rawRows.forEach((row, idx) => {
            const customerID = row.customerID ? String(row.customerID).trim() : `CUST-${idx}`;
            if (seenIds.has(customerID)) {
              duplicatesRemoved++;
              return;
            }
            seenIds.add(customerID);

            // Clean TotalCharges
            const rawTot = row.TotalCharges !== undefined ? String(row.TotalCharges).trim() : '';
            let totalVal = 0;
            if (rawTot === '' || rawTot === ' ' || isNaN(Number(rawTot))) {
              missingTotalCharges++;
              totalVal = 0.0;
            } else {
              totalVal = parseFloat(rawTot);
            }

            cleanedRecords.push({
              customerID,
              gender: row.gender || 'Unknown',
              SeniorCitizen: Number(row.SeniorCitizen) === 1 ? 1 : 0,
              Partner: row.Partner === 'Yes' ? 'Yes' : 'No',
              Dependents: row.Dependents === 'Yes' ? 'Yes' : 'No',
              tenure: Math.max(0, parseInt(row.tenure, 10) || 0),
              PhoneService: row.PhoneService || 'No',
              MultipleLines: row.MultipleLines || 'No',
              InternetService: row.InternetService || 'No',
              OnlineSecurity: row.OnlineSecurity || 'No',
              OnlineBackup: row.OnlineBackup || 'No',
              DeviceProtection: row.DeviceProtection || 'No',
              TechSupport: row.TechSupport || 'No',
              StreamingTV: row.StreamingTV || 'No',
              StreamingMovies: row.StreamingMovies || 'No',
              Contract: row.Contract || 'Month-to-month',
              PaperlessBilling: row.PaperlessBilling === 'Yes' ? 'Yes' : 'No',
              PaymentMethod: row.PaymentMethod || 'Mailed check',
              MonthlyCharges: parseFloat(row.MonthlyCharges) || 0,
              TotalCharges: totalVal,
              Churn: row.Churn === 'Yes' ? 'Yes' : 'No',
            });
          });

          setStats({
            totalRows: rawRows.length,
            cleanedRows: cleanedRecords.length,
            missingTotalCharges,
            duplicatesRemoved,
            preview: cleanedRecords.slice(0, 3),
          });
          setParsing(false);
        } catch (err: any) {
          setError(err.message || 'Failed to parse CSV file.');
          setParsing(false);
        }
      },
      error: (err) => {
        setError(err.message || 'CSV parse error.');
        setParsing(false);
      },
    });
  };

  const handleApply = () => {
    if (stats && file) {
      // Re-read file parsed records
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rawRows = results.data as any[];
          const seenIds = new Set<string>();
          const cleanedRecords: CustomerRecord[] = [];

          rawRows.forEach((row, idx) => {
            const customerID = row.customerID ? String(row.customerID).trim() : `CUST-${idx}`;
            if (seenIds.has(customerID)) return;
            seenIds.add(customerID);

            const rawTot = row.TotalCharges !== undefined ? String(row.TotalCharges).trim() : '';
            let totalVal = 0;
            if (rawTot === '' || rawTot === ' ' || isNaN(Number(rawTot))) {
              totalVal = 0.0;
            } else {
              totalVal = parseFloat(rawTot);
            }

            cleanedRecords.push({
              customerID,
              gender: row.gender || 'Unknown',
              SeniorCitizen: Number(row.SeniorCitizen) === 1 ? 1 : 0,
              Partner: row.Partner === 'Yes' ? 'Yes' : 'No',
              Dependents: row.Dependents === 'Yes' ? 'Yes' : 'No',
              tenure: Math.max(0, parseInt(row.tenure, 10) || 0),
              PhoneService: row.PhoneService || 'No',
              MultipleLines: row.MultipleLines || 'No',
              InternetService: row.InternetService || 'No',
              OnlineSecurity: row.OnlineSecurity || 'No',
              OnlineBackup: row.OnlineBackup || 'No',
              DeviceProtection: row.DeviceProtection || 'No',
              TechSupport: row.TechSupport || 'No',
              StreamingTV: row.StreamingTV || 'No',
              StreamingMovies: row.StreamingMovies || 'No',
              Contract: row.Contract || 'Month-to-month',
              PaperlessBilling: row.PaperlessBilling === 'Yes' ? 'Yes' : 'No',
              PaymentMethod: row.PaymentMethod || 'Mailed check',
              MonthlyCharges: parseFloat(row.MonthlyCharges) || 0,
              TotalCharges: totalVal,
              Churn: row.Churn === 'Yes' ? 'Yes' : 'No',
            });
          });

          onDatasetLoaded(cleanedRecords, file.name);
          onClose();
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0B1830] border border-[#263B59] rounded-xl max-w-xl w-full overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#263B59] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Upload className="w-5 h-5 text-[#2684FF]" />
            <h3 className="text-sm font-semibold text-[#F5F7FA]">Dataset Integration & CSV Ingestion</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#9BAFC8] hover:text-[#F5F7FA] hover:bg-[#12243F] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 text-xs">
          <p className="text-[#9BAFC8] leading-relaxed">
            Upload your own Telco Customer Churn CSV dataset or reload the authentic IBM baseline (7,043 rows).
            The ingestion pipeline executes automatic schema validation, whitespace imputation for TotalCharges,
            and duplicate removal.
          </p>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-[#263B59] hover:border-[#2684FF] rounded-xl p-6 text-center bg-[#12243F]/40 transition-colors">
            <input
              type="file"
              accept=".csv"
              id="csvFileInput"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="csvFileInput" className="cursor-pointer flex flex-col items-center">
              <Upload className="w-8 h-8 text-[#19C5E8] mb-2" />
              <span className="text-[#F5F7FA] font-medium text-xs">Click to browse or drop CSV file here</span>
              <span className="text-[11px] text-[#9BAFC8] mt-1">Supports standard Kaggle IBM Telco format (.csv)</span>
            </label>
            {file && (
              <div className="mt-3 px-3 py-1.5 rounded-lg bg-[#0B1830] border border-[#263B59] inline-flex items-center gap-2 text-[#19C5E8] font-mono">
                <span>{file.name}</span>
                <span className="text-[#9BAFC8]">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/40 flex items-start gap-2.5 text-red-200">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Validation Stats */}
          {stats && (
            <div className="rounded-lg p-4 bg-[#12243F] border border-[#263B59] space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Dataset Ingestion & Validation Passed</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1 font-mono">
                <div className="p-2 rounded bg-[#0B1830] border border-[#263B59]">
                  <div className="text-[10px] text-[#9BAFC8]">Total Rows</div>
                  <div className="text-sm font-bold text-[#F5F7FA]">{stats.totalRows.toLocaleString()}</div>
                </div>
                <div className="p-2 rounded bg-[#0B1830] border border-[#263B59]">
                  <div className="text-[10px] text-[#9BAFC8]">Cleaned Rows</div>
                  <div className="text-sm font-bold text-[#19C5E8]">{stats.cleanedRows.toLocaleString()}</div>
                </div>
                <div className="p-2 rounded bg-[#0B1830] border border-[#263B59]">
                  <div className="text-[10px] text-[#9BAFC8]">Missing Imputed</div>
                  <div className="text-sm font-bold text-amber-400">{stats.missingTotalCharges}</div>
                </div>
                <div className="p-2 rounded bg-[#0B1830] border border-[#263B59]">
                  <div className="text-[10px] text-[#9BAFC8]">Duplicates</div>
                  <div className="text-sm font-bold text-slate-300">{stats.duplicatesRemoved}</div>
                </div>
              </div>
            </div>
          )}

          {/* Fallback to Default Telco Dataset */}
          <div className="pt-2 flex items-center justify-between border-t border-[#263B59]">
            <button
              onClick={() => {
                onResetDefaultDataset();
                onClose();
              }}
              className="text-xs text-[#9BAFC8] hover:text-[#19C5E8] flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to default IBM Telco baseline (7,043 rows)</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#263B59] bg-[#0B1830] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#263B59] bg-[#12243F] text-[#9BAFC8] hover:text-[#F5F7FA] text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!stats}
            className="px-5 py-2 rounded-lg bg-[#2684FF] text-white hover:bg-[#2684FF]/90 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold transition-colors shadow-sm"
          >
            Load into Analytics Engine
          </button>
        </div>
      </div>
    </div>
  );
};
