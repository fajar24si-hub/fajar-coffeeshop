// src/pages/admin/Orders.jsx
import { useState, useMemo } from "react";
import {
  FiShoppingBag, FiDollarSign, FiClock, FiCheckCircle,
  FiSearch, FiX, FiChevronLeft, FiChevronRight,
  FiFilter, FiCalendar, FiUser, FiCoffee, FiCreditCard,
  FiAlertCircle, FiRefreshCw,
} from "react-icons/fi";
import AdminPageHeader from "../../components/admin/ui/AdminPageHeader";
import { ORDERS, ORDER_STATUSES, PAYMENT_LIST } from "../../data/ordersData";

// ─── Helpers ─────────────────────────────────────────────────────
function formatRupiah(n) {
  return "Rp " + Number(n).toLocaleString("id-ID");
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function getStatusStyle(status) {
  switch (status) {
    case "Selesai":    return { bg: "#ECFDF5", text: "#059669", border: "#A7F3D0", icon: "✓" };
    case "Diproses":   return { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE", icon: "⟳" };
    case "Menunggu":   return { bg: "#FEF3C7", text: "#92400E", border: "#FDE68A", icon: "⏳" };
    case "Dibatalkan": return { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA", icon: "✕" };
    default:           return { bg: "#F1F5F9", text: "#334155", border: "#E2E8F0", icon: "?" };
  }
}

function getTierStyle(tier) {
  switch (tier) {
    case "Gold":   return { bg: "#FEF3C7", text: "#92400E" };
    case "Silver": return { bg: "#F1F5F9", text: "#334155" };
    case "Bronze": return { bg: "#FEF0E7", text: "#9A3412" };
    default:       return { bg: "#F1F5F9", text: "#334155" };
  }
}

function getAvatarColor(id) {
  const palettes = [
    "#5B4FCF","#D4963A","#27AE60","#E74C3C","#8E44AD","#2980B9","#16A085",
    "#E67E22","#2ECC71","#3498DB","#9B59B6","#1ABC9C",
  ];
  return palettes[(id - 1) % palettes.length];
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
}

// ─── Sub Components ──────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, accent, sub }) {
  return (
    <div
      style={{
        background: "#FFFFFF", borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        overflow: "hidden", transition: "all 0.3s ease", cursor: "default",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.10)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
    >
      <div style={{ height: 4, background: accent }} />
      <div style={{ padding: "20px 24px" }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{
            width: 44, height: 44,
            background: `${accent}18`, borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center", color: accent,
          }}>
            <Icon size={22} />
          </div>
        </div>
        <p style={{ margin: "0 0 4px 0", fontSize: "0.82rem", color: "#9A8478", fontWeight: 500 }}>{label}</p>
        <h3 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 700, color: "#2D1B0E", fontFamily: "Georgia, serif" }}>
          {value}
        </h3>
        {sub && <p style={{ margin: "6px 0 0 0", fontSize: "0.78rem", color: "#9A8478" }}>{sub}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = getStatusStyle(status);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.text,
      border: `1px solid ${s.border}`,
      padding: "4px 10px", borderRadius: 20,
      fontSize: "0.75rem", fontWeight: 700,
    }}>
      <span style={{ fontSize: "0.65rem" }}>{s.icon}</span>
      {status}
    </span>
  );
}

function CustomerAvatar({ name, id, size = 36 }) {
  const bg = getAvatarColor(id);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg, color: "#FFFFFF",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.35, flexShrink: 0, letterSpacing: "0.5px",
    }}>
      {getInitials(name)}
    </div>
  );
}

// ─── Order Detail Modal ───────────────────────────────────────────
function OrderDetailModal({ order, onClose }) {
  if (!order) return null;
  const s = getStatusStyle(order.status);
  const tierS = getTierStyle(order.customerTier);

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0,
        background: "rgba(45,27,14,0.45)", zIndex: 200,
        backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease",
      }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)", zIndex: 201,
        width: "min(560px, 92vw)",
        background: "#FFFFFF", borderRadius: 20,
        boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
        overflow: "hidden", animation: "slideUp 0.25s ease",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ height: 5, background: s.bg === "#ECFDF5" ? "linear-gradient(90deg,#10B981,#059669)" : s.bg === "#EFF6FF" ? "linear-gradient(90deg,#3B82F6,#1D4ED8)" : s.bg === "#FEF3C7" ? "linear-gradient(90deg,#F59E0B,#D97706)" : "linear-gradient(90deg,#EF4444,#B91C1C)" }} />

        <button id="close-order-modal" onClick={onClose} style={{
          position: "absolute", top: 16, right: 16,
          background: "#F5F3F0", border: "none", borderRadius: "50%",
          width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "#6B5F52",
        }}>
          <FiX size={16} />
        </button>

        <div style={{ padding: "24px 28px 28px" }}>
          {/* Header */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#2D1B0E", fontFamily: "Georgia, serif" }}>
                {order.orderId}
              </h2>
              <StatusBadge status={order.status} />
            </div>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "#9A8478" }}>
              <FiCalendar size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
              {formatDateTime(order.date)}
            </p>
          </div>

          {/* Customer Info */}
          <div style={{
            background: "#FAFAF8", borderRadius: 12,
            padding: "14px 16px", border: "1px solid #E8E4E0", marginBottom: 16,
          }}>
            <p style={{ margin: "0 0 10px 0", fontSize: "0.78rem", fontWeight: 600, color: "#6B5F52" }}>
              <FiUser size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
              Info Pelanggan
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <CustomerAvatar name={order.customerName} id={order.customerId} size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <p style={{ margin: 0, fontWeight: 700, color: "#2D1B0E" }}>{order.customerName}</p>
                  <span style={{
                    background: tierS.bg, color: tierS.text,
                    fontSize: "0.7rem", fontWeight: 700,
                    padding: "2px 8px", borderRadius: 20,
                  }}>
                    {order.customerTier}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "0.78rem", color: "#9A8478" }}>{order.customerEmail}</p>
                <p style={{ margin: 0, fontSize: "0.78rem", color: "#9A8478" }}>{order.customerPhone}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: "0 0 10px 0", fontSize: "0.78rem", fontWeight: 600, color: "#6B5F52" }}>
              <FiCoffee size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
              Item Pesanan ({order.items.length} item)
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {order.items.map((item, idx) => (
                <div key={idx} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px", background: "#FAFAF8",
                  borderRadius: 10, border: "1px solid #E8E4E0",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: "1.3rem" }}>{item.emoji}</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: "0.88rem", color: "#2D1B0E" }}>{item.name}</p>
                      <p style={{ margin: 0, fontSize: "0.74rem", color: "#9A8478" }}>{item.category} · {formatRupiah(item.price)}/pcs</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "#9A8478" }}>×{item.qty}</p>
                    <p style={{ margin: 0, fontWeight: 700, color: "#D4963A", fontSize: "0.9rem" }}>{formatRupiah(item.subtotal)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div style={{
              background: "#FEF3C7", borderRadius: 10, padding: "10px 14px",
              border: "1px solid #FDE68A", marginBottom: 16,
              display: "flex", gap: 8, alignItems: "flex-start",
            }}>
              <FiAlertCircle size={14} style={{ color: "#D97706", flexShrink: 0, marginTop: 2 }} />
              <p style={{ margin: 0, fontSize: "0.82rem", color: "#92400E" }}>
                <strong>Catatan:</strong> {order.notes}
              </p>
            </div>
          )}

          {/* Total */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 16px", background: "#2D1B0E", borderRadius: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FiCreditCard size={16} style={{ color: "#D4963A" }} />
              <span style={{ color: "#D4963A", fontWeight: 600, fontSize: "0.88rem" }}>{order.payment}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: "0.72rem", color: "#9A8478" }}>Total Pembayaran</p>
              <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF", fontFamily: "Georgia, serif" }}>
                {formatRupiah(order.total)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translate(-50%,-46%) } to { opacity:1; transform:translate(-50%,-50%) } }
      `}</style>
    </>
  );
}

// ─── Table Header ─────────────────────────────────────────────────
const TH = {
  padding: "12px 16px",
  fontSize: "0.75rem", fontWeight: 600,
  color: "#9A8478", textAlign: "left",
  whiteSpace: "nowrap", textTransform: "uppercase",
  letterSpacing: "0.4px",
  borderBottom: "2px solid #E8E4E0",
  background: "#FAFAF8",
};

// ─── Order Row ────────────────────────────────────────────────────
function OrderRow({ order, idx, onDetail }) {
  const [hov, setHov] = useState(false);
  const isEven = idx % 2 === 0;
  const td = { padding: "14px 16px", fontSize: "0.87rem", color: "#2D1B0E" };

  return (
    <tr
      style={{
        background: hov ? "#F3F0FF" : isEven ? "#FFFFFF" : "#FAFAF8",
        transition: "background 0.15s", cursor: "default",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Order ID */}
      <td style={td}>
        <p style={{ margin: 0, fontWeight: 700, color: "#5B4FCF", fontSize: "0.85rem" }}>{order.orderId}</p>
        <p style={{ margin: "2px 0 0", fontSize: "0.72rem", color: "#9A8478" }}>{formatDate(order.date)}</p>
      </td>

      {/* Customer */}
      <td style={td}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CustomerAvatar name={order.customerName} id={order.customerId} />
          <div>
            <p style={{ margin: 0, fontWeight: 600 }}>{order.customerName}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                fontSize: "0.68rem", fontWeight: 700, padding: "1px 7px", borderRadius: 20,
                ...getTierStyle(order.customerTier),
              }}>
                {order.customerTier}
              </span>
              <span style={{ fontSize: "0.72rem", color: "#9A8478" }}>#{String(order.customerId).padStart(4, "0")}</span>
            </div>
          </div>
        </div>
      </td>

      {/* Items */}
      <td style={td}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {order.items.slice(0, 2).map((it, i) => (
            <p key={i} style={{ margin: 0, fontSize: "0.82rem" }}>
              {it.emoji} {it.name} <span style={{ color: "#9A8478" }}>×{it.qty}</span>
            </p>
          ))}
          {order.items.length > 2 && (
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#9A8478" }}>+{order.items.length - 2} item lainnya</p>
          )}
        </div>
      </td>

      {/* Total */}
      <td style={td}>
        <span style={{ fontWeight: 700, color: "#27AE60" }}>{formatRupiah(order.total)}</span>
      </td>

      {/* Payment */}
      <td style={td}>
        <span style={{
          background: "#F1F5F9", color: "#334155",
          padding: "3px 10px", borderRadius: 20,
          fontSize: "0.78rem", fontWeight: 600,
        }}>{order.payment}</span>
      </td>

      {/* Status */}
      <td style={td}><StatusBadge status={order.status} /></td>

      {/* Actions */}
      <td style={{ ...td, textAlign: "center" }}>
        <button
          id={`detail-order-${order.id}`}
          onClick={() => onDetail(order)}
          style={{
            padding: "5px 14px",
            border: "1.5px solid #5B4FCF", borderRadius: 8,
            background: "transparent", color: "#5B4FCF",
            fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#5B4FCF"; e.currentTarget.style.color = "#FFFFFF"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#5B4FCF"; }}
        >
          Detail
        </button>
      </td>
    </tr>
  );
}

// ─── Pagination ───────────────────────────────────────────────────
function PaginationBtn({ children, onClick, active = false, disabled = false, id }) {
  return (
    <button id={id} onClick={onClick} disabled={disabled}
      style={{
        minWidth: 34, height: 34, padding: "0 10px",
        display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: 8,
        border: active ? "none" : "1.5px solid #E8E4E0",
        background: active ? "#5B4FCF" : disabled ? "#F5F3F0" : "#FFFFFF",
        color: active ? "#FFFFFF" : disabled ? "#C5BDB7" : "#6B5F52",
        fontWeight: active ? 700 : 500, fontSize: "0.85rem",
        cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s",
      }}
    >
      {children}
    </button>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────
const ROWS_PER_PAGE = 10;

export default function Orders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [paymentFilter, setPaymentFilter] = useState("Semua");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Stats
  const totalOrders = ORDERS.length;
  const totalRevenue = ORDERS.filter(o => o.status === "Selesai").reduce((s, o) => s + o.total, 0);
  const pendingOrders = ORDERS.filter(o => o.status === "Menunggu").length;
  const completedOrders = ORDERS.filter(o => o.status === "Selesai").length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / completedOrders) : 0;

  // Filtered
  const filtered = useMemo(() => {
    let data = ORDERS;
    if (statusFilter !== "Semua") data = data.filter(o => o.status === statusFilter);
    if (paymentFilter !== "Semua") data = data.filter(o => o.payment === paymentFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(o =>
        o.orderId.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.items.some(it => it.name.toLowerCase().includes(q))
      );
    }
    return data;
  }, [search, statusFilter, paymentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);

  const inputStyle = {
    width: "100%", padding: "9px 12px",
    border: "1.5px solid #E8E4E0", borderRadius: 9,
    fontSize: "0.87rem", color: "#2D1B0E",
    outline: "none", background: "#FAFAF8",
    boxSizing: "border-box", transition: "border-color 0.2s",
    fontFamily: "inherit",
  };

  return (
    <div id="orders-management-page">
      <AdminPageHeader
        emoji="📦"
        title="Orders Management"
        subtitle="Pantau dan kelola semua pesanan pelanggan Brewista secara real-time."
      />

      {/* ── STAT CARDS ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 20, marginBottom: 28,
      }}>
        <StatCard
          icon={FiShoppingBag} label="Total Pesanan" value={totalOrders}
          accent="#5B4FCF" sub="Semua status"
        />
        <StatCard
          icon={FiCheckCircle} label="Pesanan Selesai" value={completedOrders}
          accent="#10B981" sub={`${Math.round(completedOrders / totalOrders * 100)}% dari total`}
        />
        <StatCard
          icon={FiClock} label="Menunggu" value={pendingOrders}
          accent="#F59E0B" sub="Perlu diproses"
        />
        <StatCard
          icon={FiDollarSign} label="Total Revenue" value={formatRupiah(totalRevenue)}
          accent="#27AE60" sub="Dari pesanan selesai"
        />
      </div>

      {/* ── STATUS QUICK FILTER ── */}
      <div style={{
        display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16,
      }}>
        {ORDER_STATUSES.map(s => {
          const isActive = statusFilter === s;
          const ss = s !== "Semua" ? getStatusStyle(s) : null;
          const count = s === "Semua" ? ORDERS.length : ORDERS.filter(o => o.status === s).length;
          return (
            <button key={s}
              id={`status-filter-${s}`}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 20, cursor: "pointer",
                border: isActive
                  ? `2px solid ${ss ? ss.text : "#5B4FCF"}`
                  : "2px solid #E8E4E0",
                background: isActive
                  ? (ss ? ss.bg : "#EDE9FF")
                  : "#FFFFFF",
                color: isActive ? (ss ? ss.text : "#5B4FCF") : "#6B5F52",
                fontWeight: 600, fontSize: "0.83rem",
                transition: "all 0.2s",
              }}
            >
              {s}
              <span style={{
                background: isActive ? "rgba(0,0,0,0.12)" : "#F1F5F9",
                color: isActive ? "inherit" : "#9A8478",
                borderRadius: 20, padding: "1px 7px",
                fontSize: "0.72rem", fontWeight: 700,
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── MAIN TABLE CARD ── */}
      <div style={{
        background: "#FFFFFF", borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden",
      }}>
        {/* Toolbar */}
        <div style={{
          padding: "16px 24px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
          borderBottom: "1px solid #E8E4E0",
        }}>
          {/* Search */}
          <div style={{ position: "relative", minWidth: 260, flex: "1 1 260px", maxWidth: 400 }}>
            <FiSearch size={15} style={{
              position: "absolute", left: 13, top: "50%",
              transform: "translateY(-50%)", color: "#9A8478", pointerEvents: "none",
            }} />
            <input
              id="orders-search"
              type="text"
              placeholder="Cari ID order, nama, email, atau menu..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ ...inputStyle, paddingLeft: 38 }}
              onFocus={(e) => { e.target.style.borderColor = "#5B4FCF"; }}
              onBlur={(e) => { e.target.style.borderColor = "#E8E4E0"; }}
            />
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Payment filter */}
            <select
              id="payment-filter"
              value={paymentFilter}
              onChange={e => { setPaymentFilter(e.target.value); setPage(1); }}
              style={{
                padding: "8px 12px", border: "1.5px solid #E8E4E0",
                borderRadius: 9, fontSize: "0.85rem", color: "#6B5F52",
                background: "#FFFFFF", cursor: "pointer", outline: "none",
              }}
            >
              {PAYMENT_LIST.map(p => <option key={p} value={p}>{p === "Semua" ? "🏦 Semua Pembayaran" : p}</option>)}
            </select>

            {/* Refresh button */}
            <button
              id="refresh-orders"
              title="Refresh"
              style={{
                width: 38, height: 38,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1.5px solid #E8E4E0", borderRadius: 9,
                background: "#FFFFFF", color: "#9A8478", cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#5B4FCF"; e.currentTarget.style.color = "#5B4FCF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8E4E0"; e.currentTarget.style.color = "#9A8478"; }}
            >
              <FiRefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Results info */}
        <div style={{ padding: "10px 24px", fontSize: "0.82rem", color: "#9A8478", borderBottom: "1px solid #E8E4E0" }}>
          Menampilkan <strong style={{ color: "#2D1B0E" }}>{paginated.length}</strong> dari{" "}
          <strong style={{ color: "#2D1B0E" }}>{filtered.length}</strong> pesanan
          {statusFilter !== "Semua" && <> · Status: <strong style={{ color: "#5B4FCF" }}>{statusFilter}</strong></>}
          {paymentFilter !== "Semua" && <> · Pembayaran: <strong style={{ color: "#5B4FCF" }}>{paymentFilter}</strong></>}
          {search && <> · Pencarian: "<strong style={{ color: "#5B4FCF" }}>{search}</strong>"</>}
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={TH}>ID Pesanan</th>
                <th style={TH}>Pelanggan</th>
                <th style={TH}>Item Dipesan</th>
                <th style={TH}>Total</th>
                <th style={TH}>Pembayaran</th>
                <th style={TH}>Status</th>
                <th style={{ ...TH, textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{
                    textAlign: "center", padding: "60px 24px", color: "#9A8478",
                  }}>
                    <div style={{ fontSize: "2rem", marginBottom: 10 }}>📭</div>
                    <p style={{ margin: 0, fontSize: "0.9rem" }}>Tidak ada pesanan yang ditemukan.</p>
                    {(search || statusFilter !== "Semua" || paymentFilter !== "Semua") && (
                      <button
                        onClick={() => { setSearch(""); setStatusFilter("Semua"); setPaymentFilter("Semua"); setPage(1); }}
                        style={{
                          marginTop: 12, padding: "6px 16px",
                          border: "1.5px solid #5B4FCF", borderRadius: 8,
                          background: "transparent", color: "#5B4FCF",
                          fontWeight: 600, fontSize: "0.82rem", cursor: "pointer",
                        }}
                      >
                        Reset Filter
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                paginated.map((order, idx) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    idx={idx}
                    onDetail={setSelectedOrder}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{
          padding: "16px 24px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #E8E4E0",
          flexWrap: "wrap", gap: 12,
        }}>
          <p style={{ margin: 0, fontSize: "0.82rem", color: "#9A8478" }}>
            Halaman <strong style={{ color: "#2D1B0E" }}>{safePage}</strong> dari{" "}
            <strong style={{ color: "#2D1B0E" }}>{totalPages}</strong>
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <PaginationBtn id="orders-prev" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>
              <FiChevronLeft size={16} />
            </PaginationBtn>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const startPage = Math.max(1, Math.min(safePage - 3, totalPages - 6));
              const p = startPage + i;
              if (p > totalPages) return null;
              return (
                <PaginationBtn key={p} id={`orders-page-${p}`} onClick={() => setPage(p)} active={p === safePage}>
                  {p}
                </PaginationBtn>
              );
            })}
            <PaginationBtn id="orders-next" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>
              <FiChevronRight size={16} />
            </PaginationBtn>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
