import React from 'react';
import { Opportunity, CommissionRecord, User, UserRole, CommissionStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Wallet, TrendingUp, CheckCircle, Clock, ArrowRight } from 'lucide-react';

interface DashboardProps {
  opportunities: Opportunity[];
  commissions: CommissionRecord[];
  user: User;
}

const COLORS = ['#0f172a', '#334155', '#94a3b8', '#cbd5e1']; // Black/Gray shades

export const Dashboard: React.FC<DashboardProps> = ({ opportunities, commissions, user }) => {

  const totalPipelineValue = opportunities.reduce((acc, curr) => acc + curr.estimatedValue, 0);
  const availableCommission = commissions
    .filter(c => c.status === CommissionStatus.AVAILABLE || c.status === CommissionStatus.PAID)
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Data for Charts
  const statusCounts = opportunities.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(statusCounts).map(key => ({
    name: key,
    value: statusCounts[key]
  }));

  const commissionByType = [
    { name: 'Fechamento', amount: commissions.filter(c => c.type === 'CLOSING').reduce((a, b) => a + b.amount, 0) },
    { name: 'Pós-Venda', amount: commissions.filter(c => c.type === 'SUCCESS_FEE').reduce((a, b) => a + b.amount, 0) },
  ];

  const isStaff = user.role === UserRole.STAFF;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Section */}
      <div className="bg-white rounded-3xl p-8 shadow-soft flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
        <div className="z-10 max-w-lg">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Olá, {user.name.split(' ')[0]}!</h1>
          <p className="text-gray-500 text-lg mb-6">É bom ver você de novo. {isStaff ? 'Seus projetos estão ativos.' : 'Seu pipeline está ativo hoje.'}</p>
          
          {!isStaff && (
              <div className="flex items-center gap-4">
                 <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3 border border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                       🔥
                    </div>
                    <div>
                       <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Ticket Médio</p>
                       <p className="text-lg font-bold text-gray-900">R$ 15k</p>
                    </div>
                 </div>
                 <button className="bg-gray-900 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-black transition-colors flex items-center gap-2">
                   Ver Relatórios <ArrowRight size={18} />
                 </button>
              </div>
          )}
        </div>
        
        {/* Abstract Illustration Placeholder */}
        <div className="hidden md:block w-64 h-64 bg-gray-50 rounded-full absolute -right-12 -bottom-12 z-0 border-[20px] border-gray-100"></div>
        <div className="hidden md:block z-10">
           {/* You could place a real svg illustration here */}
           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&style=circle`} alt="Avatar" className="w-48 h-48 drop-shadow-xl" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Stats */}
        <div className="lg:col-span-2 space-y-8">
           <h3 className="text-xl font-bold text-gray-900">Suas Estatísticas</h3>
           
           {!isStaff ? (
               <>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Stat Card 1 */}
                      <div className="bg-white p-6 rounded-3xl shadow-soft flex flex-col justify-between h-40 group hover:shadow-lg transition-all">
                         <div className="flex justify-between items-start">
                            <div className="p-3 bg-gray-50 rounded-2xl text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                               <TrendingUp size={24} />
                            </div>
                            <span className="text-green-500 font-bold text-sm bg-green-50 px-2 py-1 rounded-lg">+12%</span>
                         </div>
                         <div>
                            <p className="text-3xl font-bold text-gray-900">{totalPipelineValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</p>
                            <p className="text-sm text-gray-400 font-medium">Pipeline Total</p>
                         </div>
                      </div>

                      {/* Stat Card 2 */}
                      <div className="bg-white p-6 rounded-3xl shadow-soft flex flex-col justify-between h-40 group hover:shadow-lg transition-all">
                         <div className="flex justify-between items-start">
                            <div className="p-3 bg-gray-50 rounded-2xl text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                               <Wallet size={24} />
                            </div>
                         </div>
                         <div>
                            <p className="text-3xl font-bold text-gray-900">{availableCommission.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</p>
                            <p className="text-sm text-gray-400 font-medium">Comissão Disponível</p>
                         </div>
                      </div>
                   </div>

                   {/* Chart Section */}
                   <div className="bg-white p-8 rounded-3xl shadow-soft">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Projeção de Ganhos</h3>
                        <select className="bg-gray-50 border-none text-xs font-semibold text-gray-500 rounded-lg px-3 py-1">
                           <option>Mensal</option>
                           <option>Semanal</option>
                        </select>
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={commissionByType} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={60}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <Tooltip 
                              cursor={{fill: '#f8fafc'}}
                              contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} 
                            />
                            <Bar dataKey="amount" fill="#0f172a" radius={[12, 12, 12, 12]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                   </div>
               </>
           ) : (
               <div className="bg-white p-8 rounded-3xl shadow-soft">
                    <p className="text-gray-500">
                        Como Engenheiro de Software, você tem acesso à lista de projetos, agenda técnica e registro de horas (Timesheet). 
                        Navegue pelo menu lateral para acessar suas ferramentas.
                    </p>
               </div>
           )}
        </div>

        {/* Right Column - Status & Activity */}
        <div className="space-y-8">
           <h3 className="text-xl font-bold text-gray-900">Status dos Projetos</h3>
           
           <div className="bg-white p-6 rounded-3xl shadow-soft h-full min-h-[400px]">
              <h4 className="font-semibold text-gray-800 mb-6">Distribuição</h4>
              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
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
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-3xl font-bold text-gray-900">{opportunities.length}</span>
                   <span className="text-xs text-gray-400 uppercase font-bold">Total</span>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-sm font-medium text-gray-600">{entry.name}</span>
                     </div>
                     <span className="text-sm font-bold text-gray-900">{entry.value}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};