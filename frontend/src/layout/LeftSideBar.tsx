import {
  Briefcase,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Map,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2">
        <h1 className="text-xl font-bold">Career AI</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex h-full flex-col">
          <Link
            to="/dashboard"
            className="px-4 py-2 flex gap-2 hover:bg-gray-700 cursor-pointer"
          >
            <LayoutDashboard />
            Dashboard
          </Link>
          <Link
            to="/skill-gap"
            className="px-4 py-2 flex gap-2 hover:bg-gray-700 cursor-pointer"
          >
            <GraduationCap />
            Skill gap
          </Link>
          <Link
            to="/resume-ai"
            className="px-4 py-2 flex gap-2 hover:bg-gray-700 cursor-pointer"
          >
            <FileText />
            Resume AI
          </Link>
          <Link
            to="/opportunities"
            className="px-4 py-2 flex gap-2 hover:bg-gray-700 cursor-pointer"
          >
            <Briefcase />
            Opportunities
          </Link>
          <Link
            to="/roadmap"
            className="px-4 py-2 flex gap-2 hover:bg-gray-700 cursor-pointer"
          >
            <Map />
            RoadMap
          </Link>
          <Link
            to="/settings"
            className="px-4 mt-auto flex gap-2 py-2 hover:bg-gray-700 cursor-pointer"
          >
            <Settings />
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
