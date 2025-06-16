
-- Create a new storage bucket named "movies" and make it public.
insert into storage.buckets
  (id, name, public)
values
  ('movies', 'movies', true);

-- Create a policy to allow public read access to all files in the "movies" bucket.
CREATE POLICY "Allow public read access to movies" ON storage.objects FOR SELECT USING (bucket_id = 'movies');
