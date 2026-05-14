// src/components/Loading.jsx
export default function Loading() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#0D0703",
      gap: 16,
    }}>
      {/* Spinner */}
      <div style={{
        width: 48,
        height: 48,
        border: "3px solid rgba(212,150,58,0.15)",
        borderTop: "3px solid #D4963A",
        borderRadius: "50%",
        animation: "spin 0.85s linear infinite",
      }} />

      <p style={{
        color: "#7A6247",
        fontSize: 13,
        fontFamily: "'Inter', sans-serif",
        letterSpacing: "0.1em",
      }}>
        Loading...
      </p>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
