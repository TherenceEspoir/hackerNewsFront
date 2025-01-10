import axios from 'axios';
import React, { createContext, useState, useContext } from 'react';

// 1) On crée le contexte
const AuthContext = createContext();

// 2) On crée le Provider qui va envelopper l'appli
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simule un login asynchrone
  const login = async (username, password) => {
    try {
      const credentials = btoa(`${username}:${password}`);
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        throw new Error('Echec de connexion');
      }
    } catch (error) {
      console.error('Erreur de connexion :', error);
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 3) Un hook custom pour utiliser plus facilement le contexte
export const useAuth = () => {
  return useContext(AuthContext);
};
