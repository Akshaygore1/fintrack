import { useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  Trash,
  CaretLeft,
  CaretRight,
  Receipt,
  CalendarBlank,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

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
        <span className="text-muted-foreground/30 ml-1.5 group-hover:text-muted-foreground/50 transition-colors">
          <ArrowUp size={14} />
        </span>
      );
    }
    return sortOrder === "asc" ? (
      <ArrowUp size={14} className="ml-1.5 text-primary" />
    ) : (
      <ArrowDown size={14} className="ml-1.5 text-primary" />
    );
  };

  if (transactions.length === 0) {
    return (
      <Card variant="glass" className="py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <Receipt size={32} weight="duotone" className="text-muted-foreground/50" />
          </div>
          <p className="text-lg font-medium text-foreground">No transactions found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your filters or upload a CSV file
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div 
      className="space-y-4"
    >
      <Card variant="glass" size="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            {/* Header */}
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th
                  onClick={() => handleSort("date")}
                  className="group px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <span className="flex items-center">
                    <CalendarBlank size={14} className="mr-2 text-muted-foreground/50" />
                    Date
                    <SortIcon column="date" />
                  </span>
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Description
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Category
                </th>
                <th
                  onClick={() => handleSort("amount")}
                  className="group px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <span className="flex items-center justify-end">
                    Amount
                    <SortIcon column="amount" />
                  </span>
                </th>
                <th
                  onClick={() => handleSort("balance")}
                  className="group px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <span className="flex items-center justify-end">
                    Balance
                    <SortIcon column="balance" />
                  </span>
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16">
                  
                </th>
              </tr>
            </thead>
            
            {/* Body */}
            <tbody className="divide-y divide-border/30">
                {paginatedTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    onMouseEnter={() => setHoveredRow(transaction.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={cn(
                      "group transition-all duration-200",
                      hoveredRow === transaction.id 
                        ? "bg-accent/50" 
                        : "hover:bg-accent/30"
                    )}
                  >
                    {/* Date */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-sm font-mono text-muted-foreground tabular-nums">
                        {formatTransactionDate(transaction.date)}
                      </span>
                    </td>
                    
                    {/* Description */}
                    <td className="px-5 py-3.5 max-w-xs">
                      <div 
                        className="text-sm font-medium text-foreground truncate" 
                        title={transaction.description}
                      >
                        {transaction.description}
                      </div>
                      {transaction.merchant && transaction.merchant !== transaction.description && (
                        <div className="text-xs text-muted-foreground truncate mt-0.5">
                          {transaction.merchant}
                        </div>
                      )}
                    </td>
                    
                    {/* Category */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <CategoryBadge
                        category={transaction.category}
                        categories={categories}
                        editable={true}
                        onCategoryChange={(newCategory) =>
                          onUpdateCategory(transaction.id, newCategory)
                        }
                      />
                    </td>
                    
                    {/* Amount */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <span
                        className={cn(
                          "text-sm font-mono font-semibold tabular-nums",
                          transaction.type === "income"
                            ? "text-income"
                            : "text-expense"
                        )}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    
                    {/* Balance */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <span className="text-sm font-mono text-muted-foreground tabular-nums">
                        {formatCurrency(transaction.balance)}
                      </span>
                    </td>
                    
                    {/* Actions */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-center">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onDeleteTransaction(transaction.id)}
                        className={cn(
                          "text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-all duration-200",
                          hoveredRow === transaction.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        )}
                      >
                        <Trash size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div 
          className="flex items-center justify-between px-2"
        >
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-mono font-medium text-foreground">{startIndex + 1}</span> to{" "}
            <span className="font-mono font-medium text-foreground">{Math.min(endIndex, transactions.length)}</span> of{" "}
            <span className="font-mono font-medium text-foreground">{transactions.length}</span> transactions
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="gap-1"
            >
              <CaretLeft size={16} />
              Previous
            </Button>
            
            <div className="flex items-center gap-1 px-2">
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
                    className={cn(
                      "w-9 h-9 p-0 font-mono",
                      currentPage === pageNum && "shadow-lg shadow-primary/20"
                    )}
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
              className="gap-1"
            >
              Next
              <CaretRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
