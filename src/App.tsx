import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/hooks/use-theme";
import { AppLayout } from "@/components/layout/AppLayout";
import { LandingPage } from "@/pages/LandingPage";
import { UploadPage } from "@/pages/UploadPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { TransactionsPage } from "@/pages/TransactionsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { storage } from "@/lib/storage";
import { useEffect } from "react";

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
          <Route path="/" element={<LandingPage />} />
          
          {/* App routes with sidebar layout */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/upload" replace />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="settings" element={<SettingsPage />} />
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
