
-- Create a table for movie comments
CREATE TABLE public.movie_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  movie_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.movie_comments ENABLE ROW LEVEL SECURITY;

-- Create policy that allows authenticated users to view all comments
CREATE POLICY "Authenticated users can view all comments"
  ON public.movie_comments
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy that allows authenticated users to create comments
CREATE POLICY "Authenticated users can create comments"
  ON public.movie_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to update their own comments
CREATE POLICY "Users can update their own comments"
  ON public.movie_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy that allows users to delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON public.movie_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable realtime for live comment updates
ALTER TABLE public.movie_comments REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.movie_comments;
