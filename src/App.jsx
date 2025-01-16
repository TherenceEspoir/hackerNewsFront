import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import PostsList from './components/PostList';
import Analytics from './components/Analytics';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage'; // <-- IMPORTER ta page d'inscription
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');

  const handleLogout = () => {
    logout();
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Page de login sur "/" */}
          <Route path="/" element={<LoginPage />} />

          {/* Page d'inscription sur "/signup" */}
          <Route path="/signup" element={<SignupPage />} />

          {/* "/posts" => protégé */}
          <Route
            path="/posts"
            element={
              isAuthenticated ? (
                <div className="container mx-auto px-4 py-8">
                  {/* Bouton de déconnexion */}
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md 
                                 hover:bg-gray-400 transition duration-300"
                    >
                      Se Déconnecter
                    </button>
                  </div>

                  <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>
                  {/* Onglets */}
                  <div className="flex justify-center space-x-4 mb-8">
                    <Link
                      to="/posts"
                      className={`px-4 py-2 font-bold ${
                        activeTab === 'posts' ? 'border-b-2 border-blue-500' : ''
                      }`}
                      onClick={() => setActiveTab('posts')}
                    >
                      Liste des Posts
                    </Link>
                    <Link
                      to="/analytics"
                      className={`px-4 py-2 font-bold ${
                        activeTab === 'analytics' ? 'border-b-2 border-blue-500' : ''
                      }`}
                      onClick={() => setActiveTab('analytics')}
                    >
                      Analytics
                    </Link>
                  </div>
                  {/* Contenu */}
                  <PostsList />
                </div>
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* "/analytics" => protégé */}
          <Route
            path="/analytics"
            element={
              isAuthenticated ? (
                <div className="container mx-auto px-4 py-8">
                  <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>
                  {/* Onglets */}
                  <div className="flex justify-center space-x-4 mb-8">
                    <Link
                      to="/posts"
                      className={`px-4 py-2 font-bold ${
                        activeTab === 'posts' ? 'border-b-2 border-blue-500' : ''
                      }`}
                      onClick={() => setActiveTab('posts')}
                    >
                      Liste des Posts
                    </Link>
                    <Link
                      to="/analytics"
                      className={`px-4 py-2 font-bold ${
                        activeTab === 'analytics' ? 'border-b-2 border-blue-500' : ''
                      }`}
                      onClick={() => setActiveTab('analytics')}
                    >
                      Analytics
                    </Link>
                  </div>
                  {/* Contenu */}
                  <Analytics />
                </div>
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
