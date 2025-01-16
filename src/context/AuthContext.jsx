import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // On lit une fois le localStorage pour initialiser l'état.
  const storedCredentials = localStorage.getItem('basicAuth');
  const initialAuth = Boolean(storedCredentials);

  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);


  /**
   * Tentative de login en Basic Auth
   */
  const login = async (username, password) => {
    try {
      // Encodage en Base64
      const credentials = btoa(`${username}:${password}`);

      // Appel à la route d'authentification
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });

      if (response.ok) {
        // Si le serveur valide, on stocke les credentials dans localStorage
        localStorage.setItem('basicAuth', credentials);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        throw new Error('Échec de connexion');
      }
    } catch (error) {
      console.error('Erreur de connexion :', error);
      setIsAuthenticated(false);
      throw error;
    }
  };


  const signup = async (username, password) => {
    try {

      const credentials = btoa(`${username}:${password}`);
      const response = await fetch('/api/users?username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {

        localStorage.setItem('basicAuth', credentials);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        throw new Error('Échec d\'inscription');
      }
    } catch (error) {
      console.error('Erreur d\'inscription :', error);
      setIsAuthenticated(false);
      throw error;
    }
  };


  /**
   * Déconnexion => supprimer du localStorage
   */
  const logout = () => {
    localStorage.removeItem('basicAuth');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook custom pour utiliser plus facilement le contexte
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
