export type InviteRole = 'EXECUTIVE' | 'STAFF';

export const buildInviteEmail = (params: {
  name: string;
  role: InviteRole;
  registrationLink: string;
}) => {
  const { name, role, registrationLink } = params;
  
  let subject = '';
  let body = '';

  if (role === 'STAFF') {
    subject = 'Convite para PartnerHUB - Engenharia';
    body = `Olá ${name},

O PartnerHUB, operado pela PHOENYX TECNOLOGIA, é uma plataforma já utilizada para estruturar e qualificar oportunidades de negócio no mercado digital.

A engenharia tem papel central nesse modelo.

Buscamos Engenheiros de Software para atuar na validação técnica, desenho arquitetural e mitigação de riscos, garantindo que apenas oportunidades tecnicamente sólidas avancem para execução.

Atuação técnica:
- Análise de viabilidade técnica e de escopo
- Avaliação de riscos, dependências e complexidade
- Redesenho de soluções com foco em arquitetura sustentável
- Interface direta com times de desenvolvimento e operação

No PartnerHUB, engenharia não reage a promessas: define limites, cria soluções e protege a reputação técnica da operação.

Se você valoriza critério, clareza técnica e impacto real no negócio, vamos conversar.

Acesse o link para se cadastrar:
${registrationLink}

Abraço,

Eduardo Pessoa
PHOENYX TECNOLOGIA | PartnerHUB`;

  } else {
    subject = 'Convite para PartnerHUB - Executivo Comercial';
    body = `Olá ${name},

A **PHOENYX TECNOLOGIA** opera o **PartnerHUB**, um aplicativo criado para Executivos Comerciais que desejam **ampliar sua atuação no mercado digital**, conectando oportunidades de negócio a um ecossistema técnico estruturado.

No PartnerHUB, o executivo atua onde é forte: **relacionamento, visão de mercado e identificação de oportunidades** — independentemente do segmento de origem.

O funcionamento é objetivo:

* O executivo registra oportunidades de negócio no PartnerHUB
* As oportunidades passam por **análise e validação técnica especializada**
* Projetos aprovados são estruturados, desenvolvidos e mantidos pela PHOENYX
* O executivo é remunerado por meio de **comissões atrativas**, com acompanhamento claro do pipeline

Aqui, o parceiro comercial navega pelo mercado digital com **segurança, suporte técnico e governança**.

Se você já atua de forma consultiva, possui rede ativa e busca ampliar seu alcance no digital sem assumir riscos técnicos, o PartnerHUB é um caminho natural.

Fico à disposição para uma conversa objetiva.

Acesse o link para se cadastrar:
${registrationLink}

Abraço,

**Eduardo Pessoa**
PHOENYX TECNOLOGIA | PartnerHUB`;
  }

  return { subject, body };
};

export const mailtoHref = (email: string, subject: string, body: string) => {
  const encSubject = encodeURIComponent(subject);
  const encBody = encodeURIComponent(body);
  return `mailto:${email}?subject=${encSubject}&body=${encBody}`;
};
