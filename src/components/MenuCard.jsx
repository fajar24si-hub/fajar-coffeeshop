// src/components/MenuCard.jsx
import { useState } from "react";
import { FiStar, FiShoppingCart, FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

export default function MenuCard({ item }) {
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const addToCart = () => { setAdded(true); setTimeout(()=>setAdded(false), 1800); };

  const fmt = (p) => new Intl.NumberFormat("id-ID", { style:"currency", currency:"IDR", minimumFractionDigits:0 }).format(p);

  const badgeStyle = {
    "Best Seller": { bg:"#D4963A", color:"#0D0703" },
    "Classic":     { bg:"#3A1F10", color:"#F7ECD8" },
    "Popular":     { bg:"#1E0E06", color:"#F0C56A" },
    "Refreshing":  { bg:"#1e3a5f", color:"#93c5fd" },
    "Sweet Pick":  { bg:"#4c1d3a", color:"#f9a8d4" },
    "Healthy":     { bg:"#14532d", color:"#86efac" },
  }[item.badge] || { bg:"#D4963A", color:"#0D0703" };

  return (
    <div id={`menu-card-${item.id}`} className="menu-card">
      {/* image */}
      <div style={{ position:"relative", height:220, overflow:"hidden", flexShrink:0 }}>
        <div className="img-placeholder" style={{ position:"absolute", inset:0 }}>
          <span style={{ fontSize:56, opacity:0.25 }}>{item.emoji}</span>
        </div>
        <img src={item.image} alt={item.name} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.6s ease", zIndex:1 }}
          onMouseEnter={e=>e.target.style.transform="scale(1.08)"} onMouseLeave={e=>e.target.style.transform="scale(1)"}
          onError={e=>e.target.style.display="none"} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, #1A0A04 0%, rgba(26,10,4,0.3) 50%, transparent 100%)", zIndex:2 }} />

        {/* badge */}
        <span style={{ position:"absolute", top:12, left:12, zIndex:3, fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:999, background:badgeStyle.bg, color:badgeStyle.color, display:"flex", alignItems:"center", gap:5 }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:badgeStyle.color, opacity:0.7, display:"inline-block" }} />{item.badge}
        </span>

        {/* like */}
        <button id={`like-btn-${item.id}`} onClick={()=>setLiked(!liked)} style={{ position:"absolute", top:12, right:12, zIndex:3, width:32, height:32, borderRadius:"50%", border:`1px solid ${liked?"rgba(248,113,113,0.4)":"rgba(255,255,255,0.1)"}`, background: liked?"rgba(239,68,68,0.15)":"rgba(13,7,3,0.6)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.2s" }}>
          {liked ? <FaHeart color="#f87171" size={12} /> : <FiHeart color="#F7ECD8" size={12} />}
        </button>
      </div>

      {/* content */}
      <div style={{ padding:"18px 20px 20px", display:"flex", flexDirection:"column", flex:1, gap:10 }}>
        <span style={{ color:"rgba(212,150,58,0.8)", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.18em" }}>{item.category}</span>
        <h3 style={{ fontFamily:"'Playfair Display',serif", color:"#F7ECD8", fontSize:"1.1rem", fontWeight:700, lineHeight:1.3 }}>{item.name}</h3>
        <p style={{ color:"#7A6247", fontSize:13, lineHeight:1.6, flex:1, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{item.description}</p>

        {/* stars */}
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ display:"flex", gap:2 }}>
            {[...Array(5)].map((_,i)=><FiStar key={i} size={11} fill={i<Math.floor(item.rating)?"#D4963A":"none"} stroke={i<Math.floor(item.rating)?"#D4963A":"#3A1F10"} />)}
          </div>
          <span style={{ color:"#D4963A", fontSize:12, fontWeight:600 }}>{item.rating}</span>
          <span style={{ color:"#7A6247", fontSize:12 }}>({item.reviews} ulasan)</span>
        </div>

        <div style={{ height:1, background:"#2E1608" }} />

        {/* price + cart */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
          <div>
            <div style={{ color:"#D4963A", fontWeight:700, fontSize:"1.2rem", lineHeight:1 }}>{fmt(item.price)}</div>
            <div style={{ color:"#7A6247", fontSize:11, marginTop:3 }}>per cup</div>
          </div>
          <button id={`add-cart-btn-${item.id}`} onClick={addToCart}
            className={added ? "" : "shimmer-btn"}
            style={{ flexShrink:0, display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:700, padding:"9px 16px", borderRadius:10, cursor:"pointer", border:"none", fontFamily:"'Inter',sans-serif", ...(added ? { background:"#16a34a", color:"#fff" } : { color:"#0D0703" }) }}>
            <FiShoppingCart size={13} />
            {added ? "Added ✓" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
