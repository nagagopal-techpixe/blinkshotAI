import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { getGlobalTemplates, createFromGlobal } from "../../api/templateApi";

function timeAgo(dateStr) {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins  <  1) return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── Preview Drawer ─────────────────────────────────────────────────────────
function PreviewDrawer({ template, onClose, onUse, using }) {
  const json   = template?.json || {};
  const scenes = json.scenes || [];
  const dims   = json.width && json.height ? `${json.width} × ${json.height}px` : null;

  const TYPE_COLOR = {
    video: "#06b6d4", image: "#10b981", text: "#f59e0b",
    component: "#8D45FE", shape: "#FD4FDA", overlay: "#64748b",
  };
  const TYPE_LABEL = {
    video: "VID", image: "IMG", text: "TXT",
    component: "CMP", shape: "SHP", overlay: "OVR",
  };

  return createPortal(
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 99990,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
        display: "flex", justifyContent: "flex-end",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: 440, height: "100%", background: "#09091e",
        borderLeft: "1px solid #1e1e2e", display: "flex", flexDirection: "column",
        fontFamily: "'Inter','Segoe UI',sans-serif",
        animation: "drawerIn 0.22s ease",
      }}>

        {/* Header */}
        <div style={{ padding: "18px 20px 16px", borderBottom: "1px solid #1e1e2e", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 10, flexShrink: 0, overflow: "hidden",
                background: "rgba(141,69,254,0.15)", border: "1px solid rgba(141,69,254,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {template.thumbnail
                  ? <img src={template.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ fontSize: 20 }}>🎬</span>
                }
              </div>
              <div>
                <h2 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{template.name}</h2>
                {template.category && (
                  <span style={{ fontSize: 10, color: "#8D45FE", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    {template.category}
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "#444", fontSize: 22, cursor: "pointer", lineHeight: 1, flexShrink: 0, marginTop: -2 }}>×</button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>

          {/* Thumbnail preview */}
          <div style={{
            width: "100%",
            aspectRatio: json.width && json.height ? `${json.width}/${json.height}` : "9/16",
            maxHeight: 260, borderRadius: 12, overflow: "hidden", marginBottom: 18,
            background: "#0d0d22", border: "1px solid #1e1e2e",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {template.thumbnail
              ? <img src={template.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>🎬</div>
                  <p style={{ color: "#333", fontSize: 12, margin: 0 }}>No preview image</p>
                </div>
              )
            }
          </div>

          {/* Meta grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
            {[
              { label: "Resolution", value: json.resolution || "—" },
              { label: "Dimensions", value: dims || "—" },
              { label: "FPS",        value: json.fps ? `${json.fps} fps` : "—" },
              { label: "Quality",    value: json.quality || "—" },
              { label: "Scenes",     value: scenes.length || 0 },
              { label: "Updated",    value: timeAgo(template.updatedAt || template.createdAt) },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: "#0d0d22", borderRadius: 8, padding: "9px 12px", border: "1px solid #1e1e2e" }}>
                <p style={{ color: "#444", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 3px" }}>{label}</p>
                <p style={{ color: "#a78bfa", fontSize: 13, fontWeight: 600, margin: 0 }}>{String(value)}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {template.description && (
            <div style={{ marginBottom: 18 }}>
              <p style={{ color: "#444", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 6px" }}>About</p>
              <p style={{ color: "#9191A8", fontSize: 13, lineHeight: 1.65, margin: 0 }}>{template.description}</p>
            </div>
          )}

          {/* Tags */}
          {template.tags?.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <p style={{ color: "#444", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 8px" }}>Tags</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {template.tags.map(tag => (
                  <span key={tag} style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: "rgba(141,69,254,0.12)", color: "#a78bfa", border: "1px solid rgba(141,69,254,0.25)" }}>{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Scenes breakdown */}
          {scenes.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <p style={{ color: "#444", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 8px" }}>
                Scenes ({scenes.length})
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {scenes.map((s, i) => (
                  <div key={i} style={{ borderRadius: 8, border: "1px solid #1e1e2e", background: "#0d0d22", overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px" }}>
                      <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 4, background: "rgba(6,182,212,0.12)", color: "#06b6d4", flexShrink: 0 }}>
                        {s.duration || 5}s
                      </span>
                      <span style={{ color: "#c0c0d8", fontSize: 12, flex: 1 }}>{s.comment || `Scene ${i + 1}`}</span>
                      <span style={{ color: "#333", fontSize: 11, flexShrink: 0 }}>{s.elements?.length || 0} el</span>
                    </div>
                    {s.elements?.length > 0 && (
                      <div style={{ padding: "0 12px 8px", display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {s.elements.map((el, ei) => {
                          const c = TYPE_COLOR[el.type] || "#555";
                          const l = TYPE_LABEL[el.type] || "EL";
                          return (
                            <span key={ei} style={{ fontSize: 9, fontWeight: 800, padding: "1px 6px", borderRadius: 4, background: `${c}18`, color: c }}>
                              {l}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div style={{ padding: "14px 16px", borderTop: "1px solid #1e1e2e", flexShrink: 0, background: "#07071a" }}>
          <button
            onClick={() => onUse(template)}
            disabled={using}
            style={{
              width: "100%", padding: "13px 0", borderRadius: 10, border: "none",
              background: using ? "#4c1d95" : "linear-gradient(90deg,#8D45FE,#FD4FDA)",
              color: "#fff", fontSize: 14, fontWeight: 700,
              cursor: using ? "not-allowed" : "pointer",
              opacity: using ? 0.8 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {using ? "Adding to your library…" : "✚ Use This Template"}
          </button>
          <p style={{ color: "#333", fontSize: 11, textAlign: "center", margin: "8px 0 0" }}>
            A personal copy is created — your edits won't affect the original.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Template Card ──────────────────────────────────────────────────────────
function TemplateCard({ t, onClick }) {
  const [hover, setHover] = useState(false);
  const json   = t.json || {};
  const scenes = json.scenes?.length || 0;

  return (
    <div
      onClick={() => onClick(t)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "rgba(141,69,254,0.04)" : "#07091F",
        border: `1px solid ${hover ? "rgba(141,69,254,0.45)" : "#1e1e2e"}`,
        borderRadius: 12, cursor: "pointer", overflow: "hidden",
        transition: "border-color 0.15s, background 0.15s",
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: "100%",
        aspectRatio: json.width && json.height ? `${json.width}/${json.height}` : "9/16",
        maxHeight: 200, background: "#0d0d22",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}>
        {t.thumbnail
          ? <img src={t.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 34, opacity: 0.4 }}>🎬</div>
            </div>
          )
        }
        {hover && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(141,69,254,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              color: "#fff", fontSize: 12, fontWeight: 700,
              background: "rgba(0,0,0,0.55)", padding: "5px 14px", borderRadius: 20,
            }}>Preview →</span>
          </div>
        )}
        {json.resolution && (
          <span style={{
            position: "absolute", top: 8, left: 8,
            fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 5,
            background: "rgba(6,182,212,0.85)", color: "#fff", letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}>{json.resolution}</span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px 14px" }}>
        <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: "0 0 5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {t.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: t.tags?.length ? 8 : 0 }}>
          {scenes > 0 && (
            <span style={{ fontSize: 11, color: "#555" }}>{scenes} scene{scenes !== 1 ? "s" : ""}</span>
          )}
          {json.fps && (
            <span style={{ fontSize: 11, color: "#555" }}>{json.fps} fps</span>
          )}
        </div>
        {t.tags?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {t.tags.slice(0, 3).map(tag => (
              <span key={tag} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: "rgba(141,69,254,0.12)", color: "#a78bfa" }}>{tag}</span>
            ))}
            {t.tags.length > 3 && (
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: "#1e1e2e", color: "#444" }}>+{t.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function GlobalTemplates() {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [preview,   setPreview]   = useState(null);
  const [using,     setUsing]     = useState(false);
  const [search,    setSearch]    = useState("");
  const [category,  setCategory]  = useState("all");
  const [toast,     setToast]     = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const params = {};
        if (search)            params.search   = search;
        if (category !== "all") params.category = category;
        const { data } = await getGlobalTemplates(params);
        setTemplates(data.templates || []);
      } catch {
        showToast("Failed to load templates", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [search, category]);

  const handleUse = async (globalTemplate) => {
    setUsing(true);
    try {
      const { data } = await createFromGlobal(globalTemplate.templateId);
      const newTemplate = data.template;
      setPreview(null);
      showToast(`"${globalTemplate.name}" added to your library!`);
      navigate(`/templates/editor/${newTemplate.templateId}`);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to add template", "error");
    } finally {
      setUsing(false);
    }
  };

  const categories = ["all", ...Array.from(new Set(templates.map(t => t.category).filter(Boolean)))];

  const filtered = templates.filter(t => {
    const matchSearch   = !search   || t.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || t.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div style={{ minHeight: "100vh", padding: "32px 40px", fontFamily: "'Inter','Segoe UI',sans-serif", background: "transparent" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 99998,
          background: toast.type === "error" ? "#ef4444" : "#8D45FE",
          color: "#fff", padding: "10px 20px", borderRadius: 8,
          fontSize: 13, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}>
          {toast.msg}
        </div>
      )}

      {/* Preview drawer */}
      {preview && (
        <PreviewDrawer
          template={preview}
          onClose={() => setPreview(null)}
          onUse={handleUse}
          using={using}
        />
      )}

      {/* Page header */}
      <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, margin: 0 }}>Global Templates</h1>
      <p style={{ color: "#9191A8", fontSize: 14, marginTop: 8, lineHeight: 1.6, maxWidth: 680 }}>
        Browse ready-made templates. Click any template to preview it, then use it to create your own personal copy to edit freely.
      </p>

      {/* Search + filter bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24, marginBottom: 28 }}>

        {/* Search */}
        <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search templates…"
            style={{
              width: "100%", padding: "9px 12px 9px 36px", borderRadius: 8, fontSize: 13,
              background: "#07091F", border: "1px solid #1e1e2e", color: "#e2e8f0",
              outline: "none", fontFamily: "inherit", boxSizing: "border-box",
            }}
            onFocus={e => e.target.style.borderColor = "#8D45FE"}
            onBlur={e  => e.target.style.borderColor = "#1e1e2e"}
          />
          <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#444", fontSize: 14, pointerEvents: "none" }}>🔍</span>
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
             style={{
  padding: "7px 16px",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  textTransform: cat === "all" ? "none" : "capitalize",
  background: category === cat
    ? "linear-gradient(90deg,#8D45FE,#FD4FDA)"
    : "#07091F",
  color: category === cat ? "#fff" : "#555",
  border: category === cat
    ? "none"
    : "1px solid #1e1e2e",
  transition: "all 0.15s",
}}
            >{cat === "all" ? "All" : cat}</button>
          ))}
        </div>

        {/* Count */}
        <span style={{ color: "#333", fontSize: 12, marginLeft: "auto", flexShrink: 0 }}>
          {loading ? "" : `${filtered.length} template${filtered.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80, gap: 16 }}>
          <div style={{ width: 36, height: 36, border: "3px solid #8D45FE", borderTop: "3px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <span style={{ color: "#444", fontSize: 13 }}>Loading templates…</span>
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div style={{ padding: 80, textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>📭</div>
          <p style={{ color: "#9191A8", fontSize: 15, fontWeight: 600, margin: "0 0 6px" }}>
            {search || category !== "all" ? "No templates match your filters" : "No global templates yet"}
          </p>
          <p style={{ color: "#444", fontSize: 13, margin: 0 }}>
            {search || category !== "all" ? "Try clearing your search or changing the category." : "Check back later — templates will appear here once published."}
          </p>
          {(search || category !== "all") && (
            <button
              onClick={() => { setSearch(""); setCategory("all"); }}
              style={{ marginTop: 20, padding: "9px 22px", borderRadius: 8, background: "#07091F", border: "1px solid #1e1e2e", color: "#e2e8f0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >Clear filters</button>
          )}
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 16 }}>
          {filtered.map(t => (
            <TemplateCard key={t.templateId} t={t} onClick={setPreview} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin     { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes drawerIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #05050e; }
        ::-webkit-scrollbar-thumb { background: #1a1a2e; border-radius: 2px; }
      `}</style>
    </div>
  );
}