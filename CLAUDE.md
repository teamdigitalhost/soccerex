# Soccerex Frontend (website) — workspace & deploy rules

React + Vite single-page site (`teamdigitalhost/soccerex.git`), deployed to **Netlify** (`soccerex1.netlify.app`). This is the public website; it talks to the Soccerex backend API. The backend lives in a separate repo (`teamdigitalhost/soccerex-system`).

## WORKSPACE ROLES — where to work (read this first, do not re-derive it)

This repo has **two working copies on each fleet Mac** — same GitHub repo, fixed roles:

- **PRIMARY — agentic development + deploys: `~/projects/soccerex`**
  SSH remote (`git@github.com:…`), clean git (never synced through iCloud), holds the **Netlify site link** (`.netlify/state.json` → `siteId ec5f6ba1-c4a5-428b-bc1e-6319dc02f871`). **Do all work here** — edit, `npm run build`, commit, push, and run the manual Netlify deploy.
- **BACKUP — manual mirror: `~/iCloud/Sites/Soccerex-front`**
  iCloud copy, for work-from-any-Mac convenience and as a backup. **Do not develop or deploy here.** Keep it current with `git pull`. iCloud partial-syncs `.git` and can drop pack files (`bad object HEAD`) — heal with `git fetch origin`.

Each copy has a local, gitignored `WORKSPACE_ROLE.md` stating which one it is.

## DEPLOY — manual Netlify (NOT git-triggered)

**Netlify charges per deploy, so auto-deploy-on-push is intentionally OFF.** Deploys are manual and only from the PRIMARY copy (it holds the site link). Git push is for source history + code review, not shipping.

```bash
cd ~/projects/soccerex
git pull                       # make sure primary is current
npm run build                  # produces dist/
netlify deploy --prod --dir=dist   # ships to soccerex1.netlify.app
```

- **Auth:** the Netlify CLI must be authenticated first — `netlify login` (interactive), or export `NETLIFY_AUTH_TOKEN`. Auth is global to the CLI, not per-repo. (There is a `jett/netlify/deploy-token` in the fleet vault, but it is jett-scoped, not soccerex.)
- **Site link:** already set on the primary via `.netlify/state.json`. If a deploy ever asks which site to link, it is `soccerex1` / `siteId ec5f6ba1-c4a5-428b-bc1e-6319dc02f871`.
- Preview a build before shipping with `netlify deploy` (no `--prod`) — it returns a draft URL. Weigh it against the per-deploy cost.

## Notes

- Local dev: `npm run dev` (Vite). Local site is served as `https://soccerex.front` on configured Macs.
- The live site is the source of truth for "is it working" — test against `soccerex1.netlify.app`. Uncommitted local changes are disposable if live is healthy.
- Deeper build/feature notes: `NOTES_FOR_JOEL.md`, `README.md`.
