# ☕ Brewista — Coffee Shop Website

Proyek website coffee shop modern dibangun dengan **React + Vite + Tailwind CSS v4**.

---

## 🚀 Cara Clone & Menjalankan di Device Lain

### 1. Clone repository
```bash
git clone https://github.com/fajar24si-hub/fajar-coffeeshop.git
```

### 2. Masuk ke folder project
```bash
cd fajar-coffeeshop
```

### 3. Install semua dependencies
```bash
npm install
```

### 4. Jalankan development server
```bash
npm run dev
```

### 5. Buka di browser
```
http://localhost:5173
```

> **Catatan:** Pastikan sudah menginstall **Node.js v18+** dan **npm** di device kamu.  
> Download Node.js di: https://nodejs.org

---

## 📁 Struktur Folder

```
fajar-coffeeshop/
├── public/
│   └── images/          ← Semua foto sudah tersedia
│       ├── interior.jpg
│       ├── espresso.jpg
│       ├── latte.jpg
│       ├── cappuccino.jpg
│       ├── cold-brew.jpg
│       ├── frappe.jpg
│       ├── matcha.jpg
│       ├── avatar-1.jpg
│       ├── avatar-2.jpg
│       └── avatar-3.jpg
├── src/
│   ├── assets/
│   │   └── tailwind.css     ← Theme warna & animasi
│   ├── components/
│   │   ├── MenuCard.jsx     ← Kartu produk menu
│   │   ├── TestimonialCard.jsx
│   │   └── Loading.jsx
│   ├── data/
│   │   └── menuData.js      ← Data menu & testimoni
│   ├── layouts/
│   │   ├── Navbar.jsx       ← Navigasi sticky
│   │   ├── Footer.jsx
│   │   ├── MainLayout.jsx
│   │   └── AuthLayout.jsx
│   ├── pages/
│   │   ├── Home.jsx         ← Halaman utama
│   │   └── auth/
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       └── ForgotPassword.jsx
│   └── main.jsx             ← Entry point React
├── index.html
├── vite.config.js
├── package.json
└── package-lock.json        ← Jangan dihapus! Untuk konsistensi versi
```

---

## 🎨 Fitur Website

| Section | Fitur |
|---|---|
| **Navbar** | Sticky scroll, active link, mobile responsive, smooth scroll |
| **Hero** | Fullscreen background, animasi float, statistik, dual CTA |
| **About** | Foto interior, feature cards, rating badge melayang |
| **Menu** | Filter kategori (Hot/Iced/Non Coffee), like, add to cart |
| **Testimonials** | Auto-rotate, click card, dot navigation |
| **Contact** | Form validasi, info kontak, jam operasional |
| **Footer** | Social links, quick links, copyright |
| **Auth** | Halaman Login, Register, Forgot Password |

---

## 🛠️ Tech Stack

- **React 19** — UI library
- **Vite 8** — Build tool & dev server
- **Tailwind CSS v4** — Styling dengan custom theme
- **React Router DOM v7** — Client-side routing
- **React Icons v5** — Icon library
- **Google Fonts** — Playfair Display + Inter

---

## 🎨 Palet Warna

| Token | Hex | Kegunaan |
|---|---|---|
| `espresso` | `#0D0703` | Background utama |
| `coffee`   | `#1E0E06` | Background sekunder |
| `amber`    | `#D4963A` | Warna aksen / CTA |
| `gold`     | `#F0C56A` | Highlight |
| `cream`    | `#F7ECD8` | Teks utama |
| `muted`    | `#7A6247` | Teks sekunder |
| `card`     | `#1A0A04` | Background kartu |

---

## ⚙️ Syarat System

| Tool | Versi Minimum |
|---|---|
| Node.js | v18.0.0+ |
| npm | v9.0.0+ |
| Browser | Chrome / Firefox / Edge (latest) |
