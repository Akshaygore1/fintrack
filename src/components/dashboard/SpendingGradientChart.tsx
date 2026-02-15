import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactCurrency } from "@/lib/transactionHelpers";
import { useMemo } from "react";
import type { Transaction } from "@/types";
import { TrendUp, ChartLineUp } from "@phosphor-icons/react";

interface SpendingGradientChartProps {
  transactions: Transaction[];
}

function SpendingGradientChart({
  transactions,
}: SpendingGradientChartProps) {
  const chartData = useMemo(() => {
    const dailyMap = new Map<string, number>();

    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense",
    );

    if (expenseTransactions.length === 0) return [];

    expenseTransactions.forEach((t) => {
      const dateDate = new Date(t.date);
      const year = dateDate.getFullYear();
      const month = String(dateDate.getMonth() + 1).padStart(2, "0");
      const day = String(dateDate.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`;

      const current = dailyMap.get(dateKey) || 0;
      dailyMap.set(dateKey, current + Math.abs(t.amount));
    });

    const sortedDates = Array.from(dailyMap.keys()).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });

    return sortedDates.map((date) => {
      const d = new Date(date);
      const formattedDate = d.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });
      return {
        date: formattedDate,
        fullDate: date,
        amount: dailyMap.get(date)!,
      };
    });
  }, [transactions]);

  if (chartData.length === 0) {
    return (
      <Card variant="glass" className="h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendUp size={20} weight="duotone" className="text-primary" />
            Spending Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex flex-col items-center justify-center text-muted-foreground gap-3">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
            <ChartLineUp size={32} weight="duotone" className="text-muted-foreground/50" />
          </div>
          <p className="text-sm">No spending data available</p>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover/95 backdrop-blur-xl p-3 shadow-xl border border-border/50 rounded-xl">
          <p className="font-medium text-foreground/80 text-sm mb-1">{label}</p>
          <p className="text-lg font-bold font-mono text-expense">
            {formatCompactCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="h-full"
    >
      <Card variant="glass" hover="glow" className="h-full">
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-semibold text-foreground/90 flex items-center gap-2">
            <TrendUp size={18} weight="duotone" className="text-expense" />
            Spending Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-2">
          <div className="h-[300px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.70 0.15 25)" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="oklch(0.70 0.15 25)" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="oklch(0.70 0.15 25)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.25 0.02 250)"
                  vertical={false}
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "oklch(0.55 0.015 250)" }}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "oklch(0.55 0.015 250)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCompactCurrency(value)}
                  width={50}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "oklch(0.70 0.15 25)",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="oklch(0.70 0.15 25)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSpending)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "oklch(0.70 0.15 25)",
                    stroke: "oklch(0.13 0.015 250)",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SpendingGradientChart;
