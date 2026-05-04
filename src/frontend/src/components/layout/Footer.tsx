import { Link } from "@tanstack/react-router";
import { SiInstagram, SiWhatsapp } from "react-icons/si";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/" },
  { label: "Pricing", to: "/pricing" },
  { label: "Free Audit", to: "/audit" },
  { label: "Dashboard", to: "/dashboard" },
];

const SUPPORT_LINKS = [
  { label: "Contact Us", href: "/#contact" },
  { label: "Privacy Policy", href: "/" },
  { label: "Terms of Service", href: "/" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-card border-t border-border" data-ocid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="flex items-center gap-2.5 mb-4"
              data-ocid="footer.logo_link"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <span className="text-primary-foreground font-display font-bold text-sm">
                  G
                </span>
              </div>
              <span className="font-display font-semibold text-base tracking-tight">
                <span className="text-primary">Gulf</span>
                <span className="text-foreground">Growth</span>
                <span className="text-muted-foreground font-medium"> Pro</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Helping Gulf businesses grow through Google ranking, Instagram
              management, WhatsApp lead funnels, and monthly growth plans.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                data-ocid="footer.instagram_link"
              >
                <SiInstagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/971500000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact us on WhatsApp"
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                data-ocid="footer.whatsapp_link"
              >
                <SiWhatsapp className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-sm text-foreground mb-4 uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to.startsWith("/#") ? "/" : link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    data-ocid={`footer.${link.label.toLowerCase().replace(" ", "_")}_link`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-display font-semibold text-sm text-foreground mb-4 uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <p className="text-xs text-muted-foreground font-medium mb-1">
                Gulf Coverage
              </p>
              <p className="text-xs text-muted-foreground">
                UAE · Saudi · Qatar · Kuwait · Bahrain · Oman
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} GulfGrowth Pro. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with love using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
