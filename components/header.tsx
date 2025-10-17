import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-card px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 ml-12 lg:ml-0">
        <div className="relative flex flex-1 items-center">
          {/* Search bar can be added here if needed */}
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
