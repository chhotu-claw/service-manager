# Service Manager

Web-based service manager for WSL2. Monitors, controls, and exposes services through Caddy reverse proxy and Cloudflare quick tunnel.

## Setup

```bash
npm install
npm run build
npm start
```

## Architecture

- **Caddy** (port 9090) — reverse proxy, configured via admin API
- **Service Manager** (port 9091) — Express + React dashboard
- **Cloudflare Quick Tunnel** → Caddy → all services

## Config

Edit `services.yaml` to add/remove services. Edit `config.json` for auth settings.
