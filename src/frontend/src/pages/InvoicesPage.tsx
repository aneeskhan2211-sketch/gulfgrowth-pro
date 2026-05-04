import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/lib/auth";
import { cn, formatDate } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Calendar,
  CreditCard,
  Download,
  FileText,
  LogIn,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

type InvoiceStatus = "paid" | "pending" | "failed";
type StatusFilter = "all" | InvoiceStatus;

interface Invoice {
  id: string;
  plan: string;
  amount: number;
  currency: string;
  date: number;
  status: InvoiceStatus;
}

const MOCK_INVOICES: Invoice[] = [
  {
    id: "INV-2025-010",
    plan: "Growth",
    amount: 699,
    currency: "AED",
    date: new Date("2025-05-01").getTime(),
    status: "paid",
  },
  {
    id: "INV-2025-009",
    plan: "Growth",
    amount: 699,
    currency: "AED",
    date: new Date("2025-04-01").getTime(),
    status: "paid",
  },
  {
    id: "INV-2025-008",
    plan: "Starter",
    amount: 299,
    currency: "AED",
    date: new Date("2025-03-01").getTime(),
    status: "paid",
  },
  {
    id: "INV-2025-007",
    plan: "Starter",
    amount: 299,
    currency: "AED",
    date: new Date("2025-02-01").getTime(),
    status: "paid",
  },
  {
    id: "INV-2025-006",
    plan: "Starter",
    amount: 299,
    currency: "AED",
    date: new Date("2025-01-15").getTime(),
    status: "paid",
  },
  {
    id: "INV-2025-005",
    plan: "Growth",
    amount: 699,
    currency: "AED",
    date: new Date("2025-01-01").getTime(),
    status: "pending",
  },
  {
    id: "INV-2024-004",
    plan: "Growth",
    amount: 699,
    currency: "AED",
    date: new Date("2024-12-01").getTime(),
    status: "paid",
  },
  {
    id: "INV-2024-003",
    plan: "Starter",
    amount: 299,
    currency: "SAR",
    date: new Date("2024-11-01").getTime(),
    status: "paid",
  },
  {
    id: "INV-2024-002",
    plan: "Premium",
    amount: 1499,
    currency: "AED",
    date: new Date("2024-10-15").getTime(),
    status: "failed",
  },
  {
    id: "INV-2024-001",
    plan: "Starter",
    amount: 299,
    currency: "AED",
    date: new Date("2024-09-01").getTime(),
    status: "paid",
  },
];

const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; classes: string; icon: React.ReactNode }
> = {
  paid: {
    label: "Paid",
    classes: "bg-primary/10 text-primary border border-primary/20",
    icon: <BadgeCheck className="w-3 h-3" />,
  },
  pending: {
    label: "Pending",
    classes:
      "bg-amber-500/10 text-amber-600 border border-amber-400/30 dark:text-amber-400",
    icon: <Calendar className="w-3 h-3" />,
  },
  failed: {
    label: "Failed",
    classes: "bg-destructive/10 text-destructive border border-destructive/20",
    icon: <XCircle className="w-3 h-3" />,
  },
};

const FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
];

export default function InvoicesPage() {
  const { isAuthenticated, login } = useAuth();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = MOCK_INVOICES.filter(
    (inv) => statusFilter === "all" || inv.status === statusFilter,
  );

  const totalPaid = MOCK_INVOICES.filter((i) => i.status === "paid").reduce(
    (sum, i) => sum + (i.currency === "AED" ? i.amount : i.amount),
    0,
  );

  const handleDownload = (id: string) => {
    toast.success(`Invoice ${id} downloaded`, {
      description: "Your PDF has been saved to your downloads folder.",
      duration: 4000,
    });
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div
          className="max-w-2xl mx-auto px-4 py-24 text-center"
          data-ocid="invoices.page"
        >
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-3">
            Sign in to view invoices
          </h1>
          <p className="text-muted-foreground mb-8">
            Your billing history is protected. Sign in to access your invoices
            and payment records.
          </p>
          <button
            type="button"
            onClick={login}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8 rounded-xl transition-colors duration-200"
            data-ocid="invoices.login_button"
          >
            Sign In
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8" data-ocid="invoices.page">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display text-2xl font-bold text-foreground">
                Invoice History
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                Growth Plan
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              All billing records for your GulfGrowth Pro subscription.
            </p>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <SummaryCard
            icon={<CreditCard className="w-5 h-5 text-primary" />}
            label="Total Paid"
            value={`${totalPaid.toLocaleString()} AED`}
            sub="All-time payments"
            accent="primary"
          />
          <SummaryCard
            icon={<TrendingUp className="w-5 h-5 text-secondary" />}
            label="Active Plan"
            value="Growth"
            sub="699 AED / month"
            accent="secondary"
          />
          <SummaryCard
            icon={<Calendar className="w-5 h-5 text-amber-500" />}
            label="Next Billing"
            value="15 Jun 2025"
            sub="Auto-renews monthly"
            accent="amber"
          />
        </motion.div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-5" role="tablist">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              role="tab"
              aria-selected={statusFilter === f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150",
                statusFilter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80",
              )}
              data-ocid={`invoices.filter.${f.value}`}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} invoice{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
            data-ocid="invoices.table"
          >
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Invoice #
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Plan
                    </th>
                    <th className="text-right px-4 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Date
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-4 py-3.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((inv, idx) => (
                    <motion.tr
                      key={inv.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="hover:bg-muted/30 transition-colors"
                      data-ocid={`invoices.item.${idx + 1}`}
                    >
                      <td className="px-5 py-4 font-mono text-xs text-foreground font-medium">
                        {inv.id}
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-medium text-foreground">
                          {inv.plan}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-foreground tabular-nums">
                        {inv.amount.toLocaleString()} {inv.currency}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {formatDate(inv.date)}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDownload(inv.id)}
                          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-2.5 py-1.5 rounded-lg hover:bg-primary/5"
                          data-ocid={`invoices.download_button.${idx + 1}`}
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-border">
              {filtered.map((inv, idx) => (
                <div
                  key={inv.id}
                  className="p-4"
                  data-ocid={`invoices.item.${idx + 1}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">
                        {inv.id}
                      </p>
                      <p className="font-semibold text-foreground">
                        {inv.plan} Plan
                      </p>
                    </div>
                    <StatusBadge status={inv.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-foreground tabular-nums">
                        {inv.amount.toLocaleString()} {inv.currency}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(inv.date)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownload(inv.id)}
                      className="inline-flex items-center gap-1.5 text-xs text-primary font-medium px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                      data-ocid={`invoices.download_button.${idx + 1}`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full",
        cfg.classes,
      )}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent: "primary" | "secondary" | "amber";
}) {
  const bg: Record<string, string> = {
    primary: "bg-primary/5 border-primary/20",
    secondary: "bg-secondary/5 border-secondary/20",
    amber: "bg-amber-500/5 border-amber-400/20",
  };
  return (
    <div className={cn("bg-card border rounded-xl p-5", bg[accent])}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
          {icon}
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="font-display text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="bg-card border border-border rounded-2xl p-16 text-center"
      data-ocid="invoices.empty_state"
    >
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
        <FileText className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-2">
        No invoices yet
      </h3>
      <p className="text-muted-foreground text-sm mb-6">
        Upgrade to a plan to get started and your billing history will appear
        here.
      </p>
      <Link
        to="/pricing"
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-6 rounded-xl text-sm transition-colors duration-200"
        data-ocid="invoices.upgrade_link"
      >
        View Plans
      </Link>
    </div>
  );
}
