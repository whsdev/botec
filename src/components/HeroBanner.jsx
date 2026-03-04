import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';

const HeroBanner = ({ movie }) => {
  const { activeProfileId, toggleFavorite } = useProfile();
  const navigate = useNavigate();
  
  const handleAddToList = () => {
    if (activeProfileId) {
      toggleFavorite(activeProfileId, movie.id);
      console.log(`Toggled ${movie.title} in My List`);
    }
  };
  
  return (
    <div className="relative h-[80vh] w-full">
      <div className="absolute inset-0">
        <img 
          src={movie.thumbnail} 
          alt={movie.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0d] via-transparent to-transparent" />
      </div>

      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="absolute bottom-[25%] left-4 md:left-12 max-w-xl"
      >
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-4">{movie.title}</h1>
        <p className="text-lg text-gray-300 mb-6 line-clamp-3">
          {movie.description || "Stream the latest hits exclusively on BOTEC+."}
        </p>
        
        <div className="flex gap-4">
          <button 
            onClick={() => navigate(`/watch/${movie.id}`)}
            className="bg-white text-black px-8 py-2 rounded-sm font-semibold hover:bg-opacity-80 transition"
          >
            Play
          </button>
          <button 
            onClick={handleAddToList}
            className="bg-gray-500/50 text-white px-8 py-2 rounded-sm font-semibold backdrop-blur-md hover:bg-gray-500/70 transition"
          >
            + My List
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroBanner;