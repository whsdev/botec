// src/utils/imageFetcher.js
const API_KEY = '6522be5b94401b2545476c3003a3569b'; // Get this for free at themoviedb.org

export const getTmdbImage = async (title) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
    );
    const data = await response.json();
    
    // Grab the backdrop_path from the very first search result
    if (data.results && data.results.length > 0) {
      return `https://image.tmdb.org/t/p/original${data.results[0].backdrop_path}`;
    }
    return null; 
  } catch (error) {
    console.error("Error fetching image for:", title, error);
    return null;
  }
};