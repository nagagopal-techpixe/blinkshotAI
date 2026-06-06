import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import AssetsTab    from "./AssetsTab.jsx";
import VersionsTab  from "./VersionsTab.jsx";
import CommentsTab  from "./CommentsTab.jsx";
import AnalyticsTab from "./AnalyticsTab.jsx";
import SettingsTab  from "./SettingsTab.jsx";

const tabs = [
  { label: "Overview",  path: "" },
  { label: "Assets",    path: "assets" },
  { label: "Versions",  path: "versions" },
  { label: "Comments",  path: "comments" },
  { label: "Analytics", path: "analytics" },
  { label: "Settings",  path: "settings" },
];

const stats = [
  { icon: <svg width="16" height="16" fill="none" stroke="#8D45FE" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, label: "Render progress", value: "68%", sub: "2 min remaining" },
  { icon: <svg width="16" height="16" fill="none" stroke="#8D45FE" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><polygon points="11,9 19,12 11,15" fill="#8D45FE" stroke="none"/></svg>, label: "Clips", value: "14", sub: "3 video · 4 photo · 2 audio · 5 text" },
  { icon: <svg width="16" height="16" fill="none" stroke="#8D45FE" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>, label: "Collaborators", value: "3", sub: "2 editors · 1 viewer" },
  { icon: <svg width="16" height="16" fill="none" stroke="#8D45FE" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, label: "Approvals", value: "1 / 2", sub: "Awaiting client" },
];

const details = [
  { label: "Type", value: "Wedding Teaser" }, { label: "Aspect", value: "9:16 vertical" },
  { label: "Duration", value: "30 seconds" }, { label: "Resolution", value: "4K · 60fps" },
  { label: "Style", value: "Cinematic warm" }, { label: "Music", value: "Aurora — Lo-Fi" },
  { label: "Owner", value: "Sarah Chen" },    { label: "Created", value: "Mar 14, 2026" },
];

const team = [
  { initials: "SC", color: "linear-gradient(135deg,#8D45FE,#FD4FDA)", name: "Sarah Chen",   role: "Owner"  },
  { initials: "MT", color: "linear-gradient(135deg,#059669,#34d399)", name: "Marcus Lee",    role: "Editor" },
  { initials: "MT", color: "linear-gradient(135deg,#2563EB,#60a5fa)", name: "Aria — Client", role: "Viewer" },
];

const pipeline = [
  { step: "Source ingest",        sub: "14 clips · 1.2 GB",  status: "done"   },
  { step: "Scene detection",      sub: "32 scenes detected",  status: "done"   },
  { step: "AI auto-cut",          sub: "Pace: cinematic",     status: "done"   },
  { step: "Color grade · Filmic", sub: "LUT applied",         status: "done"   },
  { step: "Motion graphics",      sub: "Rendering titles...", status: "active" },
  { step: "Audio mix & VO",       sub: "Queued",              status: "idle"   },
  { step: "Export · 4K H.265",    sub: "Queued",              status: "idle"   },
];

function OverviewTab({ playing, setPlaying }) {
  return (
    // Stack on mobile, 2-col on lg
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
      <div className="flex flex-col gap-4">
        {/* Video preview */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#060B28", border: "1px solid #222" }}>
          <div className="relative" style={{ aspectRatio: "16/9" }}>
            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80" alt="preview" className="w-full h-full object-cover"/>
            <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.35)" }}/>
            <span className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-lg" style={{ background: "rgba(141,69,254,0.25)", color: "#8D45FE" }}>Processing</span>
            <button onClick={() => setPlaying(!playing)} className="absolute inset-0 flex items-center justify-center" style={{ background: "none", border: "none", cursor: "pointer" }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(6px)" }}>
                <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
                  {playing ? <><rect x="6" y="4" width="4" height="16" fill="white"/><rect x="14" y="4" width="4" height="16" fill="white"/></> : <polygon points="5 3 19 12 5 21 5 3"/>}
                </svg>
              </div>
            </button>
            <div className="absolute bottom-3 left-3 text-xs font-mono text-white">00:12 / 00:30</div>
          </div>
          <div className="px-4 pt-3 pb-3">
            <div className="h-1 rounded-full mb-3" style={{ background: "#1e1e2e" }}>
              <div className="h-full rounded-full" style={{ width: "40%", background: "linear-gradient(90deg,#8D45FE,#FD4FDA)" }}/>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2" style={{ color: "#9191A8" }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <span className="text-xs">00:12 / 00:30</span>
              </div>
              <button className="text-xs font-semibold hover:opacity-80" style={{ color: "#8D45FE", background: "none", border: "none", cursor: "pointer" }}>Open in Reel Editor →</button>
            </div>
          </div>
        </div>

        {/* AI Pipeline */}
        <div className="rounded-2xl p-4 lg:p-5" style={{ background: "#060B28", border: "1px solid #222" }}>
          <h2 className="text-white text-base font-bold mb-4">AI Pipeline</h2>
          <div className="flex flex-col">
            {pipeline.map(({ step, sub, status }, i) => (
              <div key={step} className="flex items-center gap-3 py-3" style={{ borderBottom: i < pipeline.length - 1 ? "1px solid #1a1a2e" : "none" }}>
                <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: status === "done" ? "rgba(74,222,128,0.15)" : status === "active" ? "rgba(141,69,254,0.2)" : "#1a1a2e" }}>
                  {status === "done"   && <svg width="12" height="12" fill="none" stroke="#4ADE80" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                  {status === "active" && <svg width="12" height="12" fill="none" stroke="#8D45FE" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 3"/></svg>}
                  {status === "idle"   && <svg width="12" height="12" fill="none" stroke="#9191A8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 3"/></svg>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: status === "idle" ? "#9191A8" : "#fff" }}>{step}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#9191A8" }}>{sub}</p>
                </div>
                {status === "active" && <span className="text-xs font-semibold flex-shrink-0" style={{ color: "#8D45FE" }}>In progress</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right sidebar — stacks below on mobile */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl p-4 lg:p-5" style={{ background: "#060B28", border: "1px solid #222" }}>
          <h2 className="text-white text-base font-bold mb-4">Project details</h2>
          {/* 2-col grid on mobile for details, single col on lg sidebar */}
          <div className="grid grid-cols-2 lg:grid-cols-1">
            {details.map(({ label, value }, i) => (
              <div key={label} className="flex items-center justify-between py-2.5" style={{ borderBottom: i < details.length - 1 ? "1px solid #1a1a2e" : "none" }}>
                <span className="text-xs" style={{ color: "#9191A8" }}>{label}</span>
                <span className="text-xs font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-4 lg:p-5" style={{ background: "#060B28", border: "1px solid #222" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-base font-bold">Team</h2>
            <button className="text-xs font-semibold hover:opacity-80" style={{ color: "#8D45FE", background: "none", border: "none", cursor: "pointer" }}>+ Invite</button>
          </div>
          <div className="flex flex-col gap-3">
            {team.map(({ initials, color, name, role }) => (
              <div key={name} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: color }}>{initials}</div>
                <p className="text-white text-sm font-semibold">{name} · <span style={{ color: "#9191A8", fontWeight: 400 }}>{role}</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const [playing, setPlaying] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const segments = location.pathname.split("/");
  const lastSegment = segments[segments.length - 1];
  const activeTab = isNaN(lastSegment) ? lastSegment : "";

  const renderTab = () => {
    switch (activeTab) {
      case "":          return <OverviewTab playing={playing} setPlaying={setPlaying} />;
      case "assets":    return <AssetsTab />;
      case "versions":  return <VersionsTab />;
      case "comments":  return <CommentsTab />;
      case "analytics": return <AnalyticsTab />;
      case "settings":  return <SettingsTab />;
      default:          return <div className="text-[#9191A8] text-sm py-8 text-center">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} — coming soon</div>;
    }
  };

  const goTab = (tabPath) => {
    if (tabPath === "") navigate(`/projects/${id}`);
    else navigate(`/projects/${id}/${tabPath}`);
  };

  return (
    <div className="min-h-screen p-4 lg:p-6" style={{ background: "#060B28" }}>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-3">
        <button onClick={() => navigate("/projects")}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
          style={{ background: "#060B28", border: "1px solid #222" }}>
          <svg width="14" height="14" fill="none" stroke="#9191A8" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <span className="text-xs truncate" style={{ color: "#9191A8" }}>
          <span className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate("/dashboard")}>Dashboard</span>
          {" / "}
          <span className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate("/projects")}>Projects</span>
          {" / "}
          <span className="text-white font-semibold">Sarah James Wedding Teaser</span>
        </span>
      </div>

      {/* Title row */}
  <div className="flex items-start justify-between mb-4 lg:mb-5 gap-3">
  
  {/* Left: badges + title */}
  <div className="min-w-0 flex-1">
    <div className="flex items-center gap-2 mb-2 flex-wrap">
      <span className="text-xs font-bold px-2 py-0.5 rounded-md"
        style={{ background: "rgba(141,69,254,0.2)", color: "#8D45FE" }}>Reel · 9:16</span>
      <span className="text-xs font-bold px-2 py-0.5 rounded-md"
        style={{ background: "rgba(141,69,254,0.15)", color: "#8D45FE" }}>Processing</span>
      <span className="text-xs hidden sm:inline" style={{ color: "#9191A8" }}>Updated 2 min ago</span>
    </div>
    <h1 className="text-white text-xl lg:text-3xl font-extrabold mb-1 leading-tight">
      Sarah James Wedding Teaser
    </h1>
    <p className="text-xs lg:text-sm" style={{ color: "#9191A8" }}>
      Cinematic teaser · 30s · BlinkShort v4 model
    </p>
  </div>

  {/* Right: buttons — always top-right, compact on mobile */}
  <div className="flex items-center gap-2 flex-shrink-0">
    <button className="px-3 lg:px-5 py-2 lg:py-2.5 rounded-xl text-white font-bold hover:opacity-90"
      style={{ background: "linear-gradient(90deg,#8D45FE,#FD4FDA)", fontSize: 13 }}>
      Export
    </button>
    <button className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl flex items-center justify-center"
      style={{ background: "#060B28", border: "1px solid #222" }}>
      <svg width="16" height="16" viewBox="0 0 24 24">
        <circle cx="12" cy="5" r="1.5" fill="#9191A8"/>
        <circle cx="12" cy="12" r="1.5" fill="#9191A8"/>
        <circle cx="12" cy="19" r="1.5" fill="#9191A8"/>
      </svg>
    </button>
  </div>

</div>

      {/* Stat cards — 2 cols mobile, 4 cols lg */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {stats.map(({ icon, label, value, sub }) => (
          <div key={label} className="rounded-2xl p-3 lg:p-4" style={{ background: "#060B28", border: "1px solid #222" }}>
            <div className="flex items-center gap-1.5 mb-2">{icon}<span className="text-xs truncate" style={{ color: "#9191A8" }}>{label}</span></div>
            <p className="text-white text-xl lg:text-2xl font-extrabold mb-0.5">{value}</p>
            <p className="text-xs hidden sm:block" style={{ color: "#9191A8" }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full mb-4 lg:mb-5" style={{ background: "#1e1e2e" }}>
        <div className="h-full rounded-full" style={{ width: "68%", background: "linear-gradient(90deg, #8D45FE, #FD4FDA)" }}/>
      </div>

      {/* Tabs — scrollable on mobile */}
      <div className="mb-4 lg:mb-5" style={{ borderBottom: "1px solid #1e1e2e" }}>
        <div className="flex gap-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {tabs.map(({ label, path }) => {
            const isActive = activeTab === path;
            return (
              <button key={path} onClick={() => goTab(path)}
                className="px-3 lg:px-4 py-2.5 text-xs lg:text-sm font-semibold relative transition-colors whitespace-nowrap flex-shrink-0"
                style={{ color: isActive ? "#fff" : "#9191A8", background: "none", border: "none", cursor: "pointer" }}>
                {label}
                {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: "linear-gradient(90deg,#8D45FE,#FD4FDA)" }}/>}
              </button>
            );
          })}
        </div>
      </div>

      {renderTab()}

    </div>
  );
}