export default function GlowBackground() {
  return (
    <>
      {/* Top-right glow */}
      <div style={{
        position: "fixed",
        top: -100,
        right: -100,
        width: 800,
        height: 800,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(141,69,254,0.4) 0%, rgba(141,69,254,0.15) 40%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />
    </>
  );
}