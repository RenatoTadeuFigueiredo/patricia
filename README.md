# Patricia — Institutional Website

A responsive, performance-optimized institutional website for a solo practitioner, built on a
deliberately lightweight HTML/CSS stack and held to the same engineering standards as an
application: measured Core Web Vitals, WCAG AA contrast, a validated structured-data graph,
and edge configuration under version control.

🔗 **Live:** <https://patriciasenapsi.com.br/>

---

## Overview

Single-page institutional site with a serverless contact form. No framework, no build step,
no runtime dependencies — the entire front end is one HTML file, one stylesheet, two self-hosted
font subsets and a handful of images. Everything else is edge configuration.

The interesting part is not the stack, it is the verification: every change in this repository
was measured before and after against the live site, and the measurements are recorded in
[`docs/seo-audit-2026-08-04.md`](docs/seo-audit-2026-08-04.md).

## Measured results

Live site, mobile emulation, Slow 4G, 4× CPU throttle:

| | Before | After |
|---|---|---|
| Lighthouse SEO | 92 | **100** |
| Lighthouse Accessibility | 91 | **100** |
| Lighthouse Best Practices | 100 | **100** |
| Failed Lighthouse audits | 4 | **0** |
| CLS | 0.00 | **0.00** |
| Hero image payload | 233 KB | **15 KB** |
| Unknown URLs | `200` + homepage copy | **`404`** |

## Features

- **Responsive, mobile-first** — single breakpoint system, no layout shift (CLS 0.00)
- **Performance** — WebP with `srcset`/`sizes`, self-hosted Inter subset with `font-display: swap`,
  `rel=preload` on the LCP-critical resources, one-year immutable cache headers on static assets
- **Accessibility** — WCAG AA contrast throughout, skip link, `prefers-reduced-motion`,
  ARIA live region on form status, accessible names that match visible labels (WCAG 2.5.3)
- **Structured data** — a JSON-LD `@graph` of nine linked nodes (`LocalBusiness`,
  `ProfessionalService`, `Person`, `Book`, three `Service`, `WebSite`, `WebPage`, `FAQPage`),
  every claim mirrored by visible on-page content
- **Progressive enhancement** — the contact form POSTs natively and the navigation stays
  reachable with JavaScript disabled
- **Serverless contact form** — Cloudflare Worker with an origin allowlist and a honeypot,
  delivering via Resend
- **Real 404** — a `404.html` so unmatched paths return a genuine `404` instead of a
  duplicate of the homepage

## Tech Stack

- **HTML5 / CSS3** — semantic markup, no framework, no build step
- **Cloudflare Pages** — hosting, with `_headers` for cache policy
- **Cloudflare Workers** — contact-form endpoint (`worker/`)
- **Resend** — transactional email

## Project Structure

```
.
├── index.html              # The site (single page)
├── 404.html                # Real 404 — Pages serves this with a 404 status
├── obrigado.html           # Form success landing (no-JS path), noindex
├── erro-envio.html         # Form failure landing (no-JS path), noindex
├── style.css               # Styles
├── _headers                # Cloudflare Pages cache policy
├── robots.txt              # Crawler directives
├── sitemap.xml             # Sitemap
├── site.webmanifest        # PWA manifest
├── og-image.jpg            # Social sharing image
├── favicon.svg             # Vector favicon
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png    # 180x180
├── android-chrome-192x192.png
├── android-chrome-512x512.png
├── fonts/                  # Self-hosted Inter subsets (woff2)
├── fotos/                  # WebP + fallbacks, multiple widths
├── worker/                 # Contact-form Cloudflare Worker
│   ├── formulario.js
│   ├── wrangler.toml
│   └── README.md
└── docs/
    ├── seo-audit-2026-08-04.md      # Full audit, measurements, what was missed
    ├── proximos-passos.md           # Roadmap and open items
    └── google-business-profile-guide.md
```

## Worth reading

- [`docs/seo-audit-2026-08-04.md`](docs/seo-audit-2026-08-04.md) — the audit, including the
  dimension it failed to cover and why that mattered
- [`worker/README.md`](worker/README.md) — how the form talks to the Worker, and which
  protections are and are not implemented
