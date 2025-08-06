import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Avatar from "./Avatar";

interface UserProfileProps {
  className?: string;
  onProfileClick?: () => void;
  onSettingClick?: () => void;
  onLogoutClick?: () => void;
  isLoading?: boolean;
}

interface ProfileMenuItem {
  id: string;
  label: string;
  onClick?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  className,
  onProfileClick,
  onSettingClick,
  onLogoutClick,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: ProfileMenuItem[] = [
    {
      id: "profile",
      label: "Profile",
      onClick: onProfileClick,
    },
    {
      id: "setting",
      label: "Setting",
      onClick: onSettingClick,
    },
    {
      id: "logout",
      label: "Log out",
      onClick: onLogoutClick,
    },
  ];

  const handleItemClick = (item: ProfileMenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Profile Picture/Avatar Button */}
      <button
        onClick={toggleDropdown}
        className={cn(
          "flex items-center justify-center rounded-full cursor-pointer",
          "hover:scale-105 transition-transform duration-300 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        )}
        aria-label="User profile menu"
        aria-expanded={isOpen}
      >
        {/* Use the new Avatar component */}
        <Avatar 
          name="User"
          size="md"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            "absolute right-0 top-full mt-2 z-50",
            "bg-white rounded-[15px]",
            "shadow-[0px_4px_8px_rgba(0,0,0,0.25)]",
            "min-w-[200px]",
            "animate-in fade-in-0 zoom-in-95 duration-200"
          )}
        >
          {/* Menu Items */}
          <div className="overflow-hidden rounded-[15px]">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={isLoading && item.id === "logout"}
                className={cn(
                  "w-full my-1 px-8 py-2 text-left h-fit",
                  "font-comfortaa text-[13px] font-normal text-black-500",
                  "transition-all duration-200 ease-out",
                  "hover:bg-[#D9D9D9] hover:cursor-pointer",
                  "focus:outline-none focus:bg-[#D9D9D9]",
                  // Add border between items (except last)
                  //index < menuItems.length - 1 && "border-b border-black",
                  // Disabled state for logout button
                  isLoading && item.id === "logout" && "opacity-50 cursor-not-allowed"
                )}
              >
                {isLoading && item.id === "logout" ? "Logging out..." : item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default UserProfile;
