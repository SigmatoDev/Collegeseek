"use client";

import UserLayout from "@/components/users/userLayout";
import { useUserStore } from "@/Store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ChangePassword from "./changePassword";

const ChangePasswordPage = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const isHydrated = useUserStore((state) => state.isHydrated);

  useEffect(() => {
    if (isHydrated && user?.authProvider === "google") {
      router.replace("/user/profile");
    }
  }, [isHydrated, router, user?.authProvider]);

  if (!isHydrated || user?.authProvider === "google") {
    return null;
  }

  return (
    <UserLayout>
      <ChangePassword />
    </UserLayout>
  );
};

export default ChangePasswordPage;
