import useAuthStore from "../store/useAuthStore";
import { useEffect } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  // // console.log(user);
  // if(isCheckingAuth){
  //     return <div className="flex items-center justify-center h-screen"><Loader className="animate-spin"/></div>;
  // }

  return <>{children}</>;
};

export default AuthProvider;
