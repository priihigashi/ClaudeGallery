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
| Backup | Rental backup sheet | DONE | 126 rental records backed up to Google Sheet: https://docs.google.com/spreadsheets/d/1EU5jvUIVJstmfWu14PVLMP8SCehp96lyXs7J7jitm3Q/edit |
| Rentals | Remove/demote weak small 2/2 filler | DONE | Inactive records retained for research history |
| Rentals | 7–10 active useful rentals per target school | IN PROGRESS | Waters Edge remains at 6 after stale-source cleanup. Addison is 8, Blue Lake 9, Del Prado 9, Weston 8, Cooper City 10, Griffin 7, Eagle Point 8, Palmview 8, A.D. Henderson 10; Morikami stays capped at 5 and Calusa currently has 6. Do not refill with stale/weak inventory. |
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
| Backup | Rental backup regenerated after latest corrections | DONE | 126 canonical rental records preserved |
| Continuity | Fresh-chat handoff prompt | DONE | docs/school-home-map-handoff-2026-09-21.md |

| Final handoff audit | Page JavaScript parses | DONE | Rechecked after marker/filter fix |
| Final handoff audit | Home pin + Morikami present in canonical data | DONE | 1621 NE 34th Ct + Morikami school record |
| Final handoff audit | Pool filters + R/S marker layout | DONE | Any/private/community pool + centered category circle + price pill |
| Final handoff audit | Rental backup current | DONE | 126 canonical rental rows preserved in same Google Sheet |
| Pool audit | Remaining active pool records source-by-source | IN PROGRESS | 48 active rentals currently have pool=true after two audit blocks; no active unknown poolType fields, but older classifications still need direct-source verification. |


| Rental source audit | 16-record correction block | DONE | Commit 8c19cbbfa012e78eab31e1435e6458a891adc573; corrected source URLs/status, pool type, yard, and history metadata without deleting research history. |
| Classification | 5765 SW 104th Ter | DONE | Exact-address Zillow page is now $25,000/mo, 5/6.5, 4,314 sqft with private pool; prior $3,850 3/3 record was an address/source mismatch. Preserved but set inactive. |
| Classification | 22750 Pickerel Cir | DONE | Current Realtor page plus Zillow rental search show $3,500 current rental; preserved active despite older Zillow property-history removal events. |
| Classification | 21583 Villa Nova Dr | DONE | Current Realtor/MLS status is Pending; private screened pool + fenced yard verified. Preserved in backup but hidden from active map. |
| Backup | Post-audit 16-row sync | DONE | Existing 126-row Google Sheet updated only for the 16 touched rentals and all 16 rows re-read successfully. |
| Rental inventory | Waters Edge replacement after stale-source cleanup | IN PROGRESS | Active set is 6. 11606 Orange Blossom is pending and 22541 Vistawood is leased/closed, so neither was promoted merely to restore the count. |


| School-area audit | 5387 Grand Park Pl + 948 NW 18th Ave | DONE | Current MLS school fields name Blue Lake Elementary; moved both rentals from Addison to Blue Lake instead of keeping them under the wrong school. |
| Pool audit | 5387 Grand Park Pl + 948 NW 18th Ave | DONE | MLS confirms association/community pools; both changed from none to community. |
| Pool audit | 9636 Tavernier Dr | DONE | Realtor direct detail explicitly says community pool / tennis / racquetball; changed from none to community and corrected direct-source sqft to 1,820. |
| Classification | 896 SW 9th Street Cir #9 | IN PROGRESS | Zillow direct detail says available now while current Realtor indexes say Pending. Kept active under source-precedence rule, flagged status conflict, and verified Boca Terrace community pool amenities. |
| Photos | Second preview backfill | DONE | Added 4 embedded previews each to 896 SW 9th #9, 5387 Grand Park Pl, and 9636 Tavernier Dr (12 previews total). |
| Backup | Post-audit 5-row sync | DONE | Five touched rows synced to the canonical 126-row Google Sheet; school-group changes, pool types, direct URLs and photo columns re-read successfully. |
| Data audit | Remaining active search-result URLs | IN PROGRESS | Reduced from 38 to 33 active search-result URLs in this block; continue replacing with direct detail pages before relying on status/pool metadata. |
