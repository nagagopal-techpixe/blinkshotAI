import { useState, useEffect } from "react";

const invoices = [
  { id: "INV-2026-005", date: "May 1, 2026",  amount: "$39.00" },
  { id: "INV-2026-004", date: "Apr 1, 2026",  amount: "$39.00" },
  { id: "INV-2026-003", date: "Mar 1, 2026",  amount: "$39.00" },
  { id: "INV-2026-002", date: "Feb 1, 2026",  amount: "$39.00" },
];

function CheckIcon({ included, studio }) {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      {included ? (
        <>
          <circle cx="12" cy="12" r="10" fill={studio ? "rgba(255,255,255,0.2)" : "rgba(141,69,254,0.2)"} />
          <polyline points="8 12 11 15 16 9" stroke={studio ? "#fff" : "#8D45FE"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="10" fill="rgba(145,145,168,0.1)" />
          <line x1="9" y1="9" x2="15" y2="15" stroke="#9191A8" strokeWidth="2" strokeLinecap="round" />
          <line x1="15" y1="9" x2="9" y2="15" stroke="#9191A8" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="#9191A8" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div style={{
      background: "#060B28", border: "1px solid #222", borderRadius: 16,
      padding: 24, minHeight: 420, display: "flex", flexDirection: "column", gap: 12,
    }}>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}.sk{background:linear-gradient(90deg,#1a1a2e 25%,#222244 50%,#1a1a2e 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:6px}`}</style>
      <div className="sk" style={{ height: 14, width: "40%" }} />
      <div className="sk" style={{ height: 42, width: "55%" }} />
      <div className="sk" style={{ height: 12, width: "80%" }} />
      <div className="sk" style={{ height: 12, width: "70%", marginTop: 8 }} />
      {[1,2,3,4,5].map(i => <div key={i} className="sk" style={{ height: 12, width: "90%" }} />)}
      <div className="sk" style={{ height: 44, borderRadius: 12, marginTop: "auto" }} />
    </div>
  );
}

function getPopularIndex(plans) {
  if (plans.length === 0) return -1;
  return Math.floor(plans.length / 2);
}

function parsePrice(price) {
  const n = parseFloat(price);
  return isNaN(n) ? 0 : n;
}

export default function Subscription() {
  const [plans,   setPlans]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    fetch("http://localhost:9000/api/packages")
      .then(r => r.json())
      .then(json => {
        if (json.success) setPlans(json.data);
        else setError("Failed to load plans.");
      })
      .catch(() => setError("Could not reach the server."))
      .finally(() => setLoading(false));
  }, []);

  const popularIdx = getPopularIndex(plans);

  return (
    <div style={{ minHeight: "100vh", padding: "24px 16px", fontFamily: "sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: "#fff", fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 800, marginBottom: 4 }}>
          Subscription
        </h1>
        <p style={{ color: "#9191A8", fontSize: 13 }}>Manage subscription, credits, and payment.</p>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 24, color: "#f87171", fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Pricing cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 20,
        marginBottom: 24,
      }}>
        {loading
          ? [1, 2, 3].map(k => <SkeletonCard key={k} />)
          : plans.map((plan, idx) => {
              const isPopular = idx === popularIdx;
              const price     = parsePrice(plan.price);
              const isFree    = price === 0;

              const cardStyle = isPopular
                ? { background: "linear-gradient(160deg,#4a1aee 0%,#7c3aed 40%,#a855f7 100%)", border: "1px solid rgba(255,255,255,0.15)" }
                : { background: "#060B28", border: "1px solid #222" };

              const btnStyle = isPopular
                ? { background: "#fff", color: "#060B28" }
                : { background: "linear-gradient(90deg,#8D45FE,#FD4FDA)", color: "#fff" };

              const subColor = isPopular ? "rgba(255,255,255,0.6)" : "#9191A8";

              return (
                <div
                  key={plan._id}
                  style={{
                    ...cardStyle,
                    borderRadius: 16, padding: 24,
                    position: "relative", display: "flex",
                    flexDirection: "column", minHeight: 420,
                  }}
                >
                  {isPopular && (
                    <div style={{
                      position: "absolute", top: 0, right: 24,
                      padding: "4px 14px", fontSize: 11, fontWeight: 700, color: "#fff",
                      background: "linear-gradient(135deg,#8D45FE,#FD4FDA)",
                      borderRadius: "0 0 10px 10px", letterSpacing: "0.03em",
                    }}>
                      Most Popular
                    </div>
                  )}

                  <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: isPopular ? "rgba(255,255,255,0.8)" : "#9191A8" }}>
                    {plan.title}
                  </p>

                  <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 4 }}>
                    <span style={{ color: "#fff", fontSize: 42, fontWeight: 800, lineHeight: 1 }}>
                      {isFree ? "Free" : `$${price}`}
                    </span>
                    {!isFree && (
                      <span style={{ fontSize: 13, marginBottom: 6, color: subColor }}>
                        / {plan.interval?.toLowerCase() || "month"}
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: 12, marginBottom: 20, lineHeight: 1.5, color: subColor }}>
                    {plan.selectedServices}
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, marginBottom: 20 }}>
                    {plan.features?.map((f, fi) => (
                      <div key={fi} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <CheckIcon included={true} studio={isPopular} />
                        <span style={{ fontSize: 12, color: "#fff" }}>{f.label}: {f.value}</span>
                      </div>
                    ))}
                    {[
                      { label: "OpenAI Features",            included: plan.openAi     },
                      { label: "Log History",                included: plan.logHistory },
                      { label: "Coupon Support",             included: plan.coupon     },
                      { label: `Storage ${plan.storageDays} days`, included: true     },
                    ].map(({ label, included }) => (
                      <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <CheckIcon included={included} studio={isPopular} />
                        <span style={{ fontSize: 12, color: included ? "#fff" : "#9191A8" }}>{label}</span>
                      </div>
                    ))}
                  </div>

                  <button style={{
                    ...btnStyle,
                    width: "100%", padding: "12px 0", borderRadius: 12,
                    fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
                  }}>
                    {isFree ? "Get Started" : `Upgrade to ${plan.title}`}
                  </button>
                </div>
              );
            })
        }
      </div>

      {/* Bottom section */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 20,
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { pct: "20% OFF", label: "6-Month Plan", color: "#8D45FE" },
              { pct: "50% OFF", label: "Yearly Plan",  color: "#4ADE80" },
            ].map(({ pct, label, color }) => (
              <div key={label} style={{ background: "#060B28", border: "1px solid #222", borderRadius: 16, padding: 20 }}>
                <p style={{ color, fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{pct}</p>
                <p style={{ color: "#9191A8", fontSize: 12 }}>{label}</p>
              </div>
            ))}
          </div>

          <div style={{ background: "#060B28", border: "1px solid #222", borderRadius: 16, padding: 20 }}>
            <p style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Payment method</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ background: "#1a1a2e", padding: "6px 10px", borderRadius: 8, fontWeight: 800, fontSize: 13, color: "#1a56db", letterSpacing: "-0.5px" }}>
                  VISA
                </div>
                <div>
                  <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>•••• 4242</p>
                  <p style={{ color: "#9191A8", fontSize: 11 }}>Expires 09/28</p>
                </div>
              </div>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "#8D45FE", fontSize: 12, fontWeight: 600 }}>
                Update
              </button>
            </div>
            <button style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#9191A8", fontSize: 12, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 4, padding: 0,
            }}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add another method
            </button>
          </div>
          add 
        </div>

        <div style={{ background: "#060B28", border: "1px solid #222", borderRadius: 16, padding: 20 }}>
          <p style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Invoices</p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {invoices.map(({ id, date, amount }, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: i < invoices.length - 1 ? "1px solid #1a1a2e" : "none",
              }}>
                <div>
                  <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{id}</p>
                  <p style={{ color: "#9191A8", fontSize: 11 }}>{date}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{amount}</span>
                  <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <DownloadIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}