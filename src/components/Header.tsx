import React from 'react';
import { 
  Server, 
  Calculator, 
  Download, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Wifi,
  TrendingUp,
  TrendingDown,
  CloudCheck,
  Loader2,
  User,
  LogOut,
  MonitorCheck
} from 'lucide-react';
import { formatLKR, formatMonthName } from '../utils/formatters';
import { MonthSummary } from '../types';

interface HeaderProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
  summary: MonthSummary;
  isSyncing: boolean;
  currentUser: string;
  onLogout: () => void;
  onOpenCalculator: () => void;
  onOpenExport: () => void;
  onResetData: () => void;
  onOpenInstallModal: () => void;
  isInstalled: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentMonth,
  onMonthChange,
  summary,
  isSyncing,
  currentUser,
  onLogout,
  onOpenCalculator,
  onOpenExport,
  onResetData,
  onOpenInstallModal,
  isInstalled,
}) => {
  const [yearStr, monthStr] = currentMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  const handlePrevMonth = () => {
    let newYear = year;
    let newMonth = month - 1;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    onMonthChange(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    let newYear = year;
    let newMonth = month + 1;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    onMonthChange(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  const isProfitable = summary.netProfitLkr >= 0;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3.5">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
              <Server className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  VPN Cost & Data Reseller
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">
                  <Wifi className="w-3 h-3 mr-1" /> Bandwidth Ledger
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Track server bills, client bandwidth sales, and net monthly profits in LKR
              </p>
            </div>
          </div>

          {/* Month Selector & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Month Navigator */}
            <div className="flex items-center bg-slate-800/90 border border-slate-700/70 rounded-lg p-0.5 shadow-inner">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-slate-700 rounded-md text-slate-300 hover:text-white transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="px-2.5 py-1 flex items-center gap-1.5 text-xs font-medium text-slate-200">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span className="min-w-[100px] text-center font-semibold">
                  {formatMonthName(currentMonth)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-slate-700 rounded-md text-slate-300 hover:text-white transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Profit Badge */}
            <div
              className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
                isProfitable
                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-800 text-rose-300'
              }`}
            >
              {isProfitable ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span>
                Net: {formatLKR(summary.netProfitLkr)} ({summary.profitMarginPercent.toFixed(0)}%)
              </span>
            </div>

            {/* Automatic Firebase Cloud Sync Status */}
            <div 
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/90 border border-emerald-800/80 text-emerald-300 shadow-xs"
              title="All data is automatically synchronized with Firebase Firestore in real-time"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span className="text-cyan-300 hidden sm:inline">Syncing</span>
                </>
              ) : (
                <>
                  <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold hidden sm:inline">Synced</span>
                  <span className="text-emerald-300 font-semibold sm:hidden">Cloud</span>
                </>
              )}
            </div>

            {/* Chrome App Shortcut Install Button */}
            <button
              type="button"
              onClick={onOpenInstallModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-900/60 to-blue-900/60 hover:from-cyan-800/80 hover:to-blue-800/80 text-cyan-200 border border-cyan-700/60 hover:border-cyan-500 transition shadow-xs"
              title="Install Chrome App or Add Home Screen Shortcut"
            >
              <MonitorCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">{isInstalled ? 'App Ready' : 'Install Chrome App'}</span>
              <span className="sm:hidden">{isInstalled ? 'App' : 'Install'}</span>
            </button>

            {/* Break-even / Pricing Simulator */}
            <button
              type="button"
              onClick={onOpenCalculator}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors shadow-sm"
              title="Calculate Break-Even & Profit per GB"
            >
              <Calculator className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Simulator</span>
            </button>

            {/* Export & Backup */}
            <button
              type="button"
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Export CSV or Backup Data"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden lg:inline">Backup</span>
            </button>

            {/* Reset / Sample Data */}
            <button
              type="button"
              onClick={onResetData}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
              title="Load Sample Leaseweb Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Logged in User Badge & Logout */}
            <div className="flex items-center pl-1 border-l border-slate-800 gap-1.5">
              <div 
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-xs font-mono text-cyan-300"
                title={`Logged in as operator: ${currentUser}`}
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="max-w-[100px] truncate font-medium">{currentUser}</span>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-300 hover:bg-slate-800 rounded-lg transition"
                title="Switch User / Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
