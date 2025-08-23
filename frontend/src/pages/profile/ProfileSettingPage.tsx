import React from "react";
import { cn } from "@/lib/utils";
import ProfileCard from "@/components/profile/ProfileCard";

interface ProfileSettingPageProps {
  className?: string;
}

const ProfileSettingPage: React.FC<ProfileSettingPageProps> = ({ className }) => {
  return (
    <div className={cn("h-full overflow-auto flex justify-center items-center", className)}>
      {/* Profile Card */}
      <div className="w-full max-w-4xl">
        <ProfileCard className="w-full" />
      </div>
    </div>
  );
};

export default ProfileSettingPage; 