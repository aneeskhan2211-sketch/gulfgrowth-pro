import { CURRENCIES } from "@/data/constants";
import type { AuditFormData, AuditScore, Currency, PlanTier } from "@/types";
import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
export function formatCurrency(amount: number, currency: Currency): string {
  const info = CURRENCIES.find((c) => c.code === currency);
  const symbol = info?.symbol ?? currency;
  const converted = currency === "AED" ? amount : amount / (info?.toAED ?? 1);
  return `${symbol} ${converted.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function convertFromAED(amountAED: number, currency: Currency): number {
  const info = CURRENCIES.find((c) => c.code === currency);
  if (!info || currency === "AED") return amountAED;
  return Math.round(amountAED / info.toAED);
}

export function calculateAuditScore(data: AuditFormData): AuditScore {
  const hasInstagram = !!data.instagram?.trim();
  const hasGoogleMaps = !!data.googleMapsLink?.trim();
  const hasWhatsapp = !!data.whatsapp?.trim();
  const googleVisibility = hasGoogleMaps
    ? Math.floor(55 + Math.random() * 25)
    : Math.floor(15 + Math.random() * 20);
  const instagramTrust = hasInstagram
    ? Math.floor(50 + Math.random() * 30)
    : Math.floor(10 + Math.random() * 15);
  const whatsappFunnel = hasWhatsapp
    ? Math.floor(45 + Math.random() * 25)
    : Math.floor(5 + Math.random() * 20);
  const website = Math.floor(20 + Math.random() * 30);
  const leadConversion = Math.floor(
    (googleVisibility + instagramTrust + whatsappFunnel + website) / 4,
  );
  const overall = Math.floor(
    (googleVisibility +
      instagramTrust +
      whatsappFunnel +
      website +
      leadConversion) /
      5,
  );
  return {
    googleVisibility,
    instagramTrust,
    whatsappFunnel,
    website,
    leadConversion,
    overall,
  };
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getPlanName(plan: PlanTier): string {
  const names: Record<PlanTier, string> = {
    starter: "Starter",
    growth: "Growth",
    premium: "Premium",
  };
  return names[plan];
}

export function getScoreColor(score: number): string {
  if (score >= 70) return "text-emerald-600";
  if (score >= 40) return "text-amber-500";
  return "text-destructive";
}

export function getScoreLabel(score: number): string {
  if (score >= 70) return "Good";
  if (score >= 40) return "Needs Work";
  return "Critical";
}
