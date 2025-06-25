
// Client local pour remplacer Supabase
// Toutes les fonctionnalités sont maintenant gérées par LocalAuthContext et localStorage

export const supabase = null; // Pour compatibilité temporaire

export const localClient = {
  // Placeholder pour compatibilité, toute la logique est maintenant dans localStorageService
  from: (table: string) => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ error: null }),
  }),
  
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signUp: () => Promise.resolve({ data: null, error: null }),
    signInWithPassword: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  }
};
