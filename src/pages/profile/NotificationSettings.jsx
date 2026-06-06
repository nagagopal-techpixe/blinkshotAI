import { useState } from "react";

function Toggle({ on, onToggle, color = "linear-gradient(90deg,#8D45FE,#FD4FDA)" }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 40, height: 22, borderRadius: 99, border: "none", cursor: "pointer",
        background: on ? color : "#1a1a2e",
        position: "relative", transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: "50%", background: "white",
        position: "absolute", top: 3,
        left: on ? 21 : 3,
        transition: "left 0.2s",
      }} />
    </button>
  );
}

const eventRows = [
  { label: "Render completed",       desc: "When a reel finishes processing."       },
  { label: "Approval requested",     desc: "Client or teammate needs your review."  },
  { label: "Team activity",          desc: "Comments, mentions, role changes."      },
  { label: "Credit & billing alerts", desc: "Low credits, failed payment, renewals." },
];

const emailRows = [
  { label: "Product updates",        desc: "New features, AI model upgrades."    },
  { label: "Marketing & tips",       desc: "Creator inspiration & promotions."   },
  { label: "Weekly insights digest", desc: "Performance summary every Monday."  },
];

export default function NotificationSettings() {
  const [events, setEvents] = useState([
    [true,  false, true ],
    [true,  false, true ],
    [true,  false, true ],
    [true,  false, true ],
  ]);

  const [emails, setEmails] = useState([true, false, true]);
  const [quietFrom, setQuietFrom] = useState("10:00 PM");
  const [quietTo,   setQuietTo]   = useState("8:00 AM");

  const toggleEvent = (row, col) =>
    setEvents((prev) => prev.map((r, i) =>
      i === row ? r.map((v, j) => (j === col ? !v : v)) : r
    ));

  const toggleEmail = (i) =>
    setEmails((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const inputStyle = {
    background: "#080e2a", border: "1px solid #1a1a2e",
    borderRadius: 10, padding: "12px 14px",
    color: "white", fontSize: 14, outline: "none", width: "100%",
    boxSizing: "border-box",
  };

  return (
    <>
      <style>{`
        .ns-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .ns-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .ns-col-headers { display: flex; gap: 24px; padding-right: 4px; }
        .ns-toggles { display: flex; gap: 24px; padding-right: 4px; }
        .ns-col-label { color: #9191A8; font-size: 11px; font-weight: 700; width: 40px; text-align: center; }
        @media (max-width: 640px) {
          .ns-header { flex-direction: column; align-items: stretch; }
          .ns-header-btn { width: 100%; text-align: center; }
          .ns-grid-2 { grid-template-columns: 1fr !important; gap: 16px; }
          .ns-col-headers { gap: 12px; }
          .ns-toggles { gap: 12px; }
          .ns-col-label { font-size: 10px; width: 34px; }
        }
      `}</style>

      <div className="min-h-screen p-6" >

        {/* Header */}
        <div className="ns-header mb-6">
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 className="text-white font-extrabold" style={{ fontSize: "clamp(16px, 4.5vw, 30px)", margin: "0 0 4px 0" }}>
              Notification Settings
            </h1>
            <p className="text-sm" style={{ color: "#9191A8", margin: 0 }}>
              Choose how BlinkShort AI keeps you in the loop across email, push, and in-app.
            </p>
          </div>
          <button
            className="ns-header-btn rounded-xl text-white font-bold hover:opacity-90 transition-opacity"
            style={{
              background: "linear-gradient(90deg,#8D45FE,#FD4FDA)",
              flexShrink: 0, whiteSpace: "nowrap",
              padding: "8px 16px", fontSize: 13, border: "none", cursor: "pointer",
            }}
          >
            Save preferences
          </button>
        </div>

        {/* Events card */}
        <div className="rounded-2xl p-6 mb-4" style={{ background: "#060B28", border: "1px solid #222" }}>
          <div className="flex items-center mb-4">
            <p className="text-white text-lg font-bold flex-1">Events</p>
            <div className="ns-col-headers">
              {["EMAIL", "PUSH", "IN-APP"].map((h) => (
                <span key={h} className="ns-col-label">{h}</span>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {eventRows.map(({ label, desc }, i) => (
              <div
                key={label}
                style={{
                  display: "flex", alignItems: "center",
                  padding: "14px 0",
                  borderBottom: i < eventRows.length - 1 ? "1px solid #1a1a2e" : "none",
                }}
              >
                <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                  <p style={{ color: "white", fontWeight: 600, fontSize: 14, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</p>
                  <p style={{ color: "#9191A8", fontSize: 12, marginTop: 2, marginBottom: 0 }}>{desc}</p>
                </div>
                <div className="ns-toggles">
                  {events[i].map((on, col) => (
                    <div key={col} style={{ width: 40, display: "flex", justifyContent: "center" }}>
                      <Toggle
                        on={on}
                        onToggle={() => toggleEvent(i, col)}
                        color={col === 1
                          ? "linear-gradient(90deg,#6366f1,#8D45FE)"
                          : "linear-gradient(90deg,#8D45FE,#FD4FDA)"
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email subscriptions */}
        <div className="rounded-2xl p-6 mb-4" style={{ background: "#060B28", border: "1px solid #222" }}>
          <p className="text-white text-lg font-bold mb-4">Email subscriptions</p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {emailRows.map(({ label, desc }, i) => (
              <div
                key={label}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: 12, padding: "14px 0",
                  borderBottom: i < emailRows.length - 1 ? "1px solid #1a1a2e" : "none",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p style={{ color: "white", fontWeight: 600, fontSize: 14, margin: 0 }}>{label}</p>
                  <p style={{ color: "#9191A8", fontSize: 12, marginTop: 2, marginBottom: 0 }}>{desc}</p>
                </div>
                <Toggle on={emails[i]} onToggle={() => toggleEmail(i)} />
              </div>
            ))}
          </div>
        </div>

        {/* Quiet hours */}
        <div className="rounded-2xl p-6" style={{ background: "#060B28", border: "1px solid #222" }}>
          <p className="text-white text-lg font-bold mb-1">Quiet hours</p>
          <p className="text-sm mb-5" style={{ color: "#9191A8" }}>Pause push notifications during these hours.</p>
          <div className="ns-grid-2">
            <div>
              <label style={{ color: "#9191A8", fontSize: 13, display: "block", marginBottom: 8 }}>From</label>
              <input
                type="text"
                value={quietFrom}
                onChange={(e) => setQuietFrom(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#8D45FE")}
                onBlur={(e) => (e.target.style.borderColor = "#1a1a2e")}
              />
            </div>
            <div>
              <label style={{ color: "#9191A8", fontSize: 13, display: "block", marginBottom: 8 }}>To</label>
              <input
                type="text"
                value={quietTo}
                onChange={(e) => setQuietTo(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#8D45FE")}
                onBlur={(e) => (e.target.style.borderColor = "#1a1a2e")}
              />
            </div>
          </div>
        </div>

      </div>
    </>
  );
}