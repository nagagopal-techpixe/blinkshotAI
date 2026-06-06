import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
} from "recharts";

const performanceData = [
  { day: "Mon", views: 320000, engagement: 180000 },
  { day: "Tue", views: 480000, engagement: 210000 },
  { day: "Wed", views: 410000, engagement: 195000 },
  { day: "Thu", views: 620000, engagement: 280000 },
  { day: "Fri", views: 590000, engagement: 310000 },
  { day: "Sat", views: 780000, engagement: 370000 },
  { day: "Sun", views: 1240000, engagement: 420000 },
];

const platformData = [
  { name: "Instagram", value: 82, color: "#f97316" },
  { name: "YouTube",   value: 61, color: "#22d3ee" },
  { name: "TikTok",    value: 44, color: "#a78bfa" },
  { name: "Facebook",  value: 24, color: "#38bdf8" },
];

const topReels = [
  {
    title: "Sharma Wedding Highlight",
    platform: "Instagram",
    category: "Wedding",
    views: "84K",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=120&q=80",
  },
  {
    title: "Maldives Travel Reel",
    platform: "YouTube",
    category: "Travel",
    views: "212K",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&q=80",
  },
  {
    title: "FashionBrand Q2 Campaign",
    platform: "Instagram",
    category: "Product",
    views: "148K",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=120&q=80",
  },
  {
    title: "TechConf Highlights",
    platform: "YouTube",
    category: "Event",
    views: "92K",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=120&q=80",
  },
];

const statCards = [
  { label: "Total Views",    value: "1.24M", delta: "+24.6%", positive: true  },
  { label: "Engagement",     value: "18.9%", delta: "+3.2%",  positive: true  },
  { label: "Shares",         value: "42.1k", delta: "−1.8%",  positive: false },
  { label: "Avg Watch Time", value: "0:38",  delta: "+5s",    positive: true  },
];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#060B28", border: "1px solid #2a2a4a",
      borderRadius: 12, padding: "10px 16px", fontSize: 12,
    }}>
      <p style={{ color: "#9191A8", marginBottom: 6 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, margin: "2px 0", fontWeight: 700 }}>
          {p.name}: {(p.value / 1000).toFixed(0)}K
        </p>
      ))}
    </div>
  );
}

function PlatformLegend({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map(({ name, value, color }) => (
        <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: color, flexShrink: 0 }} />
            <span style={{ color: "#9191A8", fontSize: 13 }}>{name}</span>
          </div>
          <span style={{ color: "white", fontWeight: 700, fontSize: 13 }}>{value}%</span>
        </div>
      ))}
    </div>
  );
}

const card = {
  background: "#060B28",
  border: "1px solid #222",
  borderRadius: 16,
  padding: 16,
  boxSizing: "border-box",
  width: "100%",
  overflow: "hidden",
};

export default function Analytics() {
  const [range, setRange] = useState("1 week");
  const ranges = ["1 day", "1 week", "1 month", "3 months"];

  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 1024;

  /* donut size scaled to available width */
  const donutSize = Math.min(160, isMobile ? (w - 80) / 2 : 160);
  const donutR2 = donutSize * 0.45;
  const donutR1 = donutSize * 0.325;

  return (
    <div style={{
      minHeight: "100vh",
      padding: isMobile ? "12px" : "24px",
    
      fontFamily: "sans-serif",
      boxSizing: "border-box",
      overflowX: "hidden",
      width: "100%",
    }}>

      {/* Header */}
      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 20,
        width: "100%",
        boxSizing: "border-box",
      }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ color: "#fff", fontSize: isMobile ? 20 : 28, fontWeight: 800, marginBottom: 4, margin: 0 }}>
            Creator Analytics
          </h1>
          <p style={{ color: "#9191A8", fontSize: 12, marginTop: 4 }}>
            Track reach, engagement and monetization.
          </p>
        </div>

        {/* Range selector */}
        <div style={{
          display: "flex", gap: 3,
          background: "#0d1235", border: "1px solid #222",
          borderRadius: 12, padding: 4, flexShrink: 0,
          width: isMobile ? "100%" : "auto",
          boxSizing: "border-box",
        }}>
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                padding: isMobile ? "5px 0" : "6px 14px",
                borderRadius: 8,
                fontSize: isMobile ? 11 : 13,
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
                flex: isMobile ? 1 : "none",
                background: range === r ? "linear-gradient(90deg,#8D45FE,#FD4FDA)" : "transparent",
                color: range === r ? "white" : "#9191A8",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards — 2 cols on mobile, 4 on desktop */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
        gap: isMobile ? 8 : 14,
        marginBottom: 16,
        width: "100%",
        boxSizing: "border-box",
      }}>
        {statCards.map(({ label, value, delta, positive }) => (
          <div key={label} style={{ ...card, padding: isMobile ? 12 : 16 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8, gap: 4 }}>
              <p style={{ color: "#9191A8", fontSize: isMobile ? 10 : 12, margin: 0 }}>{label}</p>
              <span style={{
                fontSize: 9, fontWeight: 700, padding: "2px 5px", borderRadius: 5, flexShrink: 0,
                background: positive ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)",
                color: positive ? "#4ADE80" : "#f87171",
              }}>{delta}</span>
            </div>
            <p style={{ color: "#fff", fontSize: isMobile ? 20 : 26, fontWeight: 800, margin: 0, lineHeight: 1 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Line chart — full width, always */}
      <div style={{ ...card, marginBottom: 16 }}>
        <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "0 0 2px" }}>Performance over time</p>
        <p style={{ color: "#9191A8", fontSize: 12, margin: "0 0 12px" }}>Views vs Engagement</p>
        <div style={{ display: "flex", gap: 14, marginBottom: 10 }}>
          {[{ label: "Views", color: "#22d3ee" }, { label: "Engagement", color: "#FD4FDA" }].map(({ label, color }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
              <span style={{ color: "#9191A8", fontSize: 11 }}>{label}</span>
            </div>
          ))}
        </div>
        {/* Key fix: width="99%" prevents recharts overflow bug */}
        <ResponsiveContainer width="99%" height={180}>
          <LineChart data={performanceData} margin={{ left: 0, right: 4, top: 4, bottom: 0 }}>
            <CartesianGrid stroke="#1a1a2e" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: "#9191A8", fontSize: isMobile ? 10 : 12 }}
              axisLine={false} tickLine={false}
            />
            <YAxis hide />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="views" stroke="#22d3ee" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: "#22d3ee" }} />
            <Line type="monotone" dataKey="engagement" stroke="#FD4FDA" strokeWidth={2} strokeDasharray="5 4" dot={false} activeDot={{ r: 4, fill: "#FD4FDA" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Platform split + Top Reels — stacked on mobile, side by side on desktop */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile || isTablet ? "1fr" : "300px 1fr",
        gap: 16,
        marginBottom: 16,
        width: "100%",
        boxSizing: "border-box",
      }}>

        {/* Platform donut */}
        <div style={card}>
          <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "0 0 14px" }}>Platform Split</p>
          <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <PieChart width={donutSize} height={donutSize}>
                <Pie
                  data={platformData}
                  cx={donutSize / 2} cy={donutSize / 2}
                  innerRadius={donutR1} outerRadius={donutR2}
                  dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}
                >
                  {platformData.map(({ color }, i) => (
                    <Cell key={i} fill={color} />
                  ))}
                </Pie>
              </PieChart>
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none",
              }}>
                <p style={{ color: "#fff", fontSize: donutSize * 0.12, fontWeight: 800, lineHeight: 1, margin: 0 }}>1.28M</p>
                <p style={{ color: "#9191A8", fontSize: donutSize * 0.07, margin: 0 }}>Total views</p>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <PlatformLegend data={platformData} />
            </div>
          </div>
        </div>

        {/* Top Performing Reels */}
        <div style={card}>
          <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "0 0 14px" }}>Top Performing Reels</p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {topReels.map(({ title, platform, category, views, img }, i) => (
              <div
                key={title}
                style={{
                  display: "flex", alignItems: "center", gap: isMobile ? 8 : 14,
                  padding: "12px 0",
                  borderBottom: i < topReels.length - 1 ? "1px solid #1a1a2e" : "none",
                }}
              >
                <img
                  src={img} alt={title}
                  style={{ width: isMobile ? 48 : 60, height: isMobile ? 36 : 44, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    color: "white", fontWeight: 700, fontSize: isMobile ? 12 : 13,
                    margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>{title}</p>
                  <p style={{ color: "#9191A8", fontSize: 11, margin: 0 }}>{platform} · {category}</p>
                </div>
                <span style={{ color: "white", fontWeight: 800, fontSize: isMobile ? 13 : 16, flexShrink: 0 }}>{views}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}