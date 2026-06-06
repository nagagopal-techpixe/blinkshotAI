import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const navItems = [
  { path: "/dashboard",     label: "Home",         icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { path: "/projects",      label: "Projects",     icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg> },
  { path: "/create",        label: "Create",       icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg> },
  { path: "/templates",     label: "Templates",    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="5" rx="1"/><rect x="3" y="11" width="8" height="10" rx="1"/><rect x="14" y="11" width="7" height="10" rx="1"/></svg> },
  { path: "/photo-editor",  label: "Photo Editor", icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
  { path: "/reel-editor",   label: "Reel Editor",  icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg> },
  { path: "/team",          label: "Team",         icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> },
  { path: "/analytics",     label: "Analytics",    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { path: "/notifications", label: "Notifications",icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> },
  { path: "/subscription",  label: "Subscription", icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg> },
  { path: "/settings",      label: "Settings",     icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
  { path: "/profile",       label: "Profile",      icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
];

export default function Sidebar({ isOpen, onClose }) {
  // Close sidebar on route change (mobile)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && onClose) onClose();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onClose]);

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
          onClick={onClose}
        />
      )}

      <aside
        className="fixed top-0 left-0 h-screen flex flex-col z-40 transition-transform duration-300 ease-in-out"
        style={{
          width: 270,
          background: "#0D0D18",
          borderRight: "1px solid #1e1e2e",
          transform: isOpen ? "translateX(0)" : undefined,
        }}
        // On desktop always visible; on mobile controlled by isOpen
        data-open={isOpen}
      >
        {/* Mobile close button */}
        <button
          className="absolute top-4 right-4 lg:hidden w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
          onClick={onClose}
          style={{ color: "#9191A8" }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 mb-2">
          <div style={{
            width: 46, height: 46, borderRadius: 12, flexShrink: 0,
            background: "linear-gradient(135deg, #8D45FE, #FD4FDA)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 4h8a4 4 0 010 8H5V4z" fill="white" fillOpacity="0.9"/>
              <path d="M5 12h9a4 4 0 010 8H5V12z" fill="white"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-white font-bold text-lg tracking-tight">Blink</span>
              <span style={{ color: "#FD4FDA" }} className="font-bold text-lg tracking-tight">Short</span>
              <span className="text-[9px] font-semibold px-1 py-0.5 rounded ml-0.5"
                style={{ background: "#2a2a3a", color: "#9191A8" }}>AI</span>
            </div>
            <p className="text-[10px] text-[#9191A8] tracking-widest uppercase mt-0.5">
              Create Shorts in a Blink
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
          {navItems.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => { if (window.innerWidth < 1024 && onClose) onClose(); }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                ${isActive
                  ? "text-white"
                  : "text-[#9191A8] hover:text-white hover:bg-white/5"
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background: "linear-gradient(90deg, rgba(141,69,254,0.25), rgba(253,79,218,0.1))",
                      borderLeft: "3px solid #8D45FE",
                      paddingLeft: "13px",
                    }
                  : {}
              }
            >
              <span className="flex-shrink-0">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom user strip */}
        <div
          className="mx-3 mb-4 mt-2 flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-white/5 transition-all"
          style={{ border: "1px solid #1e1e2e" }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #8D45FE, #FD4FDA)" }}
          >
            AK
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">Akash</p>
            <p className="text-[#9191A8] text-xs truncate">akash@email.com</p>
          </div>
          <svg width="16" height="16" fill="none" stroke="#9191A8" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </aside>

      {/* Desktop visibility CSS */}
      <style>{`
        @media (max-width: 1023px) {
          aside[data-open="false"] {
            transform: translateX(-100%);
          }
          aside[data-open="true"] {
            transform: translateX(0);
          }
        }
        @media (min-width: 1024px) {
          aside {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </>
  );
}