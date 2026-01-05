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
  MASTER_ADMIN, // Garante que o Eduardo esteja nos dados padrão
  {
    id: 'admin1',
    name: 'Admin Demo',
    role: UserRole.ADMIN,
    email: 'admin@phoenyx.com',
    location: 'Matriz',
    avatar: 'https://ui-avatars.com/api/?name=Admin+Demo&background=0f172a&color=fff'
  },
  {
    id: 'exec1',
    name: 'João Vendedor',
    role: UserRole.EXECUTIVE,
    email: 'joao@phoenyx.com',
    location: 'São Paulo, SP',
    avatar: 'https://ui-avatars.com/api/?name=Joao+Vendedor&background=ea580c&color=fff'
  }
];

// --- API Helpers ---

// Vercel doesn't support PHP by default (unless configured with runtimes), so we'll switch to LocalStorage-only mode for now
// to fix the 403/404 errors until a proper Node/Postgres backend is set up.
const USE_LOCAL_STORAGE_ONLY = true;

async function fetchFromApi<T>(endpoint: string): Promise<T[]> {
  if (USE_LOCAL_STORAGE_ONLY) {
      const local = localStorage.getItem(`phoenyx_${endpoint}`);
      return local ? JSON.parse(local) : (endpoint === 'users' ? DEFAULT_USERS : []);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/index.php?endpoint=${endpoint}`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    let data = await response.json();
    
    if (!Array.isArray(data)) return [];

    // --- SMART PARSING (Fix for SQL Backend) ---
    // Se o backend retornar linhas do SQL com coluna 'json_data', precisamos fazer o parse.
    const parsedData = data.map((item: any) => {
        if (item && item.json_data && typeof item.json_data === 'string') {
            try {
                const parsed = JSON.parse(item.json_data);
                // Mescla o ID da coluna SQL com o objeto JSON para garantir consistência
                return { ...parsed, id: item.id || parsed.id };
            } catch (e) {
                console.warn("Failed to parse inner JSON for item:", item);
                return item;
            }
        }
        return item;
    });

    return parsedData;
  } catch (error) {
    console.warn(`Failed to fetch ${endpoint}, using fallback/local.`, error);
    const local = localStorage.getItem(`phoenyx_${endpoint}`);
    return local ? JSON.parse(local) : (endpoint === 'users' ? DEFAULT_USERS : []);
  }
}

async function saveToApi<T>(endpoint: string, data: T[]) {
  // 1. Save locally first
  localStorage.setItem(`phoenyx_${endpoint}`, JSON.stringify(data));

  if (USE_LOCAL_STORAGE_ONLY) return;

  // 2. Send to Backend
  try {
    await fetch(`${API_BASE_URL}/index.php?endpoint=${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
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
  // Verifica se o Admin Master existe.
  // Usamos try/catch no find para evitar crash se vierem dados mal formatados do banco
  let adminExists = false;
  try {
      adminExists = users.some(u => u.email && u.email.toLowerCase() === MASTER_ADMIN.email.toLowerCase());
  } catch (e) {
      console.warn("Error checking for admin user", e);
  }
  
  if (!adminExists) {
      console.log("Master Admin not found in API data. Injecting into memory...");
      // Injeta no início da lista para garantir acesso imediato
      users = [MASTER_ADMIN, ...users];
      
      // Tenta salvar para corrigir o servidor, mas não bloqueia o login se falhar
      saveUsers(users).catch(err => console.error("Auto-seed failed", err)); 
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