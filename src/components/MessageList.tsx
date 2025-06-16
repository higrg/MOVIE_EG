
import { CommunityMessage } from "@/components/CommunityChat";
import MessageItem from "@/components/MessageItem";

interface MessageListProps {
  messages: CommunityMessage[];
  currentUserId?: string;
  onDeleteMessage: (messageId: string) => void;
}

const MessageList = ({ messages, currentUserId, onDeleteMessage }: MessageListProps) => {
  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <div className="mb-2">💬</div>
        <p>No messages yet.</p>
        <p className="text-sm">Be the first to start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
          style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
        >
          <MessageItem
            message={message}
            isOwnMessage={message.user_id === currentUserId}
            onDelete={() => onDeleteMessage(message.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default MessageList;
