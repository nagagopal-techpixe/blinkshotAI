import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginMailTab from "./LoginMailTab";
import LoginOtpTab  from "./LoginOtpTab";

const socialList = [
  { label: "Google",   icon: <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#4285F4" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#34A853" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> },
  { label: "Apple",    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#000"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg> },
  { label: "Facebook", icon: <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  { label: "Twitter",  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
];

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: "linear-gradient(135deg,#8D45FE,#FD4FDA)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M5 4h8a4 4 0 010 8H5V4z" fill="white" fillOpacity="0.9"/>
          <path d="M5 12h9a4 4 0 010 8H5V12z" fill="white"/>
        </svg>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 20 }}>Blink</span>
        <span style={{ color: "#FD4FDA", fontWeight: 700, fontSize: 20 }}>Short</span>
        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 5, marginLeft: 4, background: "#2a2a3a", color: "#9191A8" }}>AI</span>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ flex: 1, height: 1, background: "#2a2a3a" }} />
      <span style={{ color: "#9191A8", fontSize: 12 }}>or continue with</span>
      <div style={{ flex: 1, height: 1, background: "#2a2a3a" }} />
    </div>
  );
}

function SocialButtons() {
  return (
    <>
      <style>{".social-label{display:inline}@media(max-width:420px){.social-label{display:none}.social-btn-item{padding:9px 0!important}}"}</style>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {socialList.map(({ label, icon }) => (
          <button key={label} className="social-btn-item"
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "9px 4px", borderRadius: 999, fontSize: 12, fontWeight: 600,
              background: "#fff", color: "#111", border: "1px solid #e5e7eb", cursor: "pointer", whiteSpace: "nowrap" }}>
            {icon}<span className="social-label">{label}</span>
          </button>
        ))}
      </div>
    </>
  );
}

function Footer() {
  const navigate = useNavigate();
  return (
    <p style={{ textAlign: "center", fontSize: 13, color: "#9191A8", margin: 0 }}>
      New here?{" "}
      <a href="/register" onClick={e => { e.preventDefault(); navigate("/register"); }}
        style={{ color: "#fff", fontWeight: 700, textDecoration: "none" }}>
        Create an account
      </a>
    </p>
  );
}

export default function Login() {
  const [tab, setTab] = useState("mail");

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "20px 16px", boxSizing: "border-box" }}>
      <div style={{ width: "100%", maxWidth: 408, borderRadius: 20, padding: "28px 24px",
        background: "rgba(0,0,0,0.32)", border: "1px solid #272727",
        boxShadow: "inset 0 0 21px 0 rgba(255,255,255,0.52)", boxSizing: "border-box" }}>

        <Logo />
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Welcome Back!</h1>
        <p style={{ color: "#9191A8", fontSize: 13, margin: "0 0 20px" }}>Sign in to continue your journey</p>

        {/* Tab switcher */}
        <div style={{ display: "flex", borderRadius: 999, padding: 4, marginBottom: 20, background: "#1a1a26", border: "1px solid #2a2a3a" }}>
          {[{ key: "mail", label: "Mail Login", emoji: "✉️" }, { key: "otp", label: "OTP Login", emoji: "📱" }].map(({ key, label, emoji }) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ flex: 1, padding: "9px 0", borderRadius: 999, fontSize: 13, fontWeight: 600,
                border: "none", cursor: "pointer",
                background: tab === key ? "linear-gradient(90deg,#8D45FE,#FD4FDA)" : "transparent",
                color: tab === key ? "#fff" : "#9191A8" }}>
              {emoji} {label}
            </button>
          ))}
        </div>

        {/* Render active tab */}
        {tab === "mail"
          ? <LoginMailTab Divider={Divider} SocialButtons={SocialButtons} Footer={Footer} />
          : <LoginOtpTab  Divider={Divider} SocialButtons={SocialButtons} Footer={Footer} />
        }
      </div>
    </div>
  );
}