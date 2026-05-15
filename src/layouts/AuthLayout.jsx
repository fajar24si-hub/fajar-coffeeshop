// src/layouts/AuthLayout.jsx
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
        backgroundImage: "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.5) 100%), url('/images/background-card.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
      }}
    >
      {/* Main Card Container */}
      <div
        style={{
          display: "flex",
          background: "white",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          width: "100%",
          maxWidth: "900px",
          minHeight: "600px",
        }}
        className="auth-card-container"
      >
        {/* Left Side - Background Image */}
        <div
          style={{
            flex: 1,
            backgroundImage: "linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.4) 100%), url('/images/coffee-background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="auth-left-side"
        />

        {/* Right Side - Login Form */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 40px",
            overflow: "auto",
            background: "#ffffff",
          }}
          className="auth-right-side"
        >
          <div
            style={{
              width: "100%",
              maxWidth: "380px",
            }}
          >
            {/* Logo Section */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 40,
              }}
            >
              <img
                src="/logo.svg"
                alt="Brewista Coffee"
                style={{
                  width: 60,
                  height: 60,
                }}
              />
            </div>

            {/* Form Container */}
            <Outlet />
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .auth-card-container {
            flex-direction: column !important;
            max-width: 600px !important;
          }
          .auth-left-side {
            display: none;
          }
          .auth-right-side {
            padding: 40px 30px !important;
          }
        }

        @media (max-width: 768px) {
          .auth-card-container {
            border-radius: 16px !important;
          }
          .auth-right-side {
            padding: 30px 20px !important;
          }
        }

        @media (max-width: 480px) {
          .auth-card-container {
            border-radius: 12px !important;
          }
          .auth-right-side {
            padding: 20px 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
