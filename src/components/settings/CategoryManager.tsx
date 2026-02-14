import { useState } from "react";
import { Pencil, Trash, Plus, ArrowCounterClockwise, Tag, Sparkle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CATEGORY_COLORS } from "@/constants/categories";
import { CategoryForm } from "./CategoryForm";
import type { Category } from "@/types";

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (data: { name: string; keywords: string[]; color: string }) => void;
  onUpdateCategory: (id: string, data: { name: string; keywords: string[]; color: string }) => void;
  onDeleteCategory: (id: string) => void;
  onResetCategories: () => void;
}

export function CategoryManager({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onResetCategories,
}: CategoryManagerProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = (data: { name: string; keywords: string[]; color: string }) => {
    if (editingCategory) {
      onUpdateCategory(editingCategory.id, data);
      setEditingCategory(null);
    } else {
      onAddCategory(data);
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setIsAdding(false);
  };

  const handleReset = () => {
    if (window.confirm("Reset all categories to defaults? This will remove custom categories and restore default keywords.")) {
      onResetCategories();
    }
  };

  const defaultCategories = categories.filter((c) => !c.isCustom);
  const customCategories = categories.filter((c) => c.isCustom);

  if (isAdding || editingCategory) {
    return (
      <div>
        <CategoryForm
          category={editingCategory || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag size={18} weight="duotone" className="text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Categories</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5 text-muted-foreground">
            <ArrowCounterClockwise size={15} weight="bold" />
            Reset
          </Button>
          <Button size="sm" onClick={() => setIsAdding(true)} className="gap-1.5 shadow-glow-sm">
            <Plus size={15} weight="bold" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Custom Categories */}
        {customCategories.length > 0 && (
          <div>
            <Card variant="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkle size={14} weight="duotone" className="text-accent" />
                  Custom Categories
                </CardTitle>
                <CardDescription className="text-xs">
                  Categories you've created
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {customCategories.map((category) => (
                    <div
                      key={category.id}
                    >
                      <CategoryRow
                        category={category}
                        onEdit={() => setEditingCategory(category)}
                        onDelete={() => onDeleteCategory(category.id)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      {/* Default Categories */}
      <Card variant="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Default Categories</CardTitle>
          <CardDescription className="text-xs">
            Built-in categories for common transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {defaultCategories.map((category) => (
              <div
                key={category.id}
              >
                <CategoryRow
                  category={category}
                  onEdit={() => setEditingCategory(category)}
                  isDefault
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface CategoryRowProps {
  category: Category;
  onEdit: () => void;
  onDelete?: () => void;
  isDefault?: boolean;
}

function CategoryRow({ category, onEdit, onDelete, isDefault }: CategoryRowProps) {
  const colors = CATEGORY_COLORS[category.color] || CATEGORY_COLORS.slate;

  return (
    <div className={cn(
      "group flex items-center justify-between p-3 rounded-xl",
      "border border-border/30 hover:border-border/60",
      "bg-muted/20 hover:bg-muted/40",
      "transition-all duration-200"
    )}>
      <div className="flex items-center gap-3 min-w-0">
        {/* Color indicator */}
        <div
          className={cn(
            "w-3 h-3 rounded-md flex-shrink-0",
            colors.bg
          )}
        />
        
        <div className="min-w-0 flex-1">
          <div className="font-medium text-sm text-foreground">{category.name}</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {category.keywords.slice(0, 4).map((keyword) => (
              <Badge 
                key={keyword} 
                variant="outline" 
                className="text-[10px] px-1.5 py-0 h-5 bg-background/50"
              >
                {keyword}
              </Badge>
            ))}
            {category.keywords.length > 4 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 bg-background/50">
                +{category.keywords.length - 4}
              </Badge>
            )}
            {category.keywords.length === 0 && (
              <span className="text-[10px] text-muted-foreground/60">No keywords</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onEdit}
          className="h-7 w-7 rounded-lg"
        >
          <Pencil size={14} />
        </Button>
        {!isDefault && onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-7 w-7 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}
