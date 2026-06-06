const teamMembers = [
  { initials: "AK", color: "#8D45FE" },
  { initials: "MT", color: "#059669" },
  { initials: "ND", color: "#2563EB" },
  { initials: "BB", color: "#D97706" },
  { initials: "RJ", color: "#DC2626" },
];

export default function TeamCard() {
  return (
    <div className="rounded-2xl p-4 lg:p-5" style={{ background: "#060B28", border: "1px solid #222222" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #2563EB, #8D45FE)" }}>
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-sm lg:text-base">Team</p>
            <p className="text-[#9191A8] text-xs">5 active</p>
          </div>
        </div>
        <button style={{ color: "#8D45FE" }} className="text-sm font-semibold hover:opacity-80 transition-opacity">
          Invite
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {teamMembers.map(({ initials, color }) => (
          <div key={initials}
            className="w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs"
            style={{ background: color }}>
            {initials}
          </div>
        ))}
      </div>
    </div>
  );
}