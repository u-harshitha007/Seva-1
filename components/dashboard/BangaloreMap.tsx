'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { NodeData } from '@/types';
import { getRiskColor } from '@/lib/utils';

// Fix Leaflet default icon paths in Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export interface BangaloreMapProps {
  nodes: NodeData[];
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
}

const SIGNAL_COLORS: Record<string, string> = {
  green:     '#22c55e',
  yellow:    '#f59e0b',
  red:       '#ef4444',
  emergency: '#ef4444',
};

const STATUS_COLORS: Record<string, string> = {
  online:   '#22c55e',
  warning:  '#f59e0b',
  critical: '#ef4444',
  offline:  '#6b7280',
};

function createNodeIcon(node: NodeData, isSelected: boolean): L.DivIcon {
  const riskColor  = getRiskColor(node.riskScore);
  const sigColor   = SIGNAL_COLORS[node.signalState] ?? '#22c55e';
  const outer      = isSelected ? 26 : 20;
  const inner      = Math.round(outer * 0.38);
  const pulse      = node.status === 'critical' || node.status === 'warning';
  const glowSize   = isSelected ? 18 : 10;

  const pulseHtml = pulse ? `
    <div style="
      position:absolute;inset:-7px;border-radius:50%;
      border:1.5px solid ${riskColor};opacity:0.6;
      animation:marker-pulse 1.8s ease-out infinite;
      pointer-events:none;
    "></div>` : '';

  const html = `
    <div style="position:relative;width:${outer}px;height:${outer}px;">
      ${pulseHtml}
      <div style="
        width:${outer}px;height:${outer}px;border-radius:50%;
        background:${riskColor}18;
        border:2px solid ${riskColor};
        box-shadow:0 0 ${glowSize}px ${riskColor}70;
        display:flex;align-items:center;justify-content:center;
        position:relative;z-index:1;
      ">
        <div style="
          width:${inner}px;height:${inner}px;border-radius:50%;
          background:${sigColor};
          box-shadow:0 0 5px ${sigColor};
        "></div>
      </div>
      ${isSelected ? `<div style="
        position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);
        font-size:9px;font-family:monospace;color:${riskColor};
        white-space:nowrap;font-weight:700;letter-spacing:0.03em;
        text-shadow:0 0 6px ${riskColor}80;
      ">${node.id}</div>` : ''}
    </div>`;

  return L.divIcon({
    html,
    className:   '',
    iconSize:    [outer, outer],
    iconAnchor:  [outer / 2, outer / 2],
    popupAnchor: [0, -(outer / 2 + 6)],
  });
}

function metricRow(label: string, value: number, color: string): string {
  const pct = Math.min(100, Math.round(value));
  return `
    <div style="margin-bottom:5px;">
      <div style="display:flex;justify-content:space-between;font-size:9px;color:#6b7280;margin-bottom:2px;">
        <span>${label}</span><span style="color:${color};font-weight:700;">${pct}%</span>
      </div>
      <div style="height:3px;background:rgba(255,255,255,0.07);border-radius:2px;overflow:hidden;">
        <div style="height:100%;width:${pct}%;background:${color};border-radius:2px;"></div>
      </div>
    </div>`;
}

function buildPopupHtml(node: NodeData): string {
  const riskColor = getRiskColor(node.riskScore);
  const sigColor  = SIGNAL_COLORS[node.signalState] ?? '#22c55e';
  const stColor   = STATUS_COLORS[node.status] ?? '#22c55e';

  return `
    <div style="font-family:'JetBrains Mono',monospace;min-width:210px;padding:2px 0;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
        <div style="font-size:12px;font-weight:700;color:#f1f5f9;">${node.name}</div>
        <div style="font-size:9px;font-weight:700;color:${stColor};text-transform:uppercase;
          background:${stColor}18;border:1px solid ${stColor}40;border-radius:4px;padding:1px 5px;">
          ${node.status}
        </div>
      </div>
      <div style="font-size:9px;color:#4b5563;margin-bottom:10px;">${node.id} &nbsp;·&nbsp; ${node.location.lat.toFixed(4)}, ${node.location.lng.toFixed(4)}</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-bottom:10px;">
        <div style="background:rgba(0,212,255,0.05);border:1px solid rgba(0,212,255,0.12);border-radius:6px;padding:7px;">
          <div style="font-size:8px;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:2px;">Risk</div>
          <div style="font-size:20px;font-weight:800;color:${riskColor};line-height:1;">${Math.round(node.riskScore)}</div>
        </div>
        <div style="background:rgba(0,212,255,0.05);border:1px solid rgba(0,212,255,0.12);border-radius:6px;padding:7px;">
          <div style="font-size:8px;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:2px;">Signal</div>
          <div style="font-size:11px;font-weight:700;color:${sigColor};text-transform:uppercase;">${node.signalState}</div>
        </div>
      </div>

      ${metricRow('Vehicles',   node.vehicleDensity,    '#00d4ff')}
      ${metricRow('Waterlog',   node.waterloggingRisk,  '#3b82f6')}
      ${metricRow('Crowd',      node.crowdDensity,      '#a855f7')}
      ${metricRow('Visibility', node.ambientVisibility, '#22c55e')}

      <div style="margin-top:8px;padding-top:7px;border-top:1px solid rgba(255,255,255,0.05);
        display:flex;gap:10px;font-size:9px;color:#6b7280;">
        <span>${Math.round(node.temperature)}°C</span>
        <span>${Math.round(node.humidity)}% RH</span>
        <span>${Math.round(node.windSpeed)} km/h</span>
      </div>

      ${node.obstacleDetected ? `
        <div style="margin-top:7px;padding:4px 8px;
          background:rgba(249,115,22,0.12);border:1px solid rgba(249,115,22,0.28);
          border-radius:4px;font-size:9px;color:#f97316;font-weight:600;">
          OBSTACLE DETECTED
        </div>` : ''}
    </div>`;
}

function MarkerLayer({ nodes, selectedNodeId, onSelectNode }: BangaloreMapProps) {
  const map = useMap();
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (!map) return;

    const existingIds = new Set(Object.keys(markersRef.current));
    const newIds      = new Set(nodes.map(n => n.id));

    // Remove stale
    existingIds.forEach(id => {
      if (!newIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    // Add / update
    nodes.forEach(node => {
      const isSelected = node.id === selectedNodeId;
      const icon       = createNodeIcon(node, isSelected);

      if (markersRef.current[node.id]) {
        markersRef.current[node.id].setIcon(icon);
        markersRef.current[node.id].setPopupContent(buildPopupHtml(node));
      } else {
        const marker = L.marker([node.location.lat, node.location.lng], { icon })
          .addTo(map)
          .bindPopup(buildPopupHtml(node), { maxWidth: 240, className: 'rasta-popup' });

        marker.on('click', () => {
          onSelectNode(node.id);
          marker.openPopup();
        });

        markersRef.current[node.id] = marker;
      }
    });

    return () => {
      Object.values(markersRef.current).forEach(m => m.remove());
      markersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, selectedNodeId]);

  return null;
}

// Bangalore center — zoom 12 covers the whole city
const BANGALORE_CENTER: [number, number] = [12.9716, 77.5946];

export function BangaloreMap({ nodes, selectedNodeId, onSelectNode }: BangaloreMapProps) {
  return (
    <MapContainer
      center={BANGALORE_CENTER}
      zoom={12}
      minZoom={11}
      maxZoom={17}
      style={{ width: '100%', height: '100%' }}
      zoomControl
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <MarkerLayer
        nodes={nodes}
        selectedNodeId={selectedNodeId}
        onSelectNode={onSelectNode}
      />
    </MapContainer>
  );
}
