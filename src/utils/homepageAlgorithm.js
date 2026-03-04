export function buildHomepageData(movies, profile) {
  const usedIds = new Set();

  const safeMovies = [...movies];

  // ---------- HERO ----------
  const featuredMovies = safeMovies.filter(m => m.featured);
  const heroPool = featuredMovies.length > 0 ? featuredMovies : safeMovies;

  const weekSeed = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
  const heroIndex = weekSeed % heroPool.length;
  const hero = heroPool[heroIndex];

  usedIds.add(hero.id);

  // ---------- CONTINUE WATCHING ----------
  const continueWatching = profile?.continueWatching || [];
  continueWatching.forEach(m => usedIds.add(m.id));

  // ---------- BECAUSE YOU WATCHED ----------
  const watchedIds = profile?.recentlyWatched || [];
  const watchedMovies = safeMovies.filter(m => watchedIds.includes(m.id));

  const genreCount = {};
  const franchiseCount = {};

  watchedMovies.forEach(movie => {
    movie.genres?.forEach(g => {
      genreCount[g] = (genreCount[g] || 0) + 1;
    });

    if (movie.franchise) {
      franchiseCount[movie.franchise] =
        (franchiseCount[movie.franchise] || 0) + 1;
    }
  });

  const topGenre = Object.entries(genreCount).sort((a,b)=>b[1]-a[1])[0]?.[0];
  const topFranchise = Object.entries(franchiseCount).sort((a,b)=>b[1]-a[1])[0]?.[0];

  let becauseYouWatched = [];

  if (topFranchise) {
    becauseYouWatched = safeMovies.filter(
      m =>
        m.franchise === topFranchise &&
        !usedIds.has(m.id)
    ).slice(0, 15);
  }

  if (becauseYouWatched.length < 10 && topGenre) {
    const genreMatches = safeMovies.filter(
      m =>
        m.genres?.includes(topGenre) &&
        !usedIds.has(m.id)
    );

    becauseYouWatched = [
      ...becauseYouWatched,
      ...genreMatches
    ].slice(0, 15);
  }

  becauseYouWatched.forEach(m => usedIds.add(m.id));

  // ---------- TRENDING (Weekly Rotation) ----------
  const shuffled = [...safeMovies]
    .filter(m => !usedIds.has(m.id))
    .sort((a, b) => {
      const seedA = hash(a.id + weekSeed);
      const seedB = hash(b.id + weekSeed);
      return seedA - seedB;
    });

  const trending = shuffled.slice(0, 15);
  trending.forEach(m => usedIds.add(m.id));

  // ---------- RECENTLY ADDED ----------
  const recentlyAdded = [...safeMovies]
    .filter(m => !usedIds.has(m.id))
    .sort((a,b)=>(b.addedAt || 0) - (a.addedAt || 0))
    .slice(0, 15);

  recentlyAdded.forEach(m => usedIds.add(m.id));

  // ---------- GENRE ROWS ----------
  const genreRows = {};
  safeMovies.forEach(movie => {
    movie.genres?.forEach(genre => {
      if (!genreRows[genre]) genreRows[genre] = [];
      if (!usedIds.has(movie.id)) {
        genreRows[genre].push(movie);
      }
    });
  });

  const finalGenreRows = Object.entries(genreRows)
    .map(([genre, items]) => ({
      title: genre,
      movies: items.slice(0, 15)
    }))
    .filter(row => row.movies.length >= 6);

  return {
    hero,
    continueWatching,
    becauseYouWatched,
    trending,
    recentlyAdded,
    genreRows: finalGenreRows.slice(0, 4)
  };
}

// Simple stable hash
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}