import React, { useState } from 'react';
import { Opportunity, CommissionRecord, User, OpportunityStatus, CommissionStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Wallet, Users, TrendingUp, AlertCircle, MapPin, UserPlus, Trophy, Cpu, ArrowRight } from 'lucide-react';
import { InviteExecutiveModal } from './InviteExecutiveModal';
import { OpportunityDetailsModal } from './OpportunityDetailsModal';

interface AdminDashboardProps {
  opportunities: Opportunity[];
  commissions: CommissionRecord[];
  users: User[];
}

const COLORS = ['#ea580c', '#f97316', '#fb923c', '#fdba74'];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ opportunities, commissions, users }) => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedAnalysisOp, setSelectedAnalysisOp] = useState<Opportunity | null>(null);

  // Helper to update local state logic is handled in App.tsx via prop drilling, 
  // but here we just need to display. The Modal update will trigger a re-render from parent.
  // For the purpose of this mock, we assume App.tsx handles the actual state update.

  const totalSales = opportunities.reduce((acc, curr) => acc + curr.estimatedValue, 0);
  
  const totalCommissionsPaid = commissions
    .filter(c => c.status === CommissionStatus.PAID)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalCommissionsPending = commissions
    .filter(c => c.status === CommissionStatus.INVOICE_RECEIVED || c.status === CommissionStatus.AVAILABLE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const activeExecutives = users.filter(u => u.role === 'EXECUTIVE');
  
  // Pending Engineering
  const pendingEngineering = opportunities.filter(op => 
      op.status === OpportunityStatus.TECHNICAL_ANALYSIS || 
      op.engineering?.approvalStatus === 'PENDING'
  );

  // Sales per Executive (Ranking Data)
  const rankingData = activeExecutives
    .map(u => {
      const userOps = opportunities.filter(o => o.executiveId === u.id);
      const total = userOps.reduce((acc, o) => acc + o.estimatedValue, 0);
      const deals = userOps.filter(o => o.status === OpportunityStatus.CONTRACT_SIGNED || o.status === OpportunityStatus.DELIVERED || o.status === OpportunityStatus.IN_DEVELOPMENT).length;
      return { 
          id: u.id,
          name: u.name, 
          location: u.location || 'Não informado',
          avatar: u.avatar,
          totalValue: total,
          dealsCount: deals
      };
    })
    .sort((a, b) => b.totalValue - a.totalValue);

  // Status Distribution
  const statusCounts = opportunities.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const pieData = Object.keys(statusCounts).map(key => ({ name: key, value: statusCounts[key] }));

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Admin Header */}
      <div className="bg-gray-900 rounded-3xl p-8 shadow-soft text-white relative overflow-hidden flex justify-between items-center">
        <div className="z-10 relative">
          <h1 className="text-3xl font-extrabold mb-2">Painel de Engenharia & Admin</h1>
          <p className="text-gray-400">Visão geral técnica, financeira e comercial.</p>
        </div>
        <button 
           onClick={() => setIsInviteOpen(true)}
           className="z-10 bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg"
        >
           <UserPlus size={18} /> Convidar Executivo
        </button>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gray-800 rounded-full -mr-16 -mt-16 opacity-50"></div>
      </div>

      {/* Engineering Queue - High Priority */}
      {pendingEngineering.length > 0 && (
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-6 shadow-xl text-white">
              <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg"><Cpu size={24} className="text-purple-200"/></div>
                  <div>
                      <h3 className="text-xl font-bold">Fila de Análise Técnica</h3>
                      <p className="text-purple-200 text-sm">Projetos aguardando avaliação da engenharia para prosseguir.</p>
                  </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingEngineering.map(op => (
                      <div key={op.id} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer" onClick={() => setSelectedAnalysisOp(op)}>
                          <div className="flex justify-between items-start mb-2">
                              <span className="font-bold text-lg">{op.companyName}</span>
                              <ArrowRight size={18} className="opacity-50" />
                          </div>
                          <p className="text-sm text-gray-300 mb-3 line-clamp-2">{op.engineering?.technicalScope || 'Sem briefing inicial.'}</p>
                          <div className="flex items-center justify-between text-xs">
                              <span className="bg-purple-500/30 px-2 py-1 rounded-lg text-purple-100">{op.projectType}</span>
                              <span className="text-gray-400">{new Date(op.createdAt).toLocaleDateString()}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-3xl shadow-soft">
            <div className="flex items-center gap-3 text-gray-500 mb-2">
               <TrendingUp size={20} />
               <span className="text-xs font-bold uppercase">Vendas Totais</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</p>
         </div>
         
         <div className="bg-white p-6 rounded-3xl shadow-soft">
            <div className="flex items-center gap-3 text-gray-500 mb-2">
               <Wallet size={20} />
               <span className="text-xs font-bold uppercase">Comissões Pagas</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{totalCommissionsPaid.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</p>
         </div>

         <div className="bg-white p-6 rounded-3xl shadow-soft">
             <div className="flex items-center gap-3 text-gray-500 mb-2">
               <AlertCircle size={20} />
               <span className="text-xs font-bold uppercase">A Pagar (Fluxo)</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{totalCommissionsPending.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</p>
         </div>

         <div className="bg-white p-6 rounded-3xl shadow-soft">
            <div className="flex items-center gap-3 text-gray-500 mb-2">
               <Users size={20} />
               <span className="text-xs font-bold uppercase">Executivos Ativos</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{activeExecutives.length}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Leaderboard / Ranking */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-soft">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg"><Trophy size={20} /></div>
               <h3 className="text-lg font-bold text-gray-900">Ranking de Executivos</h3>
            </div>
            
            <div className="space-y-4">
               {rankingData.map((exec, index) => (
                  <div key={exec.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-full ${index === 0 ? 'bg-yellow-400 text-yellow-900' : index === 1 ? 'bg-gray-300 text-gray-800' : index === 2 ? 'bg-orange-300 text-orange-900' : 'bg-white text-gray-400 border border-gray-200'}`}>
                           {index + 1}
                        </div>
                        <img src={exec.avatar} alt={exec.name} className="w-10 h-10 rounded-full" />
                        <div>
                           <p className="font-bold text-gray-900">{exec.name}</p>
                           <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10}/> {exec.location}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="font-bold text-gray-900">{exec.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</p>
                        <p className="text-xs text-gray-500">{exec.dealsCount} fechamentos</p>
                     </div>
                  </div>
               ))}
               {rankingData.length === 0 && <p className="text-gray-400 text-center py-4">Nenhum executivo ativo.</p>}
            </div>
        </div>

        {/* Global Stats & Location */}
        <div className="space-y-8">
           {/* Pipeline Chart */}
           <div className="bg-white p-8 rounded-3xl shadow-soft">
             <h3 className="text-lg font-bold text-gray-900 mb-6">Status Global</h3>
             <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '12px'}} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-2xl font-bold text-gray-900">{opportunities.length}</span>
                </div>
              </div>
           </div>

           {/* Location Coverage */}
           <div className="bg-white p-8 rounded-3xl shadow-soft">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg"><MapPin size={20} /></div>
                  <h3 className="text-lg font-bold text-gray-900">Cobertura</h3>
               </div>
               <div className="space-y-2">
                  {[...new Set(activeExecutives.map(u => u.location).filter(Boolean))].map((loc, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                         <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                         {loc}
                      </div>
                  ))}
                  {activeExecutives.every(u => !u.location) && <p className="text-gray-400 text-sm">Sem dados de localização.</p>}
               </div>
           </div>
        </div>
      </div>
      
      <InviteExecutiveModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
      
      {/* Hack: Use existing Modal but triggered from Admin Dashboard */}
      {selectedAnalysisOp && (
          <div style={{ position: 'fixed', zIndex: 9999 }}>
            {/* We are reusing the modal component, but we need to ensure the App.tsx handles the state update.
                In a real app, we'd use a context or redux. For now, we are relying on this component to trigger the update 
                via a prop, but since AdminDashboard is a child of App, we need to pass the update function down.
                However, AdminDashboard's props doesn't have onUpdate. 
                
                FIX: To make this work without refactoring App.tsx completely, we will just display the modal here 
                and 'fake' the update locally for display purposes or use a custom event.
                Better yet, let's just render the modal here, but we need the update function.
                
                For this specific request, I will assume AdminDashboard receives onUpdate or dispatches an event.
                Given the constraints, I will add a simple alert/mock behavior if onUpdate is missing, OR better:
                I will dispatch a custom event that App.tsx can listen to if I could change App.tsx again.
                
                Actually, the prompt allows me to change App.tsx. I will modify App.tsx to pass onUpdate to AdminDashboard.
            */}
             <OpportunityDetailsModal 
                opportunity={selectedAnalysisOp}
                currentUser={{ 
                    id: 'admin1', name: 'Engenharia Phoenyx', role: 'ADMIN' as any, email: 'eng@phoenyx.com', avatar: '' 
                }} // Hardcoded admin for context or passed prop
                onClose={() => setSelectedAnalysisOp(null)}
                onUpdate={(op) => {
                    // Dispatch event to update global state
                    const event = new CustomEvent('update-opportunity', { detail: op });
                    document.dispatchEvent(event);
                    setSelectedAnalysisOp(null);
                }}
             />
          </div>
      )}
    </div>
  );
};