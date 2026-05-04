export type Currency = "AED" | "OMR" | "SAR" | "QAR" | "KWD" | "BHD";

export type UserRole = "client" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: number;
  currency: Currency;
  country: string;
}

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  city: string;
  country: string;
  whatsapp: string;
  instagram?: string;
  googleMapsLink?: string;
  website?: string;
  createdAt: number;
}

export interface AuditFormData {
  businessName: string;
  city: string;
  category: string;
  whatsapp: string;
  instagram?: string;
  googleMapsLink?: string;
}

export interface AuditScore {
  googleVisibility: number;
  instagramTrust: number;
  whatsappFunnel: number;
  website: number;
  leadConversion: number;
  overall: number;
}

export interface Audit {
  id: string;
  businessId: string;
  scores: AuditScore;
  createdAt: number;
  status: "pending" | "complete";
}

export interface Lead {
  id: string;
  businessId: string;
  source: "whatsapp" | "instagram" | "google" | "website" | "ad";
  name?: string;
  phone?: string;
  message?: string;
  createdAt: number;
  status: "new" | "contacted" | "converted" | "lost";
}

export type PlanTier = "starter" | "growth" | "premium";

export interface PricingTier {
  id: PlanTier;
  name: string;
  priceAED: number;
  priceAEDYearly: number;
  tagline: string;
  features: string[];
  recommended?: boolean;
  color: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: PlanTier;
  currency: Currency;
  amount: number;
  status: "active" | "paused" | "cancelled";
  startDate: number;
  renewDate: number;
  billingCycle: "monthly" | "yearly";
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  userId: string;
  amount: number;
  currency: Currency;
  status: "paid" | "pending" | "overdue";
  issuedAt: number;
  paidAt?: number;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  amount: number;
  qty: number;
}

export interface Contact {
  businessName: string;
  ownerName: string;
  country: string;
  city: string;
  serviceNeeded: string;
  whatsapp: string;
  budget: string;
}

export interface Plan {
  id: string;
  tier: PlanTier;
  features: string[];
  price: Record<Currency, number>;
}

export interface DashboardStats {
  totalLeads: number;
  whatsappClicks: number;
  calls: number;
  websiteVisits: number;
  instagramGrowth: number;
  googleRankingScore: number;
  monthlyROI: number;
}
