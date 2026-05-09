'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NodeData } from '@/types';

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  nodes: NodeData[];
  preselectedNodeId?: string | null;
}

const INCIDENT_TYPES = [
  'Waterlogging / Flooding',
  'Road Accident',
  'Pothole / Road Damage',
  'Traffic Signal Malfunction',
  'Fallen Tree / Debris',
  'Stalled Vehicle',
  'Pedestrian Hazard',
  'Other',
];

export function ReportModal({ open, onClose, nodes, preselectedNodeId }: ReportModalProps) {
  const [type, setType]         = useState('');
  const [nodeId, setNodeId]     = useState(preselectedNodeId ?? '');
  const [desc, setDesc]         = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (preselectedNodeId) setNodeId(preselectedNodeId);
  }, [preselectedNodeId]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!type || !nodeId) return;
    setSubmitting(true);
    // Simulate submission delay
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  }

  function handleClose() {
    setType('');
    setDesc('');
    setSubmitted(false);
    setSubmitting(false);
    onClose();
  }

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
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label="Report a road incident"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            className="card-bright w-full max-w-md overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-800/60 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">Report a Road Incident</h2>
                <p className="text-xs text-slate-500 mt-0.5">Help keep Bangalore roads safe</p>
              </div>
              <button onClick={handleClose} className="text-slate-500 hover:text-white transition-colors text-xl leading-none" aria-label="Close">×</button>
            </div>

            <div className="px-5 py-5">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    {/* Incident type */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5" htmlFor="incident-type">
                        Incident Type <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="incident-type"
                        value={type}
                        onChange={e => setType(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-lg text-sm text-white"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          outline: 'none',
                        }}
                      >
                        <option value="" disabled style={{ background: '#0a0f1a' }}>Select incident type...</option>
                        {INCIDENT_TYPES.map(t => (
                          <option key={t} value={t} style={{ background: '#0a0f1a' }}>{t}</option>
                        ))}
                      </select>
                    </div>

                    {/* Junction */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5" htmlFor="junction">
                        Nearest Junction <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="junction"
                        value={nodeId}
                        onChange={e => setNodeId(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-lg text-sm text-white"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          outline: 'none',
                        }}
                      >
                        <option value="" disabled style={{ background: '#0a0f1a' }}>Select junction...</option>
                        {nodes.map(n => (
                          <option key={n.id} value={n.id} style={{ background: '#0a0f1a' }}>{n.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5" htmlFor="description">
                        Description <span className="text-slate-600">(optional)</span>
                      </label>
                      <textarea
                        id="description"
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                        rows={3}
                        placeholder="Briefly describe what you observed..."
                        className="w-full px-3 py-2 rounded-lg text-sm text-white resize-none"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          outline: 'none',
                        }}
                      />
                    </div>

                    {/* Emergency note */}
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      For emergencies, call <span className="text-white font-bold">112</span> (Police) or <span className="text-white font-bold">108</span> (Ambulance).
                    </p>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting || !type || !nodeId}
                      className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-150"
                      style={{
                        background: (!type || !nodeId) ? 'rgba(255,255,255,0.04)' : 'rgba(0,212,255,0.15)',
                        border: (!type || !nodeId) ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,212,255,0.35)',
                        color: (!type || !nodeId) ? '#4b5563' : '#e0f2fe',
                        cursor: (!type || !nodeId) ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {submitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 space-y-3"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
                      style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Report Submitted</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Thank you. Your report has been sent to the traffic management system.
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="px-5 py-2 rounded-lg text-xs font-semibold text-white mt-2"
                      style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.25)' }}
                    >
                      Close
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
