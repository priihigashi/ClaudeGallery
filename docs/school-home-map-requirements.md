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
- Minimum 2 bedrooms / 2 bathrooms.
- Primary preference: house or townhouse.
- Strong preference: private backyard.
- 2/2 without private backyard should normally be excluded unless there is a strong compensating perk:
  - gated community
  - strong clubhouse / playground / family amenities
  - exceptional location very close to target school
  - unusually strong value / layout / condition
- Older apartment/condo inventory is low priority unless exceptional.
- Current rent ceiling: up to $4,300.
- Without a pool, prefer under $4,000 unless proximity/perks justify otherwise.
- Current research target: up to 10 rental candidates per school.
- Focus future rental research on homes with pools.
- Pool classification must be exact:
  - private pool
  - community pool
  - no pool / unknown
- Private-pool rentals get the strongest pink visual treatment.
- Community-pool rentals stay pink but must have a distinct visual treatment from private pool.
- No-pool rentals stay blue.
- Every rental card should show:
  - price
  - beds / baths
  - sqft when available
  - property type
  - backyard yes/no/unknown
  - pool type
  - important community perks
  - target school
  - property-to-school distance and drive estimate
  - home-to-property or home-to-school context as appropriate
  - Zillow/source link
  - current availability check date

## 5. Future purchase reference rules
This is reference only; no immediate purchase is assumed.
- Include future sale references near each target school.
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
- 2–3 preview photos when technically available, otherwise a source thumbnail/screenshot fallback
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
- Rent: `R · $3.5K`
- Sale: `S · $450K`
- Text must be dark/black and centered.

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
