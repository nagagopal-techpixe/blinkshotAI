const statsCards = [
  {
    label: "AI Credits Remaining", value: "12,450", change: "+12%",
    bg: "linear-gradient(135deg, #8D45FE, #6B2FD9)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  },
  {
    label: "Active Projects", value: "24", change: "+8",
    bg: "linear-gradient(135deg, #2563EB, #1D4ED8)",
    icon: <svg width="22" height="22" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>,
  },
  {
    label: "Reels Generated Today", value: "48", change: "+35%",
    bg: "linear-gradient(135deg, #EC4899, #BE185D)",
    icon: <svg width="22" height="22" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  },
  {
    label: "AI Photo Edits", value: "53", change: "+20%",
    bg: "linear-gradient(135deg, #059669, #047857)",
    icon: <svg width="22" height="22" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  },
];

export default function StatsCards() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 16,
      marginBottom: 24,
    }}
    className="stats-grid"
    >
      <style>{`
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
        }
      `}</style>

      {statsCards.map(({ label, value, change, bg, icon }) => (
        <div key={label} style={{
          borderRadius: 16,
          padding: "18px 16px",
          background: "#060B28",
          border: "1px solid #1e2350",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}>
          {/* Icon + Label row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: bg,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {icon}
            </div>
            <span style={{
              color: "#9191A8", fontSize: 13, fontWeight: 500, lineHeight: 1.3,
            }}>
              {label}
            </span>
          </div>

          {/* Value + Change */}
          <div>
            <p style={{
              color: "#fff", fontSize: 30, fontWeight: 800,
              lineHeight: 1, margin: "0 0 6px",
            }}>
              {value}
            </p>
            <p style={{ margin: 0, fontSize: 13 }}>
              <span style={{ color: "#4ADE80", fontWeight: 600 }}>{change}</span>
              <span style={{ color: "#9191A8" }}> this week</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}