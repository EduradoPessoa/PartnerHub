import React, { useState } from 'react';
import { Opportunity, OpportunityStatus, User, UserRole } from '../types';
import { Search, Briefcase, Edit2, Trash2, ArrowRight, Eye } from 'lucide-react';
import { OpportunityDetailsModal } from './OpportunityDetailsModal';

interface OpportunityListProps {
  opportunities: Opportunity[];
  onSelectOpportunity: (op: Opportunity) => void;
  onEdit: (op: Opportunity) => void;
  onDelete: (id: string) => void;
  currentUser: User;
  onUpdate: (op: Opportunity) => void;
}

export const OpportunityList: React.FC<OpportunityListProps> = ({ opportunities, onSelectOpportunity, onEdit, onDelete, currentUser, onUpdate }) => {
  const [filter, setFilter] = useState('');
  const [viewingOpportunity, setViewingOpportunity] = useState<Opportunity | null>(null);

  const filtered = opportunities.filter(op => 
    op.companyName.toLowerCase().includes(filter.toLowerCase()) || 
    op.contactName.toLowerCase().includes(filter.toLowerCase())
  );

  const getStatusStyle = (status: OpportunityStatus) => {
    switch(status) {
      case OpportunityStatus.PROSPECTING: return 'bg-gray-100 text-gray-600';
      case OpportunityStatus.CONTRACT_SIGNED: return 'bg-blue-50 text-blue-700';
      case OpportunityStatus.DELIVERED: return 'bg-green-50 text-green-700';
      case OpportunityStatus.CLOSED_LOST: return 'bg-red-50 text-red-700';
      default: return 'bg-orange-50 text-orange-700';
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, op: Opportunity) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja excluir a oportunidade de ${op.companyName}?`)) {
      onDelete(op.id);
    }
  };

  const handleEditClick = (e: React.MouseEvent, op: Opportunity) => {
    e.stopPropagation();
    onEdit(op);
  };
  
  const handleViewClick = (e: React.MouseEvent, op: Opportunity) => {
      e.stopPropagation();
      setViewingOpportunity(op);
  };

  const isStaff = currentUser.role === UserRole.STAFF;

  return (
    <>
      <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <h3 className="text-xl font-bold text-gray-900">Todas as Oportunidades</h3>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar..."
              className="pl-12 pr-6 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-200 w-full sm:w-72 transition-all"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white text-gray-400 font-semibold text-xs uppercase tracking-wider border-b border-gray-50">
              <tr>
                <th className="px-8 py-6">Projeto / Empresa</th>
                {!isStaff && <th className="px-6 py-6">Valor</th>}
                <th className="px-6 py-6">Status</th>
                <th className="px-6 py-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                 <tr>
                  <td colSpan={isStaff ? 3 : 4} className="px-8 py-12 text-center text-gray-400">
                    <Briefcase className="mx-auto mb-3 opacity-20" size={48} />
                    Nenhuma oportunidade encontrada.
                  </td>
                </tr>
              ) : (
                filtered.map(op => (
                  <tr key={op.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-lg">
                          {op.companyName.charAt(0)}
                        </div>
                        <div>
                           <div className="font-bold text-gray-900 text-base">{op.companyName}</div>
                           <div className="text-xs text-gray-400 mt-0.5">{op.projectType} • {op.contactName}</div>
                        </div>
                      </div>
                    </td>
                    {!isStaff && (
                        <td className="px-6 py-6">
                          <div className="font-bold text-gray-900">
                            {op.estimatedValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </div>
                        </td>
                    )}
                    <td className="px-6 py-6">
                      <span className={`px-4 py-2 rounded-full text-xs font-bold ${getStatusStyle(op.status)}`}>
                        {op.status}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={(e) => handleViewClick(e, op)}
                          title="Ver Detalhes"
                          className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors flex items-center gap-2"
                        >
                          Ver <ArrowRight size={14} />
                        </button>
                        {!isStaff && (
                            <button 
                              onClick={(e) => handleEditClick(e, op)}
                              title="Editar"
                              className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                        )}
                        {!isStaff && (
                            <button 
                              onClick={(e) => handleDeleteClick(e, op)}
                              title="Excluir"
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OpportunityDetailsModal 
        opportunity={viewingOpportunity} 
        onClose={() => setViewingOpportunity(null)} 
        currentUser={currentUser}
        onUpdate={onUpdate}
      />
    </>
  );
};