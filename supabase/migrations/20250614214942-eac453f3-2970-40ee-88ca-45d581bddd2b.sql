
-- Create a table for community messages
CREATE TABLE public.community_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'general', -- 'general', 'recommendation', 'feedback'
  movie_title TEXT, -- For movie recommendations
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;

-- Create policy that allows authenticated users to view all messages
CREATE POLICY "Authenticated users can view all messages" 
  ON public.community_messages 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Create policy that allows authenticated users to insert their own messages
CREATE POLICY "Authenticated users can create messages" 
  ON public.community_messages 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to update their own messages
CREATE POLICY "Users can update their own messages" 
  ON public.community_messages 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy that allows users to delete their own messages
CREATE POLICY "Users can delete their own messages" 
  ON public.community_messages 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable realtime for live chat updates
ALTER TABLE public.community_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_messages;
