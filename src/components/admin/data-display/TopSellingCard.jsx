// src/components/admin/data-display/TopSellingCard.jsx
import AdminCard from "../ui/AdminCard";

const defaultItems = [
  { name: "Iced Latte",  sold: 32, color: "#D4963A" },
  { name: "Espresso",    sold: 28, color: "#E5A84B" },
  { name: "Cappuccino",  sold: 24, color: "#CEAD86" },
];

export default function TopSellingCard({ items = defaultItems }) {
  const max = Math.max(...items.map((i) => i.sold));

  return (
    <AdminCard>
      <h3 style={{ margin: "0 0 20px 0", fontSize: "1rem", fontWeight: 600, color: "#0D0703" }}>
        📊 Top-Selling Items
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item) => (
          <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 4px 0", fontSize: "0.9rem", fontWeight: 500, color: "#0D0703" }}>
                {item.name}
              </p>
              <div
                style={{
                  background: "#E8E4E0",
                  borderRadius: 4,
                  height: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: item.color,
                    height: "100%",
                    width: `${(item.sold / max) * 100}%`,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#6B5F52", minWidth: 50 }}>
              {item.sold} sold
            </span>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}
