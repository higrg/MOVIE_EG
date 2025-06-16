import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MovieRow from '@/components/MovieRow';
import MovieDetailsDialog from '@/components/MovieDetailsDialog';
import GenreCategories from '@/components/GenreCategories';
import { categories, mockMovies, Movie } from '@/data/movies';

const Index = () => {
  const featuredMovie = mockMovies[0];
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMovie(null);
  };

  const handleGenreSelect = (genre: string | null) => {
    setSelectedGenre(genre);
  };

  // Filter categories based on selected genre
  const filteredCategories = categories.map(category => ({
    ...category,
    movies: selectedGenre
      ? category.movies.filter(movie => 
          movie.genre.split(',').map(g => g.trim()).includes(selectedGenre)
        )
      : category.movies
  })).filter(category => category.movies.length > 0);

  return (
    <div className="bg-background min-h-screen text-foreground">
      <Header />
      <main>
        <Hero movie={featuredMovie} onMovieClick={handleMovieClick} />
        <div className="pb-8 md:pb-16">
          <GenreCategories movies={mockMovies} onGenreSelect={handleGenreSelect} />
          {filteredCategories.map(category => (
            <MovieRow 
              key={category.title} 
              title={category.title} 
              movies={category.movies} 
              onMovieClick={handleMovieClick}
            />
          ))}
        </div>
      </main>
      
      <MovieDetailsDialog 
        movie={selectedMovie}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default Index;
