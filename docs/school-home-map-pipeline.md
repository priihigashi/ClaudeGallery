# School + Home Map — Implementation Pipeline

Updated: 2026-09-21

Status values: DONE / IN PROGRESS / TODO / BLOCKED.

| Area | Requirement | Status | Notes |
|---|---|---|---|
| Hosting | Public GitHub Pages URL | DONE | ClaudeGallery |
| Core map | School/VPK/rent/sale layers | DONE | Live data model |
| Core map | Current-home marker: 1621 NE 34th Ct | DONE | Home pin + route origin |
| Core map | All dropdown never changes from pin clicks | DONE | Audited |
| Core map | Initial bounds fit Pompano + Boca/Delray + Weston/Cooper City | DONE | maxZoom 9 |
| UI | Compact school marker + visible school name | DONE | Live code |
| UI | Rent/sale price pills readable | DONE | Dark centered text |
| UI | Private/community/unknown pool visuals | DONE | Private solid pink; community ring; unknown dashed |
| UI | Responsive popup stays in viewport | DONE | Desktop top-right; mobile bottom sheet |
| UI | Desktop property list scroll | DONE | Vertical |
| UI | Mobile property strip scroll | DONE | Horizontal |
| UI | Filters stay clickable / pool modes mutually understandable | DONE | Any pool + private pool + private yard |
| UI | Remove literal escaped newline artifacts | DONE | Audited |
| Documentation | Canonical requirements file | DONE | docs/school-home-map-requirements.md |
| Documentation | Rules / instructions page | DONE | school-home-map-rules.html |
| Manual updates | Add / Update button | DONE | Local draft + GitHub issue handoff |
| Manual updates | GitHub issue template | DONE | Persistent update intake |
| Commute | Current home → school base distance/drive | DONE | OSRM base route + Google live-route link |
| Commute | Planning leave/wake time for 60-min-early arrival | DONE | School detail card |
| Commute | Property → target school base route | DONE | Enriched when school group is loaded |
| Commute | Current home → property route | DONE | Enriched when school group is loaded |
| VPK | On-site vs nearby VPK context | IN PROGRESS | On-site flags exist; route quality still school-by-school |
| VPK | Two-dropoff drive estimate | DONE | Computed when nearby VPK record exists |
| School | A.D. Henderson | DONE | Lab lottery warning |
| School | Waters Edge | DONE | Boca |
| School | Addison Mizner | DONE | Boca |
| School | Calusa | DONE | Boca |
| School | Blue Lake | DONE | Boca |
| School | Del Prado | DONE | Boca |
| School | Everglades Elementary | DONE | Weston + on-site VPK |
| School | Eagle Point Elementary | DONE | Weston + on-site VPK |
| School | Morikami Park Elementary | DONE | Magnet / choice |
| School | Cooper City Elementary | DONE | Cooper City |
| School | Griffin Elementary | DONE | Cooper City + VPK |
| School | Palmview Elementary | DONE | Pompano / magnet |
| School | Coconut Creek | DONE | Excluded for now: no researched 8+/10 target added |
| School | Wilton Manors | DONE | Excluded for now: no researched 8+/10 target added |
| School | Hollywood | DONE | Excluded by user preference |
| Rentals | Hard minimum 2/2; default target 3/2 | DONE | Curation filter + rules |
| Backup | Rental backup sheet | DONE | 136 rental records backed up to Google Sheet: https://docs.google.com/spreadsheets/d/1EU5jvUIVJstmfWu14PVLMP8SCehp96lyXs7J7jitm3Q/edit |
| Rentals | Remove/demote weak small 2/2 filler | DONE | Inactive records retained for research history |
| Rentals | 7–10 active useful rentals per target school | DONE | A.D. Henderson 10; Waters Edge 8; Addison 8; Blue Lake 9; Del Prado 9; Weston 8; Cooper City 7; Palmview 7; Griffin 7; Eagle Point 8; Floranada 7. Morikami 5 and Calusa 6 are within the user-approved lower inventory target. Counts exclude stale/wrong-school duplicates. |
| Rentals | Private-yard preference | DONE | Filter + data field |
| Rentals | Pool-focused research | IN PROGRESS | Pool type verified on strongest listings; more normalization ongoing |
| History | Listing/sale/rent price history | IN PROGRESS | Structured fields + pilot enrichment |
| Photos | 4 preview photos/slideshow | IN PROGRESS | Embedded when reusable source URLs exist; fallback opens source gallery |
| Sales | ~$300K bucket | IN PROGRESS | Existing coverage audited; some school areas still need 2-per-bucket top-up |
| Sales | $400–500K bucket | IN PROGRESS | Existing coverage audited; some school areas still need 2-per-bucket top-up |
| Sales | $600–700K bucket | IN PROGRESS | Existing coverage audited; some school areas still need 2-per-bucket top-up |
| Sales | Remodel candidates | TODO | Up to 2 where appropriate |
| Politics | 2024 official vote context | TODO | Must use exact official scope / precinct; no guessing |
| Audit | JS syntax + data audit | DONE | Required before each deployment |
| Audit | GitHub Pages deployment verification | DONE | Page-code commit 8f6f479 deployed successfully; final docs-only deploy rechecked at handoff |

| School discovery | Near-home 9/10+ screening | DONE | Floranada 9/10 and Palmview 9/10 are mapped; Hollywood excluded; other close-area candidates require 9/10+ standard |
| Neighborhood | Walkability / family-area context | IN PROGRESS | Floranada/Palmview objective context added; extend only with sourced block-level data |
| Rental cleanup | Remove weak/stale filler | IN PROGRESS | First Boca/Weston pruning block completed 2026-09-21 |

| Weston | Eagle Point rental block | DONE | 8 preference-matched candidates including private-pool houses |
| Boca/Delray | Morikami rental block | DONE | Curated to 5 best-fit active candidates per user; removed extras remain in backup |
| Cleanup | Stale Cooper City rentals | DONE | Removed off-market 8950 SW 53rd and 9240 SW 56th; replacements added |
| Photos/history | Strong-property pilot | DONE | Up to 4 embedded previews + listing history added where reusable source URLs were verified |

| Pool research | Private vs community verification | IN PROGRESS | Strongest listings re-verified; private pool only when listing explicitly supports it; unknown stays unknown |

| Audit | Source precedence | DONE | Direct detail page wins over stale search result when status conflicts |
| UI | Low-inventory warning | DONE | Focus bar flags fewer than 7 matching rentals |
| UI | Default rent ceiling | DONE | $4,500; stretch to $5,000 remains manual/reference |
| Backup | Canonical regeneration | DONE | Google Sheet rebuilt from canonical data after rental audit |

| Rentals | Blue Lake rental floor | DONE | Added current 3/3 2,180 sqft house; active set now reaches 7 |

| UI | Sale price filter | DONE | All / ~$250–399K / ~$400–550K / ~$600–750K |
| Classification | 1400 NE 54th St #102 | DONE | Direct Zillow detail verified current FOR RENT, not active sale |


| UI | R/S centered circle + separate price pill | DONE | Category letter centered in circle; price in separate pill |
| UI | Community pool = orange; private pool = pink | DONE | Unknown pool stays orange/VERIFY until confirmed |
| Data audit | Direct rent/sale URL classification | IN PROGRESS | Exact Zillow pages take precedence; continue one-by-one on active records |
| Data audit | 1400 NE 54th St #102 | DONE | Zillow currently says condo for rent, $2,950/mo, 3/3 |
| Photos | Preserve existing embedded photo sets | DONE | Never regress researched photo records to link-only |
| Photos | Backfill 4 previews on active rentals | IN PROGRESS | Continue in next research blocks |
| Rental audit | Never delete during review; archive with reason | DONE | Canonical rule added |
| Rental search | Slight radius expansion only as last resort | DONE | Canonical rule added |
| Rental search | $5K hard ceiling / $4.5K normal stretch | DONE | Canonical rule added |

| Pool audit | 425 NE 20th St | DONE | Zillow explicitly: Has private pool = Yes; updated to $4,700 |
| Pool audit | 9367 Lake Serena Dr | DONE | Realtor/MiamiMLS explicitly: Pool Private = Yes; current $4,700 |
| Pool audit | Bell Boca Town Center | DONE | Community pool apartment property |
| Pool audit | 5160 Sabal Gardens Ln #4 | DONE | Community-pool development; not private |
| Backup | Rental backup regenerated after latest corrections | DONE | 136 canonical rental records preserved |
| Continuity | Fresh-chat handoff prompt | DONE | docs/school-home-map-handoff-2026-09-21.md |

| Final handoff audit | Page JavaScript parses | DONE | Rechecked after marker/filter fix |
| Final handoff audit | Home pin + Morikami present in canonical data | DONE | 1621 NE 34th Ct + Morikami school record |
| Final handoff audit | Pool filters + R/S marker layout | DONE | Any/private/community pool + centered category circle + price pill |
| Final handoff audit | Rental backup current | DONE | 136 canonical rental rows preserved in same Google Sheet |
| Pool audit | Remaining active pool records source-by-source | IN PROGRESS | 53 active rentals currently have pool=true. One active record (8954 SW 53rd St) intentionally remains poolType=unknown/VERIFY because the current rental source confirms a pool but does not explicitly establish private vs community. |


| Rental source audit | 16-record correction block | DONE | Commit 8c19cbbfa012e78eab31e1435e6458a891adc573; corrected source URLs/status, pool type, yard, and history metadata without deleting research history. |
| Classification | 5765 SW 104th Ter | DONE | Exact-address Zillow page is now $25,000/mo, 5/6.5, 4,314 sqft with private pool; prior $3,850 3/3 record was an address/source mismatch. Preserved but set inactive. |
| Classification | 22750 Pickerel Cir | DONE | Current Realtor page plus Zillow rental search show $3,500 current rental; preserved active despite older Zillow property-history removal events. |
| Classification | 21583 Villa Nova Dr | DONE | Current Realtor/MLS status is Pending; private screened pool + fenced yard verified. Preserved in backup but hidden from active map. |
| Backup | Post-audit 16-row sync | DONE | Existing 126-row Google Sheet updated only for the 16 touched rentals and all 16 rows re-read successfully. |
| Rental inventory | Waters Edge replacement after stale-source cleanup | DONE | Active set restored to 8 with 11698 Timbers Way, 22274 Misty Woods Way, and 22312 Whistling Pines Ln; 10838 Winding Creek archived because MLS assigns Coral Sunset Elementary. |


| School-area audit | 5387 Grand Park Pl + 948 NW 18th Ave | DONE | Current MLS school fields name Blue Lake Elementary; moved both rentals from Addison to Blue Lake instead of keeping them under the wrong school. |
| Pool audit | 5387 Grand Park Pl + 948 NW 18th Ave | DONE | MLS confirms association/community pools; both changed from none to community. |
| Pool audit | 9636 Tavernier Dr | DONE | Realtor direct detail explicitly says community pool / tennis / racquetball; changed from none to community and corrected direct-source sqft to 1,820. |
| Classification | 896 SW 9th Street Cir #9 | IN PROGRESS | Zillow direct detail says available now while current Realtor indexes say Pending. Kept active under source-precedence rule, flagged status conflict, and verified Boca Terrace community pool amenities. |
| Photos | Second preview backfill | DONE | Added 4 embedded previews each to 896 SW 9th #9, 5387 Grand Park Pl, and 9636 Tavernier Dr (12 previews total). |
| Backup | Post-audit 5-row sync | DONE | Five touched rows synced to the canonical 126-row Google Sheet; school-group changes, pool types, direct URLs and photo columns re-read successfully. |
| Data audit | Remaining active search-result URLs | IN PROGRESS | Reduced from 54 at the start of this continuation to 21 active search-result URLs. Continue replacing them with direct detail pages before relying on status/pool metadata. |


| Access | GitHub connector permissions | DONE | Connected GitHub user priihigashi has admin/push access to priihigashi/ClaudeGallery. Reads, writes, Actions inspection and Pages verification work directly; no user permission change is needed. |
| Live QA | Interactive GitHub Pages click/viewport smoke test | BLOCKED | This is not a GitHub permission issue. The available public-page reader rejects the priihigashi.github.io URL and the current runtime has no usable external browser automation. Repo/data work and Pages deployment verification are unaffected. |
| Rental source audit | Waters Edge direct-source rebuild | DONE | Commit e16c3706145588f1df76bae12e75d08213fb9ecd restored 8 valid active candidates and archived the Coral Sunset misassignment. Pages deployment succeeded. |
| School assignment audit | Cooper City vs Griffin duplicates | DONE | Commits 489778f69625ffaaab13e6f0f9ab0e5f1872ff3a and 3b2882fa9469e439a8aff8a6442db207619d4744 removed duplicate/wrong-school counts and restored both target schools to 7 active candidates. |
| School assignment audit | 5009 SW 104th Ave | DONE | Current listing-agent/MLS data assigns Embassy Creek Elementary; Cooper City and Griffin copies archived, not deleted. |
| Availability audit | 5131 SW 101st Ter | DONE | Invitation Homes direct page says no longer available; both duplicate school copies archived despite stale syndication. |
| Data schema | Rental perks arrays | DONE | Normalized 21 string-form perks fields to arrays so strong-perk filtering and card rendering can use them correctly. |
| Photos | Latest direct-source backfill | DONE | Added reusable 4-photo sets to 9810 SW 57th, 5313 SW 118th, and 5232 SW 122nd plus earlier Waters/Griffin additions. 28 active rentals now have embedded preview sets. |
| Backup | Canonical 136-row reconciliation | DONE | GitHub has 136 rental records and the Google Sheet has exactly 136 corresponding rows; zero missing and zero extra after final readback. |
| Data audit | Rental structural rules | DONE | 99 active rentals; zero active below 2/2, zero active over $5,000, zero non-array perks fields. |


| UI audit | School count vs visible pins | DONE | Root cause found: default all-schools preload was hard-coded to 3 rentals per school. Updated to show every counted active rental (up to 10) plus 3 sale-reference previews per school. |
| Rental availability | South-area refresh | IN PROGRESS | Rechecked Cooper City/Griffin/Weston/Eagle/Palmview/Floranada current inventory. Direct/current sources take precedence over removed or stale search cards. |
| Rental inventory | Cheaper Weston / Eagle options | DONE | Reactivated 4297 Pine Ridge ($3,000, Everglades) and added 16219 Emerald Cove (~$3,350, Everglades), 52 Simonton ($2,399, Eagle Point), and 103 Riviera ($2,799, Eagle Point). Weston now 10 active; Eagle Point 10 active. |
| Classification | 1448 NE 27th Ct | DONE | Reconciled September removal/relist conflict using current direct Realtor rental page; updated active record to $3,100, 3/2, 1,329 sqft and noted relist history. |
| Search radius | School-area expansion cap | DONE | Canonical rule now limits expansion to roughly 10 minutes' drive from the target school; do not keep widening just to hit a count. |
| Sale visibility | 3 default sale previews per school | DONE | Existing data already has at least 5 active sale references per mapped school area; default map now exposes 3 sale pins per school for buy-vs-rent comparison. |
| Backup | Post-review reconciliation | DONE | Canonical rental set increased to 139 records; Google Sheet readback matches 139/139 with zero missing and zero extra. |
