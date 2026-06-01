// src/pages/admin/Customers.jsx
import AdminPageHeader from "../../components/admin/ui/AdminPageHeader";
import ComingSoonCard  from "../../components/admin/ui/ComingSoonCard";

export default function Customers() {
  return (
    <div>
      <AdminPageHeader emoji="👥" title="Customers Management" />
      <ComingSoonCard message="Customer management features coming soon..." />
    </div>
  );
}
