# Próximos Passos — patriciasenapsi.com.br

> Última atualização: 2026-08-04
> Auditoria técnica completa em `docs/seo-audit-2026-08-04.md` — os defeitos de código
> encontrados lá já foram corrigidos. Este arquivo cobre o que depende de ação externa.

---

## Pendências que NÃO são código (precisam de você / da Patrícia)

### ~~DNS: `www` não resolve~~ ✅ Resolvido em 2026-08-04

Antes: `dig www.patriciasenapsi.com.br` não retornava nada — erro de DNS puro para quem
digitasse o endereço com `www`. O próprio painel da Cloudflare sinalizava
*"Visitors cannot reach www.patriciasenapsi.com.br"*.

Feito:
1. CNAME `www` → `patriciasenapsi.com.br`, **Proxied**, TTL Auto.
2. Redirect Rule `www to apex (301, preserves path and query)`.

O template "Redirect from WWW to root" da Cloudflare **não bastou**: ele casa por
`URI Full wildcard r"https://www.*"`, que ignora `http://`. Resultado era 522 em
`http://www` (o CNAME aponta para o apex, que é Pages, e `www` não é custom domain lá,
então a requisição chegava à origem e morria). Trocado por expressão agnóstica de esquema:

```
# match
http.host eq "www.patriciasenapsi.com.br"
# target (dynamic, 301, preserve query string marcado)
concat("https://patriciasenapsi.com.br", http.request.uri.path)
```

Verificado: `https://www/`, `http://www/`, `https://www/obrigado`,
`https://www/erro-envio?x=1` — todos **301 em 1 hop** para o apex, path e query
preservados. Apex e o 404 seguem intactos.

> A Redirect Rule roda na borda **antes** de contatar a origem, então o 522 nunca acontece.
> `www` não precisa ser custom domain no projeto Pages.

### ~~Worker do formulário: validar o honeypot~~ ✅ Resolvido em 2026-08-04
Feito e verificado em produção. Fonte agora versionado em `worker/` — ver
`worker/README.md`. Além do honeypot: allowlist de origem (o CORS era `*`), resposta
303 para o POST sem JS, e paramos de vazar `details`/`error` ao cliente.

**Ainda aberto no Worker:** sem rate limiting (é regra de WAF no painel) e sem limite
de tamanho nos campos.

### ~~Reenviar sitemap no Search Console~~ ✅ Feito em 2026-08-04

**Atenção para o futuro:** a propriedade do Search Console está na conta
**`renato.tadeu.figueiredo@gmail.com`**, não em `renato@eonf.ltd`. É uma propriedade de
domínio (`sc-domain:patriciasenapsi.com.br`), verificada por TXT no DNS. Na conta errada
o painel só responde *"Ops, você não tem acesso a esta propriedade"* — o que parece site
não cadastrado. Use `search.google.com/u/1/search-console`.

Feito:
- Sitemap reenviado. Antes: última leitura **25/mar/2026**, ou seja, anterior a todas as
  mudanças. Status Processado, 1 página encontrada.
- Inspeção de URL na home → **Solicitar indexação**. Entrou na fila de rastreamento
  prioritário. É isso que acelera o recrawl; o sitemap sozinho é passivo.

Estado observado: 1 página indexada, 3 cliques no período, HTTPS ok.

**A "1 página não indexada" é benigna:** o URL é `http://patriciasenapsi.com.br/` (sem TLS),
motivo *"Página com redirecionamento"*. O Google indexa o destino HTTPS e marca a origem do
301 como não-indexada. Comportamento correto, não mexer.

### ~~Crawlers de IA estavam bloqueados~~ ✅ Liberado em 2026-08-04

Descoberto ao perguntar "e o lado LLM?" — a auditoria original cobriu SEO clássico e passou
batido nisso. A Cloudflare bloqueava crawlers de IA por **default**, ninguém escolheu.

Eram dois mecanismos independentes, ambos no painel em **AI Crawl Control**:

1. **Security → "Block AI bots" scope** = `Block on all pages`. Um master switch que
   devolvia **403 na borda** e **sobrescrevia os 32 toggles individuais** — os toggles
   ficavam inertes, com tooltip *"This crawler is being blocked by the Block AI Bots
   security setting"*. Mudado para `Do not block (allow crawlers)`.
2. **Signals → "Managed robots.txt"** = ON. Injetava, **antes** do nosso robots.txt,
   um `Content-Signal: search=yes,ai-train=no,use=reference` mais `Disallow: /` para
   Amazonbot, Applebot-Extended, Bytespider, CCBot, ClaudeBot, Google-Extended, GPTBot e
   meta-externalagent. Desligado — o `robots.txt` voltou a ser só o nosso.

A página Signals registrava violações reais: GPTBot, ClaudeBot, Amazonbot e CCBot com
1 violação cada, ou seja, tentaram e levaram não.

Verificado depois: 15 crawlers testados (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot,
Claude-User, Claude-SearchBot, PerplexityBot, Perplexity-User, CCBot, meta-externalagent,
Amazonbot, Applebot, Bytespider, Google-CloudVertexBot, DuckAssistBot) — **todos 200 com
conteúdo**. Googlebot e Bingbot seguem 200. 0 de 32 bloqueados no painel.

**Isto é irreversível na prática:** conteúdo já coletado para treino não sai de modelo
treinado. Decisão consciente do Renato em 2026-08-04.

**Armadilha na medição:** testar com `curl -A "GPTBot"` do próprio IP mede *bot falsificado*,
não o bot real — a Cloudflare valida por IP/assinatura. Na primeira medição OAI-SearchBot e
PerplexityBot deram 403 e eu concluí errado que estavam bloqueados por política; os toggles
deles estavam desligados. Para saber o que está bloqueado **de fato**, olhe o painel, não o curl.

### llms.txt não existe (não feito, de propósito)
`/llms.txt` → 404. O Lighthouse checa, daí aparecer como falha. Nenhum provedor grande
confirmou usar o formato. Custo baixo, benefício especulativo — não priorizado.

### GA4 ainda comentado
O bloco no `<head>` continua comentado. A **Cloudflare Web Analytics já está ativa**
(o beacon `static.cloudflareinsights.com` carrega em produção), então há dados básicos.
Para eventos de conversão (clique no WhatsApp, envio do form) o GA4 é necessário.

### ~~Domínio de preview do Cloudflare Pages~~ ✅ Verificado em 2026-08-04
É `patricia-723.pages.dev`. Responde 200 e o `robots.txt` de lá diz `Allow: /`, mas o
`<link rel="canonical">` servido aponta para `https://patriciasenapsi.com.br/` — o Google
consolida no domínio real. Risco baixo, nada a fazer.

Um `noindex` de verdade só sairia com um Pages Function interceptando por hostname
(`_headers` não permite condição por host), o que não se paga.

---

## Prioridade Alta (maior impacto imediato)

### 1. Criar Google Business Profile
- **Impacto:** Máximo — sem isso a Patrícia é invisível no Google Maps e no "local pack"
- **Como:** Seguir o guia em `docs/google-business-profile-guide.md`
- **Tempo estimado:** ~1h15min

### ~~2. Criar og-image.jpg~~ ✅ Concluído em 2026-03-21
- Gerada com foto `patricia-sena-consultorio.jpeg` + gradiente da marca + textos
- Arquivo: `og-image.jpg` (1200x630px)

### ~~3. Gerar favicons PNG~~ ✅ Concluído em 2026-03-21
- Gerados via `rsvg-convert`: 16x16, 32x32, 180x180 (apple-touch), 192x192, 512x512 (android-chrome)
- `site.webmanifest` atualizado com ícones PNG

### ~~4. Criar Instagram profissional~~ ✅ Concluído em 2026-03-21
- Perfil: @patricia_sena_psicopedagoga
- Link adicionado na seção de contato, footer (com ícone SVG) e Schema.org `sameAs`
- **Pendente:** postar 1-2x por semana (dicas para pais, frases, bastidores)

### ~~5. Cadastrar no Google Search Console~~ ✅ Concluído em 2026-03-21
- Propriedade verificada, sitemap submetido e processado
- 1 página indexada, 8 cliques registrados
- Schema.org (LocalBusiness, FAQPage) reconhecido pelo Google

---

## Prioridade Média (crescimento orgânico)

### 6. Coletar depoimentos reais
- Pedir a 3-5 famílias um breve relato (2-3 frases)
- Formato: "Texto do depoimento" — Nome, relação (ex: "Mãe do L., 9 anos")
- Quando tiver, adicionar seção "O que dizem as famílias" no site
- Quando tiver reviews no Google: adicionar `aggregateRating` no Schema.org

### 7. Cadastrar em diretórios profissionais
- **Doctoralia** — https://www.doctoralia.com.br (cadastro gratuito)
- **BR Terapeutas** — https://www.brterapeutas.com.br (gratuito). Apareceu em 5 de 8 queries
  pesquisadas, tem páginas de categoria `/profissao/sp/sao-paulo/psicopedagogia` e
  `/tdah/sp/sao-paulo/psicopedagogia`. **Fazer logo depois do Doctoralia.**
- **tdah.org.br** (Assoc. Brasileira de Déficit de Atenção) — mantém cadastros públicos de
  profissionais; verificar se existe registro para psicopedagogo/neuroeducador
- **Instituto ABCD** — referência nacional em dislexia; vale buscar listagem ou parceria
  de conteúdo, é backlink com autoridade temática (não genérica)
- **ABPp** — Associação Brasileira de Psicopedagogia — **só se ela for realmente associada**
- **LinkedIn** — Perfil profissional com link para o site

**NAP exato a submeter em todos, sem variação:**
- Nome: `Patrícia Sena - Psicopedagoga`
- Telefone: `+55 11 94231-8641`
- Site: `https://patriciasenapsi.com.br`
- Endereço: **nenhum endereço de rua.** Em campo obrigatório de localização usar nível de
  bairro: `Itaquera, São Paulo`. Nunca inventar um endereço para preencher formulário —
  endereço inconsistente entre diretórios prejudica ativamente o ranqueamento local.

### ~~8. Converter imagens para WebP~~ ✅ Concluído em 2026-03-21
- 6 imagens convertidas para WebP (65% de redução total: 921KB → 322KB)
- HTML atualizado com `<picture>` tags + fallback JPEG/PNG
- Hero renomeado para `patricia-sena-atendimento-hero.png/webp`

### ~~9. Adicionar analytics~~ ✅ Concluído em 2026-03-21
- GA4 placeholder adicionado no `<head>` (comentado)
- Para ativar: criar conta GA4, obter Measurement ID (`G-XXXXXXXXXX`), descomentar o bloco no HTML

### 10. Coletar avaliações no Google
- Após criar o Google Business Profile
- Template para enviar aos pais (está no guia em `docs/google-business-profile-guide.md`)
- Meta: 5 avaliações nos primeiros 2 meses
- Sempre responder todas as avaliações (positivas e negativas)

---

## Evolução (longo prazo, alto retorno)

### 11. Criar um blog — lista revisada em 2026-08-04
> A lista original de 10 artigos foi auditada contra as buscas reais em pt-BR.
> 4 títulos eram inviáveis (dominados por `tdah.org.br`, blogs de grandes redes de escolas
> e sites de parenting com muito mais autoridade). Restaram 6 + 1 pilar novo.

**Dropado:** "Como criar uma rotina de estudos para crianças" — fora do nicho, genérico,
sem valor de conversão.

**Mesclado** ("TDAH na escola" + "Dificuldade de concentração", ambos inviáveis isolados):
- "TDAH ou desatenção? Como saber se seu filho precisa de psicopedagoga (não só de psiquiatra)"
  → alvo: `psicopedagoga ou psiquiatra tdah`. O ângulo de comparação não tem dono na SERP.

**Reangulado:** "Ansiedade escolar" → "Ansiedade escolar em crianças com dificuldade de
aprendizagem: por que aparecem juntas" → alvo: query composta, muito menos disputada que
"ansiedade escolar" puro.

**Mantidos, com títulos e queries definidos:**

| # | Título | Query alvo |
|---|---|---|
| 1 | 7 sinais de que seu filho precisa de uma avaliação psicopedagógica | `sinais que meu filho precisa de psicopedagogo` |
| 2 | O que é avaliação psicopedagógica e como funciona | `avaliação psicopedagógica como funciona` |
| 3 | Dislexia infantil em São Paulo: sinais para observar em casa | `sinais de dislexia infantil` |
| 4 | Diferença entre psicólogo, psicopedagogo e neuropediatra | `diferença entre psicólogo e psicopedagogo` |
| 5 | Meu filho não consegue se organizar: o que são funções executivas | `funções executivas dificuldade escolar` |
| 6 | Adaptações pedagógicas: o que a escola pode fazer | `adaptações pedagógicas para dificuldade de aprendizagem` |

No #2, incluir o processo e a transparência de valores — nenhum concorrente
(Doctoralia, clínicas) publica isso, e é diferencial real.

- Frequência: 1 artigo por mês
- Prova de que o formato funciona para profissional solo: Priscila Arduini (Ribeirão Preto)
  ranqueia em `psicopedagoga dislexia` com um único artigo dedicado
- **Fazer os pilares de serviço (item 13) ANTES do blog** — intenção comercial vem primeiro

### 12. Google Posts (publicações)
- Publicar semanalmente no Google Business Profile
- Tipos de post: dicas para pais, novidades, artigos do blog
- Sugestões prontas no guia `docs/google-business-profile-guide.md`

### 13. Páginas de serviço separadas — PRIORIDADE sobre o blog
Toda SERP comercial verificada é ganha por **página dedicada a uma query**, não por seção
de homepage (ex.: a própria Doctoralia tem `/avaliacao-psicopedagogica/sao-paulo`;
Clínica Alcance tem `/especialidade/psicopedagogia` para "dislexia e tdah" no Tatuapé).

A homepage tem 1.258 palavras tentando ranquear para uma dúzia de intenções — teto atingido.

Ordem de construção, uma query por página, todas linkadas do nav e do footer:

1. `/avaliacao-psicopedagogica` → `avaliação psicopedagógica zona leste são paulo` *(maior intenção comercial)*
2. `/neuroeducacao` → `neuroeducadora zona leste` *(cunha de diferenciação, termo menos disputado)*
3. `/psicopedagogia-tdah` → `psicopedagoga tdah zona leste sp`
4. `/psicopedagogia-dislexia` → `psicopedagoga dislexia são paulo`

Depois o blog em `/blog/`, cada post linkando para a página de serviço correspondente com
CTA de WhatsApp, e cada página de serviço linkando de volta para 1-2 posts.

**Bloqueio:** essas páginas precisam de conteúdo real da Patrícia (processo, valores,
duração das sessões, instrumentos usados). Não inventar — pedir para ela.

### ~~14. Self-hospedar fonte Inter~~ ✅ Concluído em 2026-03-21
- Inter variable font (woff2) baixada em `fonts/` (133KB total)
- `@font-face` com `font-display: swap` no CSS
- Google Fonts removido do HTML (zero dependência externa)

---

## Checklist rápido

- [ ] Google Business Profile
- [x] og-image.jpg (1200x630px) — 2026-03-21
- [x] Favicons PNG — 2026-03-21
- [x] Instagram profissional — 2026-03-21
- [x] Google Search Console + submeter sitemap — 2026-03-21 (conta `renato.tadeu.figueiredo@gmail.com`)
- [ ] 3-5 depoimentos reais
- [ ] Cadastro em diretórios (Doctoralia → BR Terapeutas → LinkedIn)
- [x] Converter imagens para WebP — 2026-03-21
- [x] Analytics GA4 (placeholder pronto) — 2026-03-21
- [ ] Avaliações no Google (meta: 5 em 2 meses)
- [ ] Blog — 1º artigo
- [ ] Google Posts — 1ª publicação
- [x] Self-host fonte Inter — 2026-03-21
- [x] Auditoria SEO completa + correções de código — 2026-08-04 (`docs/seo-audit-2026-08-04.md`)
- [x] DNS `www` + Redirect Rule 301 para o apex — 2026-08-04
- [x] Worker endurecido (honeypot, allowlist de origem, 303 sem JS, sem vazamentos) — 2026-08-04
- [x] Preview `*.pages.dev` verificado (canonical resolve) — 2026-08-04
- [x] Crawlers de IA liberados (master switch + managed robots.txt) — 2026-08-04
- [ ] llms.txt — decidido não fazer (benefício especulativo)
- [ ] Páginas de serviço (item 13) — bloqueado, precisa de conteúdo da Patrícia
- [x] Reenviar sitemap + solicitar indexação no Search Console — 2026-08-04
- [ ] Rate limiting no formulário (regra de WAF no painel)
- [ ] Teste ponta a ponta do Resend (envia e-mail real para a Patrícia)
