// src/components/admin/ui/UserAvatar.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

/**
 * Membuat inisial dari nama lengkap.
 * "Fajar Ramadhan" → "FR", "Fajar" → "FA"
 */
function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
  return parts[0][0]?.toUpperCase() ?? "?";
}

export default function UserAvatar({ name: nameProp, role: roleProp }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Gunakan data dari AuthContext, fallback ke prop atau localStorage
  const displayName = nameProp ?? user?.name ?? localStorage.getItem("userName") ?? "Admin";
  const displayRole = roleProp ?? (user?.role === "admin" ? "Admin" : "Customer");
  const initials    = getInitials(displayName);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 36,
          height: 36,
          background: "linear-gradient(135deg, #A9744F 0%, #C49060 100%)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          fontWeight: 700,
          fontSize: "0.9rem",
          flexShrink: 0,
        }}
      >
        {initials}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 600, color: "#0D0703" }}>
          {displayName}
        </p>
        <p style={{ margin: 0, fontSize: "0.75rem", color: "#9D8B74" }}>
          {displayRole}
        </p>
      </div>
      {/* Tombol Logout */}
      <button
        onClick={handleLogout}
        title="Logout"
        style={{
          marginLeft: 4,
          background: "none",
          border: "1px solid #E4D5C3",
          borderRadius: 6,
          padding: "4px 10px",
          fontSize: "0.75rem",
          color: "#9D8B74",
          cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#FEF3E2";
          e.currentTarget.style.borderColor = "#D4963A";
          e.currentTarget.style.color = "#D4963A";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "none";
          e.currentTarget.style.borderColor = "#E4D5C3";
          e.currentTarget.style.color = "#9D8B74";
        }}
      >
        Logout
      </button>
    </div>
  );
}
