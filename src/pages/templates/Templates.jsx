// src/pages/templates/Templates.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { createTemplate, getMyTemplates, deleteTemplate } from "../../api/templateApi";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins  <  1) return "just now";
  if (mins  < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function ContextMenu({ x, y, onClose, onEditLayout, onCopyId, onDelete }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const menuW = 210;
  const menuH = 180;
  const left  = Math.min(x, window.innerWidth  - menuW - 8);
  const top   = Math.min(y, window.innerHeight - menuH - 8);

  const items = [
    { icon: "✏️", label: "Edit template layout", action: onEditLayout },
    { icon: "📋", label: "Copy template ID",      action: onCopyId     },
    { icon: "🗑️", label: "Delete template",       action: onDelete, danger: true },
  ];

  return createPortal(
    <div
      ref={ref}
      style={{
        position:  "fixed", top, left,
        background: "#0D1240",
        border:     "1px solid #1e2350",
        borderRadius: 10,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        zIndex: 99999, minWidth: menuW,
        padding: "6px 0",
        fontFamily: "'Inter','Segoe UI',sans-serif",
      }}
    >
      {items.map(({ icon, label, action, danger }) => (
        <button
          key={label}
          onClick={() => { action?.(); onClose(); }}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            width: "100%", padding: "10px 18px",
            background: "none", border: "none",
            color: danger ? "#f87171" : "#e2e8f0",
            fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "left",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(141,69,254,0.12)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "none"}
        >
          <span>{icon}</span>{label}
        </button>
      ))}
    </div>,
    document.body
  );
}

export default function Templates() {
  const navigate = useNavigate();

  const [templates,    setTemplates]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [creating,     setCreating]     = useState(false);
  const [menu,         setMenu]         = useState(null);
  const [notification, setNotification] = useState(null);

  const showToast = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 2500);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMyTemplates();
        setTemplates(data.templates || []);
      } catch {
        showToast("Failed to load templates", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const { data } = await createTemplate();
      setTemplates((prev) => [data.template, ...prev]);
      navigate(`/templates/editor/${data.template.templateId}`);
    } catch {
      showToast("Failed to create template", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (templateId) => {
    try {
      await deleteTemplate(templateId);
      setTemplates((prev) => prev.filter((t) => t.templateId !== templateId));
      showToast("Template deleted");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type  = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const json = JSON.parse(ev.target.result);
          const { data } = await createTemplate();
          showToast(`Template "${data.template.name}" imported!`);
          setTemplates((prev) => [data.template, ...prev]);
        } catch {
          showToast("Invalid JSON file", "error");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const openMenu = (e, template) => {
    e.preventDefault();
    e.stopPropagation();
    setMenu({ x: e.clientX, y: e.clientY, template });
  };

  return (
    <div style={{ minHeight: "100vh", padding: "32px 40px", fontFamily: "'Inter','Segoe UI',sans-serif", background: "transparent" }}>

      {/* Toast */}
      {notification && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 99998, background: notification.type === "error" ? "#ef4444" : "#8D45FE", color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
          {notification.msg}
        </div>
      )}

      {/* Context menu */}
      {menu && (
        <ContextMenu
          x={menu.x} y={menu.y}
          onClose={() => setMenu(null)}
          onEditLayout={() => navigate(`/templates/editor/${menu.template.templateId}`)}
          onCopyId={() => { navigator.clipboard?.writeText(menu.template.templateId); showToast(`Copied: ${menu.template.templateId}`); }}
          onDelete={() => handleDelete(menu.template.templateId)}
        />
      )}

      {/* Header */}
      <h1 style={{ color: "#ffffff", fontSize: 28, fontWeight: 800, margin: 0 }}>Templates</h1>
      <p style={{ color: "#9191A8", fontSize: 14, marginTop: 8, lineHeight: 1.6, maxWidth: 680 }}>
        Store your movie JSONs as templates and use them in your video projects by referencing their ID.
        Combined with variables, you can easily create custom video projects.
      </p>

      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16, marginBottom: 24 }}>
        <button
          onClick={handleImport}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "#0D1240", border: "1px solid #1e2350", color: "#e2e8f0" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#1a1a3e"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#0D1240"}
        >
          ⬇ Import template
        </button>
        <button
          onClick={handleCreate}
          disabled={creating}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: creating ? "not-allowed" : "pointer", background: creating ? "#6b21a8" : "linear-gradient(90deg,#8D45FE,#FD4FDA)", border: "none", color: "#fff", opacity: creating ? 0.7 : 1 }}
        >
          {creating ? "Creating…" : "+ Add new template"}
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "#07091F", borderRadius: 14, border: "1px solid #1e1e2e", overflow: "hidden" }}>

        {/* Header row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 200px 48px", padding: "12px 20px", borderBottom: "1px solid #1e1e2e", background: "#0A0A1A" }}>
          {["TEMPLATE NAME", "TAGS", "LAST EDIT", ""].map((h, i) => (
            <span key={i} style={{ color: "#555", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</span>
          ))}
        </div>

        {loading && (
          <div style={{ padding: 32, textAlign: "center", color: "#9191A8", fontSize: 13 }}>Loading templates…</div>
        )}

        {!loading && templates.length === 0 && (
          <div style={{ padding: 48, textAlign: "center" }}>
            <p style={{ color: "#9191A8", fontSize: 14, margin: 0 }}>No templates yet.</p>
            <p style={{ color: "#555", fontSize: 13, margin: "6px 0 16px" }}>Click <strong style={{ color: "#8D45FE" }}>+ Add new template</strong> to get started.</p>
            <button
              onClick={handleCreate}
              style={{ padding: "10px 24px", borderRadius: 10, background: "linear-gradient(90deg,#8D45FE,#FD4FDA)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              + Add new template
            </button>
          </div>
        )}

        {templates.map((t, idx) => (
          <div
            key={t.templateId}
            style={{
              display: "grid", gridTemplateColumns: "1fr 180px 200px 48px",
              padding: "16px 20px", alignItems: "center",
              borderBottom: idx < templates.length - 1 ? "1px solid #0e0e1e" : "none",
              cursor: "pointer", transition: "background 0.12s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(141,69,254,0.05)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            onClick={() => navigate(`/templates/editor/${t.templateId}`)}
          >
            {/* Name */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(141,69,254,0.15)", border: "1px solid rgba(141,69,254,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="3" fill="#8D45FE" opacity="0.3"/>
                  <rect x="6" y="7"  width="12" height="2" rx="1" fill="#8D45FE"/>
                  <rect x="6" y="11" width="8"  height="2" rx="1" fill="#8D45FE"/>
                  <rect x="6" y="15" width="10" height="2" rx="1" fill="#8D45FE"/>
                </svg>
              </div>
              <div>
                <p style={{ color: "#ffffff", fontSize: 13, fontWeight: 600, margin: 0 }}>{t.name}</p>
                <p style={{ color: "#555", fontSize: 11, margin: "2px 0 0", fontFamily: "monospace" }}>ID: {t.templateId}</p>
              </div>
            </div>

            {/* Tags */}
            <div>
              {t.tags?.length > 0 ? t.tags.map((tag) => (
                <span key={tag} style={{ padding: "2px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: "rgba(141,69,254,0.15)", color: "#a78bfa", border: "1px solid rgba(141,69,254,0.3)" }}>{tag}</span>
              )) : (
                <span style={{ color: "#555", fontSize: 12 }}>No tags</span>
              )}
            </div>

            {/* Last edit */}
            <span style={{ color: "#9191A8", fontSize: 13 }}>{timeAgo(t.updatedAt)}</span>

            {/* Kebab */}
            <button
              onClick={(e) => openMenu(e, t)}
              style={{ width: 32, height: 32, borderRadius: 6, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#555" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(141,69,254,0.15)"; e.currentTarget.style.color = "#a78bfa"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#555"; }}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5"  r="1.5"/>
                <circle cx="12" cy="12" r="1.5"/>
                <circle cx="12" cy="19" r="1.5"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}