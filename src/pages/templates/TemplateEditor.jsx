// src/pages/templates/TemplateEditor.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTemplateById, updateTemplate, renderTemplate } from "../../api/templateApi";

const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// ── Tiny helpers ───────────────────────────────────────────────────────────
const inp = {
  width: "100%", border: "1px solid #1a1a2e", borderRadius: 6,
  padding: "6px 9px", fontSize: 12, color: "#e0e0f0",
  background: "#0a0a18", outline: "none", boxSizing: "border-box",
  fontFamily: "inherit", transition: "border-color 0.15s",
};

const Label = ({ children }) => (
  <p style={{ fontSize: 9, fontWeight: 700, color: "#444", textTransform: "uppercase",
    letterSpacing: "0.08em", margin: "10px 0 3px" }}>{children}</p>
);

// ── Inline editable field ──────────────────────────────────────────────────
const F = ({ label, value, onChange, type = "text", options, placeholder }) => (
  <div>
    {label && <Label>{label}</Label>}
    {options ? (
      <select value={value ?? ""} onChange={e => onChange(e.target.value)}
        style={{ ...inp, cursor: "pointer" }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input type={type} value={value ?? ""} placeholder={placeholder || ""}
        onChange={e => onChange(e.target.value)} style={inp}
        onFocus={e => e.target.style.borderColor = "#8D45FE"}
        onBlur={e  => e.target.style.borderColor = "#1a1a2e"} />
    )}
  </div>
);

// ── Collapsible block ──────────────────────────────────────────────────────
const Block = ({ title, tag, tagColor = "#8D45FE", open: defaultOpen = true, children, right }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 6, borderRadius: 8, border: "1px solid #1a1a2e", overflow: "hidden" }}>
      <div onClick={() => setOpen(o => !o)} style={{
        padding: "8px 10px", background: "#0d0d22", display: "flex",
        alignItems: "center", gap: 7, cursor: "pointer", userSelect: "none",
      }}>
        {tag && (
          <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 5,
            background: `${tagColor}18`, color: tagColor, letterSpacing: "0.06em" }}>{tag}</span>
        )}
        <span style={{ color: "#d0d0e8", fontSize: 11, fontWeight: 600, flex: 1 }}>{title}</span>
        {right && <span style={{ color: "#444", fontSize: 10 }}>{right}</span>}
        <span style={{ color: "#333", fontSize: 9 }}>{open ? "▼" : "▶"}</span>
      </div>
      {open && <div style={{ padding: "8px 10px", background: "#08081a" }}>{children}</div>}
    </div>
  );
};

// ── Element type badge ─────────────────────────────────────────────────────
const TYPE = {
  video:     { c: "#06b6d4", l: "VID" },
  image:     { c: "#10b981", l: "IMG" },
  text:      { c: "#f59e0b", l: "TXT" },
  component: { c: "#8D45FE", l: "CMP" },
  shape:     { c: "#FD4FDA", l: "SHP" },
  overlay:   { c: "#64748b", l: "OVR" },
};

const TBadge = ({ type }) => {
  const t = TYPE[type] || { c: "#666", l: "EL" };
  return (
    <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 5,
      background: `${t.c}18`, color: t.c, letterSpacing: "0.06em" }}>{t.l}</span>
  );
};

// ── Dynamic field renderer — reads ANY key from JSON element ───────────────
// Shows only what exists in the element, no hardcoded assumptions
function ElementFields({ el, si, ei, updateEl }) {
  const set = (k, v) => updateEl(si, ei, k, v);
  const setNested = (k1, k2, v) => updateEl(si, ei, k1, { ...el[k1], [k2]: v });
  const setDeep   = (k1, k2, k3, v) => updateEl(si, ei, k1, {
    ...el[k1], [k2]: { ...el[k1]?.[k2], [k3]: v }
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>

      {/* src — video / image */}
      {"src" in el && <F label="Source URL" value={el.src} onChange={v => set("src", v)} />}

      {/* text */}
      {"text" in el && <F label="Text" value={el.text} onChange={v => set("text", v)} />}

      {/* color */}
      {"color" in el && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 36px", gap: 6, alignItems: "end" }}>
          <F label="Color" value={el.color} onChange={v => set("color", v)} />
          <input type="color" value={el.color || "#ffffff"}
            onChange={e => set("color", e.target.value)}
            style={{ width: 36, height: 28, border: "1px solid #1a1a2e", borderRadius: 6, background: "none", cursor: "pointer", marginTop: 13 }} />
        </div>
      )}

      {/* background */}
      {"background" in el && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 36px", gap: 6, alignItems: "end" }}>
          <F label="Background" value={el.background} onChange={v => set("background", v)} />
          <input type="color" value={el.background || "#000000"}
            onChange={e => set("background", e.target.value)}
            style={{ width: 36, height: 28, border: "1px solid #1a1a2e", borderRadius: 6, background: "none", cursor: "pointer", marginTop: 13 }} />
        </div>
      )}

      {/* fontSize / font-size */}
      {("fontSize" in el || "font-size" in el) && (
        <F label="Font Size" value={el.fontSize || el["font-size"]}
          onChange={v => { set("fontSize", v); set("font-size", v); }} />
      )}

      {/* fontFamily / font-family */}
      {("fontFamily" in el || "font-family" in el) && (
        <F label="Font Family" value={el.fontFamily || el["font-family"]}
          onChange={v => { set("fontFamily", v); set("font-family", v); }} />
      )}

      {/* fontWeight / font-weight */}
      {("fontWeight" in el || "font-weight" in el) && (
        <F label="Font Weight" value={el.fontWeight || el["font-weight"]}
          onChange={v => { set("fontWeight", v); set("font-weight", v); }} />
      )}

      {/* textShadow / text-shadow */}
      {("textShadow" in el || "text-shadow" in el) && (
        <F label="Text Shadow" value={el.textShadow || el["text-shadow"]}
          onChange={v => { set("textShadow", v); set("text-shadow", v); }} />
      )}

      {/* animation */}
      {"animation" in el && (
        <F label="Animation" value={el.animation} onChange={v => set("animation", v)}
          options={["fadeIn","fadeOut","slideUp","slideDown","slideLeft","slideRight",
            "zoomIn","zoomOut","bounceIn","elastic","flipX","flipY","rotateIn","blurIn","popIn","none"]} />
      )}

      {/* animation-duration */}
      {"animation-duration" in el && (
        <F label="Anim Duration (s)" value={el["animation-duration"]}
          onChange={v => set("animation-duration", parseFloat(v) || 0.5)} />
      )}

      {/* animation-delay */}
      {"animation-delay" in el && (
        <F label="Anim Delay (s)" value={el["animation-delay"]}
          onChange={v => set("animation-delay", parseFloat(v) || 0)} />
      )}

      {/* animation-easing */}
      {"animation-easing" in el && (
        <F label="Easing" value={el["animation-easing"]} onChange={v => set("animation-easing", v)}
          options={["easeOut","easeIn","easeInOut","linear","bounce","elastic","back"]} />
      )}

      {/* animation-exit */}
      {"animation-exit" in el && (
        <F label="Exit Animation" value={el["animation-exit"]} onChange={v => set("animation-exit", v)}
          options={["fadeOut","slideUp","slideDown","slideLeft","slideRight","zoomOut","none"]} />
      )}

      {/* position */}
      {"position" in el && (
        <F label="Position" value={el.position} onChange={v => set("position", v)}
          options={["custom","center","top","bottom"]} />
      )}

      {/* x / y */}
      {("x" in el || "y" in el) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {"x" in el && <F label="X" value={el.x} onChange={v => set("x", parseFloat(v))} />}
          {"y" in el && <F label="Y" value={el.y} onChange={v => set("y", parseFloat(v))} />}
        </div>
      )}

      {/* width / height */}
      {("width" in el || "height" in el) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {"width"  in el && <F label="W" value={el.width}  onChange={v => set("width",  v)} />}
          {"height" in el && <F label="H" value={el.height} onChange={v => set("height", v)} />}
        </div>
      )}

      {/* opacity */}
      {"opacity" in el && (
        <F label="Opacity (0–1)" value={el.opacity} onChange={v => set("opacity", parseFloat(v))} />
      )}

      {/* objectFit */}
      {"objectFit" in el && (
        <F label="Object Fit" value={el.objectFit} onChange={v => set("objectFit", v)}
          options={["cover","contain","fill","none"]} />
      )}

      {/* start / duration timing */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        <F label="Start (s)" value={el.start ?? ""}
          onChange={v => set("start", parseFloat(v) || 0)} />
        <F label="Duration (s)" value={el.duration ?? ""}
          onChange={v => set("duration", v === "" ? undefined : parseFloat(v))} />
      </div>

      {/* component → settings.animation */}
      {el.type === "component" && el.settings?.animation && (() => {
        const a = el.settings.animation;
        const sa = (k, v) => setDeep("settings", "animation", k, v);
        return (
          <div style={{ marginTop: 6, padding: "8px", borderRadius: 6, background: "#0d0d22", border: "1px solid #1a1a2e" }}>
            <p style={{ fontSize: 9, color: "#8D45FE", fontWeight: 800, margin: "0 0 6px", textTransform: "uppercase" }}>Animation Settings</p>
            {"text" in a && (
              <F label="Text" value={Array.isArray(a.text) ? a.text.join(", ") : a.text}
                onChange={v => sa("text", v.split(",").map(s => s.trim()))} />
            )}
            {"font-family" in a && <F label="Font Family" value={a["font-family"]} onChange={v => sa("font-family", v)} />}
            {"font-size"   in a && <F label="Font Size"   value={a["font-size"]}   onChange={v => sa("font-size", v)} />}
            {"font-weight" in a && <F label="Font Weight" value={a["font-weight"]} onChange={v => sa("font-weight", v)} />}
            {"color" in a && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 36px", gap: 6, alignItems: "end" }}>
                <F label="Color" value={a.color} onChange={v => sa("color", v)} />
                <input type="color" value={a.color || "#ffffff"} onChange={e => sa("color", e.target.value)}
                  style={{ width: 36, height: 28, border: "1px solid #1a1a2e", borderRadius: 6, background: "none", cursor: "pointer", marginTop: 13 }} />
              </div>
            )}
            {"text-shadow"     in a && <F label="Text Shadow"  value={a["text-shadow"]}     onChange={v => sa("text-shadow", v)} />}
            {"letter-spacing"  in a && <F label="Letter Spacing" value={a["letter-spacing"]}onChange={v => sa("letter-spacing", v)} />}
            {"line-height"     in a && <F label="Line Height"  value={a["line-height"]}     onChange={v => sa("line-height", v)} />}
            {"text-align"      in a && (
              <F label="Text Align" value={a["text-align"]} onChange={v => sa("text-align", v)}
                options={["left","center","right"]} />
            )}
            {"animation" in a && (
              <F label="Animation" value={a.animation} onChange={v => sa("animation", v)}
                options={["fadeIn","slideUp","slideDown","slideLeft","slideRight","zoomIn","zoomOut","bounceIn","none"]} />
            )}
            {"stagger" in a && <F label="Stagger (s)" value={a.stagger} onChange={v => sa("stagger", parseFloat(v))} />}
          </div>
        );
      })()}

      {/* component → settings.button */}
      {el.type === "component" && el.settings?.button && (() => {
        const b = el.settings.button;
        const sb = (k, v) => setDeep("settings", "button", k, v);
        return (
          <div style={{ marginTop: 6, padding: "8px", borderRadius: 6, background: "#0d0d22", border: "1px solid #1a1a2e" }}>
            <p style={{ fontSize: 9, color: "#FD4FDA", fontWeight: 800, margin: "0 0 6px", textTransform: "uppercase" }}>Button Settings</p>
            {"text" in b && (
              <F label="Text" value={Array.isArray(b.text) ? b.text.join(", ") : b.text}
                onChange={v => sb("text", v.split(",").map(s => s.trim()))} />
            )}
            {"background" in b && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 36px", gap: 6, alignItems: "end" }}>
                <F label="Background" value={b.background} onChange={v => sb("background", v)} />
                <input type="color" value={b.background || "#8D45FE"} onChange={e => sb("background", e.target.value)}
                  style={{ width: 36, height: 28, border: "1px solid #1a1a2e", borderRadius: 6, background: "none", cursor: "pointer", marginTop: 13 }} />
              </div>
            )}
            {"color"        in b && <F label="Text Color"  value={b.color}         onChange={v => sb("color", v)} />}
            {"font-size"    in b && <F label="Font Size"   value={b["font-size"]}  onChange={v => sb("font-size", v)} />}
            {"font-family"  in b && <F label="Font Family" value={b["font-family"]}onChange={v => sb("font-family", v)} />}
            {"font-weight"  in b && <F label="Font Weight" value={b["font-weight"]}onChange={v => sb("font-weight", v)} />}
            {"padding"      in b && <F label="Padding"     value={b.padding}       onChange={v => sb("padding", v)} />}
            {"border-radius"in b && <F label="Border Radius" value={b["border-radius"]} onChange={v => sb("border-radius", v)} />}
            {"border"       in b && <F label="Border"      value={b.border}        onChange={v => sb("border", v)} />}
            {"border-color" in b && <F label="Border Color" value={b["border-color"]} onChange={v => sb("border-color", v)} />}
            {"box-shadow"   in b && <F label="Box Shadow"  value={b["box-shadow"]} onChange={v => sb("box-shadow", v)} />}
            {"text-shadow"  in b && <F label="Text Shadow" value={b["text-shadow"]}onChange={v => sb("text-shadow", v)} />}
            {"letter-spacing" in b && <F label="Letter Spacing" value={b["letter-spacing"]} onChange={v => sb("letter-spacing", v)} />}
            {"align"        in b && (
              <F label="Align" value={b.align} onChange={v => sb("align", v)}
                options={["left","center","right"]} />
            )}
          </div>
        );
      })()}
    </div>
  );
}

// ── Right Panel ────────────────────────────────────────────────────────────
function RightPanel({ json, templateId, updateJson, updateEl, showToast }) {
  const [tab, setTab] = useState("scenes");
  const scenes = json.scenes || [];

  // Derive only the movie-level keys that actually exist in JSON
  const movieKeys = Object.keys(json).filter(k => k !== "scenes" && k !== "music");

  return (
    <div style={{ width: "50%", background: "#06060f", borderLeft: "1px solid #111122",
      display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "1px solid #111122", flexShrink: 0, background: "#08081a" }}>
        {[
          { id: "scenes",  label: `Scenes` },
          { id: "general", label: "Settings" },
          { id: "json",    label: "JSON" },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, padding: "10px 0", background: "none", border: "none",
            borderBottom: tab === id ? "2px solid #8D45FE" : "2px solid transparent",
            color: tab === id ? "#a78bfa" : "#444", fontSize: 12,
            fontWeight: tab === id ? 700 : 500, cursor: "pointer",
          }}>{label}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>

        {/* ── Scenes tab ── */}
        {tab === "scenes" && (
          <>
            {scenes.length === 0 && (
              <div style={{ textAlign: "center", padding: 32, color: "#333", fontSize: 12 }}>
                No scenes yet — add scenes in the JSON tab.
              </div>
            )}
            {scenes.map((scene, si) => (
              <Block
                key={scene.id || si}
                title={scene.comment || `Scene ${si + 1}`}
                tag={`${scene.duration || 5}s`}
                tagColor="#06b6d4"
                open={si === 0}
                right={`${scene.elements?.length || 0} elements`}
              >
                {/* Scene background color — only if it exists */}
                {"background" in scene && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 36px", gap: 6, alignItems: "end", marginBottom: 8 }}>
                    <F label="Background" value={scene.background}
                      onChange={v => {
                        const j = JSON.parse(JSON.stringify(json));
                        j.scenes[si].background = v;
                        updateJson("scenes", j.scenes);
                      }} />
                    <input type="color" value={scene.background || "#000000"}
                      onChange={e => {
                        const j = JSON.parse(JSON.stringify(json));
                        j.scenes[si].background = e.target.value;
                        updateJson("scenes", j.scenes);
                      }}
                      style={{ width: 36, height: 28, border: "1px solid #1a1a2e", borderRadius: 6, background: "none", cursor: "pointer", marginTop: 13 }} />
                  </div>
                )}

                {"duration" in scene && (
                  <div style={{ marginBottom: 8 }}>
                    <F label="Duration (s)" value={scene.duration}
                      onChange={v => {
                        const j = JSON.parse(JSON.stringify(json));
                        j.scenes[si].duration = parseFloat(v) || 5;
                        updateJson("scenes", j.scenes);
                      }} />
                  </div>
                )}

                {/* Elements */}
                {(scene.elements || []).map((el, ei) => (
                  <div key={el.id || ei} style={{ marginBottom: 6, borderRadius: 7,
                    border: "1px solid #111122", overflow: "hidden" }}>
                    <div style={{ padding: "7px 9px", background: "#0d0d22",
                      display: "flex", alignItems: "center", gap: 7 }}>
                      <TBadge type={el.type} />
                      <span style={{ color: "#c0c0d8", fontSize: 11, fontWeight: 600, flex: 1 }}>
                        {el.comment || el.id || el.type}
                      </span>
                      {el.start !== undefined && (
                        <span style={{ color: "#333", fontSize: 10 }}>@{el.start}s</span>
                      )}
                    </div>
                    <div style={{ padding: "8px 9px", background: "#08081a" }}>
                      <ElementFields el={el} si={si} ei={ei} updateEl={updateEl} />
                    </div>
                  </div>
                ))}
              </Block>
            ))}
          </>
        )}

        {/* ── Settings tab — only shows keys that exist in JSON ── */}
        {tab === "general" && (
          <>
            <Block title="Movie Settings" tag="MOVIE" open>
              {movieKeys.map(k => {
                const v = json[k];
                if (typeof v === "object") return null; // skip nested
                const isSelect = k === "resolution" || k === "quality";
                return (
                  <F
                    key={k}
                    label={k}
                    value={v}
                    onChange={nv => updateJson(k, nv)}
                    options={
                      k === "resolution"
                        ? ["full-hd","hd","sd","4k","vertical-hd","square"]
                        : k === "quality"
                        ? ["low","medium","high"]
                        : undefined
                    }
                  />
                );
              })}
            </Block>

            <Block title="Template ID" tag="ID" tagColor="#444" open={false}>
              <div style={{ display: "flex", gap: 6 }}>
                <input readOnly value={templateId}
                  style={{ ...inp, flex: 1, color: "#444", fontSize: 10, fontFamily: "monospace" }} />
                <button
                  onClick={() => { navigator.clipboard?.writeText(templateId); showToast("Copied!"); }}
                  style={{ background: "#0d0d22", border: "1px solid #1a1a2e", borderRadius: 6,
                    padding: "5px 9px", cursor: "pointer", color: "#666", fontSize: 11 }}>
                  📋
                </button>
              </div>
            </Block>
          </>
        )}

        {/* ── JSON tab ── */}
        {tab === "json" && (
          <div style={{ height: "calc(100vh - 200px)" }}>
            <textarea
              readOnly
              value={JSON.stringify(json, null, 2)}
              style={{
                width: "100%", height: "100%", fontSize: 11,
                fontFamily: "'Fira Code','Consolas',monospace",
                color: "#6060a0", background: "#05050e",
                border: "1px solid #111122", borderRadius: 8,
                padding: 12, resize: "none", outline: "none",
                lineHeight: 1.6, boxSizing: "border-box",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function TemplateEditor() {
  const { templateId } = useParams();
  const navigate       = useNavigate();

  const [template,       setTemplate]       = useState(null);
  const [saveStatus,     setSaveStatus]     = useState("saved");
  const [toast,          setToast]          = useState(null);
  const [previewVideo,   setPreviewVideo]   = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError,   setPreviewError]   = useState(null);
  const [isPlaying,      setIsPlaying]      = useState(false);

  const videoRef    = useRef(null);
  const debounceRef = useRef(null);
  const latestJson  = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    (async () => {
      try {
        const res  = await getTemplateById(templateId);
        const tmpl = res.data?.template || res.template || res.data;
        setTemplate(tmpl);
        latestJson.current = tmpl.json || {};
      } catch {
        showToast("Failed to load template", "error");
      }
    })();
  }, [templateId]);

  const triggerAutoSave = useCallback((newJson, name) => {
    setSaveStatus("unsaved");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        await updateTemplate(templateId, { name, json: newJson });
        setSaveStatus("saved");
      } catch { setSaveStatus("error"); }
    }, 1000);
  }, [templateId]);

  // Update a top-level JSON key
  const updateJson = (key, value) => {
    setTemplate(prev => {
      const newJson = { ...prev.json, [key]: value };
      latestJson.current = newJson;
      triggerAutoSave(newJson, prev.name);
      return { ...prev, json: newJson };
    });
  };

  // Update a scene element field (any depth)
  const updateEl = (si, ei, key, value) => {
    setTemplate(prev => {
      const newJson = JSON.parse(JSON.stringify(prev.json));
      if (value === undefined) {
        delete newJson.scenes[si].elements[ei][key];
      } else {
        newJson.scenes[si].elements[ei][key] = value;
      }
      latestJson.current = newJson;
      triggerAutoSave(newJson, prev.name);
      return { ...prev, json: newJson };
    });
  };

  const updateName = name => {
    setTemplate(prev => {
      triggerAutoSave(prev.json, name);
      return { ...prev, name };
    });
  };

  const handleManualSave = async () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveStatus("saving");
    try {
      await updateTemplate(templateId, { name: template.name, json: latestJson.current });
      setSaveStatus("saved");
      showToast("Saved ✓");
    } catch {
      setSaveStatus("error");
      showToast("Save failed", "error");
    }
  };

  const handleRender = async () => {
    setPreviewLoading(true);
    setPreviewVideo(null);
    setPreviewError(null);
    setIsPlaying(false);
    try {
      const res  = await renderTemplate(templateId, latestJson.current);
      const data = res.data || res;
      if (!data.success) throw new Error(data.message || "Render failed");
      setPreviewVideo(`${BASE}${data.videoUrl}`);
      setIsPlaying(true);
    } catch (err) {
      setPreviewError(err.message || "Render failed");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (!previewVideo) { handleRender(); return; }
    if (videoRef.current) {
      if (isPlaying) { videoRef.current.pause(); setIsPlaying(false); }
      else           { videoRef.current.play();  setIsPlaying(true);  }
    }
  };

  const json = template?.json || {};
  const vidW = Number(json.width)  || 1080;
  const vidH = Number(json.height) || 1080;

  const SC = { saved: "#22c55e", saving: "#f59e0b", unsaved: "#f59e0b", error: "#ef4444" };
  const ST = { saved: "Saved", saving: "Saving…", unsaved: "Unsaved", error: "Error" };

  if (!template) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
      height: "100vh", background: "#05050e", color: "#444", fontFamily: "sans-serif" }}>
      Loading…
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh",
      fontFamily: "'Inter','Segoe UI',sans-serif", background: "#05050e", color: "#e0e0f0" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999,
          background: toast.type === "error" ? "#ef4444" : "#8D45FE",
          color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 12,
          fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
          {toast.msg}
        </div>
      )}

      {/* ── Navbar ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", height: 48, background: "#07071a",
        borderBottom: "1px solid #111122", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => navigate("/templates")}
            style={{ background: "none", border: "none", color: "#555", fontSize: 16, cursor: "pointer" }}>←</button>
          <span style={{ fontSize: 10, color: "#333", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Template</span>
          <input value={template.name} onChange={e => updateName(e.target.value)}
            style={{ background: "none", border: "none", color: "#d0d0e8", fontSize: 14,
              fontWeight: 600, outline: "none", minWidth: 140 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: SC[saveStatus] }} />
            <span style={{ fontSize: 11, color: SC[saveStatus], fontWeight: 600 }}>{ST[saveStatus]}</span>
          </div>
          <button onClick={handleManualSave}
            style={{ padding: "5px 12px", borderRadius: 7, background: "#0d0d22",
              border: "1px solid #1a1a2e", color: "#a0a0c0", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
            💾 Save
          </button>
          <button onClick={handleRender} disabled={previewLoading}
            style={{ padding: "5px 14px", borderRadius: 7,
              background: previewLoading ? "#1a1a2e" : "linear-gradient(90deg,#8D45FE,#FD4FDA)",
              border: "none", color: "#fff", fontSize: 11, fontWeight: 700,
              cursor: previewLoading ? "not-allowed" : "pointer" }}>
            {previewLoading ? "⏳ Rendering…" : "▶ Render"}
          </button>
        </div>
      </div>

      {/* ── Body: 50/50 ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* LEFT — video preview */}
        <div style={{ width: "50%", display: "flex", flexDirection: "column",
          background: "#05050e", borderRight: "1px solid #111122", overflow: "hidden" }}>

          {/* Canvas */}
          <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center",
            justifyContent: "center", padding: 20 }}>
            <div style={{
              position: "relative",
              width: `min(100%, calc((100vh - 160px) * ${vidW / vidH}))`,
              aspectRatio: `${vidW} / ${vidH}`,
              borderRadius: 12, overflow: "hidden",
              border: "1px solid #1a1a2e",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "#0a0a18",
              boxShadow: "0 0 40px rgba(141,69,254,0.08)",
            }}>
              {previewLoading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, border: "3px solid #8D45FE",
                    borderTop: "3px solid transparent", borderRadius: "50%",
                    animation: "spin 0.8s linear infinite" }} />
                  <span style={{ color: "#555", fontSize: 12 }}>Rendering…</span>
                  <span style={{ color: "#333", fontSize: 10 }}>20–60 seconds</span>
                </div>
              ) : previewError ? (
                <div style={{ textAlign: "center", padding: 20 }}>
                  <p style={{ color: "#f87171", fontSize: 12, marginBottom: 10 }}>⚠️ {previewError}</p>
                  <button onClick={handleRender}
                    style={{ padding: "7px 16px", borderRadius: 7,
                      background: "linear-gradient(90deg,#8D45FE,#FD4FDA)",
                      border: "none", color: "#fff", fontSize: 11, cursor: "pointer" }}>
                    Try Again
                  </button>
                </div>
              ) : previewVideo ? (
                <video ref={videoRef} src={previewVideo} autoPlay
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  style={{ position: "absolute", top: 0, left: 0,
                    width: "100%", height: "100%", objectFit: "fill" }} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 60, height: 60, borderRadius: "50%",
                    background: "rgba(141,69,254,0.08)", border: "1px solid rgba(141,69,254,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🎬</div>
                  <span style={{ color: "#333", fontSize: 12 }}>Click Render to preview</span>
                  <button onClick={handleRender}
                    style={{ padding: "9px 24px", borderRadius: 9,
                      background: "linear-gradient(90deg,#8D45FE,#FD4FDA)",
                      border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    ▶ Render Preview
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div style={{ padding: "8px 16px", borderTop: "1px solid #111122",
            display: "flex", alignItems: "center", gap: 10, flexShrink: 0, background: "#07071a" }}>
            <button onClick={handlePlayPause} disabled={previewLoading}
              style={{ width: 32, height: 32, borderRadius: "50%",
                background: previewLoading ? "#1a1a2e" : "linear-gradient(135deg,#8D45FE,#FD4FDA)",
                border: "none", cursor: previewLoading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {previewLoading
                ? <div style={{ width: 12, height: 12, border: "2px solid #fff",
                    borderTop: "2px solid transparent", borderRadius: "50%",
                    animation: "spin 0.8s linear infinite" }} />
                : isPlaying
                  ? <svg width="12" height="12" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" fill="white"/><rect x="14" y="4" width="4" height="16" fill="white"/></svg>
                  : <svg width="12" height="12" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" fill="white"/></svg>
              }
            </button>

            <div style={{ flex: 1, height: 3, background: "#111122", borderRadius: 2, overflow: "hidden" }}>
              {previewLoading && (
                <div style={{ height: "100%", width: "60%",
                  background: "linear-gradient(90deg,#8D45FE,#FD4FDA)",
                  animation: "progress 2s ease-in-out infinite" }} />
              )}
              {previewVideo && !previewLoading && (
                <div style={{ height: "100%", width: "100%",
                  background: "linear-gradient(90deg,#8D45FE,#FD4FDA)" }} />
              )}
            </div>

            <span style={{ fontSize: 10, color: "#333", flexShrink: 0 }}>
              {previewLoading ? "Rendering…" : previewVideo ? (isPlaying ? "Playing" : "Paused") : "—"}
            </span>

            {previewVideo && !previewLoading && (
              <>
                <button onClick={handleRender}
                  style={{ padding: "4px 10px", borderRadius: 6, background: "#0d0d22",
                    border: "1px solid #1a1a2e", color: "#666", fontSize: 10, cursor: "pointer", flexShrink: 0 }}>
                  🔄 Re-render
                </button>
                <a href={previewVideo} download
                  style={{ padding: "4px 12px", borderRadius: 6,
                    background: "linear-gradient(90deg,#8D45FE,#FD4FDA)",
                    color: "#fff", fontSize: 10, fontWeight: 700,
                    textDecoration: "none", flexShrink: 0 }}>
                  ⬇ Download
                </a>
              </>
            )}
          </div>
        </div>

        {/* RIGHT — fields panel */}
        <RightPanel
          json={json}
          templateId={templateId}
          updateJson={updateJson}
          updateEl={updateEl}
          showToast={showToast}
        />
      </div>

      <style>{`
        @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes progress { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #05050e; }
        ::-webkit-scrollbar-thumb { background: #1a1a2e; border-radius: 2px; }
      `}</style>
    </div>
  );
}