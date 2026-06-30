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
