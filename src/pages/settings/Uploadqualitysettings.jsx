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
      minWidth: fullWidth ? 0 : 150,
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

function SettingRow({ label, sub, type, value, isMobile, children }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: isMobile && type === "dropdown" ? "column" : "row",
      alignItems: isMobile && type === "dropdown" ? "flex-start" : "center",
      justifyContent: "space-between",
      gap: isMobile && type === "dropdown" ? 8 : 16,
      padding: "14px 0",
    }}>
      <div style={{ minWidth: 0 }}>
        <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0 }}>{label}</p>
        {sub && <p style={{ color: "#9191A8", fontSize: 11, marginTop: 3 }}>{sub}</p>}
      </div>
      <div style={{ width: isMobile && type === "dropdown" ? "100%" : "auto", flexShrink: 0 }}>
        {children}
      </div>
    </div>
  );
}

export default function UploadQualitySettings() {
  const [proxy, setProxy] = useState(true);
  const [keepOriginal, setKeepOriginal] = useState(true);
  const w = useWindowWidth();
  const isMobile = w < 640;

  const uploadRows = [
    { label: "Video upload quality",    sub: "Higher quality uses more storage and credits.", type: "dropdown", value: "Original"   },
    { label: "Photo upload quality",    sub: null,                                            type: "dropdown", value: "High (90%)" },
    { label: "Audio bitrate",           sub: null,                                            type: "dropdown", value: "320 kbps"   },
    { label: "Generate preview proxy",  sub: "Creates a lightweight proxy for fast scrubbing.", type: "toggle", key: "proxy"       },
    { label: "Keep original files",     sub: "Retain master copies after rendering.",           type: "toggle", key: "keep"        },
  ];

  const limitRows = [
    { label: "Max upload size",    sub: null,                                  value: "5 GB / file" },
    { label: "Concurrent uploads", sub: null,                                  value: "4"           },
    { label: "Bandwidth limit",    sub: "Cap upload speed during work hours.", value: "Unlimited"   },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, boxSizing: "border-box" }}>

      {/* Upload quality card */}
      <div style={{ background: "#060B28",borderRadius: 16, padding: isMobile ? 16 : 24, border: "1px solid #222" }}>
        <p style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>Upload quality</p>
        <p style={{ color: "#9191A8", fontSize: 12, margin: "0 0 16px" }}>Defaults for new media you bring into BlinkShort.</p>
        <div>
          {uploadRows.map(({ label, sub, type, value, key }, i, arr) => (
            <div key={label} style={{ borderBottom: i < arr.length - 1 ? "1px solid #222" : "none" }}>
              <SettingRow label={label} sub={sub} type={type} isMobile={isMobile}>
                {type === "dropdown" && <Dropdown value={value} fullWidth={isMobile} />}
                {type === "toggle" && (
                  <Toggle
                    enabled={key === "proxy" ? proxy : keepOriginal}
                    onChange={() => key === "proxy" ? setProxy(p => !p) : setKeepOriginal(p => !p)}
                  />
                )}
              </SettingRow>
            </div>
          ))}
        </div>
      </div>

      {/* Limits card */}
      <div style={{background: "#060B28", borderRadius: 16, padding: isMobile ? 16 : 24, border: "1px solid #222" }}>
        <p style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>Limits</p>
        <div>
          {limitRows.map(({ label, sub, value }, i, arr) => (
            <div key={label} style={{ borderBottom: i < arr.length - 1 ? "1px solid #222" : "none" }}>
              <SettingRow label={label} sub={sub} type="dropdown" isMobile={isMobile}>
                <Dropdown value={value} fullWidth={isMobile} />
              </SettingRow>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
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