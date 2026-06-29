# O que eu acho — fact-check pessoal da Pri

Site privado (senha `pri123`) onde a Pri escreve o que ela acha e a verificação mostra se bate com os fatos.
**NÃO** é a série pública *Verificamos / Fact-Checked* nem o livro/RECEIPTS — é uma ferramenta pessoal dela.

- App: `o-que-eu-acho.html` -> https://priihigashi.github.io/ClaudeGallery/o-que-eu-acho.html
- Backend: `o-que-eu-acho/o-que-eu-acho-sync.gs` (Apps Script que cria e gerencia a PRÓPRIA planilha)

## Template (estrutura fixa — não mudar)
1. **Nota** no topo: Certo / Parcialmente certo / Errado + % de suporte
2. **A afirmação** — o que ela acha
3. **O pensamento** — por quê ela acha
4. **Verificação** — 3 caixas (fonte/tipo + dado); caixa vazia = "não encontrado"
5. **Conclusão** — por que está errado / o complemento / os dois

Cada card tem botão **"Copiar texto"** (formatado pra redes sociais).

## Deploy do backend (1 vez, ~5 min — igual study-sync)
1. Apps Script novo (script.google.com) -> cola `o-que-eu-acho-sync.gs`.
2. **Implantar -> Nova implantação -> Web app -> Executar como: Eu · Acesso: Qualquer pessoa** -> Implantar -> autoriza.
3. Copia a **URL do Web app** e cola em `SYNC_URL` no topo de `o-que-eu-acho.html` (commit).
   - Na 1ª chamada o script cria sozinho a planilha "O que eu acho — Fact-checks (DB)" no seu Drive.

Até o `SYNC_URL` ser configurado, o site já funciona **só neste aparelho** (localStorage). Pra abrir de qualquer
computador + deixar a Claude adicionar, precisa do deploy acima.
