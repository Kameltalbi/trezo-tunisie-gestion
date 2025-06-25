
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalAuth } from './LocalAuthContext';

// Ce contexte est maintenant un wrapper autour de LocalAuthContext pour compatibilité
const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const localAuth = useLocalAuth();

  return (
    <AuthContext.Provider value={localAuth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
