import { useState } from "react";

const connectedApps = [
  { icon: "S", color: "#635BFF", name: "Stripe",       desc: "Charge clients & handle subscriptions.", status: "connected" },
  { icon: "G", color: "#4285F4", name: "Google Drive",  desc: "Pull raw footage from Drive folders.",    status: "disconnected" },
  { icon: "D", color: "#0061FF", name: "Dropbox",       desc: "Sync source files & deliver exports.",    status: "connected" },
  { icon: "I", color: "#E1306C", name: "Instagram",     desc: "Publish reels directly to your account.", status: "connected" },
  { icon: "T", color: "#000000", name: "TikTok",        desc: "Auto-export & schedule TikTok posts.",    status: "disconnected" },
  { icon: "Y", color: "#FF0000", name: "YouTube",       desc: "Upload Shorts and full-length cuts.",     status: "connected" },
  { icon: "S", color: "#4A154B", name: "Slack",         desc: "Get render & approval notifications.",    status: "disconnected" },
  { icon: "Z", color: "#FF4A00", name: "Zapier",        desc: "Connect to 5,000+ apps via Zaps.",        status: "disconnected" },
];

const webhooks = [
  { event: "render.completed",   desc: "Fired when a reel finishes processing." },
  { event: "approval.requested", desc: "Client requested approval on a draft."  },
  { event: "export.ready",       desc: "A multi-format export bundle is ready." },
  { event: "storage.warning",    desc: "Workspace storage above 90%."           },
];

function AppIcon({ icon, color }) {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
      background: color, display: "flex", alignItems: "center",
      justifyContent: "center", color: "white", fontWeight: 800, fontSize: 15,
    }}>
      {icon}
    </div>
  );
}

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 44, height: 24, borderRadius: 99, border: "none", cursor: "pointer",
        background: on ? "linear-gradient(90deg,#8D45FE,#FD4FDA)" : "#1a1a2e",
        position: "relative", transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: "50%", background: "white",
        position: "absolute", top: 3,
        left: on ? 22 : 4,
        transition: "left 0.2s",
      }} />
    </button>
  );
}

export default function APIIntegrations() {
  const [apps, setApps]       = useState(connectedApps);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied]   = useState(false);
  const [hooks, setHooks]     = useState(webhooks.map(() => true));

  const toggleApp = (i) =>
    setApps((prev) => prev.map((a, idx) =>
      idx === i ? { ...a, status: a.status === "connected" ? "disconnected" : "connected" } : a
    ));

  const toggleHook = (i) =>
    setHooks((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <style>{`
        .ai-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .ai-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .ai-app-card { display: flex; align-items: center; gap: 12px; border-radius: 12px; padding: 14px; background: #080e2a; border: 1px solid #1a1a2e; }
        .ai-app-desc { color: #9191A8; font-size: 12px; margin: 0; }
        .ai-key-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        @media (max-width: 640px) {
          .ai-header { flex-direction: column; align-items: stretch; }
          .ai-header-btn { width: 100%; text-align: center; }
          .ai-grid-2 { grid-template-columns: 1fr !important; }
          .ai-app-card { flex-wrap: nowrap; }
          .ai-app-desc { display: none; }
          .ai-key-row { flex-wrap: wrap; }
          .ai-key-text { font-size: 11px !important; word-break: break-all; white-space: normal !important; }
        }
      `}</style>

      <div className="min-h-screen p-6" >

        {/* Header */}
        <div className="ai-header mb-6">
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 className="text-white font-extrabold" style={{ fontSize: "clamp(18px, 5vw, 30px)", margin: "0 0 4px 0" }}>
              API & Integrations
            </h1>
            <p className="text-sm" style={{ color: "#9191A8", margin: 0 }}>
              Connect external apps and manage API keys &amp; webhooks.
            </p>
          </div>
          <button
            className="ai-header-btn rounded-xl text-white font-bold hover:opacity-90 transition-opacity"
            style={{
              background: "linear-gradient(90deg,#8D45FE,#FD4FDA)",
              flexShrink: 0, whiteSpace: "nowrap",
              padding: "8px 16px", fontSize: 13, border: "none", cursor: "pointer",
            }}
          >
            Generate API key
          </button>
        </div>

        {/* Connected apps */}
        <div className="rounded-2xl p-6 mb-4" style={{ background: "#060B28", border: "1px solid #222" }}>
          <p className="text-white text-lg font-bold mb-5">Connected apps</p>
          <div className="ai-grid-2">
            {apps.map(({ icon, color, name, desc, status }, i) => (
              <div key={name} className="ai-app-card">
                <AppIcon icon={icon} color={color} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="text-white text-sm font-bold" style={{ margin: "0 0 2px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</p>
                  <p className="ai-app-desc">{desc}</p>
                </div>
                <button
                  onClick={() => toggleApp(i)}
                  style={{
                    fontSize: 12, fontWeight: 700, padding: "6px 12px", borderRadius: 8,
                    flexShrink: 0, whiteSpace: "nowrap", cursor: "pointer",
                    background: status === "connected" ? "transparent" : "linear-gradient(90deg,#8D45FE,#FD4FDA)",
                    color: status === "connected" ? "#9191A8" : "white",
                    border: status === "connected" ? "1px solid #2a2a4a" : "none",
                  }}
                >
                  {status === "connected" ? "Manage" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* API Keys */}
        <div className="rounded-2xl p-6 mb-4" style={{ background: "#060B28", border: "1px solid #222" }}>
          <p className="text-white text-lg font-bold mb-1">API Keys</p>
          <p className="text-sm mb-4" style={{ color: "#9191A8" }}>Use these tokens to call BlinkShort programmatically.</p>

          <div className="rounded-xl p-4" style={{ background: "#080e2a", border: "1px solid #1a1a2e" }}>
            <p className="text-xs mb-3" style={{ color: "#9191A8" }}>Live key · created Apr 12, 2026</p>
            <div className="ai-key-row">
              <span className="ai-key-text text-white text-sm font-mono" style={{ flex: 1, letterSpacing: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {showKey ? "bsk_live_k9xmT2pQrVnLwBJdZ8aEyHsF3cUiOgN5" : "bsk_live_" + "•".repeat(28)}
              </span>
              <button onClick={() => setShowKey(!showKey)} style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
                <svg width="18" height="18" fill="none" stroke="#9191A8" strokeWidth="2" viewBox="0 0 24 24">
                  {showKey
                    ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                  }
                </svg>
              </button>
              <button onClick={handleCopy} style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
                <svg width="18" height="18" fill="none" stroke={copied ? "#4ADE80" : "#9191A8"} strokeWidth="2" viewBox="0 0 24 24">
                  {copied
                    ? <polyline points="20 6 9 17 4 12"/>
                    : <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>
                  }
                </svg>
              </button>
            </div>
            <div className="flex gap-4">
              <button style={{ background: "none", border: "none", color: "#9191A8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Rotate
              </button>
              <button style={{ background: "none", border: "none", color: "#f87171", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Webhooks */}
        <div className="rounded-2xl p-6" style={{ background: "#060B28", border: "1px solid #222" }}>
          <p className="text-white text-lg font-bold mb-1">Webhooks</p>
          <p className="text-sm mb-4" style={{ color: "#9191A8" }}>Receive real-time events for renders, approvals &amp; exports.</p>

          <div className="rounded-xl p-4 mb-4" style={{ background: "#080e2a", border: "1px solid #1a1a2e" }}>
            <div className="flex items-center justify-between">
              <p className="text-sm" style={{ color: "#9191A8" }}>Live key · created Apr 12, 2026</p>
              <span className="text-xs font-bold px-3 py-1 rounded-lg" style={{ background: "rgba(74,222,128,0.12)", color: "#4ADE80" }}>
                Active
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {webhooks.map(({ event, desc }, i) => (
              <div
                key={event}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: 12, padding: "16px 0",
                  borderBottom: i < webhooks.length - 1 ? "1px solid #1a1a2e" : "none",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p className="text-white text-sm font-semibold" style={{ margin: "0 0 2px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{event}</p>
                  <p style={{ color: "#9191A8", fontSize: 12, margin: 0 }}>{desc}</p>
                </div>
                <Toggle on={hooks[i]} onToggle={() => toggleHook(i)} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}