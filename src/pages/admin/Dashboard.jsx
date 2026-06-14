// src/pages/admin/Dashboard.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiTrendingUp, FiUsers, FiCoffee, FiShoppingBag,
  FiDollarSign, FiAward, FiCheckCircle, FiClock,
  FiXCircle, FiRefreshCw, FiArrowUpRight, FiStar,
} from "react-icons/fi";

// ── Existing Admin UI Components ─────────────────────────────────
import AdminPageHeader   from "../../components/admin/ui/AdminPageHeader";
import AdminCard         from "../../components/admin/ui/AdminCard";
import MetricCard        from "../../components/admin/data-display/MetricCard";
import TopSellingCard    from "../../components/admin/data-display/TopSellingCard";
import PeakHoursChart    from "../../components/admin/data-display/PeakHoursChart";
import RecentOrdersTable from "../../components/admin/data-display/RecentOrdersTable";
import TableRow          from "../../components/admin/data-display/TableRow";
import StatusBadge       from "../../components/admin/ui/StatusBadge";
import UserAvatar        from "../../components/admin/ui/UserAvatar";

// ── Existing Radix UI Components ─────────────────────────────────
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Progress }                                  from "../../components/ui/progress";
import { ToastProvider, Toast, useToast }            from "../../components/ui/toast";

// ── Real Data ─────────────────────────────────────────────────────
import { CUSTOMERS }   from "../../data/customersData";
import { ORDERS }      from "../../data/ordersData";
import { menuItems }   from "../../data/menuData";

// ─── Helpers ──────────────────────────────────────────────────────
function formatRupiah(n) {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)} M`;
  if (n >= 1_000_000)     return `Rp ${(n / 1_000_000).toFixed(1)} Jt`;
  return "Rp " + Number(n).toLocaleString("id-ID");
}

function formatRupiahFull(n) {
  return "Rp " + Number(n).toLocaleString("id-ID");
}

function getInitials(name) {
  const p = name.trim().split(/\s+/);
  return (p.length >= 2 ? p[0][0] + p[1][0] : p[0].slice(0, 2)).toUpperCase();
}

function getAvatarBg(id) {
  const colors = ["#5B4FCF","#D4963A","#27AE60","#E74C3C","#8E44AD","#2980B9","#16A085","#E67E22"];
  return colors[(id - 1) % colors.length];
}

// ─── Compute analytics once from real data ────────────────────────
function useAnalytics() {
  return useMemo(() => {
    const totalOrders     = ORDERS.length;
    const completed       = ORDERS.filter(o => o.status === "Selesai");
    const processing      = ORDERS.filter(o => o.status === "Diproses").length;
    const pending         = ORDERS.filter(o => o.status === "Menunggu").length;
    const cancelled       = ORDERS.filter(o => o.status === "Dibatalkan").length;
    const totalRevenue    = completed.reduce((s, o) => s + o.total, 0);
    const avgOrder        = completed.length ? Math.round(totalRevenue / completed.length) : 0;
    const completionRate  = totalOrders ? Math.round((completed.length / totalOrders) * 100) : 0;

    // Top selling — shape expected by TopSellingCard: [{ name, sold, color }]
    const salesMap = {};
    ORDERS.forEach(order => {
      order.items.forEach(it => {
        if (!salesMap[it.name]) salesMap[it.name] = { name: it.name, emoji: it.emoji, sold: 0, revenue: 0 };
        salesMap[it.name].sold    += it.qty;
        salesMap[it.name].revenue += it.subtotal;
      });
    });
    const TOP_COLORS = ["#D4963A","#E5A84B","#CEAD86","#5B4FCF","#27AE60","#E74C3C"];
    const topSelling = Object.values(salesMap)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5)
      .map((item, i) => ({ ...item, color: TOP_COLORS[i] ?? "#D4963A" }));

    // Peak hours data — shape expected by PeakHoursChart: number[]
    const hourlyOrders = Array(24).fill(0);
    ORDERS.forEach(o => {
      const h = parseInt(o.date?.split(" ")[1]?.split(":")[0] ?? "0");
      if (!isNaN(h)) hourlyOrders[h]++;
    });
    const peakData   = hourlyOrders.slice(7, 22);   // 07:00–21:00
    const peakLabels = ["7am","8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm"];

    // Recent orders — shape expected by TableRow: [{ id, customer, items, total, status }]
    const statusMap = { "Selesai": "Completed", "Diproses": "Processing", "Menunggu": "Pending", "Dibatalkan": "Pending" };
    const recentOrderRows = ORDERS.slice(0, 8).map(o => ({
      id:       o.orderId,
      customer: o.customerName,
      items:    o.items.length,
      total:    formatRupiahFull(o.total),
      status:   statusMap[o.status] ?? "Pending",
    }));

    // Payment breakdown
    const payMap = {};
    ORDERS.forEach(o => { payMap[o.payment] = (payMap[o.payment] || 0) + 1; });
    const payBreakdown = Object.entries(payMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

    // Tier counts
    const goldCount   = CUSTOMERS.filter(c => c.tier === "Gold").length;
    const silverCount = CUSTOMERS.filter(c => c.tier === "Silver").length;
    const bronzeCount = CUSTOMERS.filter(c => c.tier === "Bronze").length;

    // Top 5 customers by spending
    const topCustomers = [...CUSTOMERS].sort((a, b) => b.spent - a.spent).slice(0, 5);

    // Status counts for progress bars
    const statusCounts = {
      Selesai: completed.length, Diproses: processing, Menunggu: pending, Dibatalkan: cancelled,
    };

    return {
      totalOrders, totalRevenue, avgOrder, completionRate,
      completed: completed.length, processing, pending, cancelled,
      topSelling, peakData, peakLabels,
      recentOrderRows,
      payBreakdown,
      goldCount, silverCount, bronzeCount,
      topCustomers, statusCounts,
    };
  }, []);
}

// ─── Small reusable pieces ─────────────────────────────────────────

/** Wrapper pakai AdminCard + judul konsisten */
function DashCard({ title, sub, action, actionLabel, children }) {
  const navigate = useNavigate();
  return (
    <AdminCard style={{ padding: 0, overflow: "hidden", height: "100%" }}>
      <div style={{
        padding: "18px 22px 14px",
        borderBottom: "1px solid #E8E4E0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#0D0703" }}>{title}</h3>
          {sub && <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#9D8B74" }}>{sub}</p>}
        </div>
        {action && (
          <button
            onClick={() => navigate(action)}
            style={{
              padding: "5px 13px", border: "1.5px solid #E8E4E0",
              borderRadius: 8, background: "#FFFFFF", color: "#6B5F52",
              fontWeight: 600, fontSize: "0.75rem", cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#D4963A"; e.currentTarget.style.color = "#D4963A"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8E4E0"; e.currentTarget.style.color = "#6B5F52"; }}
          >
            {actionLabel} →
          </button>
        )}
      </div>
      <div style={{ padding: "16px 22px 20px" }}>{children}</div>
    </AdminCard>
  );
}

/** Progress bar row pakai <Progress /> dari komponen yang ada */
function ProgressRow({ label, value, max, color, right }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#2D1B0E" }}>{label}</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {right && <span style={{ fontSize: "0.78rem", color: "#9D8B74" }}>{right}</span>}
          <span style={{
            fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px",
            borderRadius: 20, background: `${color}15`, color,
          }}>{pct}%</span>
        </div>
      </div>
      {/* reuse <Progress /> komponen yang sudah ada */}
      <Progress value={pct} color={color} height={8} animated />
    </div>
  );
}

/** Avatar bulat sederhana untuk top customers */
function MiniAvatar({ name, id, size = 34 }) {
  const bg = getAvatarBg(id);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg, color: "#FFFFFF",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.33, flexShrink: 0,
    }}>
      {getInitials(name)}
    </div>
  );
}

/** Baris top customer */
function TopCustomerRow({ customer, rank }) {
  const tierColor = { Gold: "#F59E0B", Silver: "#94A3B8", Bronze: "#EA580C" }[customer.tier] ?? "#9D8B74";
  const medal = ["🥇","🥈","🥉"][rank] ?? `#${rank + 1}`;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 0",
      borderBottom: rank < 4 ? "1px solid #F0EDE8" : "none",
    }}>
      <span style={{ width: 22, textAlign: "center", fontSize: rank < 3 ? "1rem" : "0.78rem", color: "#9D8B74", fontWeight: 700 }}>
        {medal}
      </span>
      <MiniAvatar name={customer.name} id={customer.id} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: "0.83rem", fontWeight: 700, color: "#0D0703", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {customer.name}
        </p>
        <p style={{ margin: 0, fontSize: "0.72rem", color: "#9D8B74" }}>{customer.visits}× kunjungan</p>
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 700, color: "#27AE60" }}>{formatRupiah(customer.spent)}</p>
        <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "1px 7px", borderRadius: 20, background: `${tierColor}18`, color: tierColor }}>
          {customer.tier}
        </span>
      </div>
    </div>
  );
}

/** Summary stat pill untuk banner */
function BannerStat({ label, value, color }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.07)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 12, padding: "12px 18px", textAlign: "center",
    }}>
      <p style={{ margin: "0 0 2px", fontSize: "0.7rem", color: "rgba(247,236,216,0.6)", fontWeight: 500 }}>{label}</p>
      <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color, fontFamily: "'Playfair Display', serif" }}>{value}</p>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────
export default function Dashboard() {
  const [hour, setHour] = useState(new Date().getHours());
  const [now,  setNow]  = useState(new Date());
  const navigate = useNavigate();
  const a = useAnalytics();
  const { toasts, toast, dismiss } = useToast();

  useEffect(() => {
    const t = setInterval(() => { setNow(new Date()); setHour(new Date().getHours()); }, 60_000);
    return () => clearInterval(t);
  }, []);

  const fullName  = localStorage.getItem("userName") ?? "Admin";
  const firstName = fullName.split(" ")[0];
  const greeting  = hour < 11 ? "Selamat Pagi" : hour < 15 ? "Selamat Siang" : hour < 18 ? "Selamat Sore" : "Selamat Malam";

  // MetricCard data (pakai komponen MetricCard yang sudah ada)
  const metrics = [
    {
      icon: FiDollarSign,
      label: "Total Revenue",
      value: formatRupiah(a.totalRevenue),
      metric: `${a.completed} pesanan selesai`,
      trend: `${a.completionRate}% rate`,
      color: "#27AE60",
    },
    {
      icon: FiShoppingBag,
      label: "Total Pesanan",
      value: a.totalOrders,
      metric: `${a.pending} masih menunggu`,
      trend: `+${a.processing} diproses`,
      color: "#5B4FCF",
    },
    {
      icon: FiUsers,
      label: "Total Pelanggan",
      value: CUSTOMERS.length,
      metric: `${a.goldCount} Gold · ${a.silverCount} Silver`,
      trend: `${a.bronzeCount} Bronze`,
      color: "#D4963A",
    },
    {
      icon: FiTrendingUp,
      label: "Rata-rata Order",
      value: formatRupiah(a.avgOrder),
      metric: "Per pesanan selesai",
      trend: "Avg value",
      color: "#E74C3C",
    },
  ];

  return (
    <div id="dashboard-page">
      {/* ── GREETING BANNER ── pakai AdminCard */}
      <AdminCard
        style={{
          marginBottom: 28, padding: 0, overflow: "hidden",
          background: "linear-gradient(135deg, #2D1B0E 0%, #4A2A12 50%, #2D1B0E 100%)",
          border: "none",
        }}
      >
        <div style={{ padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: "0.8rem", color: "#D4963A", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              {now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
            <h1 style={{ margin: "0 0 4px", fontSize: "1.65rem", fontWeight: 700, color: "#F7ECD8", fontFamily: "'Playfair Display', serif" }}>
              {greeting}, {firstName}! ☕
            </h1>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "rgba(212,150,58,0.65)" }}>
              Brewista Coffee Shop · Ringkasan data terkini
            </p>
          </div>
          {/* pakai UserAvatar */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <BannerStat label="Total Pesanan" value={a.totalOrders}          color="#D4963A" />
            <BannerStat label="Revenue"       value={formatRupiah(a.totalRevenue)} color="#27AE60" />
            <BannerStat label="Pelanggan"     value={CUSTOMERS.length}       color="#A78BFA" />
          </div>
        </div>
      </AdminCard>

      {/* ── KPI METRIC CARDS — pakai MetricCard yang sudah ada ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 20, marginBottom: 24,
      }}>
        {metrics.map(m => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      {/* ── TABS: Analytics / Peak Hours / Recent Orders ── pakai Tabs yang sudah ada */}
      <Tabs defaultValue="analytics">
        <TabsList style={{ marginBottom: 0 }}>
          <TabsTrigger value="analytics"   id="tab-analytics">
            <FiTrendingUp size={14} /> Analytics
          </TabsTrigger>
          <TabsTrigger value="peak-hours"  id="tab-peak-hours">
            <FiClock size={14} /> Peak Hours
          </TabsTrigger>
          <TabsTrigger value="orders"      id="tab-recent-orders">
            <FiShoppingBag size={14} /> Pesanan Terbaru
          </TabsTrigger>
          <TabsTrigger value="customers"   id="tab-top-customers">
            <FiUsers size={14} /> Top Pelanggan
          </TabsTrigger>
        </TabsList>

        {/* ── ANALYTICS TAB ── */}
        <TabsContent value="analytics">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
            {/* TopSellingCard — pakai komponen yang sudah ada, inject data nyata */}
            <TopSellingCard items={a.topSelling} />

            {/* Status Pesanan — pakai AdminCard + Progress */}
            <DashCard
              title="📦 Status Pesanan"
              sub={`${a.totalOrders} total transaksi`}
            >
              <ProgressRow label="✓ Selesai"    value={a.statusCounts.Selesai}   max={a.totalOrders} color="#27AE60" right={`${a.statusCounts.Selesai} order`} />
              <ProgressRow label="⟳ Diproses"   value={a.statusCounts.Diproses}  max={a.totalOrders} color="#3B82F6" right={`${a.statusCounts.Diproses} order`} />
              <ProgressRow label="⏳ Menunggu"   value={a.statusCounts.Menunggu}  max={a.totalOrders} color="#F59E0B" right={`${a.statusCounts.Menunggu} order`} />
              <ProgressRow label="✕ Dibatalkan"  value={a.statusCounts.Dibatalkan} max={a.totalOrders} color="#EF4444" right={`${a.statusCounts.Dibatalkan} order`} />
            </DashCard>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            {/* Distribusi Member — pakai Progress */}
            <DashCard
              title="👥 Distribusi Member"
              sub={`${CUSTOMERS.length} pelanggan terdaftar`}
              action="/admin/customers"
              actionLabel="Lihat Semua"
            >
              <ProgressRow label="🥇 Gold"   value={a.goldCount}   max={CUSTOMERS.length} color="#F59E0B" right={`${a.goldCount} member`} />
              <ProgressRow label="🥈 Silver" value={a.silverCount} max={CUSTOMERS.length} color="#94A3B8" right={`${a.silverCount} member`} />
              <ProgressRow label="🥉 Bronze" value={a.bronzeCount} max={CUSTOMERS.length} color="#EA580C" right={`${a.bronzeCount} member`} />
            </DashCard>

            {/* Metode Pembayaran — pakai AdminCard + Progress */}
            <DashCard title="💳 Metode Pembayaran" sub="Distribusi per metode">
              {a.payBreakdown.map(([method, count], i) => {
                const payIcons = { Cash:"💵",QRIS:"📱",GoPay:"💚",OVO:"💜",Dana:"🔵",ShopeePay:"🧡","Kartu Debit":"💳" };
                const colors = ["#D4963A","#5B4FCF","#10B981","#E74C3C","#8E44AD","#2980B9"];
                return (
                  <ProgressRow
                    key={method}
                    label={`${payIcons[method] ?? "💳"} ${method}`}
                    value={count}
                    max={a.totalOrders}
                    color={colors[i % colors.length]}
                    right={`${count}×`}
                  />
                );
              })}
            </DashCard>

            {/* Item Menu Summary */}
            <DashCard
              title="☕ Ringkasan Menu"
              sub={`${menuItems.length} item aktif`}
              action="/admin/menu"
              actionLabel="Kelola Menu"
            >
              {[...new Set(menuItems.map(m => m.category))].map((cat, i) => {
                const catItems = menuItems.filter(m => m.category === cat);
                const catColors = { "Hot Coffee": "#E74C3C", "Iced Coffee": "#3B82F6", "Non Coffee": "#10B981" };
                return (
                  <ProgressRow
                    key={cat}
                    label={cat}
                    value={catItems.length}
                    max={menuItems.length}
                    color={catColors[cat] ?? "#9D8B74"}
                    right={`${catItems.length} item`}
                  />
                );
              })}
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #E8E4E0" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.78rem", color: "#9D8B74" }}>Avg harga</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#D4963A" }}>
                    {formatRupiahFull(Math.round(menuItems.reduce((s,m) => s + m.price, 0) / menuItems.length))}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: "0.78rem", color: "#9D8B74" }}>Avg rating</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#F59E0B" }}>
                    ⭐ {(menuItems.reduce((s,m) => s + m.rating, 0) / menuItems.length).toFixed(1)}
                  </span>
                </div>
              </div>
            </DashCard>
          </div>
        </TabsContent>

        {/* ── PEAK HOURS TAB — pakai PeakHoursChart yang sudah ada ── */}
        <TabsContent value="peak-hours">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
            {/* PeakHoursChart dengan data nyata */}
            <PeakHoursChart data={a.peakData} labels={a.peakLabels} />

            <DashCard title="⏰ Insight Jam Sibuk" sub="Berdasarkan data pesanan nyata">
              {(() => {
                const maxVal  = Math.max(...a.peakData);
                const peakIdx = a.peakData.indexOf(maxVal);
                const totalPeakOrders = a.peakData.reduce((s, v) => s + v, 0);
                const avgPerHour = Math.round(totalPeakOrders / a.peakData.length);
                const stats = [
                  { label: "Jam Tersibuk",   val: `${a.peakLabels[peakIdx]}`,   color: "#D4963A" },
                  { label: "Order Terbanyak", val: `${maxVal} pesanan`,           color: "#5B4FCF" },
                  { label: "Total (07–21)",   val: `${totalPeakOrders} pesanan`, color: "#27AE60" },
                  { label: "Rata-rata/Jam",   val: `${avgPerHour} pesanan`,      color: "#E74C3C" },
                ];
                return stats.map(s => (
                  <div key={s.label} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 0", borderBottom: "1px solid #F0EDE8",
                  }}>
                    <span style={{ fontSize: "0.82rem", color: "#6B5F52" }}>{s.label}</span>
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: s.color }}>{s.val}</span>
                  </div>
                ));
              })()}
            </DashCard>
          </div>
        </TabsContent>

        {/* ── RECENT ORDERS TAB — pakai RecentOrdersTable + TableRow yang sudah ada ── */}
        <TabsContent value="orders">
          <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 20 }}>
            {/* RecentOrdersTable dengan data nyata */}
            <RecentOrdersTable orders={a.recentOrderRows} />

            <DashCard title="📊 Ringkasan Order" sub="Data real-time">
              {[
                { label: "✓ Selesai",   val: a.completed,   color: "#27AE60" },
                { label: "⟳ Diproses",  val: a.processing,  color: "#3B82F6" },
                { label: "⏳ Menunggu",  val: a.pending,     color: "#F59E0B" },
                { label: "✕ Dibatalkan",val: a.cancelled,   color: "#EF4444" },
              ].map(s => (
                <div key={s.label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0", borderBottom: "1px solid #F0EDE8",
                }}>
                  <span style={{ fontSize: "0.82rem", color: "#6B5F52" }}>{s.label}</span>
                  <span style={{ fontWeight: 700, color: s.color }}>{s.val}</span>
                </div>
              ))}
              <div style={{ marginTop: 14 }}>
                <Progress value={a.completionRate} color="#27AE60" height={10} animated />
                <p style={{ margin: "6px 0 0", fontSize: "0.75rem", color: "#9D8B74", textAlign: "center" }}>
                  {a.completionRate}% Completion Rate
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/orders")}
                style={{
                  marginTop: 14, width: "100%", padding: "9px",
                  border: "1.5px solid #D4963A", borderRadius: 9,
                  background: "transparent", color: "#D4963A",
                  fontWeight: 700, fontSize: "0.83rem", cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#D4963A"; e.currentTarget.style.color = "#FFF"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#D4963A"; }}
              >
                Lihat Semua Pesanan →
              </button>
            </DashCard>
          </div>
        </TabsContent>

        {/* ── TOP CUSTOMERS TAB ── */}
        <TabsContent value="customers">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <DashCard
              title="🏆 Top 5 Pelanggan"
              sub="Berdasarkan total belanja"
              action="/admin/customers"
              actionLabel="Lihat Semua"
            >
              {a.topCustomers.map((c, i) => (
                <TopCustomerRow key={c.id} customer={c} rank={i} />
              ))}
            </DashCard>

            <DashCard title="📈 Statistik Pelanggan" sub={`${CUSTOMERS.length} terdaftar`}>
              <ProgressRow label="🥇 Gold"   value={a.goldCount}   max={CUSTOMERS.length} color="#F59E0B" right={`${a.goldCount} member`} />
              <ProgressRow label="🥈 Silver" value={a.silverCount} max={CUSTOMERS.length} color="#94A3B8" right={`${a.silverCount} member`} />
              <ProgressRow label="🥉 Bronze" value={a.bronzeCount} max={CUSTOMERS.length} color="#EA580C" right={`${a.bronzeCount} member`} />

              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #E8E4E0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "Total Belanja",    val: formatRupiah(CUSTOMERS.reduce((s,c)=>s+c.spent,0)),   color: "#27AE60" },
                  { label: "Total Kunjungan",  val: CUSTOMERS.reduce((s,c)=>s+c.visits,0).toLocaleString("id-ID"), color: "#5B4FCF" },
                  { label: "Rata-rata Belanja", val: formatRupiah(Math.round(CUSTOMERS.reduce((s,c)=>s+c.spent,0)/CUSTOMERS.length)), color: "#D4963A" },
                  { label: "Total Poin",       val: CUSTOMERS.reduce((s,c)=>s+c.points,0).toLocaleString("id-ID"), color: "#F59E0B" },
                ].map(stat => (
                  <div key={stat.label} style={{ background: "#FAFAF8", borderRadius: 10, padding: "10px 12px", border: "1px solid #E8E4E0" }}>
                    <p style={{ margin: "0 0 3px", fontSize: "0.7rem", color: "#9D8B74" }}>{stat.label}</p>
                    <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: stat.color }}>{stat.val}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/admin/customers")}
                style={{
                  marginTop: 14, width: "100%", padding: "9px",
                  border: "1.5px solid #5B4FCF", borderRadius: 9,
                  background: "transparent", color: "#5B4FCF",
                  fontWeight: 700, fontSize: "0.83rem", cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#5B4FCF"; e.currentTarget.style.color = "#FFF"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#5B4FCF"; }}
              >
                Kelola Pelanggan →
              </button>
            </DashCard>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── QUICK ACTIONS ── */}
      <AdminCard style={{ marginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          <div>
            <h3 style={{ margin: "0 0 3px", fontSize: "0.95rem", fontWeight: 700, color: "#0D0703" }}>⚡ Aksi Cepat</h3>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "#9D8B74" }}>Navigasi langsung ke halaman penting</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { label: "📦 Pesanan", path: "/admin/orders",    color: "#5B4FCF" },
              { label: "☕ Menu",    path: "/admin/menu",       color: "#D4963A" },
              { label: "👥 Pelanggan", path: "/admin/customers", color: "#27AE60" },
              { label: "👤 Staff",  path: "/admin/staff",      color: "#E74C3C" },
              { label: "📦 Inventori", path: "/admin/inventory", color: "#8E44AD" },
            ].map(({ label, path, color }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                style={{
                  padding: "8px 16px", border: `1.5px solid ${color}`,
                  borderRadius: 9, background: "#FFFFFF", color,
                  fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = "#FFFFFF"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#FFFFFF"; e.currentTarget.style.color = color; }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </AdminCard>

      {/* ── TOAST (pakai ToastProvider + Toast yang sudah ada) ── */}
      <ToastProvider>
        {toasts.map(t => (
          <Toast
            key={t.id}
            open={t.open}
            onOpenChange={open => { if (!open) dismiss(t.id); }}
            title={t.title}
            description={t.description}
            variant={t.variant}
          />
        ))}
      </ToastProvider>
    </div>
  );
}
