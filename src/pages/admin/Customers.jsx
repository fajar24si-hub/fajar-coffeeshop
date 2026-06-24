// src/pages/admin/Customers.jsx
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  FiUsers, FiAward, FiCoffee, FiDollarSign,
  FiSearch, FiEdit2, FiX, FiChevronLeft, FiChevronRight,
  FiStar, FiPhone, FiMail, FiCalendar, FiTrash2,
  FiUserPlus, FiAlertCircle, FiCheckCircle, FiRefreshCw,
} from "react-icons/fi";
import AdminPageHeader from "../../components/admin/ui/AdminPageHeader";
import AdminCard from "../../components/admin/ui/AdminCard";
import { ToastProvider, Toast, useToast } from "../../components/ui/toast";
import { LoyaltyProgress } from "../../components/ui/progress";
import { supabase } from "../../lib/supabaseClient";

// ─── Types ────────────────────────────────────────────────────
/**
 * @typedef {{
 *   id: string;
 *   name: string;
 *   email: string;
 *   phone: string;
 *   joined: string;
 *   visits: number;
 *   spent: number;
 *   tier: "Gold" | "Silver" | "Bronze";
 *   points: number;
 *   last_visit: string;
 *   role: string;
 * }} Customer
 */

// ─── Helpers ──────────────────────────────────────────────────
function formatRupiah(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function getAvatarColor(id) {
  // Hash string id to a consistent color
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  const palettes = [
    { bg: "#5B4FCF", text: "#FFFFFF" },
    { bg: "#D4963A", text: "#FFFFFF" },
    { bg: "#27AE60", text: "#FFFFFF" },
    { bg: "#E74C3C", text: "#FFFFFF" },
    { bg: "#8E44AD", text: "#FFFFFF" },
    { bg: "#2980B9", text: "#FFFFFF" },
    { bg: "#16A085", text: "#FFFFFF" },
  ];
  return palettes[Math.abs(hash) % palettes.length];
}

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
}

function getTierStyle(tier) {
  switch (tier) {
    case "Gold":   return { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B" };
    case "Silver": return { bg: "#F1F5F9", text: "#334155", dot: "#94A3B8" };
    case "Bronze": return { bg: "#FEF0E7", text: "#9A3412", dot: "#EA580C" };
    default:       return { bg: "#F1F5F9", text: "#334155", dot: "#94A3B8" };
  }
}

const TIER_THRESHOLDS = { Bronze: 0, Silver: 1000, Gold: 2500, Max: 5000 };

function getNextTier(tier) {
  if (tier === "Bronze") return { label: "Silver", required: TIER_THRESHOLDS.Silver };
  if (tier === "Silver") return { label: "Gold",   required: TIER_THRESHOLDS.Gold   };
  return { label: "Max", required: TIER_THRESHOLDS.Max };
}

function getTierProgress(tier, points) {
  const current = TIER_THRESHOLDS[tier] ?? 0;
  const next     = getNextTier(tier);
  const progress = Math.min(((points - current) / (next.required - current)) * 100, 100);
  return { progress: Math.max(progress, 0), next };
}

// ─── Sub Components ────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, accentColor, subtext }) {
  return (
    <div
      style={{
        background: "#FFFFFF", borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden",
        transition: "all 0.3s ease", cursor: "default",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.10)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
    >
      <div style={{ height: 4, background: accentColor }} />
      <div style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, background: `${accentColor}18`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: accentColor }}>
            <Icon size={22} />
          </div>
        </div>
        <p style={{ margin: "0 0 4px 0", fontSize: "0.82rem", color: "#9A8478", fontWeight: 500 }}>{label}</p>
        <h3 style={{ margin: 0, fontSize: "1.7rem", fontWeight: 700, color: "#2D1B0E", fontFamily: "Georgia, serif" }}>{value}</h3>
        {subtext && <p style={{ margin: "6px 0 0 0", fontSize: "0.78rem", color: "#9A8478" }}>{subtext}</p>}
      </div>
    </div>
  );
}

function CustomerAvatar({ customer, size = 38 }) {
  const color    = getAvatarColor(customer.id);
  const initials = getInitials(customer.name);
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color.bg, color: color.text, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.36, flexShrink: 0, letterSpacing: "0.5px" }}>
      {initials}
    </div>
  );
}

function TierBadge({ tier }) {
  const s = getTierStyle(tier);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: s.bg, color: s.text, padding: "4px 12px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.3px" }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {tier}
    </span>
  );
}

function LoyaltyProgressBar({ points, tier }) {
  return (
    <div style={{ minWidth: 180 }}>
      <LoyaltyProgress points={points} tier={tier} showLabel={true} />
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div style={{ background: "#FAFAF8", borderRadius: 10, padding: "10px 14px", border: "1px solid #E8E4E0" }}>
      <p style={{ margin: "0 0 3px 0", fontSize: "0.72rem", color: "#9A8478", display: "flex", alignItems: "center", gap: 4 }}>
        <Icon size={11} /> {label}
      </p>
      <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 600, color: "#2D1B0E", wordBreak: "break-all" }}>{value || "—"}</p>
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div style={{ textAlign: "center", background: `${color}0D`, borderRadius: 12, padding: "12px 8px", border: `1px solid ${color}22` }}>
      <p style={{ margin: "0 0 4px 0", fontSize: "1rem", fontWeight: 700, color }}>{value}</p>
      <p style={{ margin: 0, fontSize: "0.7rem", color: "#9A8478" }}>{label}</p>
    </div>
  );
}

// ─── Customer Detail Modal ─────────────────────────────────────
function CustomerDetailModal({ customer, onClose }) {
  if (!customer) return null;
  const avatarC = getAvatarColor(customer.id);

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(45,27,14,0.45)", zIndex: 200, backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 201, width: "min(520px, 90vw)", background: "#FFFFFF", borderRadius: 20, boxShadow: "0 24px 60px rgba(0,0,0,0.18)", overflow: "hidden", animation: "slideUp 0.25s ease" }}>
        <div style={{ height: 6, background: customer.tier === "Gold" ? "linear-gradient(90deg,#F59E0B,#D97706)" : customer.tier === "Silver" ? "linear-gradient(90deg,#94A3B8,#64748B)" : "linear-gradient(90deg,#EA580C,#C2410C)" }} />
        <button id="close-customer-modal" onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "#F5F3F0", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6B5F52", transition: "all 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#E8E4E0"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#F5F3F0"; }}>
          <FiX size={16} />
        </button>
        <div style={{ padding: "24px 28px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: avatarC.bg, color: avatarC.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", fontWeight: 700, flexShrink: 0, boxShadow: `0 4px 16px ${avatarC.bg}55` }}>
              {getInitials(customer.name)}
            </div>
            <div>
              <h2 style={{ margin: "0 0 6px 0", fontSize: "1.25rem", fontWeight: 700, color: "#2D1B0E", fontFamily: "Georgia, serif" }}>{customer.name}</h2>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <TierBadge tier={customer.tier} />
                <span style={{ fontSize: "0.78rem", color: "#9A8478" }}>Role: {customer.role}</span>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <InfoRow icon={FiMail}     label="Email"              value={customer.email} />
            <InfoRow icon={FiPhone}    label="Telepon"            value={customer.phone} />
            <InfoRow icon={FiCalendar} label="Bergabung"          value={formatDate(customer.joined)} />
            <InfoRow icon={FiCalendar} label="Kunjungan Terakhir" value={formatDate(customer.last_visit)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
            <StatPill label="Total Kunjungan" value={`${customer.visits}x`}                            color="#5B4FCF" />
            <StatPill label="Total Belanja"   value={formatRupiah(customer.spent)}                      color="#27AE60" />
            <StatPill label="Poin"            value={`⭐ ${Number(customer.points).toLocaleString("id-ID")}`} color="#F59E0B" />
          </div>
          <div style={{ background: "#FAFAF8", borderRadius: 12, padding: "14px 16px", border: "1px solid #E8E4E0" }}>
            <p style={{ margin: "0 0 10px 0", fontSize: "0.82rem", fontWeight: 600, color: "#6B5F52" }}>🎯 Progress Loyalty</p>
            <LoyaltyProgressBar points={customer.points} tier={customer.tier} />
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translate(-50%,-46%) } to { opacity:1; transform:translate(-50%,-50%) } }
      `}</style>
    </>
  );
}

// ─── Add / Edit User Modal ─────────────────────────────────────
const EMPTY_FORM = { name: "", email: "", phone: "", password: "", role: "customer", tier: "Bronze", points: 0, visits: 0, spent: 0 };

function UserFormModal({ editUser, onClose, onSaved }) {
  const [form, setForm]       = useState(editUser ? { ...editUser, password: "" } : EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const isEdit = !!editUser;

  const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isEdit) {
        // UPDATE existing user
        const updates = {
          name:   form.name,
          phone:  form.phone,
          role:   form.role,
          tier:   form.tier,
          points: Number(form.points),
          visits: Number(form.visits),
          spent:  Number(form.spent),
        };
        const { error: upErr } = await supabase.from("users").update(updates).eq("id", editUser.id);
        if (upErr) throw upErr;
      } else {
        // CREATE new user via Supabase Auth + update profile (karena insert ditangani trigger)
        if (!form.password || form.password.length < 6) {
          throw new Error("Password minimal 6 karakter.");
        }
        
        const { data: authData, error: authErr } = await supabase.auth.signUp({ 
          email: form.email, 
          password: form.password, 
          options: { data: { name: form.name, phone: form.phone } } 
        });

        if (authErr) throw authErr;

        if (authData?.user) {
          // Trigger database otomatis melakukan INSERT. Kita cukup UPDATE field yang tidak diset trigger.
          const { error: profErr } = await supabase.from("users").update({
            role:   form.role,
            tier:   form.tier,
            points: Number(form.points),
            visits: Number(form.visits),
            spent:  Number(form.spent),
          }).eq("id", authData.user.id);
          
          if (profErr) {
            console.warn("Gagal update profil tambahan:", profErr);
          }
        }
      }
      onSaved();
    } catch (err) {
      console.error("Add user error:", err);
      const msg = err.message || JSON.stringify(err);
      if (msg.includes("already registered") || msg.includes("already been registered")) {
        setError("Email sudah terdaftar.");
      } else if (msg === "{}" || !msg) {
        setError("Terjadi kesalahan sistem (error kosong).");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputSt = {
    width: "100%", padding: "10px 12px", border: "1.5px solid #E8E4E0", borderRadius: 8,
    fontSize: "0.87rem", color: "#2D1B0E", background: "#FAFAF8", boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif", outline: "none", transition: "border-color 0.2s",
  };
  const labelSt = { display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#6B5F52", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" };
  const rowSt   = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(45,27,14,0.45)", zIndex: 200, backdropFilter: "blur(4px)" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 201, width: "min(540px, 95vw)", background: "#FFFFFF", borderRadius: 20, boxShadow: "0 24px 60px rgba(0,0,0,0.18)", overflow: "hidden" }}>
        <div style={{ height: 5, background: "linear-gradient(90deg, #5B4FCF, #8B7CF8)" }} />
        <div style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#2D1B0E", fontFamily: "Georgia, serif" }}>
              {isEdit ? "✏️ Edit User" : "➕ Tambah User Baru"}
            </h2>
            <button onClick={onClose} style={{ background: "#F5F3F0", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B5F52" }}>
              <FiX size={15} />
            </button>
          </div>

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, marginBottom: 16, color: "#DC2626", fontSize: "0.85rem" }}>
              <FiAlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={rowSt}>
              <div>
                <label style={labelSt}>Nama Lengkap *</label>
                <input required style={inputSt} value={form.name} onChange={(e) => handleChange("name", e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = "#5B4FCF")} onBlur={(e) => (e.target.style.borderColor = "#E8E4E0")} placeholder="Nama lengkap" />
              </div>
              <div>
                <label style={labelSt}>No. HP</label>
                <input style={inputSt} value={form.phone} onChange={(e) => handleChange("phone", e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = "#5B4FCF")} onBlur={(e) => (e.target.style.borderColor = "#E8E4E0")} placeholder="08xx-xxxx-xxxx" />
              </div>
            </div>

            <div>
              <label style={labelSt}>Email *</label>
              <input required type="email" style={{ ...inputSt, background: isEdit ? "#F0EDEA" : "#FAFAF8" }} value={form.email}
                onChange={(e) => handleChange("email", e.target.value)} readOnly={isEdit}
                onFocus={(e) => { if (!isEdit) e.target.style.borderColor = "#5B4FCF"; }} onBlur={(e) => (e.target.style.borderColor = "#E8E4E0")} placeholder="email@domain.com" />
              {isEdit && <p style={{ margin: "4px 0 0 0", fontSize: "0.72rem", color: "#9A8478" }}>Email tidak dapat diubah setelah pendaftaran.</p>}
            </div>

            {!isEdit && (
              <div>
                <label style={labelSt}>Password *</label>
                <input required type="password" style={inputSt} value={form.password} onChange={(e) => handleChange("password", e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = "#5B4FCF")} onBlur={(e) => (e.target.style.borderColor = "#E8E4E0")} placeholder="Min. 6 karakter" />
              </div>
            )}

            <div style={rowSt}>
              <div>
                <label style={labelSt}>Role</label>
                <select style={inputSt} value={form.role} onChange={(e) => handleChange("role", e.target.value)}>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label style={labelSt}>Tier Loyalty</label>
                <select style={inputSt} value={form.tier} onChange={(e) => handleChange("tier", e.target.value)}>
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                </select>
              </div>
            </div>

            <div style={rowSt}>
              <div>
                <label style={labelSt}>Poin</label>
                <input type="number" min={0} style={inputSt} value={form.points} onChange={(e) => handleChange("points", e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = "#5B4FCF")} onBlur={(e) => (e.target.style.borderColor = "#E8E4E0")} />
              </div>
              <div>
                <label style={labelSt}>Jumlah Kunjungan</label>
                <input type="number" min={0} style={inputSt} value={form.visits} onChange={(e) => handleChange("visits", e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = "#5B4FCF")} onBlur={(e) => (e.target.style.borderColor = "#E8E4E0")} />
              </div>
            </div>

            <div>
              <label style={labelSt}>Total Belanja (Rp)</label>
              <input type="number" min={0} style={inputSt} value={form.spent} onChange={(e) => handleChange("spent", e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "#5B4FCF")} onBlur={(e) => (e.target.style.borderColor = "#E8E4E0")} />
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button type="button" onClick={onClose} style={{ flex: 1, padding: "11px", border: "1.5px solid #E8E4E0", borderRadius: 10, background: "#FFFFFF", color: "#6B5F52", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#9A8478"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8E4E0"; }}>
                Batal
              </button>
              <button type="submit" disabled={loading} style={{ flex: 2, padding: "11px", border: "none", borderRadius: 10, background: loading ? "#9A8478" : "linear-gradient(135deg,#5B4FCF,#8B7CF8)", color: "#FFFFFF", fontWeight: 700, fontSize: "0.9rem", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
                {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ─── Delete Confirm Modal ──────────────────────────────────────
function DeleteConfirmModal({ customer, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("users").delete().eq("id", customer.id);
      if (error) throw error;
      onDeleted();
    } catch (err) {
      alert("Gagal menghapus: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(45,27,14,0.5)", zIndex: 300, backdropFilter: "blur(4px)" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 301, width: "min(420px, 90vw)", background: "#FFFFFF", borderRadius: 16, boxShadow: "0 20px 50px rgba(0,0,0,0.2)", padding: "28px 28px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px auto" }}>
            <FiTrash2 size={24} color="#DC2626" />
          </div>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", fontWeight: 700, color: "#2D1B0E" }}>Hapus User?</h3>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "#6B5F52" }}>
            User <strong>{customer.name}</strong> akan dihapus permanen dan tidak dapat dikembalikan.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", border: "1.5px solid #E8E4E0", borderRadius: 10, background: "#FFFFFF", color: "#6B5F52", fontWeight: 600, cursor: "pointer" }}>Batal</button>
          <button onClick={handleDelete} disabled={loading} style={{ flex: 1, padding: "10px", border: "none", borderRadius: 10, background: loading ? "#9A8478" : "#DC2626", color: "#FFFFFF", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Table styles ──────────────────────────────────────────────
const TH_STYLE = {
  padding: "12px 16px", fontSize: "0.75rem", fontWeight: 600, color: "#9A8478",
  textAlign: "left", whiteSpace: "nowrap", textTransform: "uppercase",
  letterSpacing: "0.4px", borderBottom: "2px solid #E8E4E0", background: "#FAFAF8",
};

// ─── CustomerRow ───────────────────────────────────────────────
function CustomerRow({ customer, isEven, isHighlighted, onDetail, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const rowBg = isHighlighted ? "#EDE9FF" : hovered ? "#F3F0FF" : isEven ? "#FFFFFF" : "#FAFAF8";
  const tdStyle = { padding: "14px 16px", fontSize: "0.87rem", color: "#2D1B0E" };

  return (
    <tr style={{ background: rowBg, transition: "background 0.15s", cursor: "default" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <td style={{ ...tdStyle }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <CustomerAvatar customer={customer} />
          <div>
            <p style={{ margin: 0, fontWeight: 600, color: "#2D1B0E" }}>{customer.name}</p>
            <p style={{ margin: "2px 0 0 0", fontSize: "0.72rem", color: "#9A8478" }}>{customer.role}</p>
          </div>
        </div>
      </td>
      <td style={{ ...tdStyle }}>
        <p style={{ margin: 0 }}>{customer.email}</p>
        <p style={{ margin: "2px 0 0 0", fontSize: "0.78rem", color: "#9A8478" }}>{customer.phone || "—"}</p>
      </td>
      <td style={{ ...tdStyle, color: "#6B5F52" }}>{formatDate(customer.joined)}</td>
      <td style={{ ...tdStyle, textAlign: "center" }}>
        <span style={{ fontWeight: 600, color: "#5B4FCF" }}>{customer.visits}</span>
        <span style={{ color: "#9A8478", fontSize: "0.78rem" }}>x</span>
      </td>
      <td style={{ ...tdStyle }}>
        <span style={{ fontWeight: 600, color: "#27AE60" }}>{formatRupiah(customer.spent)}</span>
      </td>
      <td style={{ ...tdStyle, textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <FiStar size={13} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
          <span style={{ fontWeight: 600 }}>{Number(customer.points).toLocaleString("id-ID")}</span>
        </div>
      </td>
      <td style={{ ...tdStyle }}><TierBadge tier={customer.tier} /></td>
      <td style={{ ...tdStyle, textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <button id={`detail-btn-${customer.id}`} onClick={onDetail}
            style={{ padding: "5px 12px", border: "1.5px solid #5B4FCF", borderRadius: 8, background: "transparent", color: "#5B4FCF", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#5B4FCF"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#5B4FCF"; }}>
            Detail
          </button>
          <button id={`edit-btn-${customer.id}`} onClick={onEdit}
            style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #E8E4E0", borderRadius: 8, background: "#FFFFFF", color: "#9A8478", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D4963A"; e.currentTarget.style.color = "#D4963A"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8E4E0"; e.currentTarget.style.color = "#9A8478"; }}>
            <FiEdit2 size={13} />
          </button>
          <button id={`delete-btn-${customer.id}`} onClick={onDelete}
            style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #E8E4E0", borderRadius: 8, background: "#FFFFFF", color: "#9A8478", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#DC2626"; e.currentTarget.style.color = "#DC2626"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8E4E0"; e.currentTarget.style.color = "#9A8478"; }}>
            <FiTrash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── TableFooter ───────────────────────────────────────────────
function TableFooter({ current, total, showing, totalItems, onPage }) {
  const MAX_VISIBLE = 7;
  let pages = [];
  if (total <= MAX_VISIBLE) {
    pages = Array.from({ length: total }, (_, i) => i + 1);
  } else {
    const half = Math.floor(MAX_VISIBLE / 2);
    let start  = Math.max(1, current - half);
    let end    = Math.min(total, start + MAX_VISIBLE - 1);
    if (end - start < MAX_VISIBLE - 1) start = Math.max(1, end - MAX_VISIBLE + 1);
    pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  return (
    <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, borderTop: "1px solid #E8E4E0" }}>
      <p style={{ margin: 0, fontSize: "0.82rem", color: "#9A8478" }}>
        Menampilkan <strong style={{ color: "#2D1B0E" }}>{showing}</strong> dari <strong style={{ color: "#2D1B0E" }}>{totalItems}</strong> user
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <PaginationBtn onClick={() => onPage(Math.max(1, current - 1))} disabled={current === 1} id="pagination-prev"><FiChevronLeft size={16} /></PaginationBtn>
        {pages.map((p) => <PaginationBtn key={p} onClick={() => onPage(p)} active={p === current} id={`pagination-page-${p}`}>{p}</PaginationBtn>)}
        <PaginationBtn onClick={() => onPage(Math.min(total, current + 1))} disabled={current === total} id="pagination-next"><FiChevronRight size={16} /></PaginationBtn>
      </div>
    </div>
  );
}

function PaginationBtn({ children, onClick, active = false, disabled = false, id }) {
  return (
    <button id={id} onClick={onClick} disabled={disabled}
      style={{ minWidth: 34, height: 34, padding: "0 10px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: active ? "none" : "1.5px solid #E8E4E0", background: active ? "#5B4FCF" : disabled ? "#F5F3F0" : "#FFFFFF", color: active ? "#FFFFFF" : disabled ? "#C5BDB7" : "#6B5F52", fontWeight: active ? 700 : 500, fontSize: "0.85rem", cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s" }}
      onMouseEnter={(e) => { if (!active && !disabled) { e.currentTarget.style.background = "#EDE9FF"; e.currentTarget.style.borderColor = "#5B4FCF"; e.currentTarget.style.color = "#5B4FCF"; } }}
      onMouseLeave={(e) => { if (!active && !disabled) { e.currentTarget.style.background = "#FFFFFF"; e.currentTarget.style.borderColor = "#E8E4E0"; e.currentTarget.style.color = "#6B5F52"; } }}>
      {children}
    </button>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────
const ROWS_PER_PAGE = 10;

export default function Customers() {
  const [customers, setCustomers]       = useState([]);
  const [dbLoading, setDbLoading]       = useState(true);
  const [dbError, setDbError]           = useState("");
  const [activeTab, setActiveTab]       = useState("daftar");
  const [searchQuery, setSearchQuery]   = useState("");
  const [tierFilter, setTierFilter]     = useState("All");
  const [roleFilter, setRoleFilter]     = useState("All");
  const [currentPage, setCurrentPage]   = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editUser, setEditUser]         = useState(null);   // null = tutup modal edit
  const [deleteTarget, setDeleteTarget] = useState(null);   // null = tutup modal hapus
  const [highlightedId, setHighlightedId] = useState(null);
  const { toasts, toast, dismiss }      = useToast();

  // ── Fetch data dari Supabase ──
  const fetchCustomers = useCallback(async () => {
    setDbLoading(true);
    setDbError("");
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      setDbError(err.message || "Gagal memuat data.");
    } finally {
      setDbLoading(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  // ── Stats ──
  const totalCustomers = customers.length;
  const goldCustomers  = customers.filter((c) => c.tier === "Gold").length;
  const topVisitor     = customers.length ? customers.reduce((a, b) => (Number(a.visits) > Number(b.visits) ? a : b)) : null;
  const totalSpent     = customers.reduce((acc, c) => acc + Number(c.spent || 0), 0);

  // ── Filter ──
  const filteredCustomers = useMemo(() => {
    let result = customers;
    if (tierFilter !== "All") result = result.filter((c) => c.tier === tierFilter);
    if (roleFilter !== "All") result = result.filter((c) => c.role === roleFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q)
      );
    }
    return result;
  }, [customers, tierFilter, roleFilter, searchQuery]);

  const totalPages         = Math.max(1, Math.ceil(filteredCustomers.length / ROWS_PER_PAGE));
  const safePage           = Math.min(currentPage, totalPages);
  const paginatedCustomers = filteredCustomers.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);

  const loyaltyData = useMemo(() => [...customers].sort((a, b) => Number(b.points) - Number(a.points)), [customers]);

  const handleTierFilter   = (t) => { setTierFilter(t); setCurrentPage(1); };
  const handleRoleFilter   = (r) => { setRoleFilter(r); setCurrentPage(1); };
  const handleSearch       = (e) => { setSearchQuery(e.target.value); setCurrentPage(1); };

  const handleDetail = (customer) => {
    setHighlightedId(customer.id);
    setSelectedCustomer(customer);
    toast({ title: `Detail: ${customer.name}`, description: `Tier ${customer.tier} · ${Number(customer.points).toLocaleString("id-ID")} poin`, variant: customer.tier === "Gold" ? "warning" : "default" });
  };

  const handleSaved = async () => {
    await fetchCustomers();
    setEditUser(null);
    toast({ title: editUser ? "User diperbarui ✓" : "User ditambahkan ✓", description: "Data berhasil disimpan ke Supabase.", variant: "success" });
  };

  const handleDeleted = async () => {
    await fetchCustomers();
    setDeleteTarget(null);
    toast({ title: "User dihapus", description: "Data user telah dihapus dari database.", variant: "default" });
  };

  const tabBtn  = (a) => ({ padding: "10px 24px", border: "none", borderBottom: a ? "3px solid #5B4FCF" : "3px solid transparent", background: "transparent", color: a ? "#5B4FCF" : "#9A8478", fontWeight: a ? 700 : 500, fontSize: "0.9rem", cursor: "pointer", transition: "all 0.2s ease" });
  const filterChip = (active, color = "#5B4FCF") => ({ padding: "6px 14px", borderRadius: 20, border: active ? `2px solid ${color}` : "2px solid #E8E4E0", background: active ? color : "#FFFFFF", color: active ? "#FFFFFF" : "#6B5F52", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", transition: "all 0.2s ease" });

  return (
    <div id="customers-page">
      <AdminPageHeader emoji="👥" title="Manajemen User" subtitle="Kelola data user, loyalty, dan role melalui Supabase." />

      {/* ── STAT CARDS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 28 }}>
        <StatCard icon={FiUsers}     label="Total User"         value={totalCustomers.toString()}          accentColor="#5B4FCF" subtext="Terdaftar di Supabase" />
        <StatCard icon={FiAward}     label="Member Gold"        value={goldCustomers.toString()}            accentColor="#F59E0B" subtext="Tier tertinggi" />
        <StatCard icon={FiCoffee}    label="Kunjungan Terbanyak" value={topVisitor ? `${topVisitor.visits}x` : "—"} accentColor="#D4963A" subtext={topVisitor?.name || ""} />
        <StatCard icon={FiDollarSign} label="Total Pengeluaran"  value={formatRupiah(totalSpent)}           accentColor="#27AE60" subtext="Akumulasi semua user" />
      </div>

      {/* ── ERROR STATE ── */}
      {dbError && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, marginBottom: 20, color: "#DC2626" }}>
          <FiAlertCircle size={18} />
          <span style={{ fontSize: "0.9rem" }}>{dbError}</span>
          <button onClick={fetchCustomers} style={{ marginLeft: "auto", padding: "6px 12px", border: "1px solid #DC2626", borderRadius: 8, background: "transparent", color: "#DC2626", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
            Coba Lagi
          </button>
        </div>
      )}

      {/* ── TAB NAVIGATION ── */}
      <div style={{ background: "#FFFFFF", borderRadius: "16px 16px 0 0", borderBottom: "2px solid #E8E4E0", display: "flex", paddingLeft: 24 }}>
        <button id="tab-daftar-pelanggan" style={tabBtn(activeTab === "daftar")} onClick={() => setActiveTab("daftar")}>Daftar User</button>
        <button id="tab-program-loyalty"  style={tabBtn(activeTab === "loyalty")} onClick={() => setActiveTab("loyalty")}>Program Loyalty</button>
      </div>

      {/* ── TAB CONTENT ── */}
      <div style={{ background: "#FFFFFF", borderRadius: "0 0 16px 16px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", overflow: "hidden" }}>

        {/* ━━ TAB: DAFTAR USER ━━ */}
        {activeTab === "daftar" && (
          <>
            {/* Toolbar */}
            <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, borderBottom: "1px solid #E8E4E0" }}>
              {/* Search */}
              <div style={{ position: "relative", minWidth: 260, flex: "1 1 260px", maxWidth: 380 }}>
                <FiSearch size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9A8478", pointerEvents: "none" }} />
                <input id="customer-search-input" type="text" placeholder="Cari nama, email, atau no. HP..." value={searchQuery} onChange={handleSearch}
                  style={{ width: "100%", paddingLeft: 40, paddingRight: 14, paddingTop: 9, paddingBottom: 9, border: "1.5px solid #E8E4E0", borderRadius: 10, fontSize: "0.87rem", color: "#2D1B0E", outline: "none", background: "#FAFAF8", boxSizing: "border-box", transition: "border-color 0.2s" }}
                  onFocus={(e) => (e.target.style.borderColor = "#5B4FCF")} onBlur={(e) => (e.target.style.borderColor = "#E8E4E0")} />
              </div>

              {/* Filters + Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {/* Tier filter */}
                {["All", "Gold", "Silver", "Bronze"].map((t) => (
                  <button key={t} id={`filter-tier-${t.toLowerCase()}`} style={filterChip(tierFilter === t, "#5B4FCF")} onClick={() => handleTierFilter(t)}>{t}</button>
                ))}
                {/* Role filter */}
                <span style={{ color: "#C5BDB7", fontSize: "0.8rem" }}>|</span>
                {["All", "admin", "customer"].map((r) => (
                  <button key={r} id={`filter-role-${r}`} style={filterChip(roleFilter === r, "#D4963A")} onClick={() => handleRoleFilter(r)}>{r === "All" ? "Semua Role" : r}</button>
                ))}
                {/* Refresh */}
                <button onClick={fetchCustomers} title="Refresh data" style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #E8E4E0", borderRadius: 10, background: "#FAFAF8", color: "#6B5F52", cursor: "pointer" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#5B4FCF"; e.currentTarget.style.color = "#5B4FCF"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8E4E0"; e.currentTarget.style.color = "#6B5F52"; }}>
                  <FiRefreshCw size={14} />
                </button>
                {/* Tambah */}
                <button id="add-customer-btn" onClick={() => setEditUser(false)}
                  style={{ padding: "8px 18px", background: "#2D1B0E", color: "#FFFFFF", border: "none", borderRadius: 10, fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#5B4FCF")} onMouseLeave={(e) => (e.currentTarget.style.background = "#2D1B0E")}>
                  <FiUserPlus size={15} /> Tambah User
                </button>
              </div>
            </div>

            {/* Loading skeleton */}
            {dbLoading ? (
              <div style={{ padding: "48px", textAlign: "center", color: "#9A8478" }}>
                <div style={{ width: 40, height: 40, border: "3px solid #E8E4E0", borderTopColor: "#5B4FCF", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px auto" }} />
                <p style={{ margin: 0, fontSize: "0.9rem" }}>Memuat data dari Supabase...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <>
                {/* Table */}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={TH_STYLE}>User</th>
                        <th style={TH_STYLE}>Kontak</th>
                        <th style={TH_STYLE}>Bergabung</th>
                        <th style={{ ...TH_STYLE, textAlign: "center" }}>Kunjungan</th>
                        <th style={TH_STYLE}>Total Belanja</th>
                        <th style={{ ...TH_STYLE, textAlign: "center" }}>Poin</th>
                        <th style={TH_STYLE}>Tier</th>
                        <th style={{ ...TH_STYLE, textAlign: "center" }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCustomers.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: "center", padding: "48px 24px", color: "#9A8478", fontSize: "0.9rem" }}>
                            {customers.length === 0 ? "😕 Belum ada user. Klik \"Tambah User\" untuk mulai." : "😕 Tidak ada user yang cocok dengan filter."}
                          </td>
                        </tr>
                      ) : (
                        paginatedCustomers.map((customer, idx) => (
                          <CustomerRow
                            key={customer.id}
                            customer={customer}
                            isEven={idx % 2 === 0}
                            isHighlighted={highlightedId === customer.id}
                            onDetail={() => handleDetail(customer)}
                            onEdit={() => setEditUser(customer)}
                            onDelete={() => setDeleteTarget(customer)}
                          />
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <TableFooter current={safePage} total={totalPages} showing={paginatedCustomers.length} totalItems={filteredCustomers.length} onPage={setCurrentPage} />
              </>
            )}
          </>
        )}

        {/* ━━ TAB: PROGRAM LOYALTY ━━ */}
        {activeTab === "loyalty" && (
          <>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #E8E4E0" }}>
              <p style={{ margin: 0, fontSize: "0.88rem", color: "#9A8478" }}>
                Diurutkan berdasarkan poin tertinggi · {customers.length} user aktif
              </p>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={TH_STYLE}>User</th>
                    <th style={TH_STYLE}>Tier</th>
                    <th style={{ ...TH_STYLE, textAlign: "center" }}>Poin</th>
                    <th style={TH_STYLE}>Progress ke Tier Berikutnya</th>
                    <th style={{ ...TH_STYLE, textAlign: "center" }}>Reward Tersedia</th>
                  </tr>
                </thead>
                <tbody>
                  {loyaltyData.map((customer, idx) => {
                    const rewards = Math.floor(Number(customer.points) / 500);
                    const isEven  = idx % 2 === 0;
                    return (
                      <tr key={customer.id} style={{ background: isEven ? "#FFFFFF" : "#FAFAF8", transition: "background 0.15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#F3F0FF")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = isEven ? "#FFFFFF" : "#FAFAF8")}>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <CustomerAvatar customer={customer} />
                            <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#2D1B0E" }}>{customer.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px" }}><TierBadge tier={customer.tier} /></td>
                        <td style={{ padding: "14px 16px", textAlign: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                            <FiStar size={14} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                            <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "#D97706" }}>{Number(customer.points).toLocaleString("id-ID")}</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <LoyaltyProgressBar points={Number(customer.points)} tier={customer.tier} />
                        </td>
                        <td style={{ padding: "14px 16px", textAlign: "center" }}>
                          {rewards > 0 ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#ECFDF5", color: "#059669", fontWeight: 700, fontSize: "0.85rem", padding: "4px 14px", borderRadius: 20, border: "1.5px solid #A7F3D0" }}>
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
            <div style={{ padding: "16px 24px", borderTop: "1px solid #E8E4E0", fontSize: "0.82rem", color: "#9A8478" }}>
              Menampilkan {loyaltyData.length} dari {customers.length} user
            </div>
          </>
        )}
      </div>

      {/* ── MODALS ── */}
      {selectedCustomer && <CustomerDetailModal customer={selectedCustomer} onClose={() => { setSelectedCustomer(null); setHighlightedId(null); }} />}
      {editUser !== null  && <UserFormModal editUser={editUser || null} onClose={() => setEditUser(null)} onSaved={handleSaved} />}
      {deleteTarget       && <DeleteConfirmModal customer={deleteTarget} onClose={() => setDeleteTarget(null)} onDeleted={handleDeleted} />}

      {/* ── TOAST ── */}
      <ToastProvider>
        {toasts.map((t) => (
          <Toast key={t.id} open={t.open} onOpenChange={(open) => { if (!open) dismiss(t.id); }}
            title={t.title} description={t.description} variant={t.variant} />
        ))}
      </ToastProvider>
    </div>
  );
}
