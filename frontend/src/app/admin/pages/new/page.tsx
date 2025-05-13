import AdminLayout from "@/components/admin/adminLayout";
import Create from "./create";




const AdminCreatePage = () => {
  return (
    <AdminLayout>
      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Manage Courses</h1> */}
        <Create />
      </div>
    </AdminLayout>
  );
};

export default AdminCreatePage;