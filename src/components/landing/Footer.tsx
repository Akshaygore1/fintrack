import { Link } from "react-router-dom";
import { GithubLogo, Heart } from "@phosphor-icons/react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Dashboard", href: "/app/dashboard" },
      { label: "Upload CSV", href: "/app/upload" },
      { label: "Transactions", href: "/app/transactions" },
      { label: "Settings", href: "/app/settings" },
    ],
    resources: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Privacy", href: "#privacy" },
      { label: "FAQ", href: "#faq" },
    ],
  };

  return (
    <footer className="border-t border-border/50 bg-muted/20">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="relative size-8 rounded-lg bg-primary flex items-center justify-center overflow-hidden">
                <span className="font-mono text-sm font-bold text-primary-foreground">FT</span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              </div>
              <span className="text-lg font-semibold tracking-tight">FinTrack</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
              A privacy-first personal finance tracker. Import bank statements, 
              auto-categorize transactions, and visualize your spending — all locally.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 rounded-lg bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                <GithubLogo weight="duotone" className="size-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} FinTrack. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            Built with <Heart weight="fill" className="size-4 text-expense" /> for privacy
          </p>
        </div>
      </div>
    </footer>
  );
}
