import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import Verified from "./pages/Verfied";
import ProtectedRoute from "./providers/ProtectedRoute";
import CheckingAuth from "./providers/CheckingAuth";
import MainLayout from "./layout/MainLayout";
import Resume from "./pages/Resume";
import Opportunities from "./pages/Opportunities";
import Roadmap from "./pages/Roadmap";
import Settings from "./pages/Settings";
import SkillGap from "./pages/SkillGapAnalysis/SkillGap";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/demo" element={<div className="flex items-center justify-center h-screen"><h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Demo in short</h3></div>} />

        {/* Auth-only public pages */}
        <Route element={<CheckingAuth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Unverified users only */}
        <Route path="/verify" element={<Verified />} />

        {/* Protected app */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resume-ai" element={<Resume />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/skill-gap" element={<SkillGap />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}


export default App;
