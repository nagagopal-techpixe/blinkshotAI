import { useState, useEffect } from "react";

const clips = [
  { name: "clip_01.mp4", meta: "2.4 MB · 3s" },
  { name: "clip_02.mp4", meta: "2.4 MB · 3s" },
  { name: "clip_03.mp4", meta: "2.4 MB · 3s" },
];

const timelineClips = [
  { img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&q=80" },
  { img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=100&q=80" },
  { img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=100&q=80" },
];

const adjustments = [
  { label: "Opacity",        value: 75,  display: "+0.25"   },
  { label: "Speed",          value: 100, display: "1.0×"    },
  { label: "Volume",         value: 40,  display: "-3 dB"   },
  { label: "Transition in",  value: 60,  display: "Fade 0.4s" },
  { label: "Transition out", value: 80,  display: "Cut"     },
];

const effects = ["Color match", "Stabilize", "Auto reframe"];

const leftTabs = [
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><polygon points="11,9 19,12 11,15" fill="currentColor" stroke="none"/></svg>,
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10"/></svg>,
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
];

const toolIcons = [
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M6 3h12M6 8h12M6 13h8M6 18h5"/></svg>,
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>,
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
];

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

/*Timeline*/
function Timeline() {
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", background: "#0A0A1A", border: "1px solid #1e1e2e" }}>
      <div style={{ display: "flex", padding: "5px 12px", borderBottom: "1px solid #1e1e2e" }}>
        {["30:00", "40:00", "50:00"].map((t, i) => (
          <span key={i} style={{ flex: 1, textAlign: "center", color: "#9191A8", fontSize: 10 }}>{t}</span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 3, padding: "8px 12px" }}>
        {timelineClips.map((c, i) => (
          <div key={i} style={{ width: 60, height: 38, borderRadius: 7, overflow: "hidden", flexShrink: 0, border: "1px solid #8D45FE" }}>
            <img src={c.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
          </div>
        ))}
      </div>
      <div style={{ padding: "0 12px 4px" }}>
        <div style={{ borderRadius: 8, padding: "6px 12px", display: "flex", alignItems: "center", gap: 8, background: "#00E6FE22", border: "1px solid #00E6FE55" }}>
          <span style={{ color: "#00E6FE", fontSize: 12, fontWeight: 700 }}>T</span>
          <span style={{ color: "#fff", fontSize: 12 }}>I'm travelling alone</span>
        </div>
      </div>
      <div style={{ padding: "0 12px 4px" }}>
        <div style={{ borderRadius: 8, padding: "6px 12px", display: "flex", alignItems: "center", gap: 8, background: "#FD4FDA22", border: "1px solid #FD4FDA55", width: "75%" }}>
          <span style={{ color: "#FD4FDA", fontSize: 12, fontWeight: 700 }}>T</span>
          <span style={{ color: "#fff", fontSize: 12 }}>Hello, this is the mountain</span>
        </div>
      </div>
      <div style={{ padding: "0 12px 10px" }}>
        <div style={{ borderRadius: 8, padding: "6px 12px", display: "flex", alignItems: "center", gap: 8, background: "#8D45FE22", border: "1px solid #8D45FE55" }}>
          <svg width="10" height="10" fill="none" stroke="#8D45FE" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          <span style={{ color: "#9191A8", fontSize: 11, whiteSpace: "nowrap" }}>Happy-morning-instrument.mp3</span>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 1, overflow: "hidden" }}>
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} style={{ flex: 1, minWidth: 1.5, borderRadius: 2, height: Math.floor(Math.random() * 14 + 4), background: "#8D45FE66" }}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReelEditor() {
  const [playing, setPlaying]           = useState(false);
  const [activeLeftTab, setActiveLeftTab] = useState(0);
  const [activeBottomTab, setActiveBottomTab] = useState("clips"); // mobile bottom tabs
  const w = useWindowWidth();
  const isMobile  = w < 640;
  const isTablet  = w >= 640 && w < 1024;
  const isDesktop = w >= 1024;

  /*Mobile bottom tabs*/
  const mobileTabs = ["clips", "adjust", "effects", "timeline"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: isMobile ? "auto" : "calc(100vh - 65px)", overflow: isMobile ? "visible" : "hidden", fontFamily: "sans-serif" }}>

      {/*Top title bar*/}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "10px 14px" : "14px 24px",
        borderBottom: "1px solid #1e1e2e", flexShrink: 0, gap: 10, flexWrap: "wrap",
      }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ color: "#fff", fontSize: isMobile ? 15 : 20, fontWeight: 800, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Aurora — Bali Teaser
          </h1>
          <p style={{ color: "#9191A8", fontSize: 11, margin: "2px 0 0" }}>9:16 · 30 fps · 18s</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: isMobile ? "7px 12px" : "9px 18px",
            borderRadius: 10, fontSize: 12, fontWeight: 600,
            background: "#0D1240", color: "#fff", border: "1px solid #222", cursor: "pointer",
          }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            {!isMobile && "Save Draft"}
          </button>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: isMobile ? "7px 12px" : "9px 18px",
            borderRadius: 10, fontSize: 12, fontWeight: 700,
            background: "linear-gradient(90deg,#8D45FE,#FD4FDA)", color: "#fff", border: "none", cursor: "pointer",
          }}>
            <svg width="13" height="13" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Render
          </button>
        </div>
      </div>

      {/*Body*/}
      {isDesktop ? (
        /*DESKTOP: 3-column*/
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* Left panel */}
          <div style={{ width: 200, flexShrink: 0, display: "flex", flexDirection: "column", background: "#0A0A1A", borderRight: "1px solid #1e1e2e" }}>
            <div style={{ display: "flex", gap: 6, padding: "12px 12px 10px", borderBottom: "1px solid #1e1e2e" }}>
              {leftTabs.map((icon, i) => (
                <button key={i} onClick={() => setActiveLeftTab(i)} style={{
                  width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: activeLeftTab === i ? "linear-gradient(135deg,#8D45FE,#FD4FDA)" : "#1a1a2e",
                  color: activeLeftTab === i ? "#fff" : "#9191A8", border: "none", cursor: "pointer",
                }}>{icon}</button>
              ))}
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
              {clips.map((clip, i) => (
                <div key={i} style={{ borderRadius: 12, overflow: "hidden", cursor: "pointer", border: "1px solid #222" }}>
                  <div style={{ height: 90, position: "relative", background: "linear-gradient(135deg,#0D1240,#1a1a3e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ position: "absolute", top: 7, left: 7, fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 5, background: "rgba(141,69,254,0.3)", color: "#8D45FE" }}>Video</span>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="12" height="12" fill="white" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                  </div>
                  <div style={{ padding: "7px 9px" }}>
                    <p style={{ color: "#fff", fontSize: 11, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{clip.name}</p>
                    <p style={{ color: "#9191A8", fontSize: 10, margin: "2px 0 0" }}>{clip.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflow: "hidden" }}>
              <PreviewCard playing={playing} setPlaying={setPlaying} size="md" />
            </div>
            <div style={{ flexShrink: 0, padding: "0 14px 10px" }}>
              <TransportBar playing={playing} setPlaying={setPlaying} />
              <div style={{ marginTop: 8 }}><Timeline /></div>
            </div>
          </div>

          {/* Right panel */}
          <RightPanel />
        </div>

      ) : isTablet ? (
        /*TABLET: preview + right panel stacked, timeline below*/
        <div style={{ display: "flex", flex: 1, overflow: "hidden", flexDirection: "column" }}>
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            {/* Center preview */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 12, overflow: "hidden" }}>
                <PreviewCard playing={playing} setPlaying={setPlaying} size="sm" />
              </div>
              <div style={{ flexShrink: 0, padding: "0 12px 8px" }}>
                <TransportBar playing={playing} setPlaying={setPlaying} compact />
              </div>
            </div>
            {/* Right panel */}
            <div style={{ width: 210, flexShrink: 0, overflowY: "auto", borderLeft: "1px solid #1e1e2e" }}>
              <RightPanel />
            </div>
          </div>
          {/* Timeline strip at bottom */}
          <div style={{ flexShrink: 0, padding: "0 12px 10px", borderTop: "1px solid #1e1e2e" }}>
            <Timeline />
          </div>
        </div>

      ) : (
        /*MOBILE: scrollable stacked layout*/
        <div style={{ display: "flex", flexDirection: "column" }}>

          {/* Preview */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 16px 6px" }}>
            <PreviewCard playing={playing} setPlaying={setPlaying} size="xs" />
          </div>

          {/* Transport */}
          <div style={{ padding: "0 12px 6px" }}>
            <TransportBar playing={playing} setPlaying={setPlaying} compact />
          </div>

          {/* Mobile tab bar — sticky so it stays visible while scrolling */}
          <div style={{
            display: "flex", position: "sticky", top: 0, zIndex: 10,
            borderTop: "1px solid #1e1e2e", borderBottom: "1px solid #1e1e2e",
            background: "#060B28",
          }}>
            {mobileTabs.map(tab => (
              <button key={tab} onClick={() => setActiveBottomTab(tab)} style={{
                flex: 1, padding: "9px 4px", fontSize: 10, fontWeight: 600, border: "none", cursor: "pointer", textTransform: "capitalize",
                background: activeBottomTab === tab ? "rgba(141,69,254,0.15)" : "transparent",
                color: activeBottomTab === tab ? "#a78bfa" : "#9191A8",
                borderBottom: activeBottomTab === tab ? "2px solid #8D45FE" : "2px solid transparent",
              }}>{tab}</button>
            ))}
          </div>

          {/* Panel content — natural height, page scrolls */}
          <div style={{ minHeight: 300 }}>
            {activeBottomTab === "clips" && (
              <div style={{ display: "flex", gap: 8, padding: 10, overflowX: "auto" }}>
                {clips.map((clip, i) => (
                  <div key={i} style={{ borderRadius: 10, overflow: "hidden", cursor: "pointer", border: "1px solid #222", flexShrink: 0, width: 120 }}>
                    <div style={{ height: 70, position: "relative", background: "linear-gradient(135deg,#0D1240,#1a1a3e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ position: "absolute", top: 5, left: 6, fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: "rgba(141,69,254,0.3)", color: "#8D45FE" }}>Video</span>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="10" height="10" fill="white" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      </div>
                    </div>
                    <div style={{ padding: "5px 7px" }}>
                      <p style={{ color: "#fff", fontSize: 10, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{clip.name}</p>
                      <p style={{ color: "#9191A8", fontSize: 9, margin: "2px 0 0" }}>{clip.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeBottomTab === "adjust" && (
              <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 16 }}>
                {adjustments.map(a => <AdjRow key={a.label} {...a} />)}
              </div>
            )}
            {activeBottomTab === "effects" && (
              <div style={{ padding: "8px 14px" }}>
                {effects.map(effect => (
                  <button key={effect} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 8px", borderRadius: 10, fontSize: 13, background: "none", border: "none", cursor: "pointer", color: "#fff", borderBottom: "1px solid #1e1e2e" }}>
                    <span>{effect}</span>
                    <svg width="14" height="14" fill="none" stroke="#9191A8" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                ))}
              </div>
            )}
            {activeBottomTab === "timeline" && (
              <div style={{ padding: 10 }}><Timeline /></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PreviewCard({ playing, setPlaying, size }) {
  const dims = { xs: [180, 295], sm: [190, 315], md: [210, 340] }[size] || [210, 340];
  return (
    <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", width: dims[0], height: dims[1], background: "#000", border: "1px solid #333", flexShrink: 0, boxShadow: "0 0 40px rgba(141,69,254,0.2)" }}>
      <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.15)" }}/>
      <span style={{ position: "absolute", top: 10, left: 12, fontSize: 11, fontWeight: 700, color: "#fff" }}>00:30</span>
      <span style={{ position: "absolute", top: 10, right: 12, fontSize: 11, fontWeight: 700, color: "#fff" }}>9:16</span>
      <button onClick={() => setPlaying(v => !v)} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="15" height="15" fill="white" viewBox="0 0 24 24">
            {playing ? <><rect x="6" y="4" width="4" height="16" fill="white"/><rect x="14" y="4" width="4" height="16" fill="white"/></> : <polygon points="5 3 19 12 5 21 5 3"/>}
          </svg>
        </div>
      </button>
    </div>
  );
}

function TransportBar({ playing, setPlaying, compact }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: compact ? 4 : 6 }}>
      <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9191A8", padding: 4 }}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>
      </button>
      <button onClick={() => setPlaying(v => !v)} style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#8D45FE,#FD4FDA)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="11" height="11" fill="white" viewBox="0 0 24 24">
          {playing ? <><rect x="6" y="4" width="4" height="16" fill="white"/><rect x="14" y="4" width="4" height="16" fill="white"/></> : <polygon points="5 3 19 12 5 21 5 3"/>}
        </svg>
      </button>
      <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9191A8", padding: 4 }}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
      </button>
      <span style={{ color: "#fff", fontSize: 11, fontFamily: "monospace" }}>00:00:00</span>
      <span style={{ color: "#9191A8", fontSize: 11 }}>|</span>
      <span style={{ color: "#9191A8", fontSize: 11, fontFamily: "monospace" }}>00:00:00</span>
      {!compact && (
        <div style={{ display: "flex", gap: 2, marginLeft: "auto" }}>
          {toolIcons.map((icon, i) => (
            <button key={i} style={{ width: 26, height: 26, borderRadius: 7, background: "none", border: "none", cursor: "pointer", color: "#9191A8", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function AdjRow({ label, value, display }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
        <span style={{ color: "#9191A8", fontSize: 12 }}>{label}</span>
        <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{display}</span>
      </div>
      <div style={{ position: "relative", height: 4, borderRadius: 4, background: "#1e1e3a" }}>
        <div style={{ height: "100%", borderRadius: 4, width: `${value}%`, background: "linear-gradient(90deg,#8D45FE,#FD4FDA)" }}/>
        <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: `calc(${value}% - 7px)`, width: 14, height: 14, borderRadius: "50%", background: "#8D45FE", border: "2.5px solid #fff" }}/>
      </div>
    </div>
  );
}

function RightPanel() {
  return (
    <div style={{ overflowY: "auto" }}>
      <div style={{ margin: 12, borderRadius: 16, background: "#0D1240", border: "1px solid #1e2350", padding: "16px 14px" }}>
        <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "0 0 16px" }}>Adjustment</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {adjustments.map(a => <AdjRow key={a.label} {...a} />)}
        </div>
      </div>
      <div style={{ padding: "4px 14px 14px" }}>
        <h3 style={{ color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", margin: "0 0 8px" }}>EFFECTS</h3>
        {effects.map(effect => (
          <button key={effect} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 8px", borderRadius: 10, fontSize: 13, background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
            <span>{effect}</span>
            <svg width="14" height="14" fill="none" stroke="#9191A8" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        ))}
      </div>
    </div>
  );
}