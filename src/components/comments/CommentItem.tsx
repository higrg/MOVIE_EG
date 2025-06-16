
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { MovieComment } from './MovieComments';
import { Button, buttonVariants } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
}

interface CommentItemProps {
  comment: MovieComment;
  isOwnComment: boolean;
  onDelete: () => void;
}

const CommentItem = ({ comment, isOwnComment, onDelete }: CommentItemProps) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', comment.user_id)
        .single();
      if (error) console.error('Error fetching profile for comment:', error);
      else setUserProfile(data);
    };
    fetchUserProfile();
  }, [comment.user_id]);

  const getDisplayName = () => {
    if (userProfile?.first_name || userProfile?.last_name) {
      return `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim();
    }
    return `User ${comment.user_id.slice(0, 6)}`;
  };

  return (
    <div className="group flex items-start gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{getDisplayName()}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>
            {isOwnComment && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
                      <span className="sr-only">Delete comment</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>This will permanently delete your comment.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={onDelete} className={buttonVariants({ variant: 'destructive' })}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
        <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">{comment.content}</p>
      </div>
    </div>
  );
};

export default CommentItem;
