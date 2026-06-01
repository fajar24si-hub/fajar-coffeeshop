// src/components/admin/ui/StatusBadge.jsx

const statusMap = {
  Completed:  { bg: "#E8F5E9", color: "#27AE60" },
  Processing: { bg: "#FFF3E0", color: "#F39C12" },
  Pending:    { bg: "#FCE4EC", color: "#E74C3C" },
  Active:     { bg: "#E8F5E9", color: "#27AE60" },
  Inactive:   { bg: "#FCE4EC", color: "#E74C3C" },
  Low:        { bg: "#FFF3E0", color: "#F39C12" },
};

export default function StatusBadge({ status }) {
  const style = statusMap[status] || { bg: "#E8E4E0", color: "#6B5F52" };

  return (
    <span
      style={{
        background: style.bg,
        color: style.color,
        padding: "4px 12px",
        borderRadius: 12,
        fontSize: "0.8rem",
        fontWeight: 600,
        display: "inline-block",
      }}
    >
      {status}
    </span>
  );
}
