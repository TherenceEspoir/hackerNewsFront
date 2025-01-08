import React from 'react';
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