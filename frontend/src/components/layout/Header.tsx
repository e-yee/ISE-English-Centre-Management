import React from "react";
import { Hammer, PenTool } from "lucide-react";

const Header: React.FC = () => {
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
};

export default Header;
