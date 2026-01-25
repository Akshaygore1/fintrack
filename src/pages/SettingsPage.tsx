import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { DownloadSimple, Trash, Warning } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CategoryManager } from "@/components/settings/CategoryManager";
import { storage } from "@/lib/storage";
import type { Category } from "@/types";

export function SettingsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactionCount, setTransactionCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    storage.init();
    setCategories(storage.getCategories());
    setTransactionCount(storage.getTransactionCount());
    setIsLoading(false);
  }, []);

  // Category handlers
  const handleAddCategory = (data: { name: string; keywords: string[]; color: string }) => {
    try {
      // Check for duplicate names
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
    } catch (error) {
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
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm("Delete this category? Transactions will be moved to 'Other'.")) {
      try {
        storage.deleteCategory(id);
        setCategories(storage.getCategories());
        toast.success("Category deleted");
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  const handleResetCategories = () => {
    try {
      storage.resetCategories();
      setCategories(storage.getCategories());
      toast.success("Categories reset to defaults");
    } catch (error) {
      toast.error("Failed to reset categories");
    }
  };

  // Data management handlers
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
    } catch (error) {
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
      } catch (error) {
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
      } catch (error) {
        toast.error("Failed to clear data");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted" />
          <div className="h-64 bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Category Management */}
      <CategoryManager
        categories={categories}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
        onResetCategories={handleResetCategories}
      />

      <Separator />

      {/* Data Management */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Data Management</h2>

        {/* Export */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Export Data</CardTitle>
            <CardDescription>
              Download all your transactions as a CSV file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={transactionCount === 0}
            >
              <DownloadSimple size={18} className="mr-2" />
              Export {transactionCount.toLocaleString()} Transactions
            </Button>
          </CardContent>
        </Card>

        {/* Clear Transactions */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Warning size={18} className="text-orange-500" />
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
              className="text-orange-600 border-orange-300 hover:bg-orange-50"
            >
              <Trash size={18} className="mr-2" />
              Clear All Transactions
            </Button>
          </CardContent>
        </Card>

        {/* Clear All Data */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-red-600">
              <Warning size={18} />
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
            >
              <Trash size={18} className="mr-2" />
              Clear All Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Storage Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Storage Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Transactions:</span>
              <span className="ml-2 font-medium">
                {transactionCount.toLocaleString()} / 5,000
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Categories:</span>
              <span className="ml-2 font-medium">{categories.length}</span>
            </div>
          </div>
          {storage.isNearLimit() && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-sm text-yellow-800 dark:text-yellow-200">
              <Warning size={16} className="inline mr-2" />
              You're approaching the storage limit. Consider exporting and clearing old transactions.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
