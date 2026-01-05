import React, { useState } from 'react';
import { TimesheetEntry, Opportunity, User, UserRole } from '../types';
import { Clock, Plus, Trash2, Calendar, FileText } from 'lucide-react';

interface TimesheetProps {
  entries: TimesheetEntry[];
  opportunities: Opportunity[];
  currentUser: User;
  onAddEntry: (entry: TimesheetEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export const Timesheet: React.FC<TimesheetProps> = ({ entries, opportunities, currentUser, onAddEntry, onDeleteEntry }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [opportunityId, setOpportunityId] = useState('');
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');

  // Admins see all entries, Staff sees only theirs
  const visibleEntries = currentUser.role === UserRole.ADMIN 
    ? entries 
    : entries.filter(e => e.userId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!opportunityId || !hours || !description) return;

    const newEntry: TimesheetEntry = {
        id: Math.random().toString(36).substr(2, 9),
        userId: currentUser.id,
        opportunityId,
        date,
        hours: parseFloat(hours),
        description
    };

    onAddEntry(newEntry);
    setHours('');
    setDescription('');
  };

  const activeProjects = opportunities.filter(op => 
      op.status === 'Em Desenvolvimento' || 
      op.status === 'Contrato Assinado' ||
      op.status === 'Entregue'
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12">
       <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Timesheet</h2>
          <p className="text-gray-500 mt-1">Registro de horas trabalhadas em projetos.</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Entry Form */}
           <div className="bg-white p-6 rounded-3xl shadow-soft h-fit">
               <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                   <Clock size={20} className="text-brand-500" /> Registrar Horas
               </h3>
               <form onSubmit={handleSubmit} className="space-y-4">
                   <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">Data</label>
                       <input 
                         type="date"
                         required
                         className="w-full bg-gray-50 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                         value={date}
                         onChange={e => setDate(e.target.value)}
                       />
                   </div>
                   <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">Projeto</label>
                       <select 
                         required
                         className="w-full bg-gray-50 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                         value={opportunityId}
                         onChange={e => setOpportunityId(e.target.value)}
                       >
                           <option value="">Selecione um projeto...</option>
                           {activeProjects.map(op => (
                               <option key={op.id} value={op.id}>{op.companyName} ({op.projectType})</option>
                           ))}
                       </select>
                   </div>
                   <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">Horas</label>
                       <input 
                         type="number"
                         step="0.5"
                         min="0.5"
                         required
                         className="w-full bg-gray-50 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                         placeholder="Ex: 4.5"
                         value={hours}
                         onChange={e => setHours(e.target.value)}
                       />
                   </div>
                   <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">Descrição</label>
                       <textarea 
                         required
                         className="w-full bg-gray-50 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-brand-500 h-24 resize-none"
                         placeholder="O que foi feito?"
                         value={description}
                         onChange={e => setDescription(e.target.value)}
                       />
                   </div>
                   <button className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2">
                       <Plus size={18} /> Adicionar Registro
                   </button>
               </form>
           </div>

           {/* List */}
           <div className="lg:col-span-2 space-y-4">
               {visibleEntries.length === 0 ? (
                   <div className="text-center py-12 text-gray-400 bg-white rounded-3xl shadow-soft">
                       Nenhum registro encontrado.
                   </div>
               ) : (
                   visibleEntries.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => {
                       const project = opportunities.find(o => o.id === entry.opportunityId);
                       return (
                           <div key={entry.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between group hover:shadow-md transition-all">
                               <div className="flex gap-4">
                                   <div className="w-12 h-12 bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-900 font-bold leading-tight">
                                       <span className="text-xs text-gray-400">{new Date(entry.date).toLocaleString('default', { month: 'short' })}</span>
                                       <span className="text-lg">{new Date(entry.date).getDate()}</span>
                                   </div>
                                   <div>
                                       <h4 className="font-bold text-gray-900">{project?.companyName || 'Projeto Desconhecido'}</h4>
                                       <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                                   </div>
                               </div>
                               <div className="flex flex-col items-end gap-2">
                                   <span className="bg-brand-100 text-brand-800 font-bold px-3 py-1 rounded-lg text-sm">
                                       {entry.hours}h
                                   </span>
                                   <button 
                                     onClick={() => onDeleteEntry(entry.id)}
                                     className="text-gray-300 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                   >
                                       <Trash2 size={16} />
                                   </button>
                               </div>
                           </div>
                       );
                   })
               )}
           </div>
       </div>
    </div>
  );
};