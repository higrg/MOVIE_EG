
import { useState } from 'react';
import Header from '@/components/Header';
import MovieDetailsDialog from '@/components/MovieDetailsDialog';
import { useWatchlist } from '@/hooks/useWatchlist';
import { mockMovies, Movie } from '@/data/movies';
import MovieCard from '@/components/MovieCard';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const WatchlistPage = () => {
  const { user } = useAuth();
  const { watchlist, loading } = useWatchlist();
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMovie(null);
  };

  const watchlistMovies = watchlist
    .map(item => mockMovies.find(movie => movie.id === item.movie_id))
    .filter((movie): movie is Movie => movie !== undefined);

  const renderContent = () => {
    if (!user) {
      return (
        <div className="text-center py-20">
          <p className="text-lg mb-4">Please sign in to view your watchlist.</p>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }
    
    if (watchlistMovies.length === 0) {
      return (
        <div className="text-center py-20">
          <p className="text-lg">Your watchlist is empty.</p>
          <p className="text-muted-foreground mt-2">Add movies to your watchlist to see them here.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {watchlistMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} onClick={handleMovieClick} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-background min-h-screen text-foreground">
      <Header />
      <main className="pt-24 px-4 md:px-8 lg:px-12 pb-16">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8">My Watchlist</h1>
        {renderContent()}
      </main>
      
      <MovieDetailsDialog 
        movie={selectedMovie}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default WatchlistPage;
