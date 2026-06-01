// src/components/ui/ContactInfoCard.jsx

export default function ContactInfoCard({ Icon, label, val }) {
  return (
    <div className="info-card">
      <div className="icon-box">
        <Icon size={16} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            color: "#7A6247",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            fontWeight: 600,
          }}
        >
          {label}
        </div>
        <div
          style={{
            color: "#F7ECD8",
            fontSize: 13,
            fontWeight: 500,
            marginTop: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {val}
        </div>
      </div>
    </div>
  );
}
