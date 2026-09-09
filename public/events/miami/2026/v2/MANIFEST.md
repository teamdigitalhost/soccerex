# Miami 2026 page rebuild: web-ready assets

Staged here for the second Miami page, served from /events/miami/2026/v2/.
Nothing in this directory is referenced by the live page.

## venue/
Every image resized to a 2000px maximum width, re-encoded progressive JPEG at
quality 82, except logos which stay PNG or SVG for transparency.

| File | Use | Source |
|---|---|---|
| mfp-aerial-render.jpg | The hero. Stadium, district and skyline in one frame | miamifreedompark.com |
| mfp-district-view.jpg | Second scale image, ground level across the district | miamifreedompark.com |
| mfp-background.jpg | Wide section background | miamifreedompark.com |
| mfp-hero.jpg, mfp-hero-2.jpg | Secondary district imagery | miamifreedompark.com |
| intermiami-x-soccerex-cobrand.jpg | Carries the approved campaign line | nustadium.com |
| nu-stadium-entrance.jpg | Arrival | nustadium.com |
| nu-stadium-grand-staircase.jpg | The staircase into the 360 concourse | nustadium.com |
| nu-stadium-transit-access.jpg | The elevated transit approach | nustadium.com |
| nu-stadium-facade-texture.jpg | Perforated metal facade, section divider texture | nustadium.com |
| nu-stadium-logo.svg | Venue mark | nustadium.com |
| miami-freedom-park-logo.png | Development mark | miamifreedompark.com |

## partners/
| File | Rights |
|---|---|
| roc-nation-master.png (2715x3620), -white, -black | Roc Nation's own site. Real marks. |
| gmcvb-corp-logo-blue.png (350x65) | GMCVB corporate lockup. Small; request larger from GMCVB. |
| concacaf, mls, mls-next-pro, fc-barcelona, special-olympics, catapult, telemundo, fox-sports (SVG) | Wikimedia. LAYOUT ONLY, clear before production. |
| miami-freedom-park.jpg | Development photo |

NOT collected, deliberately: Inter Miami, Bundesliga, NWSL, Club America, AFA,
Atlanta United, Brighton. All trademarked and marked non-free. Request from each
partner rather than scraping.

## Speaker headshots are NOT bundled here
65 official headshots exist, but the page should read them live from
/api/v1/events/soccerex-miami-2026/speakers, which returns photo_url per speaker.
Bundling them would freeze a roster that is still changing. The local stash for
design mockups is at ~/Documents/soccerex-miami-2026/assets/speakers.
