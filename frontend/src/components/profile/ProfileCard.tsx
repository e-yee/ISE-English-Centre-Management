import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import avatarIcon from "@/assets/header/avatar.svg";
import mailIcon from "@/assets/header/mail.svg";
import { useProfile } from "@/hooks/entities/useEmployees";
import employeeService from "@/services/entities/employeeService";

interface ProfileCardProps {
  className?: string;
}

interface UserProfile {
  name: string;
  email: string;
  nickname: string;
  philosophy: string;
  achievements: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ className }) => {
  const { data: profileData, isLoading, error, refetch } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "Your name",
    email: "your.email@example.com",
    nickname: "Your nick name",
    philosophy: "Your philosophy...",
    achievements: "Your achievements"
  });

  const [editProfile, setEditProfile] = useState<UserProfile>(profile);

  // Update profile when API data is loaded
  useEffect(() => {
    if (profileData) {
      const mappedProfile: UserProfile = {
        name: profileData.full_name || "Your name",
        email: profileData.email || "your.email@example.com",
        nickname: profileData.nickname || "Your nick name",
        philosophy: profileData.philosophy || "Your philosophy...",
        achievements: profileData.achievements || "Your achievements"
      };
      setProfile(mappedProfile);
      setEditProfile(mappedProfile);
    }
  }, [profileData]);

  const handleEdit = () => {
    setEditProfile(profile);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updateData = {
        full_name: editProfile.name,
        nickname: editProfile.nickname === "Your nick name" ? null : editProfile.nickname,
        philosophy: editProfile.philosophy === "Your philosophy..." ? null : editProfile.philosophy,
        achievements: editProfile.achievements === "Your achievements" ? null : editProfile.achievements,
        email: editProfile.email
      };

      await employeeService.updateProfile(updateData);
      setProfile(editProfile);
      setIsEditing(false);
      refetch(); // Refresh data from server
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      // You might want to show an error toast here
    }
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <Card className={cn("bg-white rounded-[15px] overflow-hidden shadow-lg", className)}>
        <CardContent className="p-9">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("bg-white rounded-[15px] overflow-hidden shadow-lg", className)}>
        <CardContent className="p-9">
          <div className="text-red-500 text-center">
            Failed to load profile data. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("selection:bg-purple-400 selection:text-white bg-white rounded-[15px]  shadow-lg", className)}>
      {/* Profile Header with Background Image */}
      <div className="flex flex-col justify-center items-center relative h-24 w-full rounded-t-[15px] bg-gradient-to-r from-[#c9def4] via-[#f5ccd4] to-[#b8a4c9]">                
        <h1 className="mt-2 font-bold text-5xl text-indigo-400 hover:scale-110 select:scale-120 duration-500 ease-in-out">Welcome back!</h1>
        <p className="font-semibold text-md animate-bounce duration-900 ease-in-out">Hope you have a wonderful day.</p>
      </div>

      <CardContent className="px-9 pb-4 pt-4">
        {/* User Information Section */}
        <div className="flex items-center gap-x-4 mb-6">
          {/* Avatar */}
          <div className="w-26 h-26 rounded-full bg-[#EADDFF] flex items-center justify-center">
            <img src={avatarIcon} alt="Avatar" className="w-16 h-16" />
          </div>

          {/* User Details */}
          <div className="flex-1">
            <h2 className="text-[28px] font-bold text-black">
              {profile.name}
            </h2>
            <p className="text-[20px] font-semibold text-gray-600 select-all">
              {profile.email}
            </p>
          </div>

          {/* Edit Button */}
          <Button
            onClick={isEditing ? handleSave : handleEdit}
            className={cn(
              "cursor-pointer px-9 py-5 rounded-[15px] font-bold text-white text-[24px] transition-all",
              isEditing 
                ? "bg-green-500 hover:bg-green-600 hover:scale-92" 
                : "bg-[#AACEEC] hover:bg-blue-400 hover:shadow-xl hover:border hover:border-blue-500 hover:border-2"
            )}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>

        {saved && (
          <div className="mb-4">
            <Badge className="bg-green-500 text-white border-transparent">Profile updated</Badge>
          </div>
        )}

        {/* Editable Fields Section */}
        <div className="grid grid-cols-2 gap-x-8">
          {/* Left Column */}
          <div className="space-y-2">
            {/* Nickname Field */}
            <div className="space-y-3">
              <label className="text-[22px] font-bold text-black">
                Nick name
              </label>
              {isEditing ? (
                <Input
                  value={editProfile.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  className="h-[43px] rounded-[10px] border-2 border-gray-300 bg-gray-100/30 px-5 font-bold text-[16px]"
                  placeholder="Your nick name"
                />
              ) : (
                <div className="h-[43px] rounded-[10px] border-2 border-gray-300 bg-gray-100/30 pl-3 flex items-center">
                  <span className="font-bold text-[16px] text-gray-500">
                    {profile.nickname}
                  </span>
                </div>
              )}
            </div>

            {/* Philosophy Field */}
            <div className="space-y-3">
              <label className="text-[22px] font-bold text-black">
                Philosophy
              </label>
              {isEditing ? (
                <textarea
                  value={editProfile.philosophy}
                  onChange={(e) => handleInputChange('philosophy', e.target.value)}
                  className="w-full h-[95px] rounded-[10px] border-2 border-gray-300 bg-gray-100/30 px-3 py-2 font-bold text-[16px] resize-none"
                  placeholder="Your philosophy..."
                />
              ) : (
                <div className="h-[95px] rounded-[10px] border-2 border-gray-300 bg-gray-100/30 px-3 py-2 flex items-start">
                  <span className="font-bold text-[16px] text-gray-500">
                    {profile.philosophy}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column */}
          <div className="flex flex-col">
            <div className="flex flex-col h-full">
              <label className="text-[22px] font-bold text-black">
                Achievements
              </label>
              {isEditing ? (
                <textarea
                  value={editProfile.achievements}
                  onChange={(e) => handleInputChange('achievements', e.target.value)}
                  className="w-full flex-grow rounded-[10px] border-2 border-gray-300 bg-gray-100/30 px-3 py-2 font-bold text-[16px] resize-none"
                  placeholder="Your achievements"
                />
              ) : (
                <div className="w-full flex-grow rounded-[10px] border-2 border-gray-300 bg-gray-100/30 px-3 py-2 flex items-start">
                  <span className="font-bold text-[16px] text-gray-500">
                    {profile.achievements}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contacts Section */}
        <div className="mt-8 space-y-1">
          <h3 className="text-[26px] font-bold text-black">
            Contacts
          </h3>
          
          {/* Email Contact */}
          <div className="flex items-center gap-3">
            {/* Email Icon */}
            <div className="w-[50px] h-[50px] rounded-[32px] bg-[#B9D8FF] flex items-center justify-center">
              <img src={mailIcon} alt="Mail" className="w-6 h-6" />
            </div>
            
            {/* Email Address */}
            {isEditing ? (
              <Input
                value={editProfile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="h-[43px] rounded-[10px] border-2 border-gray-300 bg-gray-100/30 px-5 font-bold text-[16px]"
                placeholder="your.email@example.com"
              />
            ) : (
              <span className="select-all text-[20px] font-bold text-gray-600">
                {profile.email}
              </span>
            )}
          </div>
          
          {/* Add Contact Button - hidden */}
          <div className="mt-4">
            <Button
              className="hidden cursor-pointer px-[54px] py-3 rounded-[7px] bg-[rgba(207,224,255,0.51)] text-[#3384FF] font-normal text-[20px] hover:bg-[rgba(207,224,255,0.7)] hover:scale-105 transition-all duration-200"
            >
              +Add Contact
            </Button>
          </div>
        </div>

        {/* Cancel Button (only shown when editing) */}
        {isEditing && (
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="px-6 py-2 rounded-[10px] border-2 border-gray-300 text-gray-600 font-semibold"
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCard; 