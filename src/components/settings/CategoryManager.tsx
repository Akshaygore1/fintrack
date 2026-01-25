import { useState } from "react";
import { Pencil, Trash, Plus, ArrowCounterClockwise } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <CategoryForm
        category={editingCategory || undefined}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Categories</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <ArrowCounterClockwise size={16} className="mr-1" />
            Reset to Default
          </Button>
          <Button size="sm" onClick={() => setIsAdding(true)}>
            <Plus size={16} className="mr-1" />
            Add Category
          </Button>
        </div>
      </div>


      {customCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Custom Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customCategories.map((category) => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  onEdit={() => setEditingCategory(category)}
                  onDelete={() => onDeleteCategory(category.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}


      <Card>
        <CardHeader>
          <CardTitle className="text-base">Default Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {defaultCategories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                onEdit={() => setEditingCategory(category)}
                isDefault
              />
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
    <div className="flex items-center justify-between p-3 border border-border hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "w-4 h-4 border",
            colors.bg,
            colors.border
          )}
        />
        <div>
          <div className="font-medium">{category.name}</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {category.keywords.slice(0, 5).map((keyword) => (
              <Badge key={keyword} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {category.keywords.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{category.keywords.length - 5} more
              </Badge>
            )}
            {category.keywords.length === 0 && (
              <span className="text-xs text-gray-400">No keywords</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" onClick={onEdit}>
          <Pencil size={16} />
        </Button>
        {!isDefault && onDelete && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700"
          >
            <Trash size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}
