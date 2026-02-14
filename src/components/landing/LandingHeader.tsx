import { Link } from "react-router-dom";
import { Sun, Moon, List, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";

export function LandingHeader() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Privacy", href: "#privacy" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative size-8 rounded-lg bg-primary flex items-center justify-center overflow-hidden">
              <span className="font-mono text-sm font-bold text-primary-foreground">FT</span>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            </div>
            <span className="text-lg font-semibold tracking-tight">FinTrack</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? (
                <Sun weight="duotone" className="size-5" />
              ) : (
                <Moon weight="duotone" className="size-5" />
              )}
            </Button>

            <Link to="/app/upload" className="hidden sm:block">
              <Button size="sm">Get Started</Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X weight="bold" className="size-5" />
              ) : (
                <List weight="bold" className="size-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/app/upload"
                className="mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
