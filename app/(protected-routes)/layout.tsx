import AdminHeader from "@/components/header";
import AdminSidebar from "@/components/sidebar";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-background lg:ml-64">
          <div className="py-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<div>Loading...</div>}>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
