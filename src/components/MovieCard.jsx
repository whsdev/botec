import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Check } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { useNavigate } from 'react-router-dom';

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
// Put your token in .env instead of hardcoding

const imageCache = new Map();

const MovieCard = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const { addFavorite, removeFavorite, activeProfile } = useProfile();
  const navigate = useNavigate();

  const isInList = activeProfile?.favorites?.includes(movie.id);

  // ✅ Fetch from TMDB only if needed
  useEffect(() => {
    if (imageUrl) return;
    if (hasFetched.current) return;
    hasFetched.current = true;

    if (imageCache.has(movie.title)) {
      setImageUrl(imageCache.get(movie.title));
      return;
    }

    const fetchImage = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movie.title)}`,
          {
            headers: {
              Authorization: `Bearer ${TMDB_TOKEN}`,
              accept: 'application/json'
            }
          }
        );

        const data = await response.json();

        if (data.results?.length > 0) {
          const backdrop = data.results[0].backdrop_path;
          const poster = data.results[0].poster_path;

          const finalImage = backdrop
            ? `https://image.tmdb.org/t/p/w500${backdrop}`
            : poster
              ? `https://image.tmdb.org/t/p/w500${poster}`
              : null;

          if (finalImage) {
            imageCache.set(movie.title, finalImage);
            setImageUrl(finalImage);
          }
        }
      } catch (err) {
        console.error('TMDB fetch failed:', movie.title, err);
      }
    };

    fetchImage();
  }, [movie.title, imageUrl]);

  const handleToggleList = (e) => {
    e.stopPropagation();
    if (!activeProfile) return;

    if (isInList) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie.id);
    }
  };

  const matchPercentage = Math.floor(Math.random() * 15) + 85;

  return (
    <div
      className="relative flex-none w-[200px] md:w-[260px] h-[112px] md:h-[150px] cursor-pointer overflow-visible"

      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Base Thumbnail */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover rounded-md"
        />
      ) : (
        <div className="w-full h-full rounded-md shimmer" />
      )}

      <AnimatePresence>
        {isHovered && imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 0 }}
            animate={{ opacity: 1, scale: 1.15, y: -30 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="absolute top-0 left-0 z-[999] w-full bg-[#181818] rounded-md shadow-2xl border border-[#2a2a2a]"
          >
            <img
              src={imageUrl}
              alt={movie.title}
              className="w-full h-32 object-cover"
            />

            <div className="p-3">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => navigate(`/watch/${movie.id}`)}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200"
                >
                  <Play size={16} className="text-black fill-current ml-0.5" />
                </button>

                <button
                  onClick={handleToggleList}
                  className="w-8 h-8 border border-gray-500 rounded-full flex items-center justify-center hover:border-white transition"
                >
                  {isInList ? (
                    <Check size={16} className="text-white" />
                  ) : (
                    <Plus size={16} className="text-white" />
                  )}
                </button>
              </div>

              <h3 className="text-white font-semibold text-sm truncate mb-1">
                {movie.title}
              </h3>

              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <span className="text-green-500 font-semibold">
                  {matchPercentage}% Match
                </span>
                <span className="border border-gray-600 px-1 text-[9px]">HD</span>
                <span>{movie.year}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieCard;