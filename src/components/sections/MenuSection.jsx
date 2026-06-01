// src/components/sections/MenuSection.jsx
import { useState } from "react";
import MenuCard from "../MenuCard";
import SectionHeader from "../ui/SectionHeader";
import CategoryFilter from "../ui/CategoryFilter";
import { menuItems, categories } from "../../data/menuData";

export default function MenuSection() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? menuItems : menuItems.filter((m) => m.category === active);

  return (
    <section id="menu" style={{ background: "#0D0703", padding: "96px 0" }}>
      <div className="container-inner">
        <SectionHeader
          label="Our Menu"
          title="Crafted With Passion"
          subtitle="Dari espresso klasik hingga cold brew yang menyegarkan — kami punya minuman sempurna untuk setiap momen."
        />

        <CategoryFilter categories={categories} active={active} onSelect={setActive} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
