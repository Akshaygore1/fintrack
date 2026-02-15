import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/hooks/use-theme";
import { AppLayout } from "@/components/layout/AppLayout";
import { storage } from "@/lib/storage";
import { useEffect, lazy, Suspense } from "react";
import { PageSkeleton } from "@/components/ui/PageSkeleton";

// Lazy load all page components for code splitting
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const UploadPage = lazy(() => import("@/pages/UploadPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const TransactionsPage = lazy(() => import("@/pages/TransactionsPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));

export function App() {

  useEffect(() => {
    storage.init();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "var(--color-card)",
              color: "var(--color-card-foreground)",
              border: "1px solid var(--color-border)",
            },
          }}
        />
        <Routes>
          {/* Public landing page */}
          <Route 
            path="/" 
            element={
              <Suspense fallback={<PageSkeleton />}>
                <LandingPage />
              </Suspense>
            } 
          />
          
          {/* App routes with sidebar layout */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/upload" replace />} />
            <Route 
              path="upload" 
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <UploadPage />
                </Suspense>
              } 
            />
            <Route 
              path="dashboard" 
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <DashboardPage />
                </Suspense>
              } 
            />
            <Route 
              path="transactions" 
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <TransactionsPage />
                </Suspense>
              } 
            />
            <Route 
              path="settings" 
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <SettingsPage />
                </Suspense>
              } 
            />
          </Route>

          {/* Redirect old routes to new /app/* routes */}
          <Route path="/upload" element={<Navigate to="/app/upload" replace />} />
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/transactions" element={<Navigate to="/app/transactions" replace />} />
          <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
