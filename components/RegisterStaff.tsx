import React, { useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { User, UserRole } from '../types';
import { loadUsers, saveUsers } from '../services/mockData';

export const RegisterStaff: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // Use UserRole directly for the main role
  const [role, setRole] = useState<UserRole>(UserRole.ENGENHEIRO);
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSaving(true);
    const users = await loadUsers();
    const newUser: User = {
      id: `staff_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      role: role, // Directly assign the selected role
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f172a&color=fff`,
      location,
    };
    await saveUsers([newUser, ...users]);
    setSaving(false);
    setSuccess(true);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-soft animate-fade-in">
      <button onClick={() => window.history.back()} className="text-gray-400 hover:text-gray-900 flex items-center gap-2 mb-4 text-sm font-medium">
        <ArrowLeft size={16} /> Voltar
      </button>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Registro de Usuário Staff</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Nome</label>
          <input className="w-full bg-gray-50 border-none rounded-xl p-4 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none"
                 value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">E-mail</label>
          <input type="email" className="w-full bg-gray-50 border-none rounded-xl p-4 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none"
                 value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Função / Perfil</label>
          <select className="w-full bg-gray-50 border-none rounded-xl p-4 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none"
                  value={role} onChange={e => setRole(e.target.value as UserRole)}>
            <option value={UserRole.ENGENHEIRO}>Engenheiro</option>
            <option value={UserRole.PROGRAMADOR}>Programador</option>
            <option value={UserRole.FINANCEIRO}>Financeiro</option>
            <option value={UserRole.ADMIN}>Administrador</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Localização</label>
          <input className="w-full bg-gray-50 border-none rounded-xl p-4 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none"
                 value={location} onChange={e => setLocation(e.target.value)} placeholder="Cidade, Estado" />
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={saving || !name || !email}
                  className={`bg-gray-900 hover:bg-black text-white font-bold py-3 px-6 rounded-2xl flex items-center gap-2 transition-all ${saving || !name || !email ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <Save size={18} /> Registrar
          </button>
        </div>
        {success && <p className="text-green-600 text-sm font-bold">Cadastro concluído. Você já pode realizar login.</p>}
      </form>
    </div>
  );
};
