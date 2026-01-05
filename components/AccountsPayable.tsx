import React, { useState } from 'react';
import { Opportunity, CommissionRecord, User, CommissionStatus } from '../types';
import { DollarSign, FileText, CheckCircle, Clock, Building, ArrowRight, X } from 'lucide-react';

interface AccountsPayableProps {
  opportunities: Opportunity[];
  commissions: CommissionRecord[];
  users: User[];
  onUpdateCommission: (updatedComm: CommissionRecord) => void;
}

export const AccountsPayable: React.FC<AccountsPayableProps> = ({ opportunities, commissions, users, onUpdateCommission }) => {
  const [filter, setFilter] = useState<'ALL' | 'TO_PAY' | 'PAID'>('TO_PAY');
  const [selectedCommission, setSelectedCommission] = useState<CommissionRecord | null>(null);

  // Helper to join data
  const getEnrichedData = (comm: CommissionRecord) => {
    const op = opportunities.find(o => o.id === comm.opportunityId);
    const exec = users.find(u => u.id === op?.executiveId);
    return { op, exec, comm };
  };

  const filteredCommissions = commissions
    .filter(c => c.status !== CommissionStatus.PENDING) // Don't show pending milestones
    .filter(c => {
      if (filter === 'TO_PAY') return c.status === CommissionStatus.AVAILABLE || c.status === CommissionStatus.INVOICE_RECEIVED;
      if (filter === 'PAID') return c.status === CommissionStatus.PAID;
      return true;
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const handlePay = () => {
    if (!selectedCommission) return;
    const updated: CommissionRecord = {
      ...selectedCommission,
      status: CommissionStatus.PAID,
      paidAt: new Date().toISOString().split('T')[0]
    };
    onUpdateCommission(updated);
    setSelectedCommission(null);
  };

  const handleReceiveInvoice = (comm: CommissionRecord) => {
     // In a real app, this would be an upload or verify action
     // For now, we simulate marking it as "Invoice Received"
     const updated: CommissionRecord = {
         ...comm,
         status: CommissionStatus.INVOICE_RECEIVED,
         invoiceUrl: 'mock_url_nf.pdf'
     };
     onUpdateCommission(updated);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Contas a Pagar</h2>
          <p className="text-gray-500">Gestão de pagamentos de comissões e Notas Fiscais.</p>
        </div>
        <div className="bg-white rounded-xl p-1 flex shadow-sm border border-gray-100">
           <button 
             onClick={() => setFilter('TO_PAY')}
             className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'TO_PAY' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}
           >
             A Pagar
           </button>
           <button 
             onClick={() => setFilter('PAID')}
             className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'PAID' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}
           >
             Pagos
           </button>
           <button 
             onClick={() => setFilter('ALL')}
             className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'ALL' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}
           >
             Todos
           </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
             <thead className="bg-gray-50 text-gray-400 font-semibold text-xs uppercase tracking-wider">
               <tr>
                 <th className="px-6 py-4">Vencimento</th>
                 <th className="px-6 py-4">Executivo / Empresa</th>
                 <th className="px-6 py-4">Referência (Projeto)</th>
                 <th className="px-6 py-4">Valor</th>
                 <th className="px-6 py-4">Status</th>
                 <th className="px-6 py-4 text-right">Ação</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
               {filteredCommissions.map(comm => {
                 const { op, exec } = getEnrichedData(comm);
                 return (
                   <tr key={comm.id} className="hover:bg-gray-50 transition-colors">
                     <td className="px-6 py-4">
                        {new Date(comm.dueDate).toLocaleDateString()}
                     </td>
                     <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{exec?.name}</div>
                        <div className="text-xs text-gray-400">{exec?.pjDetails?.legalName || 'PJ Pendente'}</div>
                     </td>
                     <td className="px-6 py-4">
                        {comm.type === 'CLOSING' ? 'Comissão de Fechamento (20%)' : 'Prêmio de Entrega (10%)'}
                        <div className="text-xs text-gray-400">{op?.companyName}</div>
                     </td>
                     <td className="px-6 py-4 font-bold text-gray-900">
                        {comm.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                     </td>
                     <td className="px-6 py-4">
                        {comm.status === CommissionStatus.PAID ? (
                           <span className="flex items-center gap-1 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full w-fit">
                             <CheckCircle size={14} /> Pago
                           </span>
                        ) : comm.status === CommissionStatus.INVOICE_RECEIVED ? (
                           <span className="flex items-center gap-1 text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full w-fit">
                             <FileText size={14} /> NF Recebida
                           </span>
                        ) : (
                           <span className="flex items-center gap-1 text-orange-600 font-bold bg-orange-50 px-3 py-1 rounded-full w-fit">
                             <Clock size={14} /> Aguardando NF
                           </span>
                        )}
                     </td>
                     <td className="px-6 py-4 text-right">
                        {comm.status === CommissionStatus.AVAILABLE && (
                           <button 
                             onClick={() => handleReceiveInvoice(comm)}
                             className="text-xs font-bold text-blue-600 hover:text-blue-800 border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50"
                           >
                             Receber NF
                           </button>
                        )}
                        {comm.status === CommissionStatus.INVOICE_RECEIVED && (
                           <button 
                             onClick={() => setSelectedCommission(comm)}
                             className="text-xs font-bold text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg shadow-sm"
                           >
                             Pagar (PIX)
                           </button>
                        )}
                        {comm.status === CommissionStatus.PAID && (
                            <span className="text-xs text-gray-400">
                              Pago em {comm.paidAt ? new Date(comm.paidAt).toLocaleDateString() : '-'}
                            </span>
                        )}
                     </td>
                   </tr>
                 );
               })}
             </tbody>
          </table>
          {filteredCommissions.length === 0 && (
             <div className="p-12 text-center text-gray-400">
                Nenhum registro encontrado para este filtro.
             </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {selectedCommission && (() => {
         const { exec } = getEnrichedData(selectedCommission);
         const pj = exec?.pjDetails;
         return (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
               <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
                  <div className="bg-gray-900 p-6 flex justify-between items-center text-white">
                     <h3 className="text-lg font-bold flex items-center gap-2"><DollarSign size={20} className="text-green-400"/> Confirmar Pagamento PIX</h3>
                     <button onClick={() => setSelectedCommission(null)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                  </div>
                  
                  <div className="p-8 space-y-6">
                     <div className="text-center">
                        <p className="text-gray-500 text-sm uppercase font-bold tracking-wider mb-2">Valor a Pagar</p>
                        <p className="text-4xl font-extrabold text-gray-900">
                           {selectedCommission.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                     </div>

                     <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                        <div className="flex items-start gap-4">
                           <div className="bg-white p-2 rounded-lg text-gray-900 shadow-sm"><Building size={20} /></div>
                           <div>
                              <p className="text-xs font-bold text-gray-400 uppercase">Beneficiário</p>
                              <p className="font-bold text-gray-900">{pj?.legalName || exec?.name}</p>
                              <p className="text-sm text-gray-600">CNPJ: {pj?.cnpj || 'Não informado'}</p>
                           </div>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Chave PIX</p>
                            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                               <span className="font-mono text-gray-800 font-bold">{pj?.bankInfo.pixKey || 'Chave não cadastrada'}</span>
                               <button className="text-xs font-bold text-blue-600 hover:underline">Copiar</button>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                               Banco: {pj?.bankInfo.bank} / Ag: {pj?.bankInfo.agency} / CC: {pj?.bankInfo.account}
                            </div>
                        </div>
                     </div>
                     
                     {!pj?.bankInfo.pixKey ? (
                        <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl font-medium text-center">
                           ⚠️ Este executivo não cadastrou chave PIX. Verifique os dados bancários.
                        </div>
                     ) : (
                        <button 
                           onClick={handlePay}
                           className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-green-200 transition-all flex items-center justify-center gap-2"
                        >
                           Confirmar Transferência <ArrowRight size={20} />
                        </button>
                     )}
                  </div>
               </div>
            </div>
         );
      })()}

    </div>
  );
};