
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockMovies } from '@/data/movies';
import { ArrowLeft } from 'lucide-react';
import NotFound from './NotFound';
import { useEffect } from 'react';

const PlayerPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const movie = mockMovies.find(m => m.id.toString() === movieId);

  useEffect(() => {
    if (!movie || !movie.movieUrl) {
      navigate('/');
    }
  }, [movie, navigate]);

  if (!movie || !movie.movieUrl) {
    return null; // or a loading spinner, before redirecting
  }

  return (
    <div className="bg-black h-screen w-screen text-white">
      <nav className="fixed w-full p-4 z-10 flex flex-row items-center gap-8 bg-black bg-opacity-70">
        <Link to="/">
          <ArrowLeft className="w-4 md:w-10 cursor-pointer hover:opacity-80 transition" />
        </Link>
        <p className="text-xl md:text-3xl font-bold">
          <span className="font-light">Watching:</span> {movie.title}
        </p>
      </nav>
      <video
        className="h-full w-full"
        autoPlay
        controls
        src={movie.movieUrl}
      ></video>
    </div>
  );
};

export default PlayerPage;
