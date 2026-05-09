'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LandingPage } from '@/components/landing/LandingPage';
import dynamic from 'next/dynamic';

// Lazy-load the entire dashboard to avoid SSR issues
const Dashboard = dynamic(
  () => import('@/components/dashboard/Dashboard').then(m => ({ default: m.Dashboard })),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-screen bg-[#07090f] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 mono">Initializing RASTA Cortex...</p>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const [launched, setLaunched] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!launched ? (
        <motion.div
          key="landing"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <LandingPage onLaunch={() => setLaunched(true)} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="h-screen w-screen overflow-hidden"
        >
          <Dashboard />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
