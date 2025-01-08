/*import React from 'react';
import PostsList from './components/PostList';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <PostsList />
      </div>
    </div>
  );
}

export default App;
*/

import React, { useState } from 'react';
import PostsList from './components/PostList';
import Analytics from './components/Analytics';

function App() {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>
        
        {/* Onglets */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            className={`px-4 py-2 font-bold ${
              activeTab === 'posts' ? 'border-b-2 border-blue-500' : ''
            }`}
            onClick={() => setActiveTab('posts')}
          >
            Liste des Posts
          </button>
          <button
            className={`px-4 py-2 font-bold ${
              activeTab === 'analytics' ? 'border-b-2 border-blue-500' : ''
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>

        {/* Contenu */}
        <div>
          {activeTab === 'posts' && <PostsList />}
          {activeTab === 'analytics' && <Analytics />}
        </div>
      </div>
    </div>
  );
}

export default App;
