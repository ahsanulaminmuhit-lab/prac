import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { axiosProtected } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { ApiError, PasswordData, ProfileData } from "@/types";
import { User as UserIcon } from "lucide-react";

// Define interface for component props
interface ProfileManagementProps {
  defaultTab?: string;
}

// Helper function to extract error message
const getErrorMessage = (error: unknown): string => {
  const apiError = error as ApiError;
  return apiError.response?.data?.message || "An unexpected error occurred";
};

export default function ProfileManagement({
  defaultTab = "profile",
}: ProfileManagementProps) {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || "",
    photo: user?.photo || "",
  });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Update activeTab when defaultTab prop changes
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Update profileData when user data changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        photo: user.photo || "",
      });
    }
  }, [user]);

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const updateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosProtected.patch(
        "/v1/user/update-profile",
        profileData
      );

      // Update user in auth context if available
      if (typeof updateUser === "function") {
        updateUser(response.data.data);
      }

      toast.success("Profile updated successfully");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to change your password");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Submitting password change with data:", {
        currentPassword: passwordData.currentPassword ? "***" : undefined,
        newPassword: passwordData.newPassword ? "***" : undefined,
      });

      // Make sure the API endpoint matches what the backend expects
      const response = await axiosProtected.patch("/v1/user/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      console.log("Password change response:", response.data);

      // Reset password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password changed successfully");
    } catch (error: unknown) {
      console.error("Password change error:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Card className="shadow-xl rounded-xl w-full">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-xl font-bold text-blue-700 mb-2">
            Profile Management
          </CardTitle>
          <p className="text-gray-600 mb-4 text-center">
            Update your profile information and change your password
          </p>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-blue-100 rounded-lg">
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="password">Change Password</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="flex flex-col items-center mb-6">
                {/* Avatar Preview */}
                {profileData.photo ? (
                  <img
                    src={profileData.photo}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-200 shadow mb-2"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200 shadow mb-2">
                    <UserIcon className="w-10 h-10 text-blue-400" />
                  </div>
                )}
              </div>
              <form onSubmit={updateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      placeholder="Your name"
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-gray-100"
                    />
                    <p className="text-sm text-gray-500">
                      Email cannot be changed
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photo">Profile Photo URL</Label>
                  <Input
                    id="photo"
                    name="photo"
                    value={profileData.photo || ""}
                    onChange={handleProfileChange}
                    placeholder="https://example.com/photo.jpg"
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? "Saving..." : "Save Profile"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="password">
              <form onSubmit={changePassword} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
