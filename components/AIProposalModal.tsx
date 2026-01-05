import React, { useState } from 'react';
import { Sparkles, X, Copy, Check, Mail } from 'lucide-react';
import { generateSalesPitch } from '../services/geminiService';

interface AIProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  executiveName: string;
}

export const AIProposalModal: React.FC<AIProposalModalProps> = ({ isOpen, onClose, executiveName }) => {
  const [clientName, setClientName] = useState('');
  const [industry, setIndustry] = useState('');
  const [needs, setNeeds] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!clientName || !needs) return;
    setLoading(true);
    const text = await generateSalesPitch(clientName, industry, needs, executiveName);
    setResult(text);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = () => {
    if (!result) return;
    const subject = encodeURIComponent(`Proposta Comercial - ${clientName}`);
    const body = encodeURIComponent(result);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-yellow-300" />
            <h3 className="text-lg font-bold">Phoenyx AI Assistant</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-500">
            Descreva o cliente e a necessidade. Nossa IA criará um rascunho de e-mail focado em consultoria e valor.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente / Empresa</label>
              <input 
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 outline-none"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="Ex: Varejo Express"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Setor / Indústria</label>
              <input 
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 outline-none"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                placeholder="Ex: Logística, Moda, Saúde..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Necessidade Principal (Dor)</label>
            <textarea 
              className="w-full border border-gray-300 rounded-lg p-2 h-20 focus:ring-2 focus:ring-brand-500 outline-none resize-none"
              value={needs}
              onChange={e => setNeeds(e.target.value)}
              placeholder="Ex: Precisam de um app para vendedores externos lançarem pedidos offline."
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading || !clientName || !needs}
            className={`w-full py-3 rounded-lg font-semibold text-white flex justify-center items-center gap-2 transition-all
              ${loading || !clientName || !needs ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 shadow-lg hover:shadow-xl'}
            `}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Gerando Pitch...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Gerar Proposta com IA
              </>
            )}
          </button>

          {result && (
            <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Rascunho Gerado</span>
                <div className="flex items-center gap-2">
                    <button 
                      onClick={handleSendEmail}
                      className="text-gray-500 hover:text-brand-600 text-sm font-medium flex items-center gap-1 transition-colors"
                      title="Enviar por E-mail"
                    >
                      <Mail size={16} />
                    </button>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <button 
                      onClick={handleCopy}
                      className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap font-mono text-sm bg-white p-3 rounded border border-gray-100">
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};