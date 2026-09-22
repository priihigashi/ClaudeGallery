# School + Home Map — Canonical Requirements

Updated: 2026-09-21

This file is the source of truth for the School + Home Map. Do not silently drop requirements. When a requirement is completed, update the pipeline checklist and the live map in the same change.

## 1. Map purpose
- Compare target schools, Mia's VPK bridge, rental homes, and future purchase references.
- Mobile and desktop must both be first-class.
- Page must be public/shareable.
- Default view must show the full geographic search area, including Pompano/Boca/Delray, Weston, and Cooper City candidates.
- Current-home marker: 1621 NE 34th Ct, Pompano Beach, FL.
- Dropdown stays on **All school areas** until the user explicitly changes it.
- Clicking a school changes map focus only; it never changes the dropdown.

## 2. School inclusion rules
- Secular only.
- Public / charter / magnet / lab schools preferred.
- GreatSchools target: 8/10 or higher for new additions.
- Show:
  - GreatSchools score
  - Florida/state school grade when available
  - secular status
  - grades served
  - VPK on-site yes/no
  - after-school / before-care information
  - school start/end time
  - admission type: zoned / magnet-choice / lab lottery / other
  - whether moving nearby helps eligibility
- A.D. Henderson must explicitly say moving nearby does **not** guarantee admission.
- Morikami must explicitly show magnet/choice status.
- Track at minimum:
  - A.D. Henderson University School
  - Waters Edge Elementary
  - Addison Mizner School
  - Calusa Elementary
  - Blue Lake Elementary
  - Del Prado Elementary
  - Morikami Park Elementary
  - Everglades Elementary, Weston
  - Eagle Point Elementary, Weston
  - Cooper City Elementary
  - Embassy Creek Elementary / Griffin Elementary may be compared
  - Palmview Elementary, Pompano, as a strong nearby option
- Coconut Creek / Wilton Manors: only add if a current 8+/10 school qualifies. Otherwise record exclusion and reason.
- Hollywood is excluded by user preference.

## 3. VPK rules
- Mia needs a one-year VPK bridge before joining Caio's target school.
- If target school has VPK, show that first.
- If not, show best nearby or on-route VPK options.
- Label secular / religious affiliation clearly.
- Show hours, full-day/aftercare when known, and two-dropoff impact.
- Prefer VPK that minimizes total morning drive.

## 4. Rental rules
- Absolute minimum: **2 bedrooms / 2 bathrooms**. Reject any 1-bath rental.
- Default target: **3 bedrooms / 2 bathrooms or better**.
- Property-type priority: **single-family house first**, then a strong townhouse; condo/apartment inventory is low priority and should only survive as a clearly labeled fallback.
- Strong preference: **private backyard**.
- A 2/2 without a private backyard should normally be excluded unless it has a meaningful compensating feature: verified pool, exceptional gated/resort-style amenities, unusually strong condition/value, or exceptional proximity to the target school.
- A 2/2 under roughly **1,100 sqft** should normally be excluded even if cheap unless there is an unusually strong reason to retain it.
- Pool hierarchy: **private pool preferred**, then community pool, then no pool.
- Pool classification must be exact where the listing supports it:
  - private pool
  - community pool
  - pool type unknown / verify
  - no pool
- Private-pool rental visual: **pink**.
- Community-pool rental visual: **orange**.
- Unknown-pool rental visual: **orange with a dashed border / VERIFY label** until confirmed.
- No-pool rental visual: blue.
- A pool label may never imply "private" unless the listing/source supports that classification.
- Normal rent target: around **$4,000 or less**.
- A no-pool rental should generally remain under ~$4,000 unless school proximity, yard, size, condition, or another exceptional perk justifies a modest stretch.
- Pool homes can stretch somewhat above $4,000. The normal live-map ceiling is currently **$4,500**; listings around ~$4,600–$5,000 are stretch/reference options only when they strongly match the brief.
- ~$5,000 rentals are **reference-only**, not normal recommendations.
- Research target: **7–10 useful rental candidates per school area** after quality elimination, not 7–10 filler listings.\n- Search expansion may go only as far as roughly **10 minutes' drive from the target school**; do not keep widening beyond that just to hit a count.\n- Cheaper no-pool homes are valuable and should be included when they meet the 2/2 minimum and are otherwise useful; pool preference must not hide good lower-cost options.\n- Default all-schools map preview must show up to **7 current rental pins + 3 active sale-reference pins per school area** so the visible map does not contradict the school count.
- When inventory is weak, show the best available near the target budget rather than filling the map with low-quality old condos/townhouses.
- Every rental card should show:
  - price
  - beds / baths
  - sqft when available
  - property type
  - backyard yes/no/unknown
  - pool type
  - important community perks
  - target school
  - property-to-school distance and base drive estimate
  - current-home-to-property drive context
  - Zillow/source link
  - current availability/check date
  - history flags when available (price changes, prior rental cycles, last sold)

## 5. Future purchase reference rules
This is reference only; no immediate purchase is assumed.
- Include future sale references near each target school.\n- At least **2–3 active sale references per school area** should be visible in the normal map experience when current inventory exists.
- Prefer houses / townhomes.
- Target comparison buckets when inventory exists:
  - about 2 properties in the ~$300K range
  - about 2 properties in the $400K–$500K range
  - about 2 properties in the $600K–$700K range
- Up to 2 remodel candidates:
  - heavy remodel should generally be below ~$400K
  - around $500K should need only lighter/minor work
- Show sale history and obvious price movement when available.

## 6. Property-history enrichment
For each property, research the source page where possible and record:
- current listing price
- current status / available date
- days on Zillow / days listed when available
- last sold date and price
- prior rent listing history
- major price increases / drops
- repeated recent rental/listing turnover when visible
- year built
- sqft
- pool type
- backyard / lot notes
- community / HOA perks
- school distance shown by source
- 4 preview photos when technically available, otherwise a source thumbnail/screenshot fallback
- full-photo link

Do not invent history when source data is unavailable.

## 7. Current-home and commute rules
Current-home marker:
- 1621 NE 34th Ct, Pompano Beach, FL

For each target school show:
- miles from current home
- base drive estimate
- school start time
- planning leave time to arrive 60 minutes before start
- nearest/on-route VPK
- two-dropoff base estimate when available
- Google Maps directions link for live traffic

For each property show:
- distance / base drive to its target school
- commute should be framed around school-trip hours
- clearly label route estimates as base estimates when live traffic is unavailable

## 8. Map/UI rules
Categories must be visually distinct:
- Home/current address: house icon
- School: compact green circular school marker + always-visible school name
- VPK: yellow
- Rent/no pool: blue
- Rent/private pool: strong pink
- Rent/community pool: pink with distinct border/pattern from private pool
- Sale: purple

Property labels:
- The category letter must be centered inside a compact circular marker: **R** for rent, **S** for sale.
- The price is a separate adjacent pill/label, e.g. **R circle + $3.5K pill**. Do not center the whole "R · $3.5K" sentence inside the circle.
- Rent/no pool: blue marker + price pill.
- Rent/private pool: pink marker + price pill.
- Rent/community pool: orange marker + price pill.
- Rent/unknown pool: orange marker with VERIFY styling.
- Sale: purple marker + price pill.
- Text must be dark/black, legible, and centered within its own shape.

Responsive behavior:
- Desktop detail card stays fully inside map frame, preferably upper-right.
- Mobile detail opens as a bottom sheet fully inside viewport.
- Sidebar scrolls vertically on desktop.
- Mobile property strip scrolls horizontally.
- Filters must always remain clickable.
- Default map bounds must fit all tracked school areas and current home.
- No literal escaped text such as `\\n` may appear in UI.
- Avoid duplicate/redundant SCHOOL labels.

## 9. Filters
At minimum:
- school-area dropdown
- Schools
- VPK
- Rentals
- Sales
- pool type
- max rent
- private backyard / strong perk
- future: price bucket for sale
- future: political-area data only when sourced

“All school areas” stays selected until user changes it.

## 10. Political-area context
Political data is factual context only.
- Show 2024 presidential vote percentages where an official city/precinct source can be matched.
- Prefer exact precinct for a property only when verifiable.
- Never infer a property's politics from nearby streets.
- Use percentages and source/scope; avoid unsupported red/blue guesses.
- User wants blue or competitive areas prioritized for research; clearly red areas are lower research priority.

## 11. Manual Add / Update workflow
Live page must have:
- **Add / Update** button
- **Instructions** button
- Add form can save a local draft on the user's device.
- Add form can create a prefilled GitHub issue for persistent review/update.
- Never put GitHub credentials in browser code.
- Instructions page links to:
  - this requirements file
  - pipeline checklist
  - data file
  - issue form

## 12. Update discipline
Every future update follows:
1. Read this requirements file.
2. Read pipeline checklist.
3. Research sources.
4. Update data.
5. Update UI only when needed.
6. Run syntax/data audit.
7. Commit/push.
8. Wait for GitHub Pages deploy success.
9. Mark checklist rows complete.
10. Share a cache-busted live URL.


## 13. Near-home school and neighborhood screening
- For new schools close to the current Pompano home, target GreatSchools **9/10+**. Do not add a nearby 8/10 merely to expand the list unless there is an exceptional reason.
- Before adding a new school to the live map, prepare a usable rental set so the school does not appear empty.
- For Pompano / Oakland Park / Fort Lauderdale candidates, research the immediate neighborhood/street context rather than assuming the entire city is uniform.
- Add objective context when available: Walk Score or another published walkability measure, nearby park/playground access, gated/community amenities, sidewalks, and practical family-use destinations.
- Do not make unsupported crime/safety claims. If official crime data is later added, identify its geography and date.
- Hollywood remains excluded by user preference.
- South Fort Lauderdale options are lower priority unless the school/property combination is unusually strong.

## 14. Rental quality pruning
- Do not keep weak listings just to hit a count.
- Target **7–10 useful rentals per school** after pruning.
- Remove or de-prioritize roughly $2,300-or-less rentals under about 1,100 sqft when they lack a private yard/private pool or exceptional compensating value.
- Old/small condos and apartments are fallback inventory, not the default.
- Prefer 3 bedrooms. A 2-bedroom option should normally earn its place through pool, backyard, exceptional proximity, or meaningful community perks.
- Keep no-pool homes when they are strong 3-bedroom houses with private yard, exceptional school proximity, or unusually good size/value.
- Stale/off-market listings do not count toward the current target set.

## 15. Source precedence and backup discipline
- Direct listing detail page beats stale search/index results when they conflict about current status.
- Do not promote a listing as current if the direct page says sold/off-market unless a newer authoritative rental source clearly supersedes it.
- Every rental record, including inactive/pruned records, must remain in the Rental Backup Google Sheet.
- The backup is regenerated from the canonical map data after material rental-data changes.
- The live map may hide inactive/low-fit records, but the backup preserves them with the reason.
- If an active school area has fewer than the target number of quality rentals, say so explicitly instead of filling the map with weak inventory.


## 16. Audit / correction discipline
- **Do not delete records during ordinary audits.** Correct the record, set `active:false` when it should be hidden, and record the reason. Preserve it in the rental backup.
- A review pass must never silently shrink the research set. Any hidden/pruned record needs an explicit reason.
- Push work in coherent blocks (UI rules, data corrections, research additions, backup refresh) so a later interruption does not lose completed work.
- Before calling a Zillow record rent or sale, check the direct listing page when possible. If a user reports a mismatch, re-open that exact URL and record the check date/status.
- Current example: 1400 NE 54th St APT 102, Fort Lauderdale, FL 33334 is currently a **rental** on Zillow as of 2026-09-21; keep its direct-source status in the data.
- For listings with image URLs already researched, show up to **4 embedded preview photos** in the detail card. Do not regress those records to link-only.
- Photo backfill remains a required research task for active rentals without embedded previews.

## 17. Rental search expansion order
Use this order when a school area has fewer than the target count:
1. Exact school area / closest radius.
2. Private-pool houses with private yard.
3. Strong 3/2 houses without pool but with private yard / excellent condition / school proximity.
4. 2-bedroom + office or unusually good 2/2 only when it earns its place.
5. Strong gated/community option only as a fallback.
6. Expand the radius slightly **only as a last resort** and label the wider-radius record.
- Hard floor remains 2 bed / 2 bath.
- Normal target remains around $4,000; normal stretch around $4,500.
- $4,600–$5,000 is reference/stretch only for unusually strong private-pool/yard/size/location fit.
- Do not include rentals above $5,000.
- Normal research target is 7–10 quality rentals per school. Morikami and Calusa may stop at 5 best-fit rentals per the current user instruction.
