import React from 'react';
import moviesData from '../data/movies.json';
import MovieCard from './MovieCard';
import { motion } from 'framer-motion';

const SearchResults = ({ query, clearSearch, onSelect }) => {
  const results = moviesData.filter(movie =>
    movie.title.toLowerCase().includes(query.toLowerCase()) ||
    movie.genres?.some(g =>
      g.toLowerCase().includes(query.toLowerCase())
    ) ||
    movie.cast?.some(c =>
      c.toLowerCase().includes(query.toLowerCase())
    )
  );

  const handleMovieClick = () => {
    // Call onSelect to clear the search query and hide results
    onSelect();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="
        fixed 
        top-[80px] 
        left-0 
        right-0 
        bottom-0 
        z-[90] 
        bg-[#0a0a0d]/95 
        backdrop-blur-md 
        px-8 
        md:px-16 
        pt-10 
        overflow-y-auto
      "
    >
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-2xl font-light text-gray-400">
          Search results for:{" "}
          <span className="text-white">"{query}"</span>
        </h2>

        <button
          onClick={clearSearch}
          className="
            text-gray-400 
            hover:text-[#C6A85C] 
            uppercase 
            tracking-widest 
            text-xs 
            transition-colors
          "
        >
          Close [x]
        </button>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {results.map(movie => (
            <div key={movie.id} onClick={handleMovieClick}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center pt-20">
          <p className="text-gray-500 text-lg italic">
            "Your search didn't have any matches."
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Try a different title or genre.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default SearchResults;