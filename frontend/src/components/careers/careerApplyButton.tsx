"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/Store/userStore";

export default function CareerApplyButton({ slug }: { slug: string }) {
  const router = useRouter();
  const { isLoggedIn, isHydrated } = useUserStore();
  const applyPath = `/careers/${slug}/apply`;

  const handleApply = () => {
    if (!isLoggedIn) {
      sessionStorage.setItem("redirectAfterLogin", applyPath);
      router.push("/user/auth/logIn");
      return;
    }
    router.push(applyPath);
  };

  return <button type="button" disabled={!isHydrated} onClick={handleApply} className="mt-7 w-full rounded-lg bg-[#fd4c00] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a50d26] disabled:cursor-not-allowed disabled:opacity-60">{isHydrated ? "Apply Now" : "Loading..."}</button>;
}
