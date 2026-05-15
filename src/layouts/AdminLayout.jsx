// src/layouts/AdminLayout.jsx
import { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiHome,
  FiShoppingCart,
  FiCoffee,
  FiUsers,
  FiPackage,
  FiUserCheck,
  FiBell,
  FiSearch,
  FiLogOut,
} from "react-icons/fi";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored auth data here if needed
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const menuItems = [
    { icon: FiHome, label: "Dashboard", path: "/admin" },
    { icon: FiShoppingCart, label: "Orders", path: "/admin/orders" },
    { icon: FiCoffee, label: "Menu", path: "/admin/menu" },
    { icon: FiUsers, label: "Customers", path: "/admin/customers" },
    { icon: FiPackage, label: "Inventory", path: "/admin/inventory" },
    { icon: FiUserCheck, label: "Staff", path: "/admin/staff" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div
      id="admin-layout"
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F0EEE9",
      }}
    >
      {/* Sidebar */}
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
            <img
              src="/logo.svg"
              alt="Brewista"
              style={{
                width: 40,
                height: 40,
              }}
            />
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

        {/* Menu Items */}
        <nav style={{ flex: 1, padding: "16px 0", display: "flex", flexDirection: "column" }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: sidebarOpen ? 12 : 0,
                  padding: "12px 16px",
                  margin: "0 8px",
                  borderRadius: 8,
                  textDecoration: "none",
                  color: active ? "#A9744F" : "#6B5F52",
                  background: active ? "rgba(169, 116, 79, 0.1)" : "transparent",
                  transition: "all 0.2s ease",
                  fontSize: "0.95rem",
                  fontWeight: active ? 600 : 500,
                  borderLeft: active ? "3px solid #A9744F" : "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "rgba(169, 116, 79, 0.08)";
                    e.currentTarget.style.color = "#8B5A2B";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#6B5F52";
                  }
                }}
                title={!sidebarOpen ? item.label : ""}
              >
                <Icon size={20} style={{ minWidth: 20 }} />
                {sidebarOpen && item.label}
              </Link>
            );
          })}

          {/* Logout Button */}
          <button
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

      {/* Main Content */}
      <main
        id="admin-content"
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? 220 : 80,
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Header */}
        <header
          style={{
            background: "#FFFFFF",
            borderBottom: "1px solid #DDD4CC",
            padding: "20px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          {/* Search Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            background: "#F0EEE9",
              border: "1px solid #DDD4CC",
              borderRadius: 8,
              padding: "8px 16px",
              width: "100%",
              maxWidth: 400,
            }}
          >
            <FiSearch size={18} color="#9D8B74" />
            <input
              type="text"
              placeholder="Search orders, customers, menu items..."
              style={{
                background: "none",
                border: "none",
                outline: "none",
                flex: 1,
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem",
                color: "#0D0703",
              }}
            />
          </div>

          {/* Right Section */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* Notifications */}
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                position: "relative",
                display: "flex",
                alignItems: "center",
                color: "#6B5F52",
                fontSize: "1.2rem",
              }}
            >
              <FiBell size={20} />
              <span
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  width: 20,
                  height: 20,
                  background: "#A9744F",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                }}
              >
                3
              </span>
            </button>

            {/* User Profile */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: 12, borderLeft: "1px solid #DDD4CC" }}>
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
                }}
              >
                JD
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 600, color: "#0D0703" }}>
                  John Doe
                </p>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#9D8B74" }}>
                  Admin
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: "32px" }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
