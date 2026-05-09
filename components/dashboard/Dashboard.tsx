'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { AlertFeed } from './AlertFeed';
import { AnalyticsPanel } from './AnalyticsPanel';
import { NodeDetailPanel } from './NodeDetailPanel';
import { CctvPanel } from './CctvPanel';
import { ReportModal } from './ReportModal';

const BangaloreMap = dynamic(
  () => import('./BangaloreMap').then(m => ({ default: m.BangaloreMap })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#07090f]">
        <div className="text-center space-y-3">
          <div className="w-7 h-7 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 mono">Loading Bangalore map...</p>
        </div>
      </div>
    ),
  }
);

export type View = 'map' | 'cctv' | 'analytics' | 'alerts';

export function Dashboard() {
  const state = useSocket();
  const [selectedNodeId, setSelectedNodeId]   = useState<string | null>(null);
  const [view, setView]                       = useState<View>('map');
  const [reportOpen, setReportOpen]           = useState(false);
  const [sidebarOpen, setSidebarOpen]         = useState(true);

  const selectedNode = state.nodes.find(n => n.id === selectedNodeId) ?? null;
  const selectedPred = state.predictions.find(p => p.nodeId === selectedNodeId) ?? null;
  const criticalCount = state.nodes.filter(n => n.status === 'critical').length;

  return (
    <div className="h-screen w-screen bg-[#07090f] grid-bg flex flex-col overflow-hidden">
      <div className="scan-line" />

      {/* Topbar */}
      <Topbar
        health={state.health}
        connected={state.connected}
        view={view}
        onViewChange={v => { setView(v); setSelectedNodeId(null); }}
        criticalCount={criticalCount}
      />

      {/* Body */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* Left sidebar — collapsible */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              key="sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 208, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden shrink-0"
            >
              <Sidebar
                nodes={state.nodes}
                selectedNodeId={selectedNodeId}
                onSelect={setSelectedNodeId}
                onReport={(id) => { setSelectedNodeId(id); setReportOpen(true); }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(v => !v)}
          className="absolute left-0 bottom-6 z-[500] flex items-center justify-center w-5 h-10 rounded-r-md transition-colors"
          style={{
            background: 'rgba(8,20,40,0.9)',
            border: '1px solid rgba(0,212,255,0.15)',
            borderLeft: 'none',
            color: '#6b7280',
            left: sidebarOpen ? '208px' : '0px',
            transition: 'left 0.2s',
          }}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          title={sidebarOpen ? 'Collapse' : 'Expand'}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            {sidebarOpen
              ? <path d="M7 1L3 5l4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              : <path d="M3 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            }
          </svg>
        </button>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <AnimatePresence mode="wait">

            {/* MAP */}
            {view === 'map' && (
              <motion.div
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 relative overflow-hidden"
              >
                <BangaloreMap
                  nodes={state.nodes}
                  selectedNodeId={selectedNodeId}
                  onSelectNode={setSelectedNodeId}
                />

                {/* Node detail overlay */}
                <AnimatePresence>
                  {selectedNode && (
                    <motion.div
                      key={selectedNode.id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-3 right-3 w-72 z-[1000]"
                    >
                      <NodeDetailPanel
                        node={selectedNode}
                        prediction={selectedPred}
                        onClose={() => setSelectedNodeId(null)}
                        onReport={() => setReportOpen(true)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Report incident FAB */}
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => setReportOpen(true)}
                  className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all duration-150"
                  style={{
                    background: 'rgba(8,20,40,0.92)',
                    border: '1px solid rgba(249,115,22,0.35)',
                    color: '#f97316',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                  }}
                  whileHover={{ scale: 1.03, borderColor: 'rgba(249,115,22,0.6)' }}
                  whileTap={{ scale: 0.97 }}
                  aria-label="Report a road incident"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  Report Incident
                </motion.button>

                {/* Map legend */}
                <div
                  className="absolute bottom-5 right-3 z-[1000] px-3 py-2 rounded-lg"
                  style={{ background: 'rgba(8,20,40,0.88)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <p className="text-[9px] text-slate-600 uppercase tracking-widest mb-1.5">Risk Level</p>
                  {[
                    { color: '#22c55e', label: 'Safe' },
                    { color: '#f59e0b', label: 'Caution' },
                    { color: '#f97316', label: 'High' },
                    { color: '#ef4444', label: 'Critical' },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5 mb-1">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                      <span className="text-[10px] text-slate-500">{l.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CCTV */}
            {view === 'cctv' && (
              <motion.div
                key="cctv"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 overflow-hidden"
              >
                <CctvPanel nodes={state.nodes} />
              </motion.div>
            )}

            {/* ANALYTICS */}
            {view === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 overflow-y-auto p-4"
              >
                <AnalyticsPanel nodes={state.nodes} trafficFlows={state.trafficFlows} />
              </motion.div>
            )}

            {/* ALERTS */}
            {view === 'alerts' && (
              <motion.div
                key="alerts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 overflow-hidden p-4"
              >
                <AlertFeed alerts={state.alerts} eventLog={state.eventLog} fullPage />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Right panel — alert feed (map + cctv) */}
        {(view === 'map' || view === 'cctv') && (
          <div className="w-64 border-l border-slate-800/60 overflow-hidden flex flex-col shrink-0">
            <AlertFeed alerts={state.alerts} eventLog={state.eventLog} />
          </div>
        )}
      </div>

      {/* Report modal */}
      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        nodes={state.nodes}
        preselectedNodeId={selectedNodeId}
      />
    </div>
  );
}
