
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string, messageType: string, movieTitle?: string) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [content, setContent] = useState("");
  const [messageType, setMessageType] = useState("general");
  const [movieTitle, setMovieTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSendMessage(
      content.trim(),
      messageType,
      messageType === "recommendation" ? movieTitle : undefined
    );

    setContent("");
    setMovieTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Select value={messageType} onValueChange={setMessageType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General Chat</SelectItem>
            <SelectItem value="recommendation">Movie Recommendation</SelectItem>
            <SelectItem value="feedback">Feedback</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {messageType === "recommendation" && (
        <Input
          placeholder="Movie title..."
          value={movieTitle}
          onChange={(e) => setMovieTitle(e.target.value)}
          className="text-sm"
        />
      )}

      <div className="flex gap-2">
        <Input
          placeholder="Type your message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!content.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;
