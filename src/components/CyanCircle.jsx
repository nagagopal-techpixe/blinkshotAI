// cyan circle — 521×521, #00E6FE 32%, top 255px, blur 220, rotation -180°
export default function CyanCircle({ className = "" }) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width:     521,
        height:    521,
        background: "#00E6FE",
        opacity:   0.32,
        filter:    "blur(220px)",
        transform: "rotate(-180deg)",
        top:       255,
      }}
    />
  );
}