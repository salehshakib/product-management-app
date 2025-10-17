"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isLoginPage = pathname === "/login";

    // If no token and not on login page, redirect to login
    if (!token && !isLoginPage) {
      router.push("/login");
    }
    // If token exists and on login page, redirect to home
    else if (token && isLoginPage) {
      router.push("/");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
