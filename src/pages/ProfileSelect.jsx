import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { motion } from 'framer-motion';

const ProfileSelect = () => {
  const navigate = useNavigate();
  // We pull EVERYTHING from context now, not local storage directly.
  const { profiles, selectProfile } = useProfile();

  const handleProfileClick = (profileId) => {
    selectProfile(profileId);
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0d] flex flex-col items-center justify-center text-white p-4">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-5xl font-medium mb-10 tracking-tight"
      >
        Who's watching?
      </motion.h1>

      <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-4xl">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            onClick={() => handleProfileClick(profile.id)}
            className="group flex flex-col items-center cursor-pointer w-24 md:w-32"
          >
            {/* Avatar Box */}
            <div 
              className={`w-full aspect-square rounded-md mb-3 overflow-hidden border-2 border-transparent group-hover:border-white transition-all duration-200`}
              style={{ backgroundColor: profile.avatarColor || '#C6A85C' }}
            >
              {/* Default Avatar Icon */}
              <div className="w-full h-full flex items-center justify-center bg-black/20">
                 <span className="text-4xl font-bold opacity-50">
                   {profile.name.charAt(0).toUpperCase()}
                 </span>
              </div>
            </div>

            {/* Profile Name */}
            <span className="text-gray-400 group-hover:text-white transition-colors text-sm md:text-base truncate w-full text-center">
              {profile.name}
            </span>
          </div>
        ))}

        {/* Add Profile Shortcut (Optional but helpful) */}
        {profiles.length < 5 && (
          <div
            onClick={() => navigate('/manage-profiles')}
            className="group flex flex-col items-center cursor-pointer w-24 md:w-32"
          >
            <div className="w-full aspect-square rounded-md mb-3 flex items-center justify-center border-2 border-transparent bg-gray-800/50 group-hover:bg-gray-700 transition-all">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
               </svg>
            </div>
            <span className="text-gray-500 group-hover:text-white text-sm">Add Profile</span>
          </div>
        )}
      </div>

      {/* The Footer Button */}
      <button 
        onClick={() => navigate('/manage-profiles')}
        className="mt-16 border border-gray-600 px-8 py-2 text-gray-500 hover:text-white hover:border-white tracking-widest uppercase text-xs md:text-sm transition-all"
      >
        Manage Profiles
      </button>
    </div>
  );
};

export default ProfileSelect;