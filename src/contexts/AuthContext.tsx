
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  signUp: (email: string, password: string, userData?: { full_name?: string; company_name?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour auto-enregistrer l'utilisateur
  const autoRegisterUser = async (currentUser: User) => {
    try {
      // Vérifier si l'utilisateur existe déjà dans les profils
      const { data: existing, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (existing || checkError) return;

      // Chercher le plan trial
      const { data: trialPlan, error: planError } = await supabase
        .from("plans")
        .select("id")
        .eq("name", "trial")
        .maybeSingle();

      if (planError || !trialPlan) {
        console.error("Plan 'trial' introuvable", planError);
        return;
      }

      // Calculer la date de fin d'essai (14 jours)
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 14);

      // Créer une souscription trial pour l'utilisateur
      const { error: subscriptionError } = await supabase.from("subscriptions").insert({
        user_id: currentUser.id,
        plan_id: trialPlan.id,
        status: "active",
        is_trial: true,
        trial_start_date: new Date().toISOString(),
        trial_end_date: trialEnd.toISOString(),
        end_date: trialEnd.toISOString(),
      });

      if (subscriptionError) {
        console.error("Erreur création souscription trial :", subscriptionError);
      } else {
        console.log("Utilisateur créé avec succès avec plan trial");
      }
    } catch (error) {
      console.error("Erreur dans autoRegisterUser:", error);
    }
  };

  useEffect(() => {
    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        setError(null);

        // Si un utilisateur se connecte, s'assurer que son profil existe et l'auto-enregistrer
        if (event === 'SIGNED_IN' && session?.user) {
          // Auto-enregistrer l'utilisateur avec un petit délai
          setTimeout(() => {
            autoRegisterUser(session.user);
          }, 100);

          setTimeout(async () => {
            try {
              const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', session.user.id)
                .single();

              if (!existingProfile) {
                // Créer le profil s'il n'existe pas
                await supabase
                  .from('profiles')
                  .insert({
                    id: session.user.id,
                    email: session.user.email,
                    full_name: session.user.user_metadata?.full_name || null,
                    company_name: session.user.user_metadata?.company_name || null,
                  });
              }

              // Vérifier et créer l'entrée dans la table users avec le bon rôle
              const { data: existingUser } = await supabase
                .from('users')
                .select('id, role')
                .eq('id', session.user.id)
                .single();

              if (!existingUser) {
                // Déterminer le rôle basé sur l'email
                let userRole = 'admin'; // Rôle admin par défaut
                
                // Si c'est KT CONSULTING & CO TALBI, donner le rôle admin
                if (session.user.email === 'kamel.talbi@ktconsulting.info' || 
                    session.user.email === 'kamel.talbi@yahoo.fr') {
                  userRole = 'admin';
                  console.log('Rôle admin attribué à KT CONSULTING & CO TALBI');
                }

                // Créer l'utilisateur avec le rôle approprié
                await supabase
                  .from('users')
                  .insert({
                    id: session.user.id,
                    email: session.user.email,
                    full_name: session.user.user_metadata?.full_name || null,
                    role: userRole,
                  });
                
                console.log(`Utilisateur créé avec le rôle ${userRole}`);
              } else {
                // Si l'utilisateur existe déjà, vérifier s'il faut mettre à jour son rôle
                if ((session.user.email === 'kamel.talbi@ktconsulting.info' || 
                     session.user.email === 'kamel.talbi@yahoo.fr') && 
                    existingUser.role !== 'admin') {
                  
                  await supabase
                    .from('users')
                    .update({ role: 'admin' })
                    .eq('id', session.user.id);
                  
                  console.log('Rôle mis à jour vers admin pour KT CONSULTING & CO TALBI');
                }
              }
            } catch (error) {
              console.error('Erreur lors de la création du profil ou utilisateur:', error);
            }
          }, 0);
        }
      }
    );

    // Vérifier la session existante
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData?: { full_name?: string; company_name?: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.full_name,
            company_name: userData?.company_name,
          }
        }
      });

      if (error) throw error;

      // Si l'inscription réussit mais nécessite une confirmation
      if (data.user && !data.session) {
        setError("Veuillez vérifier votre email pour confirmer votre compte.");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur lors de l'inscription");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Vérifier si l'utilisateur a un abonnement actif
      if (data.user) {
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', data.user.id)
          .eq('status', 'active')
          .maybeSingle();

        // Si pas d'abonnement actif, rediriger vers checkout
        if (!subscription) {
          // Cette redirection sera gérée dans le Layout
          return;
        }
      }
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur de connexion");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Rediriger vers la page d'accueil après déconnexion
      window.location.href = '/';
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur de déconnexion");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        error,
        signUp,
        signIn,
        signOut,
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
