import { useState, useEffect } from "react";
import {
  get2FAStatus,
  setupTOTP,
  verifyAndEnableTOTP,
  toggleMethod,
  regenerateRecoveryCodes,
  addTrustedDevice,
  revokeTrustedDevice,
  disable2FA,
} from "../../api/twoFactorApi.js";

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

function RegenModal({ onConfirm, onClose, loading }) {
  const [token, setToken] = useState("");
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div style={{ background: "#060B28", border: "1px solid #222", borderRadius: 16, padding: 24, width: "100%", maxWidth: 400 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <p style={{ color: "white", fontWeight: 700, fontSize: 16, margin: 0 }}>Regenerate recovery codes</p>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9191A8" }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <p style={{ color: "#9191A8", fontSize: 13, marginBottom: 20 }}>
          Enter your current 6-digit TOTP code. This will invalidate all existing recovery codes.
        </p>
        <p style={{ color: "#9191A8", fontSize: 12, marginBottom: 6 }}>TOTP code</p>
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="000000"
          maxLength={7}
          autoFocus
          style={{
            width: "100%", background: "#080e2a", border: "1px solid #1a1a2e",
            borderRadius: 8, padding: "10px 12px", color: "white",
            fontSize: 18, outline: "none", boxSizing: "border-box",
            letterSpacing: 4, textAlign: "center", marginBottom: 20,
          }}
          onFocus={(e) => (e.target.style.borderColor = "#8D45FE")}
          onBlur={(e)  => (e.target.style.borderColor = "#1a1a2e")}
          onKeyDown={(e) => e.key === "Enter" && onConfirm(token)}
        />
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "1px solid #1a1a2e", background: "#080e2a", color: "#9191A8", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Cancel
          </button>
          <button
            onClick={() => onConfirm(token)}
            disabled={loading || token.replace(/\s/g, "").length < 6}
            style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: "linear-gradient(90deg,#8D45FE,#FD4FDA)", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: loading || token.replace(/\s/g, "").length < 6 ? 0.5 : 1 }}
          >
            {loading ? "Regenerating..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DisableModal({ onConfirm, onClose, loading, error }) {
  const [password, setPassword] = useState("");
  const [show,     setShow]     = useState(false);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div style={{ background: "#060B28", border: "1px solid #222", borderRadius: 16, padding: 24, width: "100%", maxWidth: 400 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <p style={{ color: "white", fontWeight: 700, fontSize: 16, margin: 0 }}>Disable 2FA</p>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9191A8" }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 20 }}>
          <p style={{ color: "#f87171", fontSize: 13, margin: 0 }}>
            This will remove all 2FA methods, recovery codes, and trusted devices from your account.
          </p>
        </div>
        {error && (
          <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8, padding: "8px 12px", marginBottom: 16 }}>
            <p style={{ color: "#f87171", fontSize: 13, margin: 0 }}>{error}</p>
          </div>
        )}
        <p style={{ color: "#9191A8", fontSize: 12, marginBottom: 6 }}>Confirm your password</p>
        <div style={{ position: "relative", marginBottom: 20 }}>
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoFocus
            style={{
              width: "100%", background: "#080e2a", border: "1px solid #1a1a2e",
              borderRadius: 8, padding: "10px 40px 10px 12px", color: "white",
              fontSize: 14, outline: "none", boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#f87171")}
            onBlur={(e)  => (e.target.style.borderColor = "#1a1a2e")}
            onKeyDown={(e) => e.key === "Enter" && onConfirm(password)}
          />
          <button
            onClick={() => setShow(!show)}
            style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9191A8" }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {show
                ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
              }
            </svg>
          </button>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "1px solid #1a1a2e", background: "#080e2a", color: "#9191A8", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Cancel
          </button>
          <button
            onClick={() => onConfirm(password)}
            disabled={loading || !password}
            style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: "linear-gradient(90deg,#f87171,#ef4444)", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: loading || !password ? 0.5 : 1 }}
          >
            {loading ? "Disabling..." : "Disable 2FA"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TwoFactor() {
  const [authApp,        setAuthApp]        = useState(false);
  const [sms,            setSms]            = useState(false);
  const [email2fa,       setEmail2fa]       = useState(false);
  const [verCode,        setVerCode]        = useState("");
  const [copied,         setCopied]         = useState(false);
  const [qrCode,         setQrCode]         = useState(null);
  const [setupKey,       setSetupKey]       = useState("");
  const [recoveryCodes,  setRecoveryCodes]  = useState([]);
  const [recoveryRemain, setRecoveryRemain] = useState(0);
  const [trustedDevices, setTrustedDevices] = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [verifying,      setVerifying]      = useState(false);
  const [error,          setError]          = useState("");
  const [success,        setSuccess]        = useState("");
  const [showRegenModal,   setShowRegenModal]   = useState(false);
  const [regenLoading,     setRegenLoading]     = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disableLoading,   setDisableLoading]   = useState(false);
  const [disableError,     setDisableError]     = useState("");

  useEffect(() => { loadStatus(); }, []);

  async function loadStatus() {
    try {
      const data = await get2FAStatus();
      setAuthApp(data.totpEnabled);
      setSms(data.smsEnabled);
      setEmail2fa(data.emailEnabled);
      setTrustedDevices(data.trustedDevices || []);
      setRecoveryRemain(data.recoveryCodesCount || 0);
    } catch {
      setError("Failed to load 2FA status.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSetupTOTP() {
    try {
      setError("");
      const data = await setupTOTP();
      setQrCode(data.qrCode);
      setSetupKey(data.secret);
    } catch {
      setError("Failed to start TOTP setup.");
    }
  }

  async function handleVerify() {
    if (!verCode.trim()) return;
    setVerifying(true);
    setError("");
    try {
      const data = await verifyAndEnableTOTP(verCode.trim());
      setAuthApp(true);
      setSuccess("TOTP enabled successfully!");
      if (data.recoveryCodes) {
        setRecoveryCodes(data.recoveryCodes);
        setRecoveryRemain(data.recoveryCodes.length);
      }
      setVerCode("");
    } catch {
      setError("Invalid or expired code. Try again.");
    } finally {
      setVerifying(false);
    }
  }

  async function handleToggle(method, current, setter) {
    try {
      setError("");
      await toggleMethod(method, !current);
      setter(!current);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to toggle ${method}.`);
    }
  }

  async function handleRegenConfirm(token) {
    if (!token || token.replace(/\s/g, "").length < 6) return;
    setRegenLoading(true);
    setError("");
    try {
      const data = await regenerateRecoveryCodes(token);
      setRecoveryCodes(data.recoveryCodes);
      setRecoveryRemain(data.recoveryCodes.length);
      setSuccess("Recovery codes regenerated!");
      setShowRegenModal(false);
    } catch {
      setError("Failed to regenerate codes. Check your TOTP token.");
    } finally {
      setRegenLoading(false);
    }
  }

  async function handleDisableConfirm(password) {
    if (!password) return;
    setDisableLoading(true);
    setDisableError("");
    try {
      await disable2FA(password);
      setAuthApp(false);
      setSms(false);
      setEmail2fa(false);
      setRecoveryCodes([]);
      setRecoveryRemain(0);
      setTrustedDevices([]);
      setQrCode(null);
      setSetupKey("");
      setSuccess("2FA has been disabled.");
      setShowDisableModal(false);
    } catch (err) {
      setDisableError(err.message || "Incorrect password. Please try again.");
    } finally {
      setDisableLoading(false);
    }
  }

  async function handleRevoke(deviceId) {
    try {
      setError("");
      await revokeTrustedDevice(deviceId);
      setTrustedDevices((prev) => prev.filter((d) => d.id !== deviceId));
    } catch {
      setError("Failed to revoke device.");
    }
  }

  async function handleTrustDevice() {
    try {
      setError("");
      await addTrustedDevice();
      setSuccess("Device trusted for 30 days.");
      loadStatus();
    } catch {
      setError("Failed to trust device.");
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text || recoveryCodes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([recoveryCodes.join("\n")], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "recovery-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: "#9191A8" }}>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .tf-header       { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .tf-two-col      { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .tf-setup-inner  { display: flex; gap: 16px; margin-bottom: 20px; }
        .tf-rc-actions   { display: flex; gap: 8px; flex-wrap: wrap; }
        .tf-banner       { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .tf-banner-left  { display: flex; align-items: center; gap: 16px; flex: 1; min-width: 0; }
        @media (max-width: 640px) {
          .tf-header      { flex-direction: column; align-items: stretch; }
          .tf-two-col     { grid-template-columns: 1fr !important; }
          .tf-setup-inner { flex-direction: column; align-items: center; }
          .tf-rc-actions  { flex-direction: column; }
          .tf-rc-actions button { width: 100%; justify-content: center; }
          .tf-banner      { flex-direction: column; align-items: stretch; }
          .tf-banner-btn  { width: 100%; text-align: center; }
        }
      `}</style>

      {showRegenModal && (
        <RegenModal
          onConfirm={handleRegenConfirm}
          onClose={() => setShowRegenModal(false)}
          loading={regenLoading}
        />
      )}

      {showDisableModal && (
        <DisableModal
          onConfirm={handleDisableConfirm}
          onClose={() => { setShowDisableModal(false); setDisableError(""); }}
          loading={disableLoading}
          error={disableError}
        />
      )}

      <div className="min-h-screen p-6">

        <div className="tf-header mb-6">
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 className="text-white font-extrabold" style={{ fontSize: "clamp(18px, 5vw, 30px)", margin: "0 0 4px 0" }}>
              Two-factor (2FA)
            </h1>
            <p className="text-sm" style={{ color: "#9191A8", margin: 0 }}>
              Add a second step at sign-in to keep your account secure.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {authApp && (
              <button
                onClick={() => setShowDisableModal(true)}
                className="px-4 py-2 rounded-xl text-sm font-bold hover:opacity-80 transition-opacity"
                style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                Disable 2FA
              </button>
            )}
            <span style={{
              padding: "8px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700,
              background: authApp ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)",
              color: authApp ? "#4ADE80" : "#f87171",
              whiteSpace: "nowrap",
            }}>
              {authApp ? "2FA enabled" : "2FA disabled"}
            </span>
          </div>
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 mb-4 text-sm" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}>
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl px-4 py-3 mb-4 text-sm" style={{ background: "rgba(74,222,128,0.1)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.2)" }}>
            {success}
          </div>
        )}

        <div className="rounded-2xl p-6 mb-4" style={{ background: "#060B28", border: "1px solid #222" }}>
          <p className="text-white text-lg font-bold mb-4">Methods</p>
          {[
            { label: "Authenticator app",   desc: "Google Authenticator, 1Password, Authy", on: authApp,  method: "totp",  set: setAuthApp  },
            { label: "SMS text message",    desc: "Backup only",                             on: sms,      method: "sms",   set: setSms      },
            { label: "Email one-time code", desc: "Sent to your registered email",           on: email2fa, method: "email", set: setEmail2fa },
          ].map(({ label, desc, on, method, set }, i, arr) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 12, padding: "14px 0",
              borderBottom: i < arr.length - 1 ? "1px solid #1a1a2e" : "none",
            }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: "white", fontWeight: 600, fontSize: 14, margin: 0 }}>{label}</p>
                <p style={{ color: "#9191A8", fontSize: 12, marginTop: 2, marginBottom: 0 }}>{desc}</p>
              </div>
              <Toggle on={on} onToggle={() => handleToggle(method, on, set)} />
            </div>
          ))}
        </div>

        <div className="tf-two-col mb-4">
          <div className="rounded-2xl p-6" style={{ background: "#060B28", border: "1px solid #222" }}>
            <p className="text-white text-base font-bold mb-1">Set up authenticator</p>
            <p className="text-sm mb-5" style={{ color: "#9191A8" }}>
              Scan the QR code with your authenticator app, then enter the 6-digit code.
            </p>

            {!qrCode ? (
              <button
                onClick={handleSetupTOTP}
                className="px-5 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-opacity mb-4"
                style={{ background: "linear-gradient(90deg,#8D45FE,#FD4FDA)", border: "none", cursor: "pointer" }}
              >
                Generate QR Code
              </button>
            ) : (
              <div className="tf-setup-inner">
                <div style={{
                  width: 100, height: 100, borderRadius: 10, flexShrink: 0,
                  background: "white", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                }}>
                  <img src={qrCode} alt="QR Code" width={96} height={96} />
                </div>
                <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
                  <p style={{ color: "#9191A8", fontSize: 12, marginBottom: 6 }}>Setup key</p>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "#080e2a", border: "1px solid #1a1a2e",
                    borderRadius: 8, padding: "8px 12px", marginBottom: 16,
                  }}>
                    <span style={{ color: "white", fontSize: 13, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {setupKey}
                    </span>
                    <button onClick={() => handleCopy(setupKey)} style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
                      <svg width="14" height="14" fill="none" stroke={copied ? "#4ADE80" : "#9191A8"} strokeWidth="2" viewBox="0 0 24 24">
                        {copied
                          ? <polyline points="20 6 9 17 4 12"/>
                          : <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>
                        }
                      </svg>
                    </button>
                  </div>
                  <p style={{ color: "#9191A8", fontSize: 12, marginBottom: 6 }}>Verification code</p>
                  <input
                    value={verCode}
                    onChange={(e) => setVerCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    style={{
                      width: "100%", background: "#080e2a", border: "1px solid #1a1a2e",
                      borderRadius: 8, padding: "8px 12px", color: "white",
                      fontSize: 14, outline: "none", boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#8D45FE")}
                    onBlur={(e)  => (e.target.style.borderColor = "#1a1a2e")}
                  />
                </div>
              </div>
            )}

            {qrCode && (
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="px-5 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(90deg,#8D45FE,#FD4FDA)", border: "none", cursor: "pointer", opacity: verifying ? 0.7 : 1 }}
              >
                {verifying ? "Verifying..." : "Verify & enable"}
              </button>
            )}
          </div>

          <div className="rounded-2xl p-6" style={{ background: "#060B28", border: "1px solid #222" }}>
            <p className="text-white text-base font-bold mb-1">Recovery codes</p>
            <p className="text-sm mb-5" style={{ color: "#9191A8" }}>
              Save these somewhere safe. Each code can only be used once.
              {recoveryRemain > 0 && !recoveryCodes.length && (
                <span style={{ color: "#4ADE80" }}> {recoveryRemain} unused codes remaining.</span>
              )}
            </p>

            {recoveryCodes.length > 0 && (
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-5">
                {recoveryCodes.map((code, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <svg width="12" height="12" fill="none" stroke="#4ADE80" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span style={{ color: "white", fontSize: 13, fontFamily: "monospace" }}>{code}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="tf-rc-actions">
              {recoveryCodes.length > 0 && (
                <>
                  <button
                    onClick={() => handleCopy()}
                    className="text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-80 transition-opacity flex items-center gap-1"
                    style={{ background: "#080e2a", border: "1px solid #1a1a2e", color: "#9191A8", cursor: "pointer" }}
                  >
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    Copy
                  </button>
                  <button
                    onClick={handleDownload}
                    className="text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
                    style={{ background: "#080e2a", border: "1px solid #1a1a2e", color: "#9191A8", cursor: "pointer" }}
                  >
                    Download.txt
                  </button>
                </>
              )}
              <button
                onClick={() => setShowRegenModal(true)}
                className="text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
                style={{ background: "#080e2a", border: "1px solid #1a1a2e", color: "#9191A8", cursor: "pointer" }}
              >
                Regenerate
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6 mb-4" style={{ background: "#060B28", border: "1px solid #222" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <p className="text-white text-lg font-bold" style={{ margin: 0 }}>Trusted devices</p>
            <button
              onClick={handleTrustDevice}
              className="text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
              style={{ background: "#080e2a", border: "1px solid #1a1a2e", color: "#9191A8", cursor: "pointer" }}
            >
              Trust this device
            </button>
          </div>
          <p className="text-sm mb-4" style={{ color: "#9191A8" }}>Skip 2FA on these devices for 30 days.</p>

          {trustedDevices.length === 0 ? (
            <p style={{ color: "#9191A8", fontSize: 13 }}>No trusted devices.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {trustedDevices.map(({ id, device, location, trustedAt }, i) => (
                <div key={id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: 12, padding: "14px 0",
                  borderBottom: i < trustedDevices.length - 1 ? "1px solid #1a1a2e" : "none",
                }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ color: "white", fontWeight: 600, fontSize: 14, margin: 0 }}>{device}</p>
                    <p style={{ color: "#9191A8", fontSize: 12, marginTop: 2, marginBottom: 0 }}>
                      {location} · trusted {new Date(trustedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <button onClick={() => handleRevoke(id)} style={{ background: "none", border: "none", color: "#f87171", fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl p-5 tf-banner" style={{ background: "#060B28", border: "1px solid #222" }}>
          <div className="tf-banner-left">
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: "rgba(141,69,254,0.15)", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" fill="none" stroke="#a78bfa" strokeWidth="1.8" viewBox="0 0 24 24">
                <rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="18" r="1" fill="#a78bfa"/>
              </svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: "white", fontWeight: 600, fontSize: 14, margin: 0 }}>Lost access to your authenticator?</p>
              <p style={{ color: "#9191A8", fontSize: 12, marginTop: 2, marginBottom: 0 }}>Use a recovery code or contact support to verify your identity.</p>
            </div>
          </div>
          <button
            className="tf-banner-btn px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-80 transition-opacity"
            style={{ background: "#080e2a", border: "1px solid #1a1a2e", color: "#9191A8", cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}
          >
            Contact Support
          </button>
        </div>

      </div>
    </>
  );
}