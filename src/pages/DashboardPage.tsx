import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { UploadSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { CategoryDonutChart } from "@/components/dashboard/CategoryDonutChart";
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart";
import { IncomeVsExpenseChart } from "@/components/dashboard/IncomeVsExpenseChart";
import { TopMerchantsChart } from "@/components/dashboard/TopMerchantsChart";
import { CategoryTrendsChart } from "@/components/dashboard/CategoryTrendsChart";
import { storage } from "@/lib/storage";
import { formatMonthYear } from "@/lib/dateHelpers";
import type { Transaction, Category, CategorySummary, MerchantSummary, MonthlyData } from "@/types";

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

  // Calculate summary data
  const summaryData = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const netAmount = totalIncome - totalExpenses;

    // Get the most recent balance
    const sortedByDate = [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const currentBalance = sortedByDate[0]?.balance || 0;

    return { totalIncome, totalExpenses, netAmount, currentBalance };
  }, [transactions]);

  // Calculate category summary (expenses only)
  const categorySummary = useMemo((): CategorySummary[] => {
    const expenseTransactions = transactions.filter((t) => t.type === "expense");
    const totalExpenses = expenseTransactions.reduce(
      (sum, t) => sum + Math.abs(t.amount),
      0
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

  // Calculate merchant summary (expenses only)
  const merchantSummary = useMemo((): MerchantSummary[] => {
    const expenseTransactions = transactions.filter((t) => t.type === "expense");
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

  // Calculate monthly data
  const monthlyData = useMemo((): MonthlyData[] => {
    const monthMap = new Map<string, { income: number; expenses: number }>();

    transactions.forEach((t) => {
      const month = formatMonthYear(t.date);
      const existing = monthMap.get(month) || { income: 0, expenses: 0 };

      if (t.type === "income") {
        existing.income += Math.abs(t.amount);
      } else {
        existing.expenses += Math.abs(t.amount);
      }

      monthMap.set(month, existing);
    });

    // Sort by date
    const sortedMonths = Array.from(monthMap.keys()).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });

    return sortedMonths.map((month) => {
      const data = monthMap.get(month)!;
      return {
        month,
        income: data.income,
        expenses: data.expenses,
        net: data.income - data.expenses,
      };
    });
  }, [transactions]);

  // Calculate category trends data
  const categoryTrendsData = useMemo(() => {
    // Get top categories by total spending
    const topCategories = categorySummary
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map((c) => c.category);

    const monthMap = new Map<string, Record<string, number>>();

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const month = formatMonthYear(t.date);
        const existing = monthMap.get(month) || {};
        existing[t.category] = (existing[t.category] || 0) + Math.abs(t.amount);
        monthMap.set(month, existing);
      });

    // Sort by date
    const sortedMonths = Array.from(monthMap.keys()).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });

    return {
      data: sortedMonths.map((month) => ({
        month,
        ...monthMap.get(month),
      })),
      categories: topCategories,
    };
  }, [transactions, categorySummary]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-80 bg-muted" />
            <div className="h-80 bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="text-center py-12 border border-dashed border-border">
          <p className="text-muted-foreground mb-4">No transactions to analyze</p>
          <Button onClick={() => navigate("/")}>
            <UploadSimple size={18} className="mr-2" />
            Upload CSV
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          {transactions.length.toLocaleString()} transactions
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards
        totalIncome={summaryData.totalIncome}
        totalExpenses={summaryData.totalExpenses}
        netAmount={summaryData.netAmount}
        currentBalance={summaryData.currentBalance}
      />

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryDonutChart data={categorySummary} />
        <TopMerchantsChart data={merchantSummary} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyTrendChart data={monthlyData} />
        <IncomeVsExpenseChart data={monthlyData} />
      </div>

      {/* Full Width Chart */}
      <CategoryTrendsChart
        data={categoryTrendsData.data}
        categories={categoryTrendsData.categories}
      />
    </div>
  );
}
