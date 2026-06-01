// src/components/admin/layout/AdminHeader.jsx
import SearchBar        from "../ui/SearchBar";
import NotificationBell from "../ui/NotificationBell";
import UserAvatar       from "../ui/UserAvatar";

export default function AdminHeader() {
  return (
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
      <SearchBar placeholder="Search orders, customers, menu items..." />

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <NotificationBell count={3} />

        <div style={{ paddingLeft: 12, borderLeft: "1px solid #DDD4CC" }}>
          {/* UserAvatar membaca nama secara otomatis dari localStorage */}
          <UserAvatar role="Admin" />
        </div>
      </div>
    </header>
  );
}
