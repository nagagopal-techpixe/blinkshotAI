import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const inputStyle = {
  width: "100%",
  background: "#080e2a",
  border: "1px solid #1a1a2e",
  borderRadius: 10,
  padding: "12px 14px",
  color: "white",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  color: "#9191A8",
  fontSize: 13,
  marginBottom: 8,
  display: "block",
};

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "#8D45FE")}
        onBlur={(e) => (e.target.style.borderColor = "#1a1a2e")}
      />
    </div>
  );
}

/*reusable breadcrumb*/
function Breadcrumb({ title }) {
  const navigate = useNavigate();
  const hoverOn  = (e) => (e.target.style.color = "white");
  const hoverOff = (e) => (e.target.style.color = "#9191A8");

  return (
    <div className="flex items-center gap-2 mb-5">
      <button
        onClick={() => navigate("/profile")}
        style={{
          background: "#060B28", border: "1px solid #222",
          borderRadius: 10, padding: "6px 10px", cursor: "pointer",
        }}
      >
        <svg width="16" height="16" fill="none" stroke="#9191A8" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
      </button>
      <span style={{ color: "#9191A8", fontSize: 13 }}>
        <span
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
          onMouseEnter={hoverOn} onMouseLeave={hoverOff}
        >Dashboard</span>
        {" / "}
        <span
          onClick={() => navigate("/profile")}
          style={{ cursor: "pointer" }}
          onMouseEnter={hoverOn} onMouseLeave={hoverOff}
        >Profile</span>
        {" / "}
        <span style={{ color: "white" }}>{title}</span>
      </span>
    </div>
  );
}

export default function PersonalInfo() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const fileRef   = useRef();

  const fromProfile    = location.state?.fromProfile;
  const breadcrumbTitle = location.state?.title ?? "Personal Info";

  const [form, setForm] = useState({
    displayName:  "Creator Studio",
    displayName2: "Creator Studio",
    email:        "creator@blinkshort.ai",
    phone:        "+1 (415) 555 0182",
    country:      "United States",
    timezone:     "(GMT-08:00) Pacific Time",
    bio:          "Cinematic short-form creator. Weddings, products, brand stories.",
    instagram:    "@creatorstudio",
    tiktok:       "@creator.studio",
    youtube:      "@CreatorStudio",
    website:      "+1143546878",
  });

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <>
      <style>{`
        .pi-grid-2 { grid-template-columns: 1fr 1fr; }
        @media (max-width: 640px) {
          .pi-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="min-h-screen p-6" >

        {/* Breadcrumb — only when coming from Profile */}
        

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1" style={{ gap: 12 }}>
            <h1 className="text-white font-extrabold" style={{ fontSize: "clamp(18px, 5vw, 30px)", margin: 0 }}>Personal Info</h1>
            <button
              className="pi-save-btn rounded-xl text-white font-bold hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(90deg,#8D45FE,#FD4FDA)", flexShrink: 0, whiteSpace: "nowrap", padding: "8px 16px", fontSize: 13, border: "none", cursor: "pointer" }}
            >
              Save Changes
            </button>
          </div>
          <p className="text-sm" style={{ color: "#9191A8", margin: 0 }}>
            Update your identity, contact details, and how others see you across BlinkShort AI.
          </p>
        </div>

        {/* Profile picture */}
        <div className="rounded-2xl p-6 mb-4" style={{ background: "#060B28", border: "1px solid #222" }}>
          <div className="flex items-center gap-5">
            <div
              className="rounded-2xl flex items-center justify-center text-white font-extrabold flex-shrink-0"
              style={{ width: 56, height: 56, fontSize: 18, background: "linear-gradient(135deg,#8D45FE,#FD4FDA)" }}
            >
              AK
            </div>
            <div style={{ minWidth: 0 }}>
              <p className="text-white font-bold text-base mb-0.5">Profile picture</p>
              <p className="text-xs mb-3" style={{ color: "#9191A8" }}>PNG or JPG, 1:1 ratio · max 4 MB</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileRef.current.click()}
                  className="text-sm font-semibold px-4 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
                  style={{ background: "rgba(141,69,254,0.15)", color: "#a78bfa", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  Upload new
                </button>
                <button
                  className="text-sm font-semibold hover:opacity-80 transition-opacity"
                  style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer" }}
                >
                  Remove
                </button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Personal info fields */}
        <div className="rounded-2xl p-6 mb-4" style={{ background: "#060B28", border: "1px solid #222" }}>
          <div className="pi-grid-2 grid gap-x-6 gap-y-5">
            <Field label="Display name" value={form.displayName}  onChange={set("displayName")} />
            <Field label="Display name" value={form.displayName2} onChange={set("displayName2")} />
            <Field label="Email"        value={form.email}        onChange={set("email")}   type="email" />
            <Field label="Phone"        value={form.phone}        onChange={set("phone")}   type="tel" />
            <Field label="Country"      value={form.country}      onChange={set("country")} />
            <Field label="Timezone"     value={form.timezone}     onChange={set("timezone")} />
          </div>
        </div>

        {/* Bio */}
        <div className="rounded-2xl p-6 mb-4" style={{ background: "#060B28", border: "1px solid #222" }}>
          <p className="text-white font-bold text-base mb-1">Bio</p>
          <p className="text-xs mb-4" style={{ color: "#9191A8" }}>A short intro shown on shared reels and your public profile.</p>
          <div style={{ position: "relative" }}>
            <textarea
              value={form.bio}
              onChange={(e) => set("bio")(e.target.value)}
              maxLength={240}
              rows={5}
              style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
              onFocus={(e) => (e.target.style.borderColor = "#8D45FE")}
              onBlur={(e) => (e.target.style.borderColor = "#1a1a2e")}
            />
            <span style={{ position: "absolute", bottom: 10, right: 14, fontSize: 11, color: "#9191A8" }}>
              {form.bio.length} / 240
            </span>
          </div>
        </div>

        {/* Social handles */}
        <div className="rounded-2xl p-6" style={{ background: "#060B28", border: "1px solid #222" }}>
          <p className="text-white font-bold text-base mb-1">Social handles</p>
          <p className="text-xs mb-5" style={{ color: "#9191A8" }}>Used for caption tagging and one-click publishing.</p>
          <div className="pi-grid-2 grid gap-x-6 gap-y-5">
            <Field label="Instagram" value={form.instagram} onChange={set("instagram")} />
            <Field label="TikTok"    value={form.tiktok}    onChange={set("tiktok")} />
            <Field label="YouTube"   value={form.youtube}   onChange={set("youtube")} />
            <Field label="Website"   value={form.website}   onChange={set("website")} />
          </div>
        </div>

      </div>
    </>
  );
}