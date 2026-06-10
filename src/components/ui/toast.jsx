// src/components/ui/toast.jsx
// Komponen 1: Toast - menggunakan @radix-ui/react-toast
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";

// ── Provider ─────────────────────────────────────────────────────
export function ToastProvider({ children }) {
  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {children}
      <ToastViewport />
    </ToastPrimitive.Provider>
  );
}

// ── Viewport ─────────────────────────────────────────────────────
function ToastViewport() {
  return (
    <ToastPrimitive.Viewport
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: 360,
        maxWidth: "100vw",
        margin: 0,
        padding: 0,
        listStyle: "none",
        zIndex: 9999,
        outline: "none",
      }}
    />
  );
}

// ── Toast Root ───────────────────────────────────────────────────
const VARIANT_STYLES = {
  default: {
    background: "#FFFFFF",
    borderLeft: "4px solid #5B4FCF",
    color: "#2D1B0E",
    iconColor: "#5B4FCF",
  },
  success: {
    background: "#FFFFFF",
    borderLeft: "4px solid #27AE60",
    color: "#2D1B0E",
    iconColor: "#27AE60",
  },
  error: {
    background: "#FFFFFF",
    borderLeft: "4px solid #E74C3C",
    color: "#2D1B0E",
    iconColor: "#E74C3C",
  },
  warning: {
    background: "#FFFFFF",
    borderLeft: "4px solid #F59E0B",
    color: "#2D1B0E",
    iconColor: "#F59E0B",
  },
};

export function Toast({ title, description, variant = "default", open, onOpenChange }) {
  const s = VARIANT_STYLES[variant] ?? VARIANT_STYLES.default;

  return (
    <ToastPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      duration={4000}
      style={{
        background: s.background,
        borderRadius: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
        padding: "14px 16px",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        borderLeft: s.borderLeft,
        position: "relative",
        animation: "toast-slide-in 0.3s ease, toast-fade-out 0.3s ease var(--radix-toast-swipe-end-x, 3.7s)",
      }}
    >
      {/* Dot indicator */}
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: s.iconColor,
          flexShrink: 0,
          marginTop: 5,
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <ToastPrimitive.Title
            style={{
              fontWeight: 700,
              fontSize: "0.88rem",
              color: s.color,
              marginBottom: description ? 3 : 0,
              lineHeight: 1.3,
            }}
          >
            {title}
          </ToastPrimitive.Title>
        )}
        {description && (
          <ToastPrimitive.Description
            style={{
              fontSize: "0.80rem",
              color: "#9A8478",
              lineHeight: 1.4,
            }}
          >
            {description}
          </ToastPrimitive.Description>
        )}
      </div>

      {/* Close button */}
      <ToastPrimitive.Close
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#C4B8B0",
          padding: 2,
          display: "flex",
          alignItems: "center",
          borderRadius: 4,
          flexShrink: 0,
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#6B5F52"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#C4B8B0"; }}
        aria-label="Tutup notifikasi"
      >
        <X size={14} />
      </ToastPrimitive.Close>

      <style>{`
        @keyframes toast-slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </ToastPrimitive.Root>
  );
}

// ── Hook useToast ─────────────────────────────────────────────────
import { useState, useCallback } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = "default" }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, description, variant, open: true }]);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, open: false } : t))
    );
  }, []);

  return { toasts, toast, dismiss };
}
