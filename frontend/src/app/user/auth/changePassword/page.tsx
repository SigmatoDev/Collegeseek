"use client";

import UserLayout from "@/components/users/userLayout";
import ChangePassword from "./changePassword";

const ChangePasswordPage = () => {
  return (
    <UserLayout>
      <div>
        <ChangePassword /> {/* This should render your ChangePassword form */}
      </div>
    </UserLayout>
  );
};

export default ChangePasswordPage;
