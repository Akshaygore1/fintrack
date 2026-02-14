import type { Transaction } from "@/types";
import { type Currency, formatAmount, formatCompactAmount } from "./currencyConverter";

export function extractMerchant(description: string): string {
  let merchant = description.trim();


  if (merchant.toUpperCase().startsWith("UPI-")) {
    const parts = merchant.split("-");

    if (parts.length >= 2) {
      merchant = parts[1];
    }
  }


  else if (merchant.toUpperCase().startsWith("NEFT")) {
    merchant = "NEFT Transfer";
  }


  merchant = merchant.split("@")[0];


  merchant = merchant.replace(/[-/]\d+$/g, "");


  merchant = merchant.trim().substring(0, 30);

  return merchant;
}

export function formatCurrency(amount: number, currency?: Currency): string {
  if (currency) {
    return formatAmount(Math.abs(amount), currency);
  }
  // Fallback to INR for backward compatibility
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
}

export function formatCompactCurrency(amount: number, currency?: Currency): string {
  if (currency) {
    return formatCompactAmount(amount, currency);
  }
  // Fallback to INR for backward compatibility
  const absAmount = Math.abs(amount);

  if (absAmount >= 10000000) {
    return `₹${(absAmount / 10000000).toFixed(2)}Cr`;
  } else if (absAmount >= 100000) {
    return `₹${(absAmount / 100000).toFixed(2)}L`;
  } else if (absAmount >= 1000) {
    return `₹${(absAmount / 1000).toFixed(1)}K`;
  }

  return `₹${absAmount.toFixed(0)}`;
}

export function sortTransactions(
  transactions: Transaction[],
  sortBy: "date" | "amount" | "balance",
  sortOrder: "asc" | "desc"
): Transaction[] {
  return [...transactions].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "date":
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case "amount":
        comparison = Math.abs(a.amount) - Math.abs(b.amount);
        break;
      case "balance":
        comparison = a.balance - b.balance;
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });
}

export function filterTransactions(
  transactions: Transaction[],
  filters: {
    searchQuery?: string;
    categoryFilter?: string[];
    typeFilter?: "all" | "income" | "expense";
    dateRange?: {
      start: Date | null;
      end: Date | null;
    };
  }
): Transaction[] {
  let filtered = [...transactions];


  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.description.toLowerCase().includes(query) ||
        t.merchant.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
    );
  }


  if (filters.categoryFilter && filters.categoryFilter.length > 0) {
    filtered = filtered.filter((t) =>
      filters.categoryFilter!.includes(t.category)
    );
  }


  if (filters.typeFilter && filters.typeFilter !== "all") {
    filtered = filtered.filter((t) => t.type === filters.typeFilter);
  }


  if (filters.dateRange?.start) {
    filtered = filtered.filter(
      (t) => new Date(t.date) >= filters.dateRange!.start!
    );
  }

  if (filters.dateRange?.end) {
    filtered = filtered.filter(
      (t) => new Date(t.date) <= filters.dateRange!.end!
    );
  }

  return filtered;
}
