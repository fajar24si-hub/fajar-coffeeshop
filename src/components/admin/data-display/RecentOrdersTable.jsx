// src/components/admin/data-display/RecentOrdersTable.jsx
import AdminCard from "../ui/AdminCard";
import TableRow from "./TableRow";

const defaultOrders = [
  { id: "#ORD001", customer: "Sarah Smith",   items: 3, total: "₹2,450", status: "Completed" },
  { id: "#ORD002", customer: "Mike Johnson",  items: 2, total: "₹1,890", status: "Processing" },
  { id: "#ORD003", customer: "Emma Davis",    items: 4, total: "₹3,200", status: "Pending" },
  { id: "#ORD004", customer: "John Brown",    items: 2, total: "₹1,650", status: "Completed" },
];

const thStyle = {
  padding: "12px 24px",
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#6B5F52",
};

export default function RecentOrdersTable({ orders = defaultOrders }) {
  return (
    <AdminCard style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: 24, borderBottom: "1px solid #E8E4E0" }}>
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "#0D0703" }}>
          📦 Recent Orders
        </h3>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #E8E4E0", background: "#F5F3F0" }}>
            <th style={{ ...thStyle, textAlign: "left"   }}>Order ID</th>
            <th style={{ ...thStyle, textAlign: "left"   }}>Customer</th>
            <th style={{ ...thStyle, textAlign: "center" }}>Items</th>
            <th style={{ ...thStyle, textAlign: "right"  }}>Total</th>
            <th style={{ ...thStyle, textAlign: "center" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <TableRow key={order.id} order={order} />
          ))}
        </tbody>
      </table>
    </AdminCard>
  );
}
