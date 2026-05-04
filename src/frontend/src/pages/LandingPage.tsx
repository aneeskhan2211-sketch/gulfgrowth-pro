import { Layout as PageLayout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { GULF_COUNTRIES, PRICING_PLANS } from "@/data/constants";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart,
  BarChart2,
  Calendar,
  CalendarX,
  CheckCircle2,
  Eye,
  FileText,
  Globe,
  Instagram,
  MapPin,
  Megaphone,
  MessageCircle,
  Monitor,
  Phone,
  PhoneOff,
  Search,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

// ─── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: {
    duration: 0.55,
    delay,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: {
    duration: 0.5,
    delay,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  },
});

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({
  badge,
  title,
  subtitle,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center mb-12">
      {badge && (
        <motion.div {...fadeIn(0)}>
          <Badge
            variant="secondary"
            className="mb-4 px-3 py-1 text-xs uppercase tracking-widest font-semibold"
          >
            {badge}
          </Badge>
        </motion.div>
      )}
      <motion.h2
        {...fadeUp(0.05)}
        className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          {...fadeUp(0.1)}
          className="text-muted-foreground text-lg max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

// ─── SECTION 1: Hero ─────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      data-ocid="landing.hero"
      className="relative overflow-hidden bg-background pt-20 pb-16 md:pt-28 md:pb-24"
      id="hero"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-gulf-growth.dim_1400x700.jpg')",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 60% 40%, oklch(0.68 0.14 71 / 0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 20% 80%, oklch(0.53 0.17 254 / 0.08) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div {...fadeIn(0)} className="mb-5">
            <Badge className="bg-primary/10 text-primary border-primary/30 px-4 py-1.5 text-sm font-medium">
              🇦🇪 Gulf&#39;s #1 Digital Growth Platform
            </Badge>
          </motion.div>

          <motion.h1
            {...fadeUp(0.05)}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight"
          >
            Get More Customers for Your{" "}
            <span style={{ color: "oklch(0.68 0.14 71)" }}>Gulf Business</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.1)}
            className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            We build your Google ranking, Instagram presence, WhatsApp lead
            system, and website so customers can find and contact you faster.
          </motion.p>

          <motion.div
            {...fadeUp(0.15)}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/audit">
              <Button
                data-ocid="landing.hero.audit_button"
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.68 0.14 71), oklch(0.62 0.16 55))",
                  color: "white",
                }}
              >
                Get Free Audit <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button
                data-ocid="landing.hero.pricing_button"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-base font-semibold border-2 hover:bg-secondary/5 transition-all duration-300"
                style={{
                  borderColor: "oklch(0.53 0.17 254)",
                  color: "oklch(0.53 0.17 254)",
                }}
              >
                View Plans
              </Button>
            </Link>
          </motion.div>

          <motion.div
            {...fadeUp(0.2)}
            className="grid grid-cols-3 gap-6 max-w-2xl mx-auto"
          >
            {[
              { value: "500+", label: "Gulf Businesses" },
              { value: "6", label: "Gulf Countries" },
              { value: "42%", label: "Avg. Growth" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                {...fadeUp(0.2 + i * 0.08)}
                className="text-center p-4 rounded-2xl bg-card border border-border/60 shadow-sm"
              >
                <div
                  className="font-display text-2xl md:text-3xl font-bold mb-1"
                  style={{ color: "oklch(0.68 0.14 71)" }}
                >
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-xs font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 2: Problems ──────────────────────────────────────────────────────
const PROBLEMS = [
  {
    icon: Search,
    title: "No Google Ranking",
    desc: "Your business doesn't appear when customers search nearby on Google Maps.",
    color: "oklch(0.62 0.22 25)",
  },
  {
    icon: Instagram,
    title: "Weak Instagram Page",
    desc: "Inconsistent posts, low engagement, and no content strategy holding you back.",
    color: "oklch(0.58 0.19 340)",
  },
  {
    icon: PhoneOff,
    title: "Low WhatsApp Inquiries",
    desc: "Potential customers visit your profile but never tap to start a conversation.",
    color: "oklch(0.6 0.2 25)",
  },
  {
    icon: Globe,
    title: "No Website",
    desc: "Without a website, you lose trust and miss customers who research before buying.",
    color: "oklch(0.55 0.18 290)",
  },
  {
    icon: BarChart2,
    title: "No Ad Tracking",
    desc: "Running ads but unsure what's working? You're burning budget without data.",
    color: "oklch(0.58 0.2 25)",
  },
  {
    icon: TrendingUp,
    title: "Competitors Getting More Leads",
    desc: "Rivals appear above you on every platform while you're invisible to your market.",
    color: "oklch(0.62 0.22 25)",
  },
];

function ProblemsSection() {
  return (
    <section
      data-ocid="landing.problems"
      className="py-20 md:py-28"
      id="problems"
      style={{ background: "oklch(0.97 0.005 25 / 0.5)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader
          badge="Sound Familiar?"
          title="Is Your Business Struggling With These?"
          subtitle="Most Gulf SMBs face the same digital challenges. You're not alone — and we've solved them for 500+ businesses."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROBLEMS.map((p, i) => (
            <motion.div
              key={p.title}
              {...fadeUp(i * 0.08)}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card className="h-full border border-border/60 hover:border-destructive/30 hover:shadow-md transition-all duration-300 bg-card">
                <CardContent className="p-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: `${p.color.slice(0, -1)} / 0.12)`.replace(
                        "oklch(",
                        "oklch(",
                      ),
                    }}
                  >
                    <p.icon className="h-6 w-6" style={{ color: p.color }} />
                  </div>
                  <h3 className="font-display font-semibold text-base mb-2 text-foreground">
                    {p.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {p.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 3: Services ──────────────────────────────────────────────────────
const SERVICE_CARDS = [
  {
    icon: MapPin,
    name: "Google Business Optimization",
    desc: "Rank in the top 3 on Google Maps so local customers find you first, not your competitors.",
    id: "google-business",
  },
  {
    icon: Instagram,
    name: "Instagram Management",
    desc: "Professional posts, reels, and stories that build your brand image and attract daily followers.",
    id: "instagram",
  },
  {
    icon: MessageCircle,
    name: "WhatsApp Lead Funnel",
    desc: "Automated responses and follow-up sequences that turn every inquiry into a confirmed booking.",
    id: "whatsapp",
  },
  {
    icon: Monitor,
    name: "Landing Page / Website",
    desc: "Fast, mobile-first web presence designed to convert visitors into paying customers in 72 hours.",
    id: "website",
  },
  {
    icon: Megaphone,
    name: "Meta Ads Setup",
    desc: "Facebook & Instagram campaigns hyper-targeted to your Gulf city, language, and customer profile.",
    id: "meta-ads",
  },
  {
    icon: Star,
    name: "Review & Rating Growth",
    desc: "Systematic campaigns that fill your Google profile with 5-star reviews from real customers.",
    id: "reviews",
  },
  {
    icon: Search,
    name: "Local SEO",
    desc: "Optimise your online presence so nearby customers discover you organically on every platform.",
    id: "seo",
  },
  {
    icon: Calendar,
    name: "Monthly Content Calendar",
    desc: "30 days of ready-to-post content tailored to Gulf culture, your audience, and trending topics.",
    id: "content",
  },
  {
    icon: BarChart,
    name: "Business Analytics Dashboard",
    desc: "Real-time leads, reach, and ROI tracked in one clean Gulf-focused dashboard with live numbers.",
    id: "analytics",
  },
];

function ServicesSection() {
  return (
    <section
      data-ocid="landing.services"
      className="py-20 md:py-28 bg-background"
      id="services"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader
          badge="What We Do"
          title="Our Digital Growth Services"
          subtitle="Everything a Gulf small business needs to get found, trusted, and chosen — under one roof."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICE_CARDS.map((s, i) => (
            <motion.div
              key={s.id}
              {...fadeUp(i * 0.07)}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card className="h-full group cursor-pointer border border-border/60 hover:border-primary/50 hover:shadow-lg transition-all duration-300 bg-card">
                <CardContent className="p-6 flex flex-col h-full">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                    style={{ background: "oklch(0.68 0.14 71 / 0.1)" }}
                  >
                    <s.icon
                      className="h-6 w-6"
                      style={{ color: "oklch(0.68 0.14 71)" }}
                    />
                  </div>
                  <h3 className="font-display font-semibold text-base mb-2 text-foreground">
                    {s.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                    {s.desc}
                  </p>
                  <div
                    className="mt-4 flex items-center gap-1 text-sm font-medium"
                    style={{ color: "oklch(0.68 0.14 71)" }}
                  >
                    Learn More <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 4: Audit CTA ─────────────────────────────────────────────────────
function AuditCTASection() {
  return (
    <section
      data-ocid="landing.audit_cta"
      className="py-20 md:py-28 relative overflow-hidden"
      id="free-audit"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.68 0.14 71) 0%, oklch(0.62 0.16 55) 40%, oklch(0.58 0.15 45) 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full"
        style={{ background: "oklch(0.99 0 0 / 0.06)" }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full"
        style={{ background: "oklch(0.99 0 0 / 0.05)" }}
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div {...fadeIn(0)} className="mb-4">
          <Zap className="h-10 w-10 mx-auto mb-4" style={{ color: "white" }} />
        </motion.div>
        <motion.h2
          {...fadeUp(0.05)}
          className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight"
          style={{ color: "white" }}
        >
          Find Out Where Your Business Stands
        </motion.h2>
        <motion.p
          {...fadeUp(0.1)}
          className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
          style={{ color: "oklch(0.99 0 0 / 0.85)" }}
        >
          Get your free instant audit — see your Google ranking, Instagram
          trust, WhatsApp readiness, and more in{" "}
          <strong style={{ color: "white" }}>60 seconds</strong>.
        </motion.p>
        <motion.div {...fadeUp(0.15)}>
          <Link to="/audit">
            <Button
              data-ocid="landing.audit_cta.start_button"
              size="lg"
              className="px-10 py-6 text-base font-bold shadow-2xl hover:-translate-y-1 transition-all duration-300"
              style={{ background: "white", color: "oklch(0.68 0.14 71)" }}
            >
              Start Free Audit Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
        <motion.p
          {...fadeUp(0.2)}
          className="mt-5 text-sm"
          style={{ color: "oklch(0.99 0 0 / 0.7)" }}
        >
          No credit card required · Takes 60 seconds · Instant results
        </motion.p>
      </div>
    </section>
  );
}

// ─── SECTION 5: Pricing Preview ───────────────────────────────────────────────
function PricingPreviewSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section
      data-ocid="landing.pricing_preview"
      className="py-20 md:py-28 bg-background"
      id="pricing-preview"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader
          badge="Transparent Pricing"
          title="3 Simple Plans for Gulf Businesses"
          subtitle="No hidden fees. No lock-in contracts. Cancel anytime."
        />

        <motion.div
          {...fadeIn(0.05)}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <span
            className={`text-sm font-medium ${
              !yearly ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Monthly
          </span>
          <Switch
            data-ocid="landing.pricing_preview.toggle"
            checked={yearly}
            onCheckedChange={setYearly}
          />
          <span
            className={`text-sm font-medium ${
              yearly ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Yearly{" "}
            <Badge
              className="ml-1 text-xs border-0"
              style={{
                background: "oklch(0.68 0.14 71 / 0.12)",
                color: "oklch(0.58 0.14 71)",
              }}
            >
              Save 20%
            </Badge>
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              {...fadeUp(i * 0.1)}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="relative"
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge
                    className="px-4 py-1 text-xs font-bold shadow-md border-0"
                    style={{
                      background: "oklch(0.68 0.14 71)",
                      color: "white",
                    }}
                  >
                    ⭐ Most Popular
                  </Badge>
                </div>
              )}
              <Card
                className={`h-full transition-all duration-300 ${
                  plan.recommended
                    ? "border-2 shadow-xl"
                    : "border border-border/60 hover:border-primary/30 hover:shadow-md"
                }`}
                style={
                  plan.recommended ? { borderColor: "oklch(0.68 0.14 71)" } : {}
                }
              >
                <CardContent className="p-7 flex flex-col h-full">
                  <div className="mb-6">
                    <h3 className="font-display text-xl font-bold text-foreground mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-5">
                      {plan.tagline}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span
                        className="font-display text-4xl font-bold"
                        style={{ color: "oklch(0.68 0.14 71)" }}
                      >
                        {yearly ? plan.priceAEDYearly : plan.priceAED}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        AED/mo
                      </span>
                    </div>
                    {yearly && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Billed annually · Save{" "}
                        {plan.priceAED - plan.priceAEDYearly} AED/mo
                      </p>
                    )}
                  </div>
                  <ul className="space-y-3 flex-1 mb-7">
                    {plan.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2
                          className="h-4 w-4 mt-0.5 shrink-0"
                          style={{ color: "oklch(0.68 0.14 71)" }}
                        />
                        <span className="text-foreground/80">{f}</span>
                      </li>
                    ))}
                    {plan.features.length > 4 && (
                      <li className="text-muted-foreground text-sm pl-6">
                        +{plan.features.length - 4} more features
                      </li>
                    )}
                  </ul>
                  <Link to="/pricing">
                    <Button
                      data-ocid={`landing.pricing_preview.plan_${plan.id}_button`}
                      className="w-full"
                      style={
                        plan.recommended
                          ? {
                              background:
                                "linear-gradient(135deg, oklch(0.68 0.14 71), oklch(0.62 0.16 55))",
                              color: "white",
                            }
                          : {}
                      }
                      variant={plan.recommended ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp(0.3)} className="text-center mt-10">
          <Link to="/pricing">
            <Button
              data-ocid="landing.pricing_preview.see_all_button"
              variant="ghost"
              className="font-semibold"
              style={{ color: "oklch(0.53 0.17 254)" }}
            >
              See All Features &amp; Plans{" "}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─── SECTION 6: Dashboard Preview ────────────────────────────────────────────
const DASHBOARD_STATS = [
  {
    label: "Total Leads",
    value: "142",
    icon: Users,
    delta: "+18%",
    positive: true,
    color: "oklch(0.68 0.14 71)",
  },
  {
    label: "WhatsApp Clicks",
    value: "89",
    icon: MessageCircle,
    delta: "+24%",
    positive: true,
    color: "oklch(0.55 0.19 160)",
  },
  {
    label: "Calls",
    value: "34",
    icon: Phone,
    delta: "+9%",
    positive: true,
    color: "oklch(0.53 0.17 254)",
  },
  {
    label: "Website Visits",
    value: "1,204",
    icon: Eye,
    delta: "+41%",
    positive: true,
    color: "oklch(0.62 0.15 290)",
  },
  {
    label: "Instagram Growth",
    value: "+23%",
    icon: TrendingUp,
    delta: "this month",
    positive: true,
    color: "oklch(0.58 0.19 340)",
  },
  {
    label: "Google Ranking",
    value: "#4 → #2",
    icon: Target,
    delta: "improved",
    positive: true,
    color: "oklch(0.65 0.16 25)",
  },
];

function DashboardPreviewSection() {
  return (
    <section
      data-ocid="landing.dashboard_preview"
      className="py-20 md:py-28"
      style={{ background: "oklch(0.96 0.005 261)" }}
      id="dashboard-preview"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader
          badge="Live Dashboard"
          title="Your Growth at a Glance"
          subtitle="Everything you need to track your business growth in one premium dashboard."
        />

        <motion.div {...fadeUp(0.1)}>
          <Card className="overflow-hidden border border-border/60 shadow-2xl">
            <div
              className="px-6 py-4 flex items-center justify-between border-b border-border/40"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.18 0.015 261), oklch(0.22 0.018 261))",
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ background: "oklch(0.62 0.22 25)" }}
                />
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ background: "oklch(0.72 0.18 71)" }}
                />
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ background: "oklch(0.65 0.2 160)" }}
                />
              </div>
              <span
                className="text-xs font-mono"
                style={{ color: "oklch(0.6 0.01 261)" }}
              >
                GulfGrowth Pro — Client Dashboard
              </span>
              <div className="w-20" />
            </div>
            <CardContent className="p-6 bg-card">
              <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">
                    Al Noor Restaurant — Dubai
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Last 30 days · Growth plan
                  </p>
                </div>
                <Badge
                  className="text-xs border-0"
                  style={{
                    background: "oklch(0.55 0.19 160 / 0.12)",
                    color: "oklch(0.45 0.15 160)",
                  }}
                >
                  🟢 Active
                </Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {DASHBOARD_STATS.map((s, i) => (
                  <motion.div
                    key={s.label}
                    {...fadeUp(0.1 + i * 0.06)}
                    className="rounded-xl p-4 border border-border/40 bg-background"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                      style={{ background: `${s.color.slice(0, -1)} / 0.12)` }}
                    >
                      <s.icon className="h-4 w-4" style={{ color: s.color }} />
                    </div>
                    <p className="font-display text-xl font-bold text-foreground mb-0.5">
                      {s.value}
                    </p>
                    <p className="text-muted-foreground text-xs leading-tight mb-1">
                      {s.label}
                    </p>
                    <span
                      className="text-xs font-medium"
                      style={{
                        color: s.positive
                          ? "oklch(0.55 0.19 160)"
                          : "oklch(0.62 0.22 25)",
                      }}
                    >
                      ↑ {s.delta}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div
                className="mt-5 rounded-lg p-4 border border-border/30"
                style={{ background: "oklch(0.68 0.14 71 / 0.06)" }}
              >
                <p
                  className="text-xs font-semibold mb-1"
                  style={{ color: "oklch(0.68 0.14 71)" }}
                >
                  📊 Monthly ROI Estimate
                </p>
                <p className="text-2xl font-display font-bold text-foreground">
                  +4,800 AED
                </p>
                <p className="text-muted-foreground text-xs">
                  Estimated revenue attributable to GulfGrowth Pro services
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

// ─── SECTION 7: Case Studies ──────────────────────────────────────────────────
const CASES = [
  {
    business: "Dubai Salon",
    location: "Dubai, UAE 🇦🇪",
    result: "42%",
    metric: "More WhatsApp Inquiries",
    period: "In 30 days",
    quote:
      "Our phone hasn't stopped ringing since GulfGrowth Pro set up our WhatsApp funnel. Best investment we've made.",
    owner: "Fatima Al Rashidi, Owner",
    gradient:
      "linear-gradient(135deg, oklch(0.58 0.19 340 / 0.12), oklch(0.62 0.18 300 / 0.18))",
    accent: "oklch(0.58 0.19 340)",
    emoji: "💅",
  },
  {
    business: "Muscat Garage",
    location: "Muscat, Oman 🇴🇲",
    result: "Top 3",
    metric: "On Google Maps",
    period: "Within 6 weeks",
    quote:
      "We went from invisible on Google to ranking top 3 for 'auto repair Muscat'. Customers now find us every day.",
    owner: "Mohammed Al Balushi, Manager",
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.17 254 / 0.12), oklch(0.5 0.16 265 / 0.18))",
    accent: "oklch(0.53 0.17 254)",
    emoji: "🔧",
  },
  {
    business: "Qatar Café",
    location: "Doha, Qatar 🇶🇦",
    result: "3×",
    metric: "Instagram Engagement",
    period: "First month",
    quote:
      "Our Instagram used to get 20 likes per post. Now we average 300+ and new customers come in saying they found us online.",
    owner: "Sara Al Thani, Founder",
    gradient:
      "linear-gradient(135deg, oklch(0.68 0.14 71 / 0.12), oklch(0.65 0.16 55 / 0.18))",
    accent: "oklch(0.68 0.14 71)",
    emoji: "☕",
  },
];

function CaseStudiesSection() {
  return (
    <section
      data-ocid="landing.case_studies"
      className="py-20 md:py-28 bg-background"
      id="case-studies"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader
          badge="Success Stories"
          title="Real Results From Gulf Businesses"
          subtitle="These aren't projections. These are actual results from businesses just like yours."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {CASES.map((c, i) => (
            <motion.div
              key={c.business}
              {...fadeUp(i * 0.1)}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="h-full overflow-hidden border border-border/60 hover:shadow-lg transition-all duration-300">
                <div className="p-6" style={{ background: c.gradient }}>
                  <div className="text-4xl mb-2">{c.emoji}</div>
                  <p className="font-display font-bold text-base text-foreground mb-0.5">
                    {c.business}
                  </p>
                  <p className="text-muted-foreground text-xs">{c.location}</p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span
                      className="font-display text-4xl font-black"
                      style={{ color: c.accent }}
                    >
                      {c.result}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground leading-tight">
                        {c.metric}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {c.period}
                      </p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-5">
                  <blockquote className="text-sm text-muted-foreground italic leading-relaxed mb-3">
                    &ldquo;{c.quote}&rdquo;
                  </blockquote>
                  <p className="text-xs font-semibold text-foreground">
                    — {c.owner}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 8: Trust Badges ──────────────────────────────────────────────────
const TRUST_ITEMS = [
  {
    icon: MapPin,
    title: "Gulf-focused marketing",
    desc: "Strategies built for UAE, KSA, Qatar, Kuwait, Bahrain & Oman markets.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp-first strategy",
    desc: "We know Gulf customers prefer WhatsApp — so that's our lead channel.",
  },
  {
    icon: Search,
    title: "Local SEO experts",
    desc: "Top-ranked in Google Maps for 100+ Gulf businesses and counting.",
  },
  {
    icon: FileText,
    title: "Monthly reports",
    desc: "Transparent performance reports every month. No confusion, just results.",
  },
  {
    icon: CalendarX,
    title: "No long-term contract",
    desc: "Month-to-month plans. Stay because it works, not because you're locked in.",
  },
];

function TrustSection() {
  return (
    <section
      data-ocid="landing.trust"
      className="py-20 md:py-28"
      style={{ background: "oklch(0.97 0.008 261)" }}
      id="trust"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader
          badge="Why Choose Us"
          title="Why 500+ Gulf Businesses Trust Us"
          subtitle="We're not a generic agency. We live and breathe Gulf markets, culture, and customer behavior."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {TRUST_ITEMS.map((t, i) => (
            <motion.div
              key={t.title}
              {...fadeUp(i * 0.09)}
              className="text-center flex flex-col items-center p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300"
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "oklch(0.68 0.14 71 / 0.1)" }}
              >
                <t.icon
                  className="h-8 w-8"
                  style={{ color: "oklch(0.68 0.14 71)" }}
                />
              </div>
              <h3 className="font-display font-semibold text-sm text-foreground mb-2 leading-tight">
                {t.title}
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {t.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 9: Contact Form ──────────────────────────────────────────────────
const SERVICE_OPTIONS = [
  "Google Business Optimization",
  "Instagram Management",
  "WhatsApp Lead Funnel",
  "Landing Page / Website",
  "Meta Ads Setup",
  "Review & Rating Growth",
  "Local SEO",
  "Monthly Content Calendar",
  "Business Analytics Dashboard",
  "Full Premium Package",
];

const BUDGET_OPTIONS = [
  "Under 500 AED/month",
  "500 – 1,000 AED/month",
  "1,000 – 2,000 AED/month",
  "2,000+ AED/month",
];

function ContactSection() {
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    country: "",
    city: "",
    service: "",
    whatsapp: "",
    budget: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.businessName.trim()) e.businessName = "Business name is required";
    if (!form.ownerName.trim()) e.ownerName = "Owner name is required";
    if (!form.country) e.country = "Please select a country";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.service) e.service = "Please select a service";
    if (!form.whatsapp.trim()) e.whatsapp = "WhatsApp number is required";
    if (!form.budget) e.budget = "Please select a budget";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  const setField = (field: string) => (val: string) =>
    setForm((prev) => ({ ...prev, [field]: val }));

  return (
    <section
      data-ocid="landing.contact"
      className="py-20 md:py-28 bg-background"
      id="contact"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <SectionHeader
          badge="Free Consultation"
          title="Book a Free Growth Call"
          subtitle="Tell us about your business and we'll show you exactly how to get more customers in 30 days."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <motion.div {...fadeUp(0.05)} className="lg:col-span-3">
            <Card className="border border-border/60 shadow-lg">
              <CardContent className="p-7">
                {submitted ? (
                  <div
                    data-ocid="landing.contact.success_state"
                    className="text-center py-12"
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                      style={{ background: "oklch(0.55 0.19 160 / 0.1)" }}
                    >
                      <CheckCircle2
                        className="h-8 w-8"
                        style={{ color: "oklch(0.55 0.19 160)" }}
                      />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">
                      Request Received!
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      We'll reach out on WhatsApp within 2 hours. Keep an eye on
                      your messages.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    noValidate
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="businessName">Business Name *</Label>
                        <Input
                          data-ocid="landing.contact.business_name_input"
                          id="businessName"
                          placeholder="Al Noor Restaurant"
                          value={form.businessName}
                          onChange={(e) =>
                            setField("businessName")(e.target.value)
                          }
                        />
                        {errors.businessName && (
                          <p
                            data-ocid="landing.contact.business_name_field_error"
                            className="text-xs"
                            style={{ color: "oklch(0.62 0.22 25)" }}
                          >
                            {errors.businessName}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="ownerName">Owner Name *</Label>
                        <Input
                          data-ocid="landing.contact.owner_name_input"
                          id="ownerName"
                          placeholder="Ahmed Al Mansoori"
                          value={form.ownerName}
                          onChange={(e) =>
                            setField("ownerName")(e.target.value)
                          }
                        />
                        {errors.ownerName && (
                          <p
                            data-ocid="landing.contact.owner_name_field_error"
                            className="text-xs"
                            style={{ color: "oklch(0.62 0.22 25)" }}
                          >
                            {errors.ownerName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Country *</Label>
                        <Select onValueChange={setField("country")}>
                          <SelectTrigger data-ocid="landing.contact.country_select">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {GULF_COUNTRIES.map((c) => (
                              <SelectItem key={c.code} value={c.code}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.country && (
                          <p
                            data-ocid="landing.contact.country_field_error"
                            className="text-xs"
                            style={{ color: "oklch(0.62 0.22 25)" }}
                          >
                            {errors.country}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          data-ocid="landing.contact.city_input"
                          id="city"
                          placeholder="Dubai"
                          value={form.city}
                          onChange={(e) => setField("city")(e.target.value)}
                        />
                        {errors.city && (
                          <p
                            data-ocid="landing.contact.city_field_error"
                            className="text-xs"
                            style={{ color: "oklch(0.62 0.22 25)" }}
                          >
                            {errors.city}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Service Needed *</Label>
                      <Select onValueChange={setField("service")}>
                        <SelectTrigger data-ocid="landing.contact.service_select">
                          <SelectValue placeholder="What do you need most?" />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICE_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.service && (
                        <p
                          data-ocid="landing.contact.service_field_error"
                          className="text-xs"
                          style={{ color: "oklch(0.62 0.22 25)" }}
                        >
                          {errors.service}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                      <Input
                        data-ocid="landing.contact.whatsapp_input"
                        id="whatsapp"
                        type="tel"
                        placeholder="+971 50 000 0000"
                        value={form.whatsapp}
                        onChange={(e) => setField("whatsapp")(e.target.value)}
                      />
                      {errors.whatsapp && (
                        <p
                          data-ocid="landing.contact.whatsapp_field_error"
                          className="text-xs"
                          style={{ color: "oklch(0.62 0.22 25)" }}
                        >
                          {errors.whatsapp}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label>Monthly Budget *</Label>
                      <Select onValueChange={setField("budget")}>
                        <SelectTrigger data-ocid="landing.contact.budget_select">
                          <SelectValue placeholder="Select your budget" />
                        </SelectTrigger>
                        <SelectContent>
                          {BUDGET_OPTIONS.map((b) => (
                            <SelectItem key={b} value={b}>
                              {b}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.budget && (
                        <p
                          data-ocid="landing.contact.budget_field_error"
                          className="text-xs"
                          style={{ color: "oklch(0.62 0.22 25)" }}
                        >
                          {errors.budget}
                        </p>
                      )}
                    </div>

                    <Button
                      data-ocid="landing.contact.submit_button"
                      type="submit"
                      size="lg"
                      className="w-full font-semibold"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.68 0.14 71), oklch(0.62 0.16 55))",
                        color: "white",
                      }}
                    >
                      Book Free Growth Call{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            {...fadeUp(0.1)}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            <div className="rounded-2xl p-6 border border-border/60 bg-card">
              <h3 className="font-display font-bold text-base mb-3 text-foreground">
                What happens next?
              </h3>
              <ol className="space-y-3">
                {[
                  "We receive your request and review your business",
                  "A Gulf growth specialist contacts you within 2 hours",
                  "Free 30-min strategy call to discuss your goals",
                  "Custom growth plan delivered within 24 hours",
                ].map((step, i) => (
                  <li key={step} className="flex items-start gap-3 text-sm">
                    <span
                      className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: "oklch(0.68 0.14 71)",
                        color: "white",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <Separator />

            <div
              className="rounded-2xl p-6"
              style={{ background: "oklch(0.55 0.19 160 / 0.08)" }}
            >
              <p className="text-sm font-semibold text-foreground mb-3">
                Prefer to chat directly?
              </p>
              <a
                data-ocid="landing.contact.whatsapp_button"
                href="https://wa.me/971500000000"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  type="button"
                  className="w-full font-semibold"
                  style={{ background: "#25D366", color: "white" }}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat on WhatsApp
                </Button>
              </a>
              <p className="text-muted-foreground text-xs mt-3 text-center">
                Available 9am – 9pm Gulf time · Fast response guaranteed
              </p>
            </div>

            <div className="rounded-2xl p-5 border border-border/50 bg-card">
              <div className="flex items-center gap-1 mb-2">
                {["🇦🇪", "🇸🇦", "🇶🇦", "🇰🇼", "🇧🇭", "🇴🇲"].map((flag) => (
                  <span key={flag} className="text-lg">
                    {flag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Serving businesses across all 6 GCC countries. Bilingual support
                in English &amp; Arabic.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <PageLayout>
      <div data-ocid="landing.page">
        <HeroSection />
        <ProblemsSection />
        <ServicesSection />
        <AuditCTASection />
        <PricingPreviewSection />
        <DashboardPreviewSection />
        <CaseStudiesSection />
        <TrustSection />
        <ContactSection />
      </div>
    </PageLayout>
  );
}
