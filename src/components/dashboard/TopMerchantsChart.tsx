import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactCurrency } from "@/lib/transactionHelpers";
import type { MerchantSummary } from "@/types";

interface TopMerchantsChartProps {
  data: MerchantSummary[];
}

export function TopMerchantsChart({ data }: TopMerchantsChartProps) {
  // Take top 10 merchants by total spending
  const chartData = data
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
    .map((d) => ({
      ...d,
      // Truncate long merchant names
      displayName: d.merchant.length > 15 ? d.merchant.substring(0, 15) + "..." : d.merchant,
    }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Merchants</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          No merchant data available
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover p-3 shadow-lg border border-border">
          <p className="font-medium">{data.merchant}</p>
          <p className="text-sm text-muted-foreground">
            Total: {formatCompactCurrency(data.total)}
          </p>
          <p className="text-xs text-muted-foreground/70">
            {data.count} transactions (Avg: {formatCompactCurrency(data.avgTransaction)})
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top Merchants</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              tickFormatter={(value) => formatCompactCurrency(value)}
            />
            <YAxis
              type="category"
              dataKey="displayName"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              width={75}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" fill="#6366f1" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
