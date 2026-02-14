// Transaction type
export interface Transaction {
  id: string; // UUID v4
  date: string; // ISO 8601 string (YYYY-MM-DD)
  description: string; // Original transaction description
  refNo: string; // Reference/transaction number
  amount: number; // Positive for income, negative for expense
  type: "income" | "expense"; // Derived from amount sign
  balance: number; // Account balance after transaction
  category: string; // Category name
  merchant: string; // Extracted merchant name
  isManualCategory: boolean; // User manually changed category
  createdAt: string; // ISO timestamp when uploaded
  updatedAt: string; // ISO timestamp when last modified
}

// Category definition
export interface Category {
  id: string; // UUID v4
  name: string; // Category display name
  keywords: string[]; // Lowercase keywords for matching
  color: string; // Tailwind color class (e.g., "blue", "green")
  icon?: string; // Phosphor icon name (optional)
  isCustom: boolean; // True for user-created categories
  isActive: boolean; // Soft delete support
  createdAt: string; // ISO timestamp
}

// Column mapping for CSV import
export interface ColumnMapping {
  dateColumn: string; // CSV column name for date
  descriptionColumn: string; // CSV column name for description
  amountColumn?: string; // Single amount column (optional)
  creditColumn?: string; // Credit/deposit column (optional)
  debitColumn?: string; // Debit/withdrawal column (optional)
  refNoColumn?: string; // Reference number (optional)
  balanceColumn?: string; // Balance column (optional)
  dateFormat: "DD/MM/YYYY" | "DD/MM/YY"; // Date parsing format
}

// Analytics data types
export interface CategorySummary {
  category: string;
  total: number;
  count: number;
  percentage: number;
  color: string;
}

export interface MerchantSummary {
  merchant: string;
  total: number;
  count: number;
  avgTransaction: number;
}

export interface MonthlyData {
  month: string; // Format: "Jan 2026"
  income: number;
  expenses: number;
  net: number;
}

// Filter state
export interface TransactionFilters {
  searchQuery: string;
  categoryFilter: string[]; // Multiple categories
  typeFilter: "all" | "income" | "expense";
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

// App settings
export interface AppSettings {
  version: string; // For migration support
  preferredDateFormat: "DD/MM/YYYY" | "DD/MM/YY";
  currency: "INR" | "USD";
  exchangeRate: number; // USD to INR conversion rate
  theme: "light" | "dark" | "system";
}

// CSV Parse result
export interface CSVParseResult {
  headers: string[];
  rows: string[][];
  preview: string[][];
}
