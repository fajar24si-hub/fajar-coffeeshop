// src/components/admin/data-display/PeakHoursChart.jsx
import AdminCard from "../ui/AdminCard";

const defaultData  = [45, 60, 52, 75, 90, 70, 55, 40];
const defaultLabels = ["8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"];

export default function PeakHoursChart({ data = defaultData, labels = defaultLabels }) {
  const max = Math.max(...data);

  return (
    <AdminCard>
      <h3 style={{ margin: "0 0 20px 0", fontSize: "1rem", fontWeight: 600, color: "#0D0703" }}>
        ⏰ Peak Hours Today
      </h3>

      <div style={{ height: 200, display: "flex", alignItems: "flex-end", gap: 8 }}>
        {data.map((val, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              height: `${(val / max) * 100}%`,
              background: "linear-gradient(180deg, #D4963A 0%, #E5A84B 100%)",
              borderRadius: "4px 4px 0 0",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            title={`${val} orders at ${labels[idx]}`}
          />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 12 }}>
        {labels.map((time, idx) => (
          <span key={idx} style={{ fontSize: "0.75rem", color: "#9D8B74" }}>
            {time}
          </span>
        ))}
      </div>
    </AdminCard>
  );
}
