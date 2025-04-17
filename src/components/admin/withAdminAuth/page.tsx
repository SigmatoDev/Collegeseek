"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withAdminAuth = <P extends { children: React.ReactNode }>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function AdminAuthWrapper(props: P) {
    const router = useRouter();

    useEffect(() => {
      try {
        const sessionData = sessionStorage.getItem("admin_store");
        const state = sessionData ? JSON.parse(sessionData).state : null;

        if (!state?.isLoggedIn || !state?.admin) {
          router.push("/admin/auth/logIn");
        }
      } catch {
        router.push("/admin/auth/logIn");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;
