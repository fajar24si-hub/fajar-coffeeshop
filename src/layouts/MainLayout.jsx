// src/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout() {
  return (
    <div id="main-layout" style={{ minHeight: "100vh", background: "#0D0703", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main id="main-content" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
