import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  // On récupère la fonction signup depuis le contexte d’authentification
  const { signup } = useAuth(); 

  // Gestion des champs du formulaire
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  // Au submit, on appelle signup() et on redirige si tout va bien
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier que les deux mots de passe correspondent
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      // Inscription
      await signup(username, password);

      // On redirige vers /posts (ou /login si tu préfères)
      navigate('/posts');
    } catch (error) {
      console.error('Erreur d’inscription :', error);
      alert('Erreur d’inscription, veuillez réessayer.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Inscription</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-gray-700"
            >
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 
                         rounded-md shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300
                         rounded-md shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label 
              htmlFor="confirmPassword" 
              className="block text-sm font-medium text-gray-700"
            >
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300
                         rounded-md shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md 
                       hover:bg-blue-600 transition duration-300"
          >
            Créer mon compte
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
