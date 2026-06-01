// src/pages/admin/Settings.jsx
import AdminPageHeader from "../../components/admin/ui/AdminPageHeader";
import ComingSoonCard  from "../../components/admin/ui/ComingSoonCard";

export default function Settings() {
  return (
    <div>
      <AdminPageHeader emoji="⚙️" title="Settings" />
      <ComingSoonCard message="Settings features coming soon..." />
    </div>
  );
}
