import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp, resendOtp, saveAuth } from "../../api/authApi";
import { useToast } from "../../components/Toast";

const inputBase = {
  width: "100%", padding: "11px 14px", borderRadius: 10,
  background: "#1a1a26", color: "#fff", fontSize: 14,
  outline: "none", boxSizing: "border-box",
};

const RESEND_WAIT = 20;

export default function LoginOtpTab({ Divider, SocialButtons, Footer }) {
  const navigate  = useNavigate();
  const showToast = useToast();

  const [step, setStep]               = useState("phone");
  const [phone, setPhone]             = useState("");
  const [otp, setOtp]                 = useState(["", "", "", "", "", ""]);
  const [timer, setTimer]             = useState(RESEND_WAIT);
  const [timerActive, setTimerActive] = useState(false);
  const [focusedOtp, setFocusedOtp]   = useState(-1);
  const [loading, setLoading]         = useState(false);
  const [devOtp, setDevOtp]           = useState("");  // dev mode OTP display

  const otpRefs  = useRef([]);
  const timerRef = useRef(null);

  //Timer ───
  const startTimer = (seconds = RESEND_WAIT) => {
    setTimer(seconds);
    setTimerActive(true);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); setTimerActive(false); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  //OTP input handlers 
  const handleOtpChange = (i, val) => {
    const d = val.replace(/\D/g, "").slice(-1);
    const n = [...otp]; n[i] = d; setOtp(n);
    if (d && i < 5) { otpRefs.current[i + 1]?.focus(); setFocusedOtp(i + 1); }
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      const n = [...otp]; n[i - 1] = ""; setOtp(n);
      otpRefs.current[i - 1]?.focus(); setFocusedOtp(i - 1);
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const n = ["", "", "", "", "", ""];
    digits.split("").forEach((d, i) => { n[i] = d; });
    setOtp(n);
    const fi = Math.min(digits.length, 5);
    otpRefs.current[fi]?.focus(); setFocusedOtp(fi);
  };

  const getOtpBorder = (i) =>
    otp[i]          ? "1.5px solid #FD4FDA"
    : focusedOtp === i ? "1.5px solid #8D45FE"
    : "1.5px solid #2a2a3a";

  //auto-fill dev OTP into boxes 
  const autoFillDevOtp = () => {
    const digits = devOtp.split("");
    setOtp(digits);
    otpRefs.current[5]?.focus();
    setFocusedOtp(5);
  };

  //Send OTP 
  const handleSendOtp = async () => {
    setDevOtp("");
    if (phone.trim().length < 8) {
      showToast({ type: "error", message: "Enter a valid mobile number." });
      return;
    }
    try {
      setLoading(true);
      const data = await sendOtp(phone.trim());

      // show OTP on screen in dev mode
      if (data.devOtp) setDevOtp(data.devOtp);

      setStep("verify");
      setOtp(["", "", "", "", "", ""]);
      startTimer(data.resendAvailableIn || RESEND_WAIT);
      showToast({ type: "success", message: "OTP sent successfully!" });
      setTimeout(() => { otpRefs.current[0]?.focus(); setFocusedOtp(0); }, 100);
    } catch (err) {
      const status = err.response?.status;
      const msg    = err.response?.data?.message || "Failed to send OTP.";
      const wait   = err.response?.data?.waitSeconds;

      if (status === 404) {
        // number not registered — show toast with register button
        showToast({ type: "error", message: "Mobile not registered. Please sign up first." });
        setTimeout(() => navigate("/register"), 1500);
        return;
      }

      if (wait) {
        showToast({ type: "error", message: `Please wait ${wait}s before resending.` });
        return;
      }

      showToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };


  const handleResend = async () => {
    setDevOtp("");
    try {
      setLoading(true);
      const data = await resendOtp(phone.trim());

      if (data.devOtp) setDevOtp(data.devOtp);

      setOtp(["", "", "", "", "", ""]);
      startTimer(data.resendAvailableIn || RESEND_WAIT);
      showToast({ type: "success", message: "New OTP sent!" });
      setTimeout(() => { otpRefs.current[0]?.focus(); setFocusedOtp(0); }, 100);
    } catch (err) {
      const msg  = err.response?.data?.message || "Failed to resend OTP.";
      const wait = err.response?.data?.waitSeconds;
      if (wait) startTimer(wait);
      showToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  //Verify OTP ────────
  const handleVerify = async () => {
    const otpStr = otp.join("");
    if (otpStr.length < 6) {
      otpRefs.current[otpStr.length]?.focus();
      showToast({ type: "error", message: "Please enter all 6 digits." });
      return;
    }
    try {
      setLoading(true);
      const data = await verifyOtp({ mobile: phone.trim(), otp: otpStr });
      saveAuth(data.token, data.user);
      showToast({ type: "success", message: "Verified! Welcome back 🎉" });
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      const res = err.response?.data;
      showToast({ type: "error", message: res?.message || "OTP verification failed." });
      if (res?.attemptsLeft === 0) {
        setTimeout(() => { setStep("phone"); setOtp(["","","","","",""]); setDevOtp(""); }, 1500);
      }
    } finally {
      setLoading(false);
    }
  };


  if (step === "phone") {
    return (
      <>
        <div style={{ marginBottom: 14 }}>
          <label style={{ color: "#fff", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
            Mobile Number
          </label>
          <input
            type="tel"
            placeholder="Enter your registered mobile number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSendOtp()}
            style={{ ...inputBase, border: "1.5px solid #00E6FE" }}
          />
        </div>

        <button
          onClick={handleSendOtp}
          disabled={loading || phone.trim().length < 8}
          style={{
            width: "100%", padding: "12px 0", borderRadius: 999,
            color: "#fff", fontWeight: 700, fontSize: 15, border: "none",
            marginBottom: 20,
            background: "linear-gradient(90deg,#8D45FE,#FD4FDA)",
            opacity: (loading || phone.trim().length < 8) ? 0.55 : 1,
            cursor: (loading || phone.trim().length < 8) ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Checking..." : "Send OTP"}
        </button>

        <Divider />
        <SocialButtons />
        <Footer />
      </>
    );
  }


  return (
    <>
      {/* Back */}
      <button
        onClick={() => { setStep("phone"); setDevOtp(""); }}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#9191A8", fontSize: 13, marginBottom: 12, padding: 0, display: "flex", alignItems: "center", gap: 4 }}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Change number
      </button>

      <h2 style={{ color: "#fff", fontSize: 19, fontWeight: 700, margin: "0 0 4px" }}>Enter OTP</h2>
      <p style={{ color: "#9191A8", fontSize: 13, margin: "0 0 14px" }}>
        6-digit code sent to <span style={{ color: "#fff", fontWeight: 600 }}>{phone}</span>
      </p>

      {/*Dev mode OTP banner*/}
      {devOtp && (
        <div style={{
          background: "rgba(141,69,254,0.12)",
          border: "1px dashed #8D45FE",
          borderRadius: 10, padding: "10px 14px",
          marginBottom: 16,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <p style={{ color: "#9191A8", fontSize: 10, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: 1 }}>
              Dev mode — your OTP
            </p>
            <p style={{ color: "#fff", fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: 8 }}>
              {devOtp}
            </p>
          </div>
          <button
            onClick={autoFillDevOtp}
            style={{
              background: "#8D45FE", border: "none", borderRadius: 8,
              color: "#fff", fontSize: 12, fontWeight: 600,
              padding: "7px 14px", cursor: "pointer",
            }}
          >
            Auto-fill
          </button>
        </div>
      )}

      {/* OTP boxes */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 7, marginBottom: 14 }}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => otpRefs.current[i] = el}
            type="text" inputMode="numeric" maxLength={1} value={digit}
            onChange={e => handleOtpChange(i, e.target.value)}
            onKeyDown={e => handleOtpKeyDown(i, e)}
            onFocus={() => setFocusedOtp(i)}
            onBlur={() => setFocusedOtp(-1)}
            onPaste={i === 0 ? handleOtpPaste : undefined}
            style={{
              width: "100%", height: 48, borderRadius: 10, textAlign: "center",
              fontSize: 20, fontWeight: 700, color: "#fff",
              background: "#1a1a26", border: getOtpBorder(i),
              outline: "none", caretColor: "#8D45FE", boxSizing: "border-box",
            }}
          />
        ))}
      </div>

      {/* Resend row */}
      <div style={{ marginBottom: 16, fontSize: 13 }}>
        <span style={{ color: "#fff", fontWeight: 600 }}>Didn't receive? </span>
        {timerActive
          ? <span style={{ color: "#9191A8" }}>
              Resend in <span style={{ color: "#fff", fontWeight: 700 }}>{timer}s</span>
            </span>
          : <button
              onClick={handleResend}
              disabled={loading}
              style={{ color: "#FD4FDA", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, padding: 0 }}
            >
              {loading ? "Sending..." : "Resend OTP"}
            </button>
        }
      </div>

      {/* Verify button */}
      <button
        onClick={handleVerify}
        disabled={loading}
        style={{
          width: "100%", padding: "12px 0", borderRadius: 999,
          color: "#fff", fontWeight: 700, fontSize: 15,
          border: "none", cursor: loading ? "not-allowed" : "pointer",
          marginBottom: 20, opacity: loading ? 0.7 : 1,
          background: "linear-gradient(90deg,#8D45FE,#FD4FDA)",
        }}
      >
        {loading ? "Verifying..." : "Verify & Sign In"}
      </button>

      <Divider />
      <SocialButtons />
      <Footer />
    </>
  );
}