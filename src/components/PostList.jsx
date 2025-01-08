import React, { useState } from 'react';
import { usePosts } from '../hooks/usePosts';

function PostsList() {
  const { posts, loading, error } = usePosts();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchAuthor, setSearchAuthor] = useState('');
  const postsPerPage = 10;

  // Filtrer les posts par auteur
  const filteredPosts = posts.filter(post => 
    !searchAuthor || 
    post.by.toLowerCase().includes(searchAuthor.toLowerCase())
  );

  // Calculer les posts pour la page courante
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Fonction pour changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="text-center py-4">Chargement...</div>;
  if (error) return <div className="text-red-500 text-center py-4">Erreur : {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Posts HackerNews</h1>

      {/* Barre de recherche */}
      <div className="mb-4 flex">
        <input 
          type="text"
          placeholder="Rechercher par auteur"
          value={searchAuthor}
          onChange={(e) => {
            setSearchAuthor(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-grow p-2 border rounded-l"
        />
        <button 
          onClick={() => {
            setSearchAuthor('');
            setCurrentPage(1);
          }}
          className="bg-gray-200 p-2 rounded-r"
        >
          Effacer
        </button>
      </div>

      {/* Tableau des posts */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Auteur</th>
              <th className="p-3 text-left">Titre</th>
              <th className="p-3 text-left">Lien</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map(post => (
              <tr key={post.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {post.type}
                  </span>
                </td>
                <td className="p-3">{post.by}</td>
                <td className="p-3">{post.title || 'Sans titre'}</td>
                <td className="p-3">
                  {post.url ? (
                    <a 
                      href={post.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Lien
                    </a>
                  ) : (
                    'Pas de lien'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4">
          <span className="text-gray-600">
            Page {currentPage} sur {totalPages}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Précédent
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Message si aucun post */}
      {filteredPosts.length === 0 && (
        <div className="text-center text-gray-500 p-4">
          Aucun post trouvé
        </div>
      )}
    </div>
  );
}

export default PostsList;