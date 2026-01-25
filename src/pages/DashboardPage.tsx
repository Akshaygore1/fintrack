import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { UploadSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { CategoryDonutChart } from "@/components/dashboard/CategoryDonutChart";
import { TopMerchantsChart } from "@/components/dashboard/TopMerchantsChart";
import { TopIncomeChart } from "@/components/dashboard/TopIncomeChart";
import { SpendingGradientChart } from "@/components/dashboard/SpendingGradientChart";
import { storage } from "@/lib/storage";
import type {
  Transaction,
  Category,
  CategorySummary,
  MerchantSummary,
} from "@/types";

export function DashboardPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    storage.init();
    setTransactions(storage.getTransactions());
    setCategories(storage.getCategories());
    setIsLoading(false);
  }, []);

  // Calculate category summary (expenses only)
  const categorySummary = useMemo((): CategorySummary[] => {
    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense",
    );
    const totalExpenses = expenseTransactions.reduce(
      (sum, t) => sum + Math.abs(t.amount),
      0,
    );

    const categoryMap = new Map<string, { total: number; count: number }>();

    expenseTransactions.forEach((t) => {
      const existing = categoryMap.get(t.category) || { total: 0, count: 0 };
      categoryMap.set(t.category, {
        total: existing.total + Math.abs(t.amount),
        count: existing.count + 1,
      });
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => {
      const cat = categories.find((c) => c.name === category);
      return {
        category,
        total: data.total,
        count: data.count,
        percentage: totalExpenses > 0 ? (data.total / totalExpenses) * 100 : 0,
        color: cat?.color || "slate",
      };
    });
  }, [transactions, categories]);

  // Calculate merchant summary (expenses only) - For Top Spendings
  const merchantSummary = useMemo((): MerchantSummary[] => {
    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense",
    );
    const merchantMap = new Map<string, { total: number; count: number }>();

    expenseTransactions.forEach((t) => {
      const merchant = t.merchant || "Unknown";
      const existing = merchantMap.get(merchant) || { total: 0, count: 0 };
      merchantMap.set(merchant, {
        total: existing.total + Math.abs(t.amount),
        count: existing.count + 1,
      });
    });

    return Array.from(merchantMap.entries()).map(([merchant, data]) => ({
      merchant,
      total: data.total,
      count: data.count,
      avgTransaction: data.total / data.count,
    }));
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-muted rounded-xl" />
            <div className="h-80 bg-muted rounded-xl" />
            <div className="h-80 bg-muted rounded-xl" />
            <div className="h-80 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground mb-4">
            No transactions to analyze
          </p>
          <Button onClick={() => navigate("/")}>
            <UploadSimple size={18} className="mr-2" />
            Upload CSV
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold tracking-tight py-4">
          Financial Overview
        </h1>
        <div className="text-sm text-muted-foreground font-medium bg-secondary/50 px-3 py-1 rounded-full">
          {transactions.length.toLocaleString()} transactions analyzed
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Spending */}
        <CategoryDonutChart data={categorySummary} />

        {/* Spending Trend (Gradient Graph) */}
        <SpendingGradientChart transactions={transactions} />
        {/* Top Income */}

        <TopIncomeChart transactions={transactions} />
        {/* Top Spendings */}

        <TopMerchantsChart data={merchantSummary} />
      </div>
    </div>
  );
}
