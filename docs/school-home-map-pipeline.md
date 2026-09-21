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
| Rentals | 7–10 active useful rentals per target school | DONE | 7–10 for normal targets; Morikami/Calusa intentionally capped at 5 best-fit per user |
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
| Audit | GitHub Pages deployment verification | IN PROGRESS | Verify after this batch |

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
