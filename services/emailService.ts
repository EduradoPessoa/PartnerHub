export type InviteRole = 'EXECUTIVE' | 'STAFF';

export const buildInviteEmail = (params: {
  name: string;
  role: InviteRole;
  registrationLink: string;
}) => {
  const { name, role, registrationLink } = params;
  const subject =
    role === 'EXECUTIVE'
      ? 'Convite para Registro - Executivo Comercial'
      : 'Convite para Registro - Staff';

  const roleLabel =
    role === 'EXECUTIVE' ? 'Executivo Comercial' : 'Staff (Engenharia/Operações)';

  const body =
    `Olá ${name},\n\n` +
    `Você foi convidado(a) para acessar o PartnerHub como ${roleLabel}.\n` +
    `Por favor, conclua seu cadastro através do link abaixo:\n\n` +
    `${registrationLink}\n\n` +
    `Após o registro, você terá acesso às funcionalidades correspondentes ao seu perfil.\n\n` +
    `Atenciosamente,\n` +
    `Equipe PartnerHub`;

  return { subject, body };
};

export const mailtoHref = (email: string, subject: string, body: string) => {
  const encSubject = encodeURIComponent(subject);
  const encBody = encodeURIComponent(body);
  return `mailto:${email}?subject=${encSubject}&body=${encBody}`;
};
