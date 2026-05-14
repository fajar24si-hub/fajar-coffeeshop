// src/layouts/Navbar.jsx
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { FaCoffee } from "react-icons/fa";

const links = [
  { label: "Home",        href: "#hero" },
  { label: "About",       href: "#about" },
  { label: "Menu",        href: "#menu" },
  { label: "Testimonial", href: "#testimonials" },
  { label: "Contact",     href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]   = useState("Home");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (label, href) => {
    setActive(label);
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const navStyle = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
    transition: "all 0.3s ease",
    ...(scrolled ? { background: "rgba(13,7,3,0.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(212,150,58,0.1)", boxShadow: "0 4px 30px rgba(0,0,0,0.6)" } : { background: "transparent" }),
  };

  return (
    <nav id="navbar" style={navStyle}>
      <div style={{ maxWidth:1152, margin:"0 auto", padding:"0 24px", height:68, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        {/* logo */}
        <a href="#hero" onClick={()=>setActive("Home")} style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <div style={{ width:36, height:36, background:"#D4963A", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 3px 14px rgba(212,150,58,0.35)", transition:"transform 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            <FaCoffee color="#0D0703" size={16} />
          </div>
          <span className="gradient-text" style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.2rem", fontWeight:800 }}>Brewista</span>
        </a>

        {/* desktop links */}
        <ul style={{ display:"flex", alignItems:"center", gap:28, listStyle:"none", margin:0, padding:0 }} className="desktop-nav">
          {links.map(l => (
            <li key={l.label}>
              <button onClick={()=>go(l.label,l.href)} className={`nav-link${active===l.label?" active-link":""}`}
                style={{ background:"none", border:"none", fontFamily:"'Inter',sans-serif", fontSize:14, fontWeight:500, color: active===l.label?"#D4963A":"#CEAD86", cursor:"pointer", padding:"4px 0", transition:"color 0.2s" }}
                onMouseEnter={e=>{if(active!==l.label)e.target.style.color="#F7ECD8"}} onMouseLeave={e=>{if(active!==l.label)e.target.style.color="#CEAD86"}}>
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button id="navbar-order-btn" onClick={()=>go("Menu","#menu")} className="shimmer-btn desktop-nav"
          style={{ color:"#0D0703", fontSize:13, fontWeight:700, padding:"10px 20px", borderRadius:999 }}>
          Order Now
        </button>

        {/* mobile toggle */}
        <button id="navbar-mobile-toggle" onClick={()=>setOpen(!open)} className="mobile-nav"
          style={{ background:"none", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, width:38, height:38, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#F7ECD8", fontSize:18, transition:"border-color 0.2s" }}
          onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(212,150,58,0.5)"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"}>
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="animate-slide-down mobile-nav" style={{ background:"rgba(13,7,3,0.97)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(212,150,58,0.1)", padding:"12px 24px 20px" }}>
          {links.map(l => (
            <button key={l.label} onClick={()=>go(l.label,l.href)}
              style={{ display:"block", width:"100%", textAlign:"left", background: active===l.label?"rgba(212,150,58,0.1)":"transparent", border:"none", borderRadius:10, fontFamily:"'Inter',sans-serif", fontSize:14, fontWeight:500, color: active===l.label?"#D4963A":"#CEAD86", cursor:"pointer", padding:"12px 14px", marginBottom:4, transition:"all 0.2s" }}>
              {l.label}
            </button>
          ))}
          <button id="navbar-mobile-order-btn" onClick={()=>go("Menu","#menu")} className="shimmer-btn"
            style={{ width:"100%", marginTop:8, color:"#0D0703", fontWeight:700, fontSize:14, padding:"12px", borderRadius:12 }}>
            Order Now
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 767px) { .desktop-nav { display: none !important; } }
        @media (min-width: 768px) { .mobile-nav { display: none !important; } }
      `}</style>
    </nav>
  );
}
