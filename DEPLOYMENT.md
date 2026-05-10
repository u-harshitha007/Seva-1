# Deployment Guide

This document covers how to deploy RASTA Cortex — both the Next.js frontend and the Node.js backend — across local development, self-hosted VPS, and cloud platforms.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Building for Production](#building-for-production)
- [Deploying the Frontend — Vercel](#deploying-the-frontend--vercel)
- [Deploying the Frontend — Self-hosted](#deploying-the-frontend--self-hosted)
- [Deploying the Backend — Railway](#deploying-the-backend--railway)
- [Deploying the Backend — Self-hosted VPS](#deploying-the-backend--self-hosted-vps)
- [Running Both with Docker Compose](#running-both-with-docker-compose)
- [Reverse Proxy with Nginx](#reverse-proxy-with-nginx)
- [Health Checks](#health-checks)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Tool | Minimum version | Purpose |
|---|---|---|
| Node.js | 20 | Runtime for both frontend and backend |
| pnpm | 9 | Package manager |
| Git | any | Source control |

Install pnpm if you do not have it:

`ash
npm install -g pnpm
`

---

## Environment Variables

### Frontend

Create a file at rontend/.env.local for local development or set these in your hosting platform's environment settings.

`env
# URL of the running backend — no trailing slash
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
`

For production replace the value with your deployed backend URL, for example:

`env
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
`

### Backend

Create a file at ackend/.env for local development.

`env
# Port the Express server listens on
PORT=4000

# Allowed frontend origin for CORS — no trailing slash
CORS_ORIGIN=http://localhost:3000
`

For production:

`env
PORT=4000
CORS_ORIGIN=https://yourdomain.com
`

---

## Local Development

`ash
# 1. Clone the repository
git clone https://github.com/Sreejith-nair511/Seva-1.git
cd Seva-1

# 2. Install all dependencies (frontend + backend)
pnpm install

# 3. Start both services concurrently
pnpm dev
`

This runs:
- Frontend at http://localhost:3000 via 
ext dev --webpack
- Backend at http://localhost:4000 via 
odemon

Both services hot-reload on file changes.

---

## Building for Production

### Frontend

`ash
pnpm --filter frontend build
`

Output goes to rontend/.next. To serve it locally after building:

`ash
pnpm --filter frontend start
`

### Backend

`ash
pnpm --filter backend build
`

This compiles TypeScript to JavaScript in ackend/dist. To run the compiled output:

`ash
node backend/dist/index.js
`

---

## Deploying the Frontend — Vercel

Vercel is the recommended platform for the Next.js frontend.

1. Push your code to GitHub (already done).
2. Go to https://vercel.com and create a new project.
3. Import the Seva-1 repository.
4. Set the root directory to rontend.
5. Vercel auto-detects Next.js. Leave the build command as 
ext build --webpack and output directory as .next.
6. Add the environment variable:
   - Key: NEXT_PUBLIC_BACKEND_URL
   - Value: your deployed backend URL
7. Click Deploy.

Every push to main will trigger an automatic redeploy.

---

## Deploying the Frontend — Self-hosted

On any Linux server with Node.js installed:

`ash
# Build
pnpm --filter frontend build

# Start the production server
pnpm --filter frontend start
`

The server listens on port 3000 by default. Use a process manager to keep it running:

`ash
# Install pm2 globally
npm install -g pm2

# Start
pm2 start "pnpm --filter frontend start" --name rasta-frontend

# Save process list so it restarts on reboot
pm2 save
pm2 startup
`

---

## Deploying the Backend — Railway

1. Go to https://railway.app and create a new project.
2. Connect your GitHub repository.
3. Set the root directory to ackend.
4. Set the start command to:
   `
   node dist/index.js
   `
5. Set the build command to:
   `
   pnpm install && pnpm build
   `
6. Add environment variables:
   - PORT — Railway injects this automatically, but you can set it to 4000
   - CORS_ORIGIN — your Vercel frontend URL
7. Deploy.

Railway provides a public URL for the backend. Use that as NEXT_PUBLIC_BACKEND_URL in your frontend environment.

---

## Deploying the Backend — Self-hosted VPS

`ash
# On your server, clone the repo
git clone https://github.com/Sreejith-nair511/Seva-1.git
cd Seva-1

# Install dependencies
pnpm install

# Build the backend
pnpm --filter backend build

# Create the env file
echo "PORT=4000" >> backend/.env
echo "CORS_ORIGIN=https://yourdomain.com" >> backend/.env

# Start with pm2
pm2 start backend/dist/index.js --name rasta-backend
pm2 save
pm2 startup
`

---

## Running Both with Docker Compose

Create a docker-compose.yml at the repository root:

`yaml
version: "3.9"

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      PORT: 4000
      CORS_ORIGIN: http://localhost:3000
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_BACKEND_URL: http://backend:4000
    depends_on:
      - backend
    restart: unless-stopped
`

Create ackend/Dockerfile:

`dockerfile
FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 4000
CMD ["node", "dist/index.js"]
`

Create rontend/Dockerfile:

`dockerfile
FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
`

Run everything:

`ash
docker compose up -d
`

---

## Reverse Proxy with Nginx

If you are self-hosting both services on one server, use Nginx to route traffic.

`
ginx
# /etc/nginx/sites-available/rasta-cortex

server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade ;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host System.Management.Automation.Internal.Host.InternalHost;
        proxy_cache_bypass ;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade ;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host System.Management.Automation.Internal.Host.InternalHost;
        proxy_cache_bypass ;
    }

    # Socket.IO — requires WebSocket upgrade
    location /socket.io/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade ;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host System.Management.Automation.Internal.Host.InternalHost;
        proxy_read_timeout 86400;
    }
}
`

Enable and reload:

`ash
sudo ln -s /etc/nginx/sites-available/rasta-cortex /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
`

Add HTTPS with Certbot:

`ash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
`

---

## Health Checks

Once deployed, verify both services are running:

`ash
# Backend health endpoint
curl https://api.yourdomain.com/api/health

# Expected response
{ "status": "ok", "uptime": 123, "nodes": 12 }
`

The frontend has no dedicated health endpoint — a 200 response from the root URL confirms it is running.

---

## Troubleshooting

**Socket.IO not connecting in production**

Make sure CORS_ORIGIN on the backend exactly matches the frontend URL including the protocol (https://). No trailing slash.

Also ensure your reverse proxy or load balancer supports WebSocket upgrades. The Nginx config above handles this with the Upgrade and Connection headers.

**Build fails with out-of-memory error**

Next.js builds can be memory-intensive. Increase the Node.js heap size:

`ash
NODE_OPTIONS=--max-old-space-size=4096 pnpm --filter frontend build
`

**pnpm workspace not found**

Run pnpm install from the repository root, not from inside rontend/ or ackend/. The pnpm-workspace.yaml at the root defines the workspace.

**Port already in use**

`ash
# Find what is using port 4000
lsof -i :4000

# Kill it
kill -9 <PID>
`

**CORS errors in the browser**

Check that CORS_ORIGIN in the backend environment matches the exact origin the browser is sending. Open DevTools, look at the Origin header on the failing request, and make sure it matches.
