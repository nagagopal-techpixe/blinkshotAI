import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const toolIcons = [
  <svg key="t" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M6 3h12M6 8h12M6 13h8M6 18h5"/></svg>,
  <svg key="m" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  <svg key="d" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>,
  <svg key="zi" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  <svg key="zo" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
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

function AdjRow({ label, value, display, onChange, note }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
        <span style={{ color: "#9191A8", fontSize: 12 }}>{label}</span>
        <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{display}</span>
      </div>
      <div style={{ position: "relative", height: 4, borderRadius: 4, background: "#1e1e3a" }}>
        <div style={{ height: "100%", borderRadius: 4, width: `${value}%`, background: "linear-gradient(90deg,#8D45FE,#FD4FDA)" }}/>
        <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: `calc(${value}% - 7px)`, width: 14, height: 14, borderRadius: "50%", background: "#8D45FE", border: "2.5px solid #fff" }}/>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", margin: 0 }}
        />
      </div>
      {note && (
        <span style={{ color: "#9191A8", fontSize: 10, marginTop: 4, display: "block" }}>{note}</span>
      )}
    </div>
  );
}

function Timeline({ slides, currentSlide, onSlideClick }) {
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", background: "#0A0A1A", border: "1px solid #1e1e2e" }}>
      <div style={{ display: "flex", padding: "5px 12px", borderBottom: "1px solid #1e1e2e" }}>
        {slides.map((_, i) => (
          <span key={i} style={{ flex: 1, textAlign: "center", color: "#9191A8", fontSize: 10 }}>
            {i * 6}s — {(i + 1) * 6}s
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 3, padding: "8px 12px" }}>
        {slides.map((slide, i) => (
          <div
            key={i}
            onClick={() => onSlideClick(i)}
            style={{
              width: 60,
              height: 38,
              borderRadius: 7,
              overflow: "hidden",
              flexShrink: 0,
              border: `1px solid ${currentSlide === i ? "#FD4FDA" : "#8D45FE"}`,
              cursor: "pointer",
              position: "relative",
              background: "#0D1240",
            }}
          >
            {slide.imageUrl ? (
              <img src={slide.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#8D45FE", fontSize: 9, fontWeight: 700 }}>T</span>
              </div>
            )}
            {currentSlide === i && (
              <div style={{ position: "absolute", inset: 0, border: "2px solid #FD4FDA", borderRadius: 7 }}/>
            )}
          </div>
        ))}
      </div>
      <div style={{ padding: "0 12px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
        {slides.map((slide, i) => slide.caption || slide.text ? (
          <div key={i} style={{ borderRadius: 8, padding: "5px 10px", display: "flex", alignItems: "center", gap: 8, background: i % 2 === 0 ? "#00E6FE22" : "#FD4FDA22", border: `1px solid ${i % 2 === 0 ? "#00E6FE55" : "#FD4FDA55"}` }}>
            <span style={{ color: i % 2 === 0 ? "#00E6FE" : "#FD4FDA", fontSize: 11, fontWeight: 700 }}>T</span>
            <span style={{ color: "#fff", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {slide.caption || slide.text}
            </span>
          </div>
        ) : null)}
      </div>
    </div>
  );
}

function PreviewCard({
  videoUrl, playing, setPlaying, currentTime, totalDuration,
  size, onTimeUpdate, videoRef,
  opacity, transitionIn, transitionOut, isFading,
}) {
  const dims = { xs: [180, 295], sm: [190, 315], md: [210, 340] }[size] || [210, 340];

  const fadeInSecs  = (transitionIn / 100) * 0.8;
  const fadeOutSecs = transitionOut > 50 ? 0 : (transitionOut / 100) * 0.8;
  const maxFadeSecs = Math.max(fadeInSecs, fadeOutSecs, 0.01);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", width: dims[0], height: dims[1], background: "#000", border: "1px solid #333", flexShrink: 0, boxShadow: "0 0 40px rgba(141,69,254,0.2)" }}>
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            // Live preview: opacity from slider + fade-in/out simulation
            opacity: (opacity / 100) * (isFading ? 0.05 : 1),
            transition: `opacity ${maxFadeSecs}s ease`,
          }}
          onTimeUpdate={onTimeUpdate}
          onEnded={() => setPlaying(false)}
        />
      ) : (
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#0D1240,#1a1a3e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#9191A8", fontSize: 12 }}>No video</span>
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.1)", pointerEvents: "none" }}/>
      <span style={{ position: "absolute", top: 10, left: 12, fontSize: 11, fontWeight: 700, color: "#fff" }}>
        {formatTime(currentTime)}
      </span>
      <span style={{ position: "absolute", top: 10, right: 12, fontSize: 11, fontWeight: 700, color: "#fff" }}>9:16</span>
      <button
        onClick={() => setPlaying(v => !v)}
        style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}
      >
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="15" height="15" fill="white" viewBox="0 0 24 24">
            {playing
              ? <><rect x="6" y="4" width="4" height="16" fill="white"/><rect x="14" y="4" width="4" height="16" fill="white"/></>
              : <polygon points="5 3 19 12 5 21 5 3"/>
            }
          </svg>
        </div>
      </button>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.1)" }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg,#8D45FE,#FD4FDA)", width: totalDuration > 0 ? `${(currentTime / totalDuration) * 100}%` : "0%" }}/>
      </div>
    </div>
  );
}

function TransportBar({ playing, setPlaying, currentTime, totalDuration, onSeekBack, onSeekForward, compact }) {
  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `00:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: compact ? 4 : 6 }}>
      <button onClick={onSeekBack} style={{ background: "none", border: "none", cursor: "pointer", color: "#9191A8", padding: 4 }}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>
      </button>
      <button onClick={() => setPlaying(v => !v)} style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#8D45FE,#FD4FDA)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="11" height="11" fill="white" viewBox="0 0 24 24">
          {playing
            ? <><rect x="6" y="4" width="4" height="16" fill="white"/><rect x="14" y="4" width="4" height="16" fill="white"/></>
            : <polygon points="5 3 19 12 5 21 5 3"/>
          }
        </svg>
      </button>
      <button onClick={onSeekForward} style={{ background: "none", border: "none", cursor: "pointer", color: "#9191A8", padding: 4 }}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
      </button>
      <span style={{ color: "#fff", fontSize: 11, fontFamily: "monospace" }}>{fmt(currentTime)}</span>
      <span style={{ color: "#9191A8", fontSize: 11 }}>|</span>
      <span style={{ color: "#9191A8", fontSize: 11, fontFamily: "monospace" }}>{fmt(totalDuration)}</span>
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

export default function ReelEditor() {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const {
    renderedVideo,
    payload,
    slides: initialSlides = [],
    title: initialTitle = "My Reel",
    accentColor: initialAccent = "#8D45FE",
    brandName: initialBrand = "BlinkshotAI",
    tagline: initialTagline = "Created with AI",
    musicUrl: initialMusic = null,
  } = location.state || {};

  const [slides,          setSlides]          = useState(initialSlides);
  const [title,           setTitle]           = useState(initialTitle);
  const [currentSlide,    setCurrentSlide]    = useState(0);
  const [playing,         setPlaying]         = useState(false);
  const [currentTime,     setCurrentTime]     = useState(0);
  const [totalDuration,   setTotalDuration]   = useState(renderedVideo?.durationSeconds || 0);
  const [activeLeftTab,   setActiveLeftTab]   = useState(0);
  const [activeBottomTab, setActiveBottomTab] = useState("clips");
  const [isFading,        setIsFading]        = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [opacity,       setOpacity]       = useState(100);
  const [speed,         setSpeed]         = useState(50);   // 50 → 1.125× (near normal)
  const [volume,        setVolume]        = useState(100);
  const [transitionIn,  setTransitionIn]  = useState(0);
  const [transitionOut, setTransitionOut] = useState(0);

  const [effects,         setEffects]         = useState({ colorMatch: false, stabilize: false, autoReframe: false });
  const [rendering,       setRendering]       = useState(false);
  const [renderError,     setRenderError]     = useState(null);
  const [rerenderedVideo, setRerenderedVideo] = useState(null);

  const w          = useWindowWidth();
  const isMobile   = w < 640;
  const isTablet   = w >= 640 && w < 1024;
  const isDesktop  = w >= 1024;
  const mobileTabs = ["clips", "adjust", "effects", "timeline"];
  const videoUrl   = rerenderedVideo?.videoUrl || renderedVideo?.videoUrl || null;

  // ── Mark unsaved changes whenever any adjustment changes ─────────────────
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [opacity, speed, volume, transitionIn, transitionOut]);

  // ── Playback control ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!videoRef.current) return;
    playing ? videoRef.current.play() : videoRef.current.pause();
  }, [playing]);

  // ── Speed + Volume → live preview ─────────────────────────────────────────
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.volume = volume / 100;
    const rate = 0.25 + (speed / 100) * 1.75;
    videoRef.current.playbackRate = Math.max(0.0625, Math.min(16, rate));
  }, [volume, speed]);

  // ── Transition fade simulation → live preview ─────────────────────────────
  // Watches currentTime and sets isFading=true near start/end of video
  // so the CSS transition in PreviewCard visually simulates fade in/out.
  useEffect(() => {
    if (!videoRef.current || totalDuration === 0) return;

    const fadeInSecs  = (transitionIn  / 100) * 0.8;
    const fadeOutSecs = transitionOut > 50 ? 0 : (transitionOut / 100) * 0.8;

    const nearStart = currentTime < fadeInSecs && fadeInSecs > 0;
    const nearEnd   = currentTime > (totalDuration - fadeOutSecs) && fadeOutSecs > 0;

    setIsFading(nearStart || nearEnd);
  }, [currentTime, transitionIn, transitionOut, totalDuration]);

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const seekBack = () => {
    if (videoRef.current) videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
  };

  const seekForward = () => {
    if (videoRef.current) videoRef.current.currentTime = Math.min(totalDuration, videoRef.current.currentTime + 5);
  };

  // ── Re-render: send all editor adjustments to backend ────────────────────
  const handleReRender = async () => {
    if (!payload) return;
    setRendering(true);
    setRenderError(null);

    const updatedPayload = {
      ...payload,
      slides,
      title,
      accentColor:   initialAccent,
      brandName:     initialBrand,
      tagline:       initialTagline,
      musicUrl:      initialMusic,
      opacity:       opacity / 100,
      speed:         0.25 + (speed / 100) * 1.75,
      volume:        volume / 100,
      transitionIn:  (transitionIn  / 100) * 0.8,
      transitionOut: transitionOut > 50 ? 0 : (transitionOut / 100) * 0.8,
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Re-render failed");

      setRerenderedVideo({
        videoUrl:        `${BACKEND_URL}${data.videoUrl}`,
        durationSeconds: data.durationSeconds,
        fileName:        data.fileName,
      });
      setTotalDuration(data.durationSeconds);
      setCurrentTime(0);
      setPlaying(false);
      setHasUnsavedChanges(false);   // ← clear dirty flag after successful render

    } catch (err) {
      setRenderError(err.message);
    } finally {
      setRendering(false);
    }
  };

  // ── Display helpers ───────────────────────────────────────────────────────
  const speedDisplay        = `${(0.25 + (speed / 100) * 1.75).toFixed(2)}×`;
  const transitionInDisplay = `Fade ${((transitionIn / 100) * 0.8).toFixed(2)}s`;
  const transitionOutDisplay= transitionOut > 50 ? "Cut" : `Fade ${((transitionOut / 100) * 0.8).toFixed(2)}s`;

  const adjustments = [
    { label: "Opacity",        value: opacity,       display: `${opacity}%`,          onChange: setOpacity,       note: null },
    { label: "Speed",          value: speed,         display: speedDisplay,            onChange: setSpeed,         note: null },
    { label: "Volume",         value: volume,        display: `${volume}%`,            onChange: setVolume,        note: null },
    { label: "Transition in",  value: transitionIn,  display: transitionInDisplay,     onChange: setTransitionIn,  note: "✦ Preview simulated · Re-Render to bake" },
    { label: "Transition out", value: transitionOut, display: transitionOutDisplay,    onChange: setTransitionOut, note: "✦ Preview simulated · Re-Render to bake" },
  ];

  const effectsList = [
    { key: "colorMatch",  label: "Color match"  },
    { key: "stabilize",   label: "Stabilize"    },
    { key: "autoReframe", label: "Auto reframe" },
  ];

  const leftTabs = [
    <svg key="v" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><polygon points="11,9 19,12 11,15" fill="currentColor" stroke="none"/></svg>,
    <svg key="a" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
    <svg key="t" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10"/></svg>,
    <svg key="s" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  ];

  const RightPanel = () => (
    <div style={{ overflowY: "auto", width: isDesktop ? 220 : "100%", borderLeft: isDesktop ? "1px solid #1e1e2e" : "none" }}>
      <div style={{ margin: 12, borderRadius: 16, background: "#0D1240", border: "1px solid #1e2350", padding: "16px 14px" }}>
        <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "0 0 16px" }}>Adjustment</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {adjustments.map(a => <AdjRow key={a.label} {...a} />)}
        </div>
      </div>

      <div style={{ padding: "4px 14px 14px" }}>
        <h3 style={{ color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", margin: "0 0 8px" }}>EFFECTS</h3>
        {effectsList.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setEffects(prev => ({ ...prev, [key]: !prev[key] }))}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "11px 8px",
              borderRadius: 10,
              fontSize: 13,
              background: effects[key] ? "rgba(141,69,254,0.12)" : "none",
              border: "none",
              cursor: "pointer",
              color: effects[key] ? "#a78bfa" : "#fff",
            }}
          >
            <span>{label}</span>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: effects[key] ? "#8D45FE" : "transparent", border: `2px solid ${effects[key] ? "#8D45FE" : "#444"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {effects[key] && <svg width="8" height="8" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
          </button>
        ))}
      </div>

      {renderError && (
        <div style={{ margin: "0 12px 12px", padding: "10px 12px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: 12 }}>
          ⚠️ {renderError}
        </div>
      )}

      {(rerenderedVideo || renderedVideo) && (
        <div style={{ padding: "0 12px 12px" }}>
          {hasUnsavedChanges && (
            <div style={{ marginBottom: 8, padding: "7px 10px", borderRadius: 8, background: "rgba(253,77,218,0.1)", border: "1px solid rgba(253,77,218,0.3)", color: "#FD4FDA", fontSize: 11 }}>
              ⚠ Re-render to apply latest changes
            </div>
          )}
          <a
            href={videoUrl}
            download={rerenderedVideo?.fileName || renderedVideo?.fileName}
            style={{ display: "block", padding: "10px 14px", borderRadius: 10, background: "linear-gradient(90deg,#8D45FE,#FD4FDA)", color: "#fff", fontWeight: 700, fontSize: 12, textAlign: "center", textDecoration: "none" }}
          >
            ⬇ Download MP4
          </a>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: isMobile ? "auto" : "calc(100vh - 65px)", overflow: isMobile ? "visible" : "hidden", fontFamily: "sans-serif" }}>

      {/* ── Header ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "10px 14px" : "14px 24px",
        borderBottom: "1px solid #1e1e2e", flexShrink: 0, gap: 10, flexWrap: "wrap",
      }}>
        <div style={{ minWidth: 0, display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => navigate("/create")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#9191A8", padding: 4, display: "flex", alignItems: "center" }}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <div>
            <h1 style={{ color: "#fff", fontSize: isMobile ? 15 : 20, fontWeight: 800, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {title}
            </h1>
            <p style={{ color: "#9191A8", fontSize: 11, margin: "2px 0 0" }}>
              9:16 · 30 fps · {totalDuration.toFixed(1)}s
            </p>
          </div>
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
          <button
            onClick={handleReRender}
            disabled={rendering || !payload}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: isMobile ? "7px 12px" : "9px 18px",
              borderRadius: 10, fontSize: 12, fontWeight: 700,
              background: rendering ? "#333" : hasUnsavedChanges ? "linear-gradient(90deg,#FD4FDA,#8D45FE)" : "linear-gradient(90deg,#8D45FE,#FD4FDA)",
              color: "#fff", border: "none", cursor: rendering ? "not-allowed" : "pointer",
              opacity: rendering ? 0.7 : 1,
            }}
          >
            {rendering ? (
              <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⚙️</span>
            ) : (
              <svg width="13" height="13" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            )}
            {rendering ? "Rendering..." : hasUnsavedChanges ? "Re-Render ●" : "Re-Render"}
          </button>
        </div>
      </div>

      {/* ── Desktop layout ── */}
      {isDesktop ? (
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* Left panel — slides */}
          <div style={{ width: 200, flexShrink: 0, display: "flex", flexDirection: "column", background: "#0A0A1A", borderRight: "1px solid #1e1e2e" }}>
            <div style={{ display: "flex", gap: 6, padding: "12px 12px 10px", borderBottom: "1px solid #1e1e2e" }}>
              {leftTabs.map((icon, i) => (
                <button
                  key={i}
                  onClick={() => setActiveLeftTab(i)}
                  style={{
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: activeLeftTab === i ? "linear-gradient(135deg,#8D45FE,#FD4FDA)" : "#1a1a2e",
                    color: activeLeftTab === i ? "#fff" : "#9191A8", border: "none", cursor: "pointer",
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
              {slides.length === 0 ? (
                <div style={{ padding: 16, textAlign: "center" }}>
                  <p style={{ color: "#9191A8", fontSize: 12 }}>No slides yet.</p>
                  <button onClick={() => navigate("/create")} style={{ marginTop: 8, padding: "6px 12px", borderRadius: 8, background: "rgba(141,69,254,0.2)", border: "1px solid rgba(141,69,254,0.4)", color: "#a78bfa", fontSize: 11, cursor: "pointer" }}>
                    Go to Create
                  </button>
                </div>
              ) : slides.map((slide, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  style={{ borderRadius: 12, overflow: "hidden", cursor: "pointer", border: `1px solid ${currentSlide === i ? "#8D45FE" : "#222"}` }}
                >
                  <div style={{ height: 90, position: "relative", background: "linear-gradient(135deg,#0D1240,#1a1a3e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {slide.imageUrl ? (
                      <img src={slide.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                    ) : (
                      <>
                        <span style={{ position: "absolute", top: 7, left: 7, fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 5, background: "rgba(0,230,254,0.2)", color: "#00E6FE" }}>Text</span>
                        <span style={{ color: "#9191A8", fontSize: 11, padding: "0 8px", textAlign: "center", overflow: "hidden" }}>{slide.text}</span>
                      </>
                    )}
                    {slide.imageUrl && <span style={{ position: "absolute", top: 7, left: 7, fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 5, background: "rgba(141,69,254,0.3)", color: "#8D45FE" }}>Slide {i + 1}</span>}
                  </div>
                  <div style={{ padding: "7px 9px" }}>
                    <p style={{ color: "#fff", fontSize: 11, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {slide.caption || slide.text || `Slide ${i + 1}`}
                    </p>
                    <p style={{ color: "#9191A8", fontSize: 10, margin: "2px 0 0" }}>6s · {slide.type || "image"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center — preview + timeline */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflow: "hidden" }}>
              <PreviewCard
                videoUrl={videoUrl}
                playing={playing}
                setPlaying={setPlaying}
                currentTime={currentTime}
                totalDuration={totalDuration}
                size="md"
                onTimeUpdate={handleTimeUpdate}
                videoRef={videoRef}
                opacity={opacity}
                transitionIn={transitionIn}
                transitionOut={transitionOut}
                isFading={isFading}
              />
            </div>
            <div style={{ flexShrink: 0, padding: "0 14px 10px" }}>
              <TransportBar playing={playing} setPlaying={setPlaying} currentTime={currentTime} totalDuration={totalDuration} onSeekBack={seekBack} onSeekForward={seekForward} />
              <div style={{ marginTop: 8 }}>
                <Timeline slides={slides} currentSlide={currentSlide} onSlideClick={setCurrentSlide} />
              </div>
            </div>
          </div>

          <RightPanel />
        </div>

      ) : isTablet ? (
        <div style={{ display: "flex", flex: 1, overflow: "hidden", flexDirection: "column" }}>
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 12, overflow: "hidden" }}>
                <PreviewCard
                  videoUrl={videoUrl} playing={playing} setPlaying={setPlaying}
                  currentTime={currentTime} totalDuration={totalDuration} size="sm"
                  onTimeUpdate={handleTimeUpdate} videoRef={videoRef}
                  opacity={opacity} transitionIn={transitionIn} transitionOut={transitionOut} isFading={isFading}
                />
              </div>
              <div style={{ flexShrink: 0, padding: "0 12px 8px" }}>
                <TransportBar playing={playing} setPlaying={setPlaying} currentTime={currentTime} totalDuration={totalDuration} onSeekBack={seekBack} onSeekForward={seekForward} compact />
              </div>
            </div>
            <div style={{ width: 210, flexShrink: 0, overflowY: "auto", borderLeft: "1px solid #1e1e2e" }}>
              <RightPanel />
            </div>
          </div>
          <div style={{ flexShrink: 0, padding: "0 12px 10px", borderTop: "1px solid #1e1e2e" }}>
            <Timeline slides={slides} currentSlide={currentSlide} onSlideClick={setCurrentSlide} />
          </div>
        </div>

      ) : (
        /* Mobile layout */
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 16px 6px" }}>
            <PreviewCard
              videoUrl={videoUrl} playing={playing} setPlaying={setPlaying}
              currentTime={currentTime} totalDuration={totalDuration} size="xs"
              onTimeUpdate={handleTimeUpdate} videoRef={videoRef}
              opacity={opacity} transitionIn={transitionIn} transitionOut={transitionOut} isFading={isFading}
            />
          </div>
          <div style={{ padding: "0 12px 6px" }}>
            <TransportBar playing={playing} setPlaying={setPlaying} currentTime={currentTime} totalDuration={totalDuration} onSeekBack={seekBack} onSeekForward={seekForward} compact />
          </div>

          <div style={{ display: "flex", position: "sticky", top: 0, zIndex: 10, borderTop: "1px solid #1e1e2e", borderBottom: "1px solid #1e1e2e", background: "#060B28" }}>
            {mobileTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveBottomTab(tab)}
                style={{
                  flex: 1, padding: "9px 4px", fontSize: 10, fontWeight: 600, border: "none", cursor: "pointer", textTransform: "capitalize",
                  background: activeBottomTab === tab ? "rgba(141,69,254,0.15)" : "transparent",
                  color: activeBottomTab === tab ? "#a78bfa" : "#9191A8",
                  borderBottom: activeBottomTab === tab ? "2px solid #8D45FE" : "2px solid transparent",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ minHeight: 300 }}>
            {activeBottomTab === "clips" && (
              <div style={{ display: "flex", gap: 8, padding: 10, overflowX: "auto" }}>
                {slides.map((slide, i) => (
                  <div
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    style={{ borderRadius: 10, overflow: "hidden", cursor: "pointer", border: `1px solid ${currentSlide === i ? "#8D45FE" : "#222"}`, flexShrink: 0, width: 120 }}
                  >
                    <div style={{ height: 70, position: "relative", background: "linear-gradient(135deg,#0D1240,#1a1a3e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {slide.imageUrl
                        ? <img src={slide.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                        : <span style={{ color: "#9191A8", fontSize: 9, padding: "0 4px", textAlign: "center" }}>{slide.text}</span>
                      }
                    </div>
                    <div style={{ padding: "5px 7px" }}>
                      <p style={{ color: "#fff", fontSize: 10, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {slide.caption || slide.text || `Slide ${i + 1}`}
                      </p>
                      <p style={{ color: "#9191A8", fontSize: 9, margin: "2px 0 0" }}>6s</p>
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
                {effectsList.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setEffects(prev => ({ ...prev, [key]: !prev[key] }))}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 8px", borderRadius: 10, fontSize: 13, background: effects[key] ? "rgba(141,69,254,0.1)" : "none", border: "none", cursor: "pointer", color: effects[key] ? "#a78bfa" : "#fff", borderBottom: "1px solid #1e1e2e" }}
                  >
                    <span>{label}</span>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: effects[key] ? "#8D45FE" : "transparent", border: `2px solid ${effects[key] ? "#8D45FE" : "#444"}` }}/>
                  </button>
                ))}
              </div>
            )}
            {activeBottomTab === "timeline" && (
              <div style={{ padding: 10 }}>
                <Timeline slides={slides} currentSlide={currentSlide} onSlideClick={setCurrentSlide} />
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}