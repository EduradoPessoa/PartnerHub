import React from 'react';
import { Opportunity, CommissionRecord, OpportunityStatus, CommissionStatus } from '../types';
import { History, Calendar, DollarSign, ArrowUpRight } from 'lucide-react';

interface SalesHistoryProps {
  opportunities: Opportunity[];
  commissions: CommissionRecord[];
}

export const SalesHistory: React.FC<SalesHistoryProps> = ({ opportunities, commissions }) => {
  
  // Filter ops that resulted in a sale/contract
  const closedOps = opportunities
    .filter(op => op.status === OpportunityStatus.CONTRACT_SIGNED || op.status === OpportunityStatus.DELIVERED || op.status === OpportunityStatus.IN_DEVELOPMENT)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Join data nicely
  const historyData = closedOps.map(op => {
     const opComms = commissions.filter(c => c.opportunityId === op.id);
     const totalComm = opComms.reduce((acc, c) => acc + c.amount, 0);
     const paidComm = opComms.filter(c => c.status === CommissionStatus.PAID).reduce((acc, c) => acc + c.amount, 0);
     
     return {
         ...op,
         totalCommission: totalComm,
         paidCommission: paidComm,
         records: opComms
     };
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
       <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Histórico de Vendas</h2>
          <p className="text-gray-500 mt-1">Seu registro de fechamentos e recebimentos.</p>
       </div>

       <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-400 font-semibold text-xs uppercase tracking-wider">
                   <tr>
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4">Cliente</th>
                      <th className="px-6 py-4">Valor do Projeto</th>
                      <th className="px-6 py-4">Comissão Total (30%)</th>
                      <th className="px-6 py-4">Recebido</th>
                      <th className="px-6 py-4">Status Pagamento</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {historyData.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                         <td className="px-6 py-4 flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400"/>
                            {new Date(item.createdAt).toLocaleDateString()}
                         </td>
                         <td className="px-6 py-4 font-bold text-gray-900">
                            {item.companyName}
                         </td>
                         <td className="px-6 py-4">
                            {item.estimatedValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                         </td>
                         <td className="px-6 py-4 text-green-700 font-bold bg-green-50/50">
                            {item.totalCommission.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                         </td>
                         <td className="px-6 py-4 font-bold text-gray-900">
                            {item.paidCommission.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                         </td>
                         <td className="px-6 py-4">
                            {item.paidCommission >= item.totalCommission ? (
                               <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">Totalmente Pago</span>
                            ) : item.paidCommission > 0 ? (
                               <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">Parcialmente Pago</span>
                            ) : (
                               <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full font-bold">A Receber</span>
                            )}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
             {historyData.length === 0 && (
                <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-2">
                   <History size={32} className="opacity-20"/>
                   <p>Nenhuma venda finalizada encontrada no histórico.</p>
                </div>
             )}
          </div>
       </div>

       {/* Detailed Payments Log */}
       <h3 className="text-xl font-bold text-gray-900 mt-8">Extrato de Lançamentos</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {commissions
            .filter(c => c.status !== CommissionStatus.PENDING)
            .sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
            .map(comm => {
               const op = opportunities.find(o => o.id === comm.opportunityId);
               return (
                  <div key={comm.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                      <div>
                         <div className="flex justify-between items-start mb-2">
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${comm.type === 'CLOSING' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                               {comm.type === 'CLOSING' ? 'Fechamento' : 'Pós-Venda'}
                            </span>
                            <span className="text-xs text-gray-400">{new Date(comm.dueDate).toLocaleDateString()}</span>
                         </div>
                         <h4 className="font-bold text-gray-900">{op?.companyName}</h4>
                         <p className="text-2xl font-bold text-gray-900 mt-2">
                            {comm.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                         </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                          <span className={`text-xs font-bold ${
                             comm.status === CommissionStatus.PAID ? 'text-green-600' : 
                             comm.status === CommissionStatus.INVOICE_RECEIVED ? 'text-blue-600' : 'text-orange-500'
                          }`}>
                             {comm.status}
                          </span>
                          {comm.status === CommissionStatus.PAID && <div className="p-1 bg-green-100 rounded-full text-green-600"><DollarSign size={12}/></div>}
                      </div>
                  </div>
               )
            })
          }
       </div>
    </div>
  );
};