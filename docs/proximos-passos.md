# Próximos Passos — patriciasenapsi.com.br

> Última atualização: 2026-03-20

---

## Prioridade Alta (maior impacto imediato)

### 1. Criar Google Business Profile
- **Impacto:** Máximo — sem isso a Patrícia é invisível no Google Maps e no "local pack"
- **Como:** Seguir o guia em `docs/google-business-profile-guide.md`
- **Tempo estimado:** ~1h15min

### 2. Criar og-image.jpg
- **Impacto:** Todo compartilhamento no WhatsApp/Facebook/LinkedIn fica sem imagem
- **Como:** Criar uma imagem 1200x630px com:
  - Uma foto da Patrícia (ex: `patricia-sena-consultorio.jpeg`)
  - Nome: "Patrícia Sena"
  - Texto: "Psicopedagoga em São Paulo"
  - Subtexto: "Neuroeducação para Crianças e Adolescentes"
  - Cores da marca (roxo `#7a58be`, fundo claro)
- **Ferramentas:** Canva, Figma ou Photoshop
- **Salvar em:** raiz do projeto como `og-image.jpg`

### 3. Gerar favicons PNG
- **Impacto:** Navegadores sem suporte a SVG mostram ícone genérico
- **Como:**
  1. Acessar https://realfavicongenerator.net
  2. Fazer upload do `favicon.svg`
  3. Baixar o pacote gerado
  4. Colocar na raiz: `favicon-32x32.png`, `favicon-16x16.png`, `apple-touch-icon.png`
- **Tempo estimado:** 5min

### 4. Criar Instagram profissional
- **Impacto:** Canal #1 de verificação de confiança no Brasil para serviços de saúde/educação
- **Como:**
  1. Criar conta profissional no Instagram
  2. Usar as fotos profissionais do site
  3. Bio: "Psicopedagoga e Neuroeducadora | Crianças e Adolescentes | São Paulo"
  4. Link para o site
- **Depois de criar:**
  - Adicionar link no footer e seção de contato do site
  - Adicionar URL no `sameAs` do Schema.org JSON-LD
  - Postar 1-2x por semana (dicas para pais, frases, bastidores)

### 5. Cadastrar no Google Search Console
- **Impacto:** Permite acompanhar indexação, erros e quais buscas levam ao site
- **Como:**
  1. Acessar https://search.google.com/search-console
  2. Adicionar propriedade: `https://patriciasenapsi.com.br`
  3. Verificar via DNS no Cloudflare (adicionar registro TXT)
  4. Submeter o sitemap: `https://patriciasenapsi.com.br/sitemap.xml`
- **Tempo estimado:** 15min

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

### 8. Converter imagens para WebP
- Reduz ~30-50% do tamanho dos arquivos
- Usar https://squoosh.app para converter
- Manter JPEG como fallback com `<picture>` tag
- Renomear `patricia-sena-atendimento-removebg-preview.png` para algo mais limpo

### 9. Adicionar analytics
- **Opção simples (privacidade):** Plausible Analytics — https://plausible.io
- **Opção completa (gratuita):** Google Analytics 4
- Adicionar o script no `<head>` do `index.html`
- Acompanhar: visitas, origem do tráfego, páginas mais vistas

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

### 14. Self-hospedar fonte Inter
- Baixar de https://rsms.me/inter/
- Adicionar os arquivos `.woff2` ao projeto
- Usar `@font-face` no CSS
- Remover dependência do Google Fonts
- Melhora velocidade e privacidade

---

## Checklist rápido

- [ ] Google Business Profile
- [ ] og-image.jpg (1200x630px)
- [ ] Favicons PNG (realfavicongenerator.net)
- [ ] Instagram profissional
- [ ] Google Search Console + submeter sitemap
- [ ] 3-5 depoimentos reais
- [ ] Cadastro em diretórios (Doctoralia, LinkedIn)
- [ ] Converter imagens para WebP
- [ ] Analytics (Plausible ou GA4)
- [ ] Avaliações no Google (meta: 5 em 2 meses)
- [ ] Blog — 1º artigo
- [ ] Google Posts — 1ª publicação
