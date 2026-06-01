// src/components/admin/ui/AdminCard.jsx

export default function AdminCard({ children, style = {}, hover = false }) {
  const base = {
    background: "#FFFFFF",
    border: "1px solid #E8E4E0",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    ...style,
  };

  const hoverHandlers = hover
    ? {
        onMouseEnter: (e) => {
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
          e.currentTarget.style.transform = "translateY(-2px)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
          e.currentTarget.style.transform = "translateY(0)";
        },
      }
    : {};

  return (
    <div
      style={{ ...base, transition: hover ? "all 0.3s ease" : undefined }}
      {...hoverHandlers}
    >
      {children}
    </div>
  );
}
