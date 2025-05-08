import AdminLayout from "@/components/admin/adminLayout";
import EditPage from "./edit";
import Edit from "./edit";


const AdminEditPage = () => {
  return (
    <AdminLayout>
      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Manage Courses</h1> */}
        <Edit />
      </div>
    </AdminLayout>
  );
};

export default AdminEditPage;
