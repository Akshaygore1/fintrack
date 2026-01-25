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

interface SpendingGradientChartProps {
  transactions: Transaction[];
}

export function SpendingGradientChart({
  transactions,
}: SpendingGradientChartProps) {
  const chartData = useMemo(() => {
    const dailyMap = new Map<string, number>();

    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense",
    );

    if (expenseTransactions.length === 0) return [];

    expenseTransactions.forEach((t) => {
      // Create a date key YYYY-MM-DD for sorting
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
      // Format as MMM dd (e.g. Jan 01)
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
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Spending Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          No spending data available
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover/95 backdrop-blur-sm p-3 shadow-xl border border-border ring-1 ring-foreground/5 rounded-lg">
          <p className="font-medium text-foreground mb-1">{label}</p>
          <p className="text-lg font-bold text-primary">
            {formatCompactCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full border-0 shadow-sm bg-card/50">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-medium text-foreground/80">
          Spending Trends
        </CardTitle>
      </CardHeader>
      <CardContent className="px-1 pb-1">
        <div className="h-[300px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
                strokeOpacity={0.5}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCompactCurrency(value)}
                width={40}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "#8b5cf6",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#7c3aed"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSpending)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
