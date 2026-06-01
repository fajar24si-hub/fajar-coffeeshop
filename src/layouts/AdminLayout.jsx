// src/layouts/AdminLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/layout/AdminSidebar";
import AdminHeader from "../components/admin/layout/AdminHeader";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      id="admin-layout"
      style={{ display: "flex", minHeight: "100vh", background: "#F0EEE9" }}
    >
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main
        id="admin-content"
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? 220 : 80,
          transition: "margin-left 0.3s ease",
        }}
      >
        <AdminHeader />

        <div style={{ padding: "32px" }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
