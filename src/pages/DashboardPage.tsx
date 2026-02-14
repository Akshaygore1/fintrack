import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadSimple,
  TrendUp,
  TrendDown,
  Wallet,
  ArrowRight,
  Sparkle,
  ChartLineUp,
  Receipt,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategoryDonutChart } from "@/components/dashboard/CategoryDonutChart";
import { TopMerchantsChart } from "@/components/dashboard/TopMerchantsChart";
import { TopIncomeChart } from "@/components/dashboard/TopIncomeChart";
import { SpendingGradientChart } from "@/components/dashboard/SpendingGradientChart";
import { AnimatedCurrency } from "@/components/ui/animated-number";
import { storage } from "@/lib/storage";
import type {
  Transaction,
  Category,
  CategorySummary,
  MerchantSummary,
} from "@/types";

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  variant = "default",
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: "up" | "down";
  trendValue?: string;
  variant?: "income" | "expense" | "default";
}) {
  const colorClasses = {
    income: {
      bg: "bg-income/10",
      icon: "text-income",
    },
    expense: {
      bg: "bg-expense/10",
      icon: "text-expense",
    },
    default: {
      bg: "bg-primary/10",
      icon: "text-primary",
    },
  };

  const colors = colorClasses[variant];

  return (
    <div>
      <Card variant="glass" size="none" className="overflow-hidden">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <div className="flex items-baseline gap-2">
                <AnimatedCurrency
                  value={value}
                  compact
                  className={`text-2xl font-bold ${variant === "income" ? "text-income" : variant === "expense" ? "text-expense" : "text-foreground"}`}
                />
                {trend && trendValue && (
                  <span
                    className={`text-xs font-medium flex items-center gap-0.5 ${
                      trend === "up" ? "text-income" : "text-expense"
                    }`}
                  >
                    {trend === "up" ? (
                      <TrendUp size={12} weight="bold" />
                    ) : (
                      <TrendDown size={12} weight="bold" />
                    )}
                    {trendValue}
                  </span>
                )}
              </div>
            </div>
            <div className={`p-2.5 rounded-xl ${colors.bg}`}>
              <Icon size={22} weight="duotone" className={colors.icon} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function HeroBalance({
  balance,
  transactionCount,
}: {
  balance: number;
  transactionCount: number;
}) {
  const isPositive = balance >= 0;

  return (
    <div>
      <Card
        variant="glass"
        size="none"
        className="overflow-hidden border-primary/20"
      >
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Wallet size={20} weight="duotone" className="text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Total Balance
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <AnimatedCurrency
                  value={balance}
                  className={`text-4xl md:text-5xl font-bold tracking-tight ${
                    isPositive ? "text-foreground" : "text-expense"
                  }`}
                />
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    isPositive
                      ? "bg-income/15 text-income"
                      : "bg-expense/15 text-expense"
                  }`}
                >
                  {isPositive ? (
                    <TrendUp size={14} weight="bold" />
                  ) : (
                    <TrendDown size={14} weight="bold" />
                  )}
                  {isPositive ? "Positive" : "Negative"}
                </div>
              </div>

              <p className="text-sm text-muted-foreground pt-1">
                Based on{" "}
                <span className="font-mono font-medium text-foreground">
                  {transactionCount.toLocaleString()}
                </span>{" "}
                transactions
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:block h-16 w-px bg-border/50" />
              <div className="flex flex-col gap-1 text-right">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Status
                </span>
                <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Sparkle size={14} weight="fill" className="text-primary" />
                  All transactions synced
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function EmptyState() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
        <div className="relative w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
          <ChartLineUp size={48} weight="duotone" className="text-primary" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
        No transactions yet
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Start tracking your finances by uploading a CSV file with your bank
        transactions. We'll help you visualize and understand your spending
        patterns.
      </p>

      <Button
        size="lg"
        onClick={() => navigate("/app/upload")}
        className="gap-2 shadow-lg shadow-primary/20"
      >
        <UploadSimple size={20} weight="bold" />
        Upload Transactions
        <ArrowRight size={16} weight="bold" />
      </Button>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-6">
        {/* Hero skeleton */}
        <div className="h-40 rounded-xl skeleton-shimmer" />

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl skeleton-shimmer" />
          ))}
        </div>

        {/* Charts grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 rounded-xl skeleton-shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    storage.init();
    setTransactions(storage.getTransactions());
    setCategories(storage.getCategories());
    setIsLoading(false);
  }, []);

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
    };
  }, [transactions]);

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
    return <LoadingState />;
  }

  if (transactions.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Financial Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track and analyze your financial health
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/app/transactions")}
          className="gap-2"
        >
          <Receipt size={16} />
          View All
          <ArrowRight size={14} />
        </Button>
      </div>

      {/* Hero Balance */}
      <HeroBalance balance={balance} transactionCount={transactions.length} />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Income"
          value={totalIncome}
          icon={TrendUp}
          variant="income"
        />
        <StatCard
          title="Total Expenses"
          value={totalExpenses}
          icon={TrendDown}
          variant="expense"
        />
        <StatCard
          title="Savings Rate"
          value={
            totalIncome > 0
              ? ((totalIncome - totalExpenses) / totalIncome) * 100
              : 0
          }
          icon={Sparkle}
          variant="default"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryDonutChart data={categorySummary} />
        <SpendingGradientChart transactions={transactions} />
        <TopIncomeChart transactions={transactions} />
        <TopMerchantsChart data={merchantSummary} />
      </div>
    </div>
  );
}
