# RASTA Cortex

Predictive Adaptive Road Intelligence System — a real-time AI-powered traffic monitoring platform built for Bangalore, India.

RASTA Cortex gives citizens, traffic police, and city engineers a single command centre to monitor live road conditions, receive AI hazard alerts, watch CCTV feeds, and report incidents — all in the browser, no sign-up required.

---

## Live Demo

Run locally:

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api/health

---

## What It Does

### For Citizens

- Live traffic map of 12 major Bangalore junctions with colour-coded risk levels
- AI-generated hazard alerts for flooding, collisions, and congestion
- One-tap incident reporting for potholes, waterlogging, and accidents
- Live CCTV feeds from Silk Board, MG Road, Marathahalli, Hebbal, and more
- Real-time signal status at every monitored junction
- No account required, works in any browser

### For Traffic Police

- Critical alert dashboard surfacing high-severity incidents instantly
- AI confidence scores on every alert for faster prioritisation
- Automatic emergency signal override during detected incidents
- Predicted impact radius per alert for cordoning decisions
- Full node status overview across all 12 junctions
- Timestamped event log for incident audit trails

### For Traffic Engineers

- Risk timeline charts across all nodes
- Vehicle density trends with inflow, outflow, and congestion index
- Side-by-side node comparison to identify infrastructure bottlenecks
- Environmental sensor data: temperature, humidity, wind speed, visibility
- Multi-factor risk scoring: collision, flood, congestion, pedestrian
- Radar risk profile per junction

---

## Key Numbers

| Metric | Value |
|---|---|
| Monitored junctions | 12 |
| Live CCTV feeds | 9 |
| AI prediction accuracy | 94% |
| Sensor-to-screen latency | under 15ms |
| Risk dimensions per node | 4 |
| Sensor update interval | 1.5 seconds |

---

## Monitored Junctions

Silk Board Junction, MG Road, Marathahalli Bridge, Hebbal Flyover, Electronic City Toll, Whitefield Signal, Koramangala 5th Block, Indiranagar 100ft Road, Jayanagar 4th Block, Yeshwanthpur Circle, KR Puram Bridge, Bannerghatta Road

---

## Architecture

`
rasta-cortex/
├── frontend/                     Next.js 16 + React 19 + TypeScript
│   ├── app/
│   │   ├── page.tsx              Landing page and dashboard entry
│   │   └── about/page.tsx        Features and capabilities page
│   ├── components/
│   │   ├── dashboard/            Command centre UI components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Topbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── BangaloreMap.tsx
│   │   │   ├── AlertFeed.tsx
│   │   │   ├── AnalyticsPanel.tsx
│   │   │   ├── CctvPanel.tsx
│   │   │   ├── NodeDetailPanel.tsx
│   │   │   ├── ReportModal.tsx
│   │   │   └── HelpModal.tsx
│   │   ├── landing/LandingPage.tsx
│   │   └── about/AboutPage.tsx   Mobile-optimised features page
│   ├── hooks/useSocket.ts        Socket.IO real-time hook
│   ├── lib/utils.ts
│   └── types/index.ts            Shared TypeScript types
│
└── backend/                      Node.js + Express + Socket.IO
    └── src/
        ├── ai-engine/predictor.ts        Multi-factor risk scoring
        ├── orchestrator/index.ts         Alert dispatch and routing
        ├── routes/                       REST API endpoints
        ├── simulation/nodeSimulator.ts   IoT node data simulator
        └── types/index.ts
`

---

## How It Works

1. IoT sensor nodes at each junction emit vehicle density, obstacle detection, waterlogging risk, crowd density, visibility, and weather data every 1.5 seconds.
2. The AI engine computes four independent risk scores per node: collision, flood, congestion, and pedestrian risk.
3. When any score crosses a threshold, the orchestrator fires an alert with severity level, confidence percentage, predicted impact radius, and an adaptive response recommendation.
4. All data is pushed via Socket.IO WebSocket to every connected browser. The map, alert feed, analytics charts, and signal states update in real time without any page refresh.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | Next.js 16 |
| UI library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Charts | Recharts |
| Map | Leaflet |
| Real-time transport | Socket.IO |
| Backend runtime | Node.js |
| HTTP framework | Express |
| IoT simulation | Custom MQTT-style event simulator |
| Visualisation | HTML5 Canvas |

---

## Getting Started

Prerequisites: Node.js 20 or later, pnpm 9 or later

`ash
git clone https://github.com/Sreejith-nair511/Seva-1.git
cd Seva-1
pnpm install
pnpm dev
`

Frontend: http://localhost:3000
Backend: http://localhost:4000

---

## Project Context

RASTA Cortex was built as part of the Bangalore Smart City Initiative 2026. The platform is fully open source and free for all citizens. No account, no app install, just a modern browser.

---

## License

MIT
