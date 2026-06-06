const versions = [
  { version: "v4 — Current", desc: "Color grade tweaked, music swapped", author: "Marcus", time: "2 min ago", current: true },
  { version: "v3",           desc: "Added closing title card",            author: "Sarah",  time: "1 hour ago" },
  { version: "v2",           desc: "AI auto-cut applied",                 author: "BlinkShort AI", time: "3 hours ago" },
  { version: "v1",           desc: "Initial render from upload",          author: "Sarah",  time: "Yesterday" },
];

export default function VersionsTab() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#060B28", border: "1px solid #222" }}>
      {versions.map(({ version, desc, author, time, current }, i) => (
        <div key={version}
          className="flex items-center gap-3 lg:gap-4 px-4 lg:px-5 py-4"
          style={{ borderBottom: i < versions.length - 1 ? "1px solid #1a1a2e" : "none" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #8D45FE, #FD4FDA)" }}>
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-bold">{version}</p>
            <p className="text-xs mt-0.5 truncate" style={{ color: "#9191A8" }}>{desc}</p>
            <p className="text-xs mt-0.5" style={{ color: "#9191A8" }}>{author} · {time}</p>
          </div>
          {!current && (
            <button className="text-sm font-semibold hover:opacity-80 transition-opacity flex-shrink-0"
              style={{ color: "#8D45FE", background: "none", border: "none", cursor: "pointer" }}>
              Restore
            </button>
          )}
        </div>
      ))}
    </div>
  );
}