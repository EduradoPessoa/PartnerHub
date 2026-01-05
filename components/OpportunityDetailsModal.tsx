import React, { useState, useRef, useEffect } from 'react';
import { Opportunity, OpportunityStatus, User, UserRole, ProjectFile, FileType, InteractionLog, ProjectEvent, EventType } from '../types';
import { X, Calendar, User as UserIcon, Building, DollarSign, FileText, Mail, ShieldCheck, AlertTriangle, CheckCircle, Flame, Snowflake, Thermometer, Upload, File, Eye, EyeOff, FolderOpen, Clock, MessageSquare, Send, Calendar as CalendarIcon, Plus, Trash2, Rocket, Info } from 'lucide-react';

interface OpportunityDetailsModalProps {
  opportunity: Opportunity | null;
  currentUser: User;
  onClose: () => void;
  onUpdate: (updatedOp: Opportunity) => void;
}

export const OpportunityDetailsModal: React.FC<OpportunityDetailsModalProps> = ({ opportunity, currentUser, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ENGINEERING' | 'PROJECT'>('OVERVIEW');
  const [techScope, setTechScope] = useState(opportunity?.engineering?.technicalScope || '');
  const [complexity, setComplexity] = useState<'BAIXA' | 'MEDIA' | 'ALTA'>(opportunity?.engineering?.complexity || 'MEDIA');
  const [estimatedHours, setEstimatedHours] = useState(opportunity?.engineering?.estimatedHours || 0);
  const [riskAnalysis, setRiskAnalysis] = useState(opportunity?.engineering?.riskAnalysis || '');
  const [newMessage, setNewMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);
  
  // Schedule States
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventType, setNewEventType] = useState<EventType>('MEETING');

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if(opportunity) {
          setTechScope(opportunity.engineering?.technicalScope || '');
          setComplexity(opportunity.engineering?.complexity || 'MEDIA');
          setEstimatedHours(opportunity.engineering?.estimatedHours || 0);
          setRiskAnalysis(opportunity.engineering?.riskAnalysis || '');
      }
  }, [opportunity]);

  useEffect(() => {
      if (activeTab === 'ENGINEERING') {
          chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
  }, [activeTab, opportunity?.engineering?.interactions]);
  
  if (!opportunity) return null;

  const isAdmin = currentUser.role === UserRole.ADMIN;
  const isStaff = currentUser.role === UserRole.STAFF;
  const canEditEngineering = isAdmin || isStaff;

  // --- Logic for Engineering Tab ---
  const handleEngineeringAction = (status: 'APPROVED' | 'REJECTED') => {
    // Requires comment if rejected
    if (status === 'REJECTED' && !newMessage) {
        alert("Por favor, adicione um comentário explicando a reprovação no chat abaixo.");
        return;
    }

    const newLog = newMessage ? createLog(newMessage) : [];
    const allInteractions = [...(opportunity.engineering?.interactions || []), ...newLog];

    const updatedOp: Opportunity = {
      ...opportunity,
      status: status === 'APPROVED' ? OpportunityStatus.PROPOSAL_SENT : OpportunityStatus.TECHNICAL_ANALYSIS,
      engineering: {
        ...opportunity.engineering,
        technicalScope: techScope,
        approvalStatus: status,
        approvedBy: currentUser.id,
        complexity,
        estimatedHours,
        riskAnalysis,
        interactions: allInteractions
      } as any
    };
    onUpdate(updatedOp);
    setNewMessage('');
    alert(status === 'APPROVED' ? 'Projeto Aprovado! Status atualizado para Proposta Enviada.' : 'Solicitação de revisão enviada.');
  };

  const handleDeploy = () => {
      if(!window.confirm("Confirmar a entrega final e deploy em produção? Isso irá sinalizar a conclusão do projeto.")) return;
      
      const logs = createLog("🚀 PROJETO ENTREGUE: Deploy realizado em produção com sucesso.");
      const updatedOp: Opportunity = {
          ...opportunity,
          status: OpportunityStatus.DELIVERED,
          engineering: {
              ...opportunity.engineering!,
              interactions: [...(opportunity.engineering?.interactions || []), ...logs]
          }
      };
      onUpdate(updatedOp);
  };

  const handleSaveAssessment = () => {
    const updatedOp: Opportunity = {
      ...opportunity,
      engineering: {
        ...(opportunity.engineering || { approvalStatus: 'PENDING', interactions: [] }),
        technicalScope: techScope,
        complexity,
        estimatedHours,
        riskAnalysis
      }
    };
    onUpdate(updatedOp);
    alert('Avaliação técnica salva!');
  };

  const handleSendMessage = () => {
      if(!newMessage.trim()) return;
      const logs = createLog(newMessage);
      const updatedOp = {
          ...opportunity,
          engineering: {
              ...opportunity.engineering,
              interactions: [...(opportunity.engineering?.interactions || []), ...logs]
          }
      } as Opportunity;
      onUpdate(updatedOp);
      setNewMessage('');
  };

  const createLog = (msg: string): InteractionLog[] => {
      return [{
          id: Math.random().toString(36).substr(2, 9),
          authorName: currentUser.name,
          role: currentUser.role,
          message: msg,
          createdAt: new Date().toISOString()
      }];
  }

  // --- Logic for Scheduling ---
  const handleAddEvent = () => {
      if (!newEventTitle || !newEventDate) return;
      
      const newEvent: ProjectEvent = {
          id: Math.random().toString(36).substr(2, 9),
          title: newEventTitle,
          date: newEventDate,
          type: newEventType
      };

      const currentSchedule = opportunity.engineering?.schedule || [];
      const updatedOp: Opportunity = {
          ...opportunity,
          engineering: {
              ...opportunity.engineering!,
              schedule: [...currentSchedule, newEvent]
          }
      };

      onUpdate(updatedOp);
      setNewEventTitle('');
      setNewEventDate('');
  };

  const handleDeleteEvent = (eventId: string) => {
      const currentSchedule = opportunity.engineering?.schedule || [];
      const updatedOp: Opportunity = {
          ...opportunity,
          engineering: {
              ...opportunity.engineering!,
              schedule: currentSchedule.filter(e => e.id !== eventId)
          }
      };
      onUpdate(updatedOp);
  }

  // --- Logic for Project/Files Tab ---
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    // Simulate upload
    const newFile: ProjectFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: '#',
      type: 'OTHER', // Default
      uploadedBy: currentUser.name,
      uploadedAt: new Date().toISOString().split('T')[0],
      isClientVisible: false,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
    };

    const updatedOp = {
      ...opportunity,
      files: [newFile, ...(opportunity.files || [])]
    };
    onUpdate(updatedOp);
  };

  const toggleFileVisibility = (fileId: string) => {
    const updatedFiles = opportunity.files?.map(f => 
      f.id === fileId ? { ...f, isClientVisible: !f.isClientVisible } : f
    );
    onUpdate({ ...opportunity, files: updatedFiles });
  };

  const deleteFile = (fileId: string) => {
      if(window.confirm("Remover este arquivo?")) {
          const updatedFiles = opportunity.files?.filter(f => f.id !== fileId);
          onUpdate({ ...opportunity, files: updatedFiles });
      }
  }

  // --- Helpers ---
  const getTemperatureIcon = () => {
    switch(opportunity.temperature) {
      case 'HOT': return <Flame className="text-red-500" />;
      case 'WARM': return <Thermometer className="text-orange-500" />;
      case 'COLD': return <Snowflake className="text-blue-500" />;
      default: return null;
    }
  };

  const getFileIcon = (type: FileType) => {
      switch(type) {
          case 'CONTRACT': return <FileText className="text-blue-600" />;
          case 'TECH_SPEC': return <ShieldCheck className="text-purple-600" />;
          default: return <File className="text-gray-400" />;
      }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-start bg-white">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <h3 className="text-2xl font-bold text-gray-900">{opportunity.companyName}</h3>
               {!isStaff && (
                   <div className="bg-gray-100 p-1.5 rounded-full" title={`Temperatura: ${opportunity.temperature}`}>
                     {getTemperatureIcon()}
                   </div>
               )}
               <span className={`px-3 py-1 rounded-full text-xs font-bold ml-2 ${opportunity.status === OpportunityStatus.TECHNICAL_ANALYSIS ? 'bg-purple-100 text-purple-700' : 'bg-gray-900 text-white'}`}>
                 {opportunity.status}
               </span>
            </div>
            <p className="text-sm text-gray-500">{opportunity.cnpj} • {opportunity.projectType}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-8 bg-gray-50/50">
          <button 
            onClick={() => setActiveTab('OVERVIEW')}
            className={`py-4 mr-6 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'OVERVIEW' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            Visão Geral
          </button>
          <button 
            onClick={() => setActiveTab('ENGINEERING')}
            className={`py-4 mr-6 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'ENGINEERING' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            Engenharia e Projetos
            {opportunity.engineering?.approvalStatus === 'APPROVED' && <CheckCircle size={14} className="text-green-500" />}
            {opportunity.engineering?.approvalStatus === 'PENDING' && <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('PROJECT')}
            disabled={opportunity.status === OpportunityStatus.PROSPECTING}
            className={`py-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                opportunity.status === OpportunityStatus.PROSPECTING ? 'opacity-50 cursor-not-allowed border-transparent text-gray-400' : 
                activeTab === 'PROJECT' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Arquivos
            <FolderOpen size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto bg-[#f8fafc] flex-1">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {!isStaff && (
                    <div className="bg-white p-5 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <DollarSign size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Valor Estimado</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        {opportunity.estimatedValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                )}
                <div className="bg-white p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Calendar size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Criado em</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {new Date(opportunity.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Informações de Contato</h4>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                    <UserIcon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{opportunity.contactName}</p>
                    <a href={`mailto:${opportunity.contactEmail}`} className="text-xs text-blue-600 hover:underline">
                        {opportunity.contactEmail}
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Anotações Comerciais</h4>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {opportunity.notes || "Nenhuma observação registrada."}
                </p>
              </div>
            </div>
          )}

          {/* TAB: ENGINEERING (Updated) */}
          {activeTab === 'ENGINEERING' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
               {/* Left: Assessment Form */}
               <div className="space-y-6 overflow-y-auto pr-2">
                  <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                    opportunity.engineering?.approvalStatus === 'APPROVED' ? 'bg-green-50 border-green-100' :
                    opportunity.engineering?.approvalStatus === 'REJECTED' ? 'bg-red-50 border-red-100' :
                    'bg-yellow-50 border-yellow-100'
                  }`}>
                    {opportunity.engineering?.approvalStatus === 'APPROVED' ? <CheckCircle className="text-green-600 shrink-0" /> :
                     opportunity.engineering?.approvalStatus === 'REJECTED' ? <AlertTriangle className="text-red-600 shrink-0" /> :
                     <ShieldCheck className="text-yellow-600 shrink-0" />
                    }
                    <div>
                      <h4 className={`font-bold ${
                         opportunity.engineering?.approvalStatus === 'APPROVED' ? 'text-green-800' :
                         opportunity.engineering?.approvalStatus === 'REJECTED' ? 'text-red-800' :
                         'text-yellow-800'
                      }`}>
                        {opportunity.engineering?.approvalStatus === 'APPROVED' ? 'Aprovado' :
                         opportunity.engineering?.approvalStatus === 'REJECTED' ? 'Reprovado / Revisão' :
                         'Aguardando Avaliação'}
                      </h4>
                      <p className="text-xs mt-1 opacity-80">
                         Análise técnica obrigatória para avançar.
                      </p>
                    </div>
                  </div>

                  {/* Technical Briefing */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
                     <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <FileText size={16} /> Briefing / Escopo Técnico
                     </h4>
                     <textarea 
                        className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm min-h-[120px] focus:ring-2 focus:ring-gray-900 outline-none"
                        placeholder="Descreva a arquitetura..."
                        value={techScope}
                        onChange={(e) => setTechScope(e.target.value)}
                        readOnly={!canEditEngineering} 
                     />
                  </div>

                  {/* Engineering Evaluation */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
                      <h4 className="text-sm font-bold text-gray-900">Avaliação da Engenharia</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs font-bold text-gray-500 mb-1 block">Complexidade</label>
                              <select 
                                disabled={!canEditEngineering}
                                value={complexity}
                                onChange={e => setComplexity(e.target.value as any)}
                                className="w-full bg-gray-50 rounded-xl p-3 text-sm font-bold outline-none"
                              >
                                  <option value="BAIXA">🟢 Baixa</option>
                                  <option value="MEDIA">🟡 Média</option>
                                  <option value="ALTA">🔴 Alta</option>
                              </select>
                          </div>
                          <div>
                              <label className="text-xs font-bold text-gray-500 mb-1 block">Horas Estimadas</label>
                              <input 
                                disabled={!canEditEngineering}
                                type="number"
                                value={estimatedHours}
                                onChange={e => setEstimatedHours(parseInt(e.target.value))}
                                className="w-full bg-gray-50 rounded-xl p-3 text-sm font-bold outline-none"
                              />
                          </div>
                      </div>

                      <div>
                          <label className="text-xs font-bold text-gray-500 mb-1 block">Análise de Risco / Notas</label>
                          <textarea 
                            disabled={!canEditEngineering}
                            value={riskAnalysis}
                            onChange={e => setRiskAnalysis(e.target.value)}
                            className="w-full bg-gray-50 rounded-xl p-3 text-sm outline-none h-24 resize-none"
                            placeholder="Riscos de integração, prazos apertados, etc."
                          />
                      </div>
                      
                      {canEditEngineering && (
                         <div className="flex justify-end">
                            <button onClick={handleSaveAssessment} className="text-xs font-bold text-blue-600 hover:text-blue-800">
                                Salvar Rascunho
                            </button>
                         </div>
                      )}
                  </div>

                  {/* Scheduler Section - New */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
                     <div className="flex items-center justify-between">
                         <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                             <CalendarIcon size={16} /> Cronograma do Projeto
                         </h4>
                         {(isAdmin || isStaff) && <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded">Visível para Executivo</span>}
                     </div>

                     {/* Add Event Form (Admin & Staff) */}
                     {(isAdmin || isStaff) && (
                         <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                             <input 
                                className="w-full bg-white rounded-lg p-2 text-sm outline-none border border-transparent focus:border-blue-300"
                                placeholder="Título do evento (ex: Reunião de Kick-off)"
                                value={newEventTitle}
                                onChange={e => setNewEventTitle(e.target.value)}
                             />
                             <div className="flex gap-2">
                                <input 
                                   type="datetime-local"
                                   className="flex-1 bg-white rounded-lg p-2 text-sm outline-none border border-transparent focus:border-blue-300"
                                   value={newEventDate}
                                   onChange={e => setNewEventDate(e.target.value)}
                                />
                                <select 
                                   className="bg-white rounded-lg p-2 text-sm outline-none border border-transparent focus:border-blue-300"
                                   value={newEventType}
                                   onChange={e => setNewEventType(e.target.value as EventType)}
                                >
                                   <option value="MEETING">Reunião</option>
                                   <option value="DELIVERABLE">Entregável</option>
                                </select>
                                <button 
                                   onClick={handleAddEvent}
                                   className="p-2 bg-gray-900 text-white rounded-lg hover:bg-black"
                                   title="Adicionar Evento"
                                >
                                   <Plus size={16} />
                                </button>
                             </div>
                         </div>
                     )}

                     {/* Events List */}
                     <div className="space-y-2 max-h-[200px] overflow-y-auto">
                         {(!opportunity.engineering?.schedule || opportunity.engineering.schedule.length === 0) && (
                             <p className="text-gray-400 text-xs italic text-center py-2">Nenhum evento agendado.</p>
                         )}
                         {opportunity.engineering?.schedule?.map(evt => (
                             <div key={evt.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50">
                                 <div className="flex items-center gap-3">
                                     <div className={`w-2 h-8 rounded-full ${evt.type === 'MEETING' ? 'bg-blue-400' : 'bg-green-400'}`}></div>
                                     <div>
                                         <p className="text-sm font-bold text-gray-900">{evt.title}</p>
                                         <p className="text-xs text-gray-500">
                                            {new Date(evt.date).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })} • {evt.type === 'MEETING' ? 'Reunião' : 'Entrega'}
                                         </p>
                                     </div>
                                 </div>
                                 {(isAdmin || isStaff) && (
                                     <button onClick={() => handleDeleteEvent(evt.id)} className="text-gray-400 hover:text-red-500">
                                         <Trash2 size={14} />
                                     </button>
                                 )}
                             </div>
                         ))}
                     </div>
                  </div>
               </div>

               {/* Right: Interaction Feed & Actions */}
               <div className="flex flex-col h-full bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                   <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
                       <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                           <MessageSquare size={16} /> Chat da Engenharia
                       </h4>
                       <span className="text-[10px] text-gray-500 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                         <Info size={12}/> Comercial ↔ Staff
                       </span>
                   </div>
                   
                   <div className="flex-1 p-4 overflow-y-auto space-y-4">
                       {!opportunity.engineering?.interactions?.length && (
                           <div className="text-center text-gray-400 text-xs py-12 px-8 flex flex-col items-center gap-3">
                               <MessageSquare size={32} className="opacity-20"/>
                               <p>Canal direto entre Comercial e Engenharia.</p>
                               <p>Utilize este espaço para tirar dúvidas sobre o escopo técnico ou alinhar detalhes da entrega.</p>
                           </div>
                       )}
                       {opportunity.engineering?.interactions?.map((log) => (
                           <div key={log.id} className={`flex flex-col ${log.role === currentUser.role ? 'items-end' : 'items-start'}`}>
                               <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                   log.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-900 rounded-tl-none' : 
                                   log.role === UserRole.EXECUTIVE && log.role === currentUser.role ? 'bg-blue-100 text-blue-900 rounded-tr-none' : 
                                   log.role === UserRole.STAFF ? 'bg-pink-100 text-pink-900' : 'bg-white text-gray-700'
                               }`}>
                                   <p className="font-bold text-xs opacity-70 mb-1">{log.authorName} ({log.role === UserRole.STAFF ? 'Engenharia' : log.role === UserRole.EXECUTIVE ? 'Comercial' : 'Admin'})</p>
                                   {log.message}
                               </div>
                               <span className="text-[10px] text-gray-400 mt-1">
                                   {new Date(log.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                               </span>
                           </div>
                       ))}
                       <div ref={chatEndRef} />
                   </div>

                   <div className="p-3 bg-white border-t border-gray-200">
                       <div className="flex gap-2">
                           <input 
                              className="flex-1 bg-gray-50 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                              placeholder="Digite uma mensagem..."
                              value={newMessage}
                              onChange={e => setNewMessage(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                           />
                           <button onClick={handleSendMessage} className="p-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors">
                               <Send size={18} />
                           </button>
                       </div>
                   </div>
                   
                   {/* ACTION BUTTONS */}
                   {canEditEngineering && (
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                             {/* ANALYSIS PHASE ACTIONS */}
                             {(opportunity.status === OpportunityStatus.TECHNICAL_ANALYSIS || opportunity.status === OpportunityStatus.PROSPECTING) && (
                                <div className="grid grid-cols-2 gap-3">
                                     <button 
                                       onClick={() => handleEngineeringAction('APPROVED')}
                                       className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                                     >
                                        <CheckCircle size={16} /> Aprovar
                                     </button>
                                     <button 
                                       onClick={() => handleEngineeringAction('REJECTED')}
                                       className="bg-red-100 hover:bg-red-200 text-red-700 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                                     >
                                        <X size={16} /> Reprovar
                                     </button>
                                </div>
                             )}

                             {/* DEVELOPMENT PHASE ACTIONS */}
                             {opportunity.status === OpportunityStatus.IN_DEVELOPMENT && (
                                 <button 
                                   onClick={handleDeploy}
                                   className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                                 >
                                    <Rocket size={18} /> Realizar Entrega / Deploy
                                 </button>
                             )}
                        </div>
                   )}
               </div>
            </div>
          )}

          {/* TAB: PROJECT & FILES */}
          {activeTab === 'PROJECT' && (
             <div className="space-y-6">
                 
                 {/* Timeline */}
                 <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Status do Projeto</h4>
                    <div className="relative flex justify-between items-center mb-4">
                       <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-0"></div>
                       
                       {['Assinado', 'Planejamento', 'Desenvolvimento', 'Entrega'].map((step, idx) => {
                           const currentStepIdx = 
                             opportunity.status === OpportunityStatus.CONTRACT_SIGNED ? 0 :
                             opportunity.status === OpportunityStatus.IN_DEVELOPMENT ? 2 :
                             opportunity.status === OpportunityStatus.DELIVERED ? 3 : 0;
                           
                           const isCompleted = idx <= currentStepIdx;

                           return (
                               <div key={idx} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-colors ${isCompleted ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                                      {idx + 1}
                                  </div>
                                  <span className={`text-xs font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{step}</span>
                               </div>
                           )
                       })}
                    </div>
                 </div>

                 {/* File Upload Zone */}
                 <div 
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${dragActive ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-400'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                 >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                       <Upload size={24} />
                    </div>
                    <p className="text-gray-900 font-bold">Arraste arquivos aqui</p>
                    <p className="text-sm text-gray-500 mt-1 mb-4">Contratos, Briefings, Especificações Técnicas</p>
                    <label className="bg-white border border-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                        Selecionar do computador
                        <input type="file" className="hidden" onChange={(e) => e.target.files && e.target.files[0] && handleFileUpload(e.target.files[0])} />
                    </label>
                 </div>

                 {/* File List */}
                 <div className="space-y-3">
                     <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Arquivos do Projeto</h4>
                     
                     {!opportunity.files || opportunity.files.length === 0 ? (
                         <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-2xl">
                             Nenhum arquivo anexado ainda.
                         </div>
                     ) : (
                         opportunity.files.map(file => (
                             <div key={file.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between group">
                                 <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                                         {getFileIcon(file.type)}
                                     </div>
                                     <div>
                                         <p className="font-bold text-gray-900 text-sm">{file.name}</p>
                                         <p className="text-xs text-gray-500">{file.uploadedBy} • {new Date(file.uploadedAt).toLocaleDateString()}</p>
                                     </div>
                                 </div>
                                 
                                 <div className="flex items-center gap-2">
                                     {/* Visibility Toggle */}
                                     <button 
                                        onClick={() => toggleFileVisibility(file.id)}
                                        className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                                            file.isClientVisible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                        }`}
                                        title={file.isClientVisible ? "Visível para o Cliente" : "Oculto para o Cliente"}
                                     >
                                         {file.isClientVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                                         {file.isClientVisible ? 'Cliente Vê' : 'Privado'}
                                     </button>

                                     <button onClick={() => deleteFile(file.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                         <X size={16} />
                                     </button>
                                 </div>
                             </div>
                         ))
                     )}
                 </div>
             </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-white flex justify-end">
          <button 
            onClick={onClose}
            className="bg-gray-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-black transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};