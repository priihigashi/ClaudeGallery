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

# O que eu acho — fact-check pessoal da Pri

Site privado (senha `pri123`) onde a Pri escreve o que ela acha e a verificação mostra se bate com os fatos.
**NÃO** é a série pública *Verificamos / Fact-Checked* nem o livro/RECEIPTS — é uma ferramenta pessoal dela.

- App: `o-que-eu-acho.html` -> https://priihigashi.github.io/ClaudeGallery/o-que-eu-acho.html
- **Dados: `o-que-eu-acho-data.json`** (no repo) — a página lê daqui, em qualquer aparelho. A Claude adiciona
  verificações commitando neste arquivo (via Composio GitHub, como priihigashi). Schema: `{ "items": [ {id, ts,
  verdict, pct, afirma, pensa, s1,d1, s2,d2, s3,d3, concl} ] }`. Adições da Pri pelo formulário ficam no localStorage
  do aparelho dela e são mescladas na exibição.

## Template (estrutura fixa — não mudar)
1. **Nota** no topo: Certo / Parcialmente certo / Errado + % de suporte
2. **A afirmação** — o que ela acha
3. **O pensamento** — por quê ela acha
4. **Verificação** — 3 caixas (fonte/tipo + dado); caixa vazia = "não encontrado"
5. **Conclusão** — por que está errado / o complemento / os dois

Cada card tem botão **"Copiar texto"** (formatado pra redes sociais).

## Apps Script `o-que-eu-acho-sync.gs` — OPCIONAL (não é necessário)
O site JÁ funciona em qualquer aparelho lendo o JSON acima — **a Pri não precisa fazer deploy de nada.**
O Apps Script `o-que-eu-acho-sync.gs` é só um upgrade OPCIONAL: serve caso ela queira que as adições feitas
**pelo formulário dela** (no navegador) sincronizem sozinhas entre aparelhos, sem pedir pra Claude. Pra isso:
1. Apps Script novo (script.google.com) -> cola `o-que-eu-acho-sync.gs`.
2. **Implantar -> Web app -> Executar como: Eu · Acesso: Qualquer pessoa** -> Implantar -> autoriza.
3. Cola a URL em `SYNC_URL` no `o-que-eu-acho.html`.
Sem isso, tudo funciona: a Claude adiciona verificações que aparecem em todos os aparelhos; o formulário salva no aparelho.
