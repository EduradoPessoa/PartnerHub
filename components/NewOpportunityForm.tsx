import React, { useState, useEffect } from 'react';
import { Opportunity, OpportunityStatus, OpportunityTemperature } from '../types';
import { X, Save, ArrowLeft, Cpu } from 'lucide-react';

interface NewOpportunityFormProps {
  executiveId: string;
  onSave: (op: Opportunity) => void;
  onCancel: () => void;
  initialData?: Opportunity;
}

export const NewOpportunityForm: React.FC<NewOpportunityFormProps> = ({ executiveId, onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState<Partial<Opportunity>>({
    cnpj: '',
    companyName: '',
    contactName: '',
    contactEmail: '',
    projectType: 'Web',
    estimatedValue: 15000, 
    status: OpportunityStatus.TECHNICAL_ANALYSIS, // Default to Analysis
    temperature: 'WARM',
    notes: '',
    paymentConditions: '50% Entrada / 50% Entrega'
  });

  const [techBriefing, setTechBriefing] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setTechBriefing(initialData.engineering?.technicalScope || '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.estimatedValue) return;

    const opToSave: Opportunity = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      executiveId: initialData?.executiveId || executiveId,
      createdAt: initialData?.createdAt || new Date().toISOString().split('T')[0],
      ...(formData as Opportunity),
      // Automatically create engineering context
      engineering: {
          technicalScope: techBriefing,
          approvalStatus: initialData?.engineering?.approvalStatus || 'PENDING',
          interactions: initialData?.engineering?.interactions || [],
          complexity: initialData?.engineering?.complexity,
          riskAnalysis: initialData?.engineering?.riskAnalysis,
          estimatedHours: initialData?.engineering?.estimatedHours
      }
    };

    onSave(opToSave);
  };

  return (
    <div className="bg-white rounded-3xl shadow-soft p-8 animate-fade-in relative">
      <div className="flex justify-between items-center mb-8">
        <div>
           <button onClick={onCancel} className="text-gray-400 hover:text-gray-900 flex items-center gap-2 mb-2 text-sm font-medium">
             <ArrowLeft size={16} /> Voltar
           </button>
           <h3 className="text-2xl font-bold text-gray-900">
             {initialData ? 'Editar Projeto' : 'Nova Oportunidade'}
           </h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 bg-gray-50 rounded-3xl space-y-6">
           <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Dados da Empresa</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2">CNPJ</label>
              <input 
                required
                className="w-full bg-white border-none rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-gray-900 outline-none transition-all placeholder-gray-300"
                value={formData.cnpj}
                onChange={e => setFormData({...formData, cnpj: e.target.value})}
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Razão Social</label>
              <input 
                required
                className="w-full bg-white border-none rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-gray-900 outline-none transition-all placeholder-gray-300"
                value={formData.companyName}
                onChange={e => setFormData({...formData, companyName: e.target.value})}
                placeholder="Nome da Empresa"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nome do Contato</label>
            <input 
              required
              className="w-full bg-gray-50 border-none rounded-xl p-4 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all"
              value={formData.contactName}
              onChange={e => setFormData({...formData, contactName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email do Contato</label>
            <input 
              type="email"
              required
              className="w-full bg-gray-50 border-none rounded-xl p-4 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all"
              value={formData.contactEmail}
              onChange={e => setFormData({...formData, contactEmail: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Projeto</label>
            <div className="relative">
              <select 
                className="w-full bg-gray-50 border-none rounded-xl p-4 appearance-none focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all cursor-pointer"
                value={formData.projectType}
                onChange={e => setFormData({...formData, projectType: e.target.value as any})}
              >
                <option value="Web">Desenvolvimento Web</option>
                <option value="Mobile">App Mobile</option>
                <option value="Site">Site Institucional</option>
                <option value="Landing Page">Landing Page</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Temperatura (Score)</label>
            <select 
              className="w-full bg-gray-50 border-none rounded-xl p-4 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all"
              value={formData.temperature}
              onChange={e => setFormData({...formData, temperature: e.target.value as OpportunityTemperature})}
            >
              <option value="HOT">🔥 Quente (Fechamento Próximo)</option>
              <option value="WARM">🌡️ Morno (Em negociação)</option>
              <option value="COLD">❄️ Frio (Prospecção)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Valor Estimado (R$)</label>
            <input 
              type="number"
              required
              className="w-full bg-gray-50 border-none rounded-xl p-4 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all"
              value={formData.estimatedValue}
              onChange={e => setFormData({...formData, estimatedValue: parseFloat(e.target.value)})}
            />
          </div>
        </div>
        
        {/* Conditions */}
         <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Condição de Pagamento Proposta</label>
            <input 
              className="w-full bg-gray-50 border-none rounded-xl p-4 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all"
              value={formData.paymentConditions}
              onChange={e => setFormData({...formData, paymentConditions: e.target.value})}
              placeholder="Ex: 50% Entrada / 50% Entrega"
            />
          </div>

        {initialData && (
          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Fase Atual</label>
             <select 
               className="w-full bg-gray-50 border-none rounded-xl p-4 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all"
               value={formData.status}
               onChange={e => setFormData({...formData, status: e.target.value as OpportunityStatus})}
             >
               {Object.values(OpportunityStatus).map(s => (
                 <option key={s} value={s}>{s}</option>
               ))}
             </select>
          </div>
        )}

        {/* Engineering Briefing Section - Required for New Opportunities */}
        <div className="bg-gray-900 p-6 rounded-3xl text-white">
            <div className="flex items-center gap-2 mb-4">
                <Cpu size={20} className="text-brand-400"/>
                <h4 className="font-bold text-lg">Briefing Técnico Inicial</h4>
            </div>
            <p className="text-sm text-gray-400 mb-4">
                Descreva o que o cliente precisa tecnicamente. Isso criará automaticamente um projeto para avaliação do time de Engenharia.
            </p>
            <textarea 
              required={!initialData} // Mandatory for new items
              className="w-full bg-gray-800 border-none rounded-xl p-4 h-32 resize-none focus:ring-2 focus:ring-brand-500 outline-none transition-all text-white placeholder-gray-500"
              value={techBriefing}
              onChange={e => setTechBriefing(e.target.value)}
              placeholder="Ex: Cliente precisa de um app estilo Uber para entregas locais. Precisa de painel administrativo web e app Android..."
            />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Outras Observações</label>
          <textarea 
            className="w-full bg-gray-50 border-none rounded-xl p-4 h-24 resize-none focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all"
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
            placeholder="Detalhes sobre a negociação..."
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button 
            type="submit"
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-8 rounded-2xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Save size={20} />
            {initialData ? 'Salvar Alterações' : 'Enviar para Engenharia'}
          </button>
        </div>
      </form>
    </div>
  );
};