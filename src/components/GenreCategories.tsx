import React, { useState } from 'react';
import { Movie } from '@/data/movies';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GenreCategoriesProps {
  movies: Movie[];
  onGenreSelect: (genre: string | null) => void;
}

const GenreCategories = ({ movies, onGenreSelect }: GenreCategoriesProps) => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Extract unique genres from all movies
  const allGenres = Array.from(
    new Set(
      movies.flatMap(movie => 
        movie.genre.split(',').map(g => g.trim())
      )
    )
  ).sort();

  const handleGenreClick = (genre: string) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null);
      onGenreSelect(null);
    } else {
      setSelectedGenre(genre);
      onGenreSelect(genre);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      <button 
        onClick={() => scroll('left')} 
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hidden sm:block"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <div 
        ref={scrollRef} 
        className="flex space-x-2 overflow-x-auto scrollbar-hide px-4 py-2"
      >
        {allGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreClick(genre)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedGenre === genre
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      <button 
        onClick={() => scroll('right')} 
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hidden sm:block"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default GenreCategories; 