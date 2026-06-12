import { useState, useEffect, useRef } from "react";
import lottie from "lottie-web";

function injectText(animationData, textMap) {
  const cloned = JSON.parse(JSON.stringify(animationData));
  if (cloned.fonts)  cloned.fonts.list = [];
  if (cloned.chars)  cloned.chars = [];

  cloned.layers.forEach((layer) => {
    if (layer.ty === 5 && layer.t?.d?.k) {
      const newText = textMap[layer.nm];
      layer.t.d.k.forEach((keyframe) => {
        if (keyframe.s) {
          delete keyframe.s.f;
          if (newText !== undefined) keyframe.s.t = newText;
        }
      });
    }
  });
  return cloned;
}

export default function LottieTemplatePlayer({ templateUrl, fields, onBack }) {
  const [animationData, setAnimationData] = useState(null);
  const [isPlaying, setIsPlaying]         = useState(false);
  const [isRecording, setIsRecording]     = useState(false);
  const [videoBlob, setVideoBlob]         = useState(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  const containerRef = useRef(null);
  const animRef      = useRef(null);
  const chunksRef    = useRef([]);

  // Load JSON
  useEffect(() => {
    setLoading(true);
    fetch(templateUrl)
      .then((r) => r.json())
      .then((data) => { setAnimationData(data); setLoading(false); })
      .catch(() => { setError("Failed to load template"); setLoading(false); });
  }, [templateUrl]);

  // Init + play after DOM is ready
  useEffect(() => {
    if (!animationData || !containerRef.current) return;
    if (animRef.current) { animRef.current.destroy(); animRef.current = null; }

    const textMap = {
      "Our Projects":       fields.title    || "Our Projects",
      "<empty text layer>": fields.subtitle || "",
    };

    const injected = injectText(animationData, textMap);

    // Small delay ensures container is fully mounted in DOM
    const timer = setTimeout(() => {
      if (!containerRef.current) return;

      animRef.current = lottie.loadAnimation({
        container:     containerRef.current,
        renderer:      "svg",
        loop:          false,
        autoplay:      false,
        animationData: injected,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet",
          progressiveLoad:     false,
        },
      });

      // Play after animation is loaded
      animRef.current.addEventListener("DOMLoaded", () => {
        animRef.current.goToAndPlay(0);
        setIsPlaying(true);
      });

      animRef.current.addEventListener("complete", () => setIsPlaying(false));
    }, 100);

    return () => {
      clearTimeout(timer);
      if (animRef.current) { animRef.current.destroy(); animRef.current = null; }
    };
  }, [animationData, fields]);

  const handlePlay = () => {
    if (!animRef.current) return;
    if (isPlaying) { animRef.current.pause(); setIsPlaying(false); }
    else { animRef.current.goToAndPlay(0); setIsPlaying(true); }
  };

  const handleRecord = () => {
    const canvas = containerRef.current?.querySelector("canvas");
    if (!animRef.current) return;
    setVideoBlob(null);
    setIsRecording(true);
    chunksRef.current = [];

    // Create offscreen canvas for recording
    const offscreen = document.createElement("canvas");
    const preview   = containerRef.current;
    offscreen.width  = preview.offsetWidth  || 800;
    offscreen.height = preview.offsetHeight || 500;

    const offDiv = document.createElement("div");
    offDiv.style.cssText = `width:${offscreen.width}px;height:${offscreen.height}px;position:fixed;left:-9999px;top:0;`;
    document.body.appendChild(offDiv);

    const textMap = {
      "Our Projects":       fields.title    || "Our Projects",
      "<empty text layer>": fields.subtitle || "",
    };

    const recordAnim = lottie.loadAnimation({
      container:     offDiv,
      renderer:      "canvas",
      loop:          false,
      autoplay:      false,
      animationData: injectText(animationData, textMap),
      rendererSettings: {
        context:      offscreen.getContext("2d"),
        clearCanvas:  true,
        preserveAspectRatio: "xMidYMid meet",
      },
    });

    const stream   = offscreen.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.onstop = () => {
      setVideoBlob(new Blob(chunksRef.current, { type: "video/webm" }));
      setIsRecording(false);
      recordAnim.destroy();
      document.body.removeChild(offDiv);
    };

    recordAnim.addEventListener("DOMLoaded", () => {
      recorder.start();
      recordAnim.goToAndPlay(0);
    });

    recordAnim.addEventListener("complete", () => {
      setTimeout(() => recorder.stop(), 300);
    });
  };

  const handleDownload = () => {
    if (!videoBlob) return;
    const url = URL.createObjectURL(videoBlob);
    const a   = document.createElement("a");
    a.href = url; a.download = `${fields.title || "animation"}.webm`; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div style={{ color: "#9191A8", padding: 40, textAlign: "center" }}>Loading template...</div>;
  if (error)   return <div style={{ color: "#f87171", padding: 40, textAlign: "center" }}>{error}</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div
        ref={containerRef}
        style={{ width: "100%", maxWidth: 800, aspectRatio: "8/5", borderRadius: 16, overflow: "hidden", background: "#0A0A1A", border: "1px solid #1e1e2e" }}
      />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        {onBack && (
          <button onClick={onBack} style={{ padding: "10px 20px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid #222", color: "#9191A8", fontSize: 13, cursor: "pointer" }}>
            ← Back
          </button>
        )}
        <button onClick={handlePlay} style={{ padding: "10px 24px", borderRadius: 10, background: "#0D1240", border: "1px solid #222", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          {isPlaying ? "⏸ Pause" : "▶ Play Preview"}
        </button>
        <button onClick={handleRecord} disabled={isRecording} style={{ padding: "10px 24px", borderRadius: 10, background: isRecording ? "#333" : "linear-gradient(90deg,#8D45FE,#FD4FDA)", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: isRecording ? "not-allowed" : "pointer", opacity: isRecording ? 0.7 : 1 }}>
          {isRecording ? "⏺ Recording..." : "⏺ Record as Video"}
        </button>
        {videoBlob && (
          <button onClick={handleDownload} style={{ padding: "10px 24px", borderRadius: 10, background: "#059669", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            ⬇ Download Video
          </button>
        )}
      </div>
      {videoBlob && (
        <div style={{ width: "100%", maxWidth: 800 }}>
          <p style={{ color: "#9191A8", fontSize: 12, marginBottom: 8 }}>Recorded preview:</p>
          <video src={URL.createObjectURL(videoBlob)} controls style={{ width: "100%", borderRadius: 12 }} />
        </div>
      )}
    </div>
  );
}