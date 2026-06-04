// src/pages/admin/Customers.jsx
import { useState, useMemo } from "react";
import {
  FiUsers, FiAward, FiCoffee, FiDollarSign,
  FiSearch, FiEdit2, FiX, FiChevronLeft, FiChevronRight,
  FiStar, FiPhone, FiMail, FiCalendar, FiTrendingUp,
} from "react-icons/fi";
import AdminPageHeader from "../../components/admin/ui/AdminPageHeader";
import AdminCard from "../../components/admin/ui/AdminCard";

// ─── Types ────────────────────────────────────────────────────
/**
 * @typedef {{
 *   id: number;
 *   name: string;
 *   email: string;
 *   phone: string;
 *   joined: string;
 *   visits: number;
 *   spent: number;
 *   tier: "Gold" | "Silver" | "Bronze";
 *   points: number;
 *   lastVisit: string;
 * }} Customer
 */

// ─── Mock Data ────────────────────────────────────────────────
/** @type {Customer[]} */
const CUSTOMERS = [
  {
    id: 1,
    name: "Siti Rahma Dewi",
    email: "siti.rahma@email.com",
    phone: "0812-3456-7890",
    joined: "2023-01-15",
    visits: 87,
    spent: 4_250_000,
    tier: "Gold",
    points: 3_420,
    lastVisit: "2024-05-30",
  },
  {
    id: 2,
    name: "Budi Santoso",
    email: "budi.santoso@email.com",
    phone: "0856-9876-5432",
    joined: "2023-03-22",
    visits: 45,
    spent: 1_875_000,
    tier: "Silver",
    points: 1_500,
    lastVisit: "2024-05-28",
  },
  {
    id: 3,
    name: "Aulia Fitri",
    email: "aulia.fitri@gmail.com",
    phone: "0821-1122-3344",
    joined: "2023-07-10",
    visits: 23,
    spent: 820_000,
    tier: "Bronze",
    points: 650,
    lastVisit: "2024-05-25",
  },
  {
    id: 4,
    name: "Rizky Ardiansyah",
    email: "rizky.ardi@email.com",
    phone: "0878-5566-7788",
    joined: "2022-11-05",
    visits: 112,
    spent: 5_600_000,
    tier: "Gold",
    points: 4_480,
    lastVisit: "2024-06-01",
  },
  {
    id: 5,
    name: "Mega Pratiwi",
    email: "mega.prati@email.com",
    phone: "0831-2233-4455",
    joined: "2024-01-08",
    visits: 12,
    spent: 380_000,
    tier: "Bronze",
    points: 304,
    lastVisit: "2024-05-20",
  },
  {
    id: 6,
    name: "Dimas Kurniawan",
    email: "dimas.kurn@email.com",
    phone: "0813-6677-8899",
    joined: "2023-05-18",
    visits: 61,
    spent: 2_430_000,
    tier: "Silver",
    points: 1_944,
    lastVisit: "2024-05-31",
  },
  {
    id: 7,
    name: "Nadia Husna",
    email: "nadia.husna@email.com",
    phone: "0852-0011-2233",
    joined: "2023-09-30",
    visits: 38,
    spent: 1_125_000,
    tier: "Silver",
    points: 1_125,
    lastVisit: "2024-05-29",
  },
];

// ─── Helpers ──────────────────────────────────────────────────
/**
 * Format angka ke Rupiah: 1500000 → "Rp 1.500.000"
 * @param {number} n
 * @returns {string}
 */
function formatRupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

/**
 * Format tanggal ISO ke "12 Jan 2023"
 * @param {string} iso
 * @returns {string}
 */
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Warna avatar berdasarkan id pelanggan
 * @param {number} id
 */
function getAvatarColor(id) {
  const palettes = [
    { bg: "#5B4FCF", text: "#FFFFFF" },
    { bg: "#D4963A", text: "#FFFFFF" },
    { bg: "#27AE60", text: "#FFFFFF" },
    { bg: "#E74C3C", text: "#FFFFFF" },
    { bg: "#8E44AD", text: "#FFFFFF" },
    { bg: "#2980B9", text: "#FFFFFF" },
    { bg: "#16A085", text: "#FFFFFF" },
  ];
  return palettes[(id - 1) % palettes.length];
}

/**
 * Ambil inisial dari nama
 * @param {string} name
 * @returns {string}
 */
function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
}

/**
 * Kembalikan style untuk tier badge
 * @param {"Gold"|"Silver"|"Bronze"} tier
 */
function getTierStyle(tier) {
  switch (tier) {
    case "Gold":
      return { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B" };
    case "Silver":
      return { bg: "#F1F5F9", text: "#334155", dot: "#94A3B8" };
    case "Bronze":
      return { bg: "#FEF0E7", text: "#9A3412", dot: "#EA580C" };
    default:
      return { bg: "#F1F5F9", text: "#334155", dot: "#94A3B8" };
  }
}

/** Tier thresholds */
const TIER_THRESHOLDS = { Bronze: 0, Silver: 1000, Gold: 2500, Max: 5000 };

function getNextTier(tier) {
  if (tier === "Bronze") return { label: "Silver", required: TIER_THRESHOLDS.Silver };
  if (tier === "Silver") return { label: "Gold", required: TIER_THRESHOLDS.Gold };
  return { label: "Max", required: TIER_THRESHOLDS.Max };
}

function getTierProgress(tier, points) {
  const current = TIER_THRESHOLDS[tier] ?? 0;
  const next = getNextTier(tier);
  const progress = Math.min(((points - current) / (next.required - current)) * 100, 100);
  return { progress: Math.max(progress, 0), next };
}

// ─── Sub Components ────────────────────────────────────────────

/** Stat Card di bagian atas */
function StatCard({ icon: Icon, label, value, accentColor, subtext }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        overflow: "hidden",
        transition: "all 0.3s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 4, background: accentColor }} />
      <div style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              background: `${accentColor}18`,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: accentColor,
            }}
          >
            <Icon size={22} />
          </div>
        </div>
        <p style={{ margin: "0 0 4px 0", fontSize: "0.82rem", color: "#9A8478", fontWeight: 500 }}>{label}</p>
        <h3 style={{ margin: 0, fontSize: "1.7rem", fontWeight: 700, color: "#2D1B0E", fontFamily: "Georgia, serif" }}>
          {value}
        </h3>
        {subtext && <p style={{ margin: "6px 0 0 0", fontSize: "0.78rem", color: "#9A8478" }}>{subtext}</p>}
      </div>
    </div>
  );
}

/** Avatar bulat dengan inisial */
function CustomerAvatar({ customer, size = 38 }) {
  const color = getAvatarColor(customer.id);
  const initials = getInitials(customer.name);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color.bg,
        color: color.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.36,
        flexShrink: 0,
        letterSpacing: "0.5px",
      }}
    >
      {initials}
    </div>
  );
}

/** Badge tier */
function TierBadge({ tier }) {
  const s = getTierStyle(tier);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: s.bg,
        color: s.text,
        padding: "4px 12px",
        borderRadius: 20,
        fontSize: "0.78rem",
        fontWeight: 700,
        letterSpacing: "0.3px",
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {tier}
    </span>
  );
}

/** Progress bar loyalty */
function LoyaltyProgressBar({ points, tier }) {
  const { progress, next } = getTierProgress(tier, points);
  const current = TIER_THRESHOLDS[tier] ?? 0;
  const barColor = tier === "Gold" ? "#F59E0B" : tier === "Silver" ? "#94A3B8" : "#EA580C";

  return (
    <div style={{ minWidth: 180 }}>
      <div
        style={{
          height: 7,
          background: "#E8E4E0",
          borderRadius: 10,
          overflow: "hidden",
          marginBottom: 6,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${barColor}aa, ${barColor})`,
            borderRadius: 10,
            transition: "width 0.6s ease",
          }}
        />
      </div>
      <p style={{ margin: 0, fontSize: "0.74rem", color: "#9A8478" }}>
        {points - current} / {next.required - current} poin → {next.label}
      </p>
    </div>
  );
}

/** Modal detail pelanggan */
function CustomerDetailModal({ customer, onClose }) {
  if (!customer) return null;
  const tierS = getTierStyle(customer.tier);
  const avatarC = getAvatarColor(customer.id);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(45,27,14,0.45)",
          zIndex: 200,
          backdropFilter: "blur(4px)",
          animation: "fadeIn 0.2s ease",
        }}
      />
      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 201,
          width: "min(520px, 90vw)",
          background: "#FFFFFF",
          borderRadius: 20,
          boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
          overflow: "hidden",
          animation: "slideUp 0.25s ease",
        }}
      >
        {/* Header strip */}
        <div
          style={{
            height: 6,
            background: customer.tier === "Gold"
              ? "linear-gradient(90deg,#F59E0B,#D97706)"
              : customer.tier === "Silver"
              ? "linear-gradient(90deg,#94A3B8,#64748B)"
              : "linear-gradient(90deg,#EA580C,#C2410C)",
          }}
        />

        {/* Close button */}
        <button
          id="close-customer-modal"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "#F5F3F0",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#6B5F52",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#E8E4E0"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#F5F3F0"; }}
        >
          <FiX size={16} />
        </button>

        <div style={{ padding: "24px 28px 28px" }}>
          {/* Avatar + name */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: avatarC.bg,
                color: avatarC.text,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                fontWeight: 700,
                flexShrink: 0,
                boxShadow: `0 4px 16px ${avatarC.bg}55`,
              }}
            >
              {getInitials(customer.name)}
            </div>
            <div>
              <h2 style={{ margin: "0 0 6px 0", fontSize: "1.25rem", fontWeight: 700, color: "#2D1B0E", fontFamily: "Georgia, serif" }}>
                {customer.name}
              </h2>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <TierBadge tier={customer.tier} />
                <span style={{ fontSize: "0.78rem", color: "#9A8478" }}>ID #{customer.id.toString().padStart(4, "0")}</span>
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <InfoRow icon={FiMail} label="Email" value={customer.email} />
            <InfoRow icon={FiPhone} label="Telepon" value={customer.phone} />
            <InfoRow icon={FiCalendar} label="Bergabung" value={formatDate(customer.joined)} />
            <InfoRow icon={FiCalendar} label="Kunjungan Terakhir" value={formatDate(customer.lastVisit)} />
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <StatPill label="Total Kunjungan" value={`${customer.visits}x`} color="#5B4FCF" />
            <StatPill label="Total Belanja" value={formatRupiah(customer.spent)} color="#27AE60" />
            <StatPill label="Poin" value={`⭐ ${customer.points.toLocaleString("id-ID")}`} color="#F59E0B" />
          </div>

          {/* Loyalty progress */}
          <div
            style={{
              background: "#FAFAF8",
              borderRadius: 12,
              padding: "14px 16px",
              border: "1px solid #E8E4E0",
            }}
          >
            <p style={{ margin: "0 0 10px 0", fontSize: "0.82rem", fontWeight: 600, color: "#6B5F52" }}>
              🎯 Progress Loyalty
            </p>
            <LoyaltyProgressBar points={customer.points} tier={customer.tier} />
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

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div
      style={{
        background: "#FAFAF8",
        borderRadius: 10,
        padding: "10px 14px",
        border: "1px solid #E8E4E0",
      }}
    >
      <p style={{ margin: "0 0 3px 0", fontSize: "0.72rem", color: "#9A8478", display: "flex", alignItems: "center", gap: 4 }}>
        <Icon size={11} /> {label}
      </p>
      <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 600, color: "#2D1B0E", wordBreak: "break-all" }}>{value}</p>
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div
      style={{
        textAlign: "center",
        background: `${color}0D`,
        borderRadius: 12,
        padding: "12px 8px",
        border: `1px solid ${color}22`,
      }}
    >
      <p style={{ margin: "0 0 4px 0", fontSize: "1rem", fontWeight: 700, color }}>{value}</p>
      <p style={{ margin: 0, fontSize: "0.7rem", color: "#9A8478" }}>{label}</p>
    </div>
  );
}

// ─── Table Header ──────────────────────────────────────────────
const TH_STYLE = {
  padding: "12px 16px",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "#9A8478",
  textAlign: "left",
  whiteSpace: "nowrap",
  textTransform: "uppercase",
  letterSpacing: "0.4px",
  borderBottom: "2px solid #E8E4E0",
  background: "#FAFAF8",
};

// ─── MAIN PAGE ─────────────────────────────────────────────────
const ROWS_PER_PAGE = 5;

export default function Customers() {
  const [activeTab, setActiveTab] = useState("daftar"); // "daftar" | "loyalty"
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);

  // Stats
  const totalCustomers = CUSTOMERS.length;
  const goldCustomers = CUSTOMERS.filter((c) => c.tier === "Gold").length;
  const topVisitor = CUSTOMERS.reduce((a, b) => (a.visits > b.visits ? a : b));
  const totalSpent = CUSTOMERS.reduce((acc, c) => acc + c.spent, 0);

  // Filter data untuk tab Daftar Pelanggan
  const filteredCustomers = useMemo(() => {
    let result = CUSTOMERS;
    if (tierFilter !== "All") {
      result = result.filter((c) => c.tier === tierFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q)
      );
    }
    return result;
  }, [tierFilter, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / ROWS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedCustomers = filteredCustomers.slice(
    (safePage - 1) * ROWS_PER_PAGE,
    safePage * ROWS_PER_PAGE
  );

  // Loyalty tab: sort by points desc
  const loyaltyData = useMemo(
    () => [...CUSTOMERS].sort((a, b) => b.points - a.points),
    []
  );

  const handleTierFilter = (t) => {
    setTierFilter(t);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleDetail = (customer) => {
    setHighlightedId(customer.id);
    setSelectedCustomer(customer);
  };

  const handleCloseModal = () => {
    setSelectedCustomer(null);
    setHighlightedId(null);
  };

  // ── Tab button style ──
  const tabBtn = (isActive) => ({
    padding: "10px 24px",
    border: "none",
    borderBottom: isActive ? "3px solid #5B4FCF" : "3px solid transparent",
    background: "transparent",
    color: isActive ? "#5B4FCF" : "#9A8478",
    fontWeight: isActive ? 700 : 500,
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  // ── Tier filter button style ──
  const tierBtn = (t) => {
    const active = tierFilter === t;
    return {
      padding: "6px 16px",
      borderRadius: 20,
      border: active ? "2px solid #5B4FCF" : "2px solid #E8E4E0",
      background: active ? "#5B4FCF" : "#FFFFFF",
      color: active ? "#FFFFFF" : "#6B5F52",
      fontWeight: 600,
      fontSize: "0.82rem",
      cursor: "pointer",
      transition: "all 0.2s ease",
    };
  };

  return (
    <div id="customers-page">
      <AdminPageHeader
        emoji="👥"
        title="Manajemen Pelanggan"
        subtitle="Kelola data, loyalty, dan insight pelanggan Brewista."
      />

      {/* ── STAT CARDS ─────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
          marginBottom: 28,
        }}
      >
        <StatCard
          icon={FiUsers}
          label="Total Pelanggan"
          value={totalCustomers.toString()}
          accentColor="#5B4FCF"
          subtext="Terdaftar di sistem"
        />
        <StatCard
          icon={FiAward}
          label="Pelanggan Gold"
          value={goldCustomers.toString()}
          accentColor="#F59E0B"
          subtext="Member tier tertinggi"
        />
        <StatCard
          icon={FiCoffee}
          label="Kunjungan Terbanyak"
          value={`${topVisitor.visits}x`}
          accentColor="#D4963A"
          subtext={topVisitor.name}
        />
        <StatCard
          icon={FiDollarSign}
          label="Total Pengeluaran"
          value={formatRupiah(totalSpent)}
          accentColor="#27AE60"
          subtext="Akumulasi seluruh pelanggan"
        />
      </div>

      {/* ── TAB NAVIGATION ─────────────────────────────────── */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px 16px 0 0",
          borderBottom: "2px solid #E8E4E0",
          display: "flex",
          paddingLeft: 24,
        }}
      >
        <button
          id="tab-daftar-pelanggan"
          style={tabBtn(activeTab === "daftar")}
          onClick={() => setActiveTab("daftar")}
        >
          Daftar Pelanggan
        </button>
        <button
          id="tab-program-loyalty"
          style={tabBtn(activeTab === "loyalty")}
          onClick={() => setActiveTab("loyalty")}
        >
          Program Loyalty
        </button>
      </div>

      {/* ── TAB CONTENT ────────────────────────────────────── */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "0 0 16px 16px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {/* ━━ TAB: DAFTAR PELANGGAN ━━ */}
        {activeTab === "daftar" && (
          <>
            {/* Toolbar */}
            <div
              style={{
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
                borderBottom: "1px solid #E8E4E0",
              }}
            >
              {/* Search */}
              <div style={{ position: "relative", minWidth: 260, flex: "1 1 260px", maxWidth: 380 }}>
                <FiSearch
                  size={16}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9A8478",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="customer-search-input"
                  type="text"
                  placeholder="Cari nama, email, atau no. HP..."
                  value={searchQuery}
                  onChange={handleSearch}
                  style={{
                    width: "100%",
                    paddingLeft: 40,
                    paddingRight: 14,
                    paddingTop: 9,
                    paddingBottom: 9,
                    border: "1.5px solid #E8E4E0",
                    borderRadius: 10,
                    fontSize: "0.87rem",
                    color: "#2D1B0E",
                    outline: "none",
                    background: "#FAFAF8",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#5B4FCF"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#E8E4E0"; }}
                />
              </div>

              {/* Tier filter + Add button */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {["All", "Gold", "Silver", "Bronze"].map((t) => (
                  <button
                    key={t}
                    id={`filter-tier-${t.toLowerCase()}`}
                    style={tierBtn(t)}
                    onClick={() => handleTierFilter(t)}
                  >
                    {t}
                  </button>
                ))}

                <button
                  id="add-customer-btn"
                  style={{
                    marginLeft: 8,
                    padding: "8px 18px",
                    background: "#2D1B0E",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#5B4FCF"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#2D1B0E"; }}
                >
                  + Tambah Pelanggan
                </button>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ ...TH_STYLE }}>Pelanggan</th>
                    <th style={{ ...TH_STYLE }}>Kontak</th>
                    <th style={{ ...TH_STYLE }}>Bergabung</th>
                    <th style={{ ...TH_STYLE, textAlign: "center" }}>Kunjungan</th>
                    <th style={{ ...TH_STYLE }}>Total Belanja</th>
                    <th style={{ ...TH_STYLE, textAlign: "center" }}>Poin</th>
                    <th style={{ ...TH_STYLE }}>Tier</th>
                    <th style={{ ...TH_STYLE, textAlign: "center" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        style={{
                          textAlign: "center",
                          padding: "48px 24px",
                          color: "#9A8478",
                          fontSize: "0.9rem",
                        }}
                      >
                        😕 Tidak ada pelanggan yang ditemukan.
                      </td>
                    </tr>
                  ) : (
                    paginatedCustomers.map((customer, idx) => {
                      const isEven = idx % 2 === 0;
                      const isHighlighted = highlightedId === customer.id;
                      return (
                        <CustomerRow
                          key={customer.id}
                          customer={customer}
                          isEven={isEven}
                          isHighlighted={isHighlighted}
                          onDetail={() => handleDetail(customer)}
                        />
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <TableFooter
              current={safePage}
              total={totalPages}
              showing={paginatedCustomers.length}
              totalItems={filteredCustomers.length}
              onPage={setCurrentPage}
            />
          </>
        )}

        {/* ━━ TAB: PROGRAM LOYALTY ━━ */}
        {activeTab === "loyalty" && (
          <>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #E8E4E0" }}>
              <p style={{ margin: 0, fontSize: "0.88rem", color: "#9A8478" }}>
                Diurutkan berdasarkan poin tertinggi · {CUSTOMERS.length} pelanggan aktif
              </p>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ ...TH_STYLE }}>Pelanggan</th>
                    <th style={{ ...TH_STYLE }}>Tier</th>
                    <th style={{ ...TH_STYLE, textAlign: "center" }}>Poin</th>
                    <th style={{ ...TH_STYLE }}>Progress ke Tier Berikutnya</th>
                    <th style={{ ...TH_STYLE, textAlign: "center" }}>Reward Tersedia</th>
                  </tr>
                </thead>
                <tbody>
                  {loyaltyData.map((customer, idx) => {
                    const rewards = Math.floor(customer.points / 500);
                    const isEven = idx % 2 === 0;
                    return (
                      <tr
                        key={customer.id}
                        style={{
                          background: isEven ? "#FFFFFF" : "#FAFAF8",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#F3F0FF"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = isEven ? "#FFFFFF" : "#FAFAF8"; }}
                      >
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <CustomerAvatar customer={customer} />
                            <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#2D1B0E" }}>
                              {customer.name}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <TierBadge tier={customer.tier} />
                        </td>
                        <td style={{ padding: "14px 16px", textAlign: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                            <FiStar size={14} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                            <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "#D97706" }}>
                              {customer.points.toLocaleString("id-ID")}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <LoyaltyProgressBar points={customer.points} tier={customer.tier} />
                        </td>
                        <td style={{ padding: "14px 16px", textAlign: "center" }}>
                          {rewards > 0 ? (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                background: "#ECFDF5",
                                color: "#059669",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                                padding: "4px 14px",
                                borderRadius: 20,
                                border: "1.5px solid #A7F3D0",
                              }}
                            >
                              🎁 {rewards} reward
                            </span>
                          ) : (
                            <span style={{ color: "#9A8478", fontSize: "0.82rem" }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #E8E4E0",
                fontSize: "0.82rem",
                color: "#9A8478",
              }}
            >
              Menampilkan {loyaltyData.length} dari {CUSTOMERS.length} pelanggan
            </div>
          </>
        )}
      </div>

      {/* ── CUSTOMER DETAIL MODAL ───────────────────────────── */}
      {selectedCustomer && (
        <CustomerDetailModal customer={selectedCustomer} onClose={handleCloseModal} />
      )}
    </div>
  );
}

// ─── CustomerRow ───────────────────────────────────────────────
function CustomerRow({ customer, isEven, isHighlighted, onDetail }) {
  const [hovered, setHovered] = useState(false);

  const rowBg = isHighlighted
    ? "#EDE9FF"
    : hovered
    ? "#F3F0FF"
    : isEven
    ? "#FFFFFF"
    : "#FAFAF8";

  const tdStyle = { padding: "14px 16px", fontSize: "0.87rem", color: "#2D1B0E" };

  return (
    <tr
      style={{ background: rowBg, transition: "background 0.15s", cursor: "default" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Pelanggan */}
      <td style={{ ...tdStyle }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <CustomerAvatar customer={customer} />
          <div>
            <p style={{ margin: 0, fontWeight: 600, color: "#2D1B0E" }}>{customer.name}</p>
            <p style={{ margin: "2px 0 0 0", fontSize: "0.72rem", color: "#9A8478" }}>
              #{customer.id.toString().padStart(4, "0")}
            </p>
          </div>
        </div>
      </td>

      {/* Kontak */}
      <td style={{ ...tdStyle }}>
        <p style={{ margin: 0, color: "#2D1B0E" }}>{customer.email}</p>
        <p style={{ margin: "2px 0 0 0", fontSize: "0.78rem", color: "#9A8478" }}>{customer.phone}</p>
      </td>

      {/* Bergabung */}
      <td style={{ ...tdStyle, color: "#6B5F52" }}>{formatDate(customer.joined)}</td>

      {/* Kunjungan */}
      <td style={{ ...tdStyle, textAlign: "center" }}>
        <span style={{ fontWeight: 600, color: "#5B4FCF" }}>{customer.visits}</span>
        <span style={{ color: "#9A8478", fontSize: "0.78rem" }}>x</span>
      </td>

      {/* Total Belanja */}
      <td style={{ ...tdStyle }}>
        <span style={{ fontWeight: 600, color: "#27AE60" }}>{formatRupiah(customer.spent)}</span>
      </td>

      {/* Poin */}
      <td style={{ ...tdStyle, textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <FiStar size={13} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
          <span style={{ fontWeight: 600 }}>{customer.points.toLocaleString("id-ID")}</span>
        </div>
      </td>

      {/* Tier */}
      <td style={{ ...tdStyle }}>
        <TierBadge tier={customer.tier} />
      </td>

      {/* Aksi */}
      <td style={{ ...tdStyle, textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <button
            id={`detail-btn-${customer.id}`}
            onClick={onDetail}
            style={{
              padding: "5px 14px",
              border: "1.5px solid #5B4FCF",
              borderRadius: 8,
              background: "transparent",
              color: "#5B4FCF",
              fontWeight: 600,
              fontSize: "0.8rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#5B4FCF";
              e.currentTarget.style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#5B4FCF";
            }}
          >
            Detail
          </button>
          <button
            id={`edit-btn-${customer.id}`}
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px solid #E8E4E0",
              borderRadius: 8,
              background: "#FFFFFF",
              color: "#9A8478",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#D4963A";
              e.currentTarget.style.color = "#D4963A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E8E4E0";
              e.currentTarget.style.color = "#9A8478";
            }}
          >
            <FiEdit2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── TableFooter ───────────────────────────────────────────────
function TableFooter({ current, total, showing, totalItems, onPage }) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div
      style={{
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        borderTop: "1px solid #E8E4E0",
      }}
    >
      <p style={{ margin: 0, fontSize: "0.82rem", color: "#9A8478" }}>
        Menampilkan{" "}
        <strong style={{ color: "#2D1B0E" }}>{showing}</strong> dari{" "}
        <strong style={{ color: "#2D1B0E" }}>{totalItems}</strong> pelanggan
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* Prev */}
        <PaginationBtn
          onClick={() => onPage(Math.max(1, current - 1))}
          disabled={current === 1}
          id="pagination-prev"
        >
          <FiChevronLeft size={16} />
        </PaginationBtn>

        {/* Page numbers */}
        {pages.map((p) => (
          <PaginationBtn
            key={p}
            onClick={() => onPage(p)}
            active={p === current}
            id={`pagination-page-${p}`}
          >
            {p}
          </PaginationBtn>
        ))}

        {/* Next */}
        <PaginationBtn
          onClick={() => onPage(Math.min(total, current + 1))}
          disabled={current === total}
          id="pagination-next"
        >
          <FiChevronRight size={16} />
        </PaginationBtn>
      </div>
    </div>
  );
}

function PaginationBtn({ children, onClick, active = false, disabled = false, id }) {
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 34,
        height: 34,
        padding: "0 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        border: active ? "none" : "1.5px solid #E8E4E0",
        background: active ? "#5B4FCF" : disabled ? "#F5F3F0" : "#FFFFFF",
        color: active ? "#FFFFFF" : disabled ? "#C5BDB7" : "#6B5F52",
        fontWeight: active ? 700 : 500,
        fontSize: "0.85rem",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!active && !disabled) {
          e.currentTarget.style.background = "#EDE9FF";
          e.currentTarget.style.borderColor = "#5B4FCF";
          e.currentTarget.style.color = "#5B4FCF";
        }
      }}
      onMouseLeave={(e) => {
        if (!active && !disabled) {
          e.currentTarget.style.background = "#FFFFFF";
          e.currentTarget.style.borderColor = "#E8E4E0";
          e.currentTarget.style.color = "#6B5F52";
        }
      }}
    >
      {children}
    </button>
  );
}
