const actions = [
  {
    label: "Edit Photos",
    sub: "Batch retouching",
    bg: "#2D1E4F",
    icon: (
      <svg width="26" height="26" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.6" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    ),
  },
  {
    label: "Create Reel",
    sub: "AI-generated cinematic",
    bg: "#3A1728",
    icon: (
      <svg width="26" height="26" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.6" viewBox="0 0 24 24">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M8 4v16M2 9h6M2 15h6"/>
        <polygon points="11,9 19,12 11,15" fill="rgba(255,255,255,0.75)" stroke="none"/>
      </svg>
    ),
  },
  {
    label: "Upload Content",
    sub: "From any source",
    bg: "#0E3038",
    icon: (
      <svg width="26" height="26" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.6" viewBox="0 0 24 24">
        <polyline points="16 16 12 12 8 16"/>
        <line x1="12" y1="12" x2="12" y2="21"/>
        <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
      </svg>
    ),
  },
  {
    label: "AI Captions",
    sub: "On-brand & viral",
    bg: "#0D2E2A",
    icon: (
      <svg width="26" height="26" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.6" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        <line x1="8" y1="10" x2="16" y2="10"/>
        <line x1="8" y1="14" x2="13" y2="14"/>
      </svg>
    ),
  },
  {
    label: "Product Reels",
    sub: "Conversion-ready ads",
    bg: "#3A1010",
    icon: (
      <svg width="26" height="26" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.6" viewBox="0 0 24 24">
        <rect x="3" y="5" width="18" height="16" rx="2"/>
        <path d="M3 10h18M8 5V3M16 5V3"/>
        <path d="M7 15h4M7 18h6"/>
      </svg>
    ),
  },
  {
    label: "Wedding Reels",
    sub: "Cinematic teasers",
    bg: "#3A2A0A",
    icon: (
      <svg width="26" height="26" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.6" viewBox="0 0 24 24">
        <circle cx="9" cy="7" r="4"/>
        <circle cx="15" cy="7" r="4"/>
        <path d="M2 21v-2a4 4 0 014-4h2M22 21v-2a4 4 0 00-4-4h-2"/>
      </svg>
    ),
  },
  {
    label: "Event Highlights",
    sub: "Best moments auto-cut",
    bg: "#151B38",
    icon: (
      <svg width="26" height="26" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.6" viewBox="0 0 24 24">
        <path d="M20 12V22H4V12"/>
        <path d="M22 7H2v5h20V7z"/>
        <path d="M12 22V7"/>
        <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
      </svg>
    ),
  },
  {
    label: "Social Exports",
    sub: "Reels, Shorts, TikTok",
    bg: "#2A1535",
    icon: (
      <svg width="26" height="26" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.6" viewBox="0 0 24 24">
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    ),
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl p-4 lg:p-5 mb-4" style={{ background: "#060B28", border: "1px solid #222" }}>
      <h2 className="text-white text-base lg:text-lg font-bold mb-4">Quick Actions</h2>
      {/* 2 cols on mobile, 4 cols on sm+, 8 cols (all in one row) on xl */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {actions.map(({ label, sub, bg, icon }) => (
          <div
            key={label}
            className="rounded-2xl p-3 lg:p-4 relative flex flex-col justify-end cursor-pointer hover:opacity-85 transition-opacity"
            style={{ background: bg, minHeight: "110px" }}
          >
            <span className="absolute top-2.5 right-2.5 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>↗</span>
            <div className="mb-2 lg:mb-3">{icon}</div>
            <p className="text-white text-xs lg:text-sm font-extrabold leading-tight mb-0.5">{label}</p>
            {/* Hide subtitle on mobile to save space */}
            <p className="text-xs hidden sm:block" style={{ color: "rgba(255,255,255,0.55)" }}>{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}