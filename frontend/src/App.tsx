import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import Verified from "./pages/Verfied";
import ProtectedRoute from "./providers/ProtectedRoute";
import CheckingAuth from "./providers/CheckingAuth";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<CheckingAuth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/verify" element={<Verified />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route
          path="/demo"
          element={
            <div className="flex bg-background items-center justify-center h-screen">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Demo in short
              </h3>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
