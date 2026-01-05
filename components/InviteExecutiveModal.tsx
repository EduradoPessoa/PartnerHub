import React, { useState } from 'react';
import { X, Sparkles, Send, Copy, Mail, UserCog } from 'lucide-react';
import { generateWelcomeEmail } from '../services/geminiService';
import { UserRole } from '../types';

interface InviteExecutiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteExecutiveModal: React.FC<InviteExecutiveModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.EXECUTIVE);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!name || !email) return;
    setLoading(true);
    // Note: in a real app, generateWelcomeEmail would take the role to customize the message.
    const content = await generateWelcomeEmail(name, email);
    setGeneratedEmail(content);
    setLoading(false);
  };

  const handleSendEmail = () => {
    if (!email || !generatedEmail) return;

    const subject = encodeURIComponent("Bem-vindo ao Phoenyx Partner Hub");
    const body = encodeURIComponent(generatedEmail);
    
    // Open default mail client
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    
    // Reset and close
    onClose();
    setName('');
    setEmail('');
    setGeneratedEmail('');
    setRole(UserRole.EXECUTIVE);
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
           {!generatedEmail ? (
             <div className="space-y-6">
                <p className="text-gray-600">Preencha os dados para gerar um e-mail de boas-vindas personalizado.</p>
                
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
                  onClick={handleGenerate}
                  disabled={loading || !name || !email}
                  className={`w-full py-4 rounded-xl font-bold text-white flex justify-center items-center gap-2 transition-all
                    ${loading || !name || !email ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 shadow-lg'}
                  `}
                >
                  {loading ? 'Escrevendo E-mail...' : <><Sparkles size={18}/> Gerar Convite com IA</>}
                </button>
             </div>
           ) : (
             <div className="space-y-6">
                <div className="bg-green-50 p-4 rounded-xl flex items-center gap-3 text-green-800 text-sm font-medium">
                   <Sparkles size={16} />
                   E-mail gerado com sucesso! Revise antes de enviar.
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm font-mono text-gray-700 whitespace-pre-wrap h-64 overflow-y-auto">
                   {generatedEmail}
                </div>

                <div className="flex gap-4">
                   <button 
                     onClick={() => { setGeneratedEmail(''); }}
                     className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                   >
                     Voltar
                   </button>
                   <button 
                     onClick={() => navigator.clipboard.writeText(generatedEmail)}
                     className="px-4 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors"
                     title="Copiar Texto"
                   >
                      <Copy size={20} />
                   </button>
                   <button 
                     onClick={handleSendEmail}
                     className="flex-1 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors flex justify-center items-center gap-2"
                   >
                     <Send size={18} /> Abrir no E-mail
                   </button>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};