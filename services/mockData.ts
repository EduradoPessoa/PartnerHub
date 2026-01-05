import { User, UserRole, Opportunity, OpportunityStatus, CommissionRecord, CommissionStatus, TimesheetEntry } from '../types';

// CONFIGURATION
const API_BASE_URL = '/api'; 

// --- Master Admin Configuration ---
const MASTER_ADMIN: User = {
    id: 'admin_master',
    name: 'Eduardo Phoenyx',
    role: UserRole.ADMIN,
    email: 'eduardo@phoenyx.com.br',
    location: 'Matriz',
    avatar: 'https://ui-avatars.com/api/?name=Eduardo+P&background=0f172a&color=fff'
};

// --- Default Data for Fallback/Init ---
const DEFAULT_USERS: User[] = [
  MASTER_ADMIN,
  {
    id: 'admin1',
    name: 'Admin Demo',
    role: UserRole.ADMIN,
    email: 'admin@phoenyx.com',
    location: 'Matriz',
    avatar: 'https://ui-avatars.com/api/?name=Admin+Demo&background=0f172a&color=fff'
  },
  // ... other defaults can remain if needed for initial seed
];

// --- API Helpers ---

// Now using real API endpoints backed by Postgres
const USE_LOCAL_STORAGE_ONLY = false;

async function fetchFromApi<T>(endpoint: string): Promise<T[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
    
    let data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn(`Failed to fetch ${endpoint} from API, falling back to local storage.`, error);
    const local = localStorage.getItem(`phoenyx_${endpoint}`);
    // If users endpoint and no local data, return default users (seed)
    if (endpoint === 'users' && !local) return DEFAULT_USERS;
    return local ? JSON.parse(local) : [];
  }
}

async function saveToApi<T>(endpoint: string, data: T[]) {
  // 1. Save locally as backup
  localStorage.setItem(`phoenyx_${endpoint}`, JSON.stringify(data));

  // 2. Send to Backend
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Failed to sync ${endpoint} to server`, error);
  }
}

// --- Async Loaders ---

export const loadUsers = async (): Promise<User[]> => {
  let users = await fetchFromApi<User>('users');
  
  if (users.length === 0) {
      users = DEFAULT_USERS;
  }

  // --- AUTO-INSERT LOGIC (SEED) & FAILSAFE ---
  // Verifica se o Admin Master existe pelo email (independente do ID ou Nome)
  // Usamos try/catch para evitar crash se vierem dados mal formatados
  try {
      const masterUserIndex = users.findIndex(u => u.email && u.email.toLowerCase() === MASTER_ADMIN.email.toLowerCase());

      if (masterUserIndex >= 0) {
          // Usuário encontrado com o email mestre. 
          // RECUPERAÇÃO DE ACESSO: Força a role para ADMIN se não for.
          if (users[masterUserIndex].role !== UserRole.ADMIN) {
              console.warn("Master Admin found with incorrect role. Fixing privileges...");
              users[masterUserIndex].role = UserRole.ADMIN;
              // Salva a correção imediatamente
              saveUsers(users);
          }
      } else {
          console.log("Master Admin not found in API data. Injecting into memory...");
          // Injeta no início da lista para garantir acesso imediato
          users = [MASTER_ADMIN, ...users];
          
          // Tenta salvar para corrigir o servidor
          saveUsers(users).catch(err => console.error("Auto-seed failed", err)); 
      }
  } catch (e) {
      console.warn("Error checking for admin user", e);
      // Em caso de erro crítico na validação, injeta o admin por segurança
      users = [MASTER_ADMIN, ...users];
  }

  return users;
};

export const saveUsers = async (users: User[]) => {
  await saveToApi('users', users);
};

export const loadOpportunities = async (): Promise<Opportunity[]> => {
  return await fetchFromApi<Opportunity>('opportunities');
};

export const saveOpportunities = async (opportunities: Opportunity[]) => {
  await saveToApi('opportunities', opportunities);
};

export const loadTimesheet = async (): Promise<TimesheetEntry[]> => {
  return await fetchFromApi<TimesheetEntry>('timesheet');
};

export const saveTimesheet = async (entries: TimesheetEntry[]) => {
  await saveToApi('timesheet', entries);
};

export const loadCommissions = async (): Promise<CommissionRecord[]> => {
    return await fetchFromApi<CommissionRecord>('commissions');
}

export const saveCommissions = async (commissions: CommissionRecord[]) => {
    await saveToApi('commissions', commissions);
};

// --- Logic Helper ---
export const calculateCommissions = (opportunities: Opportunity[], existingCommissions: CommissionRecord[]): CommissionRecord[] => {
  const calculatedComms: CommissionRecord[] = [];
  
  opportunities.forEach(op => {
    if (!op || !op.id) return; // Safety check

    // 20% Closing Commission
    if ([OpportunityStatus.CONTRACT_SIGNED, OpportunityStatus.IN_DEVELOPMENT, OpportunityStatus.DELIVERED].includes(op.status)) {
      const commId = `com-${op.id}-1`;
      const existing = existingCommissions.find(c => c.id === commId);

      if (existing) {
        calculatedComms.push(existing);
      } else {
        const isPaid = op.status === OpportunityStatus.DELIVERED;
        calculatedComms.push({
          id: commId,
          opportunityId: op.id,
          type: 'CLOSING',
          amount: op.estimatedValue * 0.20,
          status: isPaid ? CommissionStatus.PAID : CommissionStatus.INVOICE_RECEIVED,
          dueDate: op.createdAt,
          invoiceUrl: '#',
          paidAt: isPaid ? '2023-11-01' : undefined
        });
      }
    }

    // 10% Success Fee
    if (op.status === OpportunityStatus.DELIVERED || [OpportunityStatus.CONTRACT_SIGNED, OpportunityStatus.IN_DEVELOPMENT].includes(op.status)) {
       const commId = `com-${op.id}-2${op.status === OpportunityStatus.DELIVERED ? '' : '-pending'}`;
       const existing = existingCommissions.find(c => c.id === commId);

       if (existing) {
         calculatedComms.push(existing);
       } else {
         if (op.status === OpportunityStatus.DELIVERED) {
            calculatedComms.push({
              id: commId,
              opportunityId: op.id,
              type: 'SUCCESS_FEE',
              amount: op.estimatedValue * 0.10,
              status: CommissionStatus.AVAILABLE,
              dueDate: '2023-12-01'
            });
         } else {
            calculatedComms.push({
              id: commId,
              opportunityId: op.id,
              type: 'SUCCESS_FEE',
              amount: op.estimatedValue * 0.10,
              status: CommissionStatus.PENDING,
              dueDate: 'TBD'
            });
         }
       }
    }
  });

  return calculatedComms;
};