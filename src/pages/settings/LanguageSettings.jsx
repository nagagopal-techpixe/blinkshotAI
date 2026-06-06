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

function Dropdown({ value }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 14px", borderRadius: 12, cursor: "pointer",
      background: "#131830", border: "1px solid #2a2a40",
      width: "100%", boxSizing: "border-box",
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

const rows = [
  { label: "Interface language",  sub: null,                                          value: "English"               },
  { label: "AI caption language", sub: "Default language for generated captions.",    value: "Auto - detect"         },
  { label: "Time zone",           sub: null,                                          value: "(GMT-5:00) Eastern Time" },
  { label: "Date format",         sub: null,                                          value: "MM, DD, YYYY"          },
  { label: "First day of week",   sub: null,                                          value: "Monday"                },
  { label: "Measurement",         sub: null,                                          value: "Metric"                },
];

export default function LanguageSettings() {
  const w = useWindowWidth();
  const isMobile = w < 640;

  return (
    <div style={{ borderRadius: 16, background: "#060B28",padding: isMobile ? 16 : 24, border: "1px solid #1a1a2e", boxSizing: "border-box" }}>
      <p style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>Language & region</p>
      <p style={{ color: "#9191A8", fontSize: 12, margin: "0 0 20px" }}>Localize dates, numbers and AI output.</p>

      <div>
        {rows.map(({ label, sub, value }, i) => (
          <div
            key={label}
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              justifyContent: "space-between",
              gap: isMobile ? 8 : 16,
              padding: "14px 0",
              borderBottom: i < rows.length - 1 ? "1px solid #1a1a2e" : "none",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0 }}>{label}</p>
              {sub && <p style={{ color: "#9191A8", fontSize: 11, marginTop: 3 }}>{sub}</p>}
            </div>
            <div style={{ width: isMobile ? "100%" : 200, flexShrink: 0 }}>
              <Dropdown value={value} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
        <button style={{
          padding: "9px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
          background: "#1a1a2e", color: "#9191A8", border: "1px solid #2a2a3e", cursor: "pointer",
          flex: isMobile ? 1 : "none",
        }}>
          Cancel
        </button>
        <button style={{
          padding: "9px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
          background: "linear-gradient(90deg,#8D45FE,#FD4FDA)", color: "#fff", border: "none", cursor: "pointer",
          flex: isMobile ? 1 : "none",
        }}>
          Save Changes
        </button>
      </div>
    </div>
  );
}