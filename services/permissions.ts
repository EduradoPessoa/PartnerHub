import { User, UserRole, Opportunity, OpportunityStatus } from '../types';

/**
 * RBAC Permissions Service
 * Based on the defined Matrix:
 * 
 * ADMIN: Global Access
 * EXECUTIVE: Own pipeline only
 * EXECUTIVE_LIDER: Own + Network (users where leaderId === this.user.id)
 * ENGENHEIRO: All Technical/Projects
 * PROGRAMADOR: Assigned Projects only
 * FINANCEIRO: All Financials/Contracts
 */

export const Permissions = {
  
  // --- Opportunities ---

  canViewAllOpportunities: (user: User): boolean => {
    return [UserRole.ADMIN, UserRole.ENGENHEIRO].includes(user.role);
  },

  canViewOpportunity: (user: User, opportunity: Opportunity): boolean => {
    if (user.role === UserRole.ADMIN || user.role === UserRole.ENGENHEIRO) return true;
    if (user.role === UserRole.FINANCEIRO) return false; // Financeiro sees contracts/payments, not necessarily the sales pipeline details? Actually Matrix says "Oportunidades: X" for Fin.
    if (user.role === UserRole.PROGRAMADOR) return false; // "Oportunidades: X"

    // Executives
    if (user.role === UserRole.EXECUTIVE) {
      return opportunity.executiveId === user.id;
    }

    if (user.role === UserRole.EXECUTIVE_LIDER) {
      // Own opportunities
      if (opportunity.executiveId === user.id) return true;
      // TODO: We need to check if the opportunity owner's leader is this user.
      // Since we don't have the full user list here easily, we might need to pass the owner or rely on a property on opportunity.
      // For now, let's assume the caller handles the "Network" filtering or we pass a list of managed IDs.
      // Ideally, the Opportunity should maybe have 'executiveLeaderId' denormalized or we look it up.
      // Simplification: returns true if executiveId matches or if we assume the caller filtered the list.
      // BUT for a single check:
      return opportunity.executiveId === user.id; 
      // Note: The actual filtering of "Network" usually happens at the list fetching level. 
      // This function validates specific access. 
      // Without access to the user database here, we can't verify "Network" relationship easily unless passed.
    }

    return false;
  },

  // --- Projects (In Development / Delivered) ---

  canViewAllProjects: (user: User): boolean => {
    return [UserRole.ADMIN, UserRole.ENGENHEIRO, UserRole.FINANCEIRO].includes(user.role);
  },

  canViewProject: (user: User, opportunity: Opportunity): boolean => {
    // Projects are Opportunities in later stages (CONTRACT_SIGNED, IN_DEVELOPMENT, DELIVERED)
    if (Permissions.canViewAllProjects(user)) return true;

    if (user.role === UserRole.PROGRAMADOR) {
      // "Atribuídos" - In our mock, we don't have explicit assignment yet. 
      // We can check if 'engineering.assignedDevs' includes user.id if we add that field.
      // For now, let's assume Programmers can't see unless we add assignment logic.
      // Or maybe they see all for now to unblock.
      // Matrix says: "Atribuídos".
      return false; // Strict implementation
    }

    if (user.role === UserRole.EXECUTIVE || user.role === UserRole.EXECUTIVE_LIDER) {
      return opportunity.executiveId === user.id;
    }

    return false;
  },

  // --- Financials ---

  canViewFinancials: (user: User): boolean => {
    return [UserRole.ADMIN, UserRole.FINANCEIRO].includes(user.role);
  },

  canViewOwnCommission: (user: User): boolean => {
    return [UserRole.EXECUTIVE, UserRole.EXECUTIVE_LIDER].includes(user.role);
  },

  // --- Users ---

  canManageUsers: (user: User): boolean => {
    return user.role === UserRole.ADMIN;
  },

  canViewTeam: (user: User): boolean => {
    return user.role === UserRole.ADMIN || user.role === UserRole.EXECUTIVE_LIDER;
  }
};
