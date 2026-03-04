import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moviesData from '../data/movies.json';
import { useProfile } from '../context/ProfileContext';

const Watch = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { updateContinueWatching } = useProfile();

  const movie = moviesData.find(m => m.id === movieId);

  if (!movie) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl mb-4">Movie not found: {movieId}</h1>
        <button onClick={() => navigate('/home')} className="text-brandGold underline">Go Home</button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black relative">
      <button 
        onClick={() => navigate('/home')}
        className="absolute top-8 left-8 z-50 text-white hover:text-brandGold flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      <iframe
        src={movie.videoUrl}
        className="w-full h-full border-none"
        allow="autoplay"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Watch;