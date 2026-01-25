import type { Category } from "@/types";

export function categorizeTransaction(
  description: string,
  amount: number,
  categories: Category[]
): string {
  const isIncome = amount > 0;
  const descLower = description.toLowerCase();

  // Priority 1: Check income first for deposits
  if (isIncome) {
    const incomeCategory = categories.find((c) => c.name === "Income");
    if (incomeCategory) {
      // Check if matches income keywords
      if (
        incomeCategory.keywords.some((kw) => descLower.includes(kw.toLowerCase()))
      ) {
        return "Income";
      }
    }
    return "Income"; // All deposits default to income
  }

  // Priority 2: Check for personal transfers (UPI pattern)
  if (descLower.includes("upi-")) {
    // Pattern: UPI-NAME-1234567890 (phone number)
    const upiPattern = /upi-[a-z\s]+-\d{10}/i;
    if (upiPattern.test(descLower)) {
      // Ensure it's not a merchant (check if any category keyword matches)
      const hasOtherMatch = categories.some(
        (c) =>
          c.name !== "Personal Transfers" &&
          c.name !== "Other" &&
          c.keywords.some((kw) => descLower.includes(kw.toLowerCase()))
      );
      if (!hasOtherMatch) {
        return "Personal Transfers";
      }
    }
  }

  // Priority 3: Match against all other categories (longest keyword first)
  const sortedCategories = categories
    .filter(
      (c) =>
        c.isActive &&
        c.name !== "Income" &&
        c.name !== "Other" &&
        c.name !== "Personal Transfers"
    )
    .sort((a, b) => {
      // Sort by longest keyword first for better matching
      const aMax = Math.max(...a.keywords.map((k) => k.length), 0);
      const bMax = Math.max(...b.keywords.map((k) => k.length), 0);
      return bMax - aMax;
    });

  for (const category of sortedCategories) {
    for (const keyword of category.keywords) {
      if (descLower.includes(keyword.toLowerCase())) {
        return category.name;
      }
    }
  }

  // Default: Other
  return "Other";
}
