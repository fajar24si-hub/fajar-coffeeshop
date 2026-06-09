// src/components/ui/progress.jsx
// Komponen 3: Progress - menggunakan @radix-ui/react-progress
import * as ProgressPrimitive from "@radix-ui/react-progress";

/**
 * Progress bar berbasis Radix UI
 *
 * @param {object}  props
 * @param {number}  props.value       – 0..100
 * @param {string}  [props.color]     – warna fill, default sesuai tier
 * @param {string}  [props.tier]      – "Gold" | "Silver" | "Bronze" (untuk warna otomatis)
 * @param {number}  [props.height]    – tinggi bar dalam px, default 8
 * @param {boolean} [props.animated]  – animasi shimmer
 */
export function Progress({ value = 0, color, tier, height = 8, animated = true, style, ...props }) {
  const fillColor = color ?? getTierColor(tier);
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <ProgressPrimitive.Root
      value={safeValue}
      max={100}
      style={{
        position: "relative",
        height,
        width: "100%",
        overflow: "hidden",
        borderRadius: height * 2,
        background: "#E8E4E0",
        ...style,
      }}
      {...props}
    >
      <ProgressPrimitive.Indicator
        style={{
          height: "100%",
          width: `${safeValue}%`,
          borderRadius: "inherit",
          background: `linear-gradient(90deg, ${fillColor}99, ${fillColor})`,
          transition: "width 0.7s cubic-bezier(0.65, 0, 0.35, 1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Shimmer effect */}
        {animated && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "60%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              animation: "progress-shimmer 2s infinite",
            }}
          />
        )}
      </ProgressPrimitive.Indicator>

      <style>{`
        @keyframes progress-shimmer {
          0%   { left: -60%; }
          100% { left: 120%; }
        }
      `}</style>
    </ProgressPrimitive.Root>
  );
}

// ── Helper ────────────────────────────────────────────────────────
function getTierColor(tier) {
  switch (tier) {
    case "Gold":   return "#F59E0B";
    case "Silver": return "#94A3B8";
    case "Bronze": return "#EA580C";
    default:       return "#5B4FCF";
  }
}

/**
 * Progress dengan label (untuk loyalty)
 */
export function LoyaltyProgress({ points, tier, showLabel = true }) {
  const thresholds = { Bronze: 0, Silver: 1000, Gold: 2500, Max: 5000 };
  const nextTierMap = { Bronze: "Silver", Silver: "Gold", Gold: "Max" };

  const current = thresholds[tier] ?? 0;
  const nextLabel = nextTierMap[tier] ?? "Max";
  const nextRequired = thresholds[nextLabel] ?? 5000;
  const pct = Math.min(((points - current) / (nextRequired - current)) * 100, 100);

  return (
    <div style={{ width: "100%" }}>
      <Progress value={pct} tier={tier} height={10} />
      {showLabel && (
        <p
          style={{
            margin: "6px 0 0 0",
            fontSize: "0.74rem",
            color: "#9A8478",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>
            {(points - current).toLocaleString("id-ID")} /{" "}
            {(nextRequired - current).toLocaleString("id-ID")} poin
          </span>
          <span style={{ fontWeight: 600 }}>→ {nextLabel}</span>
        </p>
      )}
    </div>
  );
}
