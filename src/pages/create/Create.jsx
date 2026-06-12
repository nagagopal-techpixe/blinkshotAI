import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const sources = [
  {
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <path d="M12 18h.01"/>
      </svg>
    ),
    label: "Phone Gallery",
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    ),
    label: "Camera Upload",
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    label: "Google Drive",
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
    label: "Dropbox",
  },
];

const reelStyles = [
  { label: "Cinematic",        desc: "Motion transitions · Speed ramps",      thumb: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80", accent: "#1e3a5f" },
  { label: "Wedding",          desc: "Emotional · Soft tones · AI captions",  thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80", accent: "#f9a8d4" },
  { label: "Viral Reels",      desc: "Fast cuts · Trending music",            thumb: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80", accent: "#ef4444" },
  { label: "Product Showcase", desc: "Motion graphics · Brand overlay",       thumb: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", accent: "#06b6d4" },
  { label: "Travel",           desc: "Aerial shots · Landscape focus",        thumb: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80", accent: "#8D45FE" },
  { label: "Fashion",          desc: "Editorial · Slow motion",               thumb: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80", accent: "#FD4FDA" },
];

const pipelineSteps = [
  { label: "Uploading",     desc: "Media uploading successfully",         icon: "☁️" },
  { label: "Scene Detect",  desc: "AI is analyzing scenes..",             icon: "🔍" },
  { label: "Color Grade",   desc: "Enhancing colors and contrast",        icon: "🎨" },
  { label: "Captions",      desc: "Generating captions..",                icon: "💬" },
  { label: "Music Sync",    desc: "Finding perfect background music",     icon: "🎵" },
  { label: "Rendering",     desc: "Remotion is rendering your reel...",   icon: "⚙️" },
  { label: "Export",        desc: "Final reel ready",                     icon: "📥" },
];

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function SlideRow({ slide, index, onChange, onRemove }) {
  return (
    <div
      style={{
        background: "rgba(141,69,254,0.06)",
        border: "1px solid rgba(141,69,254,0.2)",
        borderRadius: 14,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#8D45FE", fontSize: 12, fontWeight: 700 }}>
          Slide {index + 1}
        </span>
        {index > 0 && (
          <button
            onClick={() => onRemove(index)}
            style={{ background: "none", border: "none", color: "#9191A8", cursor: "pointer", fontSize: 12 }}
          >
            ✕ Remove
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {["image", "text"].map((t) => (
          <button
            key={t}
            onClick={() => onChange(index, "type", t)}
            style={{
              padding: "5px 14px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 600,
              border: "1px solid",
              cursor: "pointer",
              borderColor: slide.type === t ? "#8D45FE" : "#222",
              background: slide.type === t ? "rgba(141,69,254,0.2)" : "transparent",
              color: slide.type === t ? "#fff" : "#9191A8",
            }}
          >
            {t === "image" ? "🖼 Image" : "✍️ Text"}
          </button>
        ))}
      </div>

      {slide.type === "image" ? (
        <>
          <input
            placeholder="Image URL (https://...)"
            value={slide.imageUrl || ""}
            onChange={(e) => onChange(index, "imageUrl", e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Caption (optional)"
            value={slide.caption || ""}
            onChange={(e) => onChange(index, "caption", e.target.value)}
            style={inputStyle}
          />
        </>
      ) : (
        <textarea
          placeholder="Text to animate on screen..."
          value={slide.text || ""}
          onChange={(e) => onChange(index, "text", e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      )}
    </div>
  );
}

const inputStyle = {
  background: "#0A0A1A",
  border: "1px solid #222",
  borderRadius: 10,
  padding: "10px 14px",
  color: "#fff",
  fontSize: 13,
  width: "100%",
  outline: "none",
  fontFamily: "sans-serif",
  boxSizing: "border-box",
};

export default function Create() {
  const navigate = useNavigate();

  const [dragOver,       setDragOver]       = useState(false);
  const [uploadedFiles,  setUploadedFiles]  = useState([]);
  const [selectedStyle,  setSelectedStyle]  = useState(0);
  const [title,          setTitle]          = useState("");
  const [subtitle,       setSubtitle]       = useState("");
  const [brandName,      setBrandName]      = useState("BlinkshotAI");
  const [tagline,        setTagline]        = useState("Created with AI");
  const [accentColor,    setAccentColor]    = useState("#8D45FE");
  const [musicUrl,       setMusicUrl]       = useState("");
  const [slides,         setSlides]         = useState([{ type: "image", imageUrl: "", caption: "" }]);
  const [rendering,      setRendering]      = useState(false);
  const [renderStep,     setRenderStep]     = useState(-1);
  const [renderError,    setRenderError]    = useState(null);
  const [renderedVideo,  setRenderedVideo]  = useState(null);
  const [showJson,       setShowJson]       = useState(false);

  const fileRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    setUploadedFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
  };

  const handleFileSelect = (e) => {
    setUploadedFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const updateSlide = (index, field, value) => {
    setSlides((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const addSlide = () => {
    setSlides((prev) => [...prev, { type: "image", imageUrl: "", caption: "" }]);
  };

  const removeSlide = (index) => {
    setSlides((prev) => prev.filter((_, i) => i !== index));
  };

  const buildPayload = () => ({
    style:       reelStyles[selectedStyle].label,
    title:       title || "My Reel",
    subtitle:    subtitle,
    slides:      slides.filter((s) => s.type === "image" ? s.imageUrl || s.caption : s.text),
    brandName,
    tagline,
    accentColor: accentColor || reelStyles[selectedStyle].accent,
    bgColor:     "#060B28",
    textColor:   "#ffffff",
    musicUrl:    musicUrl || null,
  });

  const handleRender = async () => {
    setRendering(true);
    setRenderError(null);
    setRenderedVideo(null);
    setRenderStep(0);

    const payload = buildPayload();

    try {
      const stepTimer = setInterval(() => {
        setRenderStep((prev) => {
          if (prev < pipelineSteps.length - 2) return prev + 1;
          clearInterval(stepTimer);
          return prev;
        });
      }, 3000);

      const res = await fetch(`${BACKEND_URL}/api/render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      clearInterval(stepTimer);

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Render failed");
      }

      setRenderStep(pipelineSteps.length - 1);

      const videoData = {
        videoUrl:        `${BACKEND_URL}${data.videoUrl}`,
        durationSeconds: data.durationSeconds,
        fileName:        data.fileName,
      };

      setRenderedVideo(videoData);

      navigate("/reel-editor", {
        state: {
          renderedVideo: videoData,
          payload,
          slides,
          title: title || "My Reel",
          accentColor,
          brandName,
          tagline,
          musicUrl,
        },
      });

    } catch (err) {
      setRenderError(err.message);
    } finally {
      setRendering(false);
    }
  };

  const jsonPayload = JSON.stringify(buildPayload(), null, 2);

  return (
    <div style={{ minHeight: "100vh", padding: "16px", fontFamily: "sans-serif" }}>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 900, margin: 0 }}>Create</h1>
        <p style={{ color: "#9191A8", fontSize: 14, marginTop: 4 }}>
          Pick a style, fill in the details — Remotion renders your reel.
        </p>
      </div>

      <Section title="Step 1 — Upload Your Videos">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? "#8D45FE" : "#22d3ee"}`,
            background: dragOver ? "rgba(141,69,254,0.05)" : "rgba(34,211,238,0.03)",
            borderRadius: 18,
            minHeight: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 24,
          }}
        >
          <input ref={fileRef} type="file" multiple accept="video/*" style={{ display: "none" }} onChange={handleFileSelect} />

          {uploadedFiles.length === 0 ? (
            <>
              <div style={{ width: 60, height: 60, borderRadius: 16, background: "linear-gradient(135deg,#22d3ee,#8D45FE)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
                  <polyline points="16 16 12 12 8 16"/>
                  <line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
                </svg>
              </div>
              <p style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 8px", textAlign: "center" }}>
                Drop your videos here or browse files
              </p>
              <p style={{ color: "#9191A8", fontSize: 13, marginBottom: 20 }}>
                MP4 · MOV · vertical · horizontal · 4K supported
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                style={{ padding: "10px 24px", borderRadius: 12, background: "linear-gradient(90deg,#8D45FE,#FD4FDA)", color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", marginBottom: 16 }}
              >
                Browse Files
              </button>
              <p style={{ color: "#9191A8", fontSize: 12, margin: "0 0 12px" }}>Or import from</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                {sources.map(({ icon, label }) => (
                  <button
                    key={label}
                    onClick={(e) => e.stopPropagation()}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10, fontSize: 12, color: "#9191A8", background: "rgba(255,255,255,0.05)", border: "1px solid #1e1e2e", cursor: "pointer" }}
                  >
                    {icon}{label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div style={{ width: "100%" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 10, marginBottom: 10 }}>
                {uploadedFiles.map((f, i) => (
                  <div key={i} style={{ borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8, background: "rgba(141,69,254,0.1)", border: "1px solid rgba(141,69,254,0.2)" }}>
                    <svg width="14" height="14" fill="none" stroke="#8D45FE" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    <span style={{ color: "#fff", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                  </div>
                ))}
                <div
                  onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                  style={{ borderRadius: 10, border: "1px dashed #1e1e2e", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 12px", cursor: "pointer" }}
                >
                  <span style={{ color: "#9191A8", fontSize: 11 }}>+ Add more</span>
                </div>
              </div>
              <p style={{ color: "#9191A8", fontSize: 11, textAlign: "center" }}>
                {uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""} selected
              </p>
            </div>
          )}
        </div>
      </Section>

      <Section title="Step 2 — Choose Reel Style">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 14 }}>
          {reelStyles.map(({ label, desc, thumb }, i) => (
            <div
              key={label}
              onClick={() => { setSelectedStyle(i); setAccentColor(reelStyles[i].accent); }}
              style={{
                borderRadius: 16,
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                border: `2px solid ${selectedStyle === i ? "#8D45FE" : "transparent"}`,
                transition: "border 0.15s",
              }}
            >
              <img src={thumb} alt={label} style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }}/>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.85) 0%,transparent 60%)" }}/>
              {selectedStyle === i && (
                <div style={{ position: "absolute", top: 8, right: 8, width: 20, height: 20, borderRadius: "50%", background: "#8D45FE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="10" height="10" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px 10px" }}>
                <p style={{ color: "#fff", fontSize: 12, fontWeight: 700, margin: 0 }}>{label}</p>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, margin: "2px 0 0" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Step 3 — Video Details">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <Label>Title *</Label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Aurora — Bali Teaser" style={inputStyle} />
            </div>
            <div>
              <Label>Subtitle</Label>
              <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="e.g. A travel story" style={inputStyle} />
            </div>
            <div>
              <Label>Brand Name</Label>
              <input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="BlinkshotAI" style={inputStyle} />
            </div>
            <div>
              <Label>Tagline</Label>
              <input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Created with AI" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <Label>Accent Color</Label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} style={{ width: 40, height: 36, borderRadius: 8, border: "1px solid #222", cursor: "pointer", background: "none", padding: 2 }} />
                <input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} placeholder="#8D45FE" style={{ ...inputStyle, flex: 1 }} />
              </div>
            </div>
            <div>
              <Label>Music URL (optional)</Label>
              <input value={musicUrl} onChange={(e) => setMusicUrl(e.target.value)} placeholder="https://...mp3" style={inputStyle} />
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Label>Slides</Label>
              <button onClick={addSlide} style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(141,69,254,0.2)", border: "1px solid rgba(141,69,254,0.4)", color: "#8D45FE", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                + Add Slide
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {slides.map((slide, i) => (
                <SlideRow key={i} slide={slide} index={i} onChange={updateSlide} onRemove={removeSlide} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section title="Step 4 — AI Processing Pipeline">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10 }}>
          {pipelineSteps.map(({ label, desc, icon }, i) => {
            const isDone         = rendering && renderStep > i;
            const isActive       = rendering && renderStep === i;
            const isDoneComplete = !rendering && renderedVideo && i <= renderStep;
            return (
              <div
                key={label}
                style={{
                  borderRadius: 14,
                  padding: "14px 12px",
                  minHeight: 110,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  position: "relative",
                  background: isDone || isDoneComplete ? "rgba(141,69,254,0.12)" : isActive ? "rgba(141,69,254,0.07)" : "#060B28",
                  border: `1px solid ${isDone || isActive || isDoneComplete ? "#8D45FE" : "#222"}`,
                  transition: "all 0.4s",
                }}
              >
                <span style={{ fontSize: 24 }}>{icon}</span>
                <div>
                  <p style={{ color: "#fff", fontSize: 12, fontWeight: 700, margin: 0 }}>{label}</p>
                  <p style={{ color: "#9191A8", fontSize: 10, margin: "3px 0 0", lineHeight: 1.4 }}>{desc}</p>
                </div>
                {isActive && (
                  <div style={{ position: "absolute", top: 10, right: 10, width: 8, height: 8, borderRadius: "50%", background: "#8D45FE", animation: "pulse 1s infinite" }}/>
                )}
                {(isDone || isDoneComplete) && (
                  <div style={{ position: "absolute", top: 10, right: 10 }}>
                    <svg width="14" height="14" fill="none" stroke="#8D45FE" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setShowJson((v) => !v)}
          style={{ padding: "8px 16px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid #222", color: "#9191A8", fontSize: 12, cursor: "pointer" }}
        >
          {showJson ? "Hide" : "Show"} JSON payload →
        </button>
        {showJson && (
          <pre style={{ marginTop: 10, background: "#0A0A1A", border: "1px solid #1e1e2e", borderRadius: 12, padding: 16, color: "#8D45FE", fontSize: 11, overflowX: "auto", maxHeight: 300, lineHeight: 1.6 }}>
            {jsonPayload}
          </pre>
        )}
      </div>

      {renderError && (
        <div style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 12, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: 13 }}>
          ⚠️ {renderError}
        </div>
      )}

      {renderedVideo && (
        <div style={{ marginBottom: 28, padding: 20, borderRadius: 18, background: "rgba(141,69,254,0.08)", border: "1px solid rgba(141,69,254,0.3)" }}>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, margin: "0 0 14px" }}>
            ✅ Reel Ready — {renderedVideo.durationSeconds?.toFixed(1)}s
          </p>
          <video src={renderedVideo.videoUrl} controls style={{ width: "100%", maxWidth: 400, borderRadius: 12, display: "block", marginBottom: 14 }} />
          <div style={{ display: "flex", gap: 10 }}>
            <a href={renderedVideo.videoUrl} download={renderedVideo.fileName} style={{ padding: "10px 22px", borderRadius: 12, background: "linear-gradient(90deg,#8D45FE,#FD4FDA)", color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
              ⬇ Download MP4
            </a>
            <button
              onClick={() => navigate("/reel-editor", { state: { renderedVideo, payload: buildPayload(), slides, title: title || "My Reel", accentColor, brandName, tagline, musicUrl } })}
              style={{ padding: "10px 18px", borderRadius: 12, background: "rgba(141,69,254,0.15)", border: "1px solid rgba(141,69,254,0.4)", color: "#a78bfa", fontSize: 13, cursor: "pointer", fontWeight: 600 }}
            >
              ✏️ Edit in Reel Editor
            </button>
            <button
              onClick={() => { setRenderedVideo(null); setRenderStep(-1); }}
              style={{ padding: "10px 18px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid #222", color: "#9191A8", fontSize: 13, cursor: "pointer" }}
            >
              Create Another
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, flexWrap: "wrap" }}>
        <button style={{ padding: "12px 24px", borderRadius: 12, background: "#060B28", border: "1px solid #222", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          Save Draft
        </button>
        <button
          onClick={handleRender}
          disabled={rendering}
          style={{
            padding: "12px 28px",
            borderRadius: 12,
            background: rendering ? "#333" : "linear-gradient(90deg,#8D45FE,#FD4FDA)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            border: "none",
            cursor: rendering ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: rendering ? 0.7 : 1,
          }}
        >
          {rendering ? (
            <>
              <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⚙️</span>
              Rendering... ({pipelineSteps[renderStep]?.label || "Starting"})
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              Start AI Processing
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ color: "#fff", fontSize: 17, fontWeight: 700, margin: "0 0 14px" }}>{title}</h2>
      {children}
    </div>
  );
}

function Label({ children }) {
  return (
    <p style={{ color: "#9191A8", fontSize: 11, fontWeight: 600, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
      {children}
    </p>
  );
}