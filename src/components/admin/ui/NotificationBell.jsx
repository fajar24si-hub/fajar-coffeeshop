// src/components/admin/ui/NotificationBell.jsx
import { FiBell } from "react-icons/fi";

export default function NotificationBell({ count = 0, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        position: "relative",
        display: "flex",
        alignItems: "center",
        color: "#6B5F52",
        fontSize: "1.2rem",
        padding: 0,
      }}
    >
      <FiBell size={20} />
      {count > 0 && (
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
          {count}
        </span>
      )}
    </button>
  );
}
