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

    // Using the default testing domain provided by Resend (onboarding@resend.dev)
    // For production, the user needs to configure a domain in Resend dashboard
    // and update this "from" address.
    const fromEmail = 'onboarding@resend.dev'; 

    let subject = '';
    let htmlContent = '';

    if (role === 'STAFF') {
        subject = 'Convite para PartnerHUB - Engenharia';
        htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
          <p>Olá ${name},</p>
          <p>O PartnerHUB, operado pela PHOENYX TECNOLOGIA, é uma plataforma já utilizada para estruturar e qualificar oportunidades de negócio no mercado digital.</p>
          <p>A engenharia tem papel central nesse modelo.</p>
          <p>Buscamos Engenheiros de Software para atuar na <strong>validação técnica, desenho arquitetural e mitigação de riscos</strong>, garantindo que apenas oportunidades tecnicamente sólidas avancem para execução.</p>
          <p>Atuação técnica:</p>
          <ul>
            <li>Análise de viabilidade técnica e de escopo</li>
            <li>Avaliação de riscos, dependências e complexidade</li>
            <li>Redesenho de soluções com foco em arquitetura sustentável</li>
            <li>Interface direta com times de desenvolvimento e operação</li>
          </ul>
          <p>No PartnerHUB, engenharia não reage a promessas: <strong>define limites, cria soluções e protege a reputação técnica da operação</strong>.</p>
          <p>Se você valoriza critério, clareza técnica e impacto real no negócio, vamos conversar.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${registrationUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Concluir Cadastro
            </a>
          </div>
          
          <p>Abraço,</p>
          <p>Eduardo Pessoa<br/>PHOENYX TECNOLOGIA | PartnerHUB</p>
        </div>
        `;
    } else {
        subject = 'Convite para PartnerHUB - Executivo Comercial';
        htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
          <p>Olá ${name},</p>
          <p>A <strong>PHOENYX TECNOLOGIA</strong> opera o <strong>PartnerHUB</strong>, um aplicativo criado para Executivos Comerciais que desejam <strong>ampliar sua atuação no mercado digital</strong>, conectando oportunidades de negócio a um ecossistema técnico estruturado.</p>
          <p>No PartnerHUB, o executivo atua onde é forte: <strong>relacionamento, visão de mercado e identificação de oportunidades</strong> — independentemente do segmento de origem.</p>
          <p>O funcionamento é objetivo:</p>
          <ul>
            <li>O executivo registra oportunidades de negócio no PartnerHUB</li>
            <li>As oportunidades passam por <strong>análise e validação técnica especializada</strong></li>
            <li>Projetos aprovados são estruturados, desenvolvidos e mantidos pela PHOENYX</li>
            <li>O executivo é remunerado por meio de <strong>comissões atrativas</strong>, com acompanhamento claro do pipeline</li>
          </ul>
          <p>Aqui, o parceiro comercial navega pelo mercado digital com <strong>segurança, suporte técnico e governança</strong>.</p>
          <p>Se você já atua de forma consultiva, possui rede ativa e busca ampliar seu alcance no digital sem assumir riscos técnicos, o PartnerHUB é um caminho natural.</p>
          <p>Fico à disposição para uma conversa objetiva.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${registrationUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Concluir Cadastro
            </a>
          </div>

          <p>Abraço,</p>
          <p><strong>Eduardo Pessoa</strong><br/>PHOENYX TECNOLOGIA | PartnerHUB</p>
        </div>
        `;
    }

    const { data, error } = await resend.emails.send({
      from: `PartnerHub <${fromEmail}>`,
      to: [email],
      subject: subject,
      html: htmlContent,
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
