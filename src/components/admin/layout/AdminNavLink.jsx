// src/components/admin/layout/AdminNavLink.jsx
import { Link } from "react-router-dom";

export default function AdminNavLink({ icon: Icon, label, path, isActive, sidebarOpen }) {
  return (
    <Link
      to={path}
      style={{
        display: "flex",
        alignItems: "center",
        gap: sidebarOpen ? 12 : 0,
        padding: "12px 16px",
        margin: "0 8px",
        borderRadius: 8,
        textDecoration: "none",
        color: isActive ? "#A9744F" : "#6B5F52",
        background: isActive ? "rgba(169, 116, 79, 0.1)" : "transparent",
        transition: "all 0.2s ease",
        fontSize: "0.95rem",
        fontWeight: isActive ? 600 : 500,
        borderLeft: isActive ? "3px solid #A9744F" : "3px solid transparent",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "rgba(169, 116, 79, 0.08)";
          e.currentTarget.style.color = "#8B5A2B";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#6B5F52";
        }
      }}
      title={!sidebarOpen ? label : ""}
    >
      <Icon size={20} style={{ minWidth: 20 }} />
      {sidebarOpen && label}
    </Link>
  );
}
