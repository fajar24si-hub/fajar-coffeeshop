// src/components/admin/ui/UserAvatar.jsx

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

export default function UserAvatar({ name, role = "Admin" }) {
  // Baca dari localStorage jika name tidak di-pass sebagai prop
  const displayName = name ?? localStorage.getItem("userName") ?? "Admin";
  const initials    = getInitials(displayName);

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
          {role}
        </p>
      </div>
    </div>
  );
}
