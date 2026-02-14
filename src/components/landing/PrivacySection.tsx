import { 
  ShieldCheck, 
  CloudSlash, 
  WifiSlash, 
  UserCircle,
  LockKey,
  Eye
} from "@phosphor-icons/react";

const privacyFeatures = [
  {
    icon: CloudSlash,
    title: "No Server Communication",
    description: "Your financial data never leaves your browser. Zero API calls, zero data transmission.",
  },
  {
    icon: LockKey,
    title: "Browser Storage Only",
    description: "All data stored in localStorage. You can clear it anytime from browser settings.",
  },
  {
    icon: WifiSlash,
    title: "Works Offline",
    description: "Once loaded, the app works completely offline. No internet connection needed.",
  },
  {
    icon: UserCircle,
    title: "No Account Required",
    description: "No sign-up, no login, no email. Just open and start tracking immediately.",
  },
];

export function PrivacySection() {
  return (
    <section id="privacy" className="relative py-24 sm:py-32 bg-muted/30 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-income/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-primary/5 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-income/30 bg-income/10 px-4 py-2 text-sm mb-6">
              <ShieldCheck weight="duotone" className="size-4 text-income" />
              <span className="text-income font-medium">Privacy First</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
              Your data stays with you.
              <br />
              <span className="text-muted-foreground">Always.</span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              We built FinTrack with a simple philosophy: your financial data is yours alone. 
              Unlike cloud-based apps, we never see, store, or process your transactions on any server.
            </p>

            {/* Privacy features list */}
            <div className="space-y-4">
              {privacyFeatures.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex-shrink-0 size-10 rounded-xl bg-card border border-border/50 flex items-center justify-center">
                    <feature.icon weight="duotone" className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            <div className="relative bg-card rounded-2xl border border-border/50 p-8 shadow-xl">
              {/* Shield illustration */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="size-32 rounded-full bg-income/10 flex items-center justify-center">
                    <ShieldCheck weight="duotone" className="size-16 text-income" />
                  </div>
                  {/* Orbiting icons */}
                  <div className="absolute -top-2 -right-2 size-10 rounded-full bg-card border border-border flex items-center justify-center shadow-lg">
                    <LockKey weight="duotone" className="size-5 text-primary" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 size-10 rounded-full bg-card border border-border flex items-center justify-center shadow-lg">
                    <Eye weight="duotone" className="size-5 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Data flow visualization */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm">Your Device</span>
                  <div className="flex items-center gap-2 text-income text-sm font-medium">
                    <ShieldCheck weight="bold" className="size-4" />
                    Protected
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="h-8 w-px bg-border" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                  <span className="text-sm text-muted-foreground">External Servers</span>
                  <div className="flex items-center gap-2 text-destructive text-sm font-medium">
                    <CloudSlash weight="bold" className="size-4" />
                    No Access
                  </div>
                </div>
              </div>
            </div>

            {/* Floating decoration */}
            <div className="absolute -z-10 -top-4 -right-4 size-full rounded-2xl bg-gradient-to-br from-income/20 to-primary/20 blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
