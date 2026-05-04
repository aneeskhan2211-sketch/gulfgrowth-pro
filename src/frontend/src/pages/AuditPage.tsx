import { Layout } from "@/components/layout/Layout";
import { BUSINESS_CATEGORIES } from "@/data/constants";
import {
  calculateAuditScore,
  cn,
  getScoreColor,
  getScoreLabel,
} from "@/lib/utils";
import type { AuditFormData, AuditScore } from "@/types";
import {
  ArrowLeft,
  BarChart3,
  Building2,
  ChevronDown,
  Globe,
  Instagram,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Circular Score Gauge ────────────────────────────────────────────────────

interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  colorClass: string;
}

function ScoreGauge({
  score,
  size = 88,
  strokeWidth = 8,
  colorClass,
}: ScoreGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const motionScore = useMotionValue(0);
  const dashOffset = useTransform(
    motionScore,
    (v) => circumference - (v / 100) * circumference,
  );
  const displayScore = useMotionValue(0);
  const _roundedDisplay = useTransform(displayScore, Math.round);

  useEffect(() => {
    const ctrls = [
      animate(motionScore, score, { duration: 1.4, ease: "easeOut" }),
      animate(displayScore, score, { duration: 1.4, ease: "easeOut" }),
    ];
    return () => {
      for (const c of ctrls) c.stop();
    };
  }, [score, motionScore, displayScore]);

  // Resolve stroke color using OKLCH values (green / yellow / red)
  const strokeColor = colorClass.includes("emerald")
    ? "oklch(0.70 0.15 160)"
    : colorClass.includes("amber")
      ? "oklch(0.75 0.15 85)"
      : "oklch(0.60 0.20 25)";

  return (
    <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted opacity-30"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        style={{ strokeDashoffset: dashOffset }}
      />
    </svg>
  );
}

// ─── Score Card ──────────────────────────────────────────────────────────────

interface ScoreCardProps {
  label: string;
  score: number;
  icon: React.ReactNode;
  recommendation: string;
  delay?: number;
}

function ScoreCard({
  label,
  score,
  icon,
  recommendation,
  delay = 0,
}: ScoreCardProps) {
  const colorClass = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);
  const motionCount = useMotionValue(0);
  const rounded = useTransform(motionCount, Math.round);

  useEffect(() => {
    const ctrl = animate(motionCount, score, {
      duration: 1.4,
      delay,
      ease: "easeOut",
    });
    return () => ctrl.stop();
  }, [score, motionCount, delay]);

  const bgClass =
    score >= 70
      ? "bg-emerald-50 border-emerald-200"
      : score >= 40
        ? "bg-amber-50 border-amber-200"
        : "bg-red-50 border-red-200";

  const badgeBg =
    score >= 70
      ? "bg-emerald-100 text-emerald-700"
      : score >= 40
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "rounded-2xl border p-5 flex flex-col items-center gap-3 shadow-sm",
        bgClass,
      )}
    >
      <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
        {icon}
        <span>{label}</span>
      </div>

      <div className="relative flex items-center justify-center">
        <ScoreGauge score={score} colorClass={colorClass} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn("text-2xl font-bold font-display", colorClass)}
          >
            {rounded}
          </motion.span>
          <span className="text-[10px] text-muted-foreground">/100</span>
        </div>
      </div>

      <span
        className={cn(
          "text-xs font-semibold px-2 py-0.5 rounded-full",
          badgeBg,
        )}
      >
        {scoreLabel}
      </span>

      <p className="text-xs text-center text-muted-foreground leading-relaxed">
        {recommendation}
      </p>
    </motion.div>
  );
}

// ─── Recommendations map ─────────────────────────────────────────────────────

function getRecommendation(key: keyof AuditScore, score: number): string {
  const low: Record<keyof AuditScore, string> = {
    googleVisibility:
      "Your Google Business profile isn't found locally. Claim and optimize it now.",
    instagramTrust:
      "No Instagram presence detected. Set up a professional profile to build trust.",
    whatsappFunnel:
      "You're missing WhatsApp as a lead channel. Add a click-to-chat button everywhere.",
    website:
      "No website found. A fast landing page can double your conversions.",
    leadConversion: "Your overall funnel has big gaps — quick wins available.",
    overall: "Your business needs urgent digital attention.",
  };
  const mid: Record<keyof AuditScore, string> = {
    googleVisibility:
      "You have some Google presence but ranking can improve significantly.",
    instagramTrust:
      "Your Instagram exists but engagement and trust signals need work.",
    whatsappFunnel: "WhatsApp is set up but not optimized for lead capture.",
    website:
      "Your website exists but speed or conversion rate may be limiting growth.",
    leadConversion:
      "You're capturing some leads but leaving many on the table.",
    overall:
      "Good foundation — targeted improvements will unlock strong growth.",
  };
  const high: Record<keyof AuditScore, string> = {
    googleVisibility:
      "Strong Google presence! Keep reviews fresh and posts active.",
    instagramTrust:
      "Great Instagram trust signals. Reels and Stories will push you higher.",
    whatsappFunnel:
      "Solid WhatsApp funnel. Automate follow-ups to maximize conversions.",
    website:
      "Your website is performing well. A/B test your CTAs to push further.",
    leadConversion:
      "Excellent conversion rate. Scale your ad spend with confidence.",
    overall: "Outstanding digital presence. Time to scale aggressively.",
  };
  if (score < 40) return low[key];
  if (score < 70) return mid[key];
  return high[key];
}

// ─── Form State ───────────────────────────────────────────────────────────────

const INITIAL_FORM: AuditFormData = {
  businessName: "",
  city: "",
  category: "",
  whatsapp: "",
  instagram: "",
  googleMapsLink: "",
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AuditPage() {
  const [form, setForm] = useState<AuditFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof AuditFormData, string>>
  >({});
  const [scores, setScores] = useState<AuditScore | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleChange = (key: keyof AuditFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AuditFormData, string>> = {};
    if (!form.businessName.trim())
      newErrors.businessName = "Business name is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.category) newErrors.category = "Please select a category";
    if (!form.whatsapp.trim())
      newErrors.whatsapp = "WhatsApp number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setScores(calculateAuditScore(form));
      setIsGenerating(false);
      setTimeout(
        () => resultsRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    }, 1400);
  };

  const handleReset = () => {
    setScores(null);
    setForm(INITIAL_FORM);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout>
      {!scores ? (
        <FormState
          form={form}
          errors={errors}
          isGenerating={isGenerating}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      ) : (
        <ResultsState
          containerRef={resultsRef}
          form={form}
          scores={scores}
          onReset={handleReset}
        />
      )}
    </Layout>
  );
}

// ─── Form Section ─────────────────────────────────────────────────────────────

interface FormStateProps {
  form: AuditFormData;
  errors: Partial<Record<keyof AuditFormData, string>>;
  isGenerating: boolean;
  onChange: (key: keyof AuditFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

function FormState({
  form,
  errors,
  isGenerating,
  onChange,
  onSubmit,
}: FormStateProps) {
  return (
    <section
      data-ocid="audit.page"
      className="min-h-screen bg-background py-16 px-4"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" />
            Instant • Free • No Sign-Up
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Get Your Free Business Audit
          </h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Enter your business details and receive a full Gulf market
            visibility score in seconds.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="bg-card rounded-2xl border border-border shadow-lg p-6 sm:p-8"
        >
          <form onSubmit={onSubmit} noValidate className="space-y-5">
            {/* Business Name */}
            <FormField
              label="Business Name"
              required
              error={errors.businessName}
              data-ocid="audit.business_name_input"
            >
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  data-ocid="audit.business_name_input"
                  placeholder="e.g. Al Noor Salon, Dubai"
                  value={form.businessName}
                  onChange={(e) => onChange("businessName", e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 rounded-lg border bg-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
                    errors.businessName
                      ? "border-destructive"
                      : "border-border",
                  )}
                />
              </div>
            </FormField>

            {/* City */}
            <FormField label="City" required error={errors.city}>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  data-ocid="audit.city_input"
                  placeholder="e.g. Dubai, Riyadh, Muscat"
                  value={form.city}
                  onChange={(e) => onChange("city", e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 rounded-lg border bg-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
                    errors.city ? "border-destructive" : "border-border",
                  )}
                />
              </div>
            </FormField>

            {/* Category */}
            <FormField
              label="Business Category"
              required
              error={errors.category}
            >
              <div className="relative">
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <select
                  data-ocid="audit.category_select"
                  value={form.category}
                  onChange={(e) => onChange("category", e.target.value)}
                  className={cn(
                    "w-full pl-4 pr-10 py-2.5 rounded-lg border bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none transition-colors",
                    errors.category ? "border-destructive" : "border-border",
                    !form.category && "text-muted-foreground",
                  )}
                >
                  <option value="" disabled>
                    Select your business type
                  </option>
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </FormField>

            {/* WhatsApp */}
            <FormField label="WhatsApp Number" required error={errors.whatsapp}>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 bg-muted text-muted-foreground text-sm font-medium border-border">
                  +971
                </span>
                <input
                  type="tel"
                  data-ocid="audit.whatsapp_input"
                  placeholder="50 123 4567"
                  value={form.whatsapp}
                  onChange={(e) => onChange("whatsapp", e.target.value)}
                  className={cn(
                    "flex-1 px-4 py-2.5 rounded-r-lg border bg-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
                    errors.whatsapp ? "border-destructive" : "border-border",
                  )}
                />
              </div>
            </FormField>

            {/* Instagram */}
            <FormField
              label="Instagram Profile URL"
              hint="Optional — improves your audit"
            >
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="url"
                  data-ocid="audit.instagram_input"
                  placeholder="https://instagram.com/yourbusiness"
                  value={form.instagram}
                  onChange={(e) => onChange("instagram", e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                />
              </div>
            </FormField>

            {/* Google Maps */}
            <FormField
              label="Google Maps Business URL"
              hint="Optional — improves your audit"
            >
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="url"
                  data-ocid="audit.google_maps_input"
                  placeholder="https://maps.google.com/..."
                  value={form.googleMapsLink}
                  onChange={(e) => onChange("googleMapsLink", e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                />
              </div>
            </FormField>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                data-ocid="audit.submit_button"
                disabled={isGenerating}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-base transition-all hover:opacity-90 hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Generating your audit…
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Generate My Free Audit
                  </>
                )}
              </button>
              <p className="text-center text-xs text-muted-foreground mt-3">
                ✓ Free &nbsp;·&nbsp; ✓ Instant &nbsp;·&nbsp; ✓ No sign-up
                required
              </p>
            </div>
          </form>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            {
              icon: <ShieldCheck className="w-4 h-4" />,
              label: "Gulf-focused",
            },
            { icon: <Zap className="w-4 h-4" />, label: "Instant results" },
            { icon: <Star className="w-4 h-4" />, label: "Expert analysis" },
            {
              icon: <TrendingUp className="w-4 h-4" />,
              label: "Actionable insights",
            },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground bg-card border border-border rounded-lg py-2 px-3"
            >
              <span className="text-primary">{icon}</span>
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Field Wrapper ────────────────────────────────────────────────────────────

interface FormFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  id?: string;
  children: React.ReactNode;
}

function FormField({
  label,
  required,
  hint,
  error,
  id,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
        {hint && (
          <span className="text-muted-foreground font-normal ml-1 text-xs">
            ({hint})
          </span>
        )}
      </label>
      {children}
      {error && (
        <p data-ocid="audit.field_error" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Results Section ──────────────────────────────────────────────────────────

interface ResultsStateProps {
  form: AuditFormData;
  scores: AuditScore;
  onReset: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function ResultsState({
  form,
  scores,
  onReset,
  containerRef,
}: ResultsStateProps) {
  const _ref = containerRef;
  const scoreItems: {
    key: keyof AuditScore;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "googleVisibility",
      label: "Google Visibility",
      icon: <Globe className="w-4 h-4" />,
    },
    {
      key: "instagramTrust",
      label: "Instagram Trust",
      icon: <Instagram className="w-4 h-4" />,
    },
    {
      key: "whatsappFunnel",
      label: "WhatsApp Funnel",
      icon: <MessageCircle className="w-4 h-4" />,
    },
    {
      key: "website",
      label: "Website Score",
      icon: <Globe className="w-4 h-4" />,
    },
    {
      key: "leadConversion",
      label: "Lead Conversion",
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];

  const overall = scores.overall;
  const overallColor = getScoreColor(overall);
  const overallLabel = getScoreLabel(overall);

  const overallBg =
    overall >= 70
      ? "from-emerald-50 to-emerald-100/50 border-emerald-200"
      : overall >= 40
        ? "from-amber-50 to-amber-100/50 border-amber-200"
        : "from-red-50 to-red-100/50 border-red-200";

  const overallGradient =
    overall >= 70
      ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
      : overall >= 40
        ? "bg-gradient-to-br from-amber-400 to-amber-500"
        : "bg-gradient-to-br from-red-500 to-red-600";

  return (
    <section
      ref={containerRef}
      data-ocid="audit.results_section"
      className="min-h-screen bg-background py-12 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <motion.button
          type="button"
          onClick={onReset}
          data-ocid="audit.back_button"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Re-take audit
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Your Free Business Audit Results
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Analysis for{" "}
            <span className="font-semibold text-foreground">
              {form.businessName}
            </span>{" "}
            · {form.city}
          </p>
        </motion.div>

        {/* Overall score banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={cn(
            "rounded-2xl border bg-gradient-to-br p-6 mb-8 flex flex-col sm:flex-row items-center gap-5",
            overallBg,
          )}
        >
          <div
            className={cn(
              "w-20 h-20 rounded-full flex flex-col items-center justify-center shrink-0 text-white",
              overallGradient,
            )}
          >
            <span className="text-2xl font-bold font-display">{overall}</span>
            <span className="text-[10px] opacity-80">/100</span>
          </div>
          <div className="text-center sm:text-left">
            <p className="font-display font-bold text-lg text-foreground">
              Overall Score:{" "}
              <span className={overallColor}>{overallLabel}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              {getRecommendation("overall", overall)}
            </p>
          </div>
        </motion.div>

        {/* Score cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {scoreItems.map(({ key, label, icon }, i) => (
            <ScoreCard
              key={key}
              label={label}
              score={scores[key]}
              icon={icon}
              recommendation={getRecommendation(key, scores[key])}
              delay={0.15 + i * 0.08}
            />
          ))}
        </div>

        {/* CTA Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-card border border-border rounded-2xl p-6 sm:p-8 text-center shadow-sm"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
            <TrendingUp className="w-3 h-3" />
            Ready to grow?
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-2">
            Unlock Your Full Growth Report
          </h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
            Get a detailed 15-page report with exact steps to rank higher, get
            more WhatsApp leads, and grow your Gulf business in 30 days.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/pricing"
              data-ocid="audit.unlock_report_button"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <TrendingUp className="w-4 h-4" />
              Unlock Full Growth Report — Start with Starter Plan
            </a>
            <button
              type="button"
              data-ocid="audit.book_consultation_button"
              onClick={() => {
                const el = document.getElementById("contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                else window.location.href = "/#contact";
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-secondary text-secondary font-semibold text-sm hover:bg-secondary/10 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Book Free Consultation
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
