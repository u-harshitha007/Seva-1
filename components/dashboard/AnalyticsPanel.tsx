'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { NodeData, TrafficFlow } from '@/types';

interface AnalyticsPanelProps {
  nodes: NodeData[];
  trafficFlows: TrafficFlow[];
}

const NODE_COLORS = ['#00d4ff', '#7b2fff', '#f97316', '#22c55e', '#f59e0b'];

const TT_STYLE = {
  backgroundColor: 'rgba(8,20,40,0.95)',
  border: '1px solid rgba(0,212,255,0.15)',
  borderRadius: '6px',
  color: '#e2e8f0',
  fontSize: '11px',
  padding: '6px 10px',
};

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-4">
      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{title}</div>
      {children}
    </div>
  );
}

export function AnalyticsPanel({ nodes }: AnalyticsPanelProps) {
  const [history, setHistory] = useState<{ t: string; risk: number; vehicles: number }[]>([]);

  useEffect(() => {
    if (!nodes.length) return;
    const risk     = Math.round(nodes.reduce((s, n) => s + n.riskScore, 0) / nodes.length);
    const vehicles = Math.round(nodes.reduce((s, n) => s + n.vehicleDensity, 0) / nodes.length);
    const now = new Date();
    const t = `${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
    setHistory(prev => [...prev.slice(-29), { t, risk, vehicles }]);
  }, [nodes]);

  const nodeBar = nodes.map((n, i) => ({
    name: n.name.split(' ')[0],
    risk: Math.round(n.riskScore),
    vehicles: Math.round(n.vehicleDensity),
    color: NODE_COLORS[i % NODE_COLORS.length],
  }));

  const envData = nodes.map(n => ({
    name: n.name.split(' ')[0],
    temp: Math.round(n.temperature),
    humidity: Math.round(n.humidity),
    wind: Math.round(n.windSpeed),
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {nodes.map((n, i) => (
          <div key={n.id} className="card p-3">
            <div className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">{n.id}</div>
            <div className="text-sm font-bold text-white truncate">{n.name}</div>
            <div className="text-xl font-black mono mt-1" style={{ color: NODE_COLORS[i] }}>
              {Math.round(n.riskScore)}
            </div>
            <div className="text-[10px] text-slate-600">risk score</div>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Avg Risk Score — Live">
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={history}>
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="t" tick={{ fill: '#4b5563', fontSize: 9 }} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#4b5563', fontSize: 9 }} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={TT_STYLE} />
              <Area type="monotone" dataKey="risk" stroke="#ef4444" fill="url(#rg)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Vehicle Density — Live">
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="t" tick={{ fill: '#4b5563', fontSize: 9 }} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#4b5563', fontSize: 9 }} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={TT_STYLE} />
              <Line type="monotone" dataKey="vehicles" stroke="#00d4ff" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Node Risk Comparison">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={nodeBar} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: '#4b5563', fontSize: 9 }} tickLine={false} />
              <YAxis tick={{ fill: '#4b5563', fontSize: 9 }} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={TT_STYLE} />
              <Bar dataKey="risk" radius={[3, 3, 0, 0]}>
                {nodeBar.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Environmental — Temperature & Humidity">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={envData} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: '#4b5563', fontSize: 9 }} tickLine={false} />
              <YAxis tick={{ fill: '#4b5563', fontSize: 9 }} tickLine={false} />
              <Tooltip contentStyle={TT_STYLE} />
              <Bar dataKey="temp"     fill="#f97316" radius={[3,3,0,0]} name="Temp °C" />
              <Bar dataKey="humidity" fill="#3b82f6" radius={[3,3,0,0]} name="Humidity %" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
