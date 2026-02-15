import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UploadSimple, Receipt, Plus, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { storage } from "@/lib/storage";
import {
  sortTransactions,
  filterTransactions,
} from "@/lib/transactionHelpers";
import type { Transaction, Category, TransactionFilters as TFilters } from "@/types";

function EmptyState() {
  const navigate = useNavigate();
  
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] p-8"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
        <div className="relative w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-6 border border-border/50">
          <Receipt size={40} weight="duotone" className="text-muted-foreground" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
        No transactions yet
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Upload a CSV file with your bank transactions to get started. 
        We'll organize and categorize them automatically.
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
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 skeleton-shimmer rounded-lg" />
        <div className="h-10 w-32 skeleton-shimmer rounded-lg" />
      </div>
      <div className="h-24 skeleton-shimmer rounded-xl" />
      <div className="h-12 skeleton-shimmer rounded-lg" />
      <div className="h-[500px] skeleton-shimmer rounded-xl" />
    </div>
  );
}

function TransactionsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [sortBy, setSortBy] = useState<"date" | "amount" | "balance">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Initialize filters from URL params
  const [filters, setFilters] = useState<TFilters>(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");
    const typeParam = searchParams.get("type");
    
    return {
      searchQuery: searchParam || "",
      categoryFilter: categoryParam ? [categoryParam] : [],
      typeFilter: (typeParam as "all" | "income" | "expense") || "all",
      dateRange: { start: null, end: null },
    };
  });

  useEffect(() => {
    storage.init();
    setTransactions(storage.getTransactions());
    setCategories(storage.getCategories());
    setIsLoading(false);
  }, []);

  const filteredTransactions = useMemo(() => {
    const filtered = filterTransactions(transactions, {
      searchQuery: filters.searchQuery,
      categoryFilter: filters.categoryFilter,
      typeFilter: filters.typeFilter,
      dateRange: filters.dateRange,
    });
    return sortTransactions(filtered, sortBy, sortOrder);
  }, [transactions, filters, sortBy, sortOrder]);

  const filteredTotal = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const handleSortChange = (column: "date" | "amount" | "balance") => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handleUpdateCategory = (transactionId: string, newCategory: string) => {
    try {
      storage.updateTransaction(transactionId, {
        category: newCategory,
        isManualCategory: true,
      });
      setTransactions(storage.getTransactions());
      toast.success("Category updated");
    } catch {
      toast.error("Failed to update category");
    }
  };

  const handleDeleteTransaction = (transactionId: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        storage.deleteTransaction(transactionId);
        setTransactions(storage.getTransactions());
        toast.success("Transaction deleted");
      } catch {
        toast.error("Failed to delete transaction");
      }
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (transactions.length === 0) {
    return <EmptyState />;
  }

  return (
    <div 
      className="p-6 space-y-6 max-w-[1600px] mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Browse and manage your financial history
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate("/app/upload")}
          className="gap-2"
        >
          <Plus size={16} weight="bold" />
          Import More
        </Button>
      </div>

      {/* Filters */}
      <TransactionFilters
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        totalCount={transactions.length}
        filteredCount={filteredTransactions.length}
        filteredTotal={filteredTotal}
      />

      {/* Table */}
      <TransactionTable
        transactions={filteredTransactions}
        categories={categories}
        onUpdateCategory={handleUpdateCategory}
        onDeleteTransaction={handleDeleteTransaction}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
    </div>
  );
}

export default TransactionsPage;
