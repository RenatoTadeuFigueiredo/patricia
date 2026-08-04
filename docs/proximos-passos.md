# Próximos Passos — patriciasenapsi.com.br

> Última atualização: 2026-08-04
> Auditoria técnica completa em `docs/seo-audit-2026-08-04.md` — os defeitos de código
> encontrados lá já foram corrigidos. Este arquivo cobre o que depende de ação externa.

---

## Pendências que NÃO são código (precisam de você / da Patrícia)

### DNS: `www` não resolve
`dig www.patriciasenapsi.com.br` não retorna nada. Quem digita o endereço com `www`
(padrão comum, e o que muita gente escreve em cartão de visita) recebe erro de DNS.
Adicionar CNAME `www` na zona Cloudflare + redirect 301 para o apex.

### Worker do formulário: validar o honeypot
O formulário agora envia um campo oculto `website`. O Worker
(`formulario.renato-tadeu-figueiredo.workers.dev`) precisa **rejeitar** qualquer submit
em que `website` não esteja vazio — é bot. O bloqueio no cliente já existe, mas o
endpoint é público e pode ser chamado direto.

### GA4 ainda comentado
O bloco no `<head>` continua comentado. A **Cloudflare Web Analytics já está ativa**
(o beacon `static.cloudflareinsights.com` carrega em produção), então há dados básicos.
Para eventos de conversão (clique no WhatsApp, envio do form) o GA4 é necessário.

### Domínio de preview do Cloudflare Pages
Conferir se o `*.pages.dev` do projeto está indexável. Se estiver, bloquear via
robots.txt no preview ou desabilitar acesso público às branch previews.

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
- [x] Google Search Console + submeter sitemap — 2026-03-21
- [ ] 3-5 depoimentos reais
- [ ] Cadastro em diretórios (Doctoralia → BR Terapeutas → LinkedIn)
- [x] Converter imagens para WebP — 2026-03-21
- [x] Analytics GA4 (placeholder pronto) — 2026-03-21
- [ ] Avaliações no Google (meta: 5 em 2 meses)
- [ ] Blog — 1º artigo
- [ ] Google Posts — 1ª publicação
- [x] Self-host fonte Inter — 2026-03-21
- [x] Auditoria SEO completa + correções de código — 2026-08-04 (`docs/seo-audit-2026-08-04.md`)
- [ ] **DNS: adicionar `www` + 301 para o apex** (fora do repo)
- [ ] **Worker: rejeitar submits com o honeypot `website` preenchido** (fora do repo)
- [ ] Páginas de serviço (item 13) — bloqueado, precisa de conteúdo da Patrícia
- [ ] Reenviar sitemap no Search Console após este deploy
