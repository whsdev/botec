import React from 'react';
import MovieCard from './MovieCard';

const MovieRow = ({ title, movies, showProgress = false }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-8 px-4 md:px-12">
      <h2 className="text-xl font-semibold mb-4 text-gray-200">{title}</h2>
      
      {/* Horizontal Scroll Container */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 scroll-smooth">
        {movies.map((movie) => (
          <div key={movie.id} className="min-w-[200px] md:min-w-[280px] flex-shrink-0">
            <MovieCard 
              movie={movie} 
              showProgress={showProgress} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieRow;