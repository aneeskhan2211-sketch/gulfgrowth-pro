import { BUSINESS_CATEGORIES, GULF_COUNTRIES } from "@/data/constants";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Globe,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface BusinessFormData {
  // Step 1
  businessName: string;
  city: string;
  country: string;
  category: string;
  description: string;
  // Step 2
  whatsapp: string;
  whatsappPrefix: string;
  instagram: string;
  googleMapsLink: string;
}

const STEP_LABELS = ["Business Info", "Contact Info", "Review & Submit"];

function StepIndicator({ current, total }: { current: number; total: number }) {
  const steps = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((stepNum) => {
        const i = stepNum - 1;
        const state =
          i < current ? "done" : i === current ? "active" : "pending";
        return (
          <div key={stepNum} className="flex items-center">
            <div
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold transition-all duration-300 border-2",
                state === "done" &&
                  "bg-primary border-primary text-primary-foreground",
                state === "active" &&
                  "bg-primary/10 border-primary text-primary",
                state === "pending" &&
                  "bg-muted border-border text-muted-foreground",
              )}
            >
              {state === "done" ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            {i < total - 1 && (
              <div
                className={cn(
                  "w-16 md:w-24 h-0.5 transition-all duration-500",
                  i < current ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      className="text-destructive text-xs mt-1"
      data-ocid="onboarding.field_error"
    >
      {message}
    </p>
  );
}

const WHATSAPP_PREFIXES = [
  { label: "+971 (UAE)", value: "+971" },
  { label: "+966 (KSA)", value: "+966" },
  { label: "+974 (Qatar)", value: "+974" },
  { label: "+965 (Kuwait)", value: "+965" },
  { label: "+973 (Bahrain)", value: "+973" },
  { label: "+968 (Oman)", value: "+968" },
];

export default function OnboardingPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof BusinessFormData, string>>
  >({});
  const [form, setForm] = useState<BusinessFormData>({
    businessName: "",
    city: "",
    country: "AE",
    category: "",
    description: "",
    whatsapp: "",
    whatsappPrefix: "+971",
    instagram: "",
    googleMapsLink: "",
  });

  const set = (field: keyof BusinessFormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validateStep0 = () => {
    const e: typeof errors = {};
    if (!form.businessName.trim()) e.businessName = "Business name is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.category) e.category = "Please select a category";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep1 = () => {
    const e: typeof errors = {};
    if (!form.whatsapp.trim()) e.whatsapp = "WhatsApp number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep0()) return;
    if (step === 1 && !validateStep1()) return;
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = () => setSubmitted(true);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-10 max-w-md w-full text-center shadow-sm"
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <User className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Sign in to continue
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            You need to be signed in to complete your business onboarding.
          </p>
          <button
            type="button"
            onClick={login}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            data-ocid="onboarding.login_button"
          >
            Sign in with Internet Identity
          </button>
          <Link
            to="/"
            className="block mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="onboarding.back_home_link"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-card border border-border rounded-2xl p-10 max-w-md w-full text-center shadow-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </motion.div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            Business profile created!
          </h2>
          <p className="text-muted-foreground mb-8">
            Your dashboard is ready. Let's start growing{" "}
            <span className="font-semibold text-foreground">
              {form.businessName}
            </span>
            .
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            data-ocid="onboarding.go_to_dashboard_button"
          >
            Go to Dashboard
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  const countryName =
    GULF_COUNTRIES.find((c) => c.code === form.country)?.name ?? form.country;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">G</span>
        </div>
        <span className="font-display font-bold text-foreground">
          GulfGrowth Pro
        </span>
      </header>

      <main className="max-w-xl mx-auto px-4 py-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Set Up Your Business
          </h1>
          <p className="text-muted-foreground">
            Step {step + 1} of 3 — {STEP_LABELS[step]}
          </p>
        </motion.div>

        <StepIndicator current={step} total={3} />

        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="p-6 md:p-8"
                data-ocid="onboarding.step1.panel"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Business Information
                  </h2>
                </div>

                <div className="space-y-5">
                  {/* Business Name */}
                  <div>
                    <label
                      htmlFor="business-name"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Business Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="business-name"
                      type="text"
                      placeholder="e.g. Al Noor Salon"
                      value={form.businessName}
                      onChange={(e) => set("businessName", e.target.value)}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-lg border bg-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow",
                        errors.businessName && "border-destructive",
                      )}
                      data-ocid="onboarding.business_name.input"
                    />
                    <FieldError message={errors.businessName} />
                  </div>

                  {/* Country + City */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-foreground mb-1.5"
                      >
                        Country
                      </label>
                      <select
                        id="country"
                        value={form.country}
                        onChange={(e) => set("country", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                        data-ocid="onboarding.country.select"
                      >
                        {GULF_COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-foreground mb-1.5"
                      >
                        City <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="city"
                        type="text"
                        placeholder="e.g. Dubai"
                        value={form.city}
                        onChange={(e) => set("city", e.target.value)}
                        className={cn(
                          "w-full px-4 py-2.5 rounded-lg border bg-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow",
                          errors.city && "border-destructive",
                        )}
                        data-ocid="onboarding.city.input"
                      />
                      <FieldError message={errors.city} />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Business Category{" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <select
                      id="category"
                      value={form.category}
                      onChange={(e) => set("category", e.target.value)}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-lg border bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow",
                        errors.category && "border-destructive",
                      )}
                      data-ocid="onboarding.category.select"
                    >
                      <option value="">Select category…</option>
                      {BUSINESS_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <FieldError message={errors.category} />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Business Description{" "}
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      id="description"
                      placeholder="Tell us briefly what your business does and who your customers are…"
                      rows={3}
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none"
                      data-ocid="onboarding.description.textarea"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="p-6 md:p-8"
                data-ocid="onboarding.step2.panel"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-secondary" />
                  </div>
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Contact Information
                  </h2>
                </div>

                <div className="space-y-5">
                  {/* WhatsApp */}
                  <div>
                    <label
                      htmlFor="whatsapp"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      <span className="inline-flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5 text-primary" />
                        WhatsApp Number{" "}
                        <span className="text-destructive">*</span>
                      </span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={form.whatsappPrefix}
                        onChange={(e) => set("whatsappPrefix", e.target.value)}
                        className="px-3 py-2.5 rounded-lg border border-border bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow w-36 shrink-0"
                        data-ocid="onboarding.whatsapp_prefix.select"
                      >
                        {WHATSAPP_PREFIXES.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        placeholder="50 123 4567"
                        value={form.whatsapp}
                        onChange={(e) => set("whatsapp", e.target.value)}
                        className={cn(
                          "flex-1 px-4 py-2.5 rounded-lg border bg-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow",
                          errors.whatsapp && "border-destructive",
                        )}
                        id="whatsapp"
                        data-ocid="onboarding.whatsapp.input"
                      />
                    </div>
                    <FieldError message={errors.whatsapp} />
                    <p className="text-xs text-muted-foreground mt-1">
                      We'll use this for your WhatsApp lead funnel setup.
                    </p>
                  </div>

                  {/* Instagram */}
                  <div>
                    <label
                      htmlFor="instagram"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      <span className="inline-flex items-center gap-1">
                        <Instagram className="w-3.5 h-3.5 text-primary" />
                        Instagram Profile URL{" "}
                        <span className="text-muted-foreground font-normal">
                          (optional)
                        </span>
                      </span>
                    </label>
                    <input
                      id="instagram"
                      type="url"
                      placeholder="https://instagram.com/yourbusiness"
                      value={form.instagram}
                      onChange={(e) => set("instagram", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                      data-ocid="onboarding.instagram.input"
                    />
                  </div>

                  {/* Google Maps */}
                  <div>
                    <label
                      htmlFor="google-maps"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        Google Maps Listing URL{" "}
                        <span className="text-muted-foreground font-normal">
                          (optional)
                        </span>
                      </span>
                    </label>
                    <input
                      id="google-maps"
                      type="url"
                      placeholder="https://maps.google.com/..."
                      value={form.googleMapsLink}
                      onChange={(e) => set("googleMapsLink", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                      data-ocid="onboarding.google_maps.input"
                    />
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <p className="text-xs text-foreground">
                      <span className="font-semibold text-primary">
                        Privacy note:
                      </span>{" "}
                      Your contact details are only used to set up your growth
                      campaigns. We never share your data.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="p-6 md:p-8"
                data-ocid="onboarding.step3.panel"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Review & Submit
                  </h2>
                </div>

                <p className="text-sm text-muted-foreground mb-5">
                  Please review your information before creating your profile.
                </p>

                <div className="space-y-3">
                  <SummaryRow
                    icon="🏢"
                    label="Business Name"
                    value={form.businessName}
                  />
                  <SummaryRow
                    icon="📍"
                    label="Location"
                    value={`${form.city}, ${countryName}`}
                  />
                  <SummaryRow icon="🏷️" label="Category" value={form.category} />
                  {form.description && (
                    <SummaryRow
                      icon="📝"
                      label="Description"
                      value={form.description}
                    />
                  )}
                  <div className="border-t border-border my-3" />
                  <SummaryRow
                    icon="💬"
                    label="WhatsApp"
                    value={`${form.whatsappPrefix} ${form.whatsapp}`}
                  />
                  {form.instagram && (
                    <SummaryRow
                      icon="📸"
                      label="Instagram"
                      value={form.instagram}
                    />
                  )}
                  {form.googleMapsLink && (
                    <SummaryRow
                      icon="🗺️"
                      label="Google Maps"
                      value={form.googleMapsLink}
                    />
                  )}
                </div>

                <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold text-primary">
                      Ready to grow?
                    </span>{" "}
                    After submitting, you'll get access to your personalized
                    dashboard with your growth metrics and quick actions.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Nav */}
          <div className="flex items-center justify-between px-6 md:px-8 py-5 border-t border-border bg-muted/30">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 0}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded-lg hover:bg-muted"
              data-ocid="onboarding.back_button"
            >
              ← Back
            </button>

            {step < 2 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-6 rounded-xl text-sm transition-colors duration-200 flex items-center gap-2"
                data-ocid="onboarding.next_button"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-8 rounded-xl text-sm transition-colors duration-200 flex items-center gap-2"
                data-ocid="onboarding.submit_button"
              >
                <CheckCircle2 className="w-4 h-4" />
                Create My Profile
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="shrink-0 w-5 text-center">{icon}</span>
      <span className="text-muted-foreground w-28 shrink-0">{label}</span>
      <span className="text-foreground font-medium break-all min-w-0">
        {value}
      </span>
    </div>
  );
}
