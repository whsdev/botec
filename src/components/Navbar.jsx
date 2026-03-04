import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext.jsx';
import SearchResults from './SearchResults.jsx';

const Navbar = () => {
  const { profiles, activeProfileId, logout } = useProfile();
  const [showDrop, setShowDrop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const active = profiles.find(p => p.id === activeProfileId);

  // Function to handle option selection
  const handleSearchSelect = () => {
    setSearchQuery(""); // Clear the search query to hide results
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-[100] px-12 py-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">

        <div className="flex gap-10 items-center">
          <Link to="/home" className="text-white text-2xl font-logo font-extrabold tracking-tight">
            BOTEC+
          </Link>

          <div className="flex gap-6">
            <Link to="/home" className="text-sm text-gray-300 hover:text-white">
              Home
            </Link>
            <Link to="/my-list" className="text-sm text-gray-300 hover:text-white">
              My List
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-6 relative">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Titles, people, genres"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/50 border border-white/20 px-4 py-1 text-sm rounded-full focus:outline-none focus:border-[#C6A85C] w-64"
          />

          {/* Profile Dropdown */}
          <div className="relative">
            <img
              src={active?.avatar}
              alt="profile"
              className="w-8 h-8 rounded-sm cursor-pointer border border-transparent hover:border-[#C6A85C]"
              onClick={() => setShowDrop(!showDrop)}
            />

            {showDrop && (
              <div className="absolute right-0 mt-2 w-40 bg-[#141419] border border-gray-800 py-2 shadow-xl">
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-[#C6A85C]/20"
                >
                  Switch Profile
                </button>
                <Link
                  to="/manage-profiles"
                  className="block px-4 py-2 text-xs hover:bg-[#C6A85C]/20"
                >
                  Manage
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* SEARCH OVERLAY — OUTSIDE NAV */}
      {searchQuery.length > 0 && (
        <SearchResults
          query={searchQuery}
          clearSearch={() => setSearchQuery("")}
          onSelect={() => setSearchQuery("")} // Add this line
        />
      )}
    </>
  );
};

export default Navbar;