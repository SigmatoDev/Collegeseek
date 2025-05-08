import AdminLayout from "@/components/admin/adminLayout";
import CreatePage from "./cp";
import Pages from "./cp";


const AdminCreatePage = () => {
  return (
    <AdminLayout>
      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Manage Courses</h1> */}
        <Pages />
      </div>
    </AdminLayout>
  );
};

export default AdminCreatePage;
