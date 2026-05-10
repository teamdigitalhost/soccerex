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
