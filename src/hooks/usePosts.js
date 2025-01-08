import { useState, useEffect } from 'react';
import axios from 'axios';

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [postAnalytics, setPostAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [postsResponse, analyticsResponse] = await Promise.all([
            axios.get('/api'),
            axios.get('/api/analytics/posts-by-date'),
          ]);
        
        console.log(analyticsResponse.data);
        setPosts(postsResponse.data);
        setPostAnalytics(analyticsResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts,postAnalytics, loading, error };
}