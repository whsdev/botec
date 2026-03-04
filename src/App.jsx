import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import ProfileSelect from './pages/ProfileSelect';
import ManageProfiles from './pages/ManageProfiles';
import Home from './pages/Home';
import Watch from './pages/Watch';
import MyList from './pages/MyList';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const location = useLocation();
  
  // Define routes where the Navbar SHOULD NOT appear
  const hideNavbarRoutes = ['/', '/profiles', '/manage-profiles'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="bg-[#0a0a0d] min-h-screen text-white">
      {/* Navbar only shows when "logged in" to a profile */}
      {shouldShowNavbar && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Profile Management */}
          <Route path="/" element={<Navigate to="/profiles" />} />
          <Route path="/profiles" element={<ProfileSelect />} />
          <Route path="/manage-profiles" element={<ManageProfiles />} />

          {/* Protected Content */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          <Route path="/my-list" element={
            <ProtectedRoute>
              <MyList />
            </ProtectedRoute>
          } />

          {/* The Watch Route - Parameter MUST match the Watch.jsx find logic */}
          <Route path="/watch/:movieId" element={
            <ProtectedRoute>
              <Watch />
            </ProtectedRoute>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;