"use client";

import UserLayout from "@/components/users/userLayout";
import ChangePassword from "./changePassword";

const ChangePasswordPage = () => {
  return (
    <UserLayout >
        <ChangePassword /> {/* This should render your ChangePassword form */}
    </UserLayout>
  );
};

export default ChangePasswordPage;
