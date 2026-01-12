import ProfileCard from "./ProfileCard";
import ProfileManagement from "./UserDashboard/ProfileManagement";

const Profile = () => {
  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        My Profile
      </h2>
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <ProfileCard />
        <ProfileManagement />
      </div>
    </div>
  );
};

export default Profile;
