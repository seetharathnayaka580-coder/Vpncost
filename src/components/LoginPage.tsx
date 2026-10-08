import React, { useState } from 'react';
import { 
  Server, 
  Wifi, 
  Download, 
  UserCheck, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  LockOpen, 
  CloudCheck,
  Layers,
  TrendingUp,
  Cpu,
  MonitorCheck
} from 'lucide-react';
import { getRecentUsers } from '../utils/authSession';

interface LoginPageProps {
  onLogin: (username: string) => void;
  onOpenInstallModal: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onOpenInstallModal,
  isInstallable,
  isInstalled,
}) => {
  const [usernameInput, setUsernameInput] = useState<string>('operator-01');
  const [error, setError] = useState<string | null>(null);
  const recentUsers = getRecentUsers();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = usernameInput.trim();
    if (!clean) {
      setError('Please enter a username or operator ID (e.g. username-xxx)');
      return;
    }
    setError(null);
    onLogin(clean);
  };

  const handleSelectPreset = (name: string) => {
    setUsernameInput(name);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Ambient background glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
            <Server className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-white tracking-tight text-base sm:text-lg flex items-center gap-2">
              VPN Cost Ledger
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                PRO
              </span>
            </span>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Bandwidth Sales & Monthly Server Expense Manager
            </p>
          </div>
        </div>

        {/* Chrome App Shortcut Install Button */}
        <button
          type="button"
          onClick={onOpenInstallModal}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 transition shadow-sm active:scale-95"
          title="Install as Chrome desktop or mobile application"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isInstalled ? 'Chrome App Ready' : 'Install Chrome App'}</span>
        </button>
      </header>

      {/* Main Login Card Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl shadow-2xl backdrop-blur-xl p-6 sm:p-8 space-y-6">
            
            {/* Header info */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                <LockOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Password-Free Access (username-xxx)</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white pt-1">
                Operator Sign In
              </h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Enter your operator handle or username identifier to access your VPN expenses, sales, and client invoices.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label 
                  htmlFor="username" 
                  className="block text-xs font-medium text-slate-300"
                >
                  Reseller / Operator Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    value={usernameInput}
                    onChange={(e) => {
                      setUsernameInput(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="e.g. username-xxx or operator-01"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition tracking-wide"
                    autoFocus
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                    <UserCheck className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {error ? (
                  <p className="text-xs text-rose-400 mt-1">{error}</p>
                ) : (
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                    <ShieldCheck className="w-3 h-3 text-cyan-400 shrink-0" />
                    No password required — direct secure local ledger session
                  </p>
                )}
              </div>

              {/* Quick Preset Handles (username-xxx) */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-medium text-slate-400 block">
                  Quick Select Operator Handles:
                </span>
                <div className="flex flex-wrap gap-2">
                  {recentUsers.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition ${
                        usernameInput === preset
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-600 shadow-xs'
                          : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:border-slate-600'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                  {/* Additional suggestions matching user request */}
                  {['username-001', 'admin-master', 'reseller-sg'].map((preset) => (
                    !recentUsers.includes(preset) && (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition ${
                          usernameInput === preset
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-600 shadow-xs'
                            : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 border-slate-700/60'
                        }`}
                      >
                        {preset}
                      </button>
                    )
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition active:scale-[0.99] group cursor-pointer"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Install Chrome Shortcut Banner inside Card */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800/80 flex items-center justify-center shrink-0 text-cyan-400">
                    <MonitorCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">
                      Add Chrome App Shortcut
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      Launch full-screen from desktop or phone
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenInstallModal}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 shrink-0 transition"
                >
                  {isInstalled ? 'View App' : 'Add App'}
                </button>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <CloudCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Auto Firebase Cloud Sync</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Real-time LKR Profit/Loss</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto px-4 py-4 text-center text-xs text-slate-500">
        <p>VPN Reseller & Expense Tracker &bull; Offline & Cloud Synchronized</p>
      </footer>
    </div>
  );
};
