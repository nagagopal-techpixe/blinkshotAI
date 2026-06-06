import { useState, useEffect } from "react";
import LanguageSettings from "./LanguageSettings.jsx";
import UploadQualitySettings from "./UploadQualitySettings.jsx";
import AutoBackupSettings from "./AutoBackupSettings.jsx";
import SocialIntegrationsSettings from "./SocialIntegrationsSettings.jsx";
import ExportDefaultsSettings from "./ExportDefaultsSettings.jsx";
import WatermarkSettings from "./WatermarkSettings.jsx";
import AIPreferencesSettings from "./AIPreferencesSettings.jsx";

const settingsSections = [
  { key: "general",   label: "General",             icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
  { key: "theme",     label: "Theme & Appearance",  icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 000 20"/></svg> },
  { key: "language",  label: "Language",            icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg> },
  { key: "upload",    label: "Upload Quality",      icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg> },
  { key: "backup",    label: "Auto Backup",         icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> },
  { key: "social",    label: "Social Integrations", icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> },
  { key: "export",    label: "Export Defaults",     icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> },
  { key: "watermark", label: "Watermark Settings",  icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { key: "ai",        label: "AI Preferences",      icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> },
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

function Dropdown({ value }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 14px", borderRadius: 12, cursor: "pointer",
      background: "#131830", border: "1px solid #2a2a40",
      minWidth: 0, maxWidth: "100%",
    }}>
      <span style={{ color: "#fff", fontSize: 13, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</span>
      <svg width="14" height="14" fill="none" stroke="#9191A8" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><polyline points="6 9 12 15 18 9"/></svg>
    </div>
  );
}

function TextInput({ value }) {
  return (
    <input
      defaultValue={value}
      style={{
        padding: "8px 14px", borderRadius: 12, fontSize: 13,
        background: "#131830", border: "1px solid #2a2a40",
        color: "#fff", outline: "none", width: "100%", boxSizing: "border-box",
      }}
      onFocus={e => e.target.style.borderColor = "#8D45FE"}
      onBlur={e => e.target.style.borderColor = "#2a2a40"}
    />
  );
}

const sectionContent = {
  general: {
    title: "General",
    desc: "Basic account and workspace preferences.",
    rows: [
      { label: "Display name",         sub: null,                               type: "input",    value: "Creator Studio" },
      { label: "Mail",                  sub: null,                               type: "input",    value: "hello@blinkshort.ai" },
      { label: "Default workspace",     sub: "Opens this workspace at sign-in", type: "dropdown", value: "Studio A" },
      { label: "Render quality",        sub: "Default export resolution.",       type: "dropdown", value: "4K (recommendation)" },
      { label: "AI model",              sub: "Used across all editors.",         type: "dropdown", value: "BlinkShort v4" },
      { label: "Auto-save drafts",      sub: null,                               type: "toggle",   value: true },
      { label: "Weekly insights email", sub: null,                               type: "toggle",   value: false },
      { label: "Join beta program",     sub: "Try experimental AI features.",    type: "toggle",   value: true },
    ],
  },
  theme:     { title: "Theme & Appearance",  desc: "Choose the look of your studio.",         custom: true },
  language:  { title: "Language & region",   desc: "Localize dates, numbers and AI output.",  customComponent: "language"  },
  upload:    { title: "Upload Quality",      desc: "Defaults for new media.",                 customComponent: "upload"    },
  backup:    { title: "Auto Backup",         desc: "Mirror projects to your cloud.",          customComponent: "backup"    },
  social:    { title: "Social Integrations", desc: "Publish and schedule directly.",          customComponent: "social"    },
  export:    { title: "Export Defaults",     desc: "Set default export settings.",            customComponent: "export"    },
  watermark: { title: "Watermark Settings",  desc: "Add your brand watermark.",               customComponent: "watermark" },
  ai:        { title: "AI Preferences",      desc: "Control how AI features behave.",         customComponent: "ai"        },
};

const accentColors = [
  { color: "#FD4FDA" }, { color: "#8D45FE" }, { color: "#4ADE80" }, { color: "#ffffff" }, { color: "#22d3ee" },
];
const themes = [
  { key: "dark",   label: "Dark",   preview: <div style={{ background: "#0a0f1e", width: "100%", height: "100%", borderRadius: 8 }} /> },
  { key: "light",  label: "Light",  preview: <div style={{ background: "#ffffff", width: "100%", height: "100%", borderRadius: 8 }} /> },
  { key: "system", label: "System", preview: <div style={{ background: "linear-gradient(135deg, #0a0f1e 50%, #d1d5db 50%)", width: "100%", height: "100%", borderRadius: 8 }} /> },
];

function ThemeContent({ getToggleVal, flipToggle, isMobile }) {
  const [selectedTheme, setSelectedTheme] = useState("dark");
  const [selectedAccent, setSelectedAccent] = useState("#8D45FE");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "#060B28", borderRadius: 16, padding: 20, border: "1px solid #222" }}>
        <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Theme</p>
        <p style={{ color: "#9191A8", fontSize: 12, marginBottom: 16 }}>Choose the look of your studio.</p>
        <div style={{ height: 1, background: "#222", marginBottom: 20 }} />
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {themes.map(({ key, label, preview }) => (
            <div key={key} onClick={() => setSelectedTheme(key)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <div style={{ width: isMobile ? 80 : 110, height: isMobile ? 55 : 75, borderRadius: 10, overflow: "hidden", border: selectedTheme === key ? "2px solid #8D45FE" : "2px solid #222", transition: "border 0.15s" }}>
                {preview}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${selectedTheme === key ? "#8D45FE" : "#9191A8"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {selectedTheme === key && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#8D45FE" }} />}
                </div>
                <span style={{ fontSize: 12, color: selectedTheme === key ? "#fff" : "#9191A8" }}>{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div  style={{background: "#060B28", borderRadius: 16, padding: 20, border: "1px solid #222" }}>
        <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Accent color</p>
        <p style={{ color: "#9191A8", fontSize: 12, marginBottom: 16 }}>Used for highlights, gradients and buttons.</p>
        <div style={{ height: 1, background: "#222", marginBottom: 20 }} />
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {accentColors.map(({ color }) => (
            <div key={color} onClick={() => setSelectedAccent(color)} style={{
              width: 36, height: 36, borderRadius: "50%", cursor: "pointer", background: color,
              border: selectedAccent === color ? "3px solid #fff" : "3px solid transparent",
              boxShadow: selectedAccent === color ? `0 0 0 2px ${color}` : "none",
              transition: "transform 0.15s",
            }} />
          ))}
        </div>
      </div>

      <div style={{ background: "#060B28",borderRadius: 16, padding: 20, border: "1px solid #222" }}>
        <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Typography & density</p>
        {[
          { label: "Display font",  sub: null,                                   type: "dropdown", value: "Space" },
          { label: "Body font",     sub: null,                                   type: "dropdown", value: "Inter" },
          { label: "Reduce motion", sub: "Minimize transitions across the app.", type: "toggle",   tkey: "motion" },
          { label: "Sidebar style", sub: null,                                   type: "dropdown", value: "Glass" },
        ].map(({ label, sub, type, value, tkey }, i, arr) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 0", gap: 12,
            borderBottom: i < arr.length - 1 ? "1px solid #222" : "none",
            flexWrap: isMobile ? "wrap" : "nowrap",
          }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0 }}>{label}</p>
              {sub && <p style={{ color: "#9191A8", fontSize: 11, marginTop: 2 }}>{sub}</p>}
            </div>
            {type === "dropdown" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 10, background: "#131830", border: "1px solid #2a2a40", cursor: "pointer", flexShrink: 0, minWidth: 100 }}>
                <span style={{ color: "#fff", fontSize: 13 }}>{value}</span>
                <svg width="13" height="13" fill="none" stroke="#9191A8" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            )}
            {type === "toggle" && <Toggle enabled={getToggleVal(tkey, false)} onChange={() => flipToggle(tkey)} />}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 4 }}>
        <button style={{ padding: "9px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, background: "#222", color: "#9191A8", border: "1px solid #2a2a3e", cursor: "pointer" }}>Cancel</button>
        <button style={{ padding: "9px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, background: "linear-gradient(90deg,#8D45FE,#FD4FDA)", color: "#fff", border: "none", cursor: "pointer" }}>Save Changes</button>
      </div>
    </div>
  );
}

/*Nav list shared by sidebar and mobile drawer*/
function NavList({ activeSection, setActiveSection, onSelect }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {settingsSections.map(({ key, label, icon }) => (
        <button key={key} onClick={() => { setActiveSection(key); onSelect && onSelect(); }}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 14px", borderRadius: 12, fontSize: 13, fontWeight: 500,
            background: activeSection === key ? "rgba(141,69,254,0.18)" : "transparent",
            color: activeSection === key ? "#fff" : "#9191A8",
            border: "none", cursor: "pointer", textAlign: "left", width: "100%",
          }}
        >
          <span style={{ color: activeSection === key ? "#8D45FE" : "#9191A8", flexShrink: 0 }}>{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState("general");
  const [toggleStates, setToggleStates] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const w = useWindowWidth();
  const isMobile = w < 768;
  const section = sectionContent[activeSection];

  const getToggleVal = (label, defaultVal) => {
    const key = `${activeSection}-${label}`;
    return key in toggleStates ? toggleStates[key] : defaultVal;
  };
  const flipToggle = (label) => {
    const key = `${activeSection}-${label}`;
    setToggleStates(prev => ({ ...prev, [key]: !getToggleVal(label, false) }));
  };

  const activeLabel = settingsSections.find(s => s.key === activeSection)?.label;

  return (
    <div style={{ minHeight: "100vh", padding: isMobile ? "14px 12px" : "24px", fontFamily: "sans-serif", boxSizing: "border-box" }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ color: "#fff", fontSize: isMobile ? 22 : 28, fontWeight: 800, margin: "0 0 4px" }}>Settings</h1>
        <p style={{ color: "#9191A8", fontSize: 13, margin: 0 }}>Configure how BlinkShort AI works for you.</p>
      </div>

      {/* Mobile section picker button */}
      {isMobile && (
        <button
          onClick={() => setDrawerOpen(true)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            width: "100%", padding: "10px 14px", borderRadius: 12, marginBottom: 16,
            background: "rgba(141,69,254,0.12)", border: "1px solid #2a2a40",
            color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#8D45FE" }}>
              {settingsSections.find(s => s.key === activeSection)?.icon}
            </span>
            {activeLabel}
          </div>
          <svg width="16" height="16" fill="none" stroke="#9191A8" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      )}

      {/* Mobile drawer overlay */}
      {isMobile && drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40 }}
        />
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <div style={{
          position: "fixed", left: 0, top: 0, bottom: 0, width: 260,
          background: "#060B28", borderRight: "1px solid #222",
          padding: "20px 10px", zIndex: 50, overflowY: "auto",
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
          boxSizing: "border-box",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingLeft: 8 }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Settings</span>
            <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9191A8", padding: 4 }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <NavList activeSection={activeSection} setActiveSection={setActiveSection} onSelect={() => setDrawerOpen(false)} />
        </div>
      )}

      {/* Desktop layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "220px 1fr",
        gap: 16,
        alignItems: "start",
      }}>

        {/* Desktop sidebar */}
        {!isMobile && (
          <div style={{ borderRadius: 16, padding: "10px 8px" }}>
            <NavList activeSection={activeSection} setActiveSection={setActiveSection} />
          </div>
        )}

        {/* Content panel */}
        <div style={{ minWidth: 0 }}>
          {section.custom
            ? <ThemeContent getToggleVal={getToggleVal} flipToggle={flipToggle} isMobile={isMobile} />
            : section.customComponent === "language"  ? <LanguageSettings />
            : section.customComponent === "upload"    ? <UploadQualitySettings />
            : section.customComponent === "backup"    ? <AutoBackupSettings />
            : section.customComponent === "social"    ? <SocialIntegrationsSettings />
            : section.customComponent === "export"    ? <ExportDefaultsSettings />
            : section.customComponent === "watermark" ? <WatermarkSettings />
            : section.customComponent === "ai"        ? <AIPreferencesSettings />
            : (
              <>
                <div style={{ borderRadius: 16, padding: 20, border: "1px solid #222" ,   background: "#060B28",}}>
                  <h2 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>{section.title}</h2>
                  <p style={{ color: "#9191A8", fontSize: 13, margin: "0 0 16px", paddingBottom: 16, borderBottom: "1px solid #222" }}>{section.desc}</p>
                  <div>
                    {section.rows.map(({ label, sub, type, value }, i) => (
                      <div key={label} style={{
                        display: "flex",
                        alignItems: isMobile && type !== "toggle" ? "flex-start" : "center",
                        flexDirection: isMobile && type !== "toggle" ? "column" : "row",
                        justifyContent: "space-between",
                        gap: isMobile ? 8 : 16,
                        padding: "14px 0",
                        borderBottom: i < section.rows.length - 1 ? "1px solid #222" : "none",
                      }}>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0 }}>{label}</p>
                          {sub && <p style={{ color: "#9191A8", fontSize: 11, marginTop: 2 }}>{sub}</p>}
                        </div>
                        <div style={{ flexShrink: 0, width: isMobile && type !== "toggle" ? "100%" : "auto" }}>
                          {type === "input"    && <TextInput value={value} />}
                          {type === "dropdown" && <Dropdown value={value} />}
                          {type === "toggle"   && <Toggle enabled={getToggleVal(label, value)} onChange={() => flipToggle(label)} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
                  <button style={{ padding: "9px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, background: "#222", color: "#9191A8", border: "1px solid #2a2a3e", cursor: "pointer" }}>Cancel</button>
                  <button style={{ padding: "9px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, background: "linear-gradient(90deg,#8D45FE,#FD4FDA)", color: "#fff", border: "none", cursor: "pointer" }}>Save Changes</button>
                </div>
              </>
            )
          }
        </div>
      </div>
    </div>
  );
}