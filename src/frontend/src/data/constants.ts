import type { Currency, PricingTier } from "@/types";

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  toAED: number;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", toAED: 1 },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", toAED: 0.98 },
  { code: "QAR", symbol: "﷼", name: "Qatari Riyal", toAED: 1.01 },
  { code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar", toAED: 11.94 },
  { code: "BHD", symbol: ".د.ب", name: "Bahraini Dinar", toAED: 9.71 },
  { code: "OMR", symbol: "﷼", name: "Omani Rial", toAED: 9.52 },
];

export const GULF_COUNTRIES = [
  { code: "AE", name: "United Arab Emirates", currency: "AED" as Currency },
  { code: "SA", name: "Saudi Arabia", currency: "SAR" as Currency },
  { code: "QA", name: "Qatar", currency: "QAR" as Currency },
  { code: "KW", name: "Kuwait", currency: "KWD" as Currency },
  { code: "BH", name: "Bahrain", currency: "BHD" as Currency },
  { code: "OM", name: "Oman", currency: "OMR" as Currency },
];

export interface ServiceInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  highlight?: string;
}

export const SERVICES: ServiceInfo[] = [
  {
    id: "google-business",
    name: "Google Business Optimization",
    icon: "🗺️",
    description:
      "Rank higher on Google Maps so local customers find you first.",
    highlight: "Top 3 on Google Maps",
  },
  {
    id: "instagram-management",
    name: "Instagram Management",
    icon: "📸",
    description:
      "Professional posts, reels, and stories that build your brand daily.",
    highlight: "3× engagement growth",
  },
  {
    id: "whatsapp-funnel",
    name: "WhatsApp Lead Funnel",
    icon: "💬",
    description:
      "Automated responses and follow-ups that turn inquiries into bookings.",
    highlight: "42% more inquiries",
  },
  {
    id: "landing-page",
    name: "Landing Page / Website",
    icon: "🌐",
    description:
      "Fast, mobile-first pages designed to convert visitors into customers.",
    highlight: "Built in 72 hours",
  },
  {
    id: "meta-ads",
    name: "Meta Ads Setup",
    icon: "📣",
    description:
      "Facebook & Instagram campaigns targeted to your exact Gulf audience.",
    highlight: "2× ROAS guaranteed",
  },
  {
    id: "review-growth",
    name: "Review & Rating Growth",
    icon: "⭐",
    description:
      "Systematic campaigns that fill your Google profile with 5-star reviews.",
    highlight: "50+ reviews in 30 days",
  },
  {
    id: "local-seo",
    name: "Local SEO",
    icon: "🔍",
    description:
      "Optimize your online presence so nearby customers discover you organically.",
    highlight: "Rank for local keywords",
  },
  {
    id: "content-calendar",
    name: "Monthly Content Calendar",
    icon: "📅",
    description:
      "30 days of ready-to-post content tailored to your business and Gulf culture.",
    highlight: "30 posts/month",
  },
  {
    id: "analytics-dashboard",
    name: "Business Analytics Dashboard",
    icon: "📊",
    description:
      "Real-time leads, reach, and ROI tracked in one clean Gulf-focused dashboard.",
    highlight: "Live ROI tracking",
  },
];

export const PRICING_PLANS: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    priceAED: 299,
    priceAEDYearly: 249,
    tagline: "Perfect for new businesses just getting online",
    color: "secondary",
    features: [
      "Google Business Profile setup",
      "Basic Instagram management (12 posts/month)",
      "WhatsApp Business profile",
      "Monthly performance report",
      "Email support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    priceAED: 699,
    priceAEDYearly: 579,
    tagline: "For businesses ready to grow their customer base",
    color: "secondary",
    features: [
      "Everything in Starter",
      "Full Instagram management (30 posts/month)",
      "WhatsApp lead funnel automation",
      "Meta Ads setup & management (1 campaign)",
      "Local SEO optimization",
      "Review growth campaign",
      "Weekly performance report",
      "Priority WhatsApp support",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    priceAED: 1499,
    priceAEDYearly: 1249,
    tagline: "Complete digital growth solution for serious businesses",
    color: "primary",
    recommended: true,
    features: [
      "Everything in Growth",
      "Custom landing page / website",
      "2 Meta Ads campaigns",
      "Monthly content calendar (full creative)",
      "Business analytics dashboard",
      "Google Ads setup",
      "Dedicated account manager",
      "24/7 WhatsApp support",
      "Monthly strategy call",
    ],
  },
];

export const BUSINESS_CATEGORIES = [
  "Restaurant / Café",
  "Salon / Beauty",
  "Laundry / Dry Cleaning",
  "Auto Garage",
  "Clinic / Medical",
  "Gym / Fitness",
  "Real Estate",
  "Mobile / Electronics Shop",
  "Retail Store",
  "Other Local Service",
];
