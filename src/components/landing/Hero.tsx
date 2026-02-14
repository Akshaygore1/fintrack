import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, CloudSlash } from "@phosphor-icons/react";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-mesh opacity-60" />
      <div className="absolute top-1/4 -left-32 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 size-96 rounded-full bg-income/10 blur-3xl" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--color-foreground) 1px, transparent 1px),
                           linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-32 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-sm backdrop-blur-sm">
          <CloudSlash weight="duotone" className="size-4 text-primary" />
          <span className="text-muted-foreground">100% Local</span>
          <span className="text-border">|</span>
          <ShieldCheck weight="duotone" className="size-4 text-income" />
          <span className="text-muted-foreground">Privacy First</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          Track Your Finances,
          <br />
          <span className="bg-gradient-to-r from-primary via-primary to-income bg-clip-text text-transparent">
            Privately
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10">
          A local-first personal finance tracker built for India. Import bank statements, 
          auto-categorize transactions, and visualize spending — all without your data 
          ever leaving your device.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/app/upload">
            <Button size="lg" className="h-12 px-8 text-base gap-2 group">
              Get Started Free
              <ArrowRight 
                weight="bold" 
                className="size-4 transition-transform group-hover:translate-x-1" 
              />
            </Button>
          </Link>
          <a href="#features">
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              See Features
            </Button>
          </a>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-income" />
            <span>No account required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-primary" />
            <span>Works offline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-chart-4" />
            <span>Free forever</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="h-12 w-px bg-gradient-to-b from-muted-foreground/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
