import { NavLink, Outlet } from "react-router-dom";
import {
  UploadIcon,
  ChartLineIcon,
  ListBulletsIcon,
  GearIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center">
            <h1 className="text-xl font-bold text-foreground">FinTrack</h1>
            <p className="ml-3 text-sm text-muted-foreground">
              Financial Tracker
            </p>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            <NavLink
              to="/upload"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                  "border-b-2 -mb-px",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                )
              }
            >
              <UploadIcon className="size-4" />
              Upload
            </NavLink>

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                  "border-b-2 -mb-px",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                )
              }
            >
              <ChartLineIcon className="size-4" />
              Dashboard
            </NavLink>

            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                  "border-b-2 -mb-px",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                )
              }
            >
              <ListBulletsIcon className="size-4" />
              Transactions
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                  "border-b-2 -mb-px",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                )
              }
            >
              <GearIcon className="size-4" />
              Settings
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
