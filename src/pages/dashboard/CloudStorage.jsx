export default function CloudStorage() {
  return (
    <div className="rounded-2xl p-4 lg:p-5" style={{ background: "#060B28", border: "1px solid #222222" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #EC4899, #8D45FE)" }}>
          <svg width="18" height="18" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>
          </svg>
        </div>
        <div>
          <p className="text-white font-bold text-sm lg:text-base">Cloud Storage</p>
          <p className="text-[#9191A8] text-xs">312 GB of 500 GB</p>
        </div>
      </div>
      <div className="h-2 rounded-full mb-1" style={{ background: "#1e1e2e" }}>
        <div className="h-full rounded-full"
          style={{ width: "68%", background: "linear-gradient(90deg, #8D45FE, #FD4FDA)" }}/>
      </div>
      <div className="flex justify-end mb-3">
        <span className="text-[#9191A8] text-xs">68% used</span>
      </div>
      <div className="flex justify-between text-xs text-[#9191A8]">
        <span>Photos • <span className="text-white font-semibold">181 GB</span></span>
        <span>Reels • <span className="text-white font-semibold">181 GB</span></span>
      </div>
    </div>
  );
}