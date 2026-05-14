// src/layouts/Footer.jsx
import { FaCoffee, FaInstagram, FaTwitter, FaFacebook, FaYoutube } from "react-icons/fa";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";

export default function Footer() {
  const year = new Date().getFullYear();
  const socials = [
    { Icon: FaInstagram, id:"footer-instagram" },
    { Icon: FaTwitter,   id:"footer-twitter" },
    { Icon: FaFacebook,  id:"footer-facebook" },
    { Icon: FaYoutube,   id:"footer-youtube" },
  ];
  const ql = [
    { label:"Home", href:"#hero" }, { label:"About Us", href:"#about" },
    { label:"Our Menu", href:"#menu" }, { label:"Testimonial", href:"#testimonials" },
    { label:"Contact", href:"#contact" },
  ];
  const menu = ["Espresso & Hot Coffee","Iced & Cold Brew","Signature Drinks","Non Coffee","Pastries & Snacks"];

  const h4 = { color:"#F7ECD8", fontWeight:600, fontSize:12, textTransform:"uppercase", letterSpacing:"0.18em", marginBottom:16 };
  const link = { display:"flex", alignItems:"center", gap:8, color:"#7A6247", fontSize:13, textDecoration:"none", marginBottom:10, transition:"color 0.2s", cursor:"pointer" };

  return (
    <footer id="footer" style={{ background:"#080401", borderTop:"1px solid rgba(212,150,58,0.15)", position:"relative" }}>
      <div className="container-inner" style={{ paddingTop:56, paddingBottom:48 }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1.5fr", gap:40 }}>
          {/* brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <div style={{ width:34, height:34, background:"#D4963A", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <FaCoffee color="#0D0703" size={15} />
              </div>
              <span className="gradient-text" style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.15rem", fontWeight:800 }}>Brewista</span>
            </div>
            <p style={{ color:"#7A6247", fontSize:13, lineHeight:1.7, marginBottom:18 }}>Crafting the perfect cup, one sip at a time. Premium beans, expert baristas, unforgettable experience.</p>
            <div style={{ display:"flex", gap:10 }}>
              {socials.map(({ Icon, id }) => (
                <a key={id} id={id} href="#" style={{ width:34, height:34, borderRadius:"50%", border:"1px solid #2E1608", display:"flex", alignItems:"center", justifyContent:"center", color:"#7A6247", transition:"all 0.2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="#D4963A";e.currentTarget.style.color="#D4963A";e.currentTarget.style.transform="scale(1.1)"}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#2E1608";e.currentTarget.style.color="#7A6247";e.currentTarget.style.transform="scale(1)"}}>
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* quick links */}
          <div>
            <h4 style={h4}>Quick Links</h4>
            {ql.map(l => (
              <a key={l.label} href={l.href} style={link}
                onMouseEnter={e=>e.currentTarget.style.color="#D4963A"} onMouseLeave={e=>e.currentTarget.style.color="#7A6247"}>
                {l.label}
              </a>
            ))}
          </div>

          {/* menu */}
          <div>
            <h4 style={h4}>Our Menu</h4>
            {menu.map(m => (
              <a key={m} href="#menu" style={link}
                onMouseEnter={e=>e.currentTarget.style.color="#D4963A"} onMouseLeave={e=>e.currentTarget.style.color="#7A6247"}>
                {m}
              </a>
            ))}
          </div>

          {/* contact */}
          <div>
            <h4 style={h4}>Contact Us</h4>
            {[
              { Icon: FiMapPin, text:"Jl. Kopi Nusantara No. 12, Jakarta Selatan, 12345" },
              { Icon: FiPhone,  text:"+62 812-3456-7890" },
              { Icon: FiMail,   text:"hello@brewista.id" },
            ].map(({ Icon, text }) => (
              <div key={text} style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:12 }}>
                <Icon color="#D4963A" size={14} style={{ marginTop:2, flexShrink:0 }} />
                <span style={{ color:"#7A6247", fontSize:13, lineHeight:1.5 }}>{text}</span>
              </div>
            ))}
            <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginTop:4 }}>
              <FiClock color="#D4963A" size={14} style={{ marginTop:2, flexShrink:0 }} />
              <div style={{ color:"#7A6247", fontSize:13, lineHeight:1.7 }}>
                <div>Mon–Fri: 07:00 – 22:00</div>
                <div>Sat–Sun: 08:00 – 23:00</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div style={{ borderTop:"1px solid rgba(46,22,8,0.6)", padding:"16px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", maxWidth:1152, margin:"0 auto" }}>
        <p style={{ color:"#7A6247", fontSize:12 }}>© {year} <span style={{ color:"#D4963A", fontWeight:600 }}>Brewista</span>. All rights reserved.</p>
        <p style={{ color:"#7A6247", fontSize:12 }}>Made with ☕ &amp; ❤️ in Indonesia</p>
      </div>
    </footer>
  );
}
