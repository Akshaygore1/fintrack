import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatCompactCurrency,
  formatCurrency,
} from "@/lib/transactionHelpers";
import { useNavigate } from "react-router-dom";
import type { CategorySummary } from "@/types";
import { motion } from "framer-motion";


const CHART_COLORS = [
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#6366f1", // indigo-500
  "#14b8a6", // teal-500
];

interface CategoryDonutChartProps {
  data: CategorySummary[];
}

export function CategoryDonutChart({ data }: CategoryDonutChartProps) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number | undefined>();


  const chartData = data
    .filter((d) => d.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const totalExpenses = chartData.reduce((sum, item) => sum + item.total, 0);

  if (chartData.length === 0) {
    return (
      <Card className="h-full border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center text-muted-foreground">
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
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;

    return (
      <g>
        <text
          x={cx}
          y={cy}
          dy={-20}
          textAnchor="middle"
          fill="#64748b"
          fontSize={12}
        >
          {payload.category}
        </text>
        <text
          x={cx}
          y={cy}
          dy={5}
          textAnchor="middle"
          fill="#334155"
          fontSize={16}
          fontWeight="bold"
        >
          {formatCompactCurrency(value)}
        </text>
        <text
          x={cx}
          y={cy}
          dy={25}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize={12}
        >
          {`${(percent * 100).toFixed(1)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
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
      className="h-full"
    >
      <Card className="h-full border-0 shadow-sm bg-card/50">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-medium text-foreground/80">
            Category-wise Spending
          </CardTitle>
        </CardHeader>
        <CardContent className="relative flex justify-center">
          <div className="w-full h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  // @ts-ignore
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="total"
                  nameKey="category"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  onClick={(data) => handleCategoryClick(data.category)}
                  animationDuration={1000}
                  animationBegin={200}
                  // @ts-ignore
                  className="cursor-pointer"
                >
                  {chartData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-popover/95 backdrop-blur-sm p-3 shadow-xl border border-border ring-1 ring-foreground/5 rounded-lg z-50">
                          <p className="font-semibold text-foreground">
                            {data.category}
                          </p>
                          <div className="flex items-baseline gap-2 mt-1">
                            <p className="text-lg font-bold text-foreground">
                              {formatCurrency(data.total)}
                            </p>
                            <span className="text-sm text-muted-foreground font-medium">
                              ({data.percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground/70 mt-1">
                            {data.count} transactions
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>


          {!activeIndex && activeIndex !== 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Total
              </p>
              <p className="text-xl font-bold text-foreground">
                {formatCompactCurrency(totalExpenses)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
