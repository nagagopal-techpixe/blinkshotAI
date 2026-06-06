import { useState, useRef } from "react";

const sources = [
  {
    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>,
    label: "Phone Gallery",
  },
  {
    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
    label: "Camera Upload",
  },
  {
    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    label: "Google Drive",
  },
  {
    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    label: "Dropbox",
  },
  {
    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
    label: "AWS S3",
  },
];

const reelStyles = [
  {
    label: "Cinematic",
    desc: "Motion transitions · Speed ramps",
    thumb: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80",
  },
  {
    label: "Wedding",
    desc: "Emotional · Soft tones · AI captions",
    thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80",
  },
  {
    label: "Viral Reels",
    desc: "Fast cuts · Trending music",
    thumb: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80",
  },
  {
    label: "Product Showcase",
    desc: "Motion graphics · Brand overlay",
    thumb: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
  },
  {
    label: "Travel",
    desc: "Aerial shots · Landscape focus",
    thumb: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80",
  },
  {
    label: "Fashion",
    desc: "Editorial · Slow motion",
    thumb: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
  },
];

const pipelineSteps = [
  {
    label: "Uploading",
    desc: "Media uploading successfully",
    status: "done",
    icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>,
  },
  {
    label: "Scene Detect",
    desc: "AI is analyzing scenes..",
    status: "active",
    icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><circle cx="11" cy="11" r="4"/></svg>,
  },
  {
    label: "Color Grade",
    desc: "Enhancing colors and contrast",
    status: "idle",
    icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>,
  },
  {
    label: "Captions",
    desc: "Generating captions..",
    status: "idle",
    icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 9h10M7 13h6"/></svg>,
  },
  {
    label: "Music Sync",
    desc: "Finding perfect background music",
    status: "idle",
    icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  },
  {
    label: "Rendering",
    desc: "Rendering your reel...",
    status: "idle",
    icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>,
  },
  {
    label: "Export",
    desc: "Final reel ready",
    status: "idle",
    icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  },
];

export default function Create() {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(0);
  const fileRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    setUploadedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
  };

  const handleFileSelect = (e) => {
    setUploadedFiles(prev => [...prev, ...Array.from(e.target.files)]);
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6" >

      {/* Page header */}
      <div className="mb-7">
        <h1 className="text-white text-2xl sm:text-3xl font-extrabold mb-1">Create</h1>
        <p className="text-sm" style={{ color: "#9191A8" }}>Pick a starting point. The AI takes care of the rest.</p>
      </div>

      {/*Step 1 — Upload*/}
      <div className="mb-8">
        <h2 className="text-white text-lg font-bold mb-3">Step 1 — Upload Your Videos</h2>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className="relative rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all"
          style={{
            border: `2px dashed ${dragOver ? "#8D45FE" : "#22d3ee"}`,
            background: dragOver ? "rgba(141,69,254,0.05)" : "rgba(34,211,238,0.03)",
            minHeight: 220,
padding: "24px",
          }}
        >
          <input ref={fileRef} type="file" multiple accept="video/*" style={{ display: "none" }} onChange={handleFileSelect} />

          {uploadedFiles.length === 0 ? (
            <>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "linear-gradient(135deg, #22d3ee, #8D45FE)" }}>
                <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
                  <polyline points="16 16 12 12 8 16"/>
                  <line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
                </svg>
              </div>
              <p className="text-white text-lg sm:text-xl font-bold mb-2 text-center">Drop your videos here or browse files</p>
              <p className="text-sm mb-6" style={{ color: "#9191A8" }}>MP4 · MOV · vertical · horizontal · 4K supported</p>
              <button
                onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                className="px-7 py-3 rounded-xl text-white font-bold text-sm mb-4 hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(90deg, #8D45FE, #FD4FDA)" }}
              >
                Browse Files
              </button>
              <p className="text-sm mb-4" style={{ color: "#9191A8" }}>Or</p>
              <div className="flex items-center gap-3 flex-wrap justify-center">
                {sources.map(({ icon, label }) => (
                  <button
                    key={label}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-white/10"
                    style={{ color: "#9191A8", background: "rgba(255,255,255,0.05)", border: "1px solid #1e1e2e" }}
                  >
                    {icon}{label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="rounded-xl p-3 flex items-center gap-2"
                    style={{ background: "rgba(141,69,254,0.1)", border: "1px solid rgba(141,69,254,0.2)" }}>
                    <svg width="14" height="14" fill="none" stroke="#8D45FE" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    <span className="text-xs text-white truncate">{f.name}</span>
                  </div>
                ))}
                <div className="rounded-xl flex items-center justify-center cursor-pointer hover:opacity-80"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed #1e1e2e", minHeight: 48 }}
                  onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
                  <span className="text-xs" style={{ color: "#9191A8" }}>+ Add more</span>
                </div>
              </div>
              <p className="text-xs text-center" style={{ color: "#9191A8" }}>{uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""} selected</p>
            </div>
          )}
        </div>
      </div>

      {/*Step 2 — Reel Style (horizontal scroll image cards)*/}
      <div className="mb-8">
        <h2 className="text-white text-lg font-bold mb-4">Step 2 — Choose Reel Style</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {reelStyles.map(({ label, desc, thumb }, i) => (
            <div
              key={label}
              onClick={() => setSelectedStyle(i)}
              className="rounded-2xl overflow-hidden cursor-pointer relative"
              style={{
                border: `2px solid ${selectedStyle === i ? "#8D45FE" : "transparent"}`,
                transition: "border 0.15s",
              }}
            >
              <img
  src={thumb}
  alt={label}
  className="w-full h-28 sm:h-36 object-cover block"
/>
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)" }}
              />
              {/* Selected ring indicator */}
              {selectedStyle === i && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "#8D45FE" }}>
                  <svg width="10" height="10" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-sm font-bold mb-0.5">{label}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*Step 3 — AI Processing Pipeline*/}
      <div className="mb-8">
        <h2 className="text-white text-lg font-bold mb-4">Step 3 — AI Processing Pipeline</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {pipelineSteps.map(({ label, desc, status, icon }, i) => (
            <div
              key={label}
              className="rounded-2xl p-4 flex flex-col gap-3 relative"
              style={{
                minHeight: 140,
                background: status === "done"
                  ? "rgba(141,69,254,0.12)"
                  : status === "active"
                  ? "rgba(141,69,254,0.08)"
                  : "#060B28",
                border: `1px solid ${
                  status === "done" ? "#8D45FE"
                  : status === "active" ? "#8D45FE"
                  : "#222"
                }`,
              }}
            >
           {/* Connector line */}
{i < pipelineSteps.length - 1 && (
  <>
    {/* Mobile: vertical line */}
    <div
      className="absolute left-1/2 -bottom-6 w-0.5 h-6 sm:hidden"
      style={{
        background: status === "done" ? "#8D45FE" : "#1e1e2e",
        transform: "translateX(-50%)",
      }}
    />

    {/* Desktop: horizontal line */}
    <div
      className="hidden xl:block absolute top-1/2 -right-3 w-3 h-0.5"
      style={{
        background: status === "done" ? "#8D45FE" : "#1e1e2e",
        transform: "translateY(-50%)",
      }}
    />
  </>
)}

              {/* Icon */}
              <div style={{
                color: status === "done" ? "#8D45FE"
                  : status === "active" ? "#8D45FE"
                  : "#9191A8"
              }}>
                {icon}
              </div>

              {/* Text */}
              <div>
                <p className="text-white text-sm font-bold mb-1">{label}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#9191A8" }}>{desc}</p>
              </div>

              {/* Active pulse dot */}
              {status === "active" && (
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full" style={{ background: "#8D45FE" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/*Action buttons*/}
    {/*Action buttons*/}
<div className="flex flex-col sm:flex-row justify-end gap-3">
  <button
    className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-white text-sm font-bold hover:opacity-80 transition-opacity"
    style={{
      background: "#060B28",
      border: "1px solid #222",
    }}
  >
    Save Draft
  </button>

  <button
    className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity"
    style={{
      background: "linear-gradient(90deg, #8D45FE, #FD4FDA)",
    }}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
        fill="white"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
    Start AI Processing
  </button>
</div>

    </div>
  );
}