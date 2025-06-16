
import { Movie } from '@/data/movies';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  return (
    <div 
      className="group relative flex-shrink-0 w-32 sm:w-40 md:w-48 lg:w-56 rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10"
      onClick={() => onClick(movie)}
    >
      <img 
        src={movie.posterUrl} 
        alt={movie.title} 
        className="w-full h-auto aspect-[2/3] object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-4">
        <h3 className="text-white text-sm md:text-lg font-bold mb-1 md:mb-2">{movie.title}</h3>
        <div className="flex items-center justify-between text-xs md:text-sm text-white/80">
          <span>⭐ {movie.rating}</span>
          <span>{movie.year}</span>
        </div>
        <p className="text-white/70 text-xs md:text-sm mt-1 md:mt-2 line-clamp-2 leading-tight">
          {movie.description.substring(0, 80)}...
        </p>
      </div>
      
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 md:p-4">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-l-[8px] md:border-l-[10px] border-r-0 border-t-[5px] md:border-t-[6px] border-b-[5px] md:border-b-[6px] border-transparent border-l-black ml-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
