import { CloudArrowUp, Columns, ChartLineUp } from "@phosphor-icons/react";

const steps = [
  {
    step: "01",
    icon: CloudArrowUp,
    title: "Upload",
    description: "Drag & drop your bank statement CSV file. Most Indian banks like HDFC, ICICI, SBI, Axis are supported.",
    color: "text-primary",
    borderColor: "border-primary/30",
    bgGradient: "from-primary/5 to-transparent",
  },
  {
    step: "02",
    icon: Columns,
    title: "Map",
    description: "Auto-detect columns or manually map Date, Description, Credit, Debit fields to match your CSV format.",
    color: "text-income",
    borderColor: "border-income/30",
    bgGradient: "from-income/5 to-transparent",
  },
  {
    step: "03",
    icon: ChartLineUp,
    title: "Analyze",
    description: "View auto-categorized transactions, spending charts, top merchants, and income sources — all instantly.",
    color: "text-chart-4",
    borderColor: "border-chart-4/30",
    bgGradient: "from-chart-4/5 to-transparent",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 bg-muted/30">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-50">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-border) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Get started in 3 simple steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From bank statement to financial insights in under a minute
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px bg-gradient-to-r from-border to-transparent" />
              )}

              <div className={`relative p-8 rounded-2xl border ${item.borderColor} bg-gradient-to-b ${item.bgGradient} bg-card/50 backdrop-blur-sm`}>
                {/* Step number */}
                <div className="absolute -top-4 left-8">
                  <span className={`font-mono text-sm font-bold ${item.color} bg-background px-3 py-1 rounded-full border ${item.borderColor}`}>
                    {item.step}
                  </span>
                </div>

                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-card border border-border/50 mb-6 mt-2`}>
                  <item.icon weight="duotone" className={`size-8 ${item.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
