
import { MovieComment } from './MovieComments';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: MovieComment[];
  currentUserId?: string;
  onDeleteComment: (commentId: string) => void;
}

const CommentList = ({ comments, currentUserId, onDeleteComment }: CommentListProps) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isOwnComment={comment.user_id === currentUserId}
          onDelete={() => onDeleteComment(comment.id)}
        />
      ))}
    </div>
  );
};

export default CommentList;
