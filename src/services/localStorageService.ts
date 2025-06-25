
import { LocalUser, LocalSession, CompteBancaire, Transaction, Entreprise, Projet } from '@/types/local';

const STORAGE_KEYS = {
  USER: 'trezo_user',
  SESSION: 'trezo_session', 
  COMPTES: 'trezo_comptes',
  TRANSACTIONS: 'trezo_transactions',
  ENTREPRISE: 'trezo_entreprise',
  PROJETS: 'trezo_projets',
} as const;

class LocalStorageService {
  // Session et utilisateur
  saveSession(session: LocalSession): void {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  }

  getSession(): LocalSession | null {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!session) return null;
    
    const parsed = JSON.parse(session);
    // Vérifier si la session n'a pas expiré
    if (new Date(parsed.expiresAt) < new Date()) {
      this.clearSession();
      return null;
    }
    
    return parsed;
  }

  clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }

  saveUser(user: LocalUser): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  getUser(): LocalUser | null {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  }

  // Comptes bancaires
  saveCompte(compte: CompteBancaire): void {
    const comptes = this.getComptes();
    const existingIndex = comptes.findIndex(c => c.id === compte.id);
    
    if (existingIndex >= 0) {
      comptes[existingIndex] = compte;
    } else {
      comptes.push(compte);
    }
    
    localStorage.setItem(STORAGE_KEYS.COMPTES, JSON.stringify(comptes));
  }

  getComptes(): CompteBancaire[] {
    const comptes = localStorage.getItem(STORAGE_KEYS.COMPTES);
    return comptes ? JSON.parse(comptes) : [];
  }

  deleteCompte(id: string): void {
    const comptes = this.getComptes().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.COMPTES, JSON.stringify(comptes));
  }

  // Transactions
  saveTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions();
    const existingIndex = transactions.findIndex(t => t.id === transaction.id);
    
    if (existingIndex >= 0) {
      transactions[existingIndex] = transaction;
    } else {
      transactions.push(transaction);
    }
    
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }

  getTransactions(): Transaction[] {
    const transactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return transactions ? JSON.parse(transactions) : [];
  }

  deleteTransaction(id: string): void {
    const transactions = this.getTransactions().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }

  // Entreprise
  saveEntreprise(entreprise: Entreprise): void {
    localStorage.setItem(STORAGE_KEYS.ENTREPRISE, JSON.stringify(entreprise));
  }

  getEntreprise(): Entreprise | null {
    const entreprise = localStorage.getItem(STORAGE_KEYS.ENTREPRISE);
    return entreprise ? JSON.parse(entreprise) : null;
  }

  // Projets
  saveProjet(projet: Projet): void {
    const projets = this.getProjets();
    const existingIndex = projets.findIndex(p => p.id === projet.id);
    
    if (existingIndex >= 0) {
      projets[existingIndex] = projet;
    } else {
      projets.push(projet);
    }
    
    localStorage.setItem(STORAGE_KEYS.PROJETS, JSON.stringify(projets));
  }

  getProjets(): Projet[] {
    const projets = localStorage.getItem(STORAGE_KEYS.PROJETS);
    return projets ? JSON.parse(projets) : [];
  }

  deleteProjet(id: string): void {
    const projets = this.getProjets().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJETS, JSON.stringify(projets));
  }

  // Utilitaires
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const localStorageService = new LocalStorageService();
