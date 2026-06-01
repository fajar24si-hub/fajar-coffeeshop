// src/components/ui/OperationalHours.jsx
import { FiClock } from "react-icons/fi";

const defaultHours = [
  { d: "Senin – Jumat", t: "07:00 – 22:00" },
  { d: "Sabtu – Minggu", t: "08:00 – 23:00" },
];

export default function OperationalHours({ hours = defaultHours }) {
  return (
    <div
      style={{
        background: "rgba(26,10,4,0.7)",
        border: "1px solid #2E1608",
        borderRadius: 14,
        padding: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "#F7ECD8",
          fontWeight: 600,
          fontSize: 13,
          marginBottom: 16,
        }}
      >
        <FiClock color="#D4963A" size={15} /> Jam Operasional
      </div>
      {hours.map(({ d, t }) => (
        <div
          key={d}
          style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}
        >
          <span style={{ color: "#7A6247", fontSize: 13 }}>{d}</span>
          <span style={{ color: "#D4963A", fontWeight: 600, fontSize: 13 }}>{t}</span>
        </div>
      ))}
    </div>
  );
}
