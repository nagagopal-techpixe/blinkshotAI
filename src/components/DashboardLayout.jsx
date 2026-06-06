import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

function ProfileBreadcrumb() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  if (!state?.fromProfile) return null;

  const hoverOn  = (e) => (e.target.style.color = "white");
  const hoverOff = (e) => (e.target.style.color = "#9191A8");

  return (
    <div
      className="flex items-center gap-3 px-4 lg:px-6 py-3 -mb-4"
  
    >
      <button
        onClick={() => navigate("/profile")}
        style={{
          background: "linear-gradient(135deg,#22d3ee,#8D45FE)",
          border: "none", borderRadius: 10,
          padding: "7px 11px", cursor: "pointer",
          display: "flex", alignItems: "center",
        }}
      >
        <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
      </button>
      <span style={{ color: "#9191A8", fontSize: 13 }}>
        <span onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}
          onMouseEnter={hoverOn} onMouseLeave={hoverOff}>Dashboard</span>
        {" / "}
        <span onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}
          onMouseEnter={hoverOn} onMouseLeave={hoverOff}>Profile</span>
        {" / "}
        <span style={{ color: "white", fontWeight: 600 }}>{state.title}</span>
      </span>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: "#000000" }}>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Right Side — offset on desktop only */}
      <div className="w-full flex flex-col min-h-screen lg:ml-[270px]" style={{ position: "relative", zIndex: 10 }}>

        {/* Header */}
        <Header onMenuToggle={() => setSidebarOpen(prev => !prev)} />

        {/* Content pushed below fixed header */}
        <div style={{ marginTop: 65 }}>
          <ProfileBreadcrumb />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>

      </div>
    </div>
  );
}