import { useAuth } from "@/hooks/useAuth";


const DashboardHome = () => {
    const { user } = useAuth();
    return (
        <div>
            {
                user?.role == 'admin' ? <div className="">Admin</div>
                 : 
                 <div className="">User</div>
            }
            
        </div>
    );
};

export default DashboardHome;