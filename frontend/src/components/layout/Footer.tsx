import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#4A5B8C] h-24 flex items-stretch justify-around px-8 text-white z-10">
      <div className="text-center flex items-center">
        <h3 className="text-lg font-medium underline cursor-pointer hover:text-gray-300">
          Contact us
        </h3>
      </div>
      <div className="w-0.5 bg-black"></div>
      <div className="text-center flex items-center">
        <h3 className="text-lg font-medium underline cursor-pointer hover:text-gray-300">
          Follow us
        </h3>
      </div>
    </footer>
  );
};

export default Footer;
