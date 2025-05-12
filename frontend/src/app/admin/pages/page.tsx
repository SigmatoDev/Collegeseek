import AdminLayout from "@/components/admin/adminLayout";

import AdminPages from "./cp";


const AdminCreatePage = () => {
  return (
    <AdminLayout>
      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Manage Courses</h1> */}
        <AdminPages />
      </div>
    </AdminLayout>
  );
};

export default AdminCreatePage;
