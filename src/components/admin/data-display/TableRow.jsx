// src/components/admin/data-display/TableRow.jsx
import StatusBadge from "../ui/StatusBadge";

export default function TableRow({ order }) {
  return (
    <tr
      style={{
        borderBottom: "1px solid #E8E4E0",
        transition: "background 0.2s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#F5F3F0"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      <td style={{ padding: "12px 24px", fontSize: "0.9rem", fontWeight: 500, color: "#0D0703" }}>
        {order.id}
      </td>
      <td style={{ padding: "12px 24px", fontSize: "0.9rem", color: "#0D0703" }}>
        {order.customer}
      </td>
      <td style={{ padding: "12px 24px", textAlign: "center", fontSize: "0.9rem", color: "#6B5F52" }}>
        {order.items}
      </td>
      <td style={{ padding: "12px 24px", textAlign: "right", fontSize: "0.9rem", fontWeight: 600, color: "#0D0703" }}>
        {order.total}
      </td>
      <td style={{ padding: "12px 24px", textAlign: "center" }}>
        <StatusBadge status={order.status} />
      </td>
    </tr>
  );
}
