// src/pages/admin/Staff.jsx
import AdminPageHeader from "../../components/admin/ui/AdminPageHeader";
import ComingSoonCard  from "../../components/admin/ui/ComingSoonCard";

export default function Staff() {
  return (
    <div>
      <AdminPageHeader emoji="👨‍💼" title="Staff Management" />
      <ComingSoonCard message="Staff management features coming soon..." />
    </div>
  );
}
