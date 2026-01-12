import { Outlet } from "react-router-dom";
import { AppSidebar } from "./sideber";

const Dashboard = () => {
  return (
    <div className="flex w-full min-h-screen">
      {/* dashboard side bar */}
      <div className="w-64 min-h-screen bg-opacity-30 bg-black">
        <AppSidebar />
      </div>
      {/* dashboard content */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
