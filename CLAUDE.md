# Soccerex website (teamdigitalhost/soccerex): workspace and deploy rules

React + Vite single-page site, deployed to **Netlify** (site `soccerex1`, https://soccerex.com). It is the public website and talks to the Soccerex backend API, which lives in `teamdigitalhost/soccerex-system`.

## Working copies (fleet Macs)

Same GitHub repo, fixed roles:

- **PRIMARY, work here: `~/projects/soccerex`.** SSH remote, clean git (never synced through iCloud).
- **BACKUP: `~/iCloud/Sites/Soccerex-front`.** iCloud mirror for work from any Mac. It can build and deploy, but iCloud occasionally corrupts `.git` (`bad object HEAD` heals with `git fetch origin`).

No fleet Mac serves a local copy of this site. To look at a change before deploying, run `npm run dev` in your working copy for the length of the task.

Each copy has a local, gitignored `WORKSPACE_ROLE.md`.

## Deploying: manual, by decision

Netlify bills per build, so deploys are **manual**: Joel's standing decision, reaffirmed August 8, 2026. "Stopped builds" is on for `soccerex1`, so a git push publishes nothing; pushing is for history and review. Do not turn builds back on without Joel's explicit say-so.

Deploy with the fleet script, on any fleet Mac:

```bash
~/fleet-library/scripts/deploy-soccerex.sh            # production
~/fleet-library/scripts/deploy-soccerex.sh --dry-run  # every check and the build, no deploy (free)
~/fleet-library/scripts/deploy-soccerex.sh --preview  # draft URL, still counts against the per-deploy cost
```

It refuses to ship anything but a fresh build of `origin/main` with no uncommitted changes, takes the `VITE_*` build variables from the Netlify site, reads the Netlify token from the fleet vault, and deploys `dist/` to `soccerex1`. It exists to prevent two failures:

- `netlify deploy` never builds on its own, so without a fresh `npm run build` an old `dist/` ships silently.
- A deploy once went out from a copy 47 commits behind `main`.

Keep the committed `.npmrc` (`legacy-peer-deps=true`): react-simple-maps@3 caps its React peer at 18 and this project is on React 19, so clean installs fail without it.

Claude cloud sessions cannot deploy this site, because the Netlify token lives only in the fleet vault.

## Where the deploy facts live

Host IDs, the vault entry names, and the rest of this site's deploy facts are in Command Center's deployment registry (fleet Macs only):

```bash
ssh -n -i ~/.ssh/fleet_ed25519 rtmini@100.73.2.108 'cd /Users/al/command-center && php artisan deploys:show soccerex-front'
```

When anything about deploying this site changes, update this file and that record together.

## Notes

- The live site is the source of truth for whether it works: test against https://soccerex.com. Uncommitted local changes are disposable if live is healthy.
- `npm run build` regenerates `public/sitemap.xml` first (`prebuild`).
- Page titles, descriptions and link-preview images live in `src/lib/pageMeta.js`. Pages render them through `PageMeta`, and the edge function `netlify/edge-functions/social-meta.js` writes the same tags into the HTML for link unfurlers, which never run the app. A new route gets its entry there; a new preview image is cut by `scripts/og-images.sh`. Check a route the way Facebook sees it with `curl -s -A "facebookexternalhit/1.1" https://soccerex.com/<path> | grep og:`.
- Deeper build and feature notes: `NOTES_FOR_JOEL.md`, `README.md`.
