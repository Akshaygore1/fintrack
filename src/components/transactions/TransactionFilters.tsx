import { MagnifyingGlass, Funnel, X, CalendarBlank, TrendUp, TrendDown, ListBullets } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/transactionHelpers";
import { cn } from "@/lib/utils";
import type { Category, TransactionFilters as TFilters } from "@/types";

interface TransactionFiltersProps {
  filters: TFilters;
  onFiltersChange: (filters: TFilters) => void;
  categories: Category[];
  totalCount: number;
  filteredCount: number;
  filteredTotal: number;
}

// Quick filter presets
const quickFilters = [
  { id: "all", label: "All", icon: ListBullets, type: "all" as const },
  { id: "income", label: "Income", icon: TrendUp, type: "income" as const },
  { id: "expense", label: "Expenses", icon: TrendDown, type: "expense" as const },
];

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

  const handleTypeChange = (value: "all" | "income" | "expense") => {
    onFiltersChange({
      ...filters,
      typeFilter: value,
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
    <div 
      className="space-y-4"
    >
      {/* Search and main filters */}
      <Card variant="glass" size="none">
        <div className="flex flex-wrap items-center gap-3 p-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[250px]">
            <MagnifyingGlass
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"
            />
            <Input
              placeholder="Search transactions, merchants..."
              value={filters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>

          {/* Quick type filters */}
          <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
            {quickFilters.map((filter) => (
              <Button
                key={filter.id}
                variant="ghost"
                size="sm"
                onClick={() => handleTypeChange(filter.type)}
                className={cn(
                  "gap-1.5 h-8 px-3 rounded-md transition-all duration-200",
                  filters.typeFilter === filter.type
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                )}
              >
                <filter.icon 
                  size={15} 
                  weight={filters.typeFilter === filter.type ? "duotone" : "regular"}
                  className={cn(
                    filters.typeFilter === filter.type && filter.type === "income" && "text-income",
                    filters.typeFilter === filter.type && filter.type === "expense" && "text-expense"
                  )}
                />
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Date range */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <CalendarBlank
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none"
              />
              <Input
                type="date"
                placeholder="Start date"
                value={
                  filters.dateRange.start
                    ? filters.dateRange.start.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-[160px] pl-9 bg-background/50"
              />
            </div>
            <span className="text-muted-foreground/50 text-sm">to</span>
            <div className="relative">
              <CalendarBlank
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none"
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
                className="w-[160px] pl-9 bg-background/50"
              />
            </div>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearFilters}
                className="gap-1.5 h-9 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Category filters */}
      <div className="flex flex-wrap items-center gap-2 px-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mr-2">
          <Funnel size={14} />
          <span className="font-medium">Categories:</span>
        </div>
        {categories
          .filter((c) => c.isActive)
          .map((category) => {
            const isSelected = filters.categoryFilter.includes(category.name);
            return (
              <div
                key={category.id}
              >
                <Badge
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    isSelected 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => handleCategoryToggle(category.name)}
                >
                  {category.name}
                </Badge>
              </div>
            );
          })}
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">
            Showing <span className="font-mono font-medium text-foreground">{filteredCount.toLocaleString()}</span> of{" "}
            <span className="font-mono font-medium text-foreground">{totalCount.toLocaleString()}</span> transactions
          </span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              Filtered
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Net total:</span>
          <span className={cn(
            "text-sm font-mono font-bold",
            filteredTotal >= 0 ? "text-income" : "text-expense"
          )}>
            {filteredTotal >= 0 ? "+" : ""}{formatCurrency(filteredTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
