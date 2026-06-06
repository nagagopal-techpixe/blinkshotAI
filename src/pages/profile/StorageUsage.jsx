const breakdownItems = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="url(#grad1)"/>
        <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <defs>
          <linearGradient id="grad1" x1="0" y1="0" x2="24" y2="24">
            <stop stopColor="#8D45FE"/><stop offset="1" stopColor="#FD4FDA"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    label: "Reels & Video",
    used: 186,
    total: 500,
    color: "linear-gradient(90deg,#8D45FE,#FD4FDA)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="url(#grad2)"/>
        <circle cx="12" cy="10" r="3" stroke="white" strokeWidth="1.8"/>
        <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="white" strokeWidth="1.8"/>
        <defs>
          <linearGradient id="grad2" x1="0" y1="0" x2="24" y2="24">
            <stop stopColor="#8D45FE"/><stop offset="1" stopColor="#FD4FDA"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    label: "Photos & Edits",
    used: 186,
    total: 500,
    color: "linear-gradient(90deg,#8D45FE,#FD4FDA)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="url(#grad3)"/>
        <path d="M9 18V6l11 6-11 6z" fill="white"/>
        <defs>
          <linearGradient id="grad3" x1="0" y1="0" x2="24" y2="24">
            <stop stopColor="#22d3ee"/><stop offset="1" stopColor="#2563EB"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    label: "Audio & Music",
    used: 186,
    total: 500,
    color: "linear-gradient(90deg,#22d3ee,#2563EB)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="url(#grad4)"/>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="white" strokeWidth="1.8" fill="none"/>
        <path d="M14 2v6h6" stroke="white" strokeWidth="1.8"/>
        <defs>
          <linearGradient id="grad4" x1="0" y1="0" x2="24" y2="24">
            <stop stopColor="#f59e0b"/><stop offset="1" stopColor="#D97706"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    label: "Drafts & Docs",
    used: 186,
    total: 500,
    color: "linear-gradient(90deg,#f59e0b,#D97706)",
  },
];

const largestFiles = [
  { name: "wedding-highlight-final-v3.mp4", ago: "2h ago", size: "2.4 GB" },
  { name: "wedding-highlight-final-v3.mp4", ago: "2h ago", size: "2.4 GB" },
  { name: "wedding-highlight-final-v3.mp4", ago: "2h ago", size: "2.4 GB" },
  { name: "wedding-highlight-final-v3.mp4", ago: "2h ago", size: "2.4 GB" },
];

export default function StorageUsage() {
  const totalUsed = 312;
  const totalGB   = 500;
  const pct       = (totalUsed / totalGB) * 100;

  return (
    <>
      <style>{`
        .su-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .su-grid-2 { grid-template-columns: 1fr 1fr; }
        .su-file-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
        .su-ago { flex-shrink: 0; }
        @media (max-width: 640px) {
          .su-header { flex-direction: column; align-items: stretch; }
          .su-header-btn { width: 100%; text-align: center; }
          .su-grid-2 { grid-template-columns: 1fr !important; }
          .su-ago { display: none; }
        }
      `}</style>

      <div className="min-h-screen p-6" >

        {/* Header */}
        <div className="su-header mb-6">
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 className="text-white font-extrabold" style={{ fontSize: "clamp(18px, 5vw, 30px)", margin: "0 0 4px 0" }}>
              Storage Usage
            </h1>
            <p className="text-sm" style={{ color: "#9191A8", margin: 0 }}>
              Track cloud storage across your projects, raw uploads, and exports.
            </p>
          </div>
          <button
            className="su-header-btn rounded-xl text-white font-bold hover:opacity-90 transition-opacity"
            style={{
              background: "linear-gradient(90deg,#8D45FE,#FD4FDA)",
              whiteSpace: "nowrap", padding: "8px 16px",
              fontSize: 13, border: "none", cursor: "pointer",
            }}
          >
            Buy more storage
          </button>
        </div>

        {/* Total used card */}
        <div className="rounded-2xl p-6 mb-4" style={{ background: "linear-gradient(135deg,#1a0a3a,#2a0a4a,#0a1a3a)", border: "1px solid #2a1a4a" }}>
          <p className="text-sm font-semibold mb-2" style={{ color: "#a78bfa" }}>Total used</p>
          <div className="flex items-baseline gap-2 mb-1" style={{ flexWrap: "wrap" }}>
            <span className="text-white font-extrabold" style={{ fontSize: "clamp(28px, 8vw, 42px)" }}>{totalUsed} GB</span>
            <span style={{ color: "#9191A8", fontSize: 16 }}>/ {totalGB} GB</span>
          </div>
          <p className="text-sm mb-4" style={{ color: "#9191A8" }}>{totalGB - totalUsed} GB available · Studio plan</p>

          {/* Progress bar */}
          <div style={{ background: "#1a1a3a", borderRadius: 99, height: 8, overflow: "hidden" }}>
            <div style={{
              width: `${pct}%`, height: "100%",
              background: "linear-gradient(90deg,#8D45FE,#FD4FDA)", borderRadius: 99,
            }} />
          </div>
        </div>

        {/* Breakdown by type */}
        <div className="rounded-2xl p-6 mb-4" style={{ background: "#060B28", border: "1px solid #222" }}>
          <p className="text-white text-lg font-bold mb-5">Breakdown by type</p>
          <div className="su-grid-2 grid gap-4">
            {breakdownItems.map(({ icon, label, used, total, color }) => (
              <div key={label} className="rounded-xl p-4" style={{ background: "#080e2a", border: "1px solid #1a1a2e" }}>
                <div className="flex items-center gap-3 mb-3" style={{ flexWrap: "nowrap" }}>
                  <span style={{ flexShrink: 0 }}>{icon}</span>
                  <span className="text-white text-sm font-semibold" style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
                  <span className="ml-auto text-sm font-bold" style={{ color: "#9191A8", flexShrink: 0 }}>{used} GB</span>
                </div>
                <div style={{ background: "#1a1a3a", borderRadius: 99, height: 6, overflow: "hidden" }}>
                  <div style={{
                    width: `${(used / total) * 100}%`, height: "100%",
                    background: color, borderRadius: 99,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Largest files */}
        <div className="rounded-2xl p-6" style={{ background: "#060B28", border: "1px solid #222" }}>
          <p className="text-white text-lg font-bold mb-1">Largest files</p>
          <p className="text-sm mb-5" style={{ color: "#9191A8" }}>Free up space by removing what you no longer need.</p>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {largestFiles.map(({ name, ago, size }, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 0",
                  borderBottom: i < largestFiles.length - 1 ? "1px solid #1a1a2e" : "none",
                }}
              >
                {/* File icon */}
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: "linear-gradient(135deg,#8D45FE,#FD4FDA)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                      stroke="white" strokeWidth="1.8" fill="none"/>
                    <path d="M14 2v6h6" stroke="white" strokeWidth="1.8"/>
                  </svg>
                </div>

                {/* Name — truncates on small screens */}
                <span className="su-file-name" style={{ color: "white", fontSize: 14, fontWeight: 500, flex: 1 }}>{name}</span>

                {/* Ago */}
                <span className="su-ago" style={{ color: "#9191A8", fontSize: 13 }}>{ago}</span>

                {/* Size */}
                <span style={{ color: "white", fontWeight: 700, fontSize: 14, flexShrink: 0, minWidth: 48, textAlign: "right" }}>{size}</span>

                {/* Delete */}
                <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}>
                  <svg width="16" height="16" fill="none" stroke="#9191A8" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}