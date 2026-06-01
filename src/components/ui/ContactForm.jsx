// src/components/ui/ContactForm.jsx
import { useState } from "react";
import { FiCheck, FiSend } from "react-icons/fi";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <form
      id="contact-form"
      onSubmit={submit}
      style={{
        background: "rgba(26,10,4,0.8)",
        border: "1px solid #2E1608",
        borderRadius: 18,
        padding: 32,
        display: "flex",
        flexDirection: "column",
        gap: 18,
        minWidth: 0,
      }}
    >
      <div>
        <h3
          style={{
            fontFamily: "'Playfair Display',serif",
            color: "#F7ECD8",
            fontSize: "1.3rem",
            fontWeight: 700,
          }}
        >
          Kirim Pesan
        </h3>
        <p style={{ color: "#7A6247", fontSize: 12, marginTop: 4 }}>
          Kami akan membalas dalam 24 jam.
        </p>
      </div>

      {[
        { id: "contact-name",  label: "Nama Lengkap", type: "text",  key: "name",  ph: "Nama kamu" },
        { id: "contact-email", label: "Email",        type: "email", key: "email", ph: "email@kamu.com" },
      ].map(({ id, label, type, key, ph }) => (
        <div key={id}>
          <label
            style={{
              display: "block",
              color: "#7A6247",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            {label}
          </label>
          <input
            id={id}
            type={type}
            required
            value={form[key]}
            placeholder={ph}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="form-input"
          />
        </div>
      ))}

      <div>
        <label
          style={{
            display: "block",
            color: "#7A6247",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          Pesan
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={form.message}
          placeholder="Tulis pesanmu di sini..."
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="form-input"
          style={{ resize: "none" }}
        />
      </div>

      <button
        id="contact-submit-btn"
        type="submit"
        className={sent ? "" : "shimmer-btn"}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: 12,
          fontWeight: 700,
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          ...(sent
            ? { background: "#16a34a", color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif" }
            : { color: "#0D0703" }),
        }}
      >
        {sent ? <><FiCheck /> Pesan Terkirim!</> : <><FiSend /> Kirim Pesan</>}
      </button>
    </form>
  );
}
