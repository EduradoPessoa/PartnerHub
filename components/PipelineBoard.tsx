import React from 'react';
import { Opportunity, OpportunityStatus, OpportunityTemperature } from '../types';
import { Flame, Thermometer, Snowflake, MoreHorizontal, User } from 'lucide-react';

interface PipelineBoardProps {
  opportunities: Opportunity[];
  onSelectOpportunity: (op: Opportunity) => void;
}

const STATUS_COLUMNS = [
  OpportunityStatus.PROSPECTING,
  OpportunityStatus.TECHNICAL_ANALYSIS,
  OpportunityStatus.PROPOSAL_SENT,
  OpportunityStatus.CONTRACT_SIGNED,
  OpportunityStatus.IN_DEVELOPMENT
];

export const PipelineBoard: React.FC<PipelineBoardProps> = ({ opportunities, onSelectOpportunity }) => {
  
  const getTemperatureIcon = (temp: OpportunityTemperature) => {
    switch(temp) {
      case 'HOT': return <Flame size={14} className="text-red-500 fill-red-500" />;
      case 'WARM': return <Thermometer size={14} className="text-orange-500" />;
      case 'COLD': return <Snowflake size={14} className="text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar h-[calc(100vh-200px)]">
      {STATUS_COLUMNS.map(status => {
        const items = opportunities.filter(op => op.status === status);
        
        return (
          <div key={status} className="min-w-[320px] w-[320px] flex flex-col">
            <div className="flex items-center justify-between mb-4 px-2">
              <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-900"></span>
                {status}
              </h4>
              <span className="text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded-lg">
                {items.length}
              </span>
            </div>

            <div className="flex-1 space-y-4">
              {items.length === 0 ? (
                <div className="h-24 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center text-gray-300 text-sm font-medium">
                  Vazio
                </div>
              ) : (
                items.map(op => (
                  <div 
                    key={op.id}
                    onClick={() => onSelectOpportunity(op)}
                    className="bg-white p-5 rounded-3xl shadow-sm hover:shadow-lg transition-all cursor-pointer group border border-transparent hover:border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className={`px-2 py-1 rounded-md bg-gray-50 flex items-center gap-1 border border-gray-100`}>
                         {getTemperatureIcon(op.temperature)}
                         <span className="text-[10px] font-bold text-gray-500">{op.temperature}</span>
                      </div>
                      <button className="text-gray-300 hover:text-gray-600">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>

                    <h5 className="font-bold text-gray-900 mb-1 leading-tight">{op.companyName}</h5>
                    <p className="text-xs text-gray-500 mb-4">{op.projectType}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 text-xs font-bold">
                           <User size={10} />
                         </div>
                         <span className="text-xs text-gray-400 truncate max-w-[80px]">{op.contactName.split(' ')[0]}</span>
                      </div>
                      <span className="font-bold text-sm text-gray-900">
                        {op.estimatedValue.toLocaleString('pt-BR', { notation: 'compact', style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
