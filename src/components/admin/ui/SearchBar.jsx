// src/components/admin/ui/SearchBar.jsx
import { FiSearch } from "react-icons/fi";

export default function SearchBar({ placeholder = "Search...", value, onChange }) {
  return (
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
        placeholder={placeholder}
        value={value}
        onChange={onChange}
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
  );
}
