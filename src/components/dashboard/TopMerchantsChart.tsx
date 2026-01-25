import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactCurrency } from "@/lib/transactionHelpers";
import type { MerchantSummary } from "@/types";

interface TopMerchantsChartProps {
  data: MerchantSummary[];
}

export function TopMerchantsChart({ data }: TopMerchantsChartProps) {

  const tableData = data.sort((a, b) => b.total - a.total).slice(0, 10);

  if (tableData.length === 0) {
    return (
      <Card className="h-full border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Top Spendings</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center text-muted-foreground">
          No spending data available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-0 shadow-sm bg-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-foreground/80">
          Top Spendings
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="w-full">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Merchant</th>
                <th className="px-6 py-3 font-medium text-right">Count</th>
                <th className="px-6 py-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-border/50 hover:bg-muted/50 transition-colors last:border-0"
                >
                  <td className="px-6 py-4 font-medium text-foreground truncate max-w-[150px]">
                    {item.merchant}
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground">
                    {item.count}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-red-500">
                    {formatCompactCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
