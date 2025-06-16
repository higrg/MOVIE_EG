
import { Play, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Movie } from '@/data/movies';
import { useState } from 'react';
import TrailerDialog from './TrailerDialog';

interface HeroProps {
  movie: Movie;
  onMovieClick?: (movie: Movie) => void;
}

const Hero = ({ movie, onMovieClick }: HeroProps) => {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const handleMoreInfoClick = () => {
    if (onMovieClick) {
      onMovieClick(movie);
    }
  };

  const handlePlayTrailer = () => {
    setIsTrailerOpen(true);
  };

  return (
    <>
      <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[85vh] text-white">
        <div className="absolute inset-0">
          <img src={movie.backdropUrl} alt={movie.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-end h-full p-4 md:p-8 lg:p-12 space-y-3 md:space-y-4 max-w-xl lg:max-w-2xl">
          <div className="space-y-2 md:space-y-3">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black animate-fade-in" style={{ animationDelay: '0.2s' }}>{movie.title}</h2>
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm md:text-base text-muted-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <span className="flex items-center gap-1">⭐ {movie.rating}</span>
              <span>{movie.year}</span>
              <span className="hidden sm:inline">{movie.duration}</span>
              {movie.genre && <span className="hidden md:inline">{movie.genre.split(',')[0]}</span>}
            </div>
          </div>
          <p className="text-sm md:text-base lg:text-lg leading-relaxed animate-fade-in max-w-lg" style={{ animationDelay: '0.6s' }}>
            {movie.description.length > 200 ? `${movie.description.substring(0, 200)}...` : movie.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Button size="lg" className="flex-1 sm:flex-none" onClick={handlePlayTrailer} disabled={!movie.trailerUrl}>
              <Play className="mr-2 h-5 w-5 md:h-6 md:w-6" /> Play
            </Button>
            <Button size="lg" variant="secondary" className="flex-1 sm:flex-none" onClick={handleMoreInfoClick}>
              <Info className="mr-2 h-5 w-5 md:h-6 md:w-6" /> More Info
            </Button>
          </div>
        </div>
      </div>
      
      <TrailerDialog
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerUrl={movie.trailerUrl}
        movieTitle={movie.title}
      />
    </>
  );
};

export default Hero;
