import { useState, useEffect } from 'react';
import axios from 'axios';

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [postAnalytics, setPostAnalytics] = useState({});
  const [postAnalyticsByType, setPostAnalyticsByType] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [postsResponse, analyticsResponse,analyticsByTypeResponse] = await Promise.all([
            axios.get('/api'),
            axios.get('/api/analytics/posts-by-date'),
            axios.get('/api/analytics/posts-by-type')
          ]);
        
        console.log(analyticsResponse.data);
        setPosts(postsResponse.data);
        setPostAnalytics(analyticsResponse.data);
        setPostAnalyticsByType(analyticsByTypeResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts,postAnalytics,postAnalyticsByType, loading, error };
}