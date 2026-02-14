import { useEffect, useState } from "react";
import axios from "axios";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  LogOut,
  CheckCircle,
  XCircle,
  Users,
  BarChart,
} from "lucide-react";
import toast from "react-hot-toast";
import AdminAnalytics from "@/components/admin/AdminAnalytics";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

interface User {
  _id: string;
  fullname: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const { logoutAdmin } = useAdminAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "analytics">("users");

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex bg-neutral-900 rounded-lg p-1 border border-neutral-800">
              <button
                onClick={() => setActiveTab("users")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === "users"
                    ? "bg-neutral-800 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Users size={16} /> Users
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === "analytics"
                    ? "bg-neutral-800 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <BarChart size={16} /> Analytics
              </button>
            </div>
            <Button onClick={logoutAdmin} variant="secondary" className="gap-2">
              <LogOut size={16} /> Logout
            </Button>
          </div>
        </div>

        {activeTab === "users" ? (
          <div className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800">
            <div className="p-6 border-b border-neutral-800">
              <h2 className="text-xl font-semibold">
                Registered Users ({users.length})
              </h2>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-gray-400">
                Loading users...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-neutral-800">
                    <tr>
                      <th className="p-4 font-medium text-gray-300">Name</th>
                      <th className="p-4 font-medium text-gray-300">Email</th>
                      <th className="p-4 font-medium text-gray-300">
                        Verified
                      </th>
                      <th className="p-4 font-medium text-gray-300">Joined</th>
                      <th className="p-4 font-medium text-gray-300 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-neutral-800/50">
                        <td className="p-4">{user.fullname}</td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">
                          {user.isVerified ? (
                            <span className="flex items-center gap-1 text-green-500 text-sm">
                              <CheckCircle size={14} /> Yes
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-yellow-500 text-sm">
                              <XCircle size={14} /> No
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-gray-400 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-400 hover:bg-red-950/20"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-8 text-center text-gray-500"
                        >
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <AdminAnalytics />
        )}
      </div>
    </div>
  );
}
