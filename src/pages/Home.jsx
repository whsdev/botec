import React, { useMemo } from 'react';
import { useProfile } from '../context/ProfileContext';
import moviesData from '../data/movies.json';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';

const Home = () => {
  const { activeProfile } = useProfile();

  const featuredMovie = useMemo(() => {
    const featured = moviesData.filter(m => m.featured);
    return featured.length > 0
      ? featured[Math.floor(Math.random() * featured.length)]
      : moviesData[0];
  }, []);

  const continueWatchingMovies = useMemo(() => {
    if (!activeProfile?.continueWatching) return [];
    return activeProfile.continueWatching
      .map(cw => {
        const movie = moviesData.find(m => m.id === cw.id);
        return movie ? { ...movie, ...cw } : null;
      })
      .filter(Boolean);
  }, [activeProfile]);

  const myListMovies = useMemo(() => {
    if (!activeProfile?.favorites) return [];
    return moviesData.filter(m =>
      activeProfile.favorites.includes(m.id)
    );
  }, [activeProfile]);

  const actionMovies = moviesData.filter(m =>
    m.genres?.includes('Action')
  );

  const holidayMovies = moviesData.filter(m =>
    m.genres?.includes('Holiday')
  );

  return (
    <div className="pt-24">
      {featuredMovie && <HeroBanner movie={featuredMovie} />}

      <MovieRow
        title="Continue Watching"
        movies={continueWatchingMovies}
        showProgress
      />

      <MovieRow
        title="My List"
        movies={myListMovies}
      />

      <MovieRow
        title="Action"
        movies={actionMovies}
      />

      <MovieRow
        title="Holiday"
        movies={holidayMovies}
      />
    </div>
  );
};

export default Home;