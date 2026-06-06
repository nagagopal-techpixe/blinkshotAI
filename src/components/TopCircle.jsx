// top circle — 620×620, linear-gradient #8D45FE → #FD4FDA, blur 220, rotation -180°
export default function TopCircle({ className = "" }) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width:      520,
        height:     520,
        background: "linear-gradient(135deg, #8D45FE, #FD4FDA)",
        opacity:    1,
        filter:     "blur(180px)",
        transform:  "rotate(-180deg)",
      }}
    />
  );
}