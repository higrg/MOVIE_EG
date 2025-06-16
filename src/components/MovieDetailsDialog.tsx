
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Star, Calendar, Clock, User, Plus, Check } from "lucide-react";
import { Movie } from "@/data/movies";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useState } from "react";
import TrailerDialog from "./TrailerDialog";
import MovieComments from "./comments/MovieComments";

interface MovieDetailsDialogProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

const MovieDetailsDialog = ({ movie, isOpen, onClose }: MovieDetailsDialogProps) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  if (!movie) return null;

  const handlePlayTrailer = () => {
    setIsTrailerOpen(true);
  };

  const handleWatchlistToggle = () => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie.id, movie.title, movie.posterUrl);
    }
  };

  const isMovieInWatchlist = isInWatchlist(movie.id);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>{movie.title}</DialogTitle>
          </DialogHeader>
          <div className="relative">
            {/* Backdrop Image */}
            <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
              <img 
                src={movie.backdropUrl} 
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 p-2 rounded-full transition-colors z-10"
                aria-label="Close"
              >
                <span className="text-white text-xl">×</span>
              </button>
              
              {/* Movie Title Overlay */}
              <div className="absolute bottom-4 left-4 md:left-6 lg:left-8 text-white">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{movie.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{movie.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{movie.year}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{movie.duration}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 lg:p-8 space-y-6">
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="flex-1 sm:flex-none" onClick={handlePlayTrailer} disabled={!movie.trailerUrl}>
                  <Play className="mr-2 h-5 w-5" />
                  Play
                </Button>
                <Button 
                  size="lg" 
                  variant={isMovieInWatchlist ? "default" : "secondary"} 
                  className="flex-1 sm:flex-none"
                  onClick={handleWatchlistToggle}
                >
                  {isMovieInWatchlist ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      In Watchlist
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-5 w-5" />
                      Add to Watchlist
                    </>
                  )}
                </Button>
              </div>

              {/* Movie Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Description */}
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
                    <p className="text-muted-foreground leading-relaxed">{movie.description}</p>
                  </div>

                  {/* Trailer */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Trailer</h3>
                    <div className="aspect-video rounded-lg overflow-hidden bg-black">
                      <iframe
                        src={movie.trailerUrl}
                        title={`${movie.title} Trailer`}
                        className="w-full h-full"
                        allowFullScreen
                        frameBorder="0"
                      />
                    </div>
                  </div>
                  
                  {/* Comments Section */}
                  <div className="pt-4 border-t">
                     <MovieComments movieId={movie.id} />
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Details</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Genre:</span>
                        <p className="mt-1">{movie.genre}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Director:</span>
                        <p className="mt-1 flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {movie.director}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Cast:</span>
                        <div className="mt-1 space-y-1">
                          {movie.cast.map((actor, index) => (
                            <p key={index} className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {actor}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Movie Poster */}
                  <div className="hidden lg:block">
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title}
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TrailerDialog
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerUrl={movie.trailerUrl}
        movieTitle={movie.title}
      />
    </>
  );
};

export default MovieDetailsDialog;
