# Worker do formulário de contato

Recebe o POST do formulário de `patriciasenapsi.com.br`, valida e envia o e-mail
via [Resend](https://resend.com) para `patriciasenaeducar@gmail.com`.

**Endpoint:** `https://formulario.renato-tadeu-figueiredo.workers.dev`

Até 2026-08-04 este código existia apenas no Cloudflare (upload manual pelo
painel, sem repositório). Foi trazido para cá para não se perder — o painel
guarda versões, mas não é lugar de fonte.

## Deploy

```sh
cd worker
wrangler deploy
```

O secret `RESEND_API_KEY` fica no Cloudflare e sobrevive aos deploys. Se algum
dia precisar redefinir:

```sh
wrangler secret put RESEND_API_KEY --name formulario
```

## Como o formulário conversa com o Worker

O campo `js` decide o formato da resposta:

| `js` | Origem | Resposta |
|---|---|---|
| `1` | `fetch()` do site | JSON, tratado pelo handler inline em `index.html` |
| ausente | POST nativo (JS falhou/desligado) | `303` para `/obrigado` ou `/erro-envio` |

Sem isso, o caminho sem JS navegaria o usuário até um JSON cru na tela.

## Proteções

1. **Allowlist de origem** — só as origens em `ALLOWED_ORIGINS` passam; o resto
   leva `403`. Corta abuso via navegador e script casual. **`Origin` é
   falsificável por curl**, então isso não para um atacante determinado.
2. **Honeypot** — campo `website`, escondido fora da tela com `tabindex="-1"`.
   Se vier preenchido, o Worker responde como sucesso (para não revelar a
   armadilha) e descarta o envio sem chamar o Resend.
3. **Sem vazamento** — detalhes de erro do Resend e exceções ficam só no
   `console`, nunca na resposta ao cliente.

**Não implementado:** rate limiting. É o único controle real de volume, e o
lugar dele é uma regra de WAF no painel do Cloudflare, não neste código.
Também não há limite de tamanho nos campos — nada impede um e-mail gigante.
