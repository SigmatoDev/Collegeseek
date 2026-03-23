"use client";

import { useUserStore } from "@/Store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withUserAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function UserAuthWrapper(props: P) {
    const router = useRouter();

    const { isLoggedIn, isHydrated } = useUserStore((state) => ({
      isLoggedIn: state.isLoggedIn,
      isHydrated: state.isHydrated,
    }));

    // ✅ Redirect after hydration
    useEffect(() => {
      if (isHydrated && !isLoggedIn) {
        router.replace("/user/auth/logIn");
      }
    }, [isHydrated, isLoggedIn, router]);

    // ✅ Wait for hydration
    if (!isHydrated) {
      return (
        <div className="flex items-center justify-center min-h-screen text-gray-600">
          Loading...
        </div>
      );
    }

    // ✅ Prevent flicker
    if (!isLoggedIn) return null;

    return <WrappedComponent {...props} />;
  };
};

export default withUserAuth;