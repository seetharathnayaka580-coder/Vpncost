import React, { useState } from 'react';
import { 
  Server, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Download, 
  ArrowRight, 
  ShieldCheck, 
  CloudCheck,
  TrendingUp
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
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
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = usernameInput.trim();
    const cleanPass = passwordInput.trim();

    if (!cleanUser) {
      setError('Please enter your username');
      return;
    }
    if (!cleanPass) {
      setError('Please enter your password');
      return;
    }
    if (cleanPass.length < 3) {
      setError('Password must be at least 3 characters');
      return;
    }

    setError(null);
    onLogin(cleanUser, cleanPass);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Ambient background glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
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

        {/* Install Chrome App Button (Small & Compact) */}
        <button
          type="button"
          onClick={onOpenInstallModal}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/90 hover:bg-slate-700/90 text-cyan-300 border border-slate-700/80 hover:border-cyan-500/40 transition shadow-xs active:scale-95 cursor-pointer"
          title="Install Chrome App"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-medium">
            {isInstalled ? 'App Ready' : 'Install Chrome App'}
          </span>
        </button>
      </header>

      {/* Main Login Card Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl shadow-2xl backdrop-blur-xl p-6 sm:p-8 space-y-6">
            
            {/* Header info */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-800/80">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Authorized Access Only</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white pt-1">
                Operator Sign In
              </h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Enter your credentials to access the ledger.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username Input */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="username" 
                  className="block text-xs font-medium text-slate-300"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={usernameInput}
                    onChange={(e) => {
                      setUsernameInput(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Username"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition tracking-wide font-mono"
                    autoFocus
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="password" 
                  className="block text-xs font-medium text-slate-300"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition tracking-wide font-mono"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-xs text-rose-300">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-3 py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition active:scale-[0.99] group cursor-pointer"
              >
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-3 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <CloudCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Auto Firestore Sync</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Real-time LKR Ledger</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto px-4 py-4 text-center text-xs text-slate-500">
        <p>VPN Reseller & Expense Tracker &bull; Cloud Synchronized</p>
      </footer>
    </div>
  );
};
