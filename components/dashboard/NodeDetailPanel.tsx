'use client';

import { motion } from 'framer-motion';
import { NodeData, PredictionResult } from '@/types';
import { getRiskColor } from '@/lib/utils';

interface NodeDetailPanelProps {
  node: NodeData;
  prediction: PredictionResult | null;
  onClose: () => void;
  onReport?: () => void;
}

const SIGNAL_COLORS: Record<string, string> = {
  green:     '#22c55e',
  yellow:    '#f59e0b',
  red:       '#ef4444',
  emergency: '#ef4444',
};

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="text-slate-500">{label}</span>
        <span className="mono font-bold" style={{ color }}>{Math.round(value)}%</span>
      </div>
      <div className="h-px bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${Math.min(100, value)}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}

export function NodeDetailPanel({ node, prediction, onClose, onReport }: NodeDetailPanelProps) {
  const riskColor = getRiskColor(node.riskScore);
  const sigColor  = SIGNAL_COLORS[node.signalState] ?? '#22c55e';

  return (
    <div className="card-bright overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800/60 flex items-start justify-between">
        <div>
          <div className="text-sm font-bold text-white">{node.name}</div>
          <div className="text-[10px] text-slate-600 mono mt-0.5">{node.id} · {node.location.lat.toFixed(4)}, {node.location.lng.toFixed(4)}</div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-600 hover:text-slate-300 transition-colors text-lg leading-none mt-0.5 ml-3"
        >
          ×
        </button>
      </div>

      <div className="p-4 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
        {/* Risk + Signal */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-900/60 rounded-lg p-3 text-center border border-slate-800/60">
            <div className="text-[9px] text-slate-600 uppercase tracking-widest mb-1">Risk Score</div>
            <div className="text-2xl font-black mono" style={{ color: riskColor }}>
              {Math.round(node.riskScore)}
            </div>
          </div>
          <div className="bg-slate-900/60 rounded-lg p-3 text-center border border-slate-800/60">
            <div className="text-[9px] text-slate-600 uppercase tracking-widest mb-1">Signal</div>
            <div className="text-sm font-bold mono uppercase" style={{ color: sigColor }}>
              {node.signalState}
            </div>
            <div className="text-[9px] text-slate-600 mt-0.5 capitalize">{node.status}</div>
          </div>
        </div>

        {/* Sensor metrics */}
        <div className="space-y-2.5">
          <Bar label="Vehicle Density"   value={node.vehicleDensity}    color="#00d4ff" />
          <Bar label="Waterlogging Risk" value={node.waterloggingRisk}  color="#3b82f6" />
          <Bar label="Crowd Density"     value={node.crowdDensity}      color="#a855f7" />
          <Bar label="Visibility"        value={node.ambientVisibility} color="#22c55e" />
          <Bar label="Pedestrian Act."   value={node.pedestrianActivity}color="#f59e0b" />
        </div>

        {/* Environment */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/60">
          <EnvStat label="Temp"     value={`${Math.round(node.temperature)}°C`} />
          <EnvStat label="Humidity" value={`${Math.round(node.humidity)}%`} />
          <EnvStat label="Wind"     value={`${Math.round(node.windSpeed)} km/h`} />
        </div>

        {/* AI Prediction */}
        {prediction && (
          <div className="pt-3 border-t border-slate-800/60 space-y-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Prediction</span>
              <span className="text-[10px] mono text-purple-400">{Math.round(prediction.confidence)}% conf.</span>
            </div>
            <Bar label="Collision Risk"   value={prediction.collisionRisk}        color="#ef4444" />
            <Bar label="Flood Risk"       value={prediction.floodRisk}            color="#3b82f6" />
            <Bar label="Congestion Prob." value={prediction.congestionProbability} color="#f97316" />
            <Bar label="Pedestrian Risk"  value={prediction.pedestrianRisk}       color="#f59e0b" />
          </div>
        )}

        {/* Obstacle */}
        {node.obstacleDetected && (
          <div className="px-3 py-2 rounded-lg border border-orange-500/25 bg-orange-500/08">
            <span className="text-[11px] text-orange-400 font-semibold">Obstacle detected in lane</span>
          </div>
        )}

        {/* Report button */}
        {onReport && (
          <button
            onClick={onReport}
            className="w-full py-2 rounded-lg text-xs font-semibold transition-colors"
            style={{
              background: 'rgba(249,115,22,0.08)',
              border: '1px solid rgba(249,115,22,0.25)',
              color: '#f97316',
            }}
          >
            Report Incident at this Junction
          </button>
        )}
      </div>
    </div>
  );
}

function EnvStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-[9px] text-slate-600 uppercase tracking-widest">{label}</div>
      <div className="text-[11px] font-bold mono text-cyan-400 mt-0.5">{value}</div>
    </div>
  );
}
