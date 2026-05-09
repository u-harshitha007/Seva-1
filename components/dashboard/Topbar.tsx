'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { SystemHealth } from '@/types';
import { formatUptime } from '@/lib/utils';
import { View } from './Dashboard';
import { HelpModal } from './HelpModal';

interface TopbarProps {
  health: SystemHealth | null;
  connected: boolean;
  view: View;
  onViewChange: (v: View) => void;
  criticalCount: number;
}

const VIEWS: { id: View; label: string; title: string; shortLabel: string }[] = [
  { id: 'map',       label: 'Live Map',   shortLabel: 'Map',       title: 'Real-time Bangalore traffic map' },
  { id: 'cctv',      label: 'CCTV',       shortLabel: 'CCTV',      title: 'Live road camera feeds'          },
  { id: 'analytics', label: 'Analytics',  shortLabel: 'Stats',     title: 'Traffic charts and trends'       },
  { id: 'alerts',    label: 'Alerts',     shortLabel: 'Alerts',    title: 'AI hazard alert stream'          },
];

export function Topbar({ health, connected, view, onViewChange, criticalCount }: TopbarProps) {
  const [helpOpen, setHelpOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const h = health;

  return (
    <>
      {/* Critical advisory banner */}
      <AnimatePresence>
        {criticalCount > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden shrink-0"
            style={{ background: 'rgba(239,68,68,0.12)', borderBottom: '1px solid rgba(239,68,68,0.25)' }}
          >
            <div className="px-4 py-1.5 flex items-center gap-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              <p className="text-xs text-red-300 font-medium">
                <span className="font-bold">{criticalCount} critical hazard{criticalCount > 1 ? 's' : ''} detected</span>
                <span className="hidden sm:inline"> — Exercise caution on affected routes. Check the Alerts tab for details.</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main topbar */}
      <header className="h-11 border-b border-slate-800/60 flex items-center px-3 sm:px-4 gap-2 sm:gap-3 shrink-0 bg-[#07090f]/95 backdrop-blur-sm">

        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <rect x="8" y="1" width="4" height="18" rx="1.5" fill="#00d4ff"/>
            <rect x="1" y="8" width="18" height="4" rx="1.5" fill="#00d4ff" opacity="0.4"/>
            <rect x="9.5" y="3.5" width="1" height="2.5" rx="0.5" fill="#07090f"/>
            <rect x="9.5" y="14" width="1" height="2.5" rx="0.5" fill="#07090f"/>
          </svg>
          <span className="text-sm font-bold text-white tracking-wide hidden xs:block sm:block">RASTA Cortex</span>
          <span className="text-sm font-bold text-white tracking-wide xs:hidden sm:hidden">RC</span>
          <span className="hidden lg:block text-[10px] text-slate-600 mono">Bangalore Traffic</span>
        </div>

        <div className="w-px h-4 bg-slate-800 shrink-0" />

        {/* Nav tabs — desktop (md+) */}
        <nav className="hidden md:flex items-center gap-0.5" role="navigation" aria-label="Main navigation">
          {VIEWS.map(v => (
            <button
              key={v.id}
              onClick={() => onViewChange(v.id)}
              title={v.title}
              aria-current={view === v.id ? 'page' : undefined}
              className="relative px-3 py-1 rounded text-xs font-medium transition-colors duration-100"
              style={{ color: view === v.id ? '#00d4ff' : '#6b7280' }}
            >
              {view === v.id && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 rounded"
                  style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.18)' }}
                  transition={{ duration: 0.12 }}
                />
              )}
              <span className="relative z-10">{v.label}</span>
            </button>
          ))}
        </nav>

        {/* Nav tabs — mobile (sm, compact labels) */}
        <nav className="flex md:hidden items-center gap-0.5 overflow-x-auto scrollbar-none" role="navigation" aria-label="Main navigation">
          {VIEWS.map(v => (
            <button
              key={v.id}
              onClick={() => onViewChange(v.id)}
              title={v.title}
              aria-current={view === v.id ? 'page' : undefined}
              className="relative px-2.5 py-1 rounded text-[11px] font-medium transition-colors duration-100 whitespace-nowrap shrink-0"
              style={{ color: view === v.id ? '#00d4ff' : '#6b7280' }}
            >
              {view === v.id && (
                <motion.div
                  layoutId="tab-bg-mobile"
                  className="absolute inset-0 rounded"
                  style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.18)' }}
                  transition={{ duration: 0.12 }}
                />
              )}
              <span className="relative z-10">{v.shortLabel}</span>
            </button>
          ))}
        </nav>

        <div className="flex-1" />

        {/* System stats — desktop only */}
        <div className="hidden lg:flex items-center gap-4 text-[11px]">
          <Stat label="Nodes"    value={`${h?.onlineNodes ?? 0}/${h?.totalNodes ?? 0}`} color="#00d4ff" />
          <Stat label="Alerts"   value={h?.activeAlerts ?? 0}  color={h?.activeAlerts ? '#f59e0b' : '#22c55e'} />
          <Stat label="Avg Risk" value={`${h?.avgRiskScore ?? 0}%`} color="#f59e0b" />
          <Stat label="Uptime"   value={formatUptime(h?.systemUptime ?? 0)} color="#7b2fff" />
        </div>

        <div className="w-px h-4 bg-slate-800 shrink-0 hidden lg:block" />

        {/* Help — hidden on mobile to save space */}
        <button
          onClick={() => setHelpOpen(true)}
          className="hidden sm:block px-2.5 py-1 rounded text-[11px] font-medium text-slate-500 hover:text-slate-300 transition-colors"
          aria-label="Help and information"
          title="Help"
        >
          Help
        </button>

        {/* Features link */}
        <Link
          href="/about"
          className="hidden sm:block px-2.5 py-1 rounded text-[11px] font-medium text-slate-500 hover:text-cyan-400 transition-colors duration-150"
          title="Features & capabilities"
        >
          Features
        </Link>

        {/* Mobile overflow menu (≤sm) */}
        <div className="relative sm:hidden">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:text-slate-300 transition-colors"
            aria-label="More options"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/>
            </svg>
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-9 z-[600] w-40 rounded-xl overflow-hidden"
                style={{ background: 'rgba(8,20,40,0.97)', border: '1px solid rgba(0,212,255,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}
              >
                <Link
                  href="/about"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-3 text-xs text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Features
                </Link>
                <button
                  onClick={() => { setHelpOpen(true); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-xs text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  Help
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Connection indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: connected ? '#22c55e' : '#ef4444' }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-[11px] mono hidden sm:block" style={{ color: connected ? '#22c55e' : '#ef4444' }}>
            {connected ? 'Live' : 'Offline'}
          </span>
        </div>
      </header>

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-slate-700">{label}</span>
      <span className="font-bold mono" style={{ color }}>{value}</span>
    </div>
  );
}
