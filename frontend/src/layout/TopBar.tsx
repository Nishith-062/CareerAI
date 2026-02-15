import useAuthStore from "@/store/useAuthStore";
import { LogOut } from "lucide-react";

const TopBar = () => {
  const { user, logout, isLoading } = useAuthStore();
  return (
    <div className="h-16 p-2 bg-secondary rounded-2xl mx-7.5 flex items-center justify-between">
      <h1 className="text-2xl font-bold font-family">CareerAI</h1>
      <div>
        <button
          onClick={logout}
          className="border cursor-pointer border-chart-5 flex justify-center items-center gap-2 hover:bg-red-300 hover:text-black text-white px-4 py-2 rounded-full"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};
export default TopBar;
