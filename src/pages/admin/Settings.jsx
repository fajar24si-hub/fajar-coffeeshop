// src/pages/admin/Settings.jsx
import { useState, useEffect, useCallback } from "react";
import {
  FiUsers, FiUser, FiMail, FiPhone, FiShield,
  FiEdit2, FiTrash2, FiUserPlus, FiSearch, FiRefreshCw,
  FiAlertCircle, FiCheckCircle, FiX, FiLock, FiUnlock,
  FiKey, FiChevronDown,
} from "react-icons/fi";
import AdminPageHeader from "../../components/admin/ui/AdminPageHeader";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";

// ─── Helpers ──────────────────────────────────────────────────
function getInitials(name = "") {
  const p = name.trim().split(/\s+/);
  if (p.length >= 2) return (p[0][0] + p[1][0]).toUpperCase();
  return (p[0] || "?").slice(0, 2).toUpperCase();
}

function getAvatarColor(id = "") {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  const palettes = [
    ["#5B4FCF","#fff"], ["#D4963A","#fff"], ["#27AE60","#fff"],
    ["#E74C3C","#fff"], ["#8E44AD","#fff"], ["#2980B9","#fff"],
    ["#16A085","#fff"],
  ];
  return palettes[Math.abs(hash) % palettes.length];
}

const ROLE_STYLE = {
  admin:    { bg: "#EDE9FF", color: "#5B4FCF", dot: "#5B4FCF" },
  customer: { bg: "#F0FDF4", color: "#16A34A", dot: "#22C55E" },
};

// ─── Toast helper ─────────────────────────────────────────────
function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, [onDone]);
  const isOk = type === "success";
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      display: "flex", alignItems: "center", gap: 12,
      background: isOk ? "#F0FDF4" : "#FEF2F2",
      border: `1px solid ${isOk ? "#86EFAC" : "#FECACA"}`,
      color: isOk ? "#16A34A" : "#DC2626",
      borderRadius: 12, padding: "14px 20px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      animation: "slideIn 0.3s ease",
      fontSize: "0.9rem", fontWeight: 600, maxWidth: 360,
    }}>
      {isOk ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
      <span>{msg}</span>
      <button onClick={onDone} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "inherit", display: "flex" }}>
        <FiX size={16} />
      </button>
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(40px) } to { opacity:1; transform:translateX(0) } }`}</style>
    </div>
  );
}

// ─── Edit Role Modal ───────────────────────────────────────────
function EditRoleModal({ user, onClose, onSaved }) {
  const [role, setRole]       = useState(user.role || "customer");
  const [tier, setTier]       = useState(user.tier || "Bronze");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase.from("users").update({ role, tier }).eq("id", user.id);
    setLoading(false);
    if (error) { alert("Gagal update: " + error.message); return; }
    onSaved({ ...user, role, tier });
  };

  const selectSt = {
    width: "100%", padding: "10px 12px", border: "1.5px solid #E8E4E0",
    borderRadius: 8, fontSize: "0.88rem", color: "#2D1B0E", background: "#FAFAF8",
    fontFamily: "'Inter', sans-serif", outline: "none", cursor: "pointer",
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, backdropFilter: "blur(4px)" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 201, width: "min(400px,90vw)", background: "#fff", borderRadius: 16, boxShadow: "0 20px 50px rgba(0,0,0,0.18)", overflow: "hidden" }}>
        <div style={{ height: 4, background: "linear-gradient(90deg,#5B4FCF,#8B7CF8)" }} />
        <div style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#2D1B0E" }}>✏️ Edit Role & Tier</h3>
            <button onClick={onClose} style={{ background: "#F5F3F0", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><FiX size={14} /></button>
          </div>

          {/* User info */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", background: "#FAFAF8", borderRadius: 10, marginBottom: 20, border: "1px solid #E8E4E0" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: getAvatarColor(user.id)[0], color: getAvatarColor(user.id)[1], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.9rem" }}>
              {getInitials(user.name)}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: "#2D1B0E", fontSize: "0.9rem" }}>{user.name}</p>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#9A8478" }}>{user.email}</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#6B5F52", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Role Akun</label>
              <select style={selectSt} value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="customer">👤 Customer</option>
                <option value="admin">👑 Admin</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#6B5F52", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Tier Loyalty</label>
              <select style={selectSt} value={tier} onChange={(e) => setTier(e.target.value)}>
                <option value="Bronze">🥉 Bronze</option>
                <option value="Silver">🥈 Silver</option>
                <option value="Gold">🥇 Gold</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button onClick={onClose} style={{ flex: 1, padding: "10px", border: "1.5px solid #E8E4E0", borderRadius: 10, background: "#fff", color: "#6B5F52", fontWeight: 600, cursor: "pointer" }}>Batal</button>
              <button onClick={handleSave} disabled={loading} style={{ flex: 2, padding: "10px", border: "none", borderRadius: 10, background: loading ? "#9A8478" : "linear-gradient(135deg,#5B4FCF,#8B7CF8)", color: "#fff", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Delete Confirm Modal ──────────────────────────────────────
function DeleteModal({ user, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const { error } = await supabase.from("users").delete().eq("id", user.id);
    setLoading(false);
    if (error) { alert("Gagal hapus: " + error.message); return; }
    onDeleted(user.id);
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 300, backdropFilter: "blur(4px)" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 301, width: "min(400px,90vw)", background: "#fff", borderRadius: 16, padding: "28px", boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <FiTrash2 size={24} color="#DC2626" />
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem", fontWeight: 700, color: "#2D1B0E" }}>Hapus Akun?</h3>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "#6B5F52" }}>
            Akun <strong>{user.name}</strong> ({user.email}) akan dihapus dari database.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", border: "1.5px solid #E8E4E0", borderRadius: 10, background: "#fff", color: "#6B5F52", fontWeight: 600, cursor: "pointer" }}>Batal</button>
          <button onClick={handleDelete} disabled={loading} style={{ flex: 1, padding: "10px", border: "none", borderRadius: 10, background: loading ? "#9A8478" : "#DC2626", color: "#fff", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Add User Modal ────────────────────────────────────────────
function AddUserModal({ onClose, onAdded }) {
  const [form, setForm]       = useState({ name: "", email: "", phone: "", password: "", role: "customer", tier: "Bronze" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const inputSt = {
    width: "100%", padding: "10px 12px", border: "1.5px solid #E8E4E0", borderRadius: 8,
    fontSize: "0.88rem", color: "#2D1B0E", background: "#FAFAF8", boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif", outline: "none",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password minimal 6 karakter."); return; }
    setLoading(true);
    try {
      const { data, error: authErr } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { name: form.name } },
      });
      if (authErr) throw authErr;
      if (data.user) {
        const { error: profErr } = await supabase.from("users").insert({
          id: data.user.id, name: form.name, email: form.email,
          phone: form.phone, role: form.role, tier: form.tier,
          points: 0, visits: 0, spent: 0,
          joined: new Date().toISOString().split("T")[0],
        });
        if (profErr) throw profErr;
        onAdded();
      }
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("already registered")) setError("Email sudah terdaftar.");
      else setError(msg || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, backdropFilter: "blur(4px)" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 201, width: "min(480px,95vw)", background: "#fff", borderRadius: 16, boxShadow: "0 24px 60px rgba(0,0,0,0.18)", overflow: "hidden" }}>
        <div style={{ height: 4, background: "linear-gradient(90deg,#27AE60,#2ECC71)" }} />
        <div style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#2D1B0E" }}>➕ Tambah Akun User</h3>
            <button onClick={onClose} style={{ background: "#F5F3F0", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><FiX size={14} /></button>
          </div>

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, marginBottom: 16, color: "#DC2626", fontSize: "0.85rem" }}>
              <FiAlertCircle size={16} /><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#6B5F52", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Nama *</label>
                <input required style={inputSt} placeholder="Nama lengkap" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onFocus={(e) => (e.target.style.borderColor = "#5B4FCF")} onBlur={(e) => (e.target.style.borderColor = "#E8E4E0")} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#6B5F52", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>No. HP</label>
                <input style={inputSt} placeholder="08xx-xxxx-xxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  onFocus={(e) => (e.target.style.borderColor = "#5B4FCF")} onBlur={(e) => (e.target.style.borderColor = "#E8E4E0")} />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#6B5F52", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Email *</label>
              <input required type="email" style={inputSt} placeholder="email@domain.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                onFocus={(e) => (e.target.style.borderColor = "#5B4FCF")} onBlur={(e) => (e.target.style.borderColor = "#E8E4E0")} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#6B5F52", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Password *</label>
              <input required type="password" style={inputSt} placeholder="Min. 6 karakter" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                onFocus={(e) => (e.target.style.borderColor = "#5B4FCF")} onBlur={(e) => (e.target.style.borderColor = "#E8E4E0")} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#6B5F52", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Role</label>
                <select style={inputSt} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#6B5F52", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Tier</label>
                <select style={inputSt} value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button type="button" onClick={onClose} style={{ flex: 1, padding: "11px", border: "1.5px solid #E8E4E0", borderRadius: 10, background: "#fff", color: "#6B5F52", fontWeight: 600, cursor: "pointer" }}>Batal</button>
              <button type="submit" disabled={loading} style={{ flex: 2, padding: "11px", border: "none", borderRadius: 10, background: loading ? "#9A8478" : "linear-gradient(135deg,#27AE60,#2ECC71)", color: "#fff", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Membuat akun..." : "Buat Akun"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ─── Account Row ───────────────────────────────────────────────
function AccountRow({ user, isEven, currentUserId, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [avatarBg, avatarColor] = getAvatarColor(user.id);
  const rs    = ROLE_STYLE[user.role] || ROLE_STYLE.customer;
  const isSelf = user.id === currentUserId;

  return (
    <tr style={{ background: hovered ? "#F8F7FF" : isEven ? "#FFFFFF" : "#FAFAF8", transition: "background 0.15s" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>

      {/* User */}
      <td style={{ padding: "14px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: avatarBg, color: avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>
            {getInitials(user.name)}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontWeight: 600, color: "#2D1B0E", fontSize: "0.9rem" }}>{user.name}</span>
              {isSelf && (
                <span style={{ fontSize: "0.68rem", background: "#EDE9FF", color: "#5B4FCF", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>Anda</span>
              )}
            </div>
            <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "#9A8478" }}>{user.email}</p>
          </div>
        </div>
      </td>

      {/* No. HP */}
      <td style={{ padding: "14px 18px", fontSize: "0.87rem", color: "#6B5F52" }}>{user.phone || "—"}</td>

      {/* Role badge */}
      <td style={{ padding: "14px 18px" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: rs.bg, color: rs.color, padding: "4px 12px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 700 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: rs.dot, display: "inline-block" }} />
          {user.role === "admin" ? "👑 Admin" : "👤 Customer"}
        </span>
      </td>

      {/* Tier */}
      <td style={{ padding: "14px 18px", fontSize: "0.87rem", color: "#6B5F52" }}>
        {user.tier === "Gold" ? "🥇 Gold" : user.tier === "Silver" ? "🥈 Silver" : "🥉 Bronze"}
      </td>

      {/* Bergabung */}
      <td style={{ padding: "14px 18px", fontSize: "0.85rem", color: "#9A8478" }}>
        {user.joined ? new Date(user.joined).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
      </td>

      {/* Aksi */}
      <td style={{ padding: "14px 18px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <button id={`edit-role-${user.id}`} onClick={() => onEdit(user)} title="Edit Role & Tier"
            style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #E8E4E0", borderRadius: 8, background: "#fff", color: "#9A8478", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#5B4FCF"; e.currentTarget.style.color = "#5B4FCF"; e.currentTarget.style.background = "#EDE9FF"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8E4E0"; e.currentTarget.style.color = "#9A8478"; e.currentTarget.style.background = "#fff"; }}>
            <FiShield size={14} />
          </button>
          <button id={`edit-user-${user.id}`} onClick={() => onEdit(user)} title="Edit User"
            style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #E8E4E0", borderRadius: 8, background: "#fff", color: "#9A8478", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D4963A"; e.currentTarget.style.color = "#D4963A"; e.currentTarget.style.background = "#FEF3E2"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8E4E0"; e.currentTarget.style.color = "#9A8478"; e.currentTarget.style.background = "#fff"; }}>
            <FiEdit2 size={14} />
          </button>
          <button id={`delete-user-${user.id}`} onClick={() => !isSelf && onDelete(user)} title={isSelf ? "Tidak bisa hapus akun sendiri" : "Hapus Akun"}
            disabled={isSelf}
            style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #E8E4E0", borderRadius: 8, background: "#fff", color: isSelf ? "#D9CCC0" : "#9A8478", cursor: isSelf ? "not-allowed" : "pointer", transition: "all 0.2s", opacity: isSelf ? 0.5 : 1 }}
            onMouseEnter={(e) => { if (!isSelf) { e.currentTarget.style.borderColor = "#DC2626"; e.currentTarget.style.color = "#DC2626"; e.currentTarget.style.background = "#FEF2F2"; }}}
            onMouseLeave={(e) => { if (!isSelf) { e.currentTarget.style.borderColor = "#E8E4E0"; e.currentTarget.style.color = "#9A8478"; e.currentTarget.style.background = "#fff"; }}}>
            <FiTrash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────
export default function Settings() {
  const { user: currentUser }       = useAuth();
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showAdd, setShowAdd]       = useState(false);
  const [toast, setToast]           = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setUsers(data || []);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Filtered
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    const matchRole   = roleFilter === "All" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  // Stats
  const totalAdmins    = users.filter((u) => u.role === "admin").length;
  const totalCustomers = users.filter((u) => u.role === "customer").length;

  const TH = {
    padding: "12px 18px", fontSize: "0.73rem", fontWeight: 600, color: "#9A8478",
    textAlign: "left", textTransform: "uppercase", letterSpacing: "0.4px",
    borderBottom: "2px solid #E8E4E0", background: "#FAFAF8", whiteSpace: "nowrap",
  };

  const chipSt = (active, c = "#5B4FCF") => ({
    padding: "6px 16px", borderRadius: 20,
    border: active ? `2px solid ${c}` : "2px solid #E8E4E0",
    background: active ? c : "#fff",
    color: active ? "#fff" : "#6B5F52",
    fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", transition: "all 0.2s",
  });

  return (
    <div id="settings-page">
      <AdminPageHeader emoji="⚙️" title="Manajemen Akun" subtitle="Kelola akun user, role, dan hak akses sistem." />

      {/* ── STAT CARDS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 28 }}>
        {[
          { icon: FiUsers, label: "Total Akun", value: users.length, color: "#5B4FCF", sub: "Semua user terdaftar" },
          { icon: FiShield, label: "Admin", value: totalAdmins, color: "#D4963A", sub: "Memiliki hak akses penuh" },
          { icon: FiUser, label: "Customer", value: totalCustomers, color: "#27AE60", sub: "Akun pelanggan biasa" },
        ].map(({ icon: Icon, label, value, color, sub }) => (
          <div key={label} style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden", transition: "all 0.3s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}>
            <div style={{ height: 4, background: color }} />
            <div style={{ padding: "20px 24px" }}>
              <div style={{ width: 44, height: 44, background: `${color}18`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color, marginBottom: 16 }}>
                <Icon size={22} />
              </div>
              <p style={{ margin: "0 0 4px", fontSize: "0.82rem", color: "#9A8478", fontWeight: 500 }}>{label}</p>
              <h3 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 700, color: "#2D1B0E", fontFamily: "Georgia, serif" }}>{value}</h3>
              <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#9A8478" }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── CURRENT LOGGED-IN USER INFO ── */}
      {currentUser && (
        <div style={{ background: "linear-gradient(135deg, #EDE9FF, #F3F0FF)", border: "1px solid #C4B8F8", borderRadius: 16, padding: "20px 24px", marginBottom: 28, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#5B4FCF,#8B7CF8)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.1rem", flexShrink: 0 }}>
            {getInitials(currentUser.name)}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: "0 0 4px", fontWeight: 700, color: "#2D1B0E", fontSize: "0.95rem" }}>
              👋 Anda login sebagai: <span style={{ color: "#5B4FCF" }}>{currentUser.name}</span>
            </p>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "#6B5F52" }}>
              📧 {currentUser.email} &nbsp;·&nbsp; 👑 Role: <strong>{currentUser.role}</strong> &nbsp;·&nbsp; 🏆 Tier: {currentUser.tier}
            </p>
          </div>
          <span style={{ background: "#5B4FCF", color: "#fff", padding: "4px 14px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 700 }}>
            {currentUser.role?.toUpperCase()}
          </span>
        </div>
      )}

      {/* ── MAIN TABLE CARD ── */}
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, borderBottom: "1px solid #E8E4E0" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 260px", maxWidth: 360 }}>
            <FiSearch size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9A8478", pointerEvents: "none" }} />
            <input id="account-search" type="text" placeholder="Cari nama atau email..." value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", paddingLeft: 38, paddingRight: 14, paddingTop: 9, paddingBottom: 9, border: "1.5px solid #E8E4E0", borderRadius: 10, fontSize: "0.87rem", color: "#2D1B0E", outline: "none", background: "#FAFAF8", boxSizing: "border-box" }}
              onFocus={(e) => (e.target.style.borderColor = "#5B4FCF")} onBlur={(e) => (e.target.style.borderColor = "#E8E4E0")} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {["All", "admin", "customer"].map((r) => (
              <button key={r} style={chipSt(roleFilter === r)} onClick={() => setRoleFilter(r)}>
                {r === "All" ? "Semua" : r === "admin" ? "👑 Admin" : "👤 Customer"}
              </button>
            ))}
            <button onClick={fetchUsers} title="Refresh" style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #E8E4E0", borderRadius: 10, background: "#FAFAF8", color: "#6B5F52", cursor: "pointer" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#5B4FCF"; e.currentTarget.style.color = "#5B4FCF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8E4E0"; e.currentTarget.style.color = "#6B5F52"; }}>
              <FiRefreshCw size={14} />
            </button>
            <button id="add-user-btn" onClick={() => setShowAdd(true)}
              style={{ padding: "8px 18px", background: "#2D1B0E", color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#5B4FCF")} onMouseLeave={(e) => (e.currentTarget.style.background = "#2D1B0E")}>
              <FiUserPlus size={15} /> Tambah Akun
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 24px", background: "#FEF2F2", borderBottom: "1px solid #FECACA", color: "#DC2626", fontSize: "0.87rem" }}>
            <FiAlertCircle size={16} />
            <span>{error}</span>
            <button onClick={fetchUsers} style={{ marginLeft: "auto", padding: "4px 12px", border: "1px solid #DC2626", borderRadius: 6, background: "transparent", color: "#DC2626", cursor: "pointer", fontSize: "0.78rem" }}>Retry</button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "48px", color: "#9A8478" }}>
            <div style={{ width: 36, height: 36, border: "3px solid #E8E4E0", borderTopColor: "#5B4FCF", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 14px" }} />
            <p style={{ margin: 0 }}>Memuat data akun...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={TH}>User</th>
                    <th style={TH}>No. HP</th>
                    <th style={TH}>Role</th>
                    <th style={TH}>Tier</th>
                    <th style={TH}>Bergabung</th>
                    <th style={{ ...TH, textAlign: "center" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "48px", color: "#9A8478", fontSize: "0.9rem" }}>
                        {users.length === 0 ? "😕 Belum ada akun. Klik \"Tambah Akun\" untuk mulai." : "Tidak ada akun yang cocok."}
                      </td>
                    </tr>
                  ) : filtered.map((u, i) => (
                    <AccountRow key={u.id} user={u} isEven={i % 2 === 0} currentUserId={currentUser?.id}
                      onEdit={(u) => setEditTarget(u)}
                      onDelete={(u) => setDeleteTarget(u)} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div style={{ padding: "14px 24px", borderTop: "1px solid #E8E4E0", fontSize: "0.82rem", color: "#9A8478" }}>
              Menampilkan <strong style={{ color: "#2D1B0E" }}>{filtered.length}</strong> dari <strong style={{ color: "#2D1B0E" }}>{users.length}</strong> akun
            </div>
          </>
        )}
      </div>

      {/* ── MODALS ── */}
      {editTarget && (
        <EditRoleModal user={editTarget} onClose={() => setEditTarget(null)}
          onSaved={(updated) => {
            setUsers((prev) => prev.map((u) => u.id === updated.id ? updated : u));
            setEditTarget(null);
            showToast(`Role ${updated.name} berhasil diperbarui ✓`);
          }} />
      )}
      {deleteTarget && (
        <DeleteModal user={deleteTarget} onClose={() => setDeleteTarget(null)}
          onDeleted={(id) => {
            setUsers((prev) => prev.filter((u) => u.id !== id));
            setDeleteTarget(null);
            showToast("Akun berhasil dihapus", "success");
          }} />
      )}
      {showAdd && (
        <AddUserModal onClose={() => setShowAdd(false)}
          onAdded={() => { setShowAdd(false); fetchUsers(); showToast("Akun baru berhasil dibuat ✓"); }} />
      )}

      {/* ── TOAST ── */}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
