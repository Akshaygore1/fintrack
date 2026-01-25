import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UploadSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { storage } from "@/lib/storage";
import {
  sortTransactions,
  filterTransactions,
} from "@/lib/transactionHelpers";
import type { Transaction, Category, TransactionFilters as TFilters } from "@/types";

export function TransactionsPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  const [sortBy, setSortBy] = useState<"date" | "amount" | "balance">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");


  const [filters, setFilters] = useState<TFilters>({
    searchQuery: "",
    categoryFilter: [],
    typeFilter: "all",
    dateRange: { start: null, end: null },
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
    } catch (error) {
      toast.error("Failed to update category");
    }
  };


  const handleDeleteTransaction = (transactionId: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        storage.deleteTransaction(transactionId);
        setTransactions(storage.getTransactions());
        toast.success("Transaction deleted");
      } catch (error) {
        toast.error("Failed to delete transaction");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted" />
          <div className="h-12 bg-muted" />
          <div className="h-64 bg-muted" />
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Transactions</h1>
        <div className="text-center py-12 border border-dashed border-border">
          <p className="text-muted-foreground mb-4">No transactions found</p>
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
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button variant="outline" onClick={() => navigate("/")}>
          <UploadSimple size={18} className="mr-2" />
          Import More
        </Button>
      </div>

      <TransactionFilters
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        totalCount={transactions.length}
        filteredCount={filteredTransactions.length}
        filteredTotal={filteredTotal}
      />

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
