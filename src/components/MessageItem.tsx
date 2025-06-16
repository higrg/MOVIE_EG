import { useEffect, useState } from "react";
import { CommunityMessage } from "@/components/CommunityChat";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Trash2 } from "lucide-react";
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
import { Button, buttonVariants } from "@/components/ui/button";

interface MessageItemProps {
  message: CommunityMessage;
  isOwnMessage: boolean;
  onDelete: () => void;
}

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
}

const MessageItem = ({ message, isOwnMessage, onDelete }: MessageItemProps) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, [message.user_id]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', message.user_id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const getDisplayName = () => {
    if (userProfile?.first_name || userProfile?.last_name) {
      return `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim();
    }
    return `User ${message.user_id.slice(0, 8)}`;
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case "recommendation":
        return "bg-green-500/20 text-green-200 border-green-500/30";
      case "feedback":
        return "bg-blue-500/20 text-blue-200 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-200 border-gray-500/30";
    }
  };

  const getMessageTypeLabel = (type: string) => {
    switch (type) {
      case "recommendation":
        return "Movie Recommendation";
      case "feedback":
        return "Feedback";
      default:
        return "General";
    }
  };

  return (
    <div className={cn("group flex items-end gap-2", isOwnMessage ? "justify-end flex-row-reverse" : "justify-start")}>
      <Card className={cn("max-w-[70%]", isOwnMessage ? "bg-primary/10" : "")}>
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn("text-xs font-medium", isOwnMessage ? "text-primary" : "text-muted-foreground")}>
              {isOwnMessage ? "You" : getDisplayName()}
            </span>
            <Badge
              variant="outline"
              className={getMessageTypeColor(message.message_type)}
            >
              {getMessageTypeLabel(message.message_type)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
            </span>
          </div>
          
          {message.movie_title && (
            <div className="text-sm text-primary font-medium mb-2">
              🎬 {message.movie_title}
            </div>
          )}
          
          <p className="text-foreground">{message.content}</p>
        </CardContent>
      </Card>
      {isOwnMessage && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete message</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className={buttonVariants({ variant: "destructive" })}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default MessageItem;
