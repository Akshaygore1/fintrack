import { TrendUp, TrendDown, Wallet, Scales } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { motion } from "framer-motion";

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  currentBalance: number;
  previousMonthData?: {
    income: number;
    expenses: number;
    net: number;
  };
}

export function SummaryCards({
  totalIncome,
  totalExpenses,
  netAmount,
  currentBalance,
  previousMonthData,
}: SummaryCardsProps) {
  const calculateTrend = (current: number, previous: number) => {
    if (!previous || previous === 0) return null;
    const percentChange = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(percentChange),
      isPositive: percentChange >= 0,
      direction: percentChange >= 0 ? "up" : "down",
    };
  };

  const incomeTrend = previousMonthData
    ? calculateTrend(totalIncome, previousMonthData.income)
    : null;
  const expenseTrend = previousMonthData
    ? calculateTrend(totalExpenses, previousMonthData.expenses)
    : null;
  const netTrend = previousMonthData
    ? calculateTrend(netAmount, previousMonthData.net)
    : null;

  const cards = [
    {
      title: "Total Income",
      value: totalIncome,
      icon: TrendUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      prefix: "+",
      trend: incomeTrend,
      trendGood: incomeTrend?.isPositive, // More income is good
    },
    {
      title: "Total Expenses",
      value: totalExpenses,
      icon: TrendDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      prefix: "-",
      trend: expenseTrend,
      trendGood: !expenseTrend?.isPositive, // Less expense is good
    },
    {
      title: "Net Amount",
      value: Math.abs(netAmount),
      icon: Scales,
      color: netAmount >= 0 ? "text-green-600" : "text-red-600",
      bgColor: netAmount >= 0 ? "bg-green-50" : "bg-red-50",
      borderColor: netAmount >= 0 ? "border-green-200" : "border-red-200",
      prefix: netAmount >= 0 ? "+" : "-",
      trend: netTrend,
      trendGood: netTrend?.isPositive, // More net is good
    },
    {
      title: "Current Balance",
      value: currentBalance,
      icon: Wallet,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      prefix: "",
      trend: null, // No trend for balance as it's cumulative
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {cards.map((card) => (
        <motion.div key={card.title} variants={item}>
          <Card
            className={cn(
              "border transition-all duration-200 hover:scale-[1.02] hover:shadow-md",
              card.borderColor
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <div className={cn("p-2.5", card.bgColor)}>
                  <card.icon size={20} className={card.color} weight="fill" />
                </div>
              </div>
              
              <div>
                <div className={cn("text-2xl font-bold tracking-tight", card.color)}>
                  <span className="mr-0.5">{card.prefix}</span>
                  <AnimatedNumber 
                    value={card.value} 
                    format="full" 
                    duration={1}
                  />
                </div>
                
                {card.trend && (
                  <div className="flex items-center mt-1 text-xs">
                    <span
                      className={cn(
                        "flex items-center font-medium",
                        card.trendGood ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {card.trend.direction === "up" ? "↑" : "↓"} {card.trend.value.toFixed(1)}%
                    </span>
                    <span className="text-gray-400 ml-1.5">vs last month</span>
                  </div>
                )}
                
                {!card.trend && (
                   <div className="flex items-center mt-1 text-xs text-gray-400">
                     <span className="opacity-0">Placeholder</span>
                   </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
