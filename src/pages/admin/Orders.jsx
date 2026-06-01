// src/pages/admin/Orders.jsx
import AdminPageHeader from "../../components/admin/ui/AdminPageHeader";
import ComingSoonCard  from "../../components/admin/ui/ComingSoonCard";

export default function Orders() {
  return (
    <div>
      <AdminPageHeader emoji="📦" title="Orders Management" />
      <ComingSoonCard message="Order management features coming soon..." />
    </div>
  );
}
