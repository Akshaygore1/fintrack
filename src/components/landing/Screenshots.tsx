import { 
  ChartDonut, 
  Table, 
  Sliders, 
  CurrencyInr,
  TrendUp,
  Tag
} from "@phosphor-icons/react";

// Placeholder components that mimic the actual app screens
function DashboardPlaceholder() {
  return (
    <div className="bg-card rounded-xl border border-border/50 p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-4 w-24 bg-muted rounded mb-2" />
          <div className="flex items-center gap-2">
            <CurrencyInr weight="bold" className="size-5 text-muted-foreground" />
            <div className="h-8 w-32 bg-gradient-to-r from-primary/20 to-income/20 rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-income/10 text-income text-xs font-medium flex items-center gap-1">
            <TrendUp weight="bold" className="size-3" />
            Income
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-expense/10 text-expense text-xs font-medium">
            Expense
          </div>
        </div>
      </div>

      {/* Chart placeholder */}
      <div className="flex items-center justify-center py-8">
        <div className="relative size-40">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-muted)" strokeWidth="12" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-primary)" strokeWidth="12" 
              strokeDasharray="125.6 251.2" strokeLinecap="round" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-income)" strokeWidth="12" 
              strokeDasharray="62.8 251.2" strokeDashoffset="-125.6" strokeLinecap="round" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-chart-4)" strokeWidth="12" 
              strokeDasharray="37.7 251.2" strokeDashoffset="-188.4" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <ChartDonut weight="duotone" className="size-8 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {["Food & Dining", "Shopping", "Transport", "Other"].map((cat, i) => (
          <div key={cat} className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className={`size-2 rounded-full ${
              i === 0 ? 'bg-primary' : i === 1 ? 'bg-income' : i === 2 ? 'bg-chart-4' : 'bg-muted'
            }`} />
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
}

function TransactionsPlaceholder() {
  const transactions = [
    { name: "Swiggy", category: "Food & Dining", amount: -450, color: "bg-expense" },
    { name: "Salary Credit", category: "Income", amount: 85000, color: "bg-income" },
    { name: "Amazon", category: "Shopping", amount: -2999, color: "bg-expense" },
    { name: "Uber", category: "Transport", amount: -189, color: "bg-expense" },
    { name: "Zepto", category: "Groceries", amount: -876, color: "bg-expense" },
  ];

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Table weight="duotone" className="size-5 text-muted-foreground" />
          <span className="font-medium">Transactions</span>
        </div>
        <div className="h-7 w-32 bg-muted rounded-lg" />
      </div>

      {/* Filters placeholder */}
      <div className="flex gap-2 mb-4">
        <div className="h-8 w-20 bg-muted/50 rounded-lg" />
        <div className="h-8 w-24 bg-muted/50 rounded-lg" />
        <div className="h-8 flex-1 bg-muted/50 rounded-lg" />
      </div>

      {/* Transactions list */}
      <div className="space-y-2">
        {transactions.map((tx, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`size-8 rounded-lg ${tx.amount > 0 ? 'bg-income/10' : 'bg-expense/10'} flex items-center justify-center`}>
                <Tag weight="duotone" className={`size-4 ${tx.amount > 0 ? 'text-income' : 'text-expense'}`} />
              </div>
              <div>
                <div className="text-sm font-medium">{tx.name}</div>
                <div className="text-xs text-muted-foreground">{tx.category}</div>
              </div>
            </div>
            <div className={`font-mono text-sm font-medium ${tx.amount > 0 ? 'text-income' : 'text-expense'}`}>
              {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-IN')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPlaceholder() {
  const categories = [
    { name: "Food & Dining", keywords: 4, color: "bg-chart-3" },
    { name: "Groceries", keywords: 3, color: "bg-income" },
    { name: "Shopping", keywords: 5, color: "bg-primary" },
    { name: "Transport", keywords: 3, color: "bg-chart-4" },
  ];

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sliders weight="duotone" className="size-5 text-muted-foreground" />
          <span className="font-medium">Categories</span>
        </div>
        <div className="h-7 w-24 bg-primary/20 rounded-lg" />
      </div>

      {/* Categories list */}
      <div className="space-y-2">
        {categories.map((cat, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-border transition-colors">
            <div className="flex items-center gap-3">
              <div className={`size-3 rounded-full ${cat.color}`} />
              <span className="text-sm font-medium">{cat.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">{cat.keywords} keywords</span>
          </div>
        ))}
      </div>

      {/* Add category placeholder */}
      <div className="mt-4 p-3 rounded-lg border border-dashed border-border/50 text-center">
        <span className="text-xs text-muted-foreground">+ Add Custom Category</span>
      </div>
    </div>
  );
}

export function Screenshots() {
  return (
    <section id="screenshots" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
      
      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            See it in action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Beautiful, intuitive interface designed for clarity
          </p>
        </div>

        {/* Screenshots Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Dashboard - larger */}
          <div className="lg:col-span-2 lg:row-span-2">
            <div className="h-full">
              <div className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <ChartDonut weight="duotone" className="size-4" />
                Dashboard Overview
              </div>
              <DashboardPlaceholder />
            </div>
          </div>

          {/* Transactions */}
          <div>
            <div className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <Table weight="duotone" className="size-4" />
              Transaction List
            </div>
            <TransactionsPlaceholder />
          </div>

          {/* Settings */}
          <div>
            <div className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <Sliders weight="duotone" className="size-4" />
              Category Settings
            </div>
            <SettingsPlaceholder />
          </div>
        </div>
      </div>
    </section>
  );
}
