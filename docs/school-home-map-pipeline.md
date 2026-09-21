# School + Home Map — Implementation Pipeline

Updated: 2026-09-21 — post full-chat requirements audit

Status values: DONE / IN PROGRESS / TODO / BLOCKED.

| Area | Requirement | Status | Notes |
|---|---|---|---|
| Hosting | Public GitHub Pages URL | DONE | ClaudeGallery |
| Core map | School/VPK/rent/sale layers | DONE | Live |
| Core map | All dropdown must not change on pin click | DONE | Audited |
| UI | Compact school marker + visible school name | DONE | Live |
| UI | Rent and sale price pills readable | DONE | Dark text |
| UI | Responsive popup in viewport | DONE | Desktop + mobile |
| UI | Desktop list scroll | DONE | Implemented |
| UI | Mobile property strip scroll | DONE | Implemented |
| UI | Remove literal escaped newline artifacts | DONE | Audited |
| Pool | Private vs community pool distinction | IN PROGRESS | Data normalization needed |
| Pool | Private-pool rent visual | DONE | Solid pink, no outer ring |
| Pool | Community-pool rent visual | DONE | Pink + outer pink ring; unknown uses dashed ring |
| Home | Current-home marker at 1621 NE 34th Ct | DONE | Home record + house pin in core map |
| Commute | Home → school distance/drive | DONE | OSRM base route + Google Maps live link engine |
| Commute | Leave time for 60-min-early arrival | DONE | School start fields + wake/leave/arrive planner engine |
| Commute | Property → target school drive | DONE | On-demand route + left-list enrichment |
| VPK | On-site/nearby/on-route + 2-dropoff timing | IN PROGRESS | Engine done; VPK records still incomplete for newer schools |
| School | A.D. Henderson | DONE | Needs commute enrichment |
| School | Waters Edge | DONE | Needs commute enrichment |
| School | Addison Mizner | DONE | Needs commute enrichment |
| School | Calusa | DONE | Needs commute enrichment |
| School | Blue Lake | DONE | Needs commute enrichment |
| School | Del Prado | DONE | Needs commute enrichment |
| School | Everglades Weston | DONE | 10/10 |
| School | Eagle Point Weston | DONE | 10/10 + on-site VPK/PreK record added; housing research pending |
| School | Morikami Park | DONE | 10/10 magnet school record added; housing research pending |
| School | Cooper City Elementary | DONE | 10/10 school record + first verified rentals added |
| School | Embassy Creek / Griffin comparison | IN PROGRESS | Griffin 9/10 + VPK added; Embassy Creek comparison still pending |
| School | Palmview Pompano | DONE | 9/10 magnet record added; housing research pending |
| School | Coconut Creek | DONE | Excluded for now: current top elementary options found are 7/10 |
| School | Wilton Manors | DONE | Excluded for now: current elementary is 7/10 |
| Rentals | Up to 10 / school | IN PROGRESS | Weston expanded; others need review |
| Rentals | Private backyard preference | IN PROGRESS | Filter logic implemented; listing-by-listing yard data normalization ongoing |
| Rentals | Pool-focused research | IN PROGRESS | Continue |
| Sales | ~$300K bucket | TODO | 2 per school when available |
| Sales | $400–500K bucket | TODO | 2 per school when available |
| Sales | $600–700K bucket | TODO | 2 per school when available |
| Sales | Remodel candidates | TODO | Up to 2 |
| History | Listing/sale/rent price history | IN PROGRESS | Pilot enrichment stored for Weston/Addison/Blue Lake + Cooper City |
| Photos | 2–3 image preview/slideshow | IN PROGRESS | 3-image preview renderer done; source coverage expanding listing-by-listing |
| Manual updates | Add / Update button | DONE | Local device draft + prefilled GitHub issue workflow |
| Documentation | Instructions button/page | DONE | Human-readable rules page + canonical GitHub docs |
| Pipeline | GitHub issue template | DONE | Structured School Home Map update issue form |
| Politics | 2024 official vote context | TODO | Must source exact scope |
| Audit | JS syntax audit | DONE | Current build parses |
| Audit | Pages deployment verification | DONE | Current deploy success |
