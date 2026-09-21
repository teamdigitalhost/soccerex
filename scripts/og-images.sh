#!/usr/bin/env bash
# Cuts the link-preview images in public/images/og/ from the site's own photography.
#
# Every preview card (Facebook, LinkedIn, iMessage, Slack, WhatsApp, X) is drawn at
# 1.91:1, and WhatsApp drops images much past 300 KB, so each page gets a 1200x630 JPEG
# rather than its full-size hero. src/lib/pageMeta.js points each route at its file here.
#
# Usage: bash scripts/og-images.sh            (rebuilds every image in the list)
# Needs ffmpeg. To add a page: add a line below, run this, then name the file in pageMeta.js.
#
# Columns: output name | source under public/ | vertical focus (0 = keep the top, 1 = the bottom)
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=public/images/og
mkdir -p "$OUT"

while read -r name src focus; do
  [ -z "$name" ] && continue
  case "$name" in \#*) continue ;; esac
  ffmpeg -loglevel error -y -i "public/$src" \
    -vf "crop='min(iw,ih*40/21)':'min(ih,iw*21/40)':'(iw-ow)/2':'(ih-oh)*$focus',scale=1200:630:flags=lanczos" \
    -q:v 4 "$OUT/$name.jpg"
  printf '%-18s %4s KB  <- %s\n' "$name" "$(( $(stat -f%z "$OUT/$name.jpg") / 1024 ))" "$src"
done <<'LIST'
about             images/about/discover-soccerex.jpg                              0.5
events            hero/12-TIER1-packed-keynote.jpg                                0.5
global-network    hero/234-NEW8-aerial-diverse-crowd-networking.jpg               0.5
gallery           hero/158-MISC-soccerex-global-keynote-packed-audience.jpg       0.5
past-speakers     hero/147-MISC-infantino-wide-shot-soccerex-branding.jpg         0.4
deal-network      hero/174-NEW6-miami-networking-blue-purple-outdoor.jpg          0.5
app               images/app/phone-mockups.jpg                                    0.5
miami-2026        events/miami/2026/sections/nu-stadium-miami-freedom-park.jpg    0.5
attendee-guide    events/miami/2026/sections/nu-stadium-exterior.jpg              0.5
accommodations    events/miami/2026/sections/miami-skyline.jpg                    0.5
sponsor           hero/177-NEW6-miami-packed-diverse-audience.jpg                 0.5
exhibit           hero/266-NEW9-miami-exhibition-floor-wide.jpg                   0.5
ritz-drawing      hotels/ritz-south-beach-lobby.jpg                               0.5
europe-2026       events/europe/2026/sections/arena-interior.webp                 0.5
miami-2025        images/events/events/miami-2025-stage.jpg                       0.5
europe-2025       images/events/events/europe-2025-knvb-stage.jpg                 0.35
mena-2025         images/events/events/mena-2025-cairo-signing.jpg                0.4
miami-2024        images/events/events/miami-2024-verified.jpg                    0.5
europe-2024       images/events/events/europe-2025-verified.jpg                   0.5
miami-2023        images/events/events/miami-2023-verified.jpg                    0.5
LIST
