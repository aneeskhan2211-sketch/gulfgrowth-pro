import type { Plan } from "@/backend";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CURRENCIES, PRICING_PLANS } from "@/data/constants";
import type { CurrencyInfo } from "@/data/constants";
import { useCreateCheckoutSession } from "@/hooks/useStripeCheckout";
import { convertFromAED, formatCurrency } from "@/lib/utils";
import type { Currency, PricingTier } from "@/types";
import {
  Check,
  ChevronDown,
  Globe,
  HelpCircle,
  Loader2,
  MessageCircle,
  RefreshCw,
  Shield,
  Star,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
type BillingCycle = "monthly" | "yearly";

interface PlanPrice {
  monthly: number;
  yearly: number;
  yearlyTotal: number;
}

// ─── Pricing data with correct values from requirements ───────────────────────
const PLAN_PRICES: Record<string, PlanPrice> = {
  starter: { monthly: 299, yearly: 239, yearlyTotal: 2872 },
  growth: { monthly: 699, yearly: 559, yearlyTotal: 6710 },
  premium: { monthly: 1499, yearly: 1199, yearlyTotal: 14390 },
};

const PLAN_FEATURES_DETAILED = {
  starter: [
    "Google Business Profile setup",
    "Monthly performance report",
    "3 Instagram posts/month",
    "WhatsApp number setup",
    "Email support",
  ],
  growth: [
    "Everything in Starter",
    "10 Instagram posts/month",
    "Meta Ads setup (1 campaign)",
    "Local SEO optimization",
    "Google review growth",
    "Monthly strategy call",
    "Priority support",
  ],
  premium: [
    "Everything in Growth",
    "20 Instagram posts/month",
    "3 Meta Ads campaigns",
    "Full website / landing page",
    "WhatsApp lead funnel",
    "Weekly reports",
    "Dedicated account manager",
    "WhatsApp support",
  ],
};

// All features for comparison table
const ALL_FEATURES = [
  {
    label: "Google Business Profile",
    starter: true,
    growth: true,
    premium: true,
  },
  {
    label: "Monthly performance report",
    starter: true,
    growth: true,
    premium: true,
  },
  { label: "Instagram posts/month", starter: "3", growth: "10", premium: "20" },
  { label: "WhatsApp setup", starter: true, growth: true, premium: true },
  { label: "Meta Ads campaigns", starter: false, growth: "1", premium: "3" },
  {
    label: "Local SEO optimization",
    starter: false,
    growth: true,
    premium: true,
  },
  {
    label: "Google review growth",
    starter: false,
    growth: true,
    premium: true,
  },
  {
    label: "Monthly strategy call",
    starter: false,
    growth: true,
    premium: true,
  },
  {
    label: "Full website / landing page",
    starter: false,
    growth: false,
    premium: true,
  },
  {
    label: "WhatsApp lead funnel",
    starter: false,
    growth: false,
    premium: true,
  },
  { label: "Weekly reports", starter: false, growth: false, premium: true },
  {
    label: "Dedicated account manager",
    starter: false,
    growth: false,
    premium: true,
  },
  {
    label: "Support channel",
    starter: "Email",
    growth: "Priority",
    premium: "WhatsApp",
  },
] as const;

const FAQ_ITEMS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes, absolutely. There are no long-term contracts. You can cancel or pause your subscription at any time, and your access continues until the end of your billing period.",
  },
  {
    q: "Do you offer free trials?",
    a: "We offer a Free Business Audit to every new client — no credit card required. This gives you a clear picture of your current online performance before you commit to a plan.",
  },
  {
    q: "Which currencies are accepted?",
    a: "We accept payments in AED, SAR, QAR, KWD, BHD, and OMR. Prices are shown in your selected currency and all transactions are secure.",
  },
  {
    q: "What happens after I pay?",
    a: "Our team will contact you via WhatsApp within 24 hours to start the onboarding process. We'll collect your business details, access credentials, and set everything up within 3-5 business days.",
  },
  {
    q: "Is there a setup fee?",
    a: "No hidden fees, ever. The monthly price shown is all you pay. Setup, onboarding, and ongoing management are all included in your plan.",
  },
  {
    q: "How do I get started?",
    a: "Click 'Get Started' on any plan, complete the secure checkout, and our team will reach out within 24 hours. You can also book a free audit first to understand what your business needs.",
  },
];

const TRUST_BADGES = [
  { icon: Globe, label: "Gulf-focused marketing" },
  { icon: MessageCircle, label: "WhatsApp-first strategy" },
  { icon: TrendingUp, label: "Local SEO experts" },
  { icon: RefreshCw, label: "No long-term contract" },
  { icon: Shield, label: "Secure payments" },
  { icon: Star, label: "Monthly reports" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function FeatureValue({ val }: { val: boolean | string }) {
  if (val === false)
    return <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />;
  if (val === true) return <Check className="w-4 h-4 text-primary mx-auto" />;
  return <span className="text-sm font-medium text-foreground">{val}</span>;
}

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="border border-border rounded-xl overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/40 transition-colors"
        data-ocid={`faq.item.${index + 1}`}
      >
        <span className="font-medium text-foreground pr-4">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CurrencySelector({
  selected,
  onChange,
}: {
  selected: Currency;
  onChange: (c: Currency) => void;
}) {
  const info = CURRENCIES.find((c) => c.code === selected)!;
  return (
    <div className="relative">
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value as Currency)}
        className="appearance-none bg-card border border-border rounded-lg pl-3 pr-8 py-2 text-sm font-medium text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
        data-ocid="pricing.currency_select"
      >
        {CURRENCIES.map((c: CurrencyInfo) => (
          <option key={c.code} value={c.code}>
            {c.symbol} {c.code} — {c.name}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
      <span className="sr-only">{info.name}</span>
    </div>
  );
}

// ─── Plan Card ────────────────────────────────────────────────────────────────
function PlanCard({
  plan,
  billing,
  currency,
  index,
}: {
  plan: PricingTier;
  billing: BillingCycle;
  currency: Currency;
  index: number;
}) {
  const prices = PLAN_PRICES[plan.id];
  const aedPrice = billing === "monthly" ? prices.monthly : prices.yearly;
  const displayPrice = convertFromAED(aedPrice, currency);
  const yearlyTotal = convertFromAED(prices.yearlyTotal, currency);
  const isGold = plan.id === "premium";
  const isBlue = plan.id === "starter";
  const checkout = useCreateCheckoutSession();

  async function handleCheckout() {
    try {
      const session = await checkout.mutateAsync({
        plan: plan.id as Plan,
        priceAED: aedPrice,
        billingCycle: billing,
        currency,
      });
      if (!session?.url) throw new Error("Stripe session missing url");
      window.location.href = session.url;
    } catch (err) {
      toast.error("Checkout unavailable. Please contact us via WhatsApp.");
      console.error(err);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      className={[
        "relative flex flex-col rounded-2xl border-2 p-7 transition-shadow duration-300 hover:shadow-xl",
        isGold
          ? "border-[oklch(0.68_0.14_71)] bg-gradient-to-b from-[oklch(0.99_0.005_71)] to-card shadow-lg"
          : isBlue
            ? "border-secondary/50 bg-card"
            : "border-border bg-card",
        plan.recommended ? "scale-[1.03] z-10" : "",
      ].join(" ")}
      data-ocid={`pricing.plan.${plan.id}`}
    >
      {/* Recommended badge */}
      {plan.recommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="px-4 py-1 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground shadow-md">
            <Star className="w-3 h-3 mr-1" />
            Most Recommended
          </Badge>
        </div>
      )}

      {/* Plan name */}
      <div className="mb-4">
        <h3
          className={`font-display text-xl font-bold mb-1 ${
            isGold
              ? "text-primary"
              : isBlue
                ? "text-secondary"
                : "text-foreground"
          }`}
        >
          {plan.name}
        </h3>
        <p className="text-sm text-muted-foreground">{plan.tagline}</p>
      </div>

      {/* Price */}
      <div className="mb-5">
        <div className="flex items-end gap-1">
          <span
            className={`font-display text-4xl font-bold ${
              isGold
                ? "text-primary"
                : isBlue
                  ? "text-secondary"
                  : "text-foreground"
            }`}
          >
            {formatCurrency(displayPrice, currency)}
          </span>
          <span className="text-muted-foreground text-sm pb-1.5">/mo</span>
        </div>
        {billing === "yearly" && (
          <p className="text-xs text-muted-foreground mt-1">
            {formatCurrency(yearlyTotal, currency)} billed annually
            <span className="ml-2 text-emerald-600 font-semibold">
              Save 20%
            </span>
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-2.5 mb-7 flex-1">
        {PLAN_FEATURES_DETAILED[
          plan.id as keyof typeof PLAN_FEATURES_DETAILED
        ].map((feat) => (
          <li key={feat} className="flex items-start gap-2.5 text-sm">
            <Check
              className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                isGold
                  ? "text-primary"
                  : isBlue
                    ? "text-secondary"
                    : "text-foreground"
              }`}
            />
            <span className="text-foreground">{feat}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        onClick={handleCheckout}
        disabled={checkout.isPending}
        className={[
          "w-full font-semibold py-5 text-sm",
          isGold
            ? "bg-primary hover:bg-primary/90 text-primary-foreground"
            : isBlue
              ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              : "bg-foreground hover:bg-foreground/85 text-background",
        ].join(" ")}
        data-ocid={`pricing.plan.${plan.id}.submit_button`}
      >
        {checkout.isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </span>
        ) : (
          `Get Started — ${plan.name}`
        )}
      </Button>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PricingPage() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [currency, setCurrency] = useState<Currency>("AED");
  const [tableOpen, setTableOpen] = useState(false);

  return (
    <Layout>
      <div data-ocid="pricing.page">
        {/* ── Hero / Header ── */}
        <section className="bg-card border-b border-border py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge
                variant="outline"
                className="mb-4 text-primary border-primary/30 bg-primary/5"
              >
                <Zap className="w-3 h-3 mr-1.5" />
                Transparent Gulf Pricing
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
                Simple Pricing for
                <span className="text-primary"> Gulf Businesses</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                No hidden fees. Cancel anytime. Start with a free audit.
              </p>
            </motion.div>

            {/* Controls row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {/* Billing toggle */}
              <div
                className="flex items-center bg-muted rounded-full p-1 gap-1"
                data-ocid="pricing.billing_toggle"
              >
                {(["monthly", "yearly"] as BillingCycle[]).map((cycle) => (
                  <button
                    key={cycle}
                    type="button"
                    onClick={() => setBilling(cycle)}
                    className={[
                      "relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-200",
                      billing === cycle
                        ? "bg-card shadow text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    ].join(" ")}
                    data-ocid={`pricing.billing.${cycle}`}
                  >
                    {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                    {cycle === "yearly" && (
                      <span className="ml-1.5 text-xs font-bold text-emerald-600">
                        −20%
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Currency selector */}
              <CurrencySelector selected={currency} onChange={setCurrency} />
            </motion.div>
          </div>
        </section>

        {/* ── Plan Cards ── */}
        <section className="bg-background py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {PRICING_PLANS.map((plan, i) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  billing={billing}
                  currency={currency}
                  index={i}
                />
              ))}
            </div>

            {/* Free audit CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-10 text-center"
            >
              <p className="text-muted-foreground text-sm">
                Not sure which plan is right for you?{" "}
                <a
                  href="/audit"
                  className="text-secondary font-semibold underline underline-offset-2 hover:text-secondary/80"
                  data-ocid="pricing.free_audit_link"
                >
                  Get a Free Business Audit →
                </a>
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Feature Comparison Table ── */}
        <section className="bg-muted/30 border-y border-border py-14 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Full Feature Comparison
              </h2>
              <p className="text-muted-foreground text-sm">
                See exactly what’s included in each plan
              </p>
              <button
                type="button"
                onClick={() => setTableOpen((v) => !v)}
                className="mt-4 text-sm text-primary font-semibold flex items-center gap-1.5 mx-auto hover:underline"
                data-ocid="pricing.compare_toggle"
              >
                {tableOpen ? "Hide comparison" : "Show full comparison"}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    tableOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            <AnimatePresence>
              {tableOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35 }}
                  className="overflow-hidden"
                >
                  <div className="overflow-x-auto rounded-xl border border-border bg-card">
                    <table
                      className="w-full text-sm"
                      data-ocid="pricing.comparison_table"
                    >
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left font-semibold text-foreground px-5 py-3.5 w-2/5">
                            Feature
                          </th>
                          <th className="text-center font-semibold text-secondary px-4 py-3.5">
                            Starter
                          </th>
                          <th className="text-center font-semibold text-foreground px-4 py-3.5">
                            Growth
                          </th>
                          <th className="text-center font-semibold text-primary px-4 py-3.5">
                            Premium
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {ALL_FEATURES.map((row, i) => (
                          <tr
                            key={row.label}
                            className={i % 2 === 0 ? "bg-card" : "bg-muted/20"}
                          >
                            <td className="px-5 py-3 text-muted-foreground">
                              {row.label}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <FeatureValue val={row.starter} />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <FeatureValue val={row.growth} />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <FeatureValue val={row.premium} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── Trust Badges ── */}
        <section className="bg-background py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {TRUST_BADGES.map((badge, i) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-card border border-border text-center"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <badge.icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground leading-tight">
                    {badge.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-muted/30 border-t border-border py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 mb-3">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Frequently Asked Questions
                </h2>
              </div>
              <p className="text-muted-foreground text-sm">
                Still have questions? WhatsApp us directly.
              </p>
            </div>
            <div className="space-y-3" data-ocid="pricing.faq_section">
              {FAQ_ITEMS.map((item, i) => (
                <FAQItem key={item.q} q={item.q} a={item.a} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="bg-card border-t border-border py-14 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Ready to grow your Gulf business?
              </h2>
              <p className="text-muted-foreground mb-7">
                Start with a free audit — no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
                  data-ocid="pricing.bottom_cta_audit"
                >
                  <a href="/audit">Get Free Audit</a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-secondary text-secondary hover:bg-secondary/10 font-semibold px-8"
                  data-ocid="pricing.bottom_cta_whatsapp"
                >
                  <a
                    href="https://wa.me/971500000000?text=I%20want%20to%20know%20more%20about%20GulfGrowth%20Pro%20plans"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp Us
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
