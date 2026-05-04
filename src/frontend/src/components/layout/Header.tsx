import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/" },
  { label: "Pricing", to: "/pricing" },
  { label: "Free Audit", to: "/audit" },
] as const;

function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 group"
      data-ocid="header.logo_link"
    >
      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
        <span className="text-primary-foreground font-display font-bold text-sm tracking-tight">
          G
        </span>
      </div>
      <span className="font-display font-semibold text-base tracking-tight">
        <span className="text-primary">Gulf</span>
        <span className="text-foreground">Growth</span>
        <span className="text-muted-foreground font-medium"> Pro</span>
      </span>
    </Link>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <header
      className="sticky top-0 z-50 bg-card border-b border-border shadow-sm"
      data-ocid="header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Logo />

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              link.to === "/"
                ? currentPath === "/"
                : currentPath.startsWith(link.to.replace("/#", "/"));
            return (
              <Link
                key={link.label}
                to={link.to.startsWith("/#") ? "/" : link.to}
                className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                data-ocid={`header.nav_${link.label.toLowerCase().replace(" ", "_")}_link`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button
                variant="outline"
                size="sm"
                data-ocid="header.dashboard_button"
                className="font-medium"
              >
                Dashboard
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={login}
              data-ocid="header.login_button"
              className="font-medium"
            >
              Login
            </Button>
          )}
          <Link to="/audit">
            <Button
              size="sm"
              data-ocid="header.audit_cta_button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm"
            >
              Get Free Audit
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          data-ocid="header.mobile_menu_toggle"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-card border-b border-border overflow-hidden"
            data-ocid="header.mobile_menu"
          >
            <nav className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to.startsWith("/#") ? "/" : link.to}
                  className="px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileOpen(false)}
                  data-ocid={`header.mobile_nav_${link.label.toLowerCase().replace(" ", "_")}_link`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 pb-1 flex flex-col gap-2">
                {isAuthenticated ? (
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full"
                      data-ocid="header.mobile_dashboard_button"
                    >
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={login}
                    data-ocid="header.mobile_login_button"
                  >
                    Login
                  </Button>
                )}
                <Link to="/audit" onClick={() => setMobileOpen(false)}>
                  <Button
                    className="w-full bg-primary text-primary-foreground font-semibold"
                    data-ocid="header.mobile_audit_button"
                  >
                    Get Free Audit
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
