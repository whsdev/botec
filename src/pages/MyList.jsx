import React from 'react';
import { useProfile } from '../context/ProfileContext';
import movies from '../data/movies.json';
import MovieCard from '../components/MovieCard';

const MyList = () => {
  const { activeProfile } = useProfile();

  if (!activeProfile) {
    return (
      <div className="text-white p-10">
        No profile selected.
      </div>
    );
  }

  const favoriteMovies = movies.filter(movie =>
    activeProfile.favorites?.includes(movie.id)
  );

  return (
    <div className="min-h-screen bg-black text-white px-8 py-10">
      <h1 className="text-3xl font-bold mb-8">My List</h1>

      {favoriteMovies.length === 0 ? (
        <p className="text-gray-400">
          You haven't added anything yet.
        </p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {favoriteMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyList;