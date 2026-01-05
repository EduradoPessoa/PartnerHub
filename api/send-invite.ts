import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
// Note: In Vercel, this variable must be set in the Project Settings.
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { name, email, role, registrationUrl } = await request.json();

    if (!name || !email || !role || !registrationUrl) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const roleLabel = role === 'EXECUTIVE' ? 'Executivo Comercial' : 'Staff (Engenharia/Operações)';
    
    // Using the default testing domain provided by Resend (onboarding@resend.dev)
    // For production, the user needs to configure a domain in Resend dashboard
    // and update this "from" address.
    const fromEmail = 'onboarding@resend.dev'; 

    const { data, error } = await resend.emails.send({
      from: `PartnerHub <${fromEmail}>`,
      to: [email],
      subject: `Convite para Phoenyx Partner Hub - ${roleLabel}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Olá ${name},</h2>
          <p>Você foi convidado(a) para acessar o <strong>PartnerHub</strong> como <strong>${roleLabel}</strong>.</p>
          <p>Por favor, conclua seu cadastro clicando no botão abaixo:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${registrationUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Concluir Cadastro
            </a>
          </div>
          <p>Ou acesse pelo link direto:</p>
          <p><a href="${registrationUrl}">${registrationUrl}</a></p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">Se você não esperava este convite, por favor ignore este e-mail.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, id: data?.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Config for Vercel Edge/Serverless function if needed, but standard export default works.
