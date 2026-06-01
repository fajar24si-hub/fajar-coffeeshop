// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from "react";
import { FiTrendingUp, FiUsers, FiCoffee, FiShoppingCart } from "react-icons/fi";
import AdminPageHeader   from "../../components/admin/ui/AdminPageHeader";
import MetricCard        from "../../components/admin/data-display/MetricCard";
import TopSellingCard    from "../../components/admin/data-display/TopSellingCard";
import PeakHoursChart    from "../../components/admin/data-display/PeakHoursChart";
import RecentOrdersTable from "../../components/admin/data-display/RecentOrdersTable";

const metrics = [
  { icon: FiTrendingUp,  label: "Total Sales Today",      value: "₹12,340",  metric: "vs yesterday", trend: "+12.5%",    color: "#D4963A" },
  { icon: FiShoppingCart,label: "Orders Completed",       value: "158",       metric: "vs yesterday", trend: "+8.2%",     color: "#E5A84B" },
  { icon: FiCoffee,      label: "Top-Selling Item",       value: "Iced Latte",metric: "32 sold today",trend: "trending",  color: "#CEAD86" },
  { icon: FiUsers,       label: "Active Staff on Shift",  value: "5",         metric: "current shift",trend: "All present",color: "#D4963A" },
];

export default function Dashboard() {
  const [hour, setHour] = useState(new Date().getHours());

  useEffect(() => { setHour(new Date().getHours()); }, []);

  // Ambil nama depan dari localStorage
  const fullName  = localStorage.getItem("userName") ?? "Admin";
  const firstName = fullName.split(" ")[0];

  const getGreeting = () => {
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div id="dashboard">
      <AdminPageHeader
        title={`${getGreeting()}, ${firstName}! 👋`}
        subtitle="Here's what's happening at your coffee shop today."
      />

      {/* Metrics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          marginBottom: 32,
        }}
      >
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
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
        <PeakHoursChart />
      </div>

      {/* Recent Orders */}
      <RecentOrdersTable />

      <style>{`
        @media (max-width: 768px) {
          #dashboard { padding: 0 -16px; }
        }
      `}</style>
    </div>
  );
}
