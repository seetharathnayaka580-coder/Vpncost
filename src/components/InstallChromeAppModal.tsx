import React from 'react';
import { 
  X, 
  Download, 
  Check, 
  Monitor, 
  Smartphone, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';

interface InstallChromeAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  onTriggerInstall: () => void;
}

export const InstallChromeAppModal: React.FC<InstallChromeAppModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isInstalled,
  isIOS,
  onTriggerInstall,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 px-6 py-5 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/40">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Install Chrome App Shortcut
              </h3>
              <p className="text-xs text-cyan-300 font-medium">
                VPN Cost & Bandwidth Ledger
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Status banner */}
          {isInstalled ? (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-700/60 flex items-start gap-3">
              <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-200">
                  Already Installed!
                </p>
                <p className="text-xs text-emerald-400/90 mt-0.5">
                  You are already running or have this application installed on your device.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/50 flex items-start gap-3">
              <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-cyan-200">One-Click Desktop / Mobile App:</span>{' '}
                Opens directly from your desktop or phone home screen with no browser search bars and full offline capability.
              </div>
            </div>
          )}

          {/* Direct Install Button (Chromium / PWA Prompt) */}
          {!isInstalled && (
            <div>
              <button
                type="button"
                onClick={onTriggerInstall}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition active:scale-[0.99]"
              >
                <Download className="w-4 h-4" />
                {isInstallable ? 'Install Chrome App Now' : 'Prompt Chrome App Install'}
              </button>
            </div>
          )}

          {/* Quick Step-by-Step Instructions */}
          <div className="space-y-3 pt-1 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              How to add shortcut in Google Chrome
            </h4>

            {/* Desktop Chrome Instructions */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Monitor className="w-4 h-4 text-cyan-400" />
                <span>Google Chrome (PC, Mac, Linux)</span>
              </div>
              <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside pl-1">
                <li>
                  Look at the right side of Chrome's address bar (URL bar).
                </li>
                <li>
                  Click the <strong className="text-cyan-300 font-medium">Install icon (⊕)</strong> or <strong className="text-cyan-300 font-medium">Computer with Down Arrow</strong>.
                </li>
                <li>
                  Alternatively, click <strong className="text-slate-200 font-medium">⋮ (Three dots)</strong> &rarr; <strong className="text-slate-200 font-medium">"Save and share"</strong> &rarr; <strong className="text-cyan-300 font-medium">"Install page as app"</strong> or <strong className="text-cyan-300 font-medium">"Create shortcut..."</strong> (check "Open as window").
                </li>
              </ol>
            </div>

            {/* Mobile Chrome Instructions */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>Google Chrome (Android Mobile)</span>
              </div>
              <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside pl-1">
                <li>
                  Tap the <strong className="text-slate-200 font-medium">⋮ (Menu)</strong> icon in top right corner.
                </li>
                <li>
                  Select <strong className="text-cyan-300 font-medium">"Add to Home screen"</strong> or <strong className="text-cyan-300 font-medium">"Install app"</strong>.
                </li>
                <li>
                  Confirm to add the VPN Cost icon to your phone app drawer.
                </li>
              </ol>
            </div>

            {/* iOS Safari Instructions */}
            {isIOS && (
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span>iPhone / iPad (Safari)</span>
                </div>
                <p className="text-xs text-slate-400">
                  Tap the <strong className="text-cyan-300">Share button</strong> (square with arrow up) &rarr; scroll down &rarr; tap <strong className="text-cyan-300">"Add to Home Screen"</strong>.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
