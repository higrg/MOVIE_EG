
-- Create watchlist table for storing user movie watchlists
CREATE TABLE public.watchlist (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id integer NOT NULL,
  movie_title text NOT NULL,
  movie_poster_url text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, movie_id)
);

-- Enable Row Level Security
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own watchlist" ON public.watchlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own watchlist" ON public.watchlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own watchlist" ON public.watchlist
  FOR DELETE USING (auth.uid() = user_id);
