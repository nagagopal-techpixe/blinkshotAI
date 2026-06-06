import { useState, useEffect, useCallback } from "react";
import {
  updatePassword,
  getPreferences,
  updatePreferences,
  getSessions,
  revokeSession,
  revokeAllSessions,
  getActivity,
} from "../../api/securityApi";

function Toggle({ on, onToggle, disabled }) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      style={{
        width: 44, height: 24, borderRadius: 99, border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        background: on ? "linear-gradient(90deg,#8D45FE,#FD4FDA)" : "#1a1a2e",
        position: "relative", transition: "background 0.2s",
        flexShrink: 0, opacity: disabled ? 0.5 : 1,
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: "50%", background: "white",
        position: "absolute", top: 3, left: on ? 22 : 4, transition: "left 0.2s",
      }} />
    </button>
  );
}

function PasswordStrength({ password }) {
  const strength = Math.min(Math.floor(password.length / 3), 5);
  const colors = ["#f87171", "#f87171", "#fbbf24", "#4ADE80", "#4ADE80"];
  const labels = ["", "Weak", "Weak", "Fair", "Strong", "Strong"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ display: "flex", gap: 4 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{
            width: 32, height: 6, borderRadius: 99,
            background: i < strength ? colors[strength - 1] : "#1a1a2e",
            transition: "background 0.2s",
          }} />
        ))}
      </div>
      {strength > 0 && (
        <span style={{ color: colors[strength - 1], fontSize: 13, fontWeight: 600 }}>
          {labels[strength]}
        </span>
      )}
    </div>
  );
}

function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 999,
      padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
      background: type === "success" ? "#0f3d20" : "#3d0f0f",
      color: type === "success" ? "#4ADE80" : "#f87171",
      border: `1px solid ${type === "success" ? "#1a5c30" : "#5c1a1a"}`,
      boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    }}>
      {message}
    </div>
  );
}

const inputStyle = {
  width: "100%", background: "#080e2a", border: "1px solid #1a1a2e",
  borderRadius: 10, padding: "12px 14px", color: "white",
  fontSize: 14, outline: "none", boxSizing: "border-box",
};

export default function Security() {

  // ✅ Auth guard — read the correct key
  const isAuthenticated = !!localStorage.getItem("lumina_token");

  const [current,   setCurrent]   = useState("");
  const [newPass,   setNewPass]   = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const [loginAlerts, setLoginAlerts] = useState(true);
  const [passkey,     setPasskey]     = useState(false);
  const [restrictIP,  setRestrictIP]  = useState(false);
  const [prefLoading, setPrefLoading] = useState(false);

  const [sessions,    setSessions]    = useState([]);
  const [sessLoading, setSessLoading] = useState(false);
  const [activity,    setActivity]    = useState([]);
  const [actLoading,  setActLoading]  = useState(false);

  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  }, []);

  // Load preferences — only if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    getPreferences()
      .then(({ data }) => {
        if (data?.data) {
          setLoginAlerts(data.data.loginAlerts ?? true);
          setPasskey(data.data.passkeyLogin ?? false);
          setRestrictIP(data.data.restrictIP ?? false);
        }
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const loadSessions = useCallback(() => {
    if (!isAuthenticated) return;
    setSessLoading(true);
    getSessions()
      .then(({ data }) => setSessions(data?.data || []))
      .catch(() => setSessions([]))
      .finally(() => setSessLoading(false));
  }, [isAuthenticated]);

  const loadActivity = useCallback(() => {
    if (!isAuthenticated) return;
    setActLoading(true);
    getActivity(20)
      .then(({ data }) => setActivity(data?.data || []))
      .catch(() => setActivity([]))
      .finally(() => setActLoading(false));
  }, [isAuthenticated]);

  useEffect(() => {
    loadSessions();
    loadActivity();
  }, [loadSessions, loadActivity]);

  const handleUpdatePassword = async () => {
    if (!current || !newPass || !confirm)
      return showToast("All password fields are required.", "error");
    if (newPass !== confirm)
      return showToast("New passwords do not match.", "error");
    if (newPass.length < 8)
      return showToast("Password must be at least 8 characters.", "error");
    setPwLoading(true);
    try {
      const { data } = await updatePassword({
        currentPassword: current,
        newPassword:     newPass,
        confirmPassword: confirm,
      });
      showToast(data.message || "Password updated successfully.");
      setCurrent(""); setNewPass(""); setConfirm("");
      loadSessions();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update password.", "error");
    } finally {
      setPwLoading(false);
    }
  };

  const handleTogglePref = async (key, value, setter) => {
    setter(value);
    setPrefLoading(true);
    try {
      await updatePreferences({ [key]: value });
      showToast("Preference saved.");
    } catch (err) {
      setter(!value);
      showToast(err.response?.data?.message || "Failed to save preference.", "error");
    } finally {
      setPrefLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    try {
      await revokeSession(sessionId);
      showToast("Device signed out.");
      loadSessions();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to sign out device.", "error");
    }
  };

  const handleRevokeAll = async () => {
    try {
      const { data } = await revokeAllSessions();
      showToast(data.message || "All other sessions signed out.");
      loadSessions();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to logout.", "error");
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const formatAgo = (iso) => {
    if (!iso) return "";
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return "Active now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  // ✅ Don't render (and don't fetch) if not logged in
  if (!isAuthenticated) {
    return (
      <div style={{ padding: 40, color: "#9191A8", textAlign: "center" }}>
        Please log in to view security settings.
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)} }
        .sec-header      { display:flex;align-items:flex-start;justify-content:space-between;gap:12px; }
        .sec-grid-3      { display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px; }
        .sec-pass-footer { display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap; }
        .sec-activity-date { color:#f87171;font-size:13px;font-weight:500;flex-shrink:0;white-space:nowrap; }
        .sec-session-loc-short { display:none; }
        @media (max-width:640px) {
          .sec-header      { flex-direction:column;align-items:stretch; }
          .sec-header-btn  { width:100%;text-align:center; }
          .sec-grid-3      { grid-template-columns:1fr !important; }
          .sec-pass-footer { flex-direction:column;align-items:flex-start; }
          .sec-pass-footer button { width:100%; }
          .sec-activity-date { font-size:11px; }
          .sec-session-loc       { display:none; }
          .sec-session-loc-short { display:block; }
        }
        .grad-btn { background:linear-gradient(90deg,#8D45FE,#FD4FDA);border:none;border-radius:10px;color:white;font-weight:700;cursor:pointer;transition:opacity .15s; }
        .grad-btn:hover:not(:disabled) { opacity:.85; }
        .grad-btn:disabled { opacity:.45;cursor:not-allowed; }
        .skeleton { background:linear-gradient(90deg,#1a1a2e 25%,#222244 50%,#1a1a2e 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:6px; }
        @keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }
      `}</style>

      <div className="min-h-screen p-6">

        {/* Header */}
        <div className="sec-header mb-6">
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 className="text-white font-extrabold" style={{ fontSize: "clamp(18px,5vw,30px)", margin: "0 0 4px 0" }}>
              Security
            </h1>
            <p className="text-sm" style={{ color: "#9191A8", margin: 0 }}>
              Protect your account with strong credentials, active sessions and audit history.
            </p>
          </div>
          <button
            className="sec-header-btn grad-btn"
            style={{ padding: "8px 16px", fontSize: 13 }}
            onClick={() => window.location.href = "/profile/two-factor"}
          >
            Manage 2FA
          </button>
        </div>

        {/* Password card */}
        <div className="rounded-2xl p-6 mb-4" style={{ background: "#060B28", border: "1px solid #222" }}>
          <p className="text-white text-lg font-bold mb-1">Password</p>
          <p className="text-sm mb-5" style={{ color: "#9191A8" }}>Use 12+ characters with mixed case, numbers and symbols.</p>
          <div className="sec-grid-3 mb-5">
            {[
              { label: "Current",     value: current, set: setCurrent },
              { label: "New",         value: newPass, set: setNewPass },
              { label: "Confirm new", value: confirm, set: setConfirm },
            ].map(({ label, value, set }) => (
              <div key={label}>
                <label style={{ color: "#9191A8", fontSize: 13, display: "block", marginBottom: 8 }}>{label}</label>
                <input
                  type="password" value={value} placeholder="••••••••"
                  onChange={(e) => set(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#8D45FE")}
                  onBlur={(e)  => (e.target.style.borderColor = "#1a1a2e")}
                />
              </div>
            ))}
          </div>
          <div className="sec-pass-footer">
            <PasswordStrength password={newPass} />
            <button className="grad-btn px-6 py-2.5 text-sm" disabled={pwLoading} onClick={handleUpdatePassword}>
              {pwLoading ? "Updating…" : "Update password"}
            </button>
          </div>
        </div>

        {/* Sign-in protection */}
        <div className="rounded-2xl p-6 mb-4" style={{ background: "#060B28", border: "1px solid #222" }}>
          <p className="text-white text-lg font-bold mb-4">Sign-in protection</p>
          {[
            { label: "Login alerts",                  desc: "Email me whenever a new device signs in.", on: loginAlerts, toggle: () => handleTogglePref("loginAlerts",  !loginAlerts, setLoginAlerts) },
            { label: "Allow passkey sign-in",         desc: "Use Face ID, Touch ID or hardware keys.",  on: passkey,    toggle: () => handleTogglePref("passkeyLogin", !passkey,     setPasskey)     },
            { label: "Restrict to trusted IP ranges", desc: "Block access outside saved networks.",     on: restrictIP, toggle: () => handleTogglePref("restrictIP",   !restrictIP,  setRestrictIP)  },
          ].map(({ label, desc, on, toggle }, i, arr) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 12, padding: "14px 0",
              borderBottom: i < arr.length - 1 ? "1px solid #1a1a2e" : "none",
            }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: "white", fontWeight: 600, fontSize: 14, margin: 0 }}>{label}</p>
                <p style={{ color: "#9191A8", fontSize: 12, marginTop: 2, marginBottom: 0 }}>{desc}</p>
              </div>
              <Toggle on={on} onToggle={toggle} disabled={prefLoading} />
            </div>
          ))}
        </div>

        {/* Active sessions */}
        <div className="rounded-2xl p-6 mb-4" style={{ background: "#060B28", border: "1px solid #222" }}>
          <p className="text-white text-lg font-bold mb-1">Active sessions</p>
          <p className="text-sm mb-4" style={{ color: "#9191A8" }}>Devices currently signed in to your account.</p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {sessLoading ? (
              [1, 2].map((k) => (
                <div key={k} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: "1px solid #1a1a2e" }}>
                  <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 14, width: "55%", marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 11, width: "40%" }} />
                  </div>
                </div>
              ))
            ) : sessions.length === 0 ? (
              <p style={{ color: "#9191A8", fontSize: 13 }}>No active sessions found.</p>
            ) : (
              sessions.map(({ id, device, location, lastSeen, thisDevice }, i) => (
                <div key={id || i} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 0",
                  borderBottom: i < sessions.length - 1 ? "1px solid #1a1a2e" : "none",
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: "#080e2a", border: "1px solid #1a1a2e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {thisDevice ? (
                      <svg width="20" height="20" fill="none" stroke="#9191A8" strokeWidth="1.8" viewBox="0 0 24 24">
                        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" fill="none" stroke="#9191A8" strokeWidth="1.8" viewBox="0 0 24 24">
                        <rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="18" r="1" fill="#9191A8"/>
                      </svg>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                      <p style={{ color: "white", fontWeight: 600, fontSize: 14, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{device}</p>
                      {thisDevice && (
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: "rgba(74,222,128,0.12)", color: "#4ADE80", flexShrink: 0 }}>This Device</span>
                      )}
                    </div>
                    <p className="sec-session-loc" style={{ color: "#9191A8", fontSize: 12, margin: 0 }}>{location} · {formatAgo(lastSeen)}</p>
                    <p className="sec-session-loc-short" style={{ color: "#9191A8", fontSize: 12, margin: 0 }}>{formatAgo(lastSeen)}</p>
                  </div>
                  {!thisDevice && (
                    <button onClick={() => handleRevokeSession(id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#f87171", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                      </svg>
                      Sign out
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
          <button
            className="w-full mt-4 py-3 rounded-xl text-sm font-bold hover:opacity-80 transition-opacity"
            style={{ background: "transparent", border: "1px solid #f87171", color: "#f87171", cursor: "pointer" }}
            onClick={handleRevokeAll}
          >
            Logout all other sessions
          </button>
        </div>

        {/* Recent activity */}
        <div className="rounded-2xl p-6" style={{ background: "#060B28", border: "1px solid #222" }}>
          <p className="text-white text-lg font-bold mb-4">Recent activity</p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {actLoading ? (
              [1, 2, 3].map((k) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "14px 0", borderBottom: "1px solid #1a1a2e" }}>
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 14, width: "45%", marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 11, width: "30%" }} />
                  </div>
                  <div className="skeleton" style={{ height: 13, width: 140 }} />
                </div>
              ))
            ) : activity.length === 0 ? (
              <p style={{ color: "#9191A8", fontSize: 13 }}>No recent activity.</p>
            ) : (
              activity.map(({ id, event, location, date }, i) => (
                <div key={id || i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: 12, padding: "14px 0",
                  borderBottom: i < activity.length - 1 ? "1px solid #1a1a2e" : "none",
                }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ color: "white", fontWeight: 600, fontSize: 14, margin: 0 }}>{event}</p>
                    <p style={{ color: "#9191A8", fontSize: 12, marginTop: 2, marginBottom: 0 }}>{location}</p>
                  </div>
                  <span className="sec-activity-date">{formatDate(date)}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
      <Toast message={toast.message} type={toast.type} />
    </>
  );
}