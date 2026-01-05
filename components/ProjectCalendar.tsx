import React, { useState } from 'react';
import { Opportunity, User, UserRole, ProjectEvent } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Flag, Video, Clock } from 'lucide-react';

interface ProjectCalendarProps {
  opportunities: Opportunity[];
  currentUser: User;
}

export const ProjectCalendar: React.FC<ProjectCalendarProps> = ({ opportunities, currentUser }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filter events based on permissions
  const relevantOpportunities = currentUser.role === UserRole.ADMIN 
    ? opportunities 
    : opportunities.filter(op => op.executiveId === currentUser.id);

  // Flatten events into a single array with context
  const allEvents = relevantOpportunities.flatMap(op => 
    (op.engineering?.schedule || []).map(evt => ({
      ...evt,
      companyName: op.companyName,
      opportunityId: op.id
    }))
  );

  // Calendar Logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sunday

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const renderCells = () => {
    const cells = [];
    const totalSlots = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;

    for (let i = 0; i < totalSlots; i++) {
      const dayNumber = i - firstDayOfMonth + 1;
      const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
      
      const cellDateStr = isCurrentMonth 
        ? new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber).toISOString().split('T')[0]
        : '';

      const dayEvents = isCurrentMonth 
        ? allEvents.filter(e => e.date.startsWith(cellDateStr))
        : [];

      cells.push(
        <div 
          key={i} 
          className={`min-h-[120px] bg-white border border-gray-100 p-2 flex flex-col gap-1 transition-colors ${
             !isCurrentMonth ? 'bg-gray-50/50 text-gray-300' : 'hover:bg-gray-50'
          }`}
        >
          {isCurrentMonth && (
            <>
               <span className={`text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                   cellDateStr === new Date().toISOString().split('T')[0] ? 'bg-gray-900 text-white' : 'text-gray-700'
               }`}>
                 {dayNumber}
               </span>
               
               <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[100px] hide-scrollbar">
                  {dayEvents.map((evt, idx) => (
                      <div 
                        key={idx} 
                        className={`text-[10px] p-1.5 rounded-lg border leading-tight ${
                            evt.type === 'MEETING' 
                            ? 'bg-blue-50 border-blue-100 text-blue-800' 
                            : 'bg-green-50 border-green-100 text-green-800'
                        }`}
                      >
                         <div className="flex items-center gap-1 font-bold mb-0.5">
                            {evt.type === 'MEETING' ? <Video size={10} /> : <Flag size={10} />}
                            {evt.date.split('T')[1] || 'Dia todo'}
                         </div>
                         <div className="font-semibold truncate" title={evt.title}>{evt.title}</div>
                         <div className="opacity-70 truncate">{evt.companyName}</div>
                      </div>
                  ))}
               </div>
            </>
          )}
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Agenda de Projetos</h2>
           <p className="text-gray-500 mt-1">Acompanhe reuniões e entregas planejadas pela engenharia.</p>
        </div>
        
        <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-100 p-1">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
               <ChevronLeft size={20} />
            </button>
            <div className="px-6 font-bold text-gray-900 min-w-[160px] text-center">
               {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
               <ChevronRight size={20} />
            </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
         {/* Week Days Header */}
         <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
            {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map(day => (
               <div key={day} className="py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <span className="hidden md:inline">{day}</span>
                  <span className="md:hidden">{day.substr(0, 3)}</span>
               </div>
            ))}
         </div>
         
         {/* Calendar Grid */}
         <div className="grid grid-cols-7">
            {renderCells()}
         </div>
      </div>

      <div className="flex gap-4 items-center text-xs font-bold text-gray-500">
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></div> Reuniões
         </div>
         <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div> Entregáveis (Milestones)
         </div>
      </div>
    </div>
  );
};