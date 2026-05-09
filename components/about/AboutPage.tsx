'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

const AUDIENCES = [
  {
    id: 'citizens',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    label: 'Citizens',
    color: '#00d4ff',
    tagline: 'Stay safe, stay informed',
    features: [
      { title: 'Live Traffic Map', desc: 'See real-time congestion, road closures, and risk levels across 12 major Bangalore junctions before you leave home.' },
      { title: 'Hazard Alerts', desc: 'Get instant AI-generated warnings for flooding, accidents, and dangerous road conditions near your route.' },
      { title: 'Report Incidents', desc: 'Spot a pothole, waterlogging, or accident? Submit a report in seconds directly from the map.' },
      { title: 'CCTV Live Feeds', desc: 'Watch live camera footage from Silk Board, MG Road, Marathahalli, Hebbal, and more before you travel.' },
      { title: 'Signal Status', desc: 'Know whether signals are green, red, or in emergency mode at any monitored junction in real time.' },
      { title: 'Free & No Sign-up', desc: 'No account, no app install. Open RASTA Cortex in any browser and get full access instantly.' },
    ],
  },
  {
    id: 'police',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    label: 'Traffic Police',
    color: '#f59e0b',
    tagline: 'Command the road, not just react to it',
    features: [
      { title: 'Critical Alert Dashboard', desc: 'All high-severity incidents surface instantly — collision risks, emergency signal states, and crowd surges — in one feed.' },
      { title: 'AI Confidence Scores', desc: 'Every alert includes an AI confidence percentage so officers can prioritise response without second-guessing.' },
      { title: 'Adaptive Signal Override', desc: 'The system automatically switches signals to emergency mode during detected incidents. Officers see this in real time.' },
      { title: 'Incident Impact Radius', desc: 'Each alert shows the predicted impact radius so officers know how wide to cordon off an area.' },
      { title: 'Node Status Overview', desc: 'A sidebar lists all 12 monitored junctions with live status — online, warning, critical, or offline — at a glance.' },
      { title: 'Event Log', desc: 'A timestamped log of every system event and AI decision provides a clear audit trail for incident reports.' },
    ],
  },
  {
    id: 'engineers',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    label: 'Traffic Engineers',
    color: '#7b2fff',
    tagline: 'Data-driven decisions for smarter infrastructure',
    features: [
      { title: 'Risk Timeline Charts', desc: 'Track how overall risk scores evolve across all nodes over time to identify recurring problem windows.' },
      { title: 'Vehicle Density Trends', desc: 'Live bar charts show inflow, outflow, and congestion index per junction updated every 1.5 seconds.' },
      { title: 'Node Comparison', desc: 'Side-by-side analytics across all 12 junctions reveal which intersections need infrastructure upgrades.' },
      { title: 'Environmental Sensors', desc: 'Temperature, humidity, wind speed, and visibility data from each node help correlate weather with risk spikes.' },
      { title: 'Multi-Factor Risk Scoring', desc: 'The AI engine scores collision, flood, congestion, and pedestrian risk independently giving granular insight.' },
      { title: 'Radar Risk Profile', desc: 'A radar chart visualises the full risk profile of any selected node across all four risk dimensions simultaneously.' },
    ],
  },
];

const PLATFORM_FEATURES = [
  { tag: 'REAL-TIME', title: 'IoT Sensor Network', desc: '12 ESP32-style smart nodes update every 1.5s, streaming vehicle density, obstacle detection, waterlogging risk, and environmental data.' },
  { tag: 'AI ENGINE', title: 'Predictive Hazard Detection', desc: 'Multi-factor AI scoring engine predicts collision, flood, congestion, and pedestrian risks with 94% accuracy before incidents occur.' },
  { tag: 'LIVE MAP', title: 'Bangalore Junction Map', desc: 'Interactive Leaflet map with colour-coded risk markers for all 12 monitored intersections. Tap any node for a full sensor readout.' },
  { tag: 'CCTV', title: '9 Live Camera Feeds', desc: 'Live footage from Silk Board, MG Road, Marathahalli, Hebbal, Electronic City, Whitefield, Koramangala, Indiranagar, and Jayanagar.' },
  { tag: 'SIGNALS', title: 'Adaptive Signal Control', desc: 'Traffic signals automatically switch to emergency mode when the AI detects a critical incident, reducing response time.' },
  { tag: 'ANALYTICS', title: 'Live Traffic Analytics', desc: 'Risk timelines, vehicle density bar charts, node comparison tables, and radar risk profiles — all updating in real time.' },
  { tag: 'REPORTING', title: 'Citizen Incident Reports', desc: 'A built-in form lets anyone report potholes, waterlogging, accidents, or road hazards tagged to the nearest junction.' },
  { tag: 'SOCKET.IO', title: 'Sub-15ms Real-Time Updates', desc: 'All sensor data, alerts, and predictions are pushed via WebSocket — no polling, no page refresh needed.' },
];

const STATS = [
  { value: '12',    label: 'Monitored Junctions', sub: 'across Bangalore'  },
  { value: '9',     label: 'Live CCTV Feeds',     sub: 'major corridors'   },
  { value: '94%',   label: 'AI Accuracy',          sub: 'hazard prediction' },
  { value: '<15ms', label: 'Response Time',        sub: 'sensor to screen'  },
  { value: '4',     label: 'Risk Dimensions',      sub: 'per junction'      },
  { value: '1.5s',  label: 'Update Interval',      sub: 'live sensor data'  },
];

const JUNCTIONS = [
  'Silk Board Junction', 'MG Road', 'Marathahalli Bridge', 'Hebbal Flyover',
  'Electronic City Toll', 'Whitefield Signal', 'Koramangala 5th Block',
  'Indiranagar 100ft Rd', 'Jayanagar 4th Block', 'Yeshwanthpur Circle',
  'KR Puram Bridge', 'Bannerghatta Road',
];

const HOW_IT_WORKS = [
  { step: '01', title: 'IoT Sensors Collect Data', desc: 'Smart nodes at each junction measure vehicle density, obstacles, waterlogging, crowd levels, visibility, and weather every 1.5 seconds.', color: '#00d4ff' },
  { step: '02', title: 'AI Engine Scores Risk', desc: 'The backend AI engine processes sensor readings and computes collision, flood, congestion, and pedestrian risk scores with confidence levels.', color: '#7b2fff' },
  { step: '03', title: 'Alerts Are Generated', desc: 'When risk exceeds thresholds, the orchestrator fires alerts with severity levels, impact radius, and adaptive response recommendations.', color: '#f59e0b' },
  { step: '04', title: 'Dashboard Updates Live', desc: 'All data is pushed via Socket.IO to every connected browser — map markers, alert feeds, analytics charts, and signal states update instantly.', color: '#22c55e' },
];

const TECH = [
  { name: 'Next.js 16', role: 'Frontend framework' },
  { name: 'React 19', role: 'UI library' },
  { name: 'TypeScript', role: 'Type safety' },
  { name: 'Tailwind CSS v4', role: 'Styling' },
  { name: 'Framer Motion', role: 'Animations' },
  { name: 'Recharts', role: 'Analytics charts' },
  { name: 'Leaflet', role: 'Interactive map' },
  { name: 'Socket.IO', role: 'Real-time comms' },
  { name: 'Node.js', role: 'Backend runtime' },
  { name: 'Express', role: 'REST API' },
  { name: 'MQTT Sim', role: 'IoT event stream' },
  { name: 'HTML5 Canvas', role: 'Digital twin' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4, delay },
});

export function AboutPage() {
  const [openAudience, setOpenAudience] = useState<string | null>('citizens');

  return (
    <div className="min-h-screen bg-[#07090f] grid-bg text-slate-300 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 45% at 50% 0%, rgba(0,212,255,0.05) 0%, transparent 65%)' }} />
      <div className="scan-line" />

      {/* NAV */}
      <nav className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800/50">
        <Link href="/" className="flex items-center gap-2 group" aria-label="Back to RASTA Cortex home">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <rect x="8" y="1" width="4" height="18" rx="1.5" fill="#00d4ff"/>
            <rect x="1" y="8" width="18" height="4" rx="1.5" fill="#00d4ff" opacity="0.4"/>
          </svg>
          <span className="text-sm sm:text-base font-bold text-white tracking-wider group-hover:text-cyan-300 transition-colors">RASTA Cortex</span>
          <span className="hidden sm:inline text-[10px] font-bold mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>BETA</span>
        </Link>
        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          <span className="hidden sm:inline">Back to</span> Dashboard
        </Link>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-20">

        {/* HERO */}
        <section className="pt-10 sm:pt-16 pb-10 sm:pb-14 text-center">
          <motion.div {...fadeUp(0.05)}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 sm:mb-5" style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.18)', color: '#7dd3fc' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Bangalore Smart City Initiative · 2026
            </span>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight grad-text leading-none mb-3 sm:mb-4">
            Features & Capabilities
          </motion.h1>
          <motion.p {...fadeUp(0.18)} className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed px-2">
            RASTA Cortex is Bangalore's real-time road intelligence platform — built for citizens, traffic police, and city engineers to make every journey safer and every decision faster.
          </motion.p>
        </section>

        {/* STATS */}
        <motion.section {...fadeUp(0.1)} className="mb-12 sm:mb-16">
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {STATS.map((s, i) => (
              <motion.div key={i} {...fadeUp(0.04 * i)} className="card-bright p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-black mono text-white mb-0.5">{s.value}</div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-slate-300 leading-tight">{s.label}</div>
                <div className="text-[9px] sm:text-[10px] text-slate-600 mt-0.5 hidden sm:block">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* PLATFORM FEATURES */}
        <section className="mb-14 sm:mb-20">
          <motion.div {...fadeUp(0)} className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">Platform Capabilities</h2>
            <p className="text-slate-500 text-xs sm:text-sm">Everything RASTA Cortex does, in one place.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PLATFORM_FEATURES.map((f, i) => (
              <motion.div key={i} {...fadeUp(0.03 * i)} className="card p-4 hover:border-slate-700/80 transition-colors duration-200">
                <div className="text-[9px] font-bold mono mb-2 px-1.5 py-0.5 rounded inline-block" style={{ color: '#00d4ff', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}>{f.tag}</div>
                <div className="text-xs font-bold text-white mb-1.5">{f.title}</div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* WHO ITS BUILT FOR — accordion on mobile, full on desktop */}
        <section className="mb-14 sm:mb-20">
          <motion.div {...fadeUp(0)} className="mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">Who It's Built For</h2>
            <p className="text-slate-500 text-xs sm:text-sm">Three distinct groups, each with tailored capabilities.</p>
          </motion.div>

          <div className="space-y-3 sm:space-y-10">
            {AUDIENCES.map((audience) => {
              const isOpen = openAudience === audience.id;
              const rgb = audience.color === '#00d4ff' ? '0,212,255' : audience.color === '#f59e0b' ? '245,158,11' : '123,47,255';
              return (
                <motion.div key={audience.id} {...fadeUp(0)}>
                  {/* Header — tappable on mobile */}
                  <button
                    className="w-full flex items-center gap-3 mb-0 sm:mb-5 text-left sm:cursor-default"
                    onClick={() => setOpenAudience(isOpen ? null : audience.id)}
                    aria-expanded={isOpen}
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `rgba(${rgb},0.1)`, border: `1px solid ${audience.color}30`, color: audience.color }}>
                      {audience.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-white">{audience.label}</h3>
                      <p className="text-xs truncate" style={{ color: audience.color }}>{audience.tagline}</p>
                    </div>
                    {/* Chevron — mobile only */}
                    <svg
                      className="sm:hidden shrink-0 transition-transform duration-200"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', color: '#6b7280' }}
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  {/* Feature cards — always visible on sm+, accordion on mobile */}
                  <div className={`mt-3 sm:mt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 sm:max-h-none opacity-0 sm:opacity-100'}`}>
                    {audience.features.map((f, fi) => (
                      <div key={fi} className="card p-4 hover:border-slate-700/80 transition-colors duration-200" style={{ borderLeft: `2px solid ${audience.color}25` }}>
                        <div className="text-xs font-bold text-white mb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: audience.color }} />
                          {f.title}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{f.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* MONITORED JUNCTIONS */}
        <section className="mb-14 sm:mb-20">
          <motion.div {...fadeUp(0)} className="mb-5 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">Monitored Junctions</h2>
            <p className="text-slate-500 text-xs sm:text-sm">12 high-traffic intersections across Bangalore with live IoT sensor coverage.</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {JUNCTIONS.map((j, i) => (
              <motion.div key={i} {...fadeUp(0.025 * i)} className="card px-3 py-2.5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: '#22c55e' }} />
                <span className="text-[11px] sm:text-xs text-slate-400 leading-tight">{j}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mb-14 sm:mb-20">
          <motion.div {...fadeUp(0)} className="mb-5 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">How It Works</h2>
            <p className="text-slate-500 text-xs sm:text-sm">From sensor to screen in under 15 milliseconds.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {HOW_IT_WORKS.map((s, i) => (
              <motion.div key={i} {...fadeUp(0.06 * i)} className="card-bright p-4 sm:p-5 relative overflow-hidden">
                <div className="text-5xl font-black mono absolute top-3 right-4 select-none" style={{ color: `${s.color}10` }}>{s.step}</div>
                <div className="text-xs font-bold mono mb-2 sm:mb-3" style={{ color: s.color }}>STEP {s.step}</div>
                <h4 className="text-sm font-bold text-white mb-1.5 sm:mb-2">{s.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TECH STACK */}
        <section className="mb-14 sm:mb-20">
          <motion.div {...fadeUp(0)} className="mb-5 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">Tech Stack</h2>
            <p className="text-slate-500 text-xs sm:text-sm">Open-source, modern, and built for scale.</p>
          </motion.div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
            {TECH.map((t, i) => (
              <motion.div key={i} {...fadeUp(0.025 * i)} className="card px-2 sm:px-3 py-2.5 text-center">
                <div className="text-[11px] sm:text-xs font-bold text-white mb-0.5 leading-tight">{t.name}</div>
                <div className="text-[9px] sm:text-[10px] text-slate-600 hidden sm:block">{t.role}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <motion.section {...fadeUp(0.1)} className="text-center">
          <div className="rounded-2xl p-7 sm:p-10" style={{ background: 'rgba(8,20,40,0.7)', border: '1px solid rgba(0,212,255,0.12)' }}>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-2 sm:mb-3">Ready to explore the dashboard?</h2>
            <p className="text-slate-500 text-xs sm:text-sm mb-6 sm:mb-7 max-w-md mx-auto">No sign-up. No install. Open the live traffic command centre for Bangalore right now.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.18), rgba(123,47,255,0.18))', border: '1px solid rgba(0,212,255,0.4)', color: '#e0f2fe' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
              Open Traffic Dashboard
            </Link>
            <p className="text-xs text-slate-700 mt-4">Free for all citizens · Works in any browser</p>
          </div>
        </motion.section>

      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-800/50 px-4 sm:px-6 py-4 sm:py-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 text-xs text-slate-700 text-center sm:text-left">
          <span>RASTA Cortex · Bangalore Smart City · 2026</span>
          <span>AI-powered · Open source · Free for all</span>
        </div>
      </footer>
    </div>
  );
}
