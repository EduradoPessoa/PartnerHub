export enum UserRole {
  ADMIN = 'ADMIN',
  EXECUTIVE = 'EXECUTIVE',
  STAFF = 'STAFF' // Engenheiros de Software
}

export interface PjDetails {
  cnpj: string;
  legalName: string; // Razão Social
  fantasyName?: string;
  address: string;
  city: string;
  state: string;
  bankInfo: {
    bank: string;
    agency: string;
    account: string;
    pixKey?: string;
  }
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  email: string;
  phone?: string;
  location?: string; // e.g. "São Paulo, SP"
  joinedAt?: string;
  pjDetails?: PjDetails;
  staffSubRole?: 'ENGENHEIRO' | 'PROGRAMADOR' | 'ADMINISTRADOR' | 'FINANCEIRO';
}

export enum OpportunityStatus {
  PROSPECTING = 'Prospecção', // Lead
  TECHNICAL_ANALYSIS = 'Análise Técnica', // Engineering Approval needed
  PROPOSAL_SENT = 'Proposta Enviada',
  CONTRACT_SIGNED = 'Contrato Assinado', // Triggers 20%
  IN_DEVELOPMENT = 'Em Desenvolvimento',
  DELIVERED = 'Entregue', // Triggers 10%
  CLOSED_LOST = 'Perdido'
}

export enum CommissionStatus {
  PENDING = 'Pendente', // Project milestone not reached
  AVAILABLE = 'Aguardando NF', // Milestone reached, waiting for invoice
  INVOICE_RECEIVED = 'Aguardando Pagamento', // Invoice uploaded, waiting for PIX
  PAID = 'Pago' // Money sent
}

export type OpportunityTemperature = 'HOT' | 'WARM' | 'COLD';

export interface InteractionLog {
  id: string;
  authorName: string;
  role: UserRole;
  message: string;
  createdAt: string;
}

export type EventType = 'MEETING' | 'DELIVERABLE';

export interface ProjectEvent {
  id: string;
  title: string;
  date: string; // ISO String or YYYY-MM-DD
  type: EventType;
  description?: string;
}

export interface EngineeringData {
  technicalScope: string;
  architectureNotes?: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  feedback?: string;
  // New fields for evaluation
  complexity?: 'BAIXA' | 'MEDIA' | 'ALTA';
  riskAnalysis?: string;
  estimatedHours?: number;
  interactions?: InteractionLog[];
  schedule?: ProjectEvent[]; // Calendar events
}

export type FileType = 'CONTRACT' | 'BRIEFING' | 'TECH_SPEC' | 'DELIVERABLE' | 'OTHER';

export interface ProjectFile {
  id: string;
  name: string;
  url: string; // Mock url
  type: FileType;
  uploadedBy: string;
  uploadedAt: string;
  isClientVisible: boolean;
  size: string;
}

export interface Opportunity {
  id: string;
  executiveId: string;
  cnpj: string;
  companyName: string; // Razão Social
  contactName: string;
  contactEmail: string;
  projectType: 'Web' | 'Mobile' | 'Site' | 'Landing Page' | 'Outros';
  estimatedValue: number;
  status: OpportunityStatus;
  temperature: OpportunityTemperature;
  createdAt: string;
  notes: string;
  engineering?: EngineeringData;
  paymentConditions?: string; // e.g., "50% entry + 50% delivery"
  files?: ProjectFile[];
  projectStartDate?: string;
  projectDeadline?: string;
}

export interface CommissionRecord {
  id: string;
  opportunityId: string;
  type: 'CLOSING' | 'SUCCESS_FEE'; // 20% or 10%
  amount: number;
  status: CommissionStatus;
  dueDate: string; // Month of closing or project end
  invoiceUrl?: string;
  paidAt?: string;
}

export interface TimesheetEntry {
  id: string;
  userId: string;
  opportunityId: string; // Linked Project
  date: string;
  hours: number;
  description: string;
}
