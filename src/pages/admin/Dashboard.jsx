// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from "react";
import { FiTrendingUp, FiUsers, FiCoffee, FiShoppingCart } from "react-icons/fi";

// Metric Card Component
function MetricCard({ icon: Icon, label, value, metric, trend, color }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E4E0",
        borderRadius: 12,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
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

      <p style={{ margin: 0, fontSize: "0.8rem", color: "#CEAD86" }}>
        {metric}
      </p>
    </div>
  );
}

// Top Selling Item Card
function TopSellingCard() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E4E0",
        borderRadius: 12,
        padding: 24,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <h3 style={{ margin: "0 0 20px 0", fontSize: "1rem", fontWeight: 600, color: "#0D0703" }}>
        📊 Top-Selling Items
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { name: "Iced Latte", sold: 32, color: "#D4963A" },
          { name: "Espresso", sold: 28, color: "#E5A84B" },
          { name: "Cappuccino", sold: 24, color: "#CEAD86" },
        ].map((item, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 4px 0", fontSize: "0.9rem", fontWeight: 500, color: "#0D0703" }}>
                {item.name}
              </p>
              <div
                style={{
                  background: "#E8E4E0",
                  borderRadius: 4,
                  height: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: item.color,
                    height: "100%",
                    width: `${(item.sold / 32) * 100}%`,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#6B5F52", minWidth: 40 }}>
              {item.sold} sold
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Recent Orders Table
function RecentOrdersTable() {
  const orders = [
    { id: "#ORD001", customer: "Sarah Smith", items: 3, total: "₹2,450", status: "Completed" },
    { id: "#ORD002", customer: "Mike Johnson", items: 2, total: "₹1,890", status: "Processing" },
    { id: "#ORD003", customer: "Emma Davis", items: 4, total: "₹3,200", status: "Pending" },
    { id: "#ORD004", customer: "John Brown", items: 2, total: "₹1,650", status: "Completed" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return { bg: "#E8F5E9", color: "#27AE60" };
      case "Processing":
        return { bg: "#FFF3E0", color: "#F39C12" };
      case "Pending":
        return { bg: "#FCE4EC", color: "#E74C3C" };
      default:
        return { bg: "#E8E4E0", color: "#6B5F52" };
    }
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E4E0",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: 24, borderBottom: "1px solid #E8E4E0" }}>
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "#0D0703" }}>
          📦 Recent Orders
        </h3>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #E8E4E0", background: "#F5F3F0" }}>
            <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "0.8rem", fontWeight: 600, color: "#6B5F52" }}>
              Order ID
            </th>
            <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "0.8rem", fontWeight: 600, color: "#6B5F52" }}>
              Customer
            </th>
            <th style={{ padding: "12px 24px", textAlign: "center", fontSize: "0.8rem", fontWeight: 600, color: "#6B5F52" }}>
              Items
            </th>
            <th style={{ padding: "12px 24px", textAlign: "right", fontSize: "0.8rem", fontWeight: 600, color: "#6B5F52" }}>
              Total
            </th>
            <th style={{ padding: "12px 24px", textAlign: "center", fontSize: "0.8rem", fontWeight: 600, color: "#6B5F52" }}>
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => {
            const statusColor = getStatusColor(order.status);
            return (
              <tr
                key={idx}
                style={{
                  borderBottom: "1px solid #E8E4E0",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F5F3F0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
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
                  <span
                    style={{
                      background: statusColor.bg,
                      color: statusColor.color,
                      padding: "4px 12px",
                      borderRadius: 12,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard() {
  const [hour, setHour] = useState(new Date().getHours());

  useEffect(() => {
    setHour(new Date().getHours());
  }, []);

  const getGreeting = () => {
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div id="dashboard">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "1.8rem", fontWeight: 700, color: "#0D0703" }}>
          {getGreeting()}, John! 👋
        </h1>
        <p style={{ margin: 0, fontSize: "1rem", color: "#9D8B74" }}>
          Here's what's happening at your coffee shop today.
        </p>
      </div>

      {/* Metrics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          marginBottom: 32,
        }}
      >
        <MetricCard
          icon={FiTrendingUp}
          label="Total Sales Today"
          value="₹12,340"
          metric="vs yesterday"
          trend="+12.5%"
          color="#D4963A"
        />
        <MetricCard
          icon={FiShoppingCart}
          label="Orders Completed"
          value="158"
          metric="vs yesterday"
          trend="+8.2%"
          color="#E5A84B"
        />
        <MetricCard
          icon={FiCoffee}
          label="Top-Selling Item"
          value="Iced Latte"
          metric="32 sold today"
          trend="trending"
          color="#CEAD86"
        />
        <MetricCard
          icon={FiUsers}
          label="Active Staff on Shift"
          value="5"
          metric="current shift"
          trend="All present"
          color="#D4963A"
        />
      </div>

      {/* Secondary Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 32,
        }}
      >
        <TopSellingCard />
        <div style={{ background: "#FFFFFF", border: "1px solid #E8E4E0", borderRadius: 12, padding: 24 }}>
          <h3 style={{ margin: "0 0 20px 0", fontSize: "1rem", fontWeight: 600, color: "#0D0703" }}>
            ⏰ Peak Hours Today
          </h3>
          <div style={{ height: 200, display: "flex", alignItems: "flex-end", gap: 8 }}>
            {[45, 60, 52, 75, 90, 70, 55, 40].map((val, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  height: `${(val / 100) * 100}%`,
                  background: `linear-gradient(180deg, #D4963A 0%, #E5A84B 100%)`,
                  borderRadius: "4px 4px 0 0",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
                title={`${val} orders at ${8 + idx}:00`}
              />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: 12 }}>
            {["8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"].map((time, idx) => (
              <span key={idx} style={{ fontSize: "0.75rem", color: "#9D8B74" }}>
                {time}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrdersTable />

      <style>{`
        @media (max-width: 768px) {
          #dashboard {
            padding: 0 -16px;
          }
        }
      `}</style>
    </div>
  );
}
