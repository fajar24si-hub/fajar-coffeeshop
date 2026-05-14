// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { FiArrowRight, FiStar, FiCheck, FiChevronLeft, FiChevronRight, FiSend, FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import { FaCoffee, FaLeaf, FaAward, FaUsers, FaQuoteLeft } from "react-icons/fa";
import MenuCard from "../components/MenuCard";
import TestimonialCard from "../components/TestimonialCard";
import { menuItems, categories, testimonials } from "../data/menuData";

/* ── HERO ── */
function HeroSection() {
  const go = (id) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section id="hero" className="hero-bg" style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
      <img src="/images/hero.jpg" alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} onError={e=>e.target.style.display="none"} />
      <div className="hero-overlay" style={{ position:"absolute", inset:0 }} />

      {/* floating deco */}
      <div className="animate-float" style={{ position:"absolute", top:120, right:80, fontSize:80, opacity:0.06 }}>☕</div>
      <div className="animate-float" style={{ position:"absolute", bottom:140, left:60, fontSize:56, opacity:0.06, animationDelay:"2s" }}>🫘</div>

      <div style={{ position:"relative", zIndex:10, width:"100%", maxWidth:860, margin:"0 auto", padding:"140px 24px 100px", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center" }}>

        {/* badge */}
        <div className="animate-fade-up" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(212,150,58,0.1)", border:"1px solid rgba(212,150,58,0.3)", color:"#D4963A", fontSize:12, fontWeight:600, padding:"8px 18px", borderRadius:999, marginBottom:28 }}>
          <FiStar fill="#D4963A" size={11} /> Premium Coffee Experience Since 2018 <FiStar fill="#D4963A" size={11} />
        </div>

        {/* headline */}
        <h1 className="animate-fade-up" style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.4rem,6vw,4.5rem)", fontWeight:800, color:"#F7ECD8", lineHeight:1.1, marginBottom:20, animationDelay:"0.1s" }}>
          Taste the Art of <span className="gradient-text" style={{ fontStyle:"italic" }}>Perfect Coffee</span>
        </h1>

        <p className="animate-fade-up" style={{ color:"#CEAD86", fontSize:"clamp(1rem,2vw,1.15rem)", maxWidth:560, lineHeight:1.7, marginBottom:36, animationDelay:"0.2s" }}>
          Setiap cangkir yang kami sajikan adalah hasil dari biji kopi pilihan terbaik, diracik oleh barista berpengalaman, khusus untuk momen spesialmu.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up" style={{ display:"flex", flexWrap:"wrap", gap:14, justifyContent:"center", marginBottom:60, animationDelay:"0.3s" }}>
          <button id="hero-menu-btn" onClick={()=>go("#menu")} className="shimmer-btn" style={{ color:"#0D0703", fontWeight:700, fontSize:14, padding:"13px 28px", borderRadius:999, display:"flex", alignItems:"center", gap:8 }}>
            Explore Menu <FiArrowRight />
          </button>
          <button id="hero-story-btn" onClick={()=>go("#about")} style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.2)", color:"#F7ECD8", fontWeight:500, fontSize:14, padding:"13px 28px", borderRadius:999, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.2s" }}
            onMouseEnter={e=>e.target.style.borderColor="rgba(212,150,58,0.5)"} onMouseLeave={e=>e.target.style.borderColor="rgba(255,255,255,0.2)"}>
            Our Story
          </button>
        </div>

        {/* stats */}
        <div className="animate-fade-up glass-card" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", borderRadius:16, overflow:"hidden", width:"100%", maxWidth:420, animationDelay:"0.4s" }}>
          {[{ v:"15K+", l:"Happy Customers" }, { v:"30+", l:"Coffee Variants" }, { v:"4.9★", l:"Average Rating" }].map(({ v, l }, i) => (
            <div key={l} style={{ padding:"18px 12px", textAlign:"center", borderLeft: i>0 ? "1px solid rgba(212,150,58,0.1)" : "none" }}>
              <div className="gradient-text" style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.5rem", fontWeight:700 }}>{v}</div>
              <div style={{ color:"#7A6247", fontSize:11, marginTop:4, fontWeight:500 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* scroll indicator */}
      <div style={{ position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:8, zIndex:10 }}>
        <span style={{ color:"rgba(122,98,71,0.6)", fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase" }}>Scroll</span>
        <div style={{ width:20, height:32, border:"1px solid rgba(122,98,71,0.3)", borderRadius:10, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"5px 0" }}>
          <div className="scroll-dot" style={{ width:4, height:7, background:"#D4963A", borderRadius:4 }} />
        </div>
      </div>
    </section>
  );
}

/* ── ABOUT ── */
function AboutSection() {
  const features = [
    { Icon: FaLeaf,   title: "Single Origin Beans",    desc: "Biji kopi premium dari perkebunan terbaik Nusantara — Aceh, Toraja, dan Flores." },
    { Icon: FaAward,  title: "Award-Winning Baristas", desc: "Tim kami terdiri dari barista bersertifikat internasional dengan jam terbang tinggi." },
    { Icon: FaCoffee, title: "Freshly Roasted Daily",  desc: "Kami memanggang biji kopi setiap pagi untuk menjamin kesegaran dan cita rasa terbaik." },
    { Icon: FaUsers,  title: "Community Atmosphere",   desc: "Ruang yang dirancang untuk menginspirasi — sempurna untuk bekerja, belajar, atau bersantai." },
  ];
  return (
    <section id="about" style={{ background:"#0F0702", padding:"96px 0" }}>
      <div className="container-inner">
        {/* header */}
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <div className="section-label" style={{ justifyContent:"center" }}>Our Story</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:800, color:"#F7ECD8", margin:"16px 0 16px" }}>More Than Just Coffee</h2>
          <div className="divider" />
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:56, alignItems:"start" }}>
          {/* image */}
          <div style={{ position:"relative", minWidth:0 }}>
            <div style={{ position:"relative", height:360, borderRadius:16, overflow:"hidden", border:"1px solid #2E1608", background:"linear-gradient(135deg,#1E0E06,#3A1F10)" }}>
              <div className="img-placeholder" style={{ position:"absolute", inset:0, fontSize:80, opacity:0.12 }}>🏠</div>
              <img src="/images/interior.jpg" alt="Interior" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} onError={e=>e.target.style.display="none"} />
            </div>
            <div className="glass-card" style={{ position:"absolute", bottom:-16, right:-12, borderRadius:14, padding:"14px 18px", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, background:"rgba(212,150,58,0.15)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <FiStar fill="#D4963A" color="#D4963A" size={18} />
              </div>
              <div>
                <div style={{ color:"#F7ECD8", fontWeight:700, fontSize:17 }}>4.9 / 5.0</div>
                <div style={{ color:"#7A6247", fontSize:11, marginTop:2 }}>15,000+ ulasan</div>
              </div>
            </div>
            <div className="glass-card" style={{ position:"absolute", top:-14, left:-12, borderRadius:12, padding:"10px 16px" }}>
              <div style={{ color:"#D4963A", fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.15em" }}>Est.</div>
              <div style={{ color:"#F7ECD8", fontWeight:700, fontSize:18 }}>2018</div>
            </div>
          </div>

          {/* content */}
          <div style={{ minWidth:0 }}>
            <p style={{ color:"#CEAD86", lineHeight:1.75, marginBottom:14 }}>Brewista lahir dari kecintaan mendalam terhadap kopi Nusantara. Sejak 2018, kami berkomitmen menghadirkan pengalaman kopi yang autentik — dari biji ke cangkir — dengan penuh cinta dan keahlian.</p>
            <p style={{ color:"#7A6247", fontSize:14, lineHeight:1.75, marginBottom:24 }}>Setiap menu kami dirancang untuk merayakan kekayaan cita rasa kopi Indonesia, sambil menggabungkan teknik barista modern yang telah teruji secara internasional.</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:28 }}>
              {features.map(({ Icon, title, desc }) => (
                <div key={title} className="feature-card">
                  <div className="icon-box" style={{ width:36, height:36, minWidth:36, borderRadius:8 }}><Icon size={14} /></div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ color:"#F7ECD8", fontWeight:600, fontSize:13 }}>{title}</div>
                    <div style={{ color:"#7A6247", fontSize:12, marginTop:4, lineHeight:1.5 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button id="about-visit-btn" onClick={()=>document.querySelector("#contact")?.scrollIntoView({ behavior:"smooth" })} className="shimmer-btn" style={{ color:"#0D0703", fontWeight:700, fontSize:14, padding:"12px 24px", borderRadius:999, display:"inline-flex", alignItems:"center", gap:8 }}>
              Visit Us <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── MENU ── */
function MenuSection() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? menuItems : menuItems.filter(m => m.category === active);
  return (
    <section id="menu" style={{ background:"#0D0703", padding:"96px 0" }}>
      <div className="container-inner">
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <div className="section-label" style={{ justifyContent:"center" }}>Our Menu</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:800, color:"#F7ECD8", margin:"16px 0 16px" }}>Crafted With Passion</h2>
          <div className="divider" style={{ marginBottom:16 }} />
          <p style={{ color:"#7A6247", maxWidth:480, margin:"0 auto", fontSize:14, lineHeight:1.7 }}>Dari espresso klasik hingga cold brew yang menyegarkan — kami punya minuman sempurna untuk setiap momen.</p>
        </div>

        {/* category filters */}
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:10, marginBottom:40 }}>
          {categories.map(cat => (
            <button key={cat} id={`filter-${cat.toLowerCase().replace(/\s+/g,"-")}`} onClick={()=>setActive(cat)} className={`cat-pill${active===cat?" active shimmer-btn":""}`}>{cat}</button>
          ))}
        </div>

        {/* grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:24 }}>
          {filtered.map(item => <MenuCard key={item.id} item={item} />)}
        </div>
      </div>
    </section>
  );
}

/* ── TESTIMONIALS ── */
function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const prev = () => setActive(a => (a - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive(a => (a + 1) % testimonials.length);
  useEffect(() => { const t = setInterval(next, 5000); return () => clearInterval(t); }, []);
  return (
    <section id="testimonials" style={{ background:"#0F0702", padding:"96px 0" }}>
      <div className="container-inner">
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <div className="section-label" style={{ justifyContent:"center" }}>Testimonials</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:800, color:"#F7ECD8", margin:"16px 0 16px" }}>What Our Customers Say</h2>
          <div className="divider" />
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:20, marginBottom:36 }}>
          {testimonials.map((t, i) => (
            <div key={t.id} onClick={()=>setActive(i)}><TestimonialCard item={t} active={i===active} /></div>
          ))}
        </div>

        {/* nav */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16 }}>
          <button id="testimonial-prev" onClick={prev} style={{ width:40, height:40, borderRadius:"50%", border:"1px solid #2E1608", background:"transparent", color:"#7A6247", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}
            onMouseEnter={e=>{e.target.style.borderColor="#D4963A";e.target.style.color="#D4963A"}} onMouseLeave={e=>{e.target.style.borderColor="#2E1608";e.target.style.color="#7A6247"}}>
            <FiChevronLeft />
          </button>
          <div style={{ display:"flex", gap:8 }}>
            {testimonials.map((_,i)=>(
              <button key={i} onClick={()=>setActive(i)} style={{ height:8, width: i===active?28:8, borderRadius:4, border:"none", background: i===active?"#D4963A":"#2E1608", cursor:"pointer", transition:"all 0.3s" }} />
            ))}
          </div>
          <button id="testimonial-next" onClick={next} style={{ width:40, height:40, borderRadius:"50%", border:"1px solid #2E1608", background:"transparent", color:"#7A6247", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}
            onMouseEnter={e=>{e.target.style.borderColor="#D4963A";e.target.style.color="#D4963A"}} onMouseLeave={e=>{e.target.style.borderColor="#2E1608";e.target.style.color="#7A6247"}}>
            <FiChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── CONTACT ── */
function ContactSection() {
  const [form, setForm] = useState({ name:"", email:"", message:"" });
  const [sent, setSent] = useState(false);
  const submit = (e) => { e.preventDefault(); setSent(true); setTimeout(()=>setSent(false),3000); setForm({ name:"",email:"",message:"" }); };
  const info = [
    { Icon: FiMapPin, label:"Lokasi",  val:"Jl. Kopi Nusantara No. 12, Jakarta Selatan" },
    { Icon: FiPhone,  label:"Telepon", val:"+62 812-3456-7890" },
    { Icon: FiMail,   label:"Email",   val:"hello@brewista.id" },
  ];
  return (
    <section id="contact" style={{ background:"#0D0703", padding:"96px 0" }}>
      <div className="container-inner">
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <div className="section-label" style={{ justifyContent:"center" }}>Contact</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:800, color:"#F7ECD8", margin:"16px 0 16px" }}>Find Us &amp; Say Hello</h2>
          <div className="divider" />
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40 }}>
          {/* left */}
          <div style={{ minWidth:0 }}>
            <p style={{ color:"#CEAD86", lineHeight:1.75, marginBottom:20 }}>Kunjungi kami langsung atau kirim pesan — kami selalu senang mendengar dari kamu tentang menu, reservasi, atau kolaborasi.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
              {info.map(({ Icon, label, val }) => (
                <div key={label} className="info-card">
                  <div className="icon-box"><Icon size={16} /></div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ color:"#7A6247", fontSize:10, textTransform:"uppercase", letterSpacing:"0.15em", fontWeight:600 }}>{label}</div>
                    <div style={{ color:"#F7ECD8", fontSize:13, fontWeight:500, marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background:"rgba(26,10,4,0.7)", border:"1px solid #2E1608", borderRadius:14, padding:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, color:"#F7ECD8", fontWeight:600, fontSize:13, marginBottom:16 }}>
                <FiClock color="#D4963A" size={15} /> Jam Operasional
              </div>
              {[{ d:"Senin – Jumat", t:"07:00 – 22:00" }, { d:"Sabtu – Minggu", t:"08:00 – 23:00" }].map(({ d, t }) => (
                <div key={d} style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <span style={{ color:"#7A6247", fontSize:13 }}>{d}</span>
                  <span style={{ color:"#D4963A", fontWeight:600, fontSize:13 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* form */}
          <form id="contact-form" onSubmit={submit} style={{ background:"rgba(26,10,4,0.8)", border:"1px solid #2E1608", borderRadius:18, padding:32, display:"flex", flexDirection:"column", gap:18, minWidth:0 }}>
            <div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", color:"#F7ECD8", fontSize:"1.3rem", fontWeight:700 }}>Kirim Pesan</h3>
              <p style={{ color:"#7A6247", fontSize:12, marginTop:4 }}>Kami akan membalas dalam 24 jam.</p>
            </div>
            {[
              { id:"contact-name",  label:"Nama Lengkap", type:"text",  key:"name",    ph:"Nama kamu" },
              { id:"contact-email", label:"Email",        type:"email", key:"email",   ph:"email@kamu.com" },
            ].map(({ id, label, type, key, ph }) => (
              <div key={id}>
                <label style={{ display:"block", color:"#7A6247", fontSize:11, textTransform:"uppercase", letterSpacing:"0.15em", fontWeight:600, marginBottom:8 }}>{label}</label>
                <input id={id} type={type} required value={form[key]} placeholder={ph} onChange={e=>setForm({...form,[key]:e.target.value})} className="form-input" />
              </div>
            ))}
            <div>
              <label style={{ display:"block", color:"#7A6247", fontSize:11, textTransform:"uppercase", letterSpacing:"0.15em", fontWeight:600, marginBottom:8 }}>Pesan</label>
              <textarea id="contact-message" required rows={5} value={form.message} placeholder="Tulis pesanmu di sini..." onChange={e=>setForm({...form,message:e.target.value})} className="form-input" style={{ resize:"none" }} />
            </div>
            <button id="contact-submit-btn" type="submit" className={sent?"":"shimmer-btn"} style={{ width:"100%", padding:"14px", borderRadius:12, fontWeight:700, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", gap:8, ...(sent?{ background:"#16a34a", color:"#fff", border:"none", cursor:"pointer", fontFamily:"'Inter',sans-serif" }:{ color:"#0D0703" }) }}>
              {sent ? <><FiCheck /> Pesan Terkirim!</> : <><FiSend /> Kirim Pesan</>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <MenuSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
