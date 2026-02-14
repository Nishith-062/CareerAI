import { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default function AdminAnalytics() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/admin/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-gray-500" />
      </div>
    );
  }

  if (!stats) return <div>Failed to load stats</div>;

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm font-medium">Total Users</h3>
          <p className="text-4xl font-bold mt-2">{stats.totalUsers}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm font-medium">Verified Users</h3>
          <p className="text-4xl font-bold mt-2 text-green-500">
            {stats.verifiedUsers}
          </p>
        </div>
      </div>

      {/* Target Roles Chart */}
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-6">Popular Target Roles</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.roleDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="_id" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#171717",
                  border: "1px solid #333",
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Skills */}
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-6">Top Verified Skills</h3>
        <div className="space-y-4">
          {stats.topSkills.map((skill: any, index: number) => (
            <div key={skill._id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 w-6">{index + 1}</span>
                <span className="font-medium">{skill._id}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{
                      width: `${(skill.count / stats.totalUsers) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-gray-400 text-sm w-12 text-right">
                  {skill.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
