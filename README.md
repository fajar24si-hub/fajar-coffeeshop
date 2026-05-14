# ☕ Brewista — Coffee Shop Website

Proyek website coffee shop modern dibangun dengan **React + Vite + Tailwind CSS v4**.

---

## 🚀 Cara Menjalankan

### 1. Install dependencies
```bash
npm install
```

### 2. Jalankan development server
```bash
npm run dev
```

### 3. Buka di browser
```
http://localhost:5173
```

---

## 📁 Struktur Folder

```
fajar-coffeeshop/
├── public/
│   └── images/          ← Letakkan foto-foto di sini
│       ├── hero.jpg
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
│   │   └── TestimonialCard.jsx
│   ├── data/
│   │   └── menuData.js      ← Data menu & testimoni
│   ├── layouts/
│   │   ├── Navbar.jsx       ← Navigasi sticky
│   │   └── Footer.jsx
│   ├── pages/
│   │   └── Home.jsx         ← Semua sections halaman utama
│   └── main.jsx             ← Entry point React
├── index.html
├── vite.config.js
└── package.json
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

---

## 🎨 Palet Warna

| Token | Hex | Kegunaan |
|---|---|---|
| `espresso` | `#1A0F07` | Background utama |
| `coffee`   | `#2C1810` | Background sekunder |
| `amber`    | `#C8963E` | Warna aksen / CTA |
| `gold`     | `#E8B86D` | Highlight |
| `cream`    | `#F5E6D3` | Teks utama |
| `muted`    | `#8B7355` | Teks sekunder |
| `card`     | `#2E1A0E` | Background kartu |

---

## 📸 Foto Yang Dibutuhkan

Letakkan semua foto di folder `public/images/`:

| Nama File | Ukuran Disarankan | Keterangan |
|---|---|---|
| `hero.jpg` | 1920×1080 | Background section Hero |
| `interior.jpg` | 800×600 | Foto kafe section About |
| `espresso.jpg` | 400×400 | Produk: Espresso |
| `latte.jpg` | 400×400 | Produk: Caramel Latte |
| `cappuccino.jpg` | 400×400 | Produk: Cappuccino |
| `cold-brew.jpg` | 400×400 | Produk: Cold Brew |
| `frappe.jpg` | 400×400 | Produk: Mocha Frappe |
| `matcha.jpg` | 400×400 | Produk: Matcha Latte |
| `avatar-1.jpg` | 200×200 | Foto pelanggan 1 |
| `avatar-2.jpg` | 200×200 | Foto pelanggan 2 |
| `avatar-3.jpg` | 200×200 | Foto pelanggan 3 |

> **Catatan:** Jika foto belum tersedia, website tetap tampil normal dengan **emoji placeholder** 🎉

---

## 🛠️ Tech Stack

- **React 19** — UI library
- **Vite 8** — Build tool & dev server  
- **Tailwind CSS v4** — Styling dengan custom theme
- **React Icons** — Icon library (Feather + Font Awesome)
- **Google Fonts** — Playfair Display + Poppins
