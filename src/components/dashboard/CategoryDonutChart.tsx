import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactCurrency, formatCurrency } from "@/lib/transactionHelpers";
import { useNavigate } from "react-router-dom";
import type { CategorySummary } from "@/types";
import { motion } from "framer-motion";

// Tailwind colors for the chart
const CHART_COLORS: Record<string, string> = {
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

interface CategoryDonutChartProps {
  data: CategorySummary[];
}

export function CategoryDonutChart({ data }: CategoryDonutChartProps) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  
  // Sort by total and take top categories
  const chartData = data
    .filter((d) => d.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  const totalExpenses = chartData.reduce((sum, item) => sum + item.total, 0);

  if (chartData.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          No expense data available
        </CardContent>
      </Card>
    );
  }

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/transactions?category=${encodeURIComponent(category)}`);
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    
    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#64748b" fontSize={12}>
          {payload.category}
        </text>
        <text x={cx} y={cy} dy={5} textAnchor="middle" fill="#334155" fontSize={16} fontWeight="bold">
          {formatCompactCurrency(value)}
        </text>
        <text x={cx} y={cy} dy={25} textAnchor="middle" fill="#94a3b8" fontSize={12}>
          {`${(percent * 100).toFixed(1)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          cornerRadius={4}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius - 6}
          outerRadius={innerRadius - 2}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg flex justify-between items-center">
            Spending by Category
            <span className="text-sm font-normal text-muted-foreground">
              Total: {formatCompactCurrency(totalExpenses)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                // @ts-ignore - activeIndex is valid but missing in some types
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={105}
                paddingAngle={3}
                dataKey="total"
                nameKey="category"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                onClick={(data) => handleCategoryClick(data.category)}
                animationDuration={1000}
                animationBegin={200}
                // @ts-ignore - className is valid but missing in types
                className="cursor-pointer"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}-${entry.category}`} 
                    // @ts-ignore
                    fill={CHART_COLORS[entry.color] || CHART_COLORS.slate}
                    strokeWidth={0}
                  />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover/95 backdrop-blur-sm p-3 shadow-xl border border-border ring-1 ring-foreground/5">
                        <p className="font-semibold text-foreground">{data.category}</p>
                        <div className="flex items-baseline gap-2 mt-1">
                          <p className="text-lg font-bold text-foreground">
                            {formatCurrency(data.total)}
                          </p>
                          <span className="text-sm text-muted-foreground font-medium">
                            ({data.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground/70 mt-1">{data.count} transactions</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
                formatter={(value, entry: any) => (
                  <span className="text-sm text-muted-foreground font-medium ml-1">
                    {value}
                  </span>
                )}
                wrapperStyle={{ paddingLeft: "20px" }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Default center content when no active index */}
          {!activeIndex && activeIndex !== 0 && (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pr-[110px]">
               <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Top Spend</p>
               <p className="text-xl font-bold text-foreground">{formatCompactCurrency(chartData[0]?.total || 0)}</p>
             </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
