# Soccerex Frontend (website) — workspace & deploy rules

React + Vite single-page site (`teamdigitalhost/soccerex.git`), deployed to **Netlify** (`soccerex1.netlify.app`). This is the public website; it talks to the Soccerex backend API. The backend lives in a separate repo (`teamdigitalhost/soccerex-system`).

## WORKSPACE ROLES — where to work (read this first, do not re-derive it)

This repo has **two working copies on each fleet Mac** — same GitHub repo, fixed roles:

- **PRIMARY — default dev home: `~/projects/soccerex`**
  SSH remote (`git@github.com:…`), clean git (never synced through iCloud). Prefer doing development here (iCloud can corrupt `.git`). Holds the Netlify site link.
- **BACKUP — mirror, also fully functional: `~/iCloud/Sites/Soccerex-front`**
  iCloud copy, for work-from-any-Mac. It is **also deploy-capable** — it has the Netlify site link and an SSH remote. You *can* build, deploy, and push from here too; just **`git pull` first** so you never ship stale code, and if you see `bad object HEAD` (iCloud dropped pack files) heal with `git fetch origin`. The only reason to prefer the primary is that iCloud occasionally corrupts its `.git`.

**Bottom line:** work in the primary by default; either copy can build + deploy after a `git pull`. Both hold the Netlify site link (`.netlify/state.json` → `siteId ec5f6ba1-c4a5-428b-bc1e-6319dc02f871`). Each copy has a local, gitignored `WORKSPACE_ROLE.md`.

## DEPLOY — auto-deploy from GitHub main (since 2026-08-08)

**Push to `main` → Netlify builds and publishes to https://soccerex.com automatically** (about 1 minute). Site `soccerex1` is linked to `github.com/teamdigitalhost/soccerex` via the Netlify GitHub App; build settings come from `netlify.toml` (`npm run build` → `dist`, Node 20) and `VITE_SOCCEREX_API_BASE_URL` is set in Netlify's build env. A merged PR IS a deploy, so never push unfinished work to `main`; use a branch, and PRs get a Netlify Deploy Preview URL automatically.

Notes on the change:
- The old rule "Netlify charges per deploy, keep auto-deploy off" is retired: the Digital Host account is Pro, other DH sites (draft.jettsports.com etc.) already auto-build on it, and manual deploys caused real drift (one copy was deploying 47 commits behind main).
- Clean installs (`npm ci`, Netlify CI, cloud sandboxes) need the committed `.npmrc` (`legacy-peer-deps=true`; react-simple-maps@3 peers cap at React 18). Do not delete it.

**Manual fallback** (Netlify CI down, or shipping an emergency local build) — prefer `~/deploy-soccerex.sh` on fleet Macs (auth handled internally via the fleet vault). By hand, from either copy after a `git pull`:

```bash
cd ~/projects/soccerex          # or ~/iCloud/Sites/Soccerex-front
git pull                        # ALWAYS pull first so you don't ship stale code
npm run build                   # produces dist/
export NETLIFY_AUTH_TOKEN="$(fleet-secret get personal/netlify/deploy-token)"
netlify deploy --prod --dir=dist   # ships to soccerex1.netlify.app (https://soccerex.com)
```

- **Netlify account, once and for all:** there is ONE Netlify account for every DH/Jett site: **Digital Host** (slug `digitalhost`, Pro plan, joel@digitalhost.co). The Jett sites only lived on a separate Netlify temporarily; that account is gone. The account-wide PAT lives in the fleet vault at **`personal/netlify/deploy-token`** (canonical; `jett/netlify/deploy-token` holds the same value at a historical path — rotate both together). `netlify login` (interactive) also works. See `fleet-secret get personal/netlify/README`.
- **Site link:** `soccerex1` / `siteId ec5f6ba1-c4a5-428b-bc1e-6319dc02f871` (also in `.netlify/state.json` on both copies).
- A manual deploy is overwritten by the next push to `main` — land the fix in git promptly.

## Notes

- Local dev: `npm run dev` (Vite). Local site is served as `https://soccerex.front` on configured Macs.
- The live site is the source of truth for "is it working" — test against `soccerex1.netlify.app`. Uncommitted local changes are disposable if live is healthy.
- Deeper build/feature notes: `NOTES_FOR_JOEL.md`, `README.md`.
