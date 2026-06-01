// src/components/ui/StatCard.jsx

const defaultStats = [
  { v: "15K+", l: "Happy Customers" },
  { v: "30+",  l: "Coffee Variants" },
  { v: "4.9★", l: "Average Rating" },
];

export default function StatCard({ stats = defaultStats }) {
  return (
    <div
      className="animate-fade-up glass-card"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
        borderRadius: 16,
        overflow: "hidden",
        width: "100%",
        maxWidth: 420,
        animationDelay: "0.4s",
      }}
    >
      {stats.map(({ v, l }, i) => (
        <div
          key={l}
          style={{
            padding: "18px 12px",
            textAlign: "center",
            borderLeft: i > 0 ? "1px solid rgba(212,150,58,0.1)" : "none",
          }}
        >
          <div
            className="gradient-text"
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "1.5rem",
              fontWeight: 700,
            }}
          >
            {v}
          </div>
          <div style={{ color: "#7A6247", fontSize: 11, marginTop: 4, fontWeight: 500 }}>
            {l}
          </div>
        </div>
      ))}
    </div>
  );
}
