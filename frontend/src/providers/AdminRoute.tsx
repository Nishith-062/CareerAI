import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { Navigate } from "react-router-dom";
import { Loader } from "lucide-react";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isCheckingAuth } = useAdminAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <Loader className="animate-spin size-10" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
};

export default AdminRoute;
