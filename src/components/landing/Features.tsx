import { 
  FileArrowUp, 
  Tag, 
  Database, 
  Palette, 
  ChartPie, 
  Export 
} from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: FileArrowUp,
    title: "Smart CSV Import",
    description: "Drag & drop any bank statement CSV. Intelligent column detection automatically maps Date, Description, Amount fields.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Tag,
    title: "Auto-Categorization",
    description: "13+ Indian merchant categories built-in. Swiggy, Zomato, Amazon, Zepto — transactions categorized instantly.",
    color: "text-income",
    bgColor: "bg-income/10",
  },
  {
    icon: Database,
    title: "100% Local Storage",
    description: "All data lives in your browser's localStorage. Zero network calls, zero servers, zero tracking.",
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
  {
    icon: Palette,
    title: "Custom Categories",
    description: "Create, edit, and color-code your own spending categories. Add custom keywords for smarter matching.",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  {
    icon: ChartPie,
    title: "Interactive Dashboard",
    description: "Beautiful donut charts, spending trends, top merchants. Click any category to filter and drill down.",
    color: "text-expense",
    bgColor: "bg-expense/10",
  },
  {
    icon: Export,
    title: "Export Anytime",
    description: "Download your categorized transactions as CSV. Your data, your format, your control.",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Everything you need to track finances
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features that respect your privacy. No compromises.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              variant="default"
              hover="lift"
              className="group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="pt-6">
                <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-4 transition-transform group-hover:scale-110`}>
                  <feature.icon weight="duotone" className={`size-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
