// src/components/ui/TestimonialNavigation.jsx
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function TestimonialNavigation({ total, active, onPrev, onNext, onDot }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <button
        id="testimonial-prev"
        onClick={onPrev}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid #2E1608",
          background: "transparent",
          color: "#7A6247",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = "#D4963A";
          e.target.style.color = "#D4963A";
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = "#2E1608";
          e.target.style.color = "#7A6247";
        }}
      >
        <FiChevronLeft />
      </button>

      <div style={{ display: "flex", gap: 8 }}>
        {[...Array(total)].map((_, i) => (
          <button
            key={i}
            onClick={() => onDot(i)}
            style={{
              height: 8,
              width: i === active ? 28 : 8,
              borderRadius: 4,
              border: "none",
              background: i === active ? "#D4963A" : "#2E1608",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>

      <button
        id="testimonial-next"
        onClick={onNext}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid #2E1608",
          background: "transparent",
          color: "#7A6247",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = "#D4963A";
          e.target.style.color = "#D4963A";
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = "#2E1608";
          e.target.style.color = "#7A6247";
        }}
      >
        <FiChevronRight />
      </button>
    </div>
  );
}
