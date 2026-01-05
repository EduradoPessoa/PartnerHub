import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, PlusCircle, LogOut, PieChart, Settings, Bell, FileText, Kanban, Wallet, ShieldCheck, History, Calendar, Clock, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  loadUsers, saveUsers, 
  loadOpportunities, saveOpportunities, 
  loadTimesheet, saveTimesheet,
  calculateCommissions, saveCommissions, loadCommissions 
} from './services/mockData';
import { User, Opportunity, UserRole, CommissionRecord, TimesheetEntry } from './types';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { OpportunityList } from './components/OpportunityList';
import { NewOpportunityForm } from './components/NewOpportunityForm';
import { PipelineBoard } from './components/PipelineBoard';
import { CommercialPolicies } from './components/CommercialPolicies';
import { OpportunityDetailsModal } from './components/OpportunityDetailsModal';
import { Profile } from './components/Profile';
import { AccountsPayable } from './components/AccountsPayable';
import { SalesHistory } from './components/SalesHistory';
import { Login } from './components/Login';
import { ProjectCalendar } from './components/ProjectCalendar';
import { Timesheet } from './components/Timesheet';
import { RegisterStaff } from './components/RegisterStaff';
import { RegisterExecutive } from './components/RegisterExecutive';

// --- Layout Components ---

const Sidebar = ({ user, onLogout, collapsed, onToggleCollapse }: { user: User, onLogout: () => void, collapsed: boolean, onToggleCollapse: () => void }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path 
    ? 'bg-gray-800 text-white shadow-lg transform scale-105' 
    : 'text-gray-400 hover:text-white hover:bg-gray-800/50';

  const isStaff = user.role === UserRole.STAFF;

  return (
    <div className={`hidden md:flex flex-col h-[96vh] ${collapsed ? 'w-20' : 'w-72'} bg-gray-900 rounded-3xl m-4 sticky top-4 shadow-2xl text-white overflow-hidden z-20`}>
      <div className={`p-8 ${collapsed ? 'p-6' : 'p-8'}`}>
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-900 font-black text-xl">
              P.
            </div>
            {!collapsed && <span className="font-bold text-xl tracking-tight">PHOENYX</span>}
          </div>
          <button onClick={onToggleCollapse} className="bg-gray-800 hover:bg-gray-700 rounded-xl p-2 transition-colors" title={collapsed ? 'Expandir menu' : 'Retrair menu'}>
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </div>
      
      <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-4'} space-y-2 overflow-y-auto hide-scrollbar`}>
        {user.role === UserRole.ADMIN && (
          <>
             <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-2">Administração</p>
             <Link to="/admin" className={`flex items-center gap-4 ${collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-4'} rounded-2xl transition-all duration-300 group ${isActive('/admin')}`}>
               <ShieldCheck size={22} className={location.pathname === '/admin' ? 'text-red-400' : ''} />
               {!collapsed && <span className="font-medium">Visão Global</span>}
             </Link>
             <Link to="/finance" className={`flex items-center gap-4 ${collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-4'} rounded-2xl transition-all duration-300 group ${isActive('/finance')}`}>
               <Wallet size={22} className={location.pathname === '/finance' ? 'text-green-400' : ''} />
               {!collapsed && <span className="font-medium">Contas a Pagar</span>}
             </Link>
          </>
        )}

        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4">Gestão</p>
        
        <Link to="/" className={`flex items-center gap-4 ${collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-4'} rounded-2xl transition-all duration-300 group ${isActive('/')}`}>
          <LayoutDashboard size={22} className={location.pathname === '/' ? 'text-brand-400' : ''} />
          {!collapsed && <span className="font-medium">Dashboard</span>}
        </Link>
        
        {!isStaff && (
            <Link to="/pipeline" className={`flex items-center gap-4 ${collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-4'} rounded-2xl transition-all duration-300 group ${isActive('/pipeline')}`}>
              <Kanban size={22} className={location.pathname === '/pipeline' ? 'text-purple-400' : ''} />
              {!collapsed && <span className="font-medium">Pipeline</span>}
            </Link>
        )}

        <Link to="/opportunities" className={`flex items-center gap-4 ${collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-4'} rounded-2xl transition-all duration-300 group ${isActive('/opportunities')}`}>
          <Users size={22} className={location.pathname === '/opportunities' ? 'text-blue-400' : ''} />
          {!collapsed && <span className="font-medium">Projetos / Clientes</span>}
        </Link>
        
        <Link to="/calendar" className={`flex items-center gap-4 ${collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-4'} rounded-2xl transition-all duration-300 group ${isActive('/calendar')}`}>
          <Calendar size={22} className={location.pathname === '/calendar' ? 'text-teal-400' : ''} />
          {!collapsed && <span className="font-medium">Agenda</span>}
        </Link>

        {/* Timesheet - Visible for Staff and Admin */}
        {(isStaff || user.role === UserRole.ADMIN) && (
            <Link to="/timesheet" className={`flex items-center gap-4 ${collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-4'} rounded-2xl transition-all duration-300 group ${isActive('/timesheet')}`}>
              <Clock size={22} className={location.pathname === '/timesheet' ? 'text-pink-400' : ''} />
              {!collapsed && <span className="font-medium">Timesheet</span>}
            </Link>
        )}

        {!isStaff && (
            <Link to="/history" className={`flex items-center gap-4 ${collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-4'} rounded-2xl transition-all duration-300 group ${isActive('/history')}`}>
              <History size={22} className={location.pathname === '/history' ? 'text-orange-400' : ''} />
              {!collapsed && <span className="font-medium">Histórico de Vendas</span>}
            </Link>
        )}
        
        {!isStaff && (
            <Link to="/new" className={`flex items-center gap-4 ${collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-4'} rounded-2xl transition-all duration-300 group ${isActive('/new')}`}>
              <PlusCircle size={22} className={location.pathname === '/new' ? 'text-green-400' : ''} />
              {!collapsed && <span className="font-medium">Nova Oportunidade</span>}
            </Link>
        )}

         {!isStaff && (
             <>
                <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">Institucional</p>
                <Link to="/policies" className={`flex items-center gap-4 ${collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-4'} rounded-2xl transition-all duration-300 group ${isActive('/policies')}`}>
                 <FileText size={22} className={location.pathname === '/policies' ? 'text-yellow-400' : ''} />
                 {!collapsed && <span className="font-medium">Políticas</span>}
               </Link>
             </>
         )}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-gray-800 rounded-2xl p-4 flex items-center gap-3 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-gray-700 relative z-10 object-cover" />
          <div className="flex-1 min-w-0 relative z-10">
            <p className="text-sm font-bold text-white truncate">{user.name}</p>
            {!collapsed && (
              <Link to="/profile" className="text-xs text-gray-400 hover:text-white transition-colors block mt-0.5">
                Ver Perfil
              </Link>
            )}
          </div>
          <button onClick={onLogout} className="relative z-10 text-gray-400 hover:text-red-400 transition-colors" title="Sair">
             <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const MobileHeader = ({ onLogout }: { onLogout: () => void }) => (
  <div className="md:hidden bg-gray-900 p-4 flex justify-between items-center sticky top-0 z-30 shadow-lg">
     <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-900 font-bold">P.</div>
        <h1 className="text-xl font-bold text-white">PHOENYX</h1>
     </div>
     <div className="flex items-center gap-4">
        <div className="bg-gray-800 p-2 rounded-full">
          <Bell size={20} className="text-white" />
        </div>
        <button onClick={onLogout} className="text-white">
          <LogOut size={20} />
        </button>
     </div>
  </div>
);

// --- Wrappers ---

const EditOpportunityWrapper: React.FC<{
  opportunities: Opportunity[], 
  onSave: (op: Opportunity) => void,
  user: User
}> = ({ opportunities, onSave, user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const opToEdit = opportunities.find(o => o.id === id);

  if (!opToEdit) return <div>Oportunidade não encontrada.</div>;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <NewOpportunityForm 
        executiveId={user.id} 
        onSave={(op) => { onSave(op); navigate('/opportunities'); }} 
        onCancel={() => navigate('/opportunities')} 
        initialData={opToEdit}
      />
    </div>
  );
};

const OpportunityListWrapper: React.FC<{
  opportunities: Opportunity[],
  onDelete: (id: string) => void,
  onSelect: (op: Opportunity) => void,
  currentUser: User,
  onUpdate: (op: Opportunity) => void
}> = ({ opportunities, onDelete, onSelect, currentUser, onUpdate }) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Lista de Clientes</h2>
          <p className="text-gray-500 mt-1">Visão tabular de todas as oportunidades.</p>
        </div>
      </div>
      <OpportunityList 
        opportunities={opportunities} 
        onSelectOpportunity={onSelect}
        onDelete={onDelete}
        onEdit={(op) => navigate(`/edit/${op.id}`)}
        currentUser={currentUser}
        onUpdate={onUpdate}
      />
    </div>
  );
};

// --- Main App Logic ---

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // States are initialized empty, we fetch them on mount
  const [users, setUsers] = useState<User[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [timesheetEntries, setTimesheetEntries] = useState<TimesheetEntry[]>([]);
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pipelineExecId, setPipelineExecId] = useState<string>('ALL');

  // Initial Data Fetch
  useEffect(() => {
    const initData = async () => {
        if (!currentUser) return; // Only load data if logged in
        
        setIsLoading(true);
        try {
            const [usersData, opsData, timesheetData, commsData] = await Promise.all([
                loadUsers(),
                loadOpportunities(),
                loadTimesheet(),
                loadCommissions()
            ]);

            setUsers(usersData);
            setOpportunities(opsData);
            setTimesheetEntries(timesheetData);
            
            // Recalculate based on existing saved data
            const freshComms = calculateCommissions(opsData, commsData);
            
            // Merge calculation with saved state (to keep PAID status etc)
            // Actually calculateCommissions now accepts existing data to merge, so we just use freshComms
            // But we need to make sure we save any NEWLY generated commissions from the calculation
            setCommissions(freshComms);
            
            // If new commissions were generated by calculation, save them
            if (freshComms.length !== commsData.length) {
                saveCommissions(freshComms);
            }
        } catch (e) {
            console.error("Failed to load initial data", e);
        } finally {
            setIsLoading(false);
        }
    };

    initData();
  }, [currentUser]); // Re-run when user logs in

  React.useEffect(() => {
    const handleUpdateEvent = (e: CustomEvent<Opportunity>) => {
        handleAddOrUpdateOpportunity(e.detail);
    };
    document.addEventListener('update-opportunity', handleUpdateEvent as EventListener);

    return () => {
        document.removeEventListener('update-opportunity', handleUpdateEvent as EventListener);
    };
  }, [opportunities]); 

  // Handle Login
  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  // Show Loader while fetching initial data
  if (isLoading) {
      return (
          <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                  <Loader2 size={48} className="text-gray-900 animate-spin" />
                  <p className="text-gray-500 font-bold">Carregando Partner Hub...</p>
              </div>
          </div>
      )
  }

  const filteredOps = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.STAFF
    ? opportunities 
    : opportunities.filter(op => op.executiveId === currentUser.id);

  const handleAddOrUpdateOpportunity = (op: Opportunity) => {
    let newOps = [];
    const exists = opportunities.find(o => o.id === op.id);
    if (exists) {
      newOps = opportunities.map(o => o.id === op.id ? op : o);
    } else {
      newOps = [op, ...opportunities];
    }
    setOpportunities(newOps);
    saveOpportunities(newOps); 

    const newComms = calculateCommissions(newOps, commissions);
    setCommissions(newComms);
    saveCommissions(newComms);

    if (selectedOpportunity && selectedOpportunity.id === op.id) {
        setSelectedOpportunity(op);
    }
  };

  const handleUpdateCommission = (updatedComm: CommissionRecord) => {
     const newComms = commissions.map(c => c.id === updatedComm.id ? updatedComm : c);
     setCommissions(newComms);
     saveCommissions(newComms);
  };

  const handleDeleteOpportunity = (id: string) => {
    const newOps = opportunities.filter(o => o.id !== id);
    setOpportunities(newOps);
    saveOpportunities(newOps);
  };

  const handleAddTimesheetEntry = (entry: TimesheetEntry) => {
      const newEntries = [...timesheetEntries, entry];
      setTimesheetEntries(newEntries);
      saveTimesheet(newEntries);
  }

  const handleDeleteTimesheetEntry = (id: string) => {
      const newEntries = timesheetEntries.filter(e => e.id !== id);
      setTimesheetEntries(newEntries);
      saveTimesheet(newEntries);
  }
  
  const handleUpdateUser = (updatedUser: User) => {
      setCurrentUser(updatedUser);
      const newUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
      setUsers(newUsers);
      saveUsers(newUsers);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setOpportunities([]); // Clear data on logout
  };

  return (
    <Router>
      <div className="bg-[#f3f4f6] min-h-screen text-gray-800 font-sans flex flex-col md:flex-row">
        <Sidebar user={currentUser} onLogout={handleLogout} collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <MobileHeader onLogout={handleLogout} />

        <main className="flex-1 p-4 md:p-8 md:pt-8 min-h-screen overflow-y-auto hide-scrollbar">
          {/* Top Bar / Search Placeholder */}
          <div className="hidden md:flex justify-between items-center mb-8">
            <div className="relative w-96">
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="w-full bg-white border-none rounded-full py-3 px-6 shadow-sm focus:ring-2 focus:ring-gray-200 text-gray-600 placeholder-gray-400"
              />
              <div className="absolute right-4 top-3 text-gray-400">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-2 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>

          <Routes>
            <Route path="/" element={
              currentUser.role === UserRole.ADMIN 
              ? <Navigate to="/admin" replace />
              : <Dashboard 
                  opportunities={filteredOps} 
                  commissions={commissions.filter(c => filteredOps.map(o => o.id).includes(c.opportunityId))} 
                  user={currentUser} 
                />
            } />
            
            {currentUser.role === UserRole.ADMIN && (
              <>
                 <Route path="/admin" element={
                    <AdminDashboard 
                       opportunities={opportunities} 
                       commissions={commissions} 
                       users={users} 
                    />
                 } />
                 <Route path="/finance" element={
                    <AccountsPayable 
                       opportunities={opportunities} 
                       commissions={commissions} 
                       users={users}
                       onUpdateCommission={handleUpdateCommission}
                    />
                 } />
              </>
            )}

            <Route path="/pipeline" element={
              <div className="space-y-6 animate-fade-in">
                 <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Pipeline de Vendas</h2>
                    <p className="text-gray-500 mt-1">Acompanhe a temperatura e o estágio das negociações.</p>
                 </div>
                 {currentUser.role === UserRole.ADMIN && (
                   <div className="flex items-center gap-3">
                     <label className="text-sm font-bold text-gray-700">Executivo</label>
                     <select
                       className="bg-white border-none rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-gray-200"
                       value={pipelineExecId}
                       onChange={e => setPipelineExecId(e.target.value)}
                     >
                       <option value="ALL">Todos</option>
                       {users.filter(u => u.role === UserRole.EXECUTIVE).map(u => (
                         <option key={u.id} value={u.id}>{u.name}</option>
                       ))}
                     </select>
                   </div>
                 )}
                 {currentUser.role !== UserRole.ADMIN && (
                   <div className="text-sm text-gray-500">Exibindo apenas suas oportunidades.</div>
                 )}
                 <PipelineBoard 
                    opportunities={
                      currentUser.role === UserRole.ADMIN && pipelineExecId !== 'ALL'
                        ? opportunities.filter(o => o.executiveId === pipelineExecId)
                        : filteredOps
                    } 
                    onSelectOpportunity={setSelectedOpportunity} 
                 />
              </div>
            } />
            <Route path="/opportunities" element={
              <OpportunityListWrapper 
                opportunities={filteredOps}
                onDelete={handleDeleteOpportunity}
                onSelect={setSelectedOpportunity}
                currentUser={currentUser}
                onUpdate={handleAddOrUpdateOpportunity}
              />
            } />
            <Route path="/calendar" element={
               <ProjectCalendar opportunities={opportunities} currentUser={currentUser} />
            } />
            <Route path="/timesheet" element={
               <Timesheet 
                  entries={timesheetEntries} 
                  opportunities={opportunities} 
                  currentUser={currentUser}
                  onAddEntry={handleAddTimesheetEntry}
                  onDeleteEntry={handleDeleteTimesheetEntry}
               />
            } />
            <Route path="/history" element={
                <SalesHistory 
                    opportunities={filteredOps} 
                    commissions={commissions.filter(c => filteredOps.map(o => o.id).includes(c.opportunityId))}
                />
            } />
            <Route path="/policies" element={<CommercialPolicies />} />
            <Route path="/profile" element={
                <Profile user={currentUser} onUpdate={handleUpdateUser} />
            } />
            <Route path="/new" element={
              <div className="max-w-3xl mx-auto pt-4">
                <NewOpportunityForm 
                  executiveId={currentUser.id} 
                  onSave={(op) => {
                    handleAddOrUpdateOpportunity(op);
                    window.location.hash = '#/opportunities';
                  }} 
                  onCancel={() => window.location.hash = '#/opportunities'} 
                />
              </div>
            } />
            <Route path="/edit/:id" element={
              <EditOpportunityWrapper 
                 opportunities={opportunities} 
                 onSave={handleAddOrUpdateOpportunity}
                 user={currentUser}
              />
            } />
            <Route path="/register/staff" element={<RegisterStaff />} />
            <Route path="/register/executive" element={<RegisterExecutive />} />
          </Routes>
        </main>
        
        <OpportunityDetailsModal 
          opportunity={selectedOpportunity} 
          currentUser={currentUser}
          onClose={() => setSelectedOpportunity(null)} 
          onUpdate={handleAddOrUpdateOpportunity}
        />
      </div>
    </Router>
  );
};

export default App;
