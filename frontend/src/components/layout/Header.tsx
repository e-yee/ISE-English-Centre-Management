import React, { useState } from "react";
import { cn } from "@/lib/utils";

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
    // Default header layout - white background with logo and company name
    return (
      <header className="bg-white h-24 flex items-center shadow-md z-10 border-b border-black/50">
        <div className="flex items-center gap-6 pl-8 pr-8">
          <div className="flex items-center gap-6">
            {/* Logo - Remove background, increase size */}
            <img src="/src/assets/logo.svg" alt="Logo" className="w-20 h-20 object-contain" />
            {/* Company Name - Increase size */}
            <img src="/src/assets/name.svg" alt="HAMMER & GRAMMAR" className="h-12" />
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
      <div className="flex items-center gap-6 pl-6 pr-6">
        {/* Logo - Remove background, increase size */}
        <img src="/src/assets/logo.svg" alt="Logo" className="w-20 h-20 object-contain" />
        {/* Company Name - Increase size */}
        <img src="/src/assets/name.svg" alt="HAMMER & GRAMMAR" className="h-12 mt-2" />
      </div>

      {/* Vertical Line Separator */}
      <div className="w-px h-12 bg-black/50 mt-2"></div>

      {/* Middle section - How to use? text */}
      <div className="flex items-center pl-6 flex-1">
        <button
          onClick={handleHowToUseClick}
          className="text-black text-[28px] font-normal font-['Rhodium_Libre'] hover:underline transition-all duration-200 mt-2"
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

        {/* Theme Toggle Switch */}
        <button
          onClick={toggleTheme}
          className="relative hover:scale-105 transition-transform duration-200"
          aria-label="Toggle theme"
        >
          <div className="w-[60px] h-[30px] bg-white border-2 border-black rounded-full flex items-center p-1">
            <div
              className={cn(
                "w-[23px] h-[23px] bg-white border border-black rounded-full transition-transform duration-200",
                isDarkMode ? "translate-x-[26px]" : "translate-x-0"
              )}
            />
          </div>
        </button>

        {/* Notification Bell */}
        <button
          className="flex items-center justify-center hover:scale-105 transition-transform duration-200"
          aria-label="Notifications"
        >
          <img src="/src/assets/header/bell.svg" alt="Notifications" className="w-6 h-6" />
        </button>

        {/* User Avatar */}
        <button
          className="flex items-center justify-center hover:scale-105 transition-transform duration-200"
          aria-label="User profile"
        >
          <img src="/src/assets/header/avatar.svg" alt="User Avatar" className="w-12 h-12" />
        </button>
      </div>
    </header>
  );
};

export default Header;
