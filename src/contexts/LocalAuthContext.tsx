import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LocalUser, LocalSession } from "@/types/local";
import { localStorageService } from "@/services/localStorageService";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

interface LocalAuthContextType {
  user: LocalUser | null;
  session: LocalSession | null;
  isLoading: boolean;
  error: string | null;
  signUp: (email: string, password: string, userData: { nom: string; nomEntreprise: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<LocalUser>) => void;
}

const LocalAuthContext = createContext<LocalAuthContextType | undefined>(undefined);

export const LocalAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [session, setSession] = useState<LocalSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier s'il y a une session existante au chargement
    const existingSession = localStorageService.getSession();
    if (existingSession) {
      setSession(existingSession);
      setUser(existingSession.user);
    }
    setIsLoading(false);
  }, []);

  const signUp = async (email: string, password: string, userData: { nom: string; nomEntreprise: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = localStorageService.getUserByEmail(email);
      if (existingUser) {
        throw new Error("Un compte avec cet email existe déjà");
      }

      // Créer le nouvel utilisateur
      const newUser: LocalUser = {
        id: uuidv4(),
        email,
        nom: userData.nom,
        full_name: userData.nom, // Added for compatibility
        nomEntreprise: userData.nomEntreprise,
        role: 'admin', // Premier utilisateur = admin
        createdAt: new Date().toISOString(),
      };

      // Sauvegarder l'utilisateur
      localStorageService.saveUser(newUser);

      // Créer une session
      const newSession: LocalSession = {
        user: newUser,
        token: uuidv4(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours
      };

      // Sauvegarder la session
      localStorageService.saveSession(newSession);
      setSession(newSession);
      setUser(newUser);

      toast.success("Compte créé avec succès !");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la création du compte";
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Trouver l'utilisateur
      const existingUser = localStorageService.getUserByEmail(email);
      if (!existingUser) {
        throw new Error("Email ou mot de passe incorrect");
      }

      // Dans une vraie application, on vérifierait le mot de passe hashé
      // Ici on simule juste la connexion
      
      // Créer une nouvelle session
      const newSession: LocalSession = {
        user: existingUser,
        token: uuidv4(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours
      };

      // Sauvegarder la session
      localStorageService.saveSession(newSession);
      setSession(newSession);
      setUser(existingUser);

      toast.success("Connexion réussie !");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur de connexion";
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      localStorageService.clearSession();
      setSession(null);
      setUser(null);
      toast.success("Déconnexion réussie");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur de déconnexion";
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<LocalUser>) => {
    if (!user) return;

    const updatedUser = { ...user, ...userData };
    localStorageService.saveUser(updatedUser);
    
    if (session) {
      const updatedSession = { ...session, user: updatedUser };
      localStorageService.saveSession(updatedSession);
      setSession(updatedSession);
    }
    
    setUser(updatedUser);
    toast.success("Profil mis à jour");
  };

  return (
    <LocalAuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        error,
        signUp,
        signIn,
        signOut,
        updateUser,
      }}
    >
      {children}
    </LocalAuthContext.Provider>
  );
};

export const useLocalAuth = () => {
  const context = useContext(LocalAuthContext);
  if (context === undefined) {
    throw new Error("useLocalAuth doit être utilisé dans un LocalAuthProvider");
  }
  return context;
};
