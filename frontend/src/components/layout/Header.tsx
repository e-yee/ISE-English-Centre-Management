import React, { useState } from "react";
import { cn } from "@/lib/utils";
import UserProfile from "@/components/ui/UserProfile";

interface HeaderProps {
  isRegistered?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isRegistered = false }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleHowToUseClick = () => {
    // Add your "How to use?" functionality here
    console.log("How to use clicked");
  };

  if (!isRegistered) {
    // Default header layout
    return (
      <header className="bg-[#4A5B8C] h-24 flex items-stretch shadow-md z-10 border-b-[1px] border-black">
        <div className="flex items-center gap-4 text-white pl-0 pr-8">
          <div className="relative flex items-center justify-center w-30 h-30">
            <img src="/src/assets/logo.svg" alt="Hammer & Grammar Logo" className="w-24 h-24" />
          </div>
        </div>
        <div className="w-0.5 bg-black"></div>
      </header>
    );
  }

  // Registered header layout
  return (
    <header className="bg-[#4A5B8C] h-24 flex items-stretch shadow-lg z-10 border-b-[1px] border-black">
      {/* Left Frame - Logo only */}
      <div className="flex items-center pl-4 pr-6 border-r-[2.5px] border-black">
        <div className="relative flex items-center justify-center">
          <img src="/src/assets/logo.svg" alt="Hammer & Grammar Logo" className="w-20 h-20" />
        </div>
      </div>

      {/* Middle section - How to use? text positioned at bottom */}
      <div className="flex items-end pb-2 pl-6 flex-1">
        <button
          onClick={handleHowToUseClick}
          className="text-black text-2xl font-normal font-['Rhodium_Libre'] hover:underline transition-all duration-200"
        >
          How to use?
        </button>
      </div>

      {/* Right Frame - All icons */}
      <div className="flex items-center gap-4 px-6">
        {/* Search */}
        <button
          className="flex items-center justify-center hover:opacity-80 transition-opacity"
          aria-label="Search"
        >
          <img src="/src/assets/HeaderIcons/search.svg" alt="Search" className="w-12 h-12" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="relative hover:opacity-80 transition-opacity"
          aria-label="Toggle theme"
        >
          <img src="/src/assets/HeaderIcons/frame.svg" alt="Theme toggle frame" className="w-16 h-8" />
          <img
            src="/src/assets/HeaderIcons/themeSwitch.svg"
            alt="Theme switch"
            className={cn(
              "absolute top-1/2 transform -translate-y-1/2 w-6 h-6 transition-transform duration-200",
              isDarkMode ? "translate-x-8" : "translate-x-2"
            )}
          />
        </button>

        {/* Notification Bell */}
        <button
          className="flex items-center justify-center hover:opacity-80 transition-opacity"
          aria-label="Notifications"
        >
          <img src="/src/assets/HeaderIcons/bell.svg" alt="Notifications" className="w-12 h-12" />
        </button>

        {/* User Profile */}
        <UserProfile
          onProfileClick={() => console.log("Profile clicked")}
          onSettingClick={() => console.log("Setting clicked")}
          onLogoutClick={() => console.log("Logout clicked")}
        />
      </div>
    </header>
  );
};

export default Header;
