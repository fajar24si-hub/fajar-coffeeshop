// src/pages/admin/Menu.jsx
import { useState, useMemo } from "react";
import {
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiStar,
  FiCoffee, FiX, FiTag, FiDollarSign, FiToggleLeft, FiToggleRight,
} from "react-icons/fi";
import AdminPageHeader from "../../components/admin/ui/AdminPageHeader";
import { menuItems as initialMenuItems, categories } from "../../data/menuData";

// ─── Helpers ─────────────────────────────────────────────────────
function formatRupiah(n) {
  return "Rp " + Number(n).toLocaleString("id-ID");
}

function getCategoryColor(cat) {
  switch (cat) {
    case "Hot Coffee":  return { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B" };
    case "Iced Coffee": return { bg: "#EFF6FF", text: "#1E40AF", dot: "#3B82F6" };
    case "Non Coffee":  return { bg: "#ECFDF5", text: "#065F46", dot: "#10B981" };
    default:            return { bg: "#F1F5F9", text: "#334155", dot: "#94A3B8" };
  }
}

function getStatusStyle(active) {
  return active
    ? { bg: "#ECFDF5", text: "#059669", dot: "#10B981", label: "Aktif" }
    : { bg: "#FEF2F2", text: "#DC2626", dot: "#EF4444", label: "Nonaktif" };
}

// ─── Sub Components ──────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, accent, sub }) {
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
      <div style={{ height: 4, background: accent }} />
      <div style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{
            width: 44, height: 44,
            background: `${accent}18`, borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: accent,
          }}>
            <Icon size={22} />
          </div>
        </div>
        <p style={{ margin: "0 0 4px 0", fontSize: "0.82rem", color: "#9A8478", fontWeight: 500 }}>{label}</p>
        <h3 style={{ margin: 0, fontSize: "1.7rem", fontWeight: 700, color: "#2D1B0E", fontFamily: "Georgia, serif" }}>
          {value}
        </h3>
        {sub && <p style={{ margin: "6px 0 0 0", fontSize: "0.78rem", color: "#9A8478" }}>{sub}</p>}
      </div>
    </div>
  );
}

function CategoryBadge({ category }) {
  const s = getCategoryColor(category);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.text,
      padding: "4px 10px", borderRadius: 20,
      fontSize: "0.75rem", fontWeight: 700,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {category}
    </span>
  );
}

function StatusBadge({ active }) {
  const s = getStatusStyle(active);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.text,
      padding: "4px 10px", borderRadius: 20,
      fontSize: "0.75rem", fontWeight: 700,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {s.label}
    </span>
  );
}

// ─── Menu Card (Grid View) ────────────────────────────────────────
function MenuItemCard({ item, onEdit, onDelete, onToggle }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.12)" : "0 2px 10px rgba(0,0,0,0.06)",
        overflow: "hidden",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        opacity: item.active ? 1 : 0.7,
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image / Emoji area */}
      <div style={{
        height: 140,
        background: `linear-gradient(135deg, #2D1B0E22, #D4963A22)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
        fontSize: "4rem",
      }}>
        {item.emoji}
        {/* Badge */}
        <span style={{
          position: "absolute", top: 10, left: 10,
          background: "#2D1B0E", color: "#D4963A",
          fontSize: "0.7rem", fontWeight: 700,
          padding: "3px 10px", borderRadius: 20,
        }}>
          {item.badge}
        </span>
        {/* Status toggle */}
        <button
          id={`toggle-menu-${item.id}`}
          onClick={() => onToggle(item.id)}
          title={item.active ? "Nonaktifkan" : "Aktifkan"}
          style={{
            position: "absolute", top: 10, right: 10,
            background: item.active ? "#ECFDF5" : "#FEF2F2",
            border: "none", borderRadius: 8, padding: "4px 8px",
            cursor: "pointer", color: item.active ? "#059669" : "#DC2626",
            fontSize: "1.1rem", lineHeight: 1,
          }}
        >
          {item.active ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
        </button>
      </div>

      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#2D1B0E", fontFamily: "Georgia, serif" }}>
            {item.name}
          </h3>
          <span style={{ fontWeight: 700, color: "#D4963A", fontSize: "0.95rem", whiteSpace: "nowrap" }}>
            {formatRupiah(item.price)}
          </span>
        </div>

        <div style={{ marginBottom: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
          <CategoryBadge category={item.category} />
          <StatusBadge active={item.active} />
        </div>

        <p style={{ margin: "0 0 10px 0", fontSize: "0.8rem", color: "#6B5F52", lineHeight: 1.5, flex: 1 }}>
          {item.description}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <FiStar size={13} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#D97706" }}>{item.rating}</span>
            <span style={{ fontSize: "0.75rem", color: "#9A8478" }}>({item.reviews})</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              id={`edit-menu-${item.id}`}
              onClick={() => onEdit(item)}
              style={{
                width: 32, height: 32,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1.5px solid #E8E4E0", borderRadius: 8,
                background: "#FFFFFF", color: "#9A8478", cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#5B4FCF"; e.currentTarget.style.color = "#5B4FCF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8E4E0"; e.currentTarget.style.color = "#9A8478"; }}
            >
              <FiEdit2 size={14} />
            </button>
            <button
              id={`delete-menu-${item.id}`}
              onClick={() => onDelete(item.id)}
              style={{
                width: 32, height: 32,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1.5px solid #E8E4E0", borderRadius: 8,
                background: "#FFFFFF", color: "#9A8478", cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#EF4444"; e.currentTarget.style.color = "#EF4444"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8E4E0"; e.currentTarget.style.color = "#9A8478"; }}
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Menu Row (List View) ────────────────────────────────────────
const TH = {
  padding: "12px 16px",
  fontSize: "0.75rem", fontWeight: 600,
  color: "#9A8478", textAlign: "left",
  whiteSpace: "nowrap", textTransform: "uppercase",
  letterSpacing: "0.4px",
  borderBottom: "2px solid #E8E4E0",
  background: "#FAFAF8",
};

function MenuRow({ item, idx, onEdit, onDelete, onToggle }) {
  const [hov, setHov] = useState(false);
  const isEven = idx % 2 === 0;
  const td = { padding: "14px 16px", fontSize: "0.87rem", color: "#2D1B0E" };
  return (
    <tr
      style={{ background: hov ? "#F3F0FF" : isEven ? "#FFFFFF" : "#FAFAF8", transition: "background 0.15s", opacity: item.active ? 1 : 0.7 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <td style={td}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "1.5rem" }}>{item.emoji}</span>
          <div>
            <p style={{ margin: 0, fontWeight: 600 }}>{item.name}</p>
            <p style={{ margin: "2px 0 0", fontSize: "0.72rem", color: "#9A8478" }}>#{String(item.id).padStart(3, "0")}</p>
          </div>
        </div>
      </td>
      <td style={td}><CategoryBadge category={item.category} /></td>
      <td style={{ ...td, fontWeight: 700, color: "#D4963A" }}>{formatRupiah(item.price)}</td>
      <td style={td}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <FiStar size={13} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
          <span style={{ fontWeight: 600 }}>{item.rating}</span>
          <span style={{ color: "#9A8478", fontSize: "0.78rem" }}>({item.reviews})</span>
        </div>
      </td>
      <td style={td}><StatusBadge active={item.active} /></td>
      <td style={{ ...td, textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <button
            id={`toggle-list-${item.id}`}
            onClick={() => onToggle(item.id)}
            style={{
              padding: "5px 12px", border: `1.5px solid ${item.active ? "#EF4444" : "#059669"}`,
              borderRadius: 8, background: "transparent",
              color: item.active ? "#EF4444" : "#059669",
              fontWeight: 600, fontSize: "0.78rem", cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = item.active ? "#FEF2F2" : "#ECFDF5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            {item.active ? "Nonaktifkan" : "Aktifkan"}
          </button>
          <button
            id={`edit-list-${item.id}`}
            onClick={() => onEdit(item)}
            style={{
              width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
              border: "1.5px solid #E8E4E0", borderRadius: 8, background: "#FFFFFF",
              color: "#9A8478", cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#5B4FCF"; e.currentTarget.style.color = "#5B4FCF"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8E4E0"; e.currentTarget.style.color = "#9A8478"; }}
          >
            <FiEdit2 size={14} />
          </button>
          <button
            id={`delete-list-${item.id}`}
            onClick={() => onDelete(item.id)}
            style={{
              width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
              border: "1.5px solid #E8E4E0", borderRadius: 8, background: "#FFFFFF",
              color: "#9A8478", cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#EF4444"; e.currentTarget.style.color = "#EF4444"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8E4E0"; e.currentTarget.style.color = "#9A8478"; }}
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Add/Edit Modal ───────────────────────────────────────────────
const EMOJIS = ["☕", "🥛", "🧊", "🍫", "🍵", "🧋", "🍹", "🥤", "🫖", "🍰", "🥐", "🍩"];
const BADGES = ["Classic", "Best Seller", "Popular", "New", "Healthy", "Refreshing", "Sweet Pick", "Limited", "Seasonal", "Chef's Pick"];
const CATS = ["Hot Coffee", "Iced Coffee", "Non Coffee"];

function MenuFormModal({ item, onClose, onSave }) {
  const isEdit = !!item;
  const [form, setForm] = useState(item ? { ...item } : {
    name: "", category: "Hot Coffee", description: "", price: "",
    emoji: "☕", badge: "New", rating: 4.5, reviews: 0, active: true,
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim() || !form.price) return;
    onSave({ ...form, price: Number(form.price), rating: Number(form.rating), reviews: Number(form.reviews) });
  };

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
        <div style={{ height: 5, background: "linear-gradient(90deg,#D4963A,#2D1B0E)" }} />

        <button
          id="close-menu-modal"
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            background: "#F5F3F0", border: "none", borderRadius: "50%",
            width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#6B5F52",
          }}
        >
          <FiX size={16} />
        </button>

        <div style={{ padding: "24px 28px 28px" }}>
          <h2 style={{ margin: "0 0 20px 0", fontSize: "1.2rem", fontWeight: 700, color: "#2D1B0E", fontFamily: "Georgia, serif" }}>
            {isEdit ? "✏️ Edit Menu" : "➕ Tambah Menu Baru"}
          </h2>

          {/* Emoji picker */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Icon Menu</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {EMOJIS.map(e => (
                <button key={e}
                  onClick={() => set("emoji", e)}
                  style={{
                    width: 40, height: 40, fontSize: "1.3rem",
                    borderRadius: 8, cursor: "pointer",
                    border: form.emoji === e ? "2px solid #D4963A" : "2px solid #E8E4E0",
                    background: form.emoji === e ? "#FEF3C7" : "#FFFFFF",
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <FormField label="Nama Menu *">
            <input id="menu-form-name" value={form.name} onChange={e => set("name", e.target.value)}
              placeholder="Contoh: Vanilla Latte" style={inputStyle} />
          </FormField>

          {/* Category */}
          <FormField label="Kategori">
            <select id="menu-form-category" value={form.category} onChange={e => set("category", e.target.value)} style={inputStyle}>
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>

          {/* Price */}
          <FormField label="Harga (Rp) *">
            <input id="menu-form-price" type="number" value={form.price} onChange={e => set("price", e.target.value)}
              placeholder="35000" style={inputStyle} min={0} />
          </FormField>

          {/* Description */}
          <FormField label="Deskripsi">
            <textarea id="menu-form-desc" value={form.description} onChange={e => set("description", e.target.value)}
              placeholder="Deskripsi singkat menu..." rows={3}
              style={{ ...inputStyle, resize: "vertical" }} />
          </FormField>

          {/* Badge */}
          <FormField label="Badge">
            <select id="menu-form-badge" value={form.badge} onChange={e => set("badge", e.target.value)} style={inputStyle}>
              {BADGES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </FormField>

          {/* Rating & Reviews */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Rating (1-5)">
              <input id="menu-form-rating" type="number" value={form.rating} onChange={e => set("rating", e.target.value)}
                min={1} max={5} step={0.1} style={inputStyle} />
            </FormField>
            <FormField label="Jumlah Review">
              <input id="menu-form-reviews" type="number" value={form.reviews} onChange={e => set("reviews", e.target.value)}
                min={0} style={inputStyle} />
            </FormField>
          </div>

          {/* Active toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <label style={{ ...labelStyle, margin: 0 }}>Status Menu</label>
            <button
              id="menu-form-toggle"
              onClick={() => set("active", !form.active)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 14px", borderRadius: 8, cursor: "pointer",
                border: `1.5px solid ${form.active ? "#059669" : "#DC2626"}`,
                background: form.active ? "#ECFDF5" : "#FEF2F2",
                color: form.active ? "#059669" : "#DC2626",
                fontWeight: 600, fontSize: "0.85rem",
              }}
            >
              {form.active ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
              {form.active ? "Aktif" : "Nonaktif"}
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              id="menu-form-cancel"
              onClick={onClose}
              style={{
                flex: 1, padding: "11px 0",
                border: "1.5px solid #E8E4E0", borderRadius: 10,
                background: "#FFFFFF", color: "#6B5F52",
                fontWeight: 600, fontSize: "0.9rem", cursor: "pointer",
              }}
            >
              Batal
            </button>
            <button
              id="menu-form-save"
              onClick={handleSave}
              style={{
                flex: 2, padding: "11px 0",
                border: "none", borderRadius: 10,
                background: "linear-gradient(135deg,#D4963A,#2D1B0E)",
                color: "#FFFFFF",
                fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
              }}
            >
              {isEdit ? "Simpan Perubahan" : "Tambah Menu"}
            </button>
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

function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

const labelStyle = {
  display: "block", marginBottom: 6,
  fontSize: "0.78rem", fontWeight: 600, color: "#6B5F52",
};

const inputStyle = {
  width: "100%", padding: "9px 12px",
  border: "1.5px solid #E8E4E0", borderRadius: 9,
  fontSize: "0.87rem", color: "#2D1B0E",
  outline: "none", background: "#FAFAF8",
  boxSizing: "border-box", transition: "border-color 0.2s",
  fontFamily: "inherit",
};

// ─── Delete Confirm Modal ─────────────────────────────────────────
function DeleteConfirmModal({ itemName, onConfirm, onCancel }) {
  return (
    <>
      <div onClick={onCancel} style={{
        position: "fixed", inset: 0,
        background: "rgba(45,27,14,0.45)", zIndex: 200,
        backdropFilter: "blur(4px)",
      }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)", zIndex: 201,
        width: "min(400px, 90vw)",
        background: "#FFFFFF", borderRadius: 20,
        boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
        overflow: "hidden",
      }}>
        <div style={{ height: 5, background: "linear-gradient(90deg,#EF4444,#B91C1C)" }} />
        <div style={{ padding: "28px" }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "#FEF2F2", display: "flex",
              alignItems: "center", justifyContent: "center",
              margin: "0 auto 12px", fontSize: "1.5rem",
            }}>
              🗑️
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem", fontWeight: 700, color: "#2D1B0E" }}>
              Hapus Menu?
            </h3>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "#6B5F52" }}>
              Anda akan menghapus <strong>"{itemName}"</strong>. Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button id="delete-cancel" onClick={onCancel}
              style={{
                flex: 1, padding: "10px", border: "1.5px solid #E8E4E0",
                borderRadius: 10, background: "#FFFFFF", color: "#6B5F52",
                fontWeight: 600, cursor: "pointer",
              }}
            >Batal</button>
            <button id="delete-confirm" onClick={onConfirm}
              style={{
                flex: 1, padding: "10px", border: "none",
                borderRadius: 10, background: "#EF4444", color: "#FFFFFF",
                fontWeight: 700, cursor: "pointer",
              }}
            >Ya, Hapus</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Toast Notif (simple inline) ─────────────────────────────────
function InlineToast({ msg, type, onDismiss }) {
  if (!msg) return null;
  const colors = {
    success: { bg: "#ECFDF5", text: "#059669", border: "#A7F3D0" },
    error:   { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA" },
    info:    { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  };
  const c = colors[type] || colors.info;
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 300,
      background: c.bg, color: c.text,
      border: `1.5px solid ${c.border}`,
      borderRadius: 12, padding: "12px 20px",
      fontSize: "0.88rem", fontWeight: 600,
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      animation: "fadeIn 0.3s ease",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      {msg}
      <button onClick={onDismiss} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0, fontSize: "1rem" }}>×</button>
    </div>
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
        background: active ? "#D4963A" : disabled ? "#F5F3F0" : "#FFFFFF",
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
const ROWS_PER_PAGE = 8;

export default function Menu() {
  const [menuData, setMenuData] = useState(() =>
    initialMenuItems.map(item => ({ ...item, active: true }))
  );
  const [view, setView] = useState("grid"); // "grid" | "list"
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Filtered data
  const filtered = useMemo(() => {
    let data = menuData;
    if (catFilter !== "All") data = data.filter(m => m.category === catFilter);
    if (statusFilter === "Aktif") data = data.filter(m => m.active);
    if (statusFilter === "Nonaktif") data = data.filter(m => !m.active);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
      );
    }
    return data;
  }, [menuData, catFilter, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);

  // Stats
  const totalMenu = menuData.length;
  const activeMenu = menuData.filter(m => m.active).length;
  const avgPrice = Math.round(menuData.reduce((s, m) => s + m.price, 0) / menuData.length);
  const topRated = [...menuData].sort((a, b) => b.rating - a.rating)[0];

  const handleSave = (data) => {
    if (editItem) {
      setMenuData(prev => prev.map(m => m.id === data.id ? data : m));
      showToast(`✅ "${data.name}" berhasil diperbarui!`);
    } else {
      const newId = Math.max(...menuData.map(m => m.id)) + 1;
      setMenuData(prev => [...prev, { ...data, id: newId }]);
      showToast(`✅ "${data.name}" berhasil ditambahkan!`);
    }
    setEditItem(null);
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    const item = menuData.find(m => m.id === id);
    setDeleteTarget(item);
  };

  const confirmDelete = () => {
    setMenuData(prev => prev.filter(m => m.id !== deleteTarget.id));
    showToast(`🗑️ "${deleteTarget.name}" telah dihapus.`, "error");
    setDeleteTarget(null);
  };

  const handleToggle = (id) => {
    setMenuData(prev => prev.map(m => {
      if (m.id !== id) return m;
      const next = !m.active;
      showToast(next ? `✅ "${m.name}" diaktifkan.` : `⛔ "${m.name}" dinonaktifkan.`, next ? "success" : "error");
      return { ...m, active: next };
    }));
  };

  const tabBtn = (active) => ({
    padding: "10px 24px", border: "none",
    borderBottom: active ? "3px solid #D4963A" : "3px solid transparent",
    background: "transparent",
    color: active ? "#D4963A" : "#9A8478",
    fontWeight: active ? 700 : 500,
    fontSize: "0.9rem", cursor: "pointer", transition: "all 0.2s",
  });

  const catBtn = (c) => {
    const isActive = catFilter === c;
    return {
      padding: "6px 14px", borderRadius: 20,
      border: isActive ? "2px solid #D4963A" : "2px solid #E8E4E0",
      background: isActive ? "#D4963A" : "#FFFFFF",
      color: isActive ? "#FFFFFF" : "#6B5F52",
      fontWeight: 600, fontSize: "0.82rem",
      cursor: "pointer", transition: "all 0.2s",
    };
  };

  return (
    <div id="menu-management-page">
      <AdminPageHeader
        emoji="☕"
        title="Menu Management"
        subtitle="Kelola daftar menu, harga, dan ketersediaan di Brewista."
      />

      {/* ── STAT CARDS ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 20, marginBottom: 28,
      }}>
        <StatCard icon={FiCoffee} label="Total Menu" value={totalMenu} accent="#D4963A" sub="Item terdaftar" />
        <StatCard icon={FiToggleRight} label="Menu Aktif" value={activeMenu} accent="#10B981" sub={`${totalMenu - activeMenu} nonaktif`} />
        <StatCard icon={FiDollarSign} label="Rata-rata Harga" value={formatRupiah(avgPrice)} accent="#5B4FCF" sub="Semua kategori" />
        <StatCard icon={FiStar} label="Rating Tertinggi" value={topRated?.rating} accent="#F59E0B" sub={topRated?.name} />
      </div>

      {/* ── TOOLBAR ── */}
      <div style={{
        background: "#FFFFFF", borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        overflow: "hidden", marginBottom: 0,
      }}>
        {/* Tab bar */}
        <div style={{
          borderBottom: "2px solid #E8E4E0",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", paddingRight: 20,
        }}>
          <div style={{ display: "flex", paddingLeft: 24 }}>
            {["All", "Hot Coffee", "Iced Coffee", "Non Coffee"].map(c => (
              <button key={c} id={`tab-cat-${c.replace(/\s/g, "-").toLowerCase()}`}
                style={tabBtn(catFilter === c)}
                onClick={() => { setCatFilter(c); setPage(1); }}
              >
                {c}
              </button>
            ))}
          </div>
          <button
            id="add-menu-btn"
            onClick={() => setShowAddModal(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 18px", border: "none", borderRadius: 10,
              background: "linear-gradient(135deg,#D4963A,#2D1B0E)",
              color: "#FFFFFF", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <FiPlus size={16} /> Tambah Menu
          </button>
        </div>

        {/* Search + Filters */}
        <div style={{
          padding: "16px 24px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
          borderBottom: "1px solid #E8E4E0",
        }}>
          {/* Search */}
          <div style={{ position: "relative", minWidth: 240, flex: "1 1 240px", maxWidth: 360 }}>
            <FiSearch size={15} style={{
              position: "absolute", left: 13, top: "50%",
              transform: "translateY(-50%)", color: "#9A8478", pointerEvents: "none",
            }} />
            <input
              id="menu-search"
              type="text"
              placeholder="Cari nama, kategori, deskripsi..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ ...inputStyle, paddingLeft: 38 }}
              onFocus={(e) => { e.target.style.borderColor = "#D4963A"; }}
              onBlur={(e) => { e.target.style.borderColor = "#E8E4E0"; }}
            />
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {/* Status filter */}
            {["All", "Aktif", "Nonaktif"].map(s => (
              <button key={s}
                id={`filter-status-${s.toLowerCase()}`}
                style={catBtn(statusFilter === s)}
                onClick={() => { setStatusFilter(s); setPage(1); }}
              >
                {s}
              </button>
            ))}

            {/* View toggle */}
            <div style={{ display: "flex", border: "1.5px solid #E8E4E0", borderRadius: 8, overflow: "hidden", marginLeft: 8 }}>
              <button
                id="view-grid"
                onClick={() => setView("grid")}
                style={{
                  padding: "6px 12px", border: "none", cursor: "pointer",
                  background: view === "grid" ? "#2D1B0E" : "#FFFFFF",
                  color: view === "grid" ? "#FFFFFF" : "#6B5F52",
                  fontSize: "0.75rem", fontWeight: 600, transition: "all 0.2s",
                }}
              >⊞ Grid</button>
              <button
                id="view-list"
                onClick={() => setView("list")}
                style={{
                  padding: "6px 12px", border: "none", cursor: "pointer",
                  background: view === "list" ? "#2D1B0E" : "#FFFFFF",
                  color: view === "list" ? "#FFFFFF" : "#6B5F52",
                  fontSize: "0.75rem", fontWeight: 600, transition: "all 0.2s",
                }}
              >☰ List</button>
            </div>
          </div>
        </div>

        {/* Results info */}
        <div style={{ padding: "10px 24px 0", fontSize: "0.82rem", color: "#9A8478" }}>
          Menampilkan <strong style={{ color: "#2D1B0E" }}>{filtered.length}</strong> menu
          {catFilter !== "All" && <> · Kategori: <strong style={{ color: "#D4963A" }}>{catFilter}</strong></>}
          {statusFilter !== "All" && <> · Status: <strong style={{ color: "#D4963A" }}>{statusFilter}</strong></>}
        </div>

        {/* ── GRID VIEW ── */}
        {view === "grid" && (
          <div style={{
            padding: "16px 24px 24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
          }}>
            {paginated.length === 0 ? (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px 24px", color: "#9A8478" }}>
                😕 Tidak ada menu yang ditemukan.
              </div>
            ) : paginated.map(item => (
              <MenuItemCard
                key={item.id}
                item={item}
                onEdit={(it) => setEditItem(it)}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}

        {/* ── LIST VIEW ── */}
        {view === "list" && (
          <div style={{ overflowX: "auto", marginTop: 8 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={TH}>Menu</th>
                  <th style={TH}>Kategori</th>
                  <th style={TH}>Harga</th>
                  <th style={TH}>Rating</th>
                  <th style={TH}>Status</th>
                  <th style={{ ...TH, textAlign: "center" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "48px 24px", color: "#9A8478" }}>
                      😕 Tidak ada menu yang ditemukan.
                    </td>
                  </tr>
                ) : paginated.map((item, idx) => (
                  <MenuRow
                    key={item.id}
                    item={item}
                    idx={idx}
                    onEdit={(it) => setEditItem(it)}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── PAGINATION ── */}
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
          <div style={{ display: "flex", gap: 6 }}>
            <PaginationBtn id="menu-prev" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>‹</PaginationBtn>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = Math.max(1, Math.min(safePage - 2, totalPages - 4)) + i;
              return (
                <PaginationBtn key={p} id={`menu-page-${p}`} onClick={() => setPage(p)} active={p === safePage}>
                  {p}
                </PaginationBtn>
              );
            })}
            <PaginationBtn id="menu-next" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>›</PaginationBtn>
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      {(showAddModal || editItem) && (
        <MenuFormModal
          item={editItem}
          onClose={() => { setShowAddModal(false); setEditItem(null); }}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          itemName={deleteTarget.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* ── TOAST ── */}
      {toast && <InlineToast msg={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />}
    </div>
  );
}
