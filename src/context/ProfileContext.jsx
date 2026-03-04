import { createContext, useContext, useEffect, useState } from 'react';

const ProfileContext = createContext();

const STORAGE_KEY = 'botec_profiles_v2';

export function ProfileProvider({ children }) {
  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------- INIT ----------
// src/context/ProfileContext.jsx

useEffect(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.profiles) setProfiles(parsed.profiles);
      if (parsed.activeProfileId) setActiveProfileId(parsed.activeProfileId);
    }
  } catch (err) {
    console.error("Failed to load profiles:", err);
    localStorage.removeItem(STORAGE_KEY);
  } finally {
    // THIS IS CRITICAL: Always set loading to false even if it fails
    setLoading(false); 
  }
}, []);

  // ---------- SAVE ----------
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ profiles, activeProfileId })
      );
    }
  }, [profiles, activeProfileId, loading]);

  // ---------- HELPERS ----------
  const activeProfile = profiles.find(p => p.id === activeProfileId) || null;

  const updateProfileById = (id, updater) => {
    setProfiles(prev =>
      prev.map(profile =>
        profile.id === id ? updater(profile) : profile
      )
    );
  };

  // ---------- PROFILE MANAGEMENT ----------
  const createProfile = (name, avatar) => {
    if (profiles.length >= 5) return;

    const newProfile = {
      id: Date.now().toString(),
      name,
      avatar,
      favorites: [],
      continueWatching: [],
      recentlyWatched: []
    };

    setProfiles(prev => [...prev, newProfile]);
  };

  const deleteProfile = (id) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    if (activeProfileId === id) {
      setActiveProfileId(null);
    }
  };

  const updateProfile = (id, updates) => {
    updateProfileById(id, profile => ({
      ...profile,
      ...updates
    }));
  };

  const selectProfile = (id) => {
    setActiveProfileId(id);
  };

  const logout = () => {
    setActiveProfileId(null);
  };

  // ---------- FAVORITES ----------
  const addFavorite = (movieId) => {
    if (!activeProfile) return;

    updateProfileById(activeProfile.id, profile => ({
      ...profile,
      favorites: [...new Set([...profile.favorites, movieId])]
    }));
  };

  const removeFavorite = (movieId) => {
    if (!activeProfile) return;

    updateProfileById(activeProfile.id, profile => ({
      ...profile,
      favorites: profile.favorites.filter(id => id !== movieId)
    }));
  };

  // ---------- CONTINUE WATCHING ----------
  const updateContinueWatching = (movieId, progress) => {
    if (!activeProfile) return;

    updateProfileById(activeProfile.id, profile => {
      const existing = profile.continueWatching.find(m => m.id === movieId);

      let updatedList;

      if (existing) {
        updatedList = profile.continueWatching.map(m =>
          m.id === movieId ? { ...m, ...progress, lastUpdated: Date.now() } : m
        );
      } else {
        updatedList = [
          ...profile.continueWatching,
          { id: movieId, ...progress, lastUpdated: Date.now() }
        ];
      }

      return {
        ...profile,
        continueWatching: updatedList.sort(
          (a, b) => b.lastUpdated - a.lastUpdated
        )
      };
    });
  };

  const removeFromContinueWatching = (movieId) => {
    if (!activeProfile) return;

    updateProfileById(activeProfile.id, profile => ({
      ...profile,
      continueWatching: profile.continueWatching.filter(
        m => m.id !== movieId
      )
    }));
  };

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        activeProfile,
        activeProfileId,
        loading,
        createProfile,
        deleteProfile,
        updateProfile,
        selectProfile,
        logout,
        addFavorite,
        removeFavorite,
        updateContinueWatching,
        removeFromContinueWatching
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);