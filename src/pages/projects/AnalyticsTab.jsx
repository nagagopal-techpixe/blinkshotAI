const analyticsStats = [
  { icon: <svg width="14" height="14" fill="none" stroke="#00E6FE" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>, label: "Views",      value: "12.4K",    sub: "+18% wow" },
  { icon: <svg width="14" height="14" fill="none" stroke="#00E6FE" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>, label: "Engagement", value: "8.2%",     sub: "+1.4 pts" },
  { icon: <svg width="14" height="14" fill="none" stroke="#00E6FE" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>, label: "Shares",     value: "932",      sub: "+212" },
  { icon: <svg width="14" height="14" fill="none" stroke="#00E6FE" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, label: "Avg watch",  value: "22s / 30s", sub: "73% completion" },
];

const barHeights = [65, 75, 55, 80, 95, 70, 68, 66, 65, 45, 60, 70, 65, 85, 72, 68];

export default function AnalyticsTab() {
  return (
    <div className="flex flex-col gap-4">
      {/* 2 cols mobile, 4 cols lg */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {analyticsStats.map(({ icon, label, value, sub }) => (
          <div key={label} className="rounded-2xl p-3 lg:p-4" style={{ background: "#060B28", border: "1px solid #222" }}>
            <div className="flex items-center gap-1.5 mb-2">
              {icon}
              <span className="text-xs truncate" style={{ color: "#9191A8" }}>{label}</span>
            </div>
            <p className="text-white text-xl lg:text-2xl font-extrabold mb-0.5">{value}</p>
            <p className="text-xs" style={{ color: "#9191A8" }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Watch-through curve */}
      <div className="rounded-2xl p-4 lg:p-5" style={{ background: "#060B28", border: "1px solid #222" }}>
        <h2 className="text-white text-base font-bold mb-5">Watch-through curve</h2>
        <div className="flex items-end gap-1 lg:gap-1.5 h-40 lg:h-48 mb-3">
          {barHeights.map((h, i) => (
            <div key={i} className="flex-1 rounded-t-md"
              style={{
                height: `${h}%`,
                background: "linear-gradient(180deg, #8D45FE 0%, #00E6FE 100%)",
                opacity: 0.9,
              }}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs" style={{ color: "#9191A8" }}>
          <span>0s</span>
          <span>15s</span>
          <span>30s</span>
        </div>
        <button className="mt-4 text-sm font-semibold hover:opacity-80 transition-opacity"
          style={{ color: "#00E6FE", background: "none", border: "none", cursor: "pointer" }}>
          Open full analytics →
        </button>
      </div>
    </div>
  );
}