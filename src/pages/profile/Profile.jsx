import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth, getStoredUser } from "../../api/authApi";

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

const settingsItems = [
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
    title: "Personal Info",
    desc: "Name, avatar, contact details.",
    path: "/profile/personal-info",
  },
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    title: "Team Settings",
    desc: "Members, roles, workspace.",
    path: "/profile/team-settings",
  },
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
    title: "Billing",
    desc: "Studio plan · renews Apr 12",
    path: "/subscription",
  },
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    title: "Storage Usage",
    desc: "312 GB of 500 GB used.",
    path: "/profile/storage",
  },
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>,
    title: "API Integrations",
    desc: "Stripe, Drive, Dropbox, Webhooks.",
    path: "/profile/integrations",
  },
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    title: "Notification Settings",
    desc: "Email, push and in-app.",
    path: "/profile/notifications",
  },
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    title: "Security",
    desc: "Devices, sessions, password.",
    path: "/profile/security",
  },
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    title: "Two-factor (2FA)",
    desc: "Currently enabled · Authenticator app.",
    path: "/profile/twoFactor",
  },
];

export default function Profile() {
  const navigate  = useNavigate();
  const w         = useWindowWidth();
  const isMobile  = w < 640;
  const user      = getStoredUser();

  // derive initials from stored user name
  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "AK";

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", padding: isMobile ? "16px 12px" : "24px", fontFamily: "sans-serif", boxSizing: "border-box" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: isMobile ? 48 : 56, height: isMobile ? 48 : 56,
            borderRadius: "50%", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg,#8D45FE,#FD4FDA)",
            color: "#fff", fontSize: isMobile ? 15 : 18, fontWeight: 800,
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h1 style={{ color: "#fff", fontSize: isMobile ? 18 : 22, fontWeight: 800, margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.fullName || "Creator Studio"}
            </h1>
            <p style={{ color: "#9191A8", fontSize: 12, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.email || "creator@blinkshort.ai"} · Studio plan
            </p>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: isMobile ? "8px 12px" : "9px 16px",
              borderRadius: 10, border: "1px solid rgba(248,113,113,0.3)",
              background: "rgba(248,113,113,0.08)", color: "#f87171",
              fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0,
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {!isMobile && "Logout"}
          </button>
        </div>
      </div>

      {/* Settings grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? 10 : 14,
      }}>
        {settingsItems.map(({ icon, title, desc, path }) => (
          <button
            key={title}
            onClick={() => navigate(path, { state: { fromProfile: true, title } })}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 12, borderRadius: 16, padding: isMobile ? "14px 12px" : "18px 16px",
              textAlign: "left", border: "1px solid #222", cursor: "pointer",
              background: "#060B28", width: "100%", boxSizing: "border-box",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#8D45FE"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#222"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 14, minWidth: 0 }}>
              <div style={{
                width: isMobile ? 38 : 44, height: isMobile ? 38 : 44,
                borderRadius: 12, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(141,69,254,0.15)", color: "#a78bfa",
              }}>
                {icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: "#fff", fontSize: isMobile ? 13 : 14, fontWeight: 700, margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {title}
                </p>
                <p style={{ color: "#9191A8", fontSize: 11, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {desc}
                </p>
              </div>
            </div>
            <svg width="15" height="15" fill="none" stroke="#9191A8" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        ))}
      </div>

    </div>
  );
}