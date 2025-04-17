"use client";

import UserLayout from "@/components/users/userLayout";
import UserProfile from "./profile";

const UserProfilePage = () => {
  return (
    <UserLayout>
      <div>
        <UserProfile />
      </div>
    </UserLayout>
  );
};

export default UserProfilePage;
