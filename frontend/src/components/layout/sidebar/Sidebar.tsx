import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getUserRole } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  className?: string;
}

interface SidebarItem {
  id: string;
  title: string;
  icon: string;
  url: string;
}

const MainSidebar: React.FC<SidebarProps> = ({ className }) => {
  const { state } = useSidebar();
  const [activeItem, setActiveItem] = useState("dashboard");

  // Safely get navigate function - only works in router context
  let navigate: ((path: string) => void) | null = null;
  try {
    navigate = useNavigate();
  } catch (error) {
    // Not in router context (demo mode), navigation will be disabled
    console.log("Sidebar: Not in router context, navigation disabled");
  }

  // Base menu items that all roles can see
  const baseMenuItems: SidebarItem[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: "/src/assets/sidebar/dashboard.svg",
      url: "#",
    },
    {
      id: "absence-request",
      title: "Absence Request",
      icon: "/src/assets/sidebar/absent-request.svg",
      url: "#",
    },
    {
      id: "timekeeping",
      title: "Check in",
      icon: "/src/assets/sidebar/timekeeping.svg",
      url: "#",
    },
    {
      id: "colleagues",
      title: "Colleagues",
      icon: "/src/assets/sidebar/collegues.svg",
      url: "#",
    },
    {
      id: "materials",
      title: "Materials",
      icon: "/src/assets/sidebar/material.svg",
      url: "#",
    },
    {
      id: "issues",
      title: "Issues",
      icon: "/src/assets/sidebar/issues.svg",
      url: "#",
    },
  ];

  // Role-specific menu items
  const roleSpecificItems: SidebarItem[] = [];
  const role = getUserRole();
  if (role === "Learning Advisor") {
    roleSpecificItems.push({
      id: "makeup-classes",
      title: "Makeup Classes",
      icon: "/src/assets/sidebar/add-course.svg",
      url: "#",
    });
  }
  
  // Combine base items with role-specific items
  const menuItems = [...baseMenuItems, ...roleSpecificItems];

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);

    // Handle navigation based on item clicked
    if (itemId === "dashboard") {
      const role = getUserRole();
      if (navigate) {
        if (role === "Manager" || role === "Learning Advisor") {
          navigate("/dashboard");
        } else {
          navigate("/home");
        }
      } else {
        if (role === "Manager" || role === "Learning Advisor") {
          console.log("Navigation to /dashboard (demo mode - navigation disabled)");
        } else {
          console.log("Navigation to /home (demo mode - navigation disabled)");
        }
      }
    } else if (itemId === "absence-request") {
      if (navigate) {
        navigate("/absent-request");
      } else {
        console.log("Navigation to /absent-request (demo mode - navigation disabled)");
      }
    } else if (itemId === "timekeeping") {
      if (navigate) {
        navigate("/timekeeping");
      } else {
        console.log("Navigation to /checkin (demo mode - navigation disabled)");
      }
    } else if (itemId === "colleagues") {
      if (navigate) {
        navigate("/colleagues");
      } else {
        console.log("Navigation to /colleagues (demo mode - navigation disabled)");
      }
    } else if (itemId === "materials") {
      if (navigate) {
        navigate("/materials");
      } else {
        console.log("Navigation to /materials (demo mode - navigation disabled)");
      }
    } else if (itemId === "courses") {
      if (navigate) {
        navigate("/courses");
      } else {
        console.log("Navigation to /courses (demo mode - navigation disabled)");
      }
    } else if (itemId === "issues") {
      if (navigate) {
        navigate("/issues");
      } else {
        console.log("Navigation to /issues (demo mode - navigation disabled)");
      }
    } else if (itemId === "makeup-classes") {
      if (navigate) {
        navigate("/makeup-classes");
      } else {
        console.log("Navigation to /makeup-classes (demo mode - navigation disabled)");
      }
    } else {
      // For other items, just log for now (can be extended later)
      console.log(`Navigating to ${itemId}`);
    }
  };

  return (
    <TooltipProvider>
      <Sidebar
        collapsible="icon"
        side="left"
        className={cn(
          "sidebar-custom",
          state === "expanded" ? "sidebar-expanded" : "sidebar-collapsed",
          className
        )}
        style={{
          "--sidebar-width": "295px",
          "--sidebar-width-icon": "80px",
          "--sidebar-width-mobile": "295px",
        } as React.CSSProperties}
      >
      {/* Header with FEATURES title and separator */}
      <SidebarHeader className="p-4">
        <SidebarGroupLabel className="sidebar-features-title">
          FEATURES
        </SidebarGroupLabel>
        <Separator className="mt-2 bg-black/50" />
      </SidebarHeader>

      {/* Main content with menu items */}
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  {state === "collapsed" ? (
                    // Collapsed state - wrap only the icon with tooltip
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          onClick={() => handleItemClick(item.id)}
                          isActive={activeItem === item.id}
                          className={cn(
                            "sidebar-menu-item",
                            "flex items-center justify-center w-12 h-12 mx-auto p-2 cursor-pointer select-none",
                            "transition-all duration-300 ease-out transform-gpu"
                          )}
                        >
                          {/* Icon */}
                          <div className="h-6 w-6 flex-shrink-0 transition-transform duration-300 ease-out select-none">
                            <img
                              src={item.icon}
                              alt={`${item.title} icon`}
                              className="w-full h-full object-contain select-none pointer-events-none sidebar-icon"
                            />
                          </div>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    // Expanded state - no tooltip needed
                    <SidebarMenuButton
                      onClick={() => handleItemClick(item.id)}
                      isActive={activeItem === item.id}
                      className={cn(
                        "sidebar-menu-item",
                        "flex items-center gap-3 p-3 cursor-pointer select-none",
                        "transition-all duration-300 ease-out transform-gpu"
                      )}
                    >
                      {/* Icon */}
                      <div className="h-6 w-6 flex-shrink-0 transition-transform duration-300 ease-out select-none">
                        <img
                          src={item.icon}
                          alt={`${item.title} icon`}
                          className="w-full h-full object-contain select-none pointer-events-none sidebar-icon"
                        />
                      </div>

                      {/* Label - only show when expanded */}
                      <span className="sidebar-menu-text select-none">
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Toggle button positioned outside sidebar as attachment */}
      <SidebarTrigger className={cn(
        "sidebar-trigger select-none",
        // Hover scale animation - expand horizontally on hover
        "transition-all duration-200 ease-in-out",
        "hover:scale-x-110 hover:scale-y-105",
        "hover:shadow-lg",
        // CSS handles exact dimensions from Figma and chevron icon
        state === "expanded"
          ? "sidebar-trigger-expanded"
          : "sidebar-trigger-collapsed"
      )}>
        {/* Chevron icon is created with CSS ::after pseudo-element */}
      </SidebarTrigger>
    </Sidebar>
    </TooltipProvider>
  );
};

export default MainSidebar;
