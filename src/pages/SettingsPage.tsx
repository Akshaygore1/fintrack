import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { 
  DownloadSimple, 
  Trash, 
  Warning, 
  Gear, 
  Database,
  Export,
  ShieldWarning,
  Tag,
  HardDrives,
  CurrencyDollar
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CategoryManager } from "@/components/settings/CategoryManager";
import { storage } from "@/lib/storage";
import type { Category, AppSettings } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoadingState() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-8 w-48 skeleton-shimmer rounded-lg" />
      <div className="h-64 skeleton-shimmer rounded-xl" />
      <div className="h-48 skeleton-shimmer rounded-xl" />
    </div>
  );
}

function SettingsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactionCount, setTransactionCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [tempExchangeRate, setTempExchangeRate] = useState("85");

  useEffect(() => {
    storage.init();
    const loadedSettings = storage.getSettings();
    setCategories(storage.getCategories());
    setTransactionCount(storage.getTransactionCount());
    setSettings(loadedSettings);
    setTempExchangeRate((loadedSettings.exchangeRate || 85).toString());
    setIsLoading(false);
  }, []);

  const handleAddCategory = (data: { name: string; keywords: string[]; color: string }) => {
    try {
      if (categories.some((c) => c.name.toLowerCase() === data.name.toLowerCase())) {
        toast.error("A category with this name already exists");
        return;
      }

      storage.addCategory({
        name: data.name,
        keywords: data.keywords,
        color: data.color,
        isCustom: true,
        isActive: true,
      });
      setCategories(storage.getCategories());
      toast.success("Category added");
    } catch {
      toast.error("Failed to add category");
    }
  };

  const handleUpdateCategory = (
    id: string,
    data: { name: string; keywords: string[]; color: string }
  ) => {
    try {
      storage.updateCategory(id, {
        keywords: data.keywords,
        color: data.color,
      });
      setCategories(storage.getCategories());
      toast.success("Category updated");
    } catch {
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm("Delete this category? Transactions will be moved to 'Other'.")) {
      try {
        storage.deleteCategory(id);
        setCategories(storage.getCategories());
        toast.success("Category deleted");
      } catch {
        toast.error("Failed to delete category");
      }
    }
  };

  const handleResetCategories = () => {
    try {
      storage.resetCategories();
      setCategories(storage.getCategories());
      toast.success("Categories reset to defaults");
    } catch {
      toast.error("Failed to reset categories");
    }
  };

  const handleExportCSV = () => {
    try {
      const csv = storage.exportTransactionsCSV();
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fintrack-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Transactions exported");
    } catch {
      toast.error("Failed to export transactions");
    }
  };

  const handleClearTransactions = () => {
    if (
      window.confirm(
        `Are you sure you want to delete all ${transactionCount} transactions? This cannot be undone.`
      )
    ) {
      try {
        storage.clearAllTransactions();
        setTransactionCount(0);
        toast.success("All transactions cleared");
      } catch {
        toast.error("Failed to clear transactions");
      }
    }
  };

  const handleClearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear ALL data? This will delete transactions, custom categories, and reset settings. This cannot be undone."
      )
    ) {
      try {
        storage.clearAllData();
        setCategories(storage.getCategories());
        setTransactionCount(0);
        toast.success("All data cleared");
      } catch {
        toast.error("Failed to clear data");
      }
    }
  };

  const handleCurrencyChange = (currency: "INR" | "USD") => {
    if (!settings) return;
    try {
      storage.updateSettings({ currency });
      setSettings({ ...settings, currency });
      toast.success(`Currency changed to ${currency}`);
    } catch {
      toast.error("Failed to update currency");
    }
  };

  const handleExchangeRateUpdate = () => {
    if (!settings) return;
    const rate = parseFloat(tempExchangeRate);
    if (isNaN(rate) || rate <= 0) {
      toast.error("Please enter a valid exchange rate");
      return;
    }
    try {
      storage.updateSettings({ exchangeRate: rate });
      setSettings({ ...settings, exchangeRate: rate });
      toast.success("Exchange rate updated");
    } catch {
      toast.error("Failed to update exchange rate");
    }
  };

  if (isLoading || !settings) {
    return <LoadingState />;
  }

  // Calculate storage usage
  const storagePercentage = (transactionCount / 5000) * 100;
  const isNearLimit = storage.isNearLimit();

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center">
          <Gear size={22} weight="duotone" className="text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage categories and your data
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div>
        <CategoryManager
          categories={categories}
          onAddCategory={handleAddCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
          onResetCategories={handleResetCategories}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Currency Settings Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CurrencyDollar size={18} weight="duotone" className="text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Currency Settings</h2>
        </div>

        <Card variant="glass" className="group hover:border-primary/30 transition-colors">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <CurrencyDollar size={16} className="text-primary" />
              </div>
              Display Currency
            </CardTitle>
            <CardDescription>
              Choose between USD and INR for displaying amounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={settings.currency === "INR" ? "default" : "outline"}
                onClick={() => handleCurrencyChange("INR")}
                className="flex-1"
              >
                INR (₹)
              </Button>
              <Button
                variant={settings.currency === "USD" ? "default" : "outline"}
                onClick={() => handleCurrencyChange("USD")}
                className="flex-1"
              >
                USD ($)
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exchange-rate" className="text-sm font-medium">
                Exchange Rate (1 USD = ? INR)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="exchange-rate"
                  type="number"
                  value={tempExchangeRate}
                  onChange={(e) => setTempExchangeRate(e.target.value)}
                  placeholder="85"
                  step="0.01"
                  min="0"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={handleExchangeRateUpdate}
                >
                  Update
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Current rate: 1 USD = ₹{settings.exchangeRate}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Data Management Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Database size={18} weight="duotone" className="text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Data Management</h2>
        </div>

        {/* Export Card */}
        <Card variant="glass" className="group hover:border-primary/30 transition-colors">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Export size={16} className="text-primary" />
              </div>
              Export Data
            </CardTitle>
            <CardDescription>
              Download all your transactions as a CSV file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={transactionCount === 0}
              className="gap-2"
            >
              <DownloadSimple size={18} weight="bold" />
              Export {transactionCount.toLocaleString()} Transactions
            </Button>
          </CardContent>
        </Card>

        {/* Clear Transactions Card */}
        <Card variant="glass" className="border-expense/20 hover:border-expense/40 transition-colors">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-expense/10 flex items-center justify-center">
                <Warning size={16} className="text-expense" />
              </div>
              Clear Transactions
            </CardTitle>
            <CardDescription>
              Delete all transactions but keep categories and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={handleClearTransactions}
              disabled={transactionCount === 0}
              className="gap-2 text-expense border-expense/30 hover:bg-expense/10 hover:border-expense/50"
            >
              <Trash size={18} weight="bold" />
              Clear All Transactions
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone Card */}
        <Card variant="glass" className="border-destructive/30 hover:border-destructive/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-destructive">
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <ShieldWarning size={16} className="text-destructive" />
              </div>
              Danger Zone
            </CardTitle>
            <CardDescription>
              Permanently delete all data including transactions, custom categories, and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={handleClearAllData}
              className="gap-2"
            >
              <Trash size={18} weight="bold" />
              Clear All Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Storage Info Card */}
      <div>
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <HardDrives size={18} weight="duotone" className="text-muted-foreground" />
              Storage Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="h-2.5 bg-muted/50 rounded-full overflow-hidden border border-border/30">
                <div
                  className={`h-full rounded-full transition-colors ${
                    isNearLimit ? "bg-expense" : "bg-primary"
                  }`}
                  style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  <span className="font-mono font-semibold text-foreground">
                    {transactionCount.toLocaleString()}
                  </span> of 5,000 transactions
                </span>
                <span className={`font-mono font-medium ${isNearLimit ? "text-expense" : "text-muted-foreground"}`}>
                  {storagePercentage.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Database size={14} />
                  <span className="text-xs">Transactions</span>
                </div>
                <p className="font-mono font-semibold text-foreground">
                  {transactionCount.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Tag size={14} />
                  <span className="text-xs">Categories</span>
                </div>
                <p className="font-mono font-semibold text-foreground">
                  {categories.length}
                </p>
              </div>
            </div>

            {/* Warning if near limit */}
            {isNearLimit && (
              <div className="p-3 rounded-xl bg-expense/10 border border-expense/20 text-sm text-expense flex items-start gap-2">
                <Warning size={18} weight="fill" className="flex-shrink-0 mt-0.5" />
                <span>
                  You're approaching the storage limit. Consider exporting and clearing old transactions.
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SettingsPage;
