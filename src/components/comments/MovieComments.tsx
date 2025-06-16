
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import CommentInput from './CommentInput';
import CommentList from './CommentList';

export interface MovieComment {
  id: string;
  user_id: string;
  movie_id: number;
  content: string;
  created_at: string;
}

interface MovieCommentsProps {
  movieId: number;
}

const MovieComments = ({ movieId }: MovieCommentsProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<MovieComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const channel = useMemo(() => {
    return supabase.channel(`movie-comments-${movieId}`);
  }, [movieId]);

  useEffect(() => {
    fetchComments();
    
    const subscription = channel
      .on<MovieComment>(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'movie_comments', filter: `movie_id=eq.${movieId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setComments(current => {
              if (current.some(c => c.id === payload.new.id)) return current;
              return [...current, payload.new];
            });
          } else if (payload.eventType === 'DELETE') {
            setComments(current => current.filter(c => c.id !== (payload.old as MovieComment).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [movieId, channel]);

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('movie_comments')
      .select('*')
      .eq('movie_id', movieId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments.');
    } else {
      setComments(data);
    }
    setLoading(false);
  };

  const handlePostComment = async (content: string) => {
    if (!user) {
      toast.error('You must be logged in to comment.');
      return;
    }
    setPosting(true);
    const { error } = await supabase
      .from('movie_comments')
      .insert({ content, movie_id: movieId, user_id: user.id });
    
    setPosting(false);
    if (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const { error } = await supabase
      .from('movie_comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment.');
    } else {
        toast.success('Comment deleted.');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      {loading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">Loading comments...</div>
      ) : (
        <CommentList
          comments={comments}
          currentUserId={user?.id}
          onDeleteComment={handleDeleteComment}
        />
      )}
      {user && <CommentInput onPostComment={handlePostComment} isLoading={posting} />}
    </div>
  );
};

export default MovieComments;
