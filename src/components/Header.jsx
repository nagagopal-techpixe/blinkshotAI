export default function Header({ onMenuToggle }) {
  return (
    <header
      className="fixed top-0 left-0 right-0 lg:left-[270px] z-20 flex items-center gap-3 px-4 lg:px-6 py-3.5"
      style={{
        background: "#060B28",
        borderBottom: "1px solid #222222",
        height: 65,
      }}
    >
      {/* Hamburger — mobile only */}
      <button
        className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-white/5 transition-all"
        style={{ border: "1px solid #222222" }}
        onClick={onMenuToggle}
        aria-label="Toggle menu"
      >
        <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 6h18M3 12h18M3 18h18"/>
        </svg>
      </button>

      {/* Search bar */}
      <div className="flex-1 relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9191A8]"
          width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search projects, templates, assets..."
          className="w-full pl-11 pr-4 py-2.5 rounded-full text-sm text-white placeholder-[#9191A8] outline-none transition-all"
          style={{ background: "#060B28", border: "1px solid #222222" }}
        />
      </div>

      {/* AI Credits — hidden on very small screens */}
      <div
        className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer hover:opacity-90 transition-all flex-shrink-0"
        style={{ background: "#060B28", border: "1px solid #222222" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#8D45FE" stroke="#8D45FE" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
        <div>
          <p className="text-[10px] text-[#9191A8] leading-none">AI Credits</p>
          <p className="text-white font-bold text-sm leading-tight">12,450</p>
        </div>
      </div>

      {/* Notification bell */}
      <button
        className="relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-white/5 transition-all"
        style={{ background: "#060B28", border: "1px solid #222222" }}
      >
        <svg width="18" height="18" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        <span
          className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
          style={{ background: "#FD4FDA" }}
        />
      </button>

      {/* Avatar */}
      <button
        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 hover:opacity-90 transition-all"
        style={{ background: "linear-gradient(135deg, #8D45FE, #FD4FDA)" }}
      >
        AK
      </button>
    </header>
  );
}