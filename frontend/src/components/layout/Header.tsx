import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserProfile from "@/components/ui/UserProfile";
import { useAuth } from "@/contexts/AuthContext";
//import { useAuth } from "@/contexts/MockAuthContext";

interface HeaderProps {
  isRegistered?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isRegistered = false }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { logout, isLoading } = useAuth();

  // Safely get navigate function - only works in router context
  let navigate: ((path: string) => void) | null = null;
  try {
    navigate = useNavigate();
  } catch (error) {
    // Not in router context (demo mode), navigation will be disabled
    console.log("Header: Not in router context, navigation disabled");
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleHowToUseClick = () => {
    // Add your "How to use?" functionality here
    console.log("How to use clicked");
  };

  const handleLogoClick = () => {
    if (navigate) {
      navigate("/home");
    } else {
      console.log("Navigation to /home (demo mode - navigation disabled)");
    }
  };

  // Profile action handlers
  const handleProfileClick = () => {
    if (navigate) {
      navigate("/profile");
    } else {
      console.log("Navigate to profile (demo mode - navigation disabled)");
    }
  };

  const handleSettingClick = () => {
    if (navigate) {
      navigate("/profile/settings");
    } else {
      console.log("Navigate to settings (demo mode - navigation disabled)");
    }
  };

  const handleLogoutClick = async () => {
    try {
      console.log("Logout clicked");
      await logout();
      // Navigation is handled by AuthContext after successful logout
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback navigation to login page
      if (navigate) {
        navigate("/auth/login");
      }
    }
  };

  if (!isRegistered) {
    // Default header layout - white background with logo and company name
    return (
      <header className="bg-white h-24 flex items-center shadow-md z-10 border-b border-black/50">
        <div className="flex items-center gap-6 pl-8 pr-8">
          <div className="flex items-center gap-6 cursor-pointer" onClick={handleLogoClick}>
            {/* Logo - Remove background, increase size */}
            <img src="/src/assets/logo.svg" alt="Logo" className="w-20 h-20 object-contain hover:scale-105 transition-transform duration-200" />
            {/* Company Name - Increase size */}
            <img src="/src/assets/name.svg" alt="HAMMER & GRAMMAR" className="h-12 hover:scale-105 transition-transform duration-200" />
          </div>
        </div>
        <div className="w-px h-20 bg-black/50"></div>
      </header>
    );
  }

  // Registered header layout - white background with full features
  return (
    <header className="bg-white h-24 flex items-center shadow-md z-10 border-b border-black/50">
      {/* Left Frame - Logo and Company Name */}
      <div className="flex items-center gap-6 pl-6 pr-6 cursor-pointer" onClick={handleLogoClick}>
        {/* Logo - Remove background, increase size */}
        <img src="/src/assets/logo.svg" alt="Logo" className="w-20 h-20 object-contain hover:scale-105 transition-transform duration-200" />
        {/* Company Name - Increase size */}
        <img src="/src/assets/name.svg" alt="HAMMER & GRAMMAR" className="h-12 mt-2 hover:scale-105 transition-transform duration-200" />
      </div>

      {/* Vertical Line Separator */}
      <div className="w-px h-12 bg-black/50 mt-2"></div>

      {/* Middle section - How to use? text */}
      <div className="flex items-center pl-6 flex-1">
        <button
          onClick={handleHowToUseClick}
          className="text-black text-[28px] font-normal font-comfortaa hover:underline transition-all duration-200 mt-2"
        >
          How to use?
        </button>
      </div>

      {/* Right Frame - All icons */}
      <div className="flex items-center gap-4 px-6">
        {/* Search */}
        <button
          className="flex items-center justify-center hover:scale-105 transition-transform duration-200"
          aria-label="Search"
        >
          <img src="/src/assets/header/search.svg" alt="Search" className="w-6 h-6" />
        </button>



        {/* Notification Bell */}
        <button
          className="flex items-center justify-center hover:scale-105 transition-transform duration-200"
          aria-label="Notifications"
        >
          <img src="/src/assets/header/bell.svg" alt="Notifications" className="w-6 h-6" />
        </button>

        {/* User Avatar */}
        <UserProfile
          onProfileClick={handleProfileClick}
          onSettingClick={handleSettingClick}
          onLogoutClick={handleLogoutClick}
          isLoading={isLoading}
        />
      </div>
    </header>
  );
};

export default Header;
