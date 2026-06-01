// src/components/sections/ContactSection.jsx
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import SectionHeader from "../ui/SectionHeader";
import ContactInfoCard from "../ui/ContactInfoCard";
import OperationalHours from "../ui/OperationalHours";
import ContactForm from "../ui/ContactForm";

const infoItems = [
  { Icon: FiMapPin, label: "Lokasi",  val: "Jl. Kopi Nusantara No. 12, Jakarta Selatan" },
  { Icon: FiPhone,  label: "Telepon", val: "+62 812-3456-7890" },
  { Icon: FiMail,   label: "Email",   val: "hello@brewista.id" },
];

export default function ContactSection() {
  return (
    <section id="contact" style={{ background: "#0D0703", padding: "96px 0" }}>
      <div className="container-inner">
        <SectionHeader label="Contact" title="Find Us & Say Hello" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          {/* left: info + jam */}
          <div style={{ minWidth: 0 }}>
            <p style={{ color: "#CEAD86", lineHeight: 1.75, marginBottom: 20 }}>
              Kunjungi kami langsung atau kirim pesan — kami selalu senang mendengar dari kamu
              tentang menu, reservasi, atau kolaborasi.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              {infoItems.map(({ Icon, label, val }) => (
                <ContactInfoCard key={label} Icon={Icon} label={label} val={val} />
              ))}
            </div>

            <OperationalHours />
          </div>

          {/* right: form */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
