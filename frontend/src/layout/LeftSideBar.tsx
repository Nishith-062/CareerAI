import {
  Briefcase,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Map,
  Menu,
  Mic,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const LeftSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/resume-ai", icon: FileText, label: "Resume AI" },
    { path: "/opportunities", icon: Briefcase, label: "Opportunities" },
    { path: "/skill-gap", icon: GraduationCap, label: "Skill gap" },
    { path: "/roadmap", icon: Map, label: "RoadMap" },
    { path: "/voice-agent", icon: Mic, label: "Voice Agent" },
  ];

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="flex items-center justify-center md:justify-start px-4 h-14 md:h-16 border-b border-sidebar-border">
        {/* Logo Icon */}
        <div className="bg-primary/10 p-2 rounded-lg mr-0 md:mr-3">
          <Menu className="h-5 w-5 md:h-6 md:w-6 text-primary" />
        </div>
        <h1 className="hidden md:block text-xl font-bold text-primary">
          Menu{" "}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
              ${
                location.pathname === item.path
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }
            `}
          >
            <item.icon
              className={`h-5 w-5 shrink-0 transition-colors ${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-primary"
              }`}
            />
            <span className="hidden md:block font-medium truncate">
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      <div className="p-3 border-t border-sidebar-border mt-auto">
        <Link
          to="/settings"
          className={`
            flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
             ${
               location.pathname === "/settings"
                 ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                 : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
             }
          `}
        >
          <Settings
            className={`h-5 w-5 shrink-0 transition-colors ${
              location.pathname === "/settings"
                ? "text-primary"
                : "text-muted-foreground group-hover:text-primary"
            }`}
          />
          <span className="hidden md:block font-medium truncate">Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default LeftSidebar;
