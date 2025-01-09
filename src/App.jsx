import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PostsList from './components/PostList';
import Analytics from './components/Analytics';
import LoginPage from './components/LoginPage';

function App() {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>
          {/* Onglets */}
          <div className="flex justify-center space-x-4 mb-8">
            <Link
              to="/"
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
          <Routes>
            <Route path="/" element={<PostsList />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;