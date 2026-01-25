import { MagnifyingGlass, Funnel, X } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/transactionHelpers";
import type { Category, TransactionFilters as TFilters } from "@/types";

interface TransactionFiltersProps {
  filters: TFilters;
  onFiltersChange: (filters: TFilters) => void;
  categories: Category[];
  totalCount: number;
  filteredCount: number;
  filteredTotal: number;
}

export function TransactionFilters({
  filters,
  onFiltersChange,
  categories,
  totalCount,
  filteredCount,
  filteredTotal,
}: TransactionFiltersProps) {
  const hasActiveFilters =
    filters.searchQuery ||
    filters.categoryFilter.length > 0 ||
    filters.typeFilter !== "all" ||
    filters.dateRange.start ||
    filters.dateRange.end;

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchQuery: value });
  };

  const handleTypeChange = (value: string | null) => {
    if (!value) return;
    onFiltersChange({
      ...filters,
      typeFilter: value as "all" | "income" | "expense",
    });
  };

  const handleCategoryToggle = (categoryName: string) => {
    const newCategories = filters.categoryFilter.includes(categoryName)
      ? filters.categoryFilter.filter((c) => c !== categoryName)
      : [...filters.categoryFilter, categoryName];
    onFiltersChange({ ...filters, categoryFilter: newCategories });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      searchQuery: "",
      categoryFilter: [],
      typeFilter: "all",
      dateRange: { start: null, end: null },
    });
  };

  const handleStartDateChange = (value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        start: value ? new Date(value) : null,
      },
    });
  };

  const handleEndDateChange = (value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        end: value ? new Date(value) : null,
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Search and Type Filter Row */}
      <div className="flex flex-wrap gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlass
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Search transactions..."
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Type Filter */}
        <Select value={filters.typeFilter} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range */}
        <Input
          type="date"
          placeholder="Start date"
          value={
            filters.dateRange.start
              ? filters.dateRange.start.toISOString().split("T")[0]
              : ""
          }
          onChange={(e) => handleStartDateChange(e.target.value)}
          className="w-[150px]"
        />
        <Input
          type="date"
          placeholder="End date"
          value={
            filters.dateRange.end
              ? filters.dateRange.end.toISOString().split("T")[0]
              : ""
          }
          onChange={(e) => handleEndDateChange(e.target.value)}
          className="w-[150px]"
        />

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={handleClearFilters}>
            <X size={16} className="mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Funnel size={16} className="text-gray-500" />
        <span className="text-sm text-gray-500 mr-1">Categories:</span>
        {categories
          .filter((c) => c.isActive)
          .map((category) => {
            const isSelected = filters.categoryFilter.includes(category.name);
            return (
              <Badge
                key={category.id}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer transition-all"
                onClick={() => handleCategoryToggle(category.name)}
              >
                {category.name}
              </Badge>
            );
          })}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Showing {filteredCount.toLocaleString()} of {totalCount.toLocaleString()}{" "}
        transactions • Total: {formatCurrency(filteredTotal)}
        {hasActiveFilters && " (filtered)"}
      </div>
    </div>
  );
}
