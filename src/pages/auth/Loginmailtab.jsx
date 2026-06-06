import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, saveAuth } from "../../api/authApi";
import { verify2FALogin } from "../../api/twoFactorApi";
import { useToast } from "../../components/Toast";

const inputBase = {
  width: "100%", padding: "11px 14px", borderRadius: 10,
  background: "#1a1a26", color: "#fff", fontSize: 14,
  outline: "none", boxSizing: "border-box",
};

export default function LoginMailTab({ Divider, SocialButtons, Footer }) {
  const navigate  = useNavigate();
  const showToast = useToast();

  const [showPw,        setShowPw]        = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [email,         setEmail]         = useState(() => localStorage.getItem("rememberedEmail") || "");
  const [password,      setPassword]      = useState("");
  const [remember,      setRemember]      = useState(() => !!localStorage.getItem("rememberedEmail"));
  const [twoFAUserId,   setTwoFAUserId]   = useState(null);
  const [twoFACode,     setTwoFACode]     = useState("");
  const [twoFALoading,  setTwoFALoading]  = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showToast({ type: "error", message: "Email and password are required." });
      return;
    }
    try {
      setLoading(true);
      const data = await loginUser({ email: email.trim(), password });

      if (data.twoFactorRequired) {
        setTwoFAUserId(data.userId);
        return;
      }

      saveAuth(data.token, data.user);
      if (remember) {
        localStorage.setItem("rememberedEmail", email.trim());
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      showToast({ type: "success", message: "Login successful! Welcome back 🎉" });
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      showToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFA = async () => {
    if (twoFACode.replace(/\s/g, "").length < 6) return;
    try {
      setTwoFALoading(true);
      const data = await verify2FALogin(twoFAUserId, twoFACode.trim());
      saveAuth(data.token, data.user);
      if (remember) {
        localStorage.setItem("rememberedEmail", email.trim());
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      showToast({ type: "success", message: "Login successful! Welcome back 🎉" });
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      showToast({ type: "error", message: err.message || "Invalid code. Try again." });
    } finally {
      setTwoFALoading(false);
    }
  };

  if (twoFAUserId) {
    return (
      <>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, margin: "0 auto 12px",
            background: "rgba(141,69,254,0.15)", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="22" height="22" fill="none" stroke="#a78bfa" strokeWidth="1.8" viewBox="0 0 24 24">
              <rect x="5" y="11" width="14" height="10" rx="2"/>
              <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
            </svg>
          </div>
          <p style={{ color: "white", fontWeight: 700, fontSize: 16, margin: "0 0 6px" }}>Two-factor verification</p>
          <p style={{ color: "#9191A8", fontSize: 13, margin: 0 }}>
            Enter the 6-digit code from your authenticator app or a recovery code.
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ color: "#fff", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
            Authentication code
          </label>
          <input
            value={twoFACode}
            onChange={(e) => setTwoFACode(e.target.value)}
            placeholder="000 000"
            maxLength={7}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleTwoFA()}
            style={{
              ...inputBase,
              border: "1.5px solid #8D45FE",
              fontSize: 22, fontWeight: 700,
              letterSpacing: 6, textAlign: "center",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#8D45FE")}
            onBlur={(e)  => (e.target.style.borderColor = "#2a2a3a")}
          />
        </div>

        <button
          onClick={handleTwoFA}
          disabled={twoFALoading || twoFACode.replace(/\s/g, "").length < 6}
          style={{
            width: "100%", padding: "12px 0", borderRadius: 999,
            color: "#fff", fontWeight: 700, fontSize: 15,
            border: "none", cursor: "pointer", marginBottom: 12,
            background: "linear-gradient(90deg,#8D45FE,#FD4FDA)",
            opacity: twoFALoading || twoFACode.replace(/\s/g, "").length < 6 ? 0.6 : 1,
          }}
        >
          {twoFALoading ? "Verifying..." : "Verify"}
        </button>

        <button
          onClick={() => { setTwoFAUserId(null); setTwoFACode(""); }}
          style={{
            width: "100%", padding: "10px 0", borderRadius: 999,
            color: "#9191A8", fontWeight: 600, fontSize: 13,
            border: "1px solid #2a2a3a", background: "transparent", cursor: "pointer", marginBottom: 20,
          }}
        >
          ← Back to login
        </button>

        <p style={{ color: "#9191A8", fontSize: 12, textAlign: "center", margin: 0 }}>
          Lost your authenticator? Enter a recovery code above instead.
        </p>
      </>
    );
  }

  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <label style={{ color: "#fff", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
          Email Address
        </label>
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          style={{ ...inputBase, border: "1.5px solid #00E6FE" }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ color: "#fff", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
          Password
        </label>
        <div style={{ position: "relative" }}>
          <input
            type={showPw ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{ ...inputBase, paddingRight: 44, border: "1px solid #2a2a3a" }}
          />
          <button
            onClick={() => setShowPw(v => !v)}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9191A8", padding: 0 }}
          >
            {showPw
              ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17.94 17.94A10.06 10.06 0 0112 20C6 20 2 12 2 12a17.6 17.6 0 015.06-6.06M9.9 4.24A9.12 9.12 0 0112 4c6 0 10 8 10 8a17.6 17.6 0 01-2.36 3.29M1 1l22 22" strokeLinecap="round"/></svg>
              : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#9191A8", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
            style={{ width: 15, height: 15, accentColor: "#8D45FE", cursor: "pointer" }}
          />
          Remember Me
        </label>
        <a
          href="/forgot-password"
          onClick={e => { e.preventDefault(); navigate("/forgot-password"); }}
          style={{ fontSize: 13, color: "#fff", textDecoration: "none" }}
        >
          Forgot Password
        </a>
      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          width: "100%", padding: "12px 0", borderRadius: 999,
          color: "#fff", fontWeight: 700, fontSize: 15,
          border: "none", cursor: loading ? "not-allowed" : "pointer",
          marginBottom: 20, opacity: loading ? 0.7 : 1,
          background: "linear-gradient(90deg,#8D45FE,#FD4FDA)",
        }}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <Divider />
      <SocialButtons />
      <Footer />
    </>
  );
}