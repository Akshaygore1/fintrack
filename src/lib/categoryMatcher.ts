import type { Category } from "@/types";

export function categorizeTransaction(
  description: string,
  amount: number,
  categories: Category[]
): string {
  const isIncome = amount > 0;
  const descLower = description.toLowerCase();


  if (isIncome) {
    const incomeCategory = categories.find((c) => c.name === "Income");
    if (incomeCategory) {

      if (
        incomeCategory.keywords.some((kw) => descLower.includes(kw.toLowerCase()))
      ) {
        return "Income";
      }
    }
    return "Income";
  }


  if (descLower.includes("upi-")) {

    const upiPattern = /upi-[a-z\s]+-\d{10}/i;
    if (upiPattern.test(descLower)) {

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


  const sortedCategories = categories
    .filter(
      (c) =>
        c.isActive &&
        c.name !== "Income" &&
        c.name !== "Other" &&
        c.name !== "Personal Transfers"
    )
    .sort((a, b) => {

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


  return "Other";
}
