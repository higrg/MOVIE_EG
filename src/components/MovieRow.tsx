
import { Movie } from '@/data/movies';
import MovieCard from './MovieCard';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

const MovieRow = ({ title, movies, onMovieClick }: MovieRowProps) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    }

  return (
    <div className="py-4 md:py-6 lg:py-8 space-y-3 md:space-y-4">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold px-4 md:px-8 lg:px-12">{title}</h2>
      <div className="relative group">
        <button 
          onClick={() => scroll('left')} 
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 p-1 md:p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hidden sm:block"
        >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        <div 
          ref={scrollRef} 
          className="flex space-x-2 md:space-x-4 overflow-x-scroll scrollbar-hide p-4 md:p-6 lg:px-12 pb-4"
        >
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
          ))}
        </div>
        <button 
          onClick={() => scroll('right')} 
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 p-1 md:p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hidden sm:block"
        >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
