import { useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  Trash,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatTransactionDate } from "@/lib/dateHelpers";
import { formatCurrency } from "@/lib/transactionHelpers";
import { CategoryBadge } from "./CategoryBadge";
import type { Transaction, Category } from "@/types";

interface TransactionTableProps {
  transactions: Transaction[];
  categories: Category[];
  onUpdateCategory: (transactionId: string, newCategory: string) => void;
  onDeleteTransaction: (transactionId: string) => void;
  sortBy: "date" | "amount" | "balance";
  sortOrder: "asc" | "desc";
  onSortChange: (sortBy: "date" | "amount" | "balance") => void;
}

const ITEMS_PER_PAGE = 50;

export function TransactionTable({
  transactions,
  categories,
  onUpdateCategory,
  onDeleteTransaction,
  sortBy,
  sortOrder,
  onSortChange,
}: TransactionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  const handleSort = (column: "date" | "amount" | "balance") => {
    onSortChange(column);
  };

  const SortIcon = ({ column }: { column: "date" | "amount" | "balance" }) => {
    if (sortBy !== column) {
      return (
        <span className="text-muted-foreground/50 ml-1">
          <ArrowUp size={14} />
        </span>
      );
    }
    return sortOrder === "asc" ? (
      <ArrowUp size={14} className="ml-1 text-foreground" />
    ) : (
      <ArrowDown size={14} className="ml-1 text-foreground" />
    );
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No transactions found</p>
        <p className="text-sm mt-2">
          Try adjusting your filters or upload a CSV file
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      <div className="overflow-x-auto border border-border">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th
                onClick={() => handleSort("date")}
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted transition-colors"
              >
                <span className="flex items-center">
                  Date
                  <SortIcon column="date" />
                </span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Category
              </th>
              <th
                onClick={() => handleSort("amount")}
                className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted transition-colors"
              >
                <span className="flex items-center justify-end">
                  Amount
                  <SortIcon column="amount" />
                </span>
              </th>
              <th
                onClick={() => handleSort("balance")}
                className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted transition-colors"
              >
                <span className="flex items-center justify-end">
                  Balance
                  <SortIcon column="balance" />
                </span>
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {paginatedTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                  {formatTransactionDate(transaction.date)}
                </td>
                <td className="px-4 py-3 text-sm text-foreground max-w-xs">
                  <div className="truncate" title={transaction.description}>
                    {transaction.description}
                  </div>
                  {transaction.merchant && transaction.merchant !== transaction.description && (
                    <div className="text-xs text-muted-foreground truncate">
                      {transaction.merchant}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <CategoryBadge
                    category={transaction.category}
                    categories={categories}
                    editable={true}
                    onCategoryChange={(newCategory) =>
                      onUpdateCategory(transaction.id, newCategory)
                    }
                  />
                </td>
                <td
                  className={cn(
                    "px-4 py-3 whitespace-nowrap text-sm font-medium text-right",
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-right">
                  {formatCurrency(transaction.balance)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDeleteTransaction(transaction.id)}
                    className="text-muted-foreground hover:text-red-600"
                  >
                    <Trash size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, transactions.length)} of {transactions.length}{" "}
            transactions
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <CaretLeft size={16} className="mr-1" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <CaretRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
