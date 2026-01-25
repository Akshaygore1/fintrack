import { useState, useRef, useEffect } from "react";
import { CaretDown, Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { CATEGORY_COLORS } from "@/constants/categories";
import type { Category } from "@/types";

interface CategoryBadgeProps {
  category: string;
  categories: Category[];
  onCategoryChange?: (newCategory: string) => void;
  editable?: boolean;
}

export function CategoryBadge({
  category,
  categories,
  onCategoryChange,
  editable = true,
}: CategoryBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCategory = categories.find((c) => c.name === category);
  const colorKey = currentCategory?.color || "slate";
  const colors = CATEGORY_COLORS[colorKey] || CATEGORY_COLORS.slate;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (categoryName: string) => {
    if (onCategoryChange && categoryName !== category) {
      onCategoryChange(categoryName);
    }
    setIsOpen(false);
  };

  if (!editable || !onCategoryChange) {
    return (
      <span
        className={cn(
          "inline-flex items-center px-2 py-0.5 text-xs font-medium border",
          colors.bg,
          colors.text,
          colors.border
        )}
      >
        {category}
      </span>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border cursor-pointer transition-all",
          colors.bg,
          colors.text,
          colors.border,
          "hover:opacity-80"
        )}
      >
        {category}
        <CaretDown size={12} weight="bold" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-48 bg-popover shadow-lg border border-border py-1 max-h-64 overflow-auto">
          {categories
            .filter((c) => c.isActive)
            .map((cat) => {
              const catColors = CATEGORY_COLORS[cat.color] || CATEGORY_COLORS.slate;
              const isSelected = cat.name === category;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelect(cat.name)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left hover:bg-muted transition-colors",
                    isSelected && "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "w-3 h-3",
                      catColors.bg,
                      catColors.border,
                      "border"
                    )}
                  />
                  <span className="flex-1">{cat.name}</span>
                  {isSelected && (
                    <Check size={14} weight="bold" className="text-green-600" />
                  )}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}
