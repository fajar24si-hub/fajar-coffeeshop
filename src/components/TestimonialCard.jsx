// src/components/TestimonialCard.jsx
import { FaQuoteLeft } from "react-icons/fa";
import { FiStar } from "react-icons/fi";

export default function TestimonialCard({ item, active }) {
  return (
    <div
      id={`testimonial-card-${item.id}`}
      className={`testimonial-card ${active ? "is-active" : "is-inactive"}`}
    >
      {/* accent top line for active */}
      {active && (
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg, transparent, #D4963A, transparent)", borderRadius:"16px 16px 0 0" }} />
      )}

      <FaQuoteLeft style={{ color: active ? "#D4963A" : "rgba(122,98,71,0.3)", fontSize:24, marginBottom:16, transition:"color 0.4s" }} />

      {/* stars */}
      <div style={{ display:"flex", gap:4, marginBottom:14 }}>
        {[...Array(5)].map((_,i)=>(
          <FiStar key={i} size={13} fill={i<item.rating?"#D4963A":"none"} stroke={i<item.rating?"#D4963A":"#3A1F10"} />
        ))}
      </div>

      {/* review text — FIXED: using JSX expression */}
      <p style={{ color:"#CEAD86", fontSize:14, lineHeight:1.7, flex:1, marginBottom:20 }}>
        {item.review}
      </p>

      <div style={{ height:1, background:"#2E1608", marginBottom:18 }} />

      {/* author */}
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ position:"relative", width:44, height:44, borderRadius:"50%", overflow:"hidden", flexShrink:0, border: active ? "2px solid #D4963A" : "2px solid #2E1608", transition:"border-color 0.4s" }}>
          <div className="img-placeholder" style={{ position:"absolute", inset:0, fontSize:20 }}>
            <span>{item.emoji}</span>
          </div>
          <img src={item.avatar} alt={item.name} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", zIndex:1 }} onError={e=>e.target.style.display="none"} />
        </div>
        <div style={{ minWidth:0 }}>
          <div style={{ color:"#F7ECD8", fontWeight:600, fontSize:14, lineHeight:1.2 }}>{item.name}</div>
          <div style={{ color: active?"#D4963A":"#7A6247", fontSize:12, marginTop:3, transition:"color 0.4s" }}>{item.role}</div>
        </div>
        {active && (
          <div style={{ marginLeft:"auto", width:24, height:24, background:"rgba(212,150,58,0.15)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#D4963A", fontSize:13, fontWeight:700 }}>✓</div>
        )}
      </div>
    </div>
  );
}
