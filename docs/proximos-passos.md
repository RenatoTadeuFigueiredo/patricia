# Próximos Passos — patriciasenapsi.com.br

> Última atualização: 2026-03-21

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
- **ABPp** — Associação Brasileira de Psicopedagogia (se for associada)
- **LinkedIn** — Perfil profissional com link para o site
- Manter NAP (Nome, Endereço, Telefone) idêntico em todos

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

### 11. Criar um blog
- Cada artigo é uma nova porta de entrada no Google
- **Artigos prioritários (por volume de busca):**
  1. "Sinais de que seu filho pode precisar de psicopedagoga"
  2. "O que é avaliação psicopedagógica e como funciona"
  3. "TDAH na escola: como ajudar seu filho"
  4. "Dislexia infantil: sinais, diagnóstico e o que fazer"
  5. "Dificuldade de concentração na escola: causas e soluções"
  6. "Diferença entre psicólogo, psicopedagogo e neuropediatra"
  7. "Como criar uma rotina de estudos para crianças"
  8. "Funções executivas: o que são e por que importam"
  9. "Ansiedade escolar: como identificar e lidar"
  10. "Adaptações pedagógicas: o que a escola pode fazer"
- Frequência ideal: 1 artigo por mês
- Pode ser feito como páginas HTML simples ou migrar para um CMS (Hugo, Eleventy)

### 12. Google Posts (publicações)
- Publicar semanalmente no Google Business Profile
- Tipos de post: dicas para pais, novidades, artigos do blog
- Sugestões prontas no guia `docs/google-business-profile-guide.md`

### 13. Páginas de serviço separadas
- Quando o site crescer, criar páginas individuais:
  - `/psicopedagogia-clinica`
  - `/psicopedagogia-institucional`
  - `/neuroeducacao`
  - `/avaliacao-psicopedagogica`
- Cada página ranqueia para suas próprias keywords

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
- [ ] Cadastro em diretórios (Doctoralia, LinkedIn)
- [x] Converter imagens para WebP — 2026-03-21
- [x] Analytics GA4 (placeholder pronto) — 2026-03-21
- [ ] Avaliações no Google (meta: 5 em 2 meses)
- [ ] Blog — 1º artigo
- [ ] Google Posts — 1ª publicação
- [x] Self-host fonte Inter — 2026-03-21
