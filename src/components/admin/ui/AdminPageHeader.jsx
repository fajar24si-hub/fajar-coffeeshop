// src/components/admin/ui/AdminPageHeader.jsx

export default function AdminPageHeader({ emoji, title, subtitle }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h1
        style={{
          margin: "0 0 8px 0",
          fontSize: "1.8rem",
          fontWeight: 700,
          color: "#0D0703",
        }}
      >
        {emoji && `${emoji} `}{title}
      </h1>
      {subtitle && (
        <p style={{ margin: 0, fontSize: "1rem", color: "#9D8B74" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
