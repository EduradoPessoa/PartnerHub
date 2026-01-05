import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { loadUsers } from '../services/mockData';
import { ArrowRight, Lock, Mail, AlertCircle, Info } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Load fresh users from API
      const users = await loadUsers();
      
      // Case insensitive and trimmed email check
      const cleanEmail = email.trim().toLowerCase();
      const user = users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
      
      if (user) {
        // Validation Logic
        let isValid = false;

        // 1. Master Admin Password (Exclusive to Eduardo)
        if (user.email.toLowerCase() === 'eduardo@phoenyx.com.br' && password === 'P3naBranc@') {
            isValid = true;
        }
        // 2. Demo Password (Available for everyone for testing purposes)
        else if (password === '123456') {
            isValid = true;
        }

        if (isValid) {
          onLogin(user);
        } else {
          setError('Senha incorreta.');
        }
      } else {
        // Debug info could be logged here if needed
        console.log("User not found in list:", users.map(u => u.email));
        setError('Usuário não encontrado.');
      }
    } catch (e) {
      console.error(e);
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-600 rounded-full blur-[128px] opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[150px] opacity-10"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex overflow-hidden z-10 min-h-[600px] animate-fade-in flex-col md:flex-row">
        
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-black text-2xl">
                P.
              </div>
              <span className="font-bold text-2xl tracking-tight text-gray-900">PHOENYX</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Bem-vindo de volta</h2>
            <p className="text-gray-500">Acesse o Partner Hub para gerenciar suas oportunidades.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="email" 
                  required
                  className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-xl py-4 pl-12 pr-4 outline-none transition-all font-medium text-gray-900"
                  placeholder="seu.nome@phoenyx.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="password" 
                  required
                  className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-xl py-4 pl-12 pr-4 outline-none transition-all font-medium text-gray-900"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end mt-2">
                <button type="button" className="text-sm font-bold text-brand-600 hover:underline">
                  Esqueceu a senha?
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-bold animate-pulse">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className={`w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-80 cursor-wait' : ''}`}
            >
              {loading ? 'Acessando...' : <>Entrar <ArrowRight size={20} /></>}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
             <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-800">
                <p className="font-bold flex items-center gap-2 mb-2"><Info size={14}/> Credenciais de Acesso (Demo)</p>
                <div className="grid grid-cols-2 gap-2">
                   <div>
                      <p className="font-bold">Admin:</p>
                      <p className="font-mono opacity-80">eduardo@phoenyx.com.br</p>
                   </div>
                    <div>
                      <p className="font-bold">Executivo:</p>
                      <p className="font-mono opacity-80">joao@phoenyx.com</p>
                   </div>
                </div>
                <p className="mt-2 pt-2 border-t border-blue-200 font-bold">Senha padrão: 123456</p>
             </div>
          </div>
        </div>

        {/* Right Side - Visual */}
        <div className="hidden md:flex w-1/2 bg-gray-50 relative flex-col justify-between p-12 overflow-hidden">
           <div className="absolute top-0 right-0 w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80" 
                alt="Meeting" 
                className="w-full h-full object-cover opacity-60 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-brand-900/80"></div>
           </div>

           <div className="relative z-10 mt-auto">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white mb-6">
                <ArrowRight size={24} className="-rotate-45" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
                "A Phoenyx entrega o código.<br/>Você entrega o relacionamento."
              </h3>
              <p className="text-gray-200 leading-relaxed">
                Junte-se à nossa rede de executivos parceiros e escale seus ganhos vendendo tecnologia de ponta com suporte total de engenharia.
              </p>
           </div>
        </div>

      </div>
      
      {/* Footer Credits */}
      <div className="absolute bottom-4 text-center w-full text-gray-500 text-xs">
        © 2024 Phoenyx Tecnologia. Todos os direitos reservados.
      </div>
    </div>
  );
};