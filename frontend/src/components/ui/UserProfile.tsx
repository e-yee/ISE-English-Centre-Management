import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Avatar from "./Avatar";
import settingIcon from "../../assets/header/settings.svg"
import logoutIcon from "../../assets/header/logout.svg"

interface UserProfileProps {
  className?: string;
  onProfileClick?: () => void;
  onSettingClick?: () => void;
  onLogoutClick?: () => void;
  isLoading?: boolean;
}

interface ProfileMenuItem {
  id: string;
  icon: string,
  label: string;
  onClick?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  className,
  onProfileClick,  
  // onSettingClick,
  onLogoutClick,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: ProfileMenuItem[] = [
    {
      id: "profile",
      icon: settingIcon,
      label: "Profile",
      onClick: onProfileClick,
    },
    // {
    //   id: "setting",
    //   label: "Setting",
    //   onClick: onSettingClick,
    // },
    {
      id: "logout",
      icon: logoutIcon,
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
          <div className="w-sm flex flex-col items-center overflow-hidden rounded-[15px]
                          ">
            <div className="w-full flex flex-row items-center
                            bg-gradient-to-b from-blue-200 to-purple-300">
              <Avatar 
              name="User"
              size="lg"
              className="mx-5 my-2 outline-offset-1 outline-violet-500 outline-2"
              />
              <div>
                <p>Name here</p>
              </div>
            </div>
            <div className="w-full flex flex-col gap-2 my-3">
              {menuItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  disabled={isLoading && item.id === "logout"}
                  className={cn(
                    "w-full rounded-sm px-8 py-2 text-left h-fit",
                    "font-comfortaa text-md font-semibold text-black-500",
                    "transition-all duration-200 ease-in-out",
                    "",
                    "hover:bg-blue-50 hover:cursor-pointer",
                    "focus:outline-none focus:bg-[#D9D9D9]",
                    // Add border between items (except last)
                    //index < menuItems.length - 1 && "border-b border-black",
                    // Disabled state for logout button
                    isLoading && item.id === "logout" && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isLoading && item.id === "logout" ? "Logging out..." : (
                    <div className="flex flex-row gap-4 items-center group p-2">
                      <div className="bg-sky-200 w-fit h-fit rounded-lg duration-600 ease-in-out group-hover:scale-107 group-hover:shadow-sm">
                        <img src={item.icon} alt="icon" className="w-5 h-5 m-2" />
                      </div>
                      <p className="group-hover:underline">{item.label}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
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
