// src/components/ui/CategoryFilter.jsx

export default function CategoryFilter({ categories, active, onSelect }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
        marginBottom: 40,
      }}
    >
      {categories.map((cat) => (
        <button
          key={cat}
          id={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
          onClick={() => onSelect(cat)}
          className={`cat-pill${active === cat ? " active shimmer-btn" : ""}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
