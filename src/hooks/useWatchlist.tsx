
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface WatchlistItem {
  id: string;
  user_id: string;
  movie_id: number;
  movie_title: string;
  movie_poster_url: string;
  created_at: string;
}

export const useWatchlist = () => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    } else {
      setWatchlist([]);
      setLoading(false);
    }
  }, [user]);

  const fetchWatchlist = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched watchlist:', data);
      setWatchlist(data || []);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      toast.error('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (movieId: number, movieTitle: string, moviePosterUrl: string) => {
    if (!user) {
      toast.error('Please log in to add movies to your watchlist');
      return;
    }

    try {
      // Check if movie is already in watchlist
      const existingItem = watchlist.find(item => item.movie_id === movieId);
      if (existingItem) {
        toast.error('Movie is already in your watchlist');
        return;
      }

      console.log('Adding to watchlist:', { movieId, movieTitle, moviePosterUrl, userId: user.id });

      const { error } = await supabase
        .from('watchlist')
        .insert({
          user_id: user.id,
          movie_id: movieId,
          movie_title: movieTitle,
          movie_poster_url: moviePosterUrl,
        });

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      toast.success('Added to watchlist');
      await fetchWatchlist(); // Refresh the list
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      toast.error('Failed to add to watchlist');
    }
  };

  const removeFromWatchlist = async (movieId: number) => {
    if (!user) return;

    try {
      console.log('Removing from watchlist:', { movieId, userId: user.id });

      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movieId);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      toast.success('Removed from watchlist');
      await fetchWatchlist(); // Refresh the list
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast.error('Failed to remove from watchlist');
    }
  };

  const isInWatchlist = (movieId: number) => {
    return watchlist.some(item => item.movie_id === movieId);
  };

  return {
    watchlist,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  };
};
