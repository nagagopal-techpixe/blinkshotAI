import { useState, useEffect } from "react";

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

function Dropdown({ value, fullWidth }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 14px", borderRadius: 12, cursor: "pointer",
      background: "#131830", border: "1px solid #2a2a40",
      width: fullWidth ? "100%" : "auto",
      minWidth: fullWidth ? 0 : 140,
      boxSizing: "border-box",
    }}>
      <span style={{ color: "#fff", fontSize: 13, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {value}
      </span>
      <svg width="14" height="14" fill="none" stroke="#9191A8" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  );
}

function Toggle({ enabled, onChange }) {
  return (
    <div onClick={onChange} style={{
      width: 44, height: 24, borderRadius: 12, flexShrink: 0, cursor: "pointer", position: "relative",
      background: enabled ? "linear-gradient(90deg,#8D45FE,#FD4FDA)" : "#2a2a3e",
      transition: "background 0.2s",
    }}>
      <div style={{
        position: "absolute", top: 4, left: enabled ? 22 : 4,
        width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s",
      }} />
    </div>
  );
}

const accounts = [
  { name: "Instagram", desc: "Publish reels directly to your account.", connected: true,  color: "linear-gradient(135deg,#f58529,#dd2a7b,#8134af)" },
  { name: "TikTok",    desc: "Auto-export & schedule TikTok posts.",    connected: false, color: "#000" },
  { name: "YouTube",   desc: "Upload Shorts and full-length cuts.",     connected: true,  color: "#FF0000" },
  { name: "Instagram", desc: "Publish reels directly to your account.", connected: true,  color: "linear-gradient(135deg,#f58529,#dd2a7b,#8134af)" },
  { name: "TikTok",    desc: "Auto-export & schedule TikTok posts.",    connected: false, color: "#000" },
];

const SocialIcon = ({ name, color }) => (
  <div style={{
    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: color,
    
  }}>
    {name === "Instagram" && (
      <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2"/>
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="white"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="white" strokeWidth="2"/>
      </svg>
    )}
    {name === "TikTok" && (
      <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.72a4.85 4.85 0 01-1-.03z" fill="white"/>
      </svg>
    )}
    {name === "YouTube" && (
      <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#FF0000"/>
      </svg>
    )}
  </div>
);

export default function SocialIntegrationsSettings() {
  const [autoPost, setAutoPost] = useState(true);
  const [bestTime, setBestTime] = useState(true);
  const w = useWindowWidth();
  const isMobile = w < 640;

  const prefRows = [
    { label: "Default publish account",         sub: null,                                           type: "dropdown", value: "instagram", tkey: null   },
    { label: "Auto-post when render completes",  sub: "Skips approval and publishes immediately.",    type: "toggle",   value: null,        tkey: "auto" },
    { label: "Cross-post to",                   sub: null,                                           type: "dropdown", value: "1g",        tkey: null   },
    { label: "Default visibility",              sub: null,                                           type: "text",     value: "4 mins ago  1.2 gb", tkey: null },
    { label: "Best time to post",               sub: "Use AI-picked optimal windows per platform.",  type: "toggle",   value: null,        tkey: "best" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, boxSizing: "border-box", width: "100%", overflowX: "hidden" }}>

      {/* Connected accounts */}
      <div style={{ background: "#060B28",borderRadius: 16, padding: isMobile ? 14 : 24, border: "1px solid #222", boxSizing: "border-box", overflow: "hidden" }}>
        <p style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>Connected accounts</p>
        <p style={{ color: "#9191A8", fontSize: 12, margin: "0 0 16px" }}>Publish, schedule, and pull analytics directly.</p>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 10,
        }}>
          {accounts.map(({ name, desc, connected, color }, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: 12,
              borderRadius: 12,
              background: "#131830",
              border: "1px solid #222",
              boxSizing: "border-box",
              overflow: "hidden",
              width: "100%",
            }}>
              <SocialIcon name={name} color={color} />
              {/* text block — flex:1 + minWidth:0 ensures it shrinks and doesn't push button out */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</p>
                <p style={{ color: "#9191A8", fontSize: 11, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{desc}</p>
              </div>
              {/* button — never shrinks, never overflows */}
              <button style={{
                fontSize: 11, fontWeight: 700,
                padding: "5px 10px",
                borderRadius: 8,
                flexShrink: 0,
                cursor: "pointer",
                whiteSpace: "nowrap",
                background: connected ? "transparent" : "linear-gradient(90deg,#8D45FE,#FD4FDA)",
                color: connected ? "#9191A8" : "#fff",
                border: connected ? "1px solid #2a2a3e" : "none",
              }}>
                {connected ? "Manage" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Publishing preferences */}
      <div style={{ background: "#060B28",borderRadius: 16, padding: isMobile ? 14 : 24, border: "1px solid #222", boxSizing: "border-box" }}>
        <p style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>Publishing preferences</p>
        <div>
          {prefRows.map(({ label, sub, type, value, tkey }, i, arr) => (
            <div key={label} style={{
              display: "flex",
              flexDirection: isMobile && type === "dropdown" ? "column" : "row",
              alignItems: isMobile && type === "dropdown" ? "flex-start" : "center",
              justifyContent: "space-between",
              gap: isMobile && type === "dropdown" ? 8 : 16,
              padding: "14px 0",
              borderBottom: i < arr.length - 1 ? "1px solid #222" : "none",
            }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0 }}>{label}</p>
                {sub && <p style={{ color: "#9191A8", fontSize: 11, marginTop: 3 }}>{sub}</p>}
              </div>
              <div style={{ flexShrink: 0, width: isMobile && type === "dropdown" ? "100%" : "auto" }}>
                {type === "dropdown" && <Dropdown value={value} fullWidth={isMobile} />}
                {type === "text"     && <span style={{ color: "#9191A8", fontSize: 12 }}>{value}</span>}
                {type === "toggle"   && (
                  <Toggle
                    enabled={tkey === "auto" ? autoPost : bestTime}
                    onChange={() => tkey === "auto" ? setAutoPost(p => !p) : setBestTime(p => !p)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
        <button style={{
          padding: "9px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
          background: "#222", color: "#9191A8", border: "1px solid #2a2a3e", cursor: "pointer",
          flex: isMobile ? 1 : "none",
        }}>Cancel</button>
        <button style={{
          padding: "9px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
          background: "linear-gradient(90deg,#8D45FE,#FD4FDA)", color: "#fff", border: "none", cursor: "pointer",
          flex: isMobile ? 1 : "none",
        }}>Save Changes</button>
      </div>
    </div>
  );
}