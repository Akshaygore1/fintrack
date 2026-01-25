import { useState } from "react";
import { X, Plus } from "@phosphor-icons/react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {isEditing ? "Edit Category" : "Add Category"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Subscriptions"
              disabled={!category?.isCustom && isEditing}
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Select value={color} onValueChange={(v) => v && setColor(v)}>
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4"
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
                        className="w-4 h-4"
                        style={{ backgroundColor: getColorHex(c) }}
                      />
                      <span className="capitalize">{c}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (for auto-categorization)</Label>
            <div className="flex gap-2">
              <Input
                id="keywords"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleKeywordKeyDown}
                placeholder="Add keyword and press Enter"
              />
              <Button type="button" variant="outline" onClick={handleAddKeyword}>
                <Plus size={16} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleRemoveKeyword(keyword)}
                >
                  {keyword}
                  <X size={12} className="ml-1" />
                </Badge>
              ))}
              {keywords.length === 0 && (
                <span className="text-sm text-gray-400">No keywords added</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={!name.trim()}>
              {isEditing ? "Save Changes" : "Add Category"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
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
