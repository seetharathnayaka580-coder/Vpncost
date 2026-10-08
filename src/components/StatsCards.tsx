import React from 'react';
import { 
  Server, 
  DollarSign, 
  HardDrive, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  BarChart3,
  Cpu,
  Database,
  Globe,
  Gauge
} from 'lucide-react';
import { MonthSummary } from '../types';
import { formatLKR, formatGB } from '../utils/formatters';

interface StatsCardsProps {
  summary: MonthSummary;
  expensesCount: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ summary, expensesCount }) => {
  const isProfitable = summary.netProfitLkr >= 0;
  
  // Total bandwidth pool (fallback 30,000 GB if not yet calculated)
  const totalBandwidthGb = summary.totalBandwidthCapacityGb > 0 
    ? summary.totalBandwidthCapacityGb 
    : 30000; // 30 TB

  const remainingBandwidthGb = Math.max(0, totalBandwidthGb - summary.totalDataSoldGb);
  const bandwidthUsagePct = (summary.totalDataSoldGb / totalBandwidthGb) * 100;

  // Break-even calculation
  const avgPrice = summary.avgPricePerGb > 0 ? summary.avgPricePerGb : 12; // fallback LKR 12/GB
  const gbNeededForBreakEven = summary.totalExpenseLkr > 0 
    ? Math.ceil(summary.totalExpenseLkr / avgPrice) 
    : 0;

  const breakEvenPercent = summary.totalExpenseLkr > 0 
    ? Math.min(Math.round((summary.totalRevenueLkr / summary.totalExpenseLkr) * 100), 200)
    : 100;

  return (
    <div className="space-y-4">
      
      {/* Server Spec & 30TB Bandwidth Pool Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Node details */}
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-950/90 border border-cyan-800/80 flex items-center justify-center text-cyan-400 shrink-0 shadow-md">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-white text-base">
                  Leaseweb Singapore Server Node
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  <Globe className="w-3 h-3" /> DC: Singapore
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Monthly Cost: LKR 2,150
                </span>
              </div>

              {/* Hardware specifications pills */}
              <div className="flex items-center gap-2 mt-2 flex-wrap text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/90 text-slate-200 border border-slate-700/80 font-medium">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <strong>4 vCPU</strong>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/90 text-slate-200 border border-slate-700/80 font-medium">
                  <Gauge className="w-3.5 h-3.5 text-indigo-400" />
                  <strong>6 GB RAM</strong>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/90 text-slate-200 border border-slate-700/80 font-medium">
                  <Database className="w-3.5 h-3.5 text-amber-400" />
                  <strong>100 GB NVMe</strong>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800 font-bold">
                  🌐 30 TB Bandwidth Pool
                </span>
              </div>
            </div>
          </div>

          {/* Bandwidth pool quota meter */}
          <div className="lg:w-80 bg-slate-950/80 border border-slate-800/90 rounded-xl p-3.5 flex flex-col justify-between shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                Bandwidth Quota
              </span>
              <span className="font-bold text-white">
                {summary.totalDataSoldGb.toLocaleString()} / {(totalBandwidthGb / 1000).toFixed(0)} TB
              </span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 my-2 overflow-hidden border border-slate-700/60">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(bandwidthUsagePct, 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="text-cyan-400 font-medium">
                {bandwidthUsagePct < 1 ? '<1%' : `${bandwidthUsagePct.toFixed(1)}%`} used
              </span>
              <span className="text-slate-300">
                {remainingBandwidthGb.toLocaleString()} GB free
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Monthly Server Expenses */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-500/10 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Server Expenses
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-800/80 flex items-center justify-center text-rose-400">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">
              {formatLKR(summary.totalExpenseLkr)}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              <span>{expensesCount} active service{expensesCount !== 1 ? 's' : ''}</span>
              <span className="text-rose-400 font-medium">Leaseweb SG (LKR 2,150)</span>
            </div>
          </div>
        </div>

        {/* 2. Total Data Sold (GB) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Data Bandwidth Sold
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">
              {formatGB(summary.totalDataSoldGb)}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              <span>{summary.clientCount} client{summary.clientCount !== 1 ? 's' : ''} registered</span>
              <span className="text-cyan-400 font-medium">
                ~{formatLKR(summary.avgPricePerGb, { showCents: true })} / GB
              </span>
            </div>
          </div>
        </div>

        {/* 3. Monthly Revenue Received */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Revenue Received
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-800/80 flex items-center justify-center text-blue-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">
              {formatLKR(summary.totalRevenueLkr)}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs">
              {summary.totalPendingLkr > 0 ? (
                <span className="text-amber-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  {formatLKR(summary.totalPendingLkr)} pending
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> All collected
                </span>
              )}
              <span className="text-slate-500">
                Agreed: {formatLKR(summary.totalAgreedLkr)}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Net Profit / Loss */}
        <div className={`border rounded-xl p-5 shadow-sm relative overflow-hidden group transition-all ${
          isProfitable 
            ? 'bg-slate-900 border-emerald-900/60 hover:border-emerald-700' 
            : 'bg-slate-900 border-rose-900/60 hover:border-rose-700'
        }`}>
          <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none ${
            isProfitable ? 'bg-emerald-500/10' : 'bg-rose-500/10'
          }`} />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Net Profit / Loss
            </span>
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
              isProfitable 
                ? 'bg-emerald-950/80 border-emerald-800/80 text-emerald-400' 
                : 'bg-rose-950/80 border-rose-800/80 text-rose-400'
            }`}>
              {isProfitable ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-2xl font-bold tracking-tight ${
              isProfitable ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {summary.netProfitLkr >= 0 ? '+' : ''}{formatLKR(summary.netProfitLkr)}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              <span className={`font-semibold ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                {summary.profitMarginPercent.toFixed(1)}% margin
              </span>
              <span>
                Cost/GB: {formatLKR(summary.costPerGb, { showCents: true })}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Break-even & Cost Analysis Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-auto flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-800 text-indigo-400 shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              Monthly Cost Recovery & Break-Even
              {breakEvenPercent >= 100 ? (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Break-Even Achieved
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                  {breakEvenPercent}% of server cost covered
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {breakEvenPercent >= 100 ? (
                <>Your server expenses ({formatLKR(summary.totalExpenseLkr)}) are 100% covered. Every additional GB sold from your 30 TB capacity is pure profit!</>
              ) : (
                <>
                  You need to sell approximately <strong className="text-white">{gbNeededForBreakEven - summary.totalDataSoldGb} more GB</strong> (or collect <strong className="text-white">{formatLKR(summary.totalExpenseLkr - summary.totalRevenueLkr)}</strong>) to cover this month's server expenses.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Progress Bar & Rate pill */}
        <div className="w-full md:w-72 flex flex-col gap-1.5 shrink-0">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Expenses: {formatLKR(summary.totalExpenseLkr)}</span>
            <span className="font-semibold text-slate-200">
              {formatLKR(summary.totalRevenueLkr)} ({breakEvenPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700/60">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                breakEvenPercent >= 100
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-amber-500 to-orange-400'
              }`}
              style={{ width: `${Math.min(breakEvenPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>

    </div>
  );
};
