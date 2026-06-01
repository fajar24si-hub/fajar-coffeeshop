// src/components/ui/ScrollIndicator.jsx
export default function ScrollIndicator() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 28,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        zIndex: 10,
      }}
    >
      <span
        style={{
          color: "rgba(122,98,71,0.6)",
          fontSize: 10,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
        }}
      >
        Scroll
      </span>
      <div
        style={{
          width: 20,
          height: 32,
          border: "1px solid rgba(122,98,71,0.3)",
          borderRadius: 10,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "5px 0",
        }}
      >
        <div
          className="scroll-dot"
          style={{ width: 4, height: 7, background: "#D4963A", borderRadius: 4 }}
        />
      </div>
    </div>
  );
}
