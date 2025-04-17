"use client";

import UserLayout from "@/components/users/userLayout";
import ShortListColleges from "./shortlisted";

const ShortlistedPage = () => {
  return (
    <UserLayout>
      <div>
        <ShortListColleges />
      </div>
    </UserLayout>
  );
};

export default ShortlistedPage;
