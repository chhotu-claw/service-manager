# Service Manager

Web-based service manager for WSL2. Monitors and controls services through a React dashboard, with Caddy reverse proxy integration and Cloudflare tunnel exposure.

## Tech Stack

- **Express.js** — API server (port 9091)
- **React (Vite)** — Dashboard UI
- **Caddy** — Reverse proxy (configured via admin API)
- **Docker** — Container on `chhotu-net` (512MB)
- **bcryptjs / express-session** — Authentication
- **js-yaml** — Service config parsing

## Folder Structure

```
service-manager/
├── server/
│   ├── index.js           # Express server
│   ├── routes/            # API routes
│   ├── middleware/         # Auth middleware
│   └── lib/               # Service management logic
├── client/
│   └── src/
│       ├── App.jsx        # Main React app
│       ├── components/    # UI components
│       └── pages/         # Dashboard pages
├── services.yaml          # Service definitions (ports, health checks, routes)
├── config.json            # Auth settings
├── Dockerfile             # Production build
└── docker-compose.yml     # Docker config (chhotu-net)
```

## Setup

```bash
npm install
npm run build    # Build React client
npm start        # Start server on port 9091
```

## Docker

```bash
docker compose up -d
```

## Configuration

**`services.yaml`** — Define services to manage:

```yaml
services:
  dashboard:
    name: "Voice Dashboard"
    port: 8080
    systemd: "desktop.service"
    route: "/dashboard"
    expose: true
    health: "http://localhost:8080/health"
    description: "Jarvis voice server & dashboard"
```

**`config.json`** — Auth settings.

## Architecture

```
Browser → Service Manager (Express :9091) → React dashboard
              ├── Caddy admin API (:9090) — proxy config
              ├── systemd / Docker — service control
              └── Health checks — per-service monitoring
```
