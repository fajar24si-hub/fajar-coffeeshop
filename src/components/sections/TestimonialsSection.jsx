// src/components/sections/TestimonialsSection.jsx
import { useState, useEffect } from "react";
import TestimonialCard from "../TestimonialCard";
import SectionHeader from "../ui/SectionHeader";
import TestimonialNavigation from "../ui/TestimonialNavigation";
import { testimonials } from "../../data/menuData";

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((a) => (a + 1) % testimonials.length);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="testimonials" style={{ background: "#0F0702", padding: "96px 0" }}>
      <div className="container-inner">
        <SectionHeader label="Testimonials" title="What Our Customers Say" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
            marginBottom: 36,
          }}
        >
          {testimonials.map((t, i) => (
            <div key={t.id} onClick={() => setActive(i)}>
              <TestimonialCard item={t} active={i === active} />
            </div>
          ))}
        </div>

        <TestimonialNavigation
          total={testimonials.length}
          active={active}
          onPrev={prev}
          onNext={next}
          onDot={setActive}
        />
      </div>
    </section>
  );
}
