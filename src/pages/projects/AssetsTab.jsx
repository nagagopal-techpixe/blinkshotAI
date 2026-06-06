const assets = Array.from({ length: 8 }, (_, i) => ({
  name: "clip_01.mp4",
  meta: "2.4 MB · 3s",
  type: "Video",
}));

export default function AssetsTab() {
  return (
    // 2 cols mobile, 3 sm, 4 lg
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
      {assets.map((asset, i) => (
        <div key={i} className="rounded-2xl overflow-hidden cursor-pointer group"
          style={{ background: "#060B28", border: "1px solid #222" }}>
          <div className="relative flex items-center justify-center"
            style={{ aspectRatio: "16/9", background: "linear-gradient(135deg, #060B28, #1a1a3e)" }}>
            <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-md"
              style={{ background: "rgba(141,69,254,0.25)", color: "#8D45FE" }}>
              {asset.type}
            </span>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(4px)" }}>
              <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
          </div>
          <div className="px-3 py-2.5">
            <p className="text-white text-xs lg:text-sm font-semibold truncate">{asset.name}</p>
            <p className="text-xs mt-0.5" style={{ color: "#9191A8" }}>{asset.meta}</p>
          </div>
        </div>
      ))}
    </div>
  );
}