# Soccerex Front

React/Vite public website for Soccerex.

## API Configuration

The frontend reads the Soccerex backend through:

```text
VITE_SOCCEREX_API_BASE_URL=https://soccerex.digitalhost.co/api/v1
```

`https://soccerex.digitalhost.co` is the current Laravel Cloud platform service
URL. If production later moves to `system.soccerex.com`,
`backend.soccerex.com`, or another Soccerex-owned domain, update this variable
in the frontend environment and deployment settings. Do not point shared
frontend work at `https://soccerex.back`; that hostname is local-only.

The backend must allow the frontend origin through CORS. Current backend config
allows `https://soccerex.front`, localhost dev origins, and production website
origins by default, with more origins configurable via `CORS_ALLOWED_ORIGINS`.

## Local Build

```zsh
npm install
npm run build
```

## Local Development

This project is **NOT** served by Laravel Herd. Herd is deprecated for
Soccerex (its `soccerex.test` config was removed 2026-05-15).

The canonical local environment setup is documented in:

```text
~/iCloud/Sites/README.md
```

In short: Homebrew nginx reverse-proxies `https://soccerex.front` to the
Vite dev server on `127.0.0.1:5173`, using a local CA cert under
`~/.config/teamdigitalhost/certs/`. If `https://soccerex.front` shows a
certificate error, Herd's nginx is squatting on ports 80/443 — do not
fix it inside Herd. Either use `http://localhost:5173/` directly, or
follow the Reverse Proxy / Local HTTPS sections in the iCloud Sites
README to return ports 80/443 to Homebrew nginx.
