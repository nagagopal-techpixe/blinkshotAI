import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi"; // adjust path as needed
import { useToast } from "../../components/Toast"; // adjust path as needed

export default function Register() {
  const navigate = useNavigate();
  const showToast = useToast();

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    rememberMe: false,
  });

  const socialList = [
    {
      label: "Google",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#4285F4" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#34A853" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
    },
    {
      label: "Apple",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#000">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ),
    },
    {
      label: "Facebook",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      label: "Twitter",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
  ];

  //Field change handler ───────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  //Client-side validation ─────
  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\+?[0-9]{7,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Enter a valid phone number.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    return newErrors;
  };

  //Register handler ─
  const handleRegister = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast({
        type: "error",
        message: "Please fix the highlighted errors before continuing.",
      });
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        fullName: formData.fullName.trim(),
        mobile: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      showToast({
        type: "success",
        message: "Account created successfully! Welcome aboard 🎉",
      });

      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed. Please try again.";
      showToast({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .register-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 24px 16px;
        }

        .register-card {
          width: 100%;
          max-width: 408px;
          border-radius: 20px;
          padding: 32px;
          background: rgba(0, 0, 0, 0.32);
          border: 1px solid #272727;
          box-shadow: inset 0 0 21px 0 rgba(255, 255, 255, 0.52);
        }

        /*Logo*/
        .logo-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .logo-icon {
          width: 46px; height: 46px;
          border-radius: 12px;
          flex-shrink: 0;
          background: linear-gradient(135deg, #8D45FE 0%, #FD4FDA 100%);
          display: flex; align-items: center; justify-content: center;
        }
        .logo-text { display: flex; align-items: center; gap: 4px; }
        .logo-text span.brand   { color: #fff; font-weight: 700; font-size: 20px; letter-spacing: -0.5px; }
        .logo-text span.accent  { color: #FD4FDA; font-weight: 700; font-size: 20px; letter-spacing: -0.5px; }
        .logo-text span.badge   {
          font-size: 10px; font-weight: 600;
          padding: 2px 6px; border-radius: 4px;
          background: #2a2a3a; color: #9191A8;
          margin-left: 2px;
        }

        /*Headings*/
        .card-title {
          color: #fff; font-size: 24px; font-weight: 700;
          margin: 0 0 4px;
        }
        .card-sub {
          color: #9191A8; font-size: 14px;
          margin: 0 0 20px;
        }

        /*Fields*/
        .field { margin-bottom: 16px; }
        .field label {
          display: block;
          color: #fff; font-size: 14px; font-weight: 500;
          margin-bottom: 6px;
        }
        .field input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          background: #1a1a26;
          border: 1px solid #2a2a3a;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .field input::placeholder { color: #9191A8; }
        .field input:focus { border-color: #8D45FE; }
        .field input.input-error { border-color: #FF4D6D !important; }

        /* Field error text */
        .field-error {
          display: block;
          color: #FF4D6D;
          font-size: 12px;
          margin-top: 5px;
        }

        /* Password wrapper */
        .pw-wrap { position: relative; }
        .pw-wrap input { padding-right: 44px; }
        .pw-toggle {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #9191A8; display: flex; align-items: center;
          padding: 0; transition: color 0.2s;
        }
        .pw-toggle:hover { color: #fff; }

        /*Remember / Forgot row*/
        .meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .remember-label {
          display: flex; align-items: center; gap: 8px;
          font-size: 14px; color: #9191A8; cursor: pointer;
        }
        .remember-label input[type="checkbox"] {
          width: 16px; height: 16px;
          accent-color: #8D45FE; cursor: pointer;
        }
        .forgot-link {
          font-size: 14px; color: #fff;
          text-decoration: none;
          transition: color 0.2s;
        }
        .forgot-link:hover { color: #FD4FDA; }

        /*CTA Button*/
        .cta-btn {
          width: 100%;
          padding: 13px;
          border-radius: 100px;
          border: none;
          background: linear-gradient(90deg, #8D45FE, #FD4FDA);
          color: #fff;
          font-size: 15px; font-weight: 700;
          cursor: pointer;
          margin-bottom: 20px;
          transition: opacity 0.2s, transform 0.15s;
        }
        .cta-btn:hover  { opacity: 0.9; }
        .cta-btn:active { transform: scale(0.98); }
        .cta-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /*Divider*/
        .divider {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 16px;
        }
        .divider hr {
          flex: 1; height: 1px; border: none;
          background: #2a2a3a;
        }
        .divider span { font-size: 12px; color: #9191A8; white-space: nowrap; }

        /*Social buttons*/
        .social-row {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }
        .social-btn {
          flex: 1;
          display: flex; align-items: center; justify-content: center;
          gap: 6px;
          padding: 10px 4px;
          border-radius: 100px;
          border: 1px solid #e5e7eb;
          background: #fff;
          color: #111;
          font-size: 12px; font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
          white-space: nowrap;
        }
        .social-btn:hover { opacity: 0.8; }

        /*Footer*/
        .signin-footer {
          text-align: center;
          font-size: 14px; color: #9191A8;
        }
        .signin-footer a {
          color: #fff; font-weight: 700;
          text-decoration: none;
          transition: color 0.2s;
        }
        .signin-footer a:hover { color: #FD4FDA; }

        /*Spinner*/
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        /* ════════════════════════════════
           RESPONSIVE BREAKPOINTS
        ════════════════════════════════ */
        @media (max-width: 480px) {
          .register-card {
            padding: 24px 20px;
            border-radius: 16px;
          }
          .card-title { font-size: 22px; }
          .social-btn span { display: none; }
          .social-btn { gap: 0; padding: 10px; }
        }

        @media (max-width: 360px) {
          .register-card { padding: 20px 16px; }
          .logo-icon { width: 38px; height: 38px; border-radius: 10px; }
          .logo-text span.brand,
          .logo-text span.accent { font-size: 18px; }
          .card-title { font-size: 20px; }
        }
      `}</style>

      <div className="register-wrapper">
        <div className="register-card">

          {/* Logo */}
          <div className="logo-row">
            <div className="logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M5 4h8a4 4 0 010 8H5V4z" fill="white" fillOpacity="0.9"/>
                <path d="M5 12h9a4 4 0 010 8H5V12z" fill="white"/>
              </svg>
            </div>
            <div className="logo-text">
              <span className="brand">Blink</span>
              <span className="accent">Short</span>
              <span className="badge">AI</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="card-title">Create account</h1>
          <p className="card-sub">Join thousands of users today</p>

          {/* Full Name */}
          <div className="field">
            <label>Full name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? "input-error" : ""}
            />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </div>

          {/* Phone */}
          <div className="field">
            <label>Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your mobile number"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "input-error" : ""}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          {/* Email */}
          <div className="field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="field" style={{ marginBottom: 12 }}>
            <label>Password</label>
            <div className="pw-wrap">
              <input
                type={showPw ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
              />
              <button className="pw-toggle" onClick={() => setShowPw((v) => !v)}>
                {showPw ? (
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M17.94 17.94A10.06 10.06 0 0112 20C6 20 2 12 2 12a17.6 17.6 0 015.06-6.06M9.9 4.24A9.12 9.12 0 0112 4c6 0 10 8 10 8a17.6 17.6 0 01-2.36 3.29M1 1l22 22" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {/* Remember + Forgot */}
          <div className="meta-row">
            <label className="remember-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Remember Me
            </label>
            <a
              href="/forgot-password"
              className="forgot-link"
              onClick={(e) => { e.preventDefault(); navigate("/forgot-password"); }}
            >
              Forgot Password
            </a>
          </div>

          {/* Sign Up Button */}
          <button
            className="cta-btn"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading && <span className="spinner" />}
            {loading ? "Creating account…" : "Sign Up"}
          </button>

          {/* Divider */}
          <div className="divider">
            <hr /><span>or continue with</span><hr />
          </div>

          {/* Social */}
          <div className="social-row">
            {socialList.map(({ label, icon }) => (
              <button key={label} className="social-btn">
                {icon}<span>{label}</span>
              </button>
            ))}
          </div>

          {/* Login link */}
          <p className="signin-footer">
            Already have an account?{" "}
            <a
              href="/login"
              onClick={(e) => { e.preventDefault(); navigate("/login"); }}
            >
              Sign in
            </a>
          </p>

        </div>
      </div>
    </>
  );
}