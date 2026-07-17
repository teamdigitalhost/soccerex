# Soccerex Frontend (website) — workspace & deploy rules

React + Vite single-page site (`teamdigitalhost/soccerex.git`), deployed to **Netlify** (`soccerex1.netlify.app`). This is the public website; it talks to the Soccerex backend API. The backend lives in a separate repo (`teamdigitalhost/soccerex-system`).

## WORKSPACE ROLES — where to work (read this first, do not re-derive it)

This repo has **two working copies on each fleet Mac** — same GitHub repo, fixed roles:

- **PRIMARY — default dev home: `~/projects/soccerex`**
  SSH remote (`git@github.com:…`), clean git (never synced through iCloud). Prefer doing development here (iCloud can corrupt `.git`). Holds the Netlify site link.
- **BACKUP — mirror, also fully functional: `~/iCloud/Sites/Soccerex-front`**
  iCloud copy, for work-from-any-Mac. It is **also deploy-capable** — it has the Netlify site link and an SSH remote. You *can* build, deploy, and push from here too; just **`git pull` first** so you never ship stale code, and if you see `bad object HEAD` (iCloud dropped pack files) heal with `git fetch origin`. The only reason to prefer the primary is that iCloud occasionally corrupts its `.git`.

**Bottom line:** work in the primary by default; either copy can build + deploy after a `git pull`. Both hold the Netlify site link (`.netlify/state.json` → `siteId ec5f6ba1-c4a5-428b-bc1e-6319dc02f871`). Each copy has a local, gitignored `WORKSPACE_ROLE.md`.

## DEPLOY — manual Netlify (NOT git-triggered)

**Netlify charges per deploy, so auto-deploy-on-push is intentionally OFF.** Deploys are manual. Git push is for source history + code review, not shipping. Deploy from either copy after a `git pull` (primary by default):

```bash
cd ~/projects/soccerex          # or ~/iCloud/Sites/Soccerex-front
git pull                        # ALWAYS pull first so you don't ship stale code
npm run build                   # produces dist/
export NETLIFY_AUTH_TOKEN="$(fleet-secret get personal/netlify/deploy-token)"
netlify deploy --prod --dir=dist   # ships to soccerex1.netlify.app (https://soccerex.com)
```

- **Auth (found + verified 2026-07-17):** the Digital Host Netlify account PAT is in the fleet vault at **`personal/netlify/deploy-token`** (also filed at `jett/netlify/deploy-token`; same token, DH is a Pro account and the PAT is account-wide, so it deploys every DH site including this one). `netlify login` (interactive) also works. See `fleet-secret get personal/netlify/README`.
- **Site link:** set on both copies via `.netlify/state.json`. If a deploy ever asks which site to link, it is `soccerex1` / `siteId ec5f6ba1-c4a5-428b-bc1e-6319dc02f871`.
- Preview a build before shipping with `netlify deploy` (no `--prod`) — it returns a draft URL. Weigh it against the per-deploy cost.

## Notes

- Local dev: `npm run dev` (Vite). Local site is served as `https://soccerex.front` on configured Macs.
- The live site is the source of truth for "is it working" — test against `soccerex1.netlify.app`. Uncommitted local changes are disposable if live is healthy.
- Deeper build/feature notes: `NOTES_FOR_JOEL.md`, `README.md`.
