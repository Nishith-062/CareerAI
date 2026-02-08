import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { Loader } from "lucide-react";

const ProtectedRoute = () => {
  const { user, isCheckingAuth } = useAuthStore();
if (isCheckingAuth) {
  return <div className="flex items-center justify-center h-screen">
  <Loader className="size-10 text-blue-500 animate-spin"/>
</div>
}

if (!user) {
  return <Navigate to="/login" replace />;
}

if (!user.isVerified) {
  return <Navigate to="/verify" replace />;
}

return <Outlet />;

};

export default ProtectedRoute;
