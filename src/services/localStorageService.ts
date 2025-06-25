
import { LocalUser, LocalSession, CompteBancaire, Transaction, Entreprise, Projet } from '@/types/local';

class LocalStorageService {
  private static instance: LocalStorageService;
  
  static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  // Authentication
  setSession(session: LocalSession): void {
    localStorage.setItem('trezo_session', JSON.stringify(session));
  }

  getSession(): LocalSession | null {
    const session = localStorage.getItem('trezo_session');
    if (!session) return null;
    
    const parsedSession = JSON.parse(session);
    // Vérifier si la session est expirée
    if (new Date(parsedSession.expiresAt) < new Date()) {
      this.clearSession();
      return null;
    }
    
    return parsedSession;
  }

  clearSession(): void {
    localStorage.removeItem('trezo_session');
  }

  // Users
  saveUser(user: LocalUser): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem('trezo_users', JSON.stringify(users));
  }

  getUsers(): LocalUser[] {
    const users = localStorage.getItem('trezo_users');
    return users ? JSON.parse(users) : [];
  }

  getUserByEmail(email: string): LocalUser | null {
    const users = this.getUsers();
    return users.find(u => u.email === email) || null;
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
    
    localStorage.setItem('trezo_comptes', JSON.stringify(comptes));
  }

  getComptes(): CompteBancaire[] {
    const comptes = localStorage.getItem('trezo_comptes');
    return comptes ? JSON.parse(comptes) : [];
  }

  deleteCompte(id: string): void {
    const comptes = this.getComptes().filter(c => c.id !== id);
    localStorage.setItem('trezo_comptes', JSON.stringify(comptes));
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
    
    localStorage.setItem('trezo_transactions', JSON.stringify(transactions));
  }

  getTransactions(): Transaction[] {
    const transactions = localStorage.getItem('trezo_transactions');
    return transactions ? JSON.parse(transactions) : [];
  }

  deleteTransaction(id: string): void {
    const transactions = this.getTransactions().filter(t => t.id !== id);
    localStorage.setItem('trezo_transactions', JSON.stringify(transactions));
  }

  // Entreprise
  saveEntreprise(entreprise: Entreprise): void {
    localStorage.setItem('trezo_entreprise', JSON.stringify(entreprise));
  }

  getEntreprise(): Entreprise | null {
    const entreprise = localStorage.getItem('trezo_entreprise');
    return entreprise ? JSON.parse(entreprise) : null;
  }

  // Projets
  saveProjets(projets: Projet[]): void {
    localStorage.setItem('trezo_projets', JSON.stringify(projets));
  }

  getProjets(): Projet[] {
    const projets = localStorage.getItem('trezo_projets');
    return projets ? JSON.parse(projets) : [];
  }

  savePlan(projet: Projet): void {
    const projets = this.getProjets();
    const existingIndex = projets.findIndex(p => p.id === projet.id);
    
    if (existingIndex >= 0) {
      projets[existingIndex] = projet;
    } else {
      projets.push(projet);
    }
    
    this.saveProjets(projets);
  }

  deletePlan(id: string): void {
    const projets = this.getProjets().filter(p => p.id !== id);
    this.saveProjets(projets);
  }

  // Utilitaires
  clearAllData(): void {
    const keys = [
      'trezo_session', 'trezo_users', 'trezo_comptes', 
      'trezo_transactions', 'trezo_entreprise', 'trezo_projets'
    ];
    keys.forEach(key => localStorage.removeItem(key));
  }

  exportData(): string {
    const data = {
      users: this.getUsers(),
      comptes: this.getComptes(),
      transactions: this.getTransactions(),
      entreprise: this.getEntreprise(),
      projets: this.getProjets()
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.users) localStorage.setItem('trezo_users', JSON.stringify(data.users));
      if (data.comptes) localStorage.setItem('trezo_comptes', JSON.stringify(data.comptes));
      if (data.transactions) localStorage.setItem('trezo_transactions', JSON.stringify(data.transactions));
      if (data.entreprise) localStorage.setItem('trezo_entreprise', JSON.stringify(data.entreprise));
      if (data.projets) localStorage.setItem('trezo_projets', JSON.stringify(data.projets));
    } catch (error) {
      throw new Error('Format de données invalide');
    }
  }
}

export const localStorageService = LocalStorageService.getInstance();
