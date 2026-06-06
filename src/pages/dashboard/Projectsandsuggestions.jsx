const projects = [
  {
    name: "Wedding teaser for Sarah & James",
    meta: "128 photos · 3 reels · 2.4 GB",
    badge: "Processing",
    badgeColor: { bg: "rgba(141,69,254,0.2)", text: "#8D45FE" },
    thumbBg: "linear-gradient(135deg,#2a1535,#3b1a4a)",
  },
  {
    name: "FashionBrand Q2",
    meta: "45 videos · 1 reel · 1.1 GB",
    badge: "In Review",
    badgeColor: { bg: "rgba(253,79,218,0.2)", text: "#FD4FDA" },
    thumbBg: "linear-gradient(135deg,#1a2a3b,#0f1a2a)",
  },
  {
    name: "Maldives Travel Reel",
    meta: "22 clips · 1 reel · 800 MB",
    badge: "Completed",
    badgeColor: { bg: "rgba(74,222,128,0.15)", text: "#4ADE80" },
    thumbBg: "linear-gradient(135deg,#0f2a2a,#082020)",
  },
  {
    name: "TechConf Highlights",
    meta: "60 clips · 2 reels · 3.2 GB",
    badge: "Draft",
    badgeColor: { bg: "rgba(145,145,168,0.15)", text: "#9191A8" },
    thumbBg: "linear-gradient(135deg,#1a1a2e,#12102a)",
  },
];

const PlayIcon = () => (
  <svg width="20" height="20" fill="none" stroke="#9191A8" strokeWidth="1.5" viewBox="0 0 24 24">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

export function RecentProjects() {
  return (
    <div className="rounded-2xl p-4 lg:p-5 flex-1" style={{ background: "#060B28", border: "1px solid #222" }}>
      <h2 className="text-white text-base lg:text-lg font-bold mb-4">Recent Projects</h2>
      <div className="flex flex-col">
        {projects.map(({ name, meta, badge, badgeColor, thumbBg }, i) => (
          <div
            key={name}
            className="flex items-center gap-3 py-3"
            style={{ borderBottom: i < projects.length - 1 ? "1px solid #1a1a2e" : "none" }}
          >
            <div
              className="rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ width: 60, height: 44, background: thumbBg }}
            >
              <PlayIcon />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate mb-0.5">{name}</p>
              {/* Hide meta text on very small screens */}
              <p className="text-xs hidden sm:block" style={{ color: "#9191A8" }}>{meta}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span
                className="text-xs font-semibold px-2 py-1 rounded-full block mb-1"
                style={{ background: badgeColor.bg, color: badgeColor.text }}
              >
                {badge}
              </span>
              <p className="text-xs hidden sm:block" style={{ color: "#9191A8" }}>Updated yesterday</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AISuggestions() {
  const suggestions = [
    "Apply this week's top-performing grade to your wedding batch for +34% approval.",
    "Apply this week's top-performing grade to your wedding batch for +34% approval.",
  ];
  return (
    <div className="rounded-2xl p-4 lg:p-5" style={{ background: "#060B28", border: "1px solid #222" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-base lg:text-lg font-bold">AI Suggestions</h2>
        <button className="text-sm font-semibold hover:opacity-80 transition-opacity" style={{ color: "#8D45FE" }}>
          View all
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {suggestions.map((desc, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: "#1a1a2e", border: "1px solid #222" }}>
            <p className="text-white text-sm font-bold mb-1">Cinematic grade trending</p>
            <p className="text-xs mb-3" style={{ color: "#9191A8", lineHeight: 1.5 }}>{desc}</p>
            <div className="flex items-center justify-between">
              <button
                className="text-xs font-bold text-white px-3 py-1.5 rounded-lg"
                style={{ background: "linear-gradient(90deg,#8D45FE,#FD4FDA)" }}
              >
                Apply Style
              </button>
              <button className="text-xs font-semibold hover:opacity-80" style={{ color: "#8D45FE" }}>
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}