import React, { useState, useEffect } from 'react';
import { User, PjDetails } from '../types';
import { Save, Building, User as UserIcon, CreditCard, Mail, FileText, CheckCircle, MapPin, Phone, Upload } from 'lucide-react';

interface ProfileProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'PERSONAL' | 'PJ' | 'BANK'>('PERSONAL');
  const [success, setSuccess] = useState(false);
  
  const [personalData, setPersonalData] = useState({
      phone: user.phone || '',
      location: user.location || '',
      name: user.name,
      avatar: user.avatar
  });

  const [pjData, setPjData] = useState<PjDetails>({
    cnpj: '',
    legalName: '',
    fantasyName: '',
    address: '',
    city: '',
    state: '',
    bankInfo: {
      bank: '',
      agency: '',
      account: '',
      pixKey: ''
    }
  });

  useEffect(() => {
    if (user.pjDetails) {
      setPjData(user.pjDetails);
    }
    setPersonalData({
        phone: user.phone || '',
        location: user.location || '',
        name: user.name,
        avatar: user.avatar
    });
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = { 
        ...user, 
        ...personalData,
        pjDetails: pjData 
    };
    onUpdate(updatedUser);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files && e.target.files[0]) {
          // Mock upload by creating a local URL
          const url = URL.createObjectURL(e.target.files[0]);
          setPersonalData({...personalData, avatar: url});
      }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Perfil do Parceiro</h2>
      </div>
      <p className="text-gray-500">Gerencie seus dados pessoais e de cadastro PJ para recebimento de comissões.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Card: Basic User Info */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-3xl shadow-soft p-6 flex flex-col items-center text-center">
             <div className="relative group cursor-pointer">
                <img src={personalData.avatar} alt={user.name} className="w-32 h-32 rounded-full border-4 border-gray-100 mb-4 object-cover" />
                <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold text-xs cursor-pointer">
                    <Upload size={20} className="mb-1 block mx-auto" />
                    Alterar
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </label>
             </div>
            
            <h3 className="text-xl font-bold text-gray-900">{personalData.name}</h3>
            <span className="text-sm bg-brand-100 text-brand-800 px-3 py-1 rounded-full font-semibold mt-2 border border-brand-200">
              Executivo Comercial
            </span>
            
            <div className="mt-6 w-full space-y-3 text-left">
              <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                 <UserIcon size={18} />
                 <div className="text-xs">
                    <p className="font-bold text-gray-900">ID do Parceiro</p>
                    <p>{user.id}</p>
                 </div>
              </div>
               <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                 <Mail size={18} />
                 <div className="text-xs overflow-hidden">
                    <p className="font-bold text-gray-900">Email Cadastrado</p>
                    <p className="truncate">{user.email}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Forms */}
        <div className="md:col-span-2">
           <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-soft overflow-hidden">
              
              {/* Tabs */}
              <div className="flex border-b border-gray-100 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('PERSONAL')}
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors min-w-[120px] ${activeTab === 'PERSONAL' ? 'bg-gray-50 text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <UserIcon size={18} />
                  Pessoal
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('PJ')}
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors min-w-[120px] ${activeTab === 'PJ' ? 'bg-gray-50 text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Building size={18} />
                  Empresa (PJ)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('BANK')}
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors min-w-[120px] ${activeTab === 'BANK' ? 'bg-gray-50 text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <CreditCard size={18} />
                  Bancário
                </button>
              </div>

              <div className="p-8">
                 {/* PERSONAL TAB */}
                 {activeTab === 'PERSONAL' && (
                     <div className="space-y-6 animate-fade-in">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo</label>
                            <input 
                              required
                              className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                              value={personalData.name}
                              onChange={e => setPersonalData({...personalData, name: e.target.value})}
                            />
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Telefone / WhatsApp</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                                        placeholder="(00) 00000-0000"
                                        value={personalData.phone}
                                        onChange={e => setPersonalData({...personalData, phone: e.target.value})}
                                    />
                                </div>
                             </div>
                             <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Cidade de Atuação</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                                        placeholder="Cidade, UF"
                                        value={personalData.location}
                                        onChange={e => setPersonalData({...personalData, location: e.target.value})}
                                    />
                                </div>
                             </div>
                         </div>
                     </div>
                 )}

                 {activeTab === 'PJ' && (
                   <div className="space-y-6 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">CNPJ</label>
                            <input 
                              required
                              className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-gray-900 outline-none transition-all placeholder-gray-400"
                              placeholder="00.000.000/0001-00"
                              value={pjData.cnpj}
                              onChange={e => setPjData({...pjData, cnpj: e.target.value})}
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nome Fantasia</label>
                            <input 
                              className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                              value={pjData.fantasyName}
                              onChange={e => setPjData({...pjData, fantasyName: e.target.value})}
                            />
                         </div>
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Razão Social</label>
                          <input 
                            required
                            className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                            value={pjData.legalName}
                            onChange={e => setPjData({...pjData, legalName: e.target.value})}
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Endereço Completo</label>
                          <input 
                            required
                            className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                            value={pjData.address}
                            onChange={e => setPjData({...pjData, address: e.target.value})}
                          />
                       </div>
                       <div className="grid grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Cidade</label>
                            <input 
                              required
                              className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                              value={pjData.city}
                              onChange={e => setPjData({...pjData, city: e.target.value})}
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Estado</label>
                            <input 
                              required
                              className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                              value={pjData.state}
                              onChange={e => setPjData({...pjData, state: e.target.value})}
                            />
                         </div>
                      </div>
                   </div>
                 )}

                 {activeTab === 'BANK' && (
                    <div className="space-y-6 animate-fade-in">
                       <div className="p-4 bg-blue-50 text-blue-800 rounded-xl text-sm mb-4">
                          <strong>Atenção:</strong> A conta bancária deve estar vinculada ao mesmo CNPJ cadastrado na aba anterior.
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Banco</label>
                          <input 
                            required
                            className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-gray-900 outline-none transition-all placeholder-gray-400"
                            placeholder="Ex: 0260 - Nu Pagamentos S.A."
                            value={pjData.bankInfo.bank}
                            onChange={e => setPjData({...pjData, bankInfo: {...pjData.bankInfo, bank: e.target.value}})}
                          />
                       </div>
                       <div className="grid grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Agência</label>
                            <input 
                              required
                              className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                              value={pjData.bankInfo.agency}
                              onChange={e => setPjData({...pjData, bankInfo: {...pjData.bankInfo, agency: e.target.value}})}
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Conta Corrente</label>
                            <input 
                              required
                              className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                              value={pjData.bankInfo.account}
                              onChange={e => setPjData({...pjData, bankInfo: {...pjData.bankInfo, account: e.target.value}})}
                            />
                         </div>
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Chave PIX (Opcional)</label>
                          <input 
                            className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                            value={pjData.bankInfo.pixKey}
                            onChange={e => setPjData({...pjData, bankInfo: {...pjData.bankInfo, pixKey: e.target.value}})}
                          />
                       </div>
                    </div>
                 )}

                 <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                      {success && <span className="flex items-center gap-2 text-green-600 font-bold animate-pulse"><CheckCircle size={16}/> Dados salvos com sucesso!</span>}
                    </p>
                    <button 
                      type="submit"
                      className="bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all shadow-lg"
                    >
                      <Save size={20} />
                      Salvar Cadastro
                    </button>
                 </div>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
};