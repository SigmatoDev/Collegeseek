import AdminLayout from "@/components/admin/adminLayout";
import EditPage from "./edit";



const AdminCreatePage = () => {
  return (
    <AdminLayout>
      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Manage Courses</h1> */}
        <EditPage />
      </div>
    </AdminLayout>
  );
};

export default AdminCreatePage;
