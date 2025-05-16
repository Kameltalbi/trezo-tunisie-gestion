
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthState, User } from "../types";

// Dans un vrai projet avec Supabase, ce contexte serait connecté à l'API Supabase Auth

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const defaultUser: User = {
  id: "user-1",
  email: "demo@trezo.app",
  nom: "Utilisateur Demo",
  role: "utilisateur"
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  // Simuler la vérification du statut d'authentification au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem("trezo_user");
    
    if (savedUser) {
      try {
        setAuthState({
          user: JSON.parse(savedUser),
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Erreur de parsing utilisateur:", error);
        setAuthState({
          user: null,
          isLoading: false,
          error: "Session expirée",
        });
      }
    } else {
      setAuthState({
        user: null,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState({
      ...authState,
      isLoading: true,
      error: null,
    });

    try {
      // Simulation d'une requête API vers Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Accepter uniquement l'email de démo pour cette simulation
      if (email === "demo@trezo.app" && password === "password") {
        localStorage.setItem("trezo_user", JSON.stringify(defaultUser));
        setAuthState({
          user: defaultUser,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error("Identifiants incorrects");
      }
    } catch (error) {
      setAuthState({
        ...authState,
        isLoading: false,
        error: error instanceof Error ? error.message : "Erreur de connexion",
      });
    }
  };

  const logout = async () => {
    setAuthState({
      ...authState,
      isLoading: true,
    });

    try {
      // Simulation d'une requête API vers Supabase
      await new Promise(resolve => setTimeout(resolve, 500));
      localStorage.removeItem("trezo_user");
      setAuthState({
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        ...authState,
        isLoading: false,
        error: error instanceof Error ? error.message : "Erreur de déconnexion",
      });
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (!authState.user) return;
    
    setAuthState({
      ...authState,
      isLoading: true,
    });

    try {
      // Simulation d'une requête API vers Supabase
      await new Promise(resolve => setTimeout(resolve, 800));
      const updatedUser = { ...authState.user, ...data };
      localStorage.setItem("trezo_user", JSON.stringify(updatedUser));
      setAuthState({
        user: updatedUser,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        ...authState,
        isLoading: false,
        error: error instanceof Error ? error.message : "Erreur de mise à jour",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
