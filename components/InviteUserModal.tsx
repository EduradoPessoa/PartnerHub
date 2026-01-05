import React, { useState } from 'react';
import { X, Mail } from 'lucide-react';
import { UserRole } from '../types';
import { buildInviteEmail, mailtoHref } from '../services/emailService';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.EXECUTIVE);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendEmail = async () => {
    if (!name || !email) return;

    setIsSending(true);
    setSendError(null);

    const baseUrl = window.location.origin + window.location.pathname + '#';
    const registrationLink =
      role === UserRole.EXECUTIVE ? `${baseUrl}/register/executive` : `${baseUrl}/register/staff`;
    
    try {
      const response = await fetch('/api/send-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          role: role === UserRole.EXECUTIVE ? 'EXECUTIVE' : 'STAFF',
          registrationUrl: registrationLink,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao enviar e-mail');
      }

      // Success
      alert('Convite enviado com sucesso!');
      onClose();
      setName('');
      setEmail('');
      setSendError(null);
      setRole(UserRole.EXECUTIVE);
    } catch (err: any) {
      console.error(err);
      setSendError(err.message || 'Erro ao enviar e-mail. Verifique se o backend está configurado.');
      
      // Fallback to mailto if API fails
      if (confirm('O envio automático falhou (provavelmente por falta do backend local ou configuração). Deseja abrir o cliente de e-mail padrão?')) {
        const content = buildInviteEmail({
            name,
            role: role === UserRole.EXECUTIVE ? 'EXECUTIVE' : 'STAFF',
            registrationLink,
          });
        window.location.href = mailtoHref(email, content.subject, content.body);
        onClose();
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 bg-gray-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/10 rounded-lg"><Mail size={20} /></div>
             <h3 className="text-xl font-bold">Convidar Novo Usuário</h3>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={24} /></button>
        </div>

        <div className="p-8 overflow-y-auto">
             <div className="space-y-6">
                <p className="text-gray-600">Preencha os dados para enviar um convite automático via e-mail.</p>
                
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Usuário</label>
                   <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setRole(UserRole.EXECUTIVE)}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${role === UserRole.EXECUTIVE ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-100 hover:bg-gray-50'}`}
                      >
                         <span className="font-bold">Executivo Comercial</span>
                         <span className="text-xs opacity-70">Vendas e Comissões</span>
                      </button>
                      <button 
                        onClick={() => setRole(UserRole.STAFF)}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${role === UserRole.STAFF ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-100 hover:bg-gray-50'}`}
                      >
                         <span className="font-bold">Engenheiro / Staff</span>
                         <span className="text-xs opacity-70">Projetos e Timesheet</span>
                      </button>
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Nome</label>
                   <input 
                      className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-gray-900 outline-none"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: João da Silva"
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">E-mail</label>
                   <input 
                      type="email"
                      className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-gray-900 outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="joao@email.com"
                   />
                </div>

                <button 
                  onClick={handleSendEmail}
                  disabled={!name || !email || isSending}
                  className={`w-full py-4 rounded-xl font-bold text-white flex justify-center items-center gap-2 transition-all
                    ${!name || !email || isSending ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 shadow-lg'}
                  `}
                >
                  {isSending ? 'Enviando...' : 'Enviar Convite'}
                </button>
                
                {sendError && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        {sendError}
                    </div>
                )}
             </div>
        </div>
      </div>
    </div>
  );
};
