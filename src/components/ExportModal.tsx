import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  FileJson, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { ClientSale, VpnExpense } from '../types';
import { formatMonthName } from '../utils/formatters';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMonth: string;
  expenses: VpnExpense[];
  sales: ClientSale[];
  onImportData: (data: { expenses?: VpnExpense[]; sales?: ClientSale[] }) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  currentMonth,
  expenses,
  sales,
  onImportData,
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // Export Sales to CSV
  const handleExportSalesCsv = () => {
    const headers = ['Client Name', 'Contact', 'Data Sold (GB)', 'Payment Received (LKR)', 'Agreed Price (LKR)', 'Status', 'Payment Method', 'Server Node', 'Protocol', 'Date Sold', 'Expiry Date', 'Notes'];
    const rows = sales.map((s) => [
      `"${s.clientName.replace(/"/g, '""')}"`,
      `"${(s.clientContact || '').replace(/"/g, '""')}"`,
      s.dataSoldGb,
      s.paymentReceivedLkr,
      s.agreedPriceLkr || s.paymentReceivedLkr,
      s.status,
      `"${(s.paymentMethod || '').replace(/"/g, '""')}"`,
      `"${(s.serverName || '').replace(/"/g, '""')}"`,
      `"${(s.protocol || '').replace(/"/g, '""')}"`,
      s.dateSold || '',
      s.expiryDate || '',
      `"${(s.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vpn_client_sales_${currentMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Expenses to CSV
  const handleExportExpensesCsv = () => {
    const headers = ['Expense Name', 'Category', 'Monthly Cost (LKR)', 'Location', 'Billing Cycle', 'Renewal Day', 'Notes'];
    const rows = expenses.map((e) => [
      `"${e.name.replace(/"/g, '""')}"`,
      e.category,
      e.costLkr,
      `"${(e.location || '').replace(/"/g, '""')}"`,
      e.billingCycle,
      e.renewalDayOfMonth,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vpn_server_expenses_${currentMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export full JSON backup
  const handleExportJson = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      currentMonth,
      expenses,
      sales,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement('a');
    link.setAttribute('href', jsonString);
    link.setAttribute('download', `vpn_backup_${currentMonth}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import JSON backup
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.expenses || parsed.sales) {
          onImportData({
            expenses: parsed.expenses,
            sales: parsed.sales,
          });
          setImportStatus('Backup restored successfully!');
          setTimeout(() => {
            setImportStatus(null);
            onClose();
          }, 1500);
        } else {
          setImportStatus('Invalid backup file format');
        }
      } catch (err) {
        setImportStatus('Failed to read file JSON');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Export & Backup Data</h4>
              <p className="text-[11px] text-slate-400">
                Data for {formatMonthName(currentMonth)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {importStatus && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              {importStatus}
            </div>
          )}

          {/* CSV Exports */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Export to Spreadsheet (CSV)
            </h5>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExportSalesCsv}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                Export Sales CSV
              </button>

              <button
                type="button"
                onClick={handleExportExpensesCsv}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-rose-400" />
                Export Expenses CSV
              </button>
            </div>
          </div>

          {/* JSON Backup & Restore */}
          <div className="pt-2 border-t border-slate-800/80">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Full Data Backup & Restore (JSON)
            </h5>
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleExportJson}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <FileJson className="w-4 h-4 text-indigo-400" />
                Download Complete JSON Backup
              </button>

              <label className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700/80 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-slate-400" />
                Import & Restore JSON Backup
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
