"use client";

import ChangePassword from "@/app/admin/changePassword/changePassword";
import UserLayout from "@/components/users/userLayout";

const ChangePasswordpage = () => {
  return (
    <UserLayout>
      <div>
        <ChangePassword />
      </div>
    </UserLayout>
  );
};

export default ChangePasswordpage;
