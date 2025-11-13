"use client";

import { useUserStore } from "@/Store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const withUserAuth = <P extends { children: React.ReactNode }>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function UserAuthWrapper(props: P) {
    const router = useRouter();
    const { isLoggedIn } = useUserStore((state) => state);
    const [hydrated, setHydrated] = useState(false);

    // Wait for Zustand to rehydrate from localStorage
    useEffect(() => {
      setHydrated(true);
    }, []);

    // Redirect only after hydration
    useEffect(() => {
      if (hydrated && !isLoggedIn) {
        router.replace("/user/auth/logIn");
      }
    }, [hydrated, isLoggedIn, router]);

    // Wait until hydration is complete
    if (!hydrated) {
      return (
        <div className="flex items-center justify-center min-h-screen text-gray-600">
          Loading...
        </div>
      );
    }

    // Show nothing if redirecting
    if (!isLoggedIn) {
      return null;
    }

    // Render component when logged in
    return <WrappedComponent {...props} />;
  };
};

export default withUserAuth;
