import { useState } from "react";
import { useNavigate } from "react-router-dom";

const tabs = [
  { label: "All", count: 24 },
  { label: "Active", count: 32 },
  { label: "Processing", count: 4 },
  { label: "Completed", count: 44 },
  { label: "Drafts", count: 12 },
  { label: "Archived", count: 4 },
];

const projects = [
  {
    id: 1,
    name: "Sharma Wedding Gallery",
    type: "Wedding Reel",
    members: "3 members",
    size: "2.4 GB",
    due: "Due in 2 days",
    team: 3,
    progress: 80,
    progressColor: "#8D45FE",
    badge: "Processing",
    badgeColor: { bg: "rgba(141,69,254,0.25)", text: "#8D45FE" },
    thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  },
  {
    id: 2,
    name: "FashionBrand Q2 Campaign",
    type: "Product Reel",
    members: "1 member",
    size: "1.1 GB",
    due: "Due in 2 days",
    team: 3,
    progress: 100,
    progressColor: "#EF4444",
    badge: "In Review",
    badgeColor: { bg: "rgba(253,79,218,0.2)", text: "#FD4FDA" },
    thumb: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
  },
  {
    id: 3,
    name: "Maldives Travel Reel",
    type: "Travel Reel",
    members: "Solo",
    size: "800 MB",
    due: "Due in 2 days",
    team: 3,
    progress: 100,
    progressColor: "#4ADE80",
    badge: "Completed",
    badgeColor: { bg: "rgba(74,222,128,0.15)", text: "#4ADE80" },
    thumb: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80",
  },
  {
    id: 4,
    name: "Sharma Wedding Gallery",
    type: "Wedding Reel",
    members: "3 members",
    size: "2.4 GB",
    due: "Due in 2 days",
    team: 3,
    progress: 80,
    progressColor: "#8D45FE",
    badge: "Processing",
    badgeColor: { bg: "rgba(141,69,254,0.25)", text: "#8D45FE" },
    thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  },
  {
    id: 5,
    name: "FashionBrand Q2 Campaign",
    type: "Product Reel",
    members: "1 member",
    size: "1.1 GB",
    due: "Due in 2 days",
    team: 3,
    progress: 100,
    progressColor: "#EF4444",
    badge: "In Review",
    badgeColor: { bg: "rgba(253,79,218,0.2)", text: "#FD4FDA" },
    thumb: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
  },
  {
    id: 6,
    name: "Maldives Travel Reel",
    type: "Travel Reel",
    members: "Solo",
    size: "800 MB",
    due: "Due in 2 days",
    team: 3,
    progress: 100,
    progressColor: "#4ADE80",
    badge: "Completed",
    badgeColor: { bg: "rgba(74,222,128,0.15)", text: "#4ADE80" },
    thumb: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80",
  },
];

const PlayIcon = () => (
  <div
    className="w-10 h-10 rounded-full flex items-center justify-center"
    style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(4px)" }}
  >
    <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  </div>
);

export default function Projects() {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 lg:p-6" style={{ background: "#060B28" }}>

      {/* Page header */}
      <div className="flex items-start justify-between mb-5 lg:mb-6 gap-3">
        <div>
          <h1 className="text-white text-2xl lg:text-3xl font-extrabold mb-1">Projects</h1>
          <p className="text-sm" style={{ color: "#9191A8" }}>
            Track everything in flight across your studio.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-opacity hover:opacity-90 flex-shrink-0"
          style={{ background: "linear-gradient(90deg, #8D45FE, #FD4FDA)" }}
        >
          <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="hidden sm:inline">New Project</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Tabs — horizontally scrollable on mobile */}
      <div className="mb-5 lg:mb-6" style={{ borderBottom: "1px solid #1e1e2e" }}>
        <div className="flex gap-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {tabs.map(({ label, count }, i) => (
            <button
              key={label}
              onClick={() => setActiveTab(i)}
              className="px-3 lg:px-4 py-2.5 text-xs lg:text-sm font-semibold transition-all relative whitespace-nowrap flex-shrink-0"
              style={{
                color: activeTab === i ? "#fff" : "#9191A8",
                background: "none",
                border: "none",
                cursor: "pointer",
                paddingBottom: "10px",
              }}
            >
              {label} ({count})
              {activeTab === i && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: "linear-gradient(90deg, #8D45FE, #FD4FDA)" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Project grid — 1 col mobile, 2 col sm, 3 col lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {projects.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/projects/${p.id}`)}
            className="rounded-2xl overflow-hidden cursor-pointer"
            style={{ background: "#060B28", border: "1px solid #222", transition: "opacity 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            {/* Thumbnail */}
            <div className="relative" style={{ aspectRatio: "16/9" }}>
              <img
                src={p.thumb}
                alt={p.name}
                className="w-full h-full object-cover"
                style={{ display: "block" }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.25)" }}
              >
                <PlayIcon />
              </div>
              <span
                className="absolute top-2.5 left-2.5 text-xs font-bold px-2.5 py-1 rounded-lg"
                style={{ background: p.badgeColor.bg, color: p.badgeColor.text }}
              >
                {p.badge}
              </span>
            </div>

            {/* Card body */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <p className="text-white text-sm font-bold leading-tight">{p.name}</p>
                <button
                  onClick={e => e.stopPropagation()}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "0 0 0 8px", flexShrink: 0 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <circle cx="12" cy="5" r="1.5" fill="#9191A8"/>
                    <circle cx="12" cy="12" r="1.5" fill="#9191A8"/>
                    <circle cx="12" cy="19" r="1.5" fill="#9191A8"/>
                  </svg>
                </button>
              </div>
              <p className="text-xs mb-3" style={{ color: "#9191A8" }}>
                {p.type} · {p.members} · {p.size}
              </p>

              {/* Progress bar */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-1.5 rounded-full" style={{ background: "#1e1e2e" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${p.progress}%`, background: p.progressColor }}
                  />
                </div>
                <span className="text-xs font-bold text-white" style={{ minWidth: 28 }}>
                  {p.progress}%
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5" style={{ color: "#9191A8" }}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                  <span className="text-xs">{p.due}</span>
                </div>
                <div className="flex items-center gap-1" style={{ color: "#9191A8" }}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                  <span className="text-xs">{p.team}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}