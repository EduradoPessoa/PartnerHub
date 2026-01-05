import React from 'react';
import { ShieldCheck, CreditCard, DollarSign, FileText } from 'lucide-react';

export const CommercialPolicies: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900">Políticas Comerciais</h2>
        <p className="text-gray-500 mt-2">Guia de referência para negociações e condições de pagamento.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Card 1: Remuneração */}
        <div className="bg-white p-8 rounded-3xl shadow-soft">
          <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white mb-6">
            <DollarSign size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Comissionamento</h3>
          <ul className="space-y-4 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="font-bold text-gray-900 mt-1">20%</span>
              <p>Do valor total do projeto pago no <strong>fechamento do contrato</strong>.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-gray-900 mt-1">10%</span>
              <p>Prêmio de pós-venda pago na <strong>entrega final</strong> mediante aprovação do cliente.</p>
            </li>
          </ul>
        </div>

        {/* Card 2: Condições de Pagamento */}
        <div className="bg-white p-8 rounded-3xl shadow-soft">
           <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white mb-6">
            <CreditCard size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Condições de Pagamento (Cliente)</h3>
          <div className="space-y-4">
             <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-gray-900 text-sm mb-1">Padrão (Preferencial)</h4>
                <p className="text-sm text-gray-600">50% na assinatura do contrato + 50% na entrega final.</p>
             </div>
             <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-gray-900 text-sm mb-1">Parcelado (Projetos &gt; 30k)</h4>
                <p className="text-sm text-gray-600">Entrada de 30% + Saldo em até 3x (sujeito a aprovação financeira).</p>
             </div>
          </div>
        </div>

        {/* Card 3: Processo de Engenharia */}
        <div className="bg-white p-8 rounded-3xl shadow-soft md:col-span-2">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Validação Técnica Obrigatória</h3>
           </div>
           
           <p className="text-gray-600 mb-6 leading-relaxed">
             Para garantir a viabilidade e a margem do projeto, nenhuma proposta comercial pode ser formalizada sem antes passar pela etapa de <strong>Análise Técnica</strong> na plataforma.
           </p>

           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 text-center">
                 <div className="font-bold text-gray-900 mb-1">1. Escopo</div>
                 <p className="text-xs text-gray-500">Executivo insere requisitos na aba Engenharia.</p>
              </div>
               <div className="p-4 rounded-2xl bg-gray-50 text-center relative">
                 <div className="font-bold text-gray-900 mb-1">2. Aprovação</div>
                 <p className="text-xs text-gray-500">Equipe técnica valida viabilidade e custos.</p>
              </div>
               <div className="p-4 rounded-2xl bg-gray-50 text-center">
                 <div className="font-bold text-gray-900 mb-1">3. Venda</div>
                 <p className="text-xs text-gray-500">Liberação para assinatura de contrato.</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};