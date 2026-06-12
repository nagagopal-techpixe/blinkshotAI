const renderQueue = [
  { title: "Wedding Highlight Reel", sub: "Music Sync · Step 5/7", time: "1 min", progress: 80 },
  { title: "Wedding Highlight Reel", sub: "Music Sync · Step 5/7", time: "1 min", progress: 80 },
  { title: "Wedding Highlight Reel", sub: "Music Sync · Step 5/7", time: "1 min", progress: 80 },
];

export default function RenderQueue() {
  return (
    <div className="rounded-2xl p-4 lg:p-5" style={{ background: "#060B28", border: "1px solid #222222" }}>
      <div className="flex items-center justify-between mb-4 lg:mb-5">
        <h2 className="text-white text-base lg:text-lg font-bold">Render Queue</h2>
        <button style={{ color: "#8D45FE" }} className="text-sm font-semibold hover:opacity-80 transition-opacity">
      view all
        </button>
      </div>
      <div className="flex flex-col gap-4 lg:gap-5">
        {renderQueue.map((item, i) => (
          <div key={i} className="flex items-center gap-3 lg:gap-4">
            <div className="rounded-xl flex-shrink-0 flex items-center justify-center"
              style={{
                width: 64, height: 48,
                background: "linear-gradient(135deg, #1a1a2e, #2a1a3e)",
              }}>
              <svg width="22" height="22" fill="none" stroke="#9191A8" strokeWidth="1.5" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-white text-sm font-semibold truncate">{item.title}</p>
                <div className="flex items-center gap-1 text-[#9191A8] text-xs ml-2 flex-shrink-0">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                  {item.time}
                </div>
              </div>
              <p className="text-[#9191A8] text-xs mb-2">{item.sub}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full" style={{ background: "#1e1e2e" }}>
                  <div className="h-full rounded-full"
                    style={{ width: `${item.progress}%`, background: "linear-gradient(90deg, #8D45FE, #FD4FDA)" }}/>
                </div>
                <span className="text-white text-xs font-bold flex-shrink-0">{item.progress}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}