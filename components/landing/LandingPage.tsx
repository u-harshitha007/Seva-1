'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface LandingPageProps {
  onLaunch: () => void;
}

const FEATURES = [
  {
    tag: 'LIVE MAP',
    title: 'Bangalore Road Map',
    desc: 'Real-time map of 12 major intersections across Bangalore with live traffic status.',
  },
  {
    tag: 'AI ALERTS',
    title: 'Hazard Detection',
    desc: 'AI predicts collisions, flooding, congestion, and pedestrian risks before they happen.',
  },
  {
    tag: 'CCTV',
    title: 'Live Camera Feeds',
    desc: 'Watch live road footage from Silk Board, MG Road, Marathahalli, Hebbal and more.',
  },
  {
    tag: 'SIGNALS',
    title: 'Adaptive Signals',
    desc: 'Traffic signals automatically adjust based on real-time vehicle density data.',
  },
  {
    tag: 'ANALYTICS',
    title: 'Traffic Analytics',
    desc: 'Live charts showing risk trends, vehicle density, and environmental conditions.',
  },
  {
    tag: 'REPORT',
    title: 'Report Incidents',
    desc: 'Citizens can report road hazards, waterlogging, and accidents directly from the app.',
  },
];

const STATS = [
  { value: '12', label: 'Monitored Junctions' },
  { value: '9',  label: 'Live Camera Feeds'   },
  { value: '94%', label: 'AI Accuracy'         },
  { value: '<15ms', label: 'Response Time'     },
];

const LOAD_STEPS = [
  'Connecting to sensor network...',
  'Loading Bangalore map...',
  'Starting AI prediction engine...',
  'Initialising CCTV feeds...',
  'System ready.',
];

export function LandingPage({ onLaunch }: LandingPageProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadText, setLoadText] = useState('');

  function handleLaunch() {
    setLoading(true);
    let step = 0;
    const interval = setInterval(() => {
      setLoadText(LOAD_STEPS[step]);
      setProgress(((step + 1) / LOAD_STEPS.length) * 100);
      step++;
      if (step >= LOAD_STEPS.length) {
        clearInterval(interval);
        setTimeout(onLaunch, 400);
      }
    }, 380);
  }

  return (
    <div className="min-h-screen bg-[#07090f] grid-bg flex flex-col">
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,212,255,0.04) 0%, transparent 65%)' }}
      />

      {/* ── Nav ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-slate-800/50">
        <div className="flex items-center gap-2.5">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <rect x="8" y="1" width="4" height="18" rx="1.5" fill="#00d4ff"/>
            <rect x="1" y="8" width="18" height="4" rx="1.5" fill="#00d4ff" opacity="0.4"/>
            <rect x="9.5" y="3.5" width="1" height="2.5" rx="0.5" fill="#07090f"/>
            <rect x="9.5" y="14" width="1" height="2.5" rx="0.5" fill="#07090f"/>
          </svg>
          <span className="text-base font-bold text-white tracking-wider">RASTA Cortex</span>
          <span
            className="hidden sm:inline text-[10px] font-bold mono px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}
          >
            BETA
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/about"
            className="text-xs text-slate-500 hover:text-cyan-400 transition-colors duration-150 font-medium"
          >
            Features
          </Link>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 mono">System Online</span>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        {/* City badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6"
          style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.18)', color: '#7dd3fc' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Bangalore, Karnataka — Smart City Initiative
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mb-4"
        >
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight grad-text leading-none mb-2">
            RASTA Cortex
          </h1>
          <p className="text-base sm:text-lg text-slate-400 font-medium">
            Bangalore's Real-Time Road Intelligence Platform
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
          className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8"
        >
          Monitor live traffic conditions, view CCTV feeds, receive AI-powered hazard alerts,
          and report road incidents — all in one place, free for every Bangalorean.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap justify-center gap-6 mb-10"
        >
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-black mono text-white">{s.value}</div>
              <div className="text-xs text-slate-600 mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.42 }}
          className="mb-4"
        >
          <AnimatePresence mode="wait">
            {!loading ? (
              <motion.button
                key="btn"
                onClick={handleLaunch}
                className="px-8 py-3.5 rounded-xl text-sm font-bold tracking-wide"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.18), rgba(123,47,255,0.18))',
                  border: '1px solid rgba(0,212,255,0.4)',
                  color: '#e0f2fe',
                }}
                whileHover={{ scale: 1.02, borderColor: 'rgba(0,212,255,0.65)' }}
                whileTap={{ scale: 0.98 }}
                aria-label="Open the RASTA Cortex traffic dashboard"
              >
                Open Traffic Dashboard — Free
              </motion.button>
            ) : (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-72 mx-auto space-y-2.5"
              >
                <p className="text-xs text-cyan-400 mono">{loadText}</p>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg,#00d4ff,#7b2fff)' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.25 }}
                  />
                </div>
                <p className="text-[10px] text-slate-700 mono">{Math.round(progress)}% — Loading</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-xs text-slate-700"
        >
          No sign-up required · Works in your browser · Free for all citizens
        </motion.p>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-14 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left w-full max-w-3xl"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 + i * 0.06 }}
              className="card p-4 hover:border-slate-700/80 transition-colors duration-200"
            >
              <div
                className="text-[9px] font-bold mono mb-2 px-1.5 py-0.5 rounded inline-block"
                style={{ color: '#00d4ff', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}
              >
                {f.tag}
              </div>
              <div className="text-xs font-bold text-white mb-1">{f.title}</div>
              <div className="text-[11px] text-slate-500 leading-relaxed">{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-slate-800/50 px-6 py-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-700">
          <span>RASTA Cortex · Bangalore Smart City · 2026</span>
          <div className="flex items-center gap-4">
            <span>Data updates every 1.5 seconds</span>
            <span>·</span>
            <span>AI-powered · Open source</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
