import { Outlet } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useState } from "react";
import LeftSidebar from "./LeftSideBar";
import TopBar from "./TopBar";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return (
    <div className="h-screen text-white flex flex-col">
      <ResizablePanelGroup
        orientation="horizontal"
        className="flex-1 flex h-full overflow-hidden p-2"
      >
        {/* left sidebar */}
        <ResizablePanel
          defaultSize={20}
          minSize={isMobile ? 0 : 10}
          maxSize={200}
        >
          <LeftSidebar />
        </ResizablePanel>

        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

        {/* Main content */}
        <ResizablePanel className="h-screen" defaultSize={isMobile ? 80 : 60}>
          <TopBar />
          <div className="h-full overflow-y-auto">
            <Outlet />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default MainLayout;
