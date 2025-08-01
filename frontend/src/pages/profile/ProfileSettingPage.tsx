import React from "react";
import { cn } from "@/lib/utils";
import ProfileCard from "@/components/profile/ProfileCard";

interface ProfileSettingPageProps {
  className?: string;
}

const ProfileSettingPage: React.FC<ProfileSettingPageProps> = ({ className }) => {
  return (
    <div className={cn("h-full flex items-center justify-center", className)}>
      {/* Profile Card */}
      <div className="w-full max-w-6xl mx-auto">
        <ProfileCard className="w-full" />
      </div>
    </div>
  );
};

export default ProfileSettingPage; 