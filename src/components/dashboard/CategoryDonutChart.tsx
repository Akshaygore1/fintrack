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
import { ChartDonut, CaretRight } from "@phosphor-icons/react";

// Refined chart colors - harmonious with our theme
const CHART_COLORS = [
  "oklch(0.65 0.14 200)", // Teal
  "oklch(0.70 0.16 165)", // Mint
  "oklch(0.70 0.15 25)",  // Coral
  "oklch(0.75 0.14 85)",  // Amber
  "oklch(0.65 0.16 280)", // Purple
  "oklch(0.68 0.14 220)", // Blue
  "oklch(0.72 0.12 140)", // Green
  "oklch(0.70 0.15 350)", // Rose
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
      <Card variant="glass" className="h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ChartDonut size={20} weight="duotone" className="text-primary" />
            Spending by Category
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex flex-col items-center justify-center text-muted-foreground gap-3">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
            <ChartDonut size={32} weight="duotone" className="text-muted-foreground/50" />
          </div>
          <p className="text-sm">No expense data available</p>
        </CardContent>
      </Card>
    );
  }

  const onPieEnter = (_: unknown, index: number) => {
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
          fill="oklch(0.60 0.015 250)"
          fontSize={12}
          fontWeight={500}
        >
          {payload.category}
        </text>
        <text
          x={cx}
          y={cy}
          dy={5}
          textAnchor="middle"
          fill="oklch(0.93 0.01 250)"
          fontSize={18}
          fontWeight="bold"
          fontFamily="JetBrains Mono Variable, monospace"
        >
          {formatCompactCurrency(value)}
        </text>
        <text
          x={cx}
          y={cy}
          dy={28}
          textAnchor="middle"
          fill="oklch(0.50 0.015 250)"
          fontSize={12}
        >
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
          cornerRadius={6}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius - 8}
          outerRadius={innerRadius - 4}
          fill={fill}
          opacity={0.6}
        />
      </g>
    );
  };

  return (
    <div
      className="h-full"
    >
      <Card variant="glass" hover="glow" className="h-full">
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-semibold text-foreground/90 flex items-center gap-2">
            <ChartDonut size={18} weight="duotone" className="text-primary" />
            Spending by Category
          </CardTitle>
        </CardHeader>
        <CardContent className="relative flex flex-col lg:flex-row items-center justify-center gap-4 pt-4">
          <div className="w-full lg:w-1/2 h-[280px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%" minHeight={280}>
              <PieChart>
                <Pie
                  // @ts-ignore - activeIndex prop exists in recharts but types are outdated
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="total"
                  nameKey="category"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  onClick={(data) => handleCategoryClick(data.category)}
                  animationDuration={800}
                  animationBegin={200}
                  className="cursor-pointer outline-none"
                  stroke="none"
                >
                  {chartData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                      className="transition-all duration-300"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-popover/95 backdrop-blur-xl p-3 shadow-xl border border-border/50 rounded-xl">
                          <p className="font-semibold text-foreground">
                            {data.category}
                          </p>
                          <div className="flex items-baseline gap-2 mt-1">
                            <p className="text-lg font-bold font-mono text-foreground">
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

            {/* Center content when no segment is active */}
            {activeIndex === undefined && (
              <div className="absolute top-1/2 left-1/4 lg:left-1/4 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  Total
                </p>
                <p className="text-xl font-bold font-mono text-foreground">
                  {formatCompactCurrency(totalExpenses)}
                </p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="w-full lg:w-1/2 space-y-2 px-2">
            {chartData.map((item, index) => (
              <button
                key={item.category}
                onClick={() => handleCategoryClick(item.category)}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 group ${
                  activeIndex === index 
                    ? "bg-accent" 
                    : "hover:bg-accent/50"
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                />
                <span className="text-sm font-medium text-foreground/80 truncate flex-1 text-left">
                  {item.category}
                </span>
                <span className="text-sm font-mono font-semibold text-foreground tabular-nums">
                  {formatCompactCurrency(item.total)}
                </span>
                <CaretRight 
                  size={14} 
                  className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" 
                />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
