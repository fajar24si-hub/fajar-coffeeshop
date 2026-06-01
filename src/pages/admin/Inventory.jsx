// src/pages/admin/Inventory.jsx
import AdminPageHeader from "../../components/admin/ui/AdminPageHeader";
import ComingSoonCard  from "../../components/admin/ui/ComingSoonCard";

export default function Inventory() {
  return (
    <div>
      <AdminPageHeader emoji="📦" title="Inventory Management" />
      <ComingSoonCard message="Inventory management features coming soon..." />
    </div>
  );
}
