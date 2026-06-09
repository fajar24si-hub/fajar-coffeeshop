// src/components/ui/tabs.jsx
// Komponen 2: Tabs - menggunakan @radix-ui/react-tabs
import * as TabsPrimitive from "@radix-ui/react-tabs";

// ── Root ─────────────────────────────────────────────────────────
export const Tabs = TabsPrimitive.Root;

// ── List (Tab Header) ─────────────────────────────────────────────
export function TabsList({ children, style, ...props }) {
  return (
    <TabsPrimitive.List
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: "#F5F3F0",
        borderRadius: 12,
        padding: 4,
        gap: 4,
        ...style,
      }}
      {...props}
    >
      {children}
    </TabsPrimitive.List>
  );
}

// ── Trigger (Tab Button) ──────────────────────────────────────────
export function TabsTrigger({ children, style, ...props }) {
  return (
    <TabsPrimitive.Trigger
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        justifyContent: "center",
        padding: "8px 18px",
        borderRadius: 10,
        border: "none",
        background: "transparent",
        color: "#9A8478",
        fontWeight: 600,
        fontSize: "0.85rem",
        cursor: "pointer",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!e.currentTarget.getAttribute("data-state") === "active") {
          e.currentTarget.style.background = "#EAE6E1";
        }
      }}
      onMouseLeave={(e) => {
        if (e.currentTarget.getAttribute("data-state") !== "active") {
          e.currentTarget.style.background = "transparent";
        }
      }}
      {...props}
    >
      {children}

      {/* Active state styling via CSS */}
      <style>{`
        [data-radix-collection-item][data-state="active"] {
          background: #FFFFFF !important;
          color: #2D1B0E !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10);
        }
        [data-radix-collection-item][data-state="inactive"]:hover {
          background: #EAE6E1 !important;
          color: #6B5F52 !important;
        }
      `}</style>
    </TabsPrimitive.Trigger>
  );
}

// ── Content (Tab Panel) ───────────────────────────────────────────
export function TabsContent({ children, style, ...props }) {
  return (
    <TabsPrimitive.Content
      style={{
        marginTop: 20,
        outline: "none",
        animation: "tabFadeIn 0.25s ease",
        ...style,
      }}
      {...props}
    >
      {children}
      <style>{`
        @keyframes tabFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </TabsPrimitive.Content>
  );
}
