# School + Home Map — Fresh Chat Handoff

Date: 2026-09-21

## Start here — do not rely on old chat summaries alone

Project: public School + Home Map for Priscila and Mike.

Repository:
- GitHub: `priihigashi/ClaudeGallery`
- Live page: https://priihigashi.github.io/ClaudeGallery/school-home-map.html
- UI: `school-home-map.html`
- Canonical data: `school-home-map-data.js`
- Human-readable live rules: `school-home-map-rules.html`
- Canonical requirements: `docs/school-home-map-requirements.md`
- Pipeline/checklist: `docs/school-home-map-pipeline.md`
- GitHub intake template: `.github/ISSUE_TEMPLATE/school-home-map-update.yml`

Rental backup:
- Google Sheet: https://docs.google.com/spreadsheets/d/1EU5jvUIVJstmfWu14PVLMP8SCehp96lyXs7J7jitm3Q/edit
- Tab: `Rentals Backup`
- It must preserve active AND inactive/pruned rental research.
- Current canonical rental count at handoff: 146.

## Continuation update — access + latest audit

- GitHub access is **not blocked**. Connected user `priihigashi` has admin/push access to `priihigashi/ClaudeGallery`; direct file writes and Actions/Pages reads were verified.
- The only remaining access limitation is **interactive live-page browser QA inside the current agent runtime**. This is not a GitHub permission problem; the available public-page reader rejects the GitHub Pages URL and no usable external browser automation is exposed.
- Repo/data work is unaffected by that limitation.
- Rental backup is now **146 canonical rows**, exactly matching the 146 GitHub rental records (zero missing/zero extra).
- Active inventory after school-assignment/status cleanup: A.D. Henderson 10; Waters Edge 8; Addison 8; Blue Lake 9; Del Prado 9; Weston 8; Cooper City 7; Palmview 7; Griffin 7; Eagle Point 8; Floranada 7; Calusa 6; Morikami 5.
- Remaining active Zillow search-result URLs: **0**. Every active rental uses a direct property/listing/manager/MLS page.
- `perks` schema drift was fixed: all rental perks are arrays again.
- Cooper City / Griffin duplicates were audited; wrong-school and stale copies were archived rather than deleted.
- One active pool record, 8954 SW 53rd St, intentionally remains `poolType: unknown` / VERIFY because current rental sources confirm a pool but do not explicitly establish private vs community.
- Latest relevant data commits: `e16c3706145588f1df76bae12e75d08213fb9ecd`, `489778f69625ffaaab13e6f0f9ab0e5f1872ff3a`, `3b2882fa9469e439a8aff8a6442db207619d4744`.

## Latest review correction — visible counts / availability

- The former default all-schools map only preloaded 3 rental pins per school, which made a school label such as 7 rentals visually show only ~3. Fixed: default preview now shows all counted rentals up to 10 plus 3 sale-reference previews.
- Exact default-filter rental counts after availability/school-assignment cleanup: ADH 8; Waters Edge 7; Addison 7; Blue Lake 9; Del Prado 8; Weston/Everglades 9; Eagle Point 10; Cooper City 7; Griffin 7; Palmview 7; Floranada 7; Calusa 5; Morikami 5.
- Search radius is capped at roughly 10 minutes' drive from the target school.
- Cheaper no-pool or community-pool options are valid when they still meet 2/2 and offer useful value/proximity/amenities.
- Pending, off-market, stale, wrong-school, or direct-source-conflict listings are archived with inactiveReason instead of counted active.
- Active generic Zillow `/homes/` search-result URLs: 0.
- Rental backup: 146/146 exact.
- Sale UI now shows 3 reference pins per school, but direct current-status auditing of sale previews remains IN PROGRESS.

## Mandatory working method

1. Read `docs/school-home-map-requirements.md` completely.
2. Read `docs/school-home-map-pipeline.md` completely.
3. Fetch the current live UI/data files before editing.
4. Search current public sources before making current listing/school claims.
5. **Do not delete research during an audit.** Correct it or set `active:false` with an `inactiveReason`; keep it in the backup.
6. Push work in coherent blocks so completed research is not lost.
7. After material rental-data changes, regenerate the SAME rental backup sheet from canonical GitHub data.
8. Run JS syntax + data integrity audits.
9. Wait for GitHub Pages deployment success before saying the live page is updated.
10. Use a cache-busted live URL when asking Priscila to review.

## Current-home / commute requirement

Current home must remain on the map:
- **1621 NE 34th Ct, Pompano Beach, FL**

For every school:
- current-home → school miles/base drive
- school start time
- leave/wake plan to arrive 60 minutes before start
- nearest/on-route VPK
- two-dropoff context when relevant
- Google Maps live-route link

For every property:
- property → target-school base drive/distance
- current-home → property context
- live Google Maps route link where helpful

Base routes are planning estimates, not live traffic.

## Current school set

Keep/research:
- A.D. Henderson University School (FAU Lab School)
- Waters Edge Elementary
- Addison Mizner School
- Calusa Elementary
- Blue Lake Elementary
- Del Prado Elementary
- Everglades Elementary — Weston
- Eagle Point Elementary — Weston
- Morikami Park Elementary — magnet/choice
- Cooper City Elementary
- Griffin Elementary
- Palmview Elementary
- Floranada Elementary

Rules:
- secular only
- new near-home schools should generally be **9/10+**
- elsewhere target 8/10+ unless there is a strong reason
- Hollywood excluded
- Pompano/Oakland Park/Fort Lauderdale candidates need neighborhood/block context too: published walkability, parks, sidewalks/family amenities where available; do not make unsupported safety claims
- A.D. Henderson is lottery; proximity does not guarantee admission
- Morikami is magnet/choice; proximity does not guarantee admission

## Latest rental preferences — treat these as canonical

Hard minimum:
- **2 bedrooms / 2 bathrooms**
- never 1 bathroom

Default target:
- **3 bedrooms / 2 bathrooms**
- 2 bedrooms + office can qualify

Priority:
1. single-family house
2. strong townhouse
3. condo/apartment only as an exceptional fallback

Outdoor:
- **private backyard is strongly preferred**
- a 2/2 without private yard should survive only if it is an exceptional deal, private/community pool, excellent gated/family amenities, exceptional condition/value, or unusually close to school
- avoid small/old/run-down filler
- roughly <=$2,300 and <1,100 sqft with no exceptional feature should normally be hidden/pruned, NOT deleted

Pool:
- private pool is the priority
- community pool second
- no pool only when house/yard/size/location/value is strong
- slight search-radius expansion only as LAST resort

Budget:
- target around $4,000
- normal stretch around $4,500
- $4,600–$5,000 only as explicit stretch/reference for a very strong match
- **never above $5,000**

Inventory:
- target **7–10 quality rentals per normal school**
- Morikami and Calusa may stop at **5 best-fit rentals**
- if inventory is genuinely weak, say so on map rather than using filler

## Pool visualization — latest rule

Do not regress to the old pink-ring convention.

Rental:
- no pool = **blue**
- verified private pool = **pink**
- verified community pool = **orange**
- pool type not verified = orange/VERIFY or dashed styling

Marker shape:
- compact circle contains only **R** for rent or **S** for sale, centered
- price is a separate adjacent pill
- do NOT squeeze `R · $3.5K` or `S · $450K` into one circle

School:
- compact green school marker + always-visible school name

VPK:
- yellow

Home:
- house icon

## Pool audit status

Do a source-by-source pool audit on active pool rentals. Do not infer private pool merely because a listing says “pool.”

Already corrected/verified:
- **425 NE 20th St, Boca Raton** — private salt-water pool; current rental around $4,700; Zillow explicitly supports private pool
- **9367 Lake Serena Dr, Boca Raton** — private pool; Realtor/MiamiMLS says Pool Private: Yes; current rental around $4,700
- **Bell Boca Town Center** — community pool
- **5160 Sabal Gardens Ln #4** — community-pool development
- **1400 NE 54th St #102** — community heated pool; current RENTAL, not an active sale

There are still many older pool classifications that need individual source verification in the next audit. Preserve them while checking; do not delete.

## 1400 NE 54th St #102 — specific correction

User questioned this exact Zillow URL:
https://www.zillow.com/homedetails/1400-NE-54th-St-APT-102-Fort-Lauderdale-FL-33334/71731454_zpid/

Direct Zillow page was checked 2026-09-21 and showed:
- **FOR RENT**
- about $2,950/mo
- 3 bed / 3 bath
- 1,752 sqft
- community heated pool
- Floranada ~0.3 mi
- four preview photo URLs stored in canonical data

Do not reclassify it as sale unless a newer direct source clearly changes status.

## Property cards and photos

Every strong active property should eventually have:
- price
- beds/baths
- sqft
- property type
- backyard
- pool type
- perks
- target school
- property → school route
- current-home context
- current availability/check date
- days listed when available
- year built
- last sale
- rental/listing history
- obvious price changes / repeated turnover flags
- source URL

Photos:
- user strongly prefers **embedded previews**, not link-only
- store/show up to **4 preview images** where reusable source URLs are available
- card may still link to full Zillow gallery
- existing researched photo arrays MUST NOT be removed
- active rentals without photos remain a backfill queue

## Sale references

Reference only, not immediate purchase plan.
When inventory exists near each school:
- ~2 around $300K
- ~2 around $400K–$500K
- ~2 around $600K–$700K
- up to 2 remodel references:
  - heavy remodel generally below ~$400K
  - around $500K should be lighter/minor work
Keep sale records separate from rental records and verify source status.

## UI / filters

Must remain mobile + desktop friendly.

- dropdown stays **All school areas** until USER changes it
- clicking a school does not alter dropdown
- initial map bounds fit current home + Pompano/Boca/Delray + Weston + Cooper City
- desktop property list scrolls vertically
- mobile property strip scrolls horizontally
- detail card stays fully inside viewport
  - desktop upper-right
  - mobile bottom sheet
- filters must always be clickable
- filters include:
  - school area
  - schools
  - VPK
  - rental
  - sale
  - max rent
  - any pool
  - private pool
  - community pool
  - private yard
  - sale price bucket
- Fit all button
- Instructions button
- Add / Update button
- no literal `\\n` garbage in UI

## Manual update workflow

Live map has an Add / Update UI:
- local draft can be saved on device
- persistent update opens GitHub issue workflow
- no GitHub credentials in browser code

The Instructions button must expose the rules/pipeline so Priscila and future agents can spot and correct requirements.

## Political / neighborhood context

User previously asked for red/blue context.
Rules:
- only use sourced factual 2024 vote percentages
- exact city/precinct scope when possible
- do not infer political profile of a house from nearby streets
- do not rank political choices
- neighborhood context should use sourced walkability/family amenities; no unsupported safety claims

## Priority work for the next chat

Do these in order:

### Block 1 — integrity audit
- fetch latest page/data/rules/pipeline
- run JS syntax audit
- verify GitHub Pages deployment
- verify current home appears
- verify dropdown/filter behavior
- verify private-pool pink, community-pool orange, R/S centered circles + price pills
- verify popup/photos on mobile and desktop

### Block 2 — active rental source audit
Re-open direct URLs for active rentals.
For each:
- confirm RENT vs SALE/status
- price
- beds/baths
- sqft
- house/townhouse/condo
- private yard
- private/community/no pool
- availability
- listing history
- last sale
- capture 4 preview photo URLs when possible
Start with:
- Weston / Everglades + Eagle Point
- Cooper City / Griffin
- Floranada / Palmview
- Addison Mizner
- A.D. Henderson
Then Morikami and Calusa (cap at 5 best-fit).

### Block 3 — rental top-up / quality
- normal areas: 7–10 quality rentals
- Morikami/Calusa: max 5 best-fit
- prefer private-pool houses + private yard
- then strong 3/2 houses with yard
- only then exceptional townhouse/community-pool options
- expand radius slightly only if necessary and label it

### Block 4 — photo backfill
Backfill 4 embedded previews on active rentals that remain link-only.

### Block 5 — sale bucket coverage
Top up future-reference sale buckets, without confusing them with rentals.

### Block 6 — backup + deploy
- regenerate the SAME Rental Backup Google Sheet
- update pipeline statuses
- push
- wait for Pages success
- give cache-busted link

## Do not do these things

- Do not silently delete records.
- Do not invent pool type, yard, price, school assignment, safety, or political data.
- Do not trust a Zillow search card over a current direct listing page when they conflict.
- Do not convert the map into a giant card dashboard; it should remain map-first.
- Do not change user filters automatically when a marker is clicked.
- Do not call work complete merely because GitHub accepted a commit; wait for Pages deployment.
