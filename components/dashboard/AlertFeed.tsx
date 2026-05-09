'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AIAlert } from '@/types';
import { getSeverityColor, timeAgo } from '@/lib/utils';

interface AlertFeedProps {
  alerts: AIAlert[];
  eventLog: string[];
  fullPage?: boolean;
}

const TYPE_LABEL: Record<string, string> = {
  collision:  'Collision Risk',
  flood:      'Flooding',
  congestion: 'Congestion',
  pedestrian: 'Pedestrian Risk',
  obstacle:   'Road Obstacle',
  visibility: 'Low Visibility',
  emergency:  'Emergency',
};

const SEV_CLASS: Record<string, string> = {
  critical: 'badge-critical',
  high:     'badge-high',
  medium:   'badge-medium',
  low:      'badge-low',
};

export function AlertFeed({ alerts, eventLog, fullPage = false }: AlertFeedProps) {
  const displayAlerts = alerts.slice(0, fullPage ? 60 : 15);

  return (
    <div className={`flex flex-col overflow-hidden h-full ${fullPage ? 'card-bright rounded-lg' : ''}`}>
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-slate-800/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            {fullPage ? 'Live Alert Stream' : 'Alerts'}
          </span>
        </div>
        <span className="text-[10px] mono text-slate-600">{alerts.length} active</span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto" role="feed" aria-label="Traffic alerts">
        {displayAlerts.length === 0 && (
          <div className="px-4 py-8 text-center space-y-1">
            <p className="text-sm text-slate-600">No active alerts</p>
            <p className="text-xs text-slate-700">All monitored junctions are clear</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {displayAlerts.map(alert => (
            <motion.article
              key={alert.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="border-b border-slate-800/30 px-3 py-3 relative"
              style={{ borderLeft: `2px solid ${getSeverityColor(alert.severity)}` }}
              aria-label={`${alert.severity} alert: ${alert.message}`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${SEV_CLASS[alert.severity] ?? ''}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {TYPE_LABEL[alert.type] ?? alert.type}
                  </span>
                </div>
                <time className="text-[9px] text-slate-700 mono shrink-0" dateTime={new Date(alert.timestamp).toISOString()}>
                  {timeAgo(alert.timestamp)}
                </time>
              </div>

              {/* Location */}
              <p className="text-[10px] text-slate-500 mb-1">{alert.nodeName}</p>

              {/* Message */}
              <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>

              {/* Meta */}
              <div className="mt-1.5 flex items-center gap-3 text-[9px] text-slate-700">
                <span>AI confidence: <span className="text-cyan-600 mono">{alert.confidence}%</span></span>
                <span>Radius: <span className="text-cyan-600 mono">{alert.predictedImpactRadius}m</span></span>
              </div>

              {/* Adaptive response */}
              {alert.adaptiveResponse && (
                <div
                  className="mt-2 px-2 py-1.5 rounded text-[10px] leading-relaxed"
                  style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.15)', color: '#86efac' }}
                >
                  System response: {alert.adaptiveResponse}
                </div>
              )}
            </motion.article>
          ))}
        </AnimatePresence>

        {/* System log — sidebar only */}
        {!fullPage && eventLog.length > 0 && (
          <div className="px-3 py-2.5 border-t border-slate-800/30">
            <p className="text-[9px] text-slate-700 uppercase tracking-widest mb-1.5">System Log</p>
            {eventLog.slice(0, 5).map((log, i) => (
              <p key={i} className="text-[9px] text-slate-700 mono leading-relaxed truncate mb-0.5">
                &gt; {log}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
