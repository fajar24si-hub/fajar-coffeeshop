// src/pages/admin/Menu.jsx
import AdminPageHeader from "../../components/admin/ui/AdminPageHeader";
import ComingSoonCard  from "../../components/admin/ui/ComingSoonCard";

export default function Menu() {
  return (
    <div>
      <AdminPageHeader emoji="☕" title="Menu Management" />
      <ComingSoonCard message="Menu management features coming soon..." />
    </div>
  );
}
