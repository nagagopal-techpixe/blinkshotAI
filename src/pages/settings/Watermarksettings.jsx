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
      background: "#131830", border: "1px solid #222",
      width: fullWidth ? "100%" : "auto",
      minWidth: fullWidth ? 0 : 160,
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

function Card({ title, children }) {
  return (
    <div style={{background: "#060B28", borderRadius: 16, padding: 20, border: "1px solid #222", boxSizing: "border-box" ,position: "relative", zIndex: 1}}>
      <p style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>{title}</p>
      {children}
    </div>
  );
}

function Row({ label, sub, last, isDropdown, isMobile, children }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: isMobile && isDropdown ? "column" : "row",
      alignItems: isMobile && isDropdown ? "flex-start" : "center",
      justifyContent: "space-between",
      gap: isMobile && isDropdown ? 8 : 16,
      padding: "14px 0",
      borderBottom: last ? "none" : "1px solid #222",
      
    }}>
      <div style={{ minWidth: 0 }}>
        <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0 }}>{label}</p>
        {sub && <p style={{ color: "#9191A8", fontSize: 11, marginTop: 3 }}>{sub}</p>}
      </div>
      <div style={{ flexShrink: 0, width: isMobile && isDropdown ? "100%" : "auto" }}>
        {children}
      </div>
    </div>
  );
}

export default function WatermarkSettings() {
  const [applyWatermark, setApplyWatermark] = useState(true);
  const [skipPaid, setSkipPaid]             = useState(true);
  const [animate, setAnimate]               = useState(true);
  const w = useWindowWidth();
  const isMobile = w < 640;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, boxSizing: "border-box", width: "100%", overflowX: "hidden" }}>

      {/* Watermark card */}
      <Card title="Watermark">
        <Row label="Apply watermark on export" isMobile={isMobile} isDropdown={false}>
          <Toggle enabled={applyWatermark} onChange={() => setApplyWatermark(p => !p)} />
        </Row>
        <Row label="Watermark type" isMobile={isMobile} isDropdown>
          <Dropdown value="Text" fullWidth={isMobile} />
        </Row>
        <Row label="Logo file" sub="PNG with transparency recommended." last isMobile={isMobile} isDropdown>
          <Dropdown value="Projects + Assets" fullWidth={isMobile} />
        </Row>
      </Card>

      {/* Rules card */}
      <Card title="Rules">
        <Row label="Apply to exports" isMobile={isMobile} isDropdown>
          <Dropdown value="All platforms" fullWidth={isMobile} />
        </Row>
        <Row label="Skip for paid client projects" isMobile={isMobile} isDropdown={false}>
          <Toggle enabled={skipPaid} onChange={() => setSkipPaid(p => !p)} />
        </Row>
        <Row label="Animate watermark in/out" last isMobile={isMobile} isDropdown={false}>
          <Toggle enabled={animate} onChange={() => setAnimate(p => !p)} />
        </Row>
      </Card>

      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
        <button style={{
          padding: "9px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
          background: "#222", color: "#9191A8", border: "1px solid #222", cursor: "pointer",
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