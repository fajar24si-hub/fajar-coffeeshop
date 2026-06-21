// src/components/admin/layout/AdminSidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu, FiX, FiHome, FiShoppingCart, FiCoffee,
  FiUsers, FiPackage, FiUserCheck, FiLogOut, FiSettings,
} from "react-icons/fi";
import AdminNavLink from "./AdminNavLink";
import { useAuth } from "../../../context/AuthContext";

const menuItems = [
  { icon: FiHome,         label: "Dashboard",  path: "/admin" },
  { icon: FiShoppingCart, label: "Orders",     path: "/admin/orders" },
  { icon: FiCoffee,       label: "Menu",       path: "/admin/menu" },
  { icon: FiUsers,        label: "Customers",  path: "/admin/customers" },
  { icon: FiPackage,      label: "Inventory",  path: "/admin/inventory" },
  { icon: FiUserCheck,    label: "Staff",      path: "/admin/staff" },
  { icon: FiSettings,     label: "Akun",       path: "/admin/settings" },
];

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside
      id="admin-sidebar"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        width: sidebarOpen ? 220 : 80,
        background: "#FFFFFF",
        borderRight: "1px solid #DDD4CC",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
        zIndex: 100,
        overflowY: "auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #E8E4E0",
        }}
      >
        <Link
          to="/admin"
          style={{
            display: "flex",
            alignItems: "center",
            gap: sidebarOpen ? 12 : 0,
            textDecoration: "none",
            color: "#0D0703",
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.1rem",
            fontWeight: 700,
          }}
        >
          <img src="/logo.svg" alt="Brewista" style={{ width: 40, height: 40 }} />
          {sidebarOpen && "Brewista"}
        </Link>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#0D0703",
            padding: "4px",
            display: "flex",
            alignItems: "center",
          }}
          className="hidden-mobile"
        >
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "16px 0", display: "flex", flexDirection: "column" }}>
        {menuItems.map((item) => (
          <AdminNavLink
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isActive={isActive(item.path)}
            sidebarOpen={sidebarOpen}
          />
        ))}

        {/* Divider */}
        <div style={{ margin: "12px 16px", height: "1px", background: "#E8E4E0" }} />

        {/* Logout */}
        <button
          id="sidebar-logout-btn"
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: sidebarOpen ? 12 : 0,
            padding: "12px 16px",
            margin: "0 8px",
            borderRadius: 8,
            background: "transparent",
            border: "none",
            color: "#6B5F52",
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontSize: "0.95rem",
            fontWeight: 500,
            borderLeft: "3px solid transparent",
            justifyContent: sidebarOpen ? "flex-start" : "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(231, 76, 60, 0.1)";
            e.currentTarget.style.color = "#E74C3C";
            e.currentTarget.style.borderLeftColor = "#E74C3C";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#6B5F52";
            e.currentTarget.style.borderLeftColor = "transparent";
          }}
          title={!sidebarOpen ? "Logout" : ""}
        >
          <FiLogOut size={20} style={{ minWidth: 20 }} />
          {sidebarOpen && "Logout"}
        </button>
      </nav>
    </aside>
  );
}
