const STORAGE_KEY = 'botec_profiles';

// 1. Get all profiles or initialize default state [cite: 4, 7]
export const getProfiles = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    // Return a valid default object if nothing exists yet
    return { activeProfileId: null, profiles: [] };
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return { activeProfileId: null, profiles: [] };
  }
};

// 2. Save entire state back to LocalStorage 
export const saveProfiles = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Add these to your existing utils/storage.js

// Toggle a movie in the user's "My List"
export const toggleFavorite = (profileId, movieId) => {
  const data = getProfiles();
  const profile = data.profiles.find(p => p.id === profileId);
  
  if (!profile) return;

  // Initialize favorites array if it doesn't exist (hallucination protection)
  if (!profile.favorites) profile.favorites = [];

  const index = profile.favorites.indexOf(movieId);
  if (index > -1) {
    // Remove if already there
    profile.favorites.splice(index, 1);
  } else {
    // Add if not there
    profile.favorites.push(movieId);
  }

  saveProfiles(data);
  return profile.favorites;
};

// Check if a movie is already in the list
export const isFavorite = (profileId, movieId) => {
  const data = getProfiles();
  const profile = data.profiles.find(p => p.id === profileId);
  return profile?.favorites?.includes(movieId) || false;
};

// 3. Update 'Continue Watching' for a specific movie [cite: 4, 5]
export const updateProgress = (profileId, movieId, timestamp, duration) => {
  const data = getProfiles();
  const profile = data.profiles.find(p => p.id === profileId);
  
  if (!profile) return;

  // Remove if 95% completed per spec [cite: 5]
  if (timestamp / duration >= 0.95) {
    profile.continueWatching = profile.continueWatching.filter(m => m.id !== movieId);
  } else {
    const index = profile.continueWatching.findIndex(m => m.id === movieId);
    const progressData = { id: movieId, timestamp, lastUpdated: Date.now() };

    if (index > -1) {
      profile.continueWatching[index] = progressData;
    } else {
      profile.continueWatching.unshift(progressData);
    }
  }
  
  saveProfiles(data);
};