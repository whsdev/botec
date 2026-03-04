import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext.jsx';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ManageProfiles = () => {
  const {
    profiles,
    createProfile,
    deleteProfile,
    updateProfile
  } = useProfile();

  const navigate = useNavigate();

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const handleAddProfile = () => {
    if (!newName.trim() || profiles.length >= 5) return;

    createProfile(
      newName,
      '/thumbnails/default-avatar.webp'
    );

    setNewName("");
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0d] p-10 text-[#e5e5e5]">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-semibold">Manage Profiles</h1>
        <button
          onClick={() => navigate('/profiles')}
          className="px-6 py-2 border border-gray-600 hover:border-[#C6A85C] transition-all"
        >
          Done
        </button>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
        {profiles.map(profile => (
          <div key={profile.id} className="relative group text-center">
            <div className="relative w-32 h-32 mx-auto rounded-md overflow-hidden mb-4 border-2 border-transparent group-hover:border-[#C6A85C] transition-all duration-300">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100"
              />

              <button
                onClick={() => deleteProfile(profile.id)}
                className="absolute top-0 right-0 bg-red-600 p-1 text-xs rounded-bl-md"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-400">{profile.name}</p>
          </div>
        ))}

        {profiles.length < 5 && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-32 h-32 border-2 border-dashed border-gray-700 flex items-center justify-center hover:border-gray-500 transition-all"
          >
            <span className="text-3xl">+</span>
          </button>
        )}
      </div>

      {isAdding && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-10 max-w-sm"
        >
          <input
            className="w-full bg-[#141419] border-b-2 border-gray-600 p-2 focus:border-[#C6A85C] outline-none mb-4"
            placeholder="Profile Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            autoFocus
          />

          <button
            onClick={handleAddProfile}
            className="bg-white text-black px-4 py-2 mr-4"
          >
            Save
          </button>

          <button
            onClick={() => setIsAdding(false)}
            className="text-gray-400"
          >
            Cancel
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ManageProfiles;