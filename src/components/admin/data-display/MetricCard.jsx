// src/components/admin/data-display/MetricCard.jsx
import AdminCard from "../ui/AdminCard";

export default function MetricCard({ icon: Icon, label, value, metric, trend, color }) {
  return (
    <AdminCard hover>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            background: `${color}15`,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color,
          }}
        >
          <Icon size={24} />
        </div>
        <div
          style={{
            background: "#E8F5E9",
            color: "#27AE60",
            padding: "4px 12px",
            borderRadius: 12,
            fontSize: "0.8rem",
            fontWeight: 600,
          }}
        >
          {trend}
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#9D8B74", marginBottom: 4 }}>
          {label}
        </p>
        <h3 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 700, color: "#0D0703" }}>
          {value}
        </h3>
      </div>

      <p style={{ margin: 0, fontSize: "0.8rem", color: "#CEAD86" }}>{metric}</p>
    </AdminCard>
  );
}
