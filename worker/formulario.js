// ============================================
// CONFIGURAÇÕES DE E-MAIL
// ============================================
const EMAIL_CONFIG = {
  to: 'patriciasenaeducar@gmail.com', // E-mail que vai receber as mensagens
  from: 'contato@patriciasenapsi.com.br', // Use um e-mail do seu domínio verificado
  fromName: 'Formulário do Site', // Nome que aparece como remetente
};

// ============================================
// ORIGENS AUTORIZADAS
// ============================================
// Só o site da Patrícia pode postar aqui. Requisições sem Origin ou de outra
// origem são rejeitadas: o único cliente legítimo é o formulário do site, e o
// navegador sempre envia Origin em POST cross-origin.
//
// NOTA: Origin é falsificável por curl. Isso corta abuso via navegador e
// scripts casuais, não um atacante determinado. Controle de volume de verdade
// = regra de rate limiting no WAF do Cloudflare (painel).
const ALLOWED_ORIGINS = [
  'https://patriciasenapsi.com.br',
  'https://www.patriciasenapsi.com.br',
  'https://patricia-723.pages.dev',
];

// Páginas de retorno para o envio sem JavaScript (POST nativo do formulário).
// Sem .html: o Cloudflare Pages serve a URL limpa e faz 308 do .html para ela.
const REDIRECT_SUCCESS = 'https://patriciasenapsi.com.br/obrigado';
const REDIRECT_ERROR = 'https://patriciasenapsi.com.br/erro-envio';

// ============================================
// HELPERS
// ============================================
function corsHeaders(origin) {
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
  if (ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

// Responde JSON para o fetch() e redireciona (303) para o POST nativo sem JS.
function respond({ ok, message, wantsJson, origin, status }) {
  if (!wantsJson) {
    return new Response(null, {
      status: 303,
      headers: {
        Location: ok ? REDIRECT_SUCCESS : REDIRECT_ERROR,
        ...corsHeaders(origin),
      },
    });
  }

  return new Response(JSON.stringify({ success: ok, message }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
    },
  });
}

// ============================================
// WORKER PRINCIPAL
// ============================================
export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';

    // Lidar com requisições OPTIONS (CORS preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders(origin),
        status: 204,
      });
    }

    // Apenas aceitar POST
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Método não permitido. Use POST.',
        }),
        {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin),
          },
        }
      );
    }

    // ============================================
    // BLOQUEIO DE ORIGEM
    // ============================================
    if (!ALLOWED_ORIGINS.includes(origin)) {
      console.warn('Origem rejeitada:', origin || '(ausente)');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Origem não autorizada.',
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin),
          },
        }
      );
    }

    let wantsJson = true;

    try {
      // ============================================
      // PEGAR DADOS DO FORMULÁRIO
      // ============================================
      const formData = await request.formData();
      const nome = formData.get('nome');
      const email = formData.get('email');
      const faixaEtaria = formData.get('faixa-etaria');
      const mensagem = formData.get('mensagem');
      const honeypot = formData.get('website');

      // O JS do site marca js=1 antes de enviar via fetch. Sem JS o campo vem
      // vazio e a resposta precisa ser uma navegação, não JSON.
      wantsJson = formData.get('js') === '1';

      // ============================================
      // HONEYPOT
      // ============================================
      // Campo escondido fora da tela. Humano nunca preenche; bot que varre
      // inputs preenche. Responde como sucesso para não revelar a armadilha,
      // mas não envia e-mail nenhum.
      if (typeof honeypot === 'string' && honeypot.trim() !== '') {
        console.warn('Honeypot acionado, submit descartado. Origin:', origin);
        return respond({
          ok: true,
          message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
          wantsJson,
          origin,
          status: 200,
        });
      }

      // ============================================
      // VALIDAÇÃO DOS CAMPOS OBRIGATÓRIOS
      // ============================================
      if (!nome || !email || !mensagem) {
        return respond({
          ok: false,
          message: 'Por favor, preencha todos os campos obrigatórios.',
          wantsJson,
          origin,
          status: 400,
        });
      }

      // Validação básica de e-mail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return respond({
          ok: false,
          message: 'Por favor, insira um e-mail válido.',
          wantsJson,
          origin,
          status: 400,
        });
      }

      // ============================================
      // MONTAR CORPO DO E-MAIL (TEXTO SIMPLES)
      // ============================================
      const emailBodyText = `
Nova mensagem do formulário de contato

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DADOS DO CONTATO:

Nome: ${nome}
E-mail: ${email}
Faixa etária: ${faixaEtaria || 'Não informado'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MENSAGEM:

${mensagem}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Enviado em: ${new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        dateStyle: 'full',
        timeStyle: 'short',
      })}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para responder, basta clicar em "Responder" ou enviar e-mail para: ${email}
      `.trim();

      // ============================================
      // MONTAR CORPO DO E-MAIL (HTML)
      // ============================================
      const emailBodyHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nova mensagem do formulário</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                Nova Mensagem do Site
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                Formulário de Contato
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">

              <h2 style="margin: 0 0 24px; color: #111827; font-size: 18px; font-weight: 600;">
                Dados do Contato
              </h2>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="padding: 12px 16px; background-color: #f9fafb; border-left: 3px solid #2563eb;">
                    <p style="margin: 0 0 4px; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                      Nome
                    </p>
                    <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 500;">
                      ${nome}
                    </p>
                  </td>
                </tr>
                <tr><td style="height: 12px;"></td></tr>
                <tr>
                  <td style="padding: 12px 16px; background-color: #f9fafb; border-left: 3px solid #2563eb;">
                    <p style="margin: 0 0 4px; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                      E-mail
                    </p>
                    <p style="margin: 0;">
                      <a href="mailto:${email}" style="color: #2563eb; font-size: 16px; font-weight: 500; text-decoration: none;">
                        ${email}
                      </a>
                    </p>
                  </td>
                </tr>
                <tr><td style="height: 12px;"></td></tr>
                <tr>
                  <td style="padding: 12px 16px; background-color: #f9fafb; border-left: 3px solid #2563eb;">
                    <p style="margin: 0 0 4px; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                      Faixa Etária
                    </p>
                    <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 500;">
                      ${faixaEtaria || 'Não informado'}
                    </p>
                  </td>
                </tr>
              </table>

              <h2 style="margin: 0 0 16px; color: #111827; font-size: 18px; font-weight: 600;">
                Mensagem
              </h2>

              <div style="padding: 20px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">
${mensagem}
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px;">
                <strong>Enviado em:</strong> ${new Date().toLocaleString('pt-BR', {
                  timeZone: 'America/Sao_Paulo',
                  dateStyle: 'full',
                  timeStyle: 'short',
                })}
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Esta mensagem foi enviada através do formulário de contato do site.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim();

      // ============================================
      // VERIFICAR SE A API KEY ESTÁ CONFIGURADA
      // ============================================
      if (!env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY não está configurada');
        return respond({
          ok: false,
          message: 'Configuração de e-mail incompleta. Entre em contato pelo e-mail diretamente.',
          wantsJson,
          origin,
          status: 500,
        });
      }

      // ============================================
      // ENVIAR E-MAIL VIA RESEND
      // ============================================
      const resendPayload = {
        from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
        to: [EMAIL_CONFIG.to],
        reply_to: email, // Permite responder direto para quem enviou
        subject: `Nova mensagem de ${nome}`,
        text: emailBodyText,
        html: emailBodyHtml,
      };

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        },
        body: JSON.stringify(resendPayload),
      });

      const resendData = await resendResponse.json();

      // Log para debug (aparece no painel de logs do Worker)
      console.log('Resend status:', resendResponse.status);
      console.log('Resend response:', JSON.stringify(resendData));

      // ============================================
      // VERIFICAR SE O ENVIO FOI BEM-SUCEDIDO
      // ============================================
      if (!resendResponse.ok) {
        // Detalhe do erro fica só no log; devolver resendData ao cliente
        // expunha a resposta interna da API.
        console.error('Erro no Resend:', JSON.stringify(resendData));

        // Mensagem de erro amigável baseada no tipo de erro
        let errorMessage = 'Erro ao enviar mensagem. Tente novamente em alguns instantes.';

        if (resendData.statusCode === 403 || resendData.name === 'validation_error') {
          errorMessage = 'Configuração de e-mail pendente. Por favor, entre em contato diretamente pelo e-mail.';
        }

        return respond({
          ok: false,
          message: errorMessage,
          wantsJson,
          origin,
          status: 500,
        });
      }

      // ============================================
      // SUCESSO!
      // ============================================
      return respond({
        ok: true,
        message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
        wantsJson,
        origin,
        status: 200,
      });

    } catch (error) {
      // ============================================
      // ERRO GERAL (CATCH)
      // ============================================
      // String(error) ficava exposto na resposta; agora só no log.
      console.error('Erro geral no Worker:', error);

      return respond({
        ok: false,
        message: 'Erro interno ao processar sua mensagem. Tente novamente ou entre em contato por e-mail.',
        wantsJson,
        origin,
        status: 500,
      });
    }
  },
};
