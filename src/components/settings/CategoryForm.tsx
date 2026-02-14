import { useState } from "react";
import { X, Plus, Tag, Palette, Key } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_COLORS } from "@/constants/categories";
import type { Category } from "@/types";

interface CategoryFormProps {
  category?: Category;
  onSave: (data: { name: string; keywords: string[]; color: string }) => void;
  onCancel: () => void;
}

const COLOR_OPTIONS = Object.keys(CATEGORY_COLORS);

export function CategoryForm({ category, onSave, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(category?.name || "");
  const [keywords, setKeywords] = useState<string[]>(category?.keywords || []);
  const [color, setColor] = useState(category?.color || "slate");
  const [keywordInput, setKeywordInput] = useState("");

  const handleAddKeyword = () => {
    const keyword = keywordInput.trim().toLowerCase();
    if (keyword && !keywords.includes(keyword)) {
      setKeywords([...keywords, keyword]);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), keywords, color });
  };

  const isEditing = !!category;

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Tag size={16} className="text-primary" />
          </div>
          {isEditing ? "Edit Category" : "Add Category"}
        </CardTitle>
        <CardDescription>
          {isEditing 
            ? "Update the category settings and keywords" 
            : "Create a new category for organizing transactions"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm flex items-center gap-1.5">
              <Tag size={14} className="text-muted-foreground" />
              Category Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Subscriptions"
              disabled={!category?.isCustom && isEditing}
              className="bg-background/50"
            />
          </div>

          {/* Color field */}
          <div className="space-y-2">
            <Label htmlFor="color" className="text-sm flex items-center gap-1.5">
              <Palette size={14} className="text-muted-foreground" />
              Color
            </Label>
            <Select value={color} onValueChange={(v) => v && setColor(v)}>
              <SelectTrigger className="bg-background/50">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: getColorHex(color) }}
                    />
                    <span className="capitalize">{color}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {COLOR_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: getColorHex(c) }}
                      />
                      <span className="capitalize">{c}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Keywords field */}
          <div className="space-y-2">
            <Label htmlFor="keywords" className="text-sm flex items-center gap-1.5">
              <Key size={14} className="text-muted-foreground" />
              Keywords
              <span className="text-muted-foreground/60 font-normal">(for auto-categorization)</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="keywords"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleKeywordKeyDown}
                placeholder="Add keyword and press Enter"
                className="bg-background/50"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={handleAddKeyword}
                className="flex-shrink-0"
              >
                <Plus size={16} weight="bold" />
              </Button>
            </div>
            
            {/* Keywords list */}
            <div className="flex flex-wrap gap-1.5 mt-3 min-h-[32px] p-2 rounded-lg bg-muted/30 border border-border/30">
              {keywords.length > 0 ? (
                keywords.map((keyword) => (
                  <div
                    key={keyword}
                  >
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive/20 hover:text-destructive transition-colors gap-1"
                      onClick={() => handleRemoveKeyword(keyword)}
                    >
                      {keyword}
                      <X size={10} weight="bold" />
                    </Badge>
                  </div>
                ))
              ) : (
                <span className="text-xs text-muted-foreground/60 px-1">
                  No keywords added yet
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-3">
            <Button type="submit" disabled={!name.trim()} className="shadow-glow-sm">
              {isEditing ? "Save Changes" : "Add Category"}
            </Button>
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function getColorHex(color: string): string {
  const colorMap: Record<string, string> = {
    orange: "#f97316",
    green: "#22c55e",
    blue: "#3b82f6",
    red: "#ef4444",
    purple: "#a855f7",
    pink: "#ec4899",
    cyan: "#06b6d4",
    yellow: "#eab308",
    indigo: "#6366f1",
    lime: "#84cc16",
    gray: "#6b7280",
    emerald: "#10b981",
    slate: "#64748b",
  };
  return colorMap[color] || colorMap.slate;
}
