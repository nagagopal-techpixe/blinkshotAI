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

function Card({ title, children, isMobile }) {
  return (
    <div style={{background: "#060B28", borderRadius: 16, padding: isMobile ? 14 : 20, border: "1px solid #222", boxSizing: "border-box" }}>
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
      padding: "13px 0",
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

export default function ExportDefaultsSettings() {
  const [hdr, setHdr]           = useState(true);
  const [loudness, setLoudness] = useState(true);
  const [hwAccel, setHwAccel]   = useState(true);
  const [autoThumb, setAutoThumb] = useState(true);
  const w = useWindowWidth();
  const isMobile = w < 640;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, boxSizing: "border-box", width: "100%", overflowX: "hidden" }}>

      {/* Video export */}
      <Card title="Video export" isMobile={isMobile}>
        <Row label="Resolution"       isMobile={isMobile} isDropdown><Dropdown value="BlinkShort Cloud"  fullWidth={isMobile} /></Row>
        <Row label="Frame rate"       isMobile={isMobile} isDropdown><Dropdown value="Projects + Assets" fullWidth={isMobile} /></Row>
        <Row label="Bitrate preset"   isMobile={isMobile} isDropdown><Dropdown value="Every change"      fullWidth={isMobile} /></Row>
        <Row label="Codec"            isMobile={isMobile} isDropdown><Dropdown value="Projects + Assets" fullWidth={isMobile} /></Row>
        <Row label="HDR / Wide gamut" isMobile={isMobile} isDropdown={false} last>
          <Toggle enabled={hdr} onChange={() => setHdr(p => !p)} />
        </Row>
      </Card>

      {/* Audio & captions */}
      <Card title="Audio & captions" isMobile={isMobile}>
        <Row label="Audio format" isMobile={isMobile} isDropdown>
          <Dropdown value="BlinkShort Cloud" fullWidth={isMobile} />
        </Row>
        <Row label="Loudness normalization" sub="Match platform LUFS targets." isMobile={isMobile} isDropdown={false}>
          <Toggle enabled={loudness} onChange={() => setLoudness(p => !p)} />
        </Row>
        <Row label="Burn-in captions" isMobile={isMobile} isDropdown last>
          <Dropdown value="Every change" fullWidth={isMobile} />
        </Row>
      </Card>

      {/* Delivery */}
      <Card title="Delivery" isMobile={isMobile}>
        <Row label="File naming pattern" isMobile={isMobile} isDropdown>
          <Dropdown value="90 days" fullWidth={isMobile} />
        </Row>
        <Row label="Save to" isMobile={isMobile} isDropdown={false}>
          <button style={{
            padding: "7px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700, color: "#fff",
            background: "transparent", border: "1px solid #222", cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap",
          }}>
            Browse Version
          </button>
        </Row>
        <Row label="Hardware acceleration" isMobile={isMobile} isDropdown={false}>
          <Toggle enabled={hwAccel} onChange={() => setHwAccel(p => !p)} />
        </Row>
        <Row label="Auto-generate thumbnail" isMobile={isMobile} isDropdown={false} last>
          <Toggle enabled={autoThumb} onChange={() => setAutoThumb(p => !p)} />
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