"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    const isLoginPage = pathname === "/login";

    // If no token and not on login page, redirect to login
    if (!token && !isLoginPage) {
      router.push("/login");
    }
    // If token exists and on login page, redirect to home
    else if (token && isLoginPage) {
      router.push("/");
    }
  }, [pathname, router, token]);

  return <>{children}</>;
}
