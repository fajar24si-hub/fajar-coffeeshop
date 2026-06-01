// src/components/ui/HeroBadge.jsx
import { FiStar } from "react-icons/fi";

export default function HeroBadge({ text = "Premium Coffee Experience Since 2018" }) {
  return (
    <div
      className="animate-fade-up"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "rgba(212,150,58,0.1)",
        border: "1px solid rgba(212,150,58,0.3)",
        color: "#D4963A",
        fontSize: 12,
        fontWeight: 600,
        padding: "8px 18px",
        borderRadius: 999,
        marginBottom: 28,
      }}
    >
      <FiStar fill="#D4963A" size={11} />
      {text}
      <FiStar fill="#D4963A" size={11} />
    </div>
  );
}
