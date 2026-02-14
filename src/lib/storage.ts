import { v4 as uuidv4 } from "uuid";
import type { Transaction, Category, AppSettings } from "@/types";
import { DEFAULT_CATEGORIES } from "@/constants/categories";

const STORAGE_KEYS = {
  TRANSACTIONS: "fintrack_transactions",
  CATEGORIES: "fintrack_categories",
  SETTINGS: "fintrack_settings",
} as const;

const MAX_TRANSACTIONS = 5000;
const APP_VERSION = "1.0.0";

class StorageManager {

  init(): void {
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      this.saveCategories(this.getDefaultCategories());
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.saveSettings(this.getDefaultSettings());
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      this.saveTransactions([]);
    }
  }

  private getDefaultCategories(): Category[] {
    return DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    }));
  }

  private getDefaultSettings(): AppSettings {
    return {
      version: APP_VERSION,
      preferredDateFormat: "DD/MM/YYYY",
      currency: "INR",
      exchangeRate: 85, // 1 USD = 85 INR (default)
      theme: "light",
    };
  }


  getTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading transactions:", error);
      return [];
    }
  }

  saveTransactions(transactions: Transaction[]): void {
    if (transactions.length > MAX_TRANSACTIONS) {
      throw new Error(
        `Cannot store more than ${MAX_TRANSACTIONS} transactions`
      );
    }
    localStorage.setItem(
      STORAGE_KEYS.TRANSACTIONS,
      JSON.stringify(transactions)
    );
  }

  addTransactions(newTransactions: Transaction[]): void {
    const existing = this.getTransactions();
    const combined = [...existing, ...newTransactions];

    if (combined.length > MAX_TRANSACTIONS) {
      throw new Error(
        `Total transactions would exceed limit of ${MAX_TRANSACTIONS}. You have ${existing.length} transactions and trying to add ${newTransactions.length} more.`
      );
    }

    this.saveTransactions(combined);
  }

  updateTransaction(id: string, updates: Partial<Transaction>): void {
    const transactions = this.getTransactions();
    const index = transactions.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new Error("Transaction not found");
    }

    transactions[index] = {
      ...transactions[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveTransactions(transactions);
  }

  deleteTransaction(id: string): void {
    const transactions = this.getTransactions();
    const filtered = transactions.filter((t) => t.id !== id);
    this.saveTransactions(filtered);
  }

  deleteTransactions(ids: string[]): void {
    const transactions = this.getTransactions();
    const filtered = transactions.filter((t) => !ids.includes(t.id));
    this.saveTransactions(filtered);
  }

  clearAllTransactions(): void {
    this.saveTransactions([]);
  }

  getTransactionCount(): number {
    return this.getTransactions().length;
  }

  isNearLimit(): boolean {
    return this.getTransactionCount() >= 4500;
  }


  getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : this.getDefaultCategories();
    } catch (error) {
      console.error("Error reading categories:", error);
      return this.getDefaultCategories();
    }
  }

  saveCategories(categories: Category[]): void {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  addCategory(category: Omit<Category, "id" | "createdAt">): Category {
    const categories = this.getCategories();
    const newCategory: Category = {
      ...category,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    categories.push(newCategory);
    this.saveCategories(categories);
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Category>): void {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === id);

    if (index === -1) {
      throw new Error("Category not found");
    }

    categories[index] = {
      ...categories[index],
      ...updates,
    };

    this.saveCategories(categories);
  }

  deleteCategory(id: string): void {
    const categories = this.getCategories();


    const category = categories.find((c) => c.id === id);
    if (category && !category.isCustom) {
      throw new Error("Cannot delete default categories");
    }

    const filtered = categories.filter((c) => c.id !== id);
    this.saveCategories(filtered);


    const transactions = this.getTransactions();
    const updatedTransactions = transactions.map((t) => {
      if (t.category === category?.name && !t.isManualCategory) {
        return { ...t, category: "Other", updatedAt: new Date().toISOString() };
      }
      return t;
    });
    this.saveTransactions(updatedTransactions);
  }

  resetCategories(): void {
    this.saveCategories(this.getDefaultCategories());
  }


  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        return this.getDefaultSettings();
      }
      
      const settings = JSON.parse(data);
      // Migration: Add exchangeRate if it doesn't exist
      if (!settings.exchangeRate) {
        settings.exchangeRate = 85;
        this.saveSettings(settings);
      }
      
      return settings;
    } catch (error) {
      console.error("Error reading settings:", error);
      return this.getDefaultSettings();
    }
  }

  saveSettings(settings: AppSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  updateSettings(updates: Partial<AppSettings>): void {
    const settings = this.getSettings();
    this.saveSettings({ ...settings, ...updates });
  }


  exportTransactionsCSV(): string {
    const transactions = this.getTransactions();

    const headers = [
      "Date",
      "Description",
      "Merchant",
      "Category",
      "Amount",
      "Type",
      "Balance",
      "Reference No",
    ];

    const rows = transactions.map((t) => [
      t.date,
      t.description,
      t.merchant,
      t.category,
      t.amount.toString(),
      t.type,
      t.balance.toString(),
      t.refNo,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

    return csv;
  }


  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    this.init();
  }
}

export const storage = new StorageManager();
