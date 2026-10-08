import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  TrendingUp, 
  Server, 
  HardDrive, 
  DollarSign, 
  Users, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { formatLKR, formatGB } from '../utils/formatters';

interface PricingCalculatorModalProps {
  serverMonthlyCostLkr: number;
  isOpen: boolean;
  onClose: () => void;
}

export const PricingCalculatorModal: React.FC<PricingCalculatorModalProps> = ({
  serverMonthlyCostLkr,
  isOpen,
  onClose,
}) => {
  const [costInput, setCostInput] = useState<number>(serverMonthlyCostLkr || 2150);
  const [sellingPricePerGb, setSellingPricePerGb] = useState<number>(12); // LKR 12 per GB
  const [avgClientGb, setAvgClientGb] = useState<number>(50); // e.g. 50 GB package
  const [projectedClients, setProjectedClients] = useState<number>(15);

  if (!isOpen) return null;

  // Break even calculations
  const pricePerClient = avgClientGb * sellingPricePerGb;
  const breakEvenGb = sellingPricePerGb > 0 ? Math.ceil(costInput / sellingPricePerGb) : 0;
  const breakEvenClients = pricePerClient > 0 ? Math.ceil(costInput / pricePerClient) : 0;

  // Projected calculations based on slider
  const totalGbProjected = projectedClients * avgClientGb;
  const totalRevenueProjected = projectedClients * pricePerClient;
  const projectedProfit = totalRevenueProjected - costInput;
  const projectedMargin = totalRevenueProjected > 0 
    ? (projectedProfit / totalRevenueProjected) * 100 
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                Break-Even & Profit Calculator
              </h4>
              <p className="text-[11px] text-slate-400">
                Simulate data pricing vs. monthly server bills (Leaseweb SG)
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
        <div className="p-5 space-y-5 max-h-[85vh] overflow-y-auto">
          
          {/* Input parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Server Cost */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Server Cost (LKR/mo)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={costInput}
                onChange={(e) => setCostInput(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">e.g. Leaseweb SG: 2,150</span>
            </div>

            {/* Selling price per GB */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Selling Price (LKR/GB)
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={sellingPricePerGb}
                onChange={(e) => setSellingPricePerGb(parseFloat(e.target.value) || 1)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">e.g. LKR 10 - 15 / GB</span>
            </div>

            {/* Avg GB package per client */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Package Size (GB)
              </label>
              <input
                type="number"
                min="10"
                step="5"
                value={avgClientGb}
                onChange={(e) => setAvgClientGb(parseFloat(e.target.value) || 10)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                = {formatLKR(pricePerClient)} / client
              </span>
            </div>
          </div>

          {/* Break-even Targets */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Break-Even Requirements
            </h5>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-3">
                <div className="text-xs text-slate-400">Total GB to Break Even</div>
                <div className="text-2xl font-bold text-cyan-400 mt-1">
                  {breakEvenGb} GB
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  at {formatLKR(sellingPricePerGb)}/GB
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-3">
                <div className="text-xs text-slate-400">Clients Needed</div>
                <div className="text-2xl font-bold text-indigo-400 mt-1">
                  {breakEvenClients} client{breakEvenClients !== 1 ? 's' : ''}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  buying {avgClientGb} GB ({formatLKR(pricePerClient)})
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Projected Simulation Slider */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Simulate Client Count: <span className="text-cyan-400 text-sm font-bold">{projectedClients} Clients</span>
              </label>
              <span className="text-xs text-slate-400 font-medium">
                {totalGbProjected.toLocaleString()} GB / 30,000 GB (30 TB)
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="150"
              value={projectedClients}
              onChange={(e) => setProjectedClients(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-500 cursor-pointer"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800/80">
              <span>
                Server Capacity Used: <strong className="text-cyan-400">{((totalGbProjected / 30000) * 100).toFixed(1)}%</strong> of 30 TB
              </span>
              <span>
                Remaining Headroom: <strong className="text-slate-200">{(30000 - totalGbProjected).toLocaleString()} GB</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
              <div>
                <div className="text-[11px] text-slate-400">Total Revenue</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {formatLKR(totalRevenueProjected)}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-400">Net Profit</div>
                <div className={`text-sm font-bold mt-0.5 ${
                  projectedProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {projectedProfit >= 0 ? '+' : ''}{formatLKR(projectedProfit)}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-400">Profit Margin</div>
                <div className={`text-sm font-bold mt-0.5 ${
                  projectedProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {projectedMargin.toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
