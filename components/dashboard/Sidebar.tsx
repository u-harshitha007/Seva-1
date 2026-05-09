'use client';

import { motion } from 'framer-motion';
import { NodeData } from '@/types';
import { getRiskColor } from '@/lib/utils';

interface SidebarProps {
  nodes: NodeData[];
  selectedNodeId: string | null;
  onSelect: (id: string | null) => void;
  onReport: (id: string) => void;
}

const STATUS_COLOR: Record<string, string> = {
  online:   '#22c55e',
  warning:  '#f59e0b',
  critical: '#ef4444',
  offline:  '#6b7280',
};

const SIGNAL_COLOR: Record<string, string> = {
  green:     '#22c55e',
  yellow:    '#f59e0b',
  red:       '#ef4444',
  emergency: '#ef4444',
};

const STATUS_LABEL: Record<string, string> = {
  online:   'Online',
  warning:  'Warning',
  critical: 'Critical',
  offline:  'Offline',
};

export function Sidebar({ nodes, selectedNodeId, onSelect, onReport }: SidebarProps) {
  const criticalNodes  = nodes.filter(n => n.status === 'critical').length;
  const warningNodes   = nodes.filter(n => n.status === 'warning').length;

  return (
    <aside
      className="w-52 border-r border-slate-800/60 flex flex-col overflow-hidden bg-[#07090f]/80 h-full"
      aria-label="Sensor node list"
    >
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-slate-800/60">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Junctions</span>
          <span className="text-[10px] mono text-cyan-600">{nodes.length} nodes</span>
        </div>
        {/* Summary pills */}
        <div className="flex gap-1.5">
          {criticalNodes > 0 && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded badge-critical">
              {criticalNodes} critical
            </span>
          )}
          {warningNodes > 0 && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded badge-medium">
              {warningNodes} warning
            </span>
          )}
          {criticalNodes === 0 && warningNodes === 0 && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded badge-low">
              All clear
            </span>
          )}
        </div>
      </div>

      {/* Node list */}
      <div className="flex-1 overflow-y-auto" role="list">
        {nodes.length === 0 && (
          <div className="px-3 py-8 text-center text-[11px] text-slate-700 mono">
            Connecting to network...
          </div>
        )}

        {nodes.map(node => {
          const isSelected = selectedNodeId === node.id;
          const riskColor  = getRiskColor(node.riskScore);
          const dotColor   = STATUS_COLOR[node.status] ?? '#6b7280';
          const sigColor   = SIGNAL_COLOR[node.signalState] ?? '#22c55e';

          return (
            <div
              key={node.id}
              role="listitem"
              className="relative border-b border-slate-800/30"
              style={{
                background:  isSelected ? 'rgba(0,212,255,0.05)' : 'transparent',
                borderLeft:  isSelected ? '2px solid #00d4ff' : '2px solid transparent',
              }}
            >
              {/* Critical flash */}
              {node.status === 'critical' && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'rgba(239,68,68,0.03)' }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              )}

              {/* Main row — clickable */}
              <button
                onClick={() => onSelect(isSelected ? null : node.id)}
                className="w-full text-left px-3 py-2.5 relative"
                aria-pressed={isSelected}
                aria-label={`${node.name} — Risk ${Math.round(node.riskScore)}, Status ${STATUS_LABEL[node.status]}`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: dotColor, boxShadow: `0 0 4px ${dotColor}80` }}
                      aria-hidden="true"
                    />
                    <span className="text-[11px] font-semibold text-slate-200 truncate">{node.name}</span>
                  </div>
                  <span className="text-[11px] mono font-bold shrink-0 ml-1" style={{ color: riskColor }}>
                    {Math.round(node.riskScore)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[9px] mono text-slate-700">{node.id}</span>
                  <span className="text-[9px] mono font-bold uppercase" style={{ color: sigColor }}>
                    {node.signalState}
                  </span>
                </div>

                {/* Risk bar */}
                <div className="mt-1.5 h-px bg-slate-800 rounded-full overflow-hidden" aria-hidden="true">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: riskColor }}
                    animate={{ width: `${node.riskScore}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </button>

              {/* Report button — shows on selected */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-3 pb-2"
                >
                  <button
                    onClick={() => onReport(node.id)}
                    className="w-full py-1 rounded text-[10px] font-semibold transition-colors"
                    style={{
                      background: 'rgba(249,115,22,0.08)',
                      border: '1px solid rgba(249,115,22,0.25)',
                      color: '#f97316',
                    }}
                    aria-label={`Report incident at ${node.name}`}
                  >
                    Report Incident
                  </button>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-3 py-2.5 border-t border-slate-800/60">
        <p className="text-[9px] text-slate-700 uppercase tracking-widest mb-1.5">Status</p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          {Object.entries(STATUS_COLOR).map(([s, c]) => (
            <div key={s} className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c }} />
              <span className="text-[9px] text-slate-700 capitalize">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
