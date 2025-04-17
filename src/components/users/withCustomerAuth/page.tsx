"use client";

import { useUserStore } from "@/Store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withUserAuth = <P extends { children: React.ReactNode }>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function UserAuthWrapper(props: P) {
    const router = useRouter();
    const { isLoggedIn } = useUserStore(state => state); // Get logged-in status from the user store

    useEffect(() => {
      if (!isLoggedIn) {
        router.push("/user/auth/logIn"); // Redirect to login page if the user is not logged in
      }
    }, [isLoggedIn, router]);

    // If the user is logged in, render the WrappedComponent
    if (!isLoggedIn) {
      return null; // Optionally, you could display a loading indicator while redirecting
    }

    return <WrappedComponent {...props} />;
  };
};

export default withUserAuth;
