import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageInput from "@/components/MessageInput";
import MessageList from "@/components/MessageList";
import { toast } from "sonner";

export interface CommunityMessage {
  id: string;
  user_id: string;
  content: string;
  message_type: string;
  movie_title: string | null;
  created_at: string;
}

const CommunityChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    const unsubscribe = setupRealtimeSubscription();
    return unsubscribe;
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      console.log("Fetching community messages...");
      const { data, error } = await supabase
        .from("community_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(100);

      if (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }
      
      console.log("Fetched messages:", data);
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    console.log("Setting up realtime subscription...");
    
    const channel = supabase
      .channel("community-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "community_messages",
        },
        (payload) => {
          console.log("New message received:", payload);
          const newMessage = payload.new as CommunityMessage;
          
          setMessages((prevMessages) => {
            // Check if message already exists to prevent duplicates
            const messageExists = prevMessages.some(msg => msg.id === newMessage.id);
            if (messageExists) {
              console.log("Message already exists, skipping duplicate");
              return prevMessages;
            }
            
            console.log("Adding new message to list");
            return [...prevMessages, newMessage];
          });
          
          // Show a subtle notification for messages from other users
          if (newMessage.user_id !== user?.id) {
            toast.success("New message received");
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "community_messages",
        },
        (payload) => {
          console.log("Message updated:", payload);
          const updatedMessage = payload.new as CommunityMessage;
          
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "community_messages",
        },
        (payload) => {
          console.log("Message deleted:", payload);
          const deletedMessage = payload.old as CommunityMessage;
          
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== deletedMessage.id)
          );
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    return () => {
      console.log("Cleaning up realtime subscription");
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (content: string, messageType: string, movieTitle?: string) => {
    if (!user) {
      toast.error("You must be logged in to send messages");
      return;
    }

    try {
      console.log("Sending message:", { content, messageType, movieTitle });
      
      const { error } = await supabase.from("community_messages").insert({
        user_id: user.id,
        content,
        message_type: messageType,
        movie_title: movieTitle || null,
      });

      if (error) {
        console.error("Error sending message:", error);
        throw error;
      }
      
      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("community_messages")
        .delete()
        .eq("id", messageId);

      if (error) {
        toast.error("Failed to delete message.");
        console.error("Error deleting message:", error);
        throw error;
      }
      toast.success("Message deleted.");
    } catch (error) {
      // The toast is shown above if there is an error.
      console.error("Error deleting message:", error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading messages...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Community Chat</CardTitle>
        <p className="text-sm text-muted-foreground">
          {messages.length} message{messages.length !== 1 ? 's' : ''} • Real-time updates enabled
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
          <MessageList
            messages={messages}
            currentUserId={user?.id}
            onDeleteMessage={deleteMessage}
          />
        </ScrollArea>
        <div className="p-6 border-t">
          <MessageInput onSendMessage={sendMessage} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityChat;
