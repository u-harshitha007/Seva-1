'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

const SECTIONS = [
  {
    title: 'Live Map',
    content: 'The map shows 12 major Bangalore intersections monitored in real time. Each marker colour indicates the current risk level — green is safe, yellow is caution, orange is high risk, and red is critical. Click any marker to see detailed sensor data for that junction.',
  },
  {
    title: 'CCTV Feeds',
    content: 'Watch live road footage from cameras across Bangalore including Silk Board, MG Road, Marathahalli, Hebbal, and more. Click any feed tile to activate it. Hover and click EXPAND for fullscreen view with audio.',
  },
  {
    title: 'Analytics',
    content: 'View live charts showing average risk score over time, vehicle density trends, per-node risk comparison, and environmental data (temperature, humidity). Data updates every 1.5 seconds.',
  },
  {
    title: 'Alerts',
    content: 'The AI engine continuously analyses sensor data and generates hazard alerts. Each alert shows the severity level (low / medium / high / critical), the affected junction, confidence percentage, and the adaptive response that has been triggered.',
  },
  {
    title: 'Risk Score',
    content: 'Risk scores range from 0 to 100. They are calculated from vehicle density, waterlogging risk, crowd density, visibility, pedestrian activity, and obstacle detection. A score above 75 triggers emergency protocols.',
  },
  {
    title: 'Report an Incident',
    content: 'Use the "Report Incident" button on the map view to submit a road hazard report. Your report is sent to the traffic management system and may trigger an alert for other road users.',
  },
];

const LEGEND = [
  { color: '#22c55e', label: 'Safe (0–25)' },
  { color: '#f59e0b', label: 'Caution (25–50)' },
  { color: '#f97316', label: 'High Risk (50–75)' },
  { color: '#ef4444', label: 'Critical (75–100)' },
];

export function HelpModal({ open, onClose }: HelpModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[3000] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Help and information"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            className="card-bright w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-base font-bold text-white">How to use RASTA Cortex</h2>
                <p className="text-xs text-slate-500 mt-0.5">Bangalore's real-time traffic intelligence platform</p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-white transition-colors text-2xl leading-none ml-4"
                aria-label="Close help"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Risk legend */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Risk Level Legend</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {LEGEND.map(l => (
                    <div
                      key={l.label}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg"
                      style={{ background: `${l.color}10`, border: `1px solid ${l.color}30` }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                      <span className="text-xs text-slate-300">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-4">
                {SECTIONS.map((s, i) => (
                  <div key={i}>
                    <h3 className="text-sm font-semibold text-white mb-1">{s.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{s.content}</p>
                  </div>
                ))}
              </div>

              {/* Emergency note */}
              <div
                className="px-4 py-3 rounded-lg"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <p className="text-xs text-red-300 leading-relaxed">
                  <span className="font-bold">Emergency:</span> If you witness a road emergency, call{' '}
                  <span className="font-bold text-white">112</span> (Police) or{' '}
                  <span className="font-bold text-white">108</span> (Ambulance) immediately.
                  This platform is for information only and does not replace emergency services.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-800/60 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-700">RASTA Cortex v2.5 · Bangalore Smart City</span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors"
                style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.25)' }}
              >
                Got it
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
