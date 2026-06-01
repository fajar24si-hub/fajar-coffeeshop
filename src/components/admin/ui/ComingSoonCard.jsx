// src/components/admin/ui/ComingSoonCard.jsx
import AdminCard from "./AdminCard";

export default function ComingSoonCard({ message = "Features coming soon..." }) {
  return (
    <AdminCard style={{ padding: 40, textAlign: "center" }}>
      <p style={{ margin: 0, color: "#9D8B74", fontSize: "1rem" }}>
        {message}
      </p>
    </AdminCard>
  );
}
