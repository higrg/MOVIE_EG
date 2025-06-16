
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface CommentInputProps {
  onPostComment: (content: string) => Promise<void>;
  isLoading: boolean;
}

const CommentInput = ({ onPostComment, isLoading }: CommentInputProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onPostComment(content).then(() => {
        setContent('');
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-2 pt-4 border-t">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a public comment..."
        className="flex-1 bg-transparent"
        rows={1}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <Button type="submit" disabled={!content.trim() || isLoading} size="icon">
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" />
        ) : <Send className="h-4 w-4" />}
        <span className="sr-only">Post comment</span>
      </Button>
    </form>
  );
};

export default CommentInput;
