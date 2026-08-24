> # ⛔ FROZEN — DO NOT ADD NEW ENTRIES (2026-08-23)
>
> **Priscila's instruction, 2026-08-23: treat this app as PUBLIC and stop adding anything
> sensitive to it until it has been migrated.**
>
> This repo (`ClaudeGallery`) is **public** and has **GitHub Pages enabled**. That means
> `o-que-eu-acho-data.json` is public, and so is everything ever committed to it. The
> `pri123` password below is a **client-side** check on a public page — it does not make
> any of this private, and changing it will not either.
>
> **Until migration is complete, no Claude/Codex session may commit a new item to
> `o-que-eu-acho-data.json`.** If Priscila asks for a verification, tell her this app is
> frozen pending migration and record it somewhere private instead.
>
> Current state: the data file holds only the original `welcome-2026-06-30` demo item.
> **No sensitive content has been committed.** Keep it that way. Her own entries live in
> her browser's localStorage, on her device, and are not affected by this freeze.
>
> Migration plan: private repo + authenticated deployment (not GitHub Pages), preserving
> this public URL afterwards only as a harmless redirect/placeholder. Tracked in the sheet
> **CODE HOMES — App Repo Registry** (Creations root).
>
> ⚠️ Also note: this app was briefly recorded as the Creations "Political Reaction APP".
> **That mapping was checked on 2026-08-23 and is wrong** — the Political Reaction APP is
> "Civic Reaction Studio", a React/TypeScript + FastAPI + Supabase PWA. This is a separate
> personal tool. Nothing here is Political Reaction APP data.

---
name: o-que-eu-acho
description: Operate Priscila's PERSONAL fact-check site (password pri123). NOT the public Verificamos/Fact-Checked series.
---

# O que eu acho — operating skill

Priscila's PRIVATE fact-check tool: she writes what she thinks, the page shows whether facts back it up. Password `pri123`. Distinct from the public *Verificamos / Fact-Checked* reels (FORMAT-001) and the book/RECEIPTS content.

## Where it lives
- Live: https://priihigashi.github.io/ClaudeGallery/o-que-eu-acho.html
- Repo `priihigashi/ClaudeGallery` (commit via Composio GitHub as priihigashi):
  - `o-que-eu-acho.html` (gate + add form + cards + copiar-texto)
  - `o-que-eu-acho/o-que-eu-acho-sync.gs` (Apps Script; self-creates its Sheet DB)
- Ideas & Inbox: `1IrFrCNGVIF7cvAr9cIuAXvCtUR_-eQN1mdCpHXpfbcU`
- Flow Plans Tracker: `1fggy918FgPfnMQ-dzGQk2zx9uhi2_-uWXMKGW4MA47k`

## Template (FIXED)
1. Nota: Certo / Parcialmente certo / Errado + % de suporte
2. A afirmação (o que ela acha)
3. O pensamento (por quê)
4. Verificação: 3 fontes (fonte/tipo + dado); vazio = "não encontrado"
5. Conclusão
She explains in plain language — interpret her real intention BEFORE giving the nota; verify with real sources.

## Data model (tab Fact-checks)
`id, ts, verdict, pct, afirma, pensa, s1,d1, s2,d2, s3,d3, concl`. verdict in {Certo, Parcialmente certo, Errado}.

## Claude adds a page
POST to the deployed Web App URL: `{action:'add', pass:'pri123', verdict, pct, afirma, pensa, s1,d1,s2,d2,s3,d3, concl}` (same endpoint as the form). Until deployed, page is localStorage-only.

## Accounts
Composio (mcfollingproperties) = GitHub only, cannot write her Drive. Apps Script self-creates its Sheet in HER Drive (she deploys).

## Remaining manual step
Deploy `o-que-eu-acho-sync.gs` (Web app, Execute as Me, Anyone) -> paste URL into SYNC_URL in the HTML + commit.
