import { useState } from "react";

const stylePresets = [
  { label: "Fashion",    thumb: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80" },
  { label: "Cinematic",  thumb: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&q=80" },
  { label: "Product",    thumb: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80" },
  { label: "Luxury",     thumb: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&q=80" },
  { label: "Influencer", thumb: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80" },
  { label: "Golden Hour",thumb: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80" },
];

const adjustments = [
  { label: "Exposure",    value: 62 },
  { label: "Contrast",   value: 58 },
  { label: "Saturation", value: 55 },
  { label: "Highlights", value: 60 },
  { label: "Shadows",    value: 48 },
];

const enhancements = [
  { label: "AI Retouching",        toggle: true,  enabled: true,  slider: null },
  { label: "AI Skin Smoothing",    toggle: false, enabled: false, slider: 75   },
  { label: "Background Cleanup",   toggle: false, enabled: false, slider: 50   },
  { label: "Color Grading",        toggle: false, enabled: false, dropdown: "Warm Cinematic" },
  { label: "AI Beauty Enhancement",toggle: true,  enabled: true,  slider: null },
  { label: "Product Retouching",   toggle: true,  enabled: true,  slider: null },
  { label: "Batch Editing",        toggle: true,  enabled: true,  slider: null },
];

const tools = [
  { title: "Select",   icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M5 3l14 9-7 1-4 7z"/></svg> },
  { title: "Crop",     icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M6 2v14h14"/><path d="M2 6h14v14"/></svg> },
  { title: "Move",     icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M12 12h.01"/><path d="M2 12h20M12 2v20"/></svg> },
  { title: "Brush",    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 114.03 4.03l-8.06 8.07"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1 1 2.48 1.02 3.5 1.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 00-2.5-2.02z"/></svg> },
  { title: "Expand",   icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg> },
  { title: "Text",     icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg> },
  { title: "Subtitle", icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15h4m4 0h2M7 11h10"/></svg> },
  { title: "AI",       icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> },
];

function Toggle({ enabled, onChange }) {
  return (
    <div
      onClick={onChange}
      className="relative cursor-pointer flex-shrink-0"
      style={{
        width: 40, height: 22, borderRadius: 11,
        background: enabled ? "linear-gradient(90deg,#8D45FE,#FD4FDA)" : "#1e1e2e",
        transition: "background 0.2s",
      }}
    >
      <div style={{
        position: "absolute", top: 3, left: enabled ? 21 : 3,
        width: 16, height: 16, borderRadius: "50%", background: "#fff",
        transition: "left 0.2s",
      }} />
    </div>
  );
}

function Slider({ value }) {
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 h-1.5 rounded-full relative" style={{ background: "#1e1e2e" }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: "linear-gradient(90deg,#8D45FE,#FD4FDA)" }} />
        <div className="absolute top-1/2 rounded-full w-3 h-3 border-2 border-white"
          style={{ left: `calc(${value}% - 6px)`, transform: "translateY(-50%)", background: "#8D45FE" }} />
      </div>
    </div>
  );
}

export default function PhotoEditor() {
  const [view, setView] = useState("after");
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [enhs, setEnhs] = useState(enhancements);
  const [adjs, setAdjs] = useState(adjustments);

  const toggleEnh = (i) => {
    setEnhs(prev => prev.map((e, idx) => idx === i ? { ...e, enabled: !e.enabled } : e));
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6" >

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-white text-2xl sm:text-3xl font-extrabold mb-1">Photo Editor</h1>
        <p className="text-sm" style={{ color: "#9191A8" }}>Pick a starting point. The AI takes care of the rest.</p>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">

        {/* Left — canvas + tools */}
        <div className="flex flex-col gap-4">

          {/* Canvas card */}
          <div className="rounded-2xl overflow-hidden relative" style={{ background: "#060B28", border: "1px solid #222" }}>

            {/* Before/After toggle */}
            <div className="absolute top-4 left-4 z-10 flex rounded-xl overflow-hidden"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
              <button
                onClick={() => setView("before")}
                className="px-4 py-1.5 text-sm font-semibold transition-all"
                style={{
                  background: view === "before" ? "#fff" : "transparent",
                  color: view === "before" ? "#000" : "#fff",
                  border: "none", cursor: "pointer",
                }}
              >Before</button>
              <button
                onClick={() => setView("after")}
                className="px-4 py-1.5 text-sm font-semibold transition-all"
                style={{
                  background: view === "after" ? "linear-gradient(90deg,#8D45FE,#FD4FDA)" : "transparent",
                  color: "#fff", border: "none", cursor: "pointer",
                }}
              >After</button>
            </div>

            {/* Image */}
   <img
  src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&q=80"
  alt="edit preview"
  className="w-full h-[250px] sm:h-[350px] lg:h-[420px] object-cover"
  style={{
    filter:
      view === "after"
        ? "sepia(0.3) saturate(1.4) contrast(1.1)"
        : "none",
    transition: "filter 0.3s",
  }}
/>
            {/* Toolbar overlay */}
<div
  className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-1 px-3 py-2 rounded-2xl max-w-[95%]"

      style={{
  background: "rgba(10,10,30,0.85)",
  backdropFilter: "blur(12px)"
}}>
              {tools.map(({ title, icon }) => (
                <button
                  key={title}
                  title={title}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
                  style={{ color: "#fff", background: "none", border: "none", cursor: "pointer" }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Style Presets */}
          <div className="rounded-2xl p-5" style={{ background: "#060B28", border: "1px solid #222" }}>
            <h2 className="text-white text-base font-bold mb-3">Style Presets</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {stylePresets.map(({ label, thumb }, i) => (
                <div
                  key={label}
                  onClick={() => setSelectedPreset(i)}
                  className="rounded-xl overflow-hidden cursor-pointer relative"
                  style={{ border: `2px solid ${selectedPreset === i ? "#8D45FE" : "transparent"}`, transition: "border 0.15s" }}
                >
                  <img src={thumb} alt={label} style={{ width: "100%", height: 70, objectFit: "cover", display: "block" }} />
                  {selectedPreset === i && (
                    <div className="absolute inset-0" style={{ background: "rgba(141,69,254,0.15)" }} />
                  )}
                  <p className="text-center text-xs py-1.5 font-semibold"
                    style={{ color: selectedPreset === i ? "#8D45FE" : "#9191A8", background: "#060B28" }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">

          {/* AI Enhancement */}
          <div className="rounded-2xl p-5" style={{ background: "#060B28", border: "1px solid #222" }}>
            <h2 className="text-white text-base font-bold mb-4">AI Enhancement</h2>
            <div className="flex flex-col gap-0">
              {enhs.map(({ label, toggle, enabled, slider, dropdown }, i) => (
                <div
  key={label}
  className="flex items-center justify-between py-2.5"

                  style={{ borderBottom: i < enhs.length - 1 ? "1px solid #1a1a2e" : "none" }}>
                  <span className="text-xs" style={{ color: "#9191A8" }}>{label}</span>
                  <div className="flex items-center gap-2">
                    {slider !== null && slider !== undefined && (
                      <span className="text-xs font-bold text-white">{slider}</span>
                    )}
                    {dropdown && (
                      <span className="text-xs px-2 py-1 rounded-lg" style={{ background: "#1a1a2e", color: "#9191A8" }}>
                        {dropdown} ▾
                      </span>
                    )}
                    {toggle && <Toggle enabled={enabled} onChange={() => toggleEnh(i)} />}
                    {!toggle && slider !== null && slider !== undefined && (
                      <div style={{ width: 80 }}><Slider value={slider} /></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Adjustments */}
          <div className="rounded-2xl p-5" style={{ background: "#060B28", border: "1px solid #222" }}>
            <h2 className="text-white text-base font-bold mb-4">Adjustment</h2>
            <div className="flex flex-col gap-3">
              {adjs.map(({ label, value }, i) => (
                <div
  key={label}
  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
>
                  <span className="text-xs flex-shrink-0" style={{ color: "#9191A8", width: 72 }}>{label}</span>
                  <Slider value={value} />
                  <span className="text-xs font-bold text-white flex-shrink-0" style={{ width: 36 }}>+0.25</span>
                </div>
              ))}
            </div>

          </div>

          {/* Layers */}
          <div className="rounded-2xl p-5" style={{ background: "#060B28", border: "1px solid #222" }}>
            <h2 className="text-white text-base font-bold mb-4">Layers</h2>
            <div className="flex flex-col gap-2">
              {[
                { label: "Color Grade", color: "#8D45FE" },
                { label: "Subject Mark", color: "#8D45FE" },
                { label: "Sky replay", color: "#8D45FE" },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                  style={{ background: "#1a1a2e" }}>
                  <svg width="15" height="15" fill="none" stroke="#9191A8" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <div className="w-4 h-4 rounded flex-shrink-0" style={{ background: color }} />
                  <span className="text-white text-xs sm:text-sm font-semibold flex-1">{label}</span>
                  <svg width="14" height="14" fill="none" stroke="#9191A8" strokeWidth="1.8" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* Export */}
          <div className="rounded-2xl p-5" style={{ background: "#060B28", border: "1px solid #222" }}>
            <h2 className="text-white text-base font-bold mb-4">Export</h2>

            {/* Format dropdown */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-4 cursor-pointer"
              style={{ background: "#1a1a2e", border: "1px solid #2a2a3e" }}>
              <span className="text-white text-sm font-medium">JPG High Quality</span>
              <svg width="16" height="16" fill="none" stroke="#9191A8" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>

            {/* Preview toggle */}
            <div className="flex items-center gap-2 mb-3 cursor-pointer">
              <svg width="14" height="14" fill="none" stroke="#9191A8" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              <span className="text-sm font-semibold" style={{ color: "#9191A8" }}>Preview</span>
            </div>

            {/* Preview image */}
            <div  className="rounded-xl overflow-hidden mb-4 h-32 sm:h-36">
              <img
                src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80"
                alt="export preview"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block",
                  filter: "sepia(0.3) saturate(1.4) contrast(1.1)" }}
              />
            </div>

            {/* Export button */}
            <button
              className="w-full py-3 sm:py-4 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(90deg,#8D45FE,#FD4FDA)" }}
            >
              Export Man in dark
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}