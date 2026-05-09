'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NodeData } from '@/types';
import { getRiskColor } from '@/lib/utils';

// User-provided Bangalore road video IDs + 1 search results embed
const CCTV_FEEDS = [
  {
    id: 'CAM-01',
    nodeId: 'NODE-01',
    label: 'Silk Board Junction',
    location: 'Hosur Rd / Outer Ring Rd',
    type: 'youtube' as const,
    youtubeId: '_YltHpZ1MrI',
  },
  {
    id: 'CAM-02',
    nodeId: 'NODE-05',
    label: 'MG Road Corridor',
    location: 'MG Road, Central Bangalore',
    type: 'youtube' as const,
    youtubeId: 'EjY-T5gsfa0',
  },
  {
    id: 'CAM-03',
    nodeId: 'NODE-02',
    label: 'Marathahalli Bridge',
    location: 'Outer Ring Rd, East Bangalore',
    type: 'youtube' as const,
    youtubeId: '6yLbS7Tq5uY',
  },
  {
    id: 'CAM-04',
    nodeId: 'NODE-04',
    label: 'Hebbal Flyover',
    location: 'NH 44, North Bangalore',
    type: 'youtube' as const,
    youtubeId: 'YALM4UjTUic',
  },
  {
    id: 'CAM-05',
    nodeId: 'NODE-06',
    label: 'Marathahalli Road Search',
    location: 'Bangalore Road Videos',
    type: 'search' as const,
    searchQuery: 'BANGLORE+road+video+marathalli',
  },
  {
    id: 'CAM-06',
    nodeId: 'NODE-07',
    label: 'Yeshwanthpur Circle',
    location: 'Tumkur Rd, North Bangalore',
    type: 'youtube' as const,
    youtubeId: 'j4zjfXmBT5E',
  },
  {
    id: 'CAM-07',
    nodeId: 'NODE-08',
    label: 'Jayanagar 4th Block',
    location: 'South Bangalore',
    type: 'youtube' as const,
    youtubeId: 'k9AnyPTfQ9M',
  },
  {
    id: 'CAM-08',
    nodeId: 'NODE-11',
    label: 'Koramangala 80ft Rd',
    location: 'Koramangala, Bangalore',
    type: 'youtube' as const,
    youtubeId: 'JMF6Xng6rpQ',
  },
  {
    id: 'CAM-09',
    nodeId: 'NODE-12',
    label: 'Indiranagar 100ft Rd',
    location: 'Indiranagar, Bangalore',
    type: 'youtube' as const,
    youtubeId: 'Nbd8HOTtf00',
  },
];

const SIGNAL_COLORS: Record<string, string> = {
  green:     '#22c55e',
  yellow:    '#f59e0b',
  red:       '#ef4444',
  emergency: '#ef4444',
};

interface CctvPanelProps {
  nodes: NodeData[];
}

function getEmbedSrc(feed: typeof CCTV_FEEDS[0], autoplay: boolean): string {
  if (feed.type === 'search') {
    return `https://www.youtube.com/embed?listType=search&list=${feed.searchQuery}&autoplay=${autoplay ? 1 : 0}&mute=1&controls=1&modestbranding=1&rel=0`;
  }
  return `https://www.youtube.com/embed/${feed.youtubeId}?autoplay=${autoplay ? 1 : 0}&mute=1&controls=1&modestbranding=1&rel=0&loop=1&playlist=${feed.youtubeId}`;
}

function getExpandSrc(feed: typeof CCTV_FEEDS[0]): string {
  if (feed.type === 'search') {
    return `https://www.youtube.com/embed?listType=search&list=${feed.searchQuery}&autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`;
  }
  return `https://www.youtube.com/embed/${feed.youtubeId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`;
}

// ── Expanded fullscreen modal ──────────────────────────────────────────────
function ExpandedModal({
  feed,
  node,
  onClose,
}: {
  feed: typeof CCTV_FEEDS[0];
  node: NodeData | undefined;
  onClose: () => void;
}) {
  const riskColor = node ? getRiskColor(node.riskScore) : '#22c55e';
  const sigColor  = node ? (SIGNAL_COLORS[node.signalState] ?? '#22c55e') : '#22c55e';

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[2000] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="relative w-full max-w-5xl mx-4 rounded-xl overflow-hidden"
        style={{ border: `1px solid ${riskColor}35`, background: '#0a0f1a' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-bold text-white">{feed.label}</span>
            <span className="text-xs text-slate-600 mono">{feed.id} · {feed.location}</span>
          </div>
          <div className="flex items-center gap-5">
            {node && (
              <>
                <span className="text-xs mono">
                  <span className="text-slate-600">RISK </span>
                  <span className="font-bold" style={{ color: riskColor }}>{Math.round(node.riskScore)}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sigColor }} />
                  <span className="text-xs mono font-bold uppercase" style={{ color: sigColor }}>{node.signalState}</span>
                </div>
              </>
            )}
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-white transition-colors text-xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Video */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={getExpandSrc(feed)}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            style={{ border: 'none' }}
            title={feed.label}
          />
        </div>

        {/* Stats bar */}
        {node && (
          <div className="px-5 py-3 grid grid-cols-5 gap-4 border-t border-slate-800/60">
            {[
              { label: 'Vehicles',   value: `${Math.round(node.vehicleDensity)}%`,    color: '#00d4ff' },
              { label: 'Waterlog',   value: `${Math.round(node.waterloggingRisk)}%`,  color: '#3b82f6' },
              { label: 'Crowd',      value: `${Math.round(node.crowdDensity)}%`,      color: '#a855f7' },
              { label: 'Visibility', value: `${Math.round(node.ambientVisibility)}%`, color: '#22c55e' },
              { label: 'Temp',       value: `${Math.round(node.temperature)}°C`,      color: '#f97316' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-[9px] text-slate-600 uppercase tracking-widest">{s.label}</div>
                <div className="text-sm font-bold mono mt-0.5" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Single feed tile ───────────────────────────────────────────────────────
function FeedTile({
  feed,
  node,
  onExpand,
}: {
  feed: typeof CCTV_FEEDS[0];
  node: NodeData | undefined;
  onExpand: () => void;
}) {
  const riskColor = node ? getRiskColor(node.riskScore) : '#22c55e';
  const sigColor  = node ? (SIGNAL_COLORS[node.signalState] ?? '#22c55e') : '#22c55e';

  return (
    <div
      className="rounded-lg overflow-hidden group"
      style={{ border: '1px solid rgba(255,255,255,0.07)', background: '#0a0f1a' }}
    >
      {/* Video — always embedded, always playing muted */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={getEmbedSrc(feed, true)}
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          style={{ border: 'none' }}
          title={feed.label}
          loading="lazy"
        />

        {/* LIVE badge */}
        <div
          className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.72)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[9px] font-bold text-white mono tracking-widest">LIVE</span>
        </div>

        {/* Risk badge */}
        {node && (
          <div
            className="absolute top-2 right-2 px-2 py-0.5 rounded mono pointer-events-none"
            style={{
              background: 'rgba(0,0,0,0.75)',
              border: `1px solid ${riskColor}45`,
              color: riskColor,
              fontSize: '9px',
              fontWeight: 700,
            }}
          >
            RISK {Math.round(node.riskScore)}
          </div>
        )}

        {/* Signal */}
        {node && (
          <div
            className="absolute bottom-2 right-2 flex items-center gap-1 pointer-events-none"
            style={{ background: 'rgba(0,0,0,0.72)', borderRadius: '4px', padding: '2px 6px' }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sigColor }} />
            <span className="text-[9px] mono font-bold uppercase" style={{ color: sigColor }}>
              {node.signalState}
            </span>
          </div>
        )}

        {/* Expand button — appears on hover */}
        <button
          onClick={onExpand}
          className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.0)' }}
          title="Expand"
        >
          <div
            className="px-3 py-1.5 rounded-lg text-xs font-bold mono tracking-widest"
            style={{
              background: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              pointerEvents: 'none',
            }}
          >
            EXPAND
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-slate-200 truncate">{feed.label}</div>
          <div className="text-[9px] text-slate-600 mono mt-0.5 truncate">{feed.id} · {feed.location}</div>
        </div>
        {node && (
          <div className="text-right shrink-0 ml-2">
            <div className="text-[9px] text-slate-600">Vehicles</div>
            <div className="text-xs font-bold mono" style={{ color: '#00d4ff' }}>
              {Math.round(node.vehicleDensity)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main panel ─────────────────────────────────────────────────────────────
export function CctvPanel({ nodes }: CctvPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const expandedFeed = CCTV_FEEDS.find(f => f.id === expandedId);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-slate-800/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">CCTV Feeds</span>
          <span className="text-xs mono text-slate-600">— Bangalore Road Cameras</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] mono text-slate-600">
          <span>{CCTV_FEEDS.length} feeds</span>
          <span>·</span>
          <span className="text-green-500">LIVE</span>
        </div>
      </div>

      {/* Tip */}
      <div className="px-4 py-1.5 border-b border-slate-800/30 bg-slate-900/20">
        <p className="text-[10px] text-slate-700 mono">
          Hover any feed and click EXPAND for fullscreen with audio · All feeds muted by default
        </p>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {CCTV_FEEDS.map(feed => (
            <FeedTile
              key={feed.id}
              feed={feed}
              node={nodes.find(n => n.id === feed.nodeId)}
              onExpand={() => setExpandedId(feed.id)}
            />
          ))}
        </div>
      </div>

      {/* Expanded modal */}
      <AnimatePresence>
        {expandedFeed && (
          <ExpandedModal
            feed={expandedFeed}
            node={nodes.find(n => n.id === expandedFeed.nodeId)}
            onClose={() => setExpandedId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
