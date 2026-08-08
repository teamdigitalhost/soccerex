# Soccerex Frontend (website) — workspace & deploy rules

React + Vite single-page site (`teamdigitalhost/soccerex.git`), deployed to **Netlify** (`soccerex1.netlify.app`). This is the public website; it talks to the Soccerex backend API. The backend lives in a separate repo (`teamdigitalhost/soccerex-system`).

## WORKSPACE ROLES — where to work (read this first, do not re-derive it)

This repo has **two working copies on each fleet Mac** — same GitHub repo, fixed roles:

- **PRIMARY — default dev home: `~/projects/soccerex`**
  SSH remote (`git@github.com:…`), clean git (never synced through iCloud). Prefer doing development here (iCloud can corrupt `.git`). Holds the Netlify site link.
- **BACKUP — mirror, also fully functional: `~/iCloud/Sites/Soccerex-front`**
  iCloud copy, for work-from-any-Mac. It is **also deploy-capable** — it has the Netlify site link and an SSH remote. You *can* build, deploy, and push from here too; just **`git pull` first** so you never ship stale code, and if you see `bad object HEAD` (iCloud dropped pack files) heal with `git fetch origin`. The only reason to prefer the primary is that iCloud occasionally corrupts its `.git`.

**Bottom line:** work in the primary by default; either copy can build + deploy after a `git pull`. Both hold the Netlify site link (`.netlify/state.json` → `siteId ec5f6ba1-c4a5-428b-bc1e-6319dc02f871`). Each copy has a local, gitignored `WORKSPACE_ROLE.md`.

## DEPLOY — manual Netlify, by decision (builds stopped on the site)

**Netlify charges for builds/deploys, so deploys are MANUAL — Joel's standing decision (reaffirmed 2026-08-08).** Git push is for source history + code review, not shipping. The site is linked to `github.com/teamdigitalhost/soccerex` via the Netlify GitHub App, but **"Stopped builds" is set on `soccerex1`**: pushes and PRs trigger nothing. Do NOT re-enable builds without Joel's explicit say-so.

- **ALWAYS `git pull` before building** — a manual deploy once shipped from a copy 47 commits behind main. Prefer `~/deploy-soccerex.sh` on fleet Macs: it pulls first and sources auth from the fleet vault internally.
- Clean installs (`npm ci`, CI, cloud sandboxes) need the committed `.npmrc` (`legacy-peer-deps=true`; react-simple-maps@3 peers cap at React 18, project is on React 19). Do not delete it.
- `VITE_SOCCEREX_API_BASE_URL` is set in Netlify's build env AND defaulted in code; local `.env` carries it for dev.

By hand, from either copy:

```bash
cd ~/projects/soccerex          # or ~/iCloud/Sites/Soccerex-front
git pull                        # ALWAYS pull first so you don't ship stale code
npm run build                   # produces dist/
export NETLIFY_AUTH_TOKEN="$(fleet-secret get personal/netlify/deploy-token)"
netlify deploy --prod --dir=dist   # ships to soccerex1.netlify.app (https://soccerex.com)
```

- **Netlify account, once and for all:** there is ONE Netlify account for every DH/Jett site: **Digital Host** (slug `digitalhost`, Pro plan, joel@digitalhost.co). The Jett sites only lived on a separate Netlify temporarily; that account is gone. The account-wide PAT lives in the fleet vault at **`personal/netlify/deploy-token`** (canonical; `jett/netlify/deploy-token` holds the same value at a historical path — rotate both together). `netlify login` (interactive) also works. See `fleet-secret get personal/netlify/README`.
- **Site link:** `soccerex1` / `siteId ec5f6ba1-c4a5-428b-bc1e-6319dc02f871` (also in `.netlify/state.json` on both copies).
- To preview a build without publishing: `netlify deploy` (no `--prod`) returns a draft URL. Weigh it against the per-deploy cost.

## Notes

- Local dev: `npm run dev` (Vite). Local site is served as `https://soccerex.front` on configured Macs.
- The live site is the source of truth for "is it working" — test against `soccerex1.netlify.app`. Uncommitted local changes are disposable if live is healthy.
- Deeper build/feature notes: `NOTES_FOR_JOEL.md`, `README.md`.
