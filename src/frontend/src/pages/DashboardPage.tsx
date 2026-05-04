import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  FileText,
  Globe,
  Instagram,
  LogIn,
  MapPin,
  MessageCircle,
  Phone,
  Settings,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────
type DateRange = "7d" | "30d" | "90d";
type LeadSource = "WhatsApp" | "Google" | "Instagram" | "Website";
type LeadType = "Inquiry" | "Call" | "Booking";
type LeadStatus = "New" | "Contacted" | "Converted";

interface MockLead {
  date: string;
  source: LeadSource;
  type: LeadType;
  status: LeadStatus;
  name: string;
}

interface MetricData {
  value: string;
  trend: number;
  trendLabel: string;
}

interface RangeMetrics {
  totalLeads: MetricData;
  whatsappClicks: MetricData;
  phoneCalls: MetricData;
  websiteVisits: MetricData;
  instagramGrowth: MetricData;
  googleRanking: MetricData;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────
const RANGE_DATA: Record<DateRange, RangeMetrics> = {
  "7d": {
    totalLeads: { value: "38", trend: 18, trendLabel: "+18% vs prev. week" },
    whatsappClicks: {
      value: "24",
      trend: 24,
      trendLabel: "+24% vs prev. week",
    },
    phoneCalls: { value: "9", trend: 8, trendLabel: "+8% vs prev. week" },
    websiteVisits: {
      value: "312",
      trend: 31,
      trendLabel: "+31% vs prev. week",
    },
    instagramGrowth: {
      value: "+214",
      trend: 15,
      trendLabel: "+15% vs prev. week",
    },
    googleRanking: { value: "#4", trend: 2, trendLabel: "+2 positions" },
  },
  "30d": {
    totalLeads: { value: "142", trend: 18, trendLabel: "+18% vs prev. month" },
    whatsappClicks: {
      value: "89",
      trend: 24,
      trendLabel: "+24% vs prev. month",
    },
    phoneCalls: { value: "34", trend: 8, trendLabel: "+8% vs prev. month" },
    websiteVisits: {
      value: "1,204",
      trend: 31,
      trendLabel: "+31% vs prev. month",
    },
    instagramGrowth: {
      value: "+847",
      trend: 15,
      trendLabel: "+15% vs prev. month",
    },
    googleRanking: { value: "#4", trend: 2, trendLabel: "+2 positions" },
  },
  "90d": {
    totalLeads: {
      value: "398",
      trend: 22,
      trendLabel: "+22% vs prev. quarter",
    },
    whatsappClicks: {
      value: "251",
      trend: 19,
      trendLabel: "+19% vs prev. quarter",
    },
    phoneCalls: { value: "97", trend: 12, trendLabel: "+12% vs prev. quarter" },
    websiteVisits: {
      value: "3,540",
      trend: 38,
      trendLabel: "+38% vs prev. quarter",
    },
    instagramGrowth: {
      value: "+2,340",
      trend: 28,
      trendLabel: "+28% vs prev. quarter",
    },
    googleRanking: { value: "#3", trend: 4, trendLabel: "+4 positions" },
  },
};

const LEAD_GROWTH_DATA = [
  { month: "Jun", leads: 52 },
  { month: "Jul", leads: 67 },
  { month: "Aug", leads: 74 },
  { month: "Sep", leads: 61 },
  { month: "Oct", leads: 88 },
  { month: "Nov", leads: 95 },
  { month: "Dec", leads: 82 },
  { month: "Jan", leads: 108 },
  { month: "Feb", leads: 119 },
  { month: "Mar", leads: 127 },
  { month: "Apr", leads: 138 },
  { month: "May", leads: 142 },
];

const SOURCE_BREAKDOWN = [
  { label: "WhatsApp", pct: 45, color: "bg-emerald-500" },
  { label: "Google", pct: 28, color: "bg-secondary" },
  { label: "Instagram", pct: 18, color: "bg-primary" },
  { label: "Website", pct: 9, color: "bg-muted-foreground" },
];

const MOCK_LEADS: MockLead[] = [
  {
    date: "3 May 2026",
    source: "WhatsApp",
    type: "Inquiry",
    status: "Converted",
    name: "Sara Al Rashidi",
  },
  {
    date: "3 May 2026",
    source: "Google",
    type: "Call",
    status: "Contacted",
    name: "Mohammed Al Farsi",
  },
  {
    date: "2 May 2026",
    source: "Instagram",
    type: "Inquiry",
    status: "New",
    name: "Fatima Al Zaabi",
  },
  {
    date: "2 May 2026",
    source: "WhatsApp",
    type: "Booking",
    status: "Converted",
    name: "Khalid Al Mansoori",
  },
  {
    date: "1 May 2026",
    source: "Website",
    type: "Inquiry",
    status: "Contacted",
    name: "Layla Hassan",
  },
  {
    date: "1 May 2026",
    source: "Google",
    type: "Call",
    status: "Converted",
    name: "Omar Al Balushi",
  },
  {
    date: "30 Apr 2026",
    source: "WhatsApp",
    type: "Inquiry",
    status: "New",
    name: "Noura Al Shamsi",
  },
  {
    date: "30 Apr 2026",
    source: "Instagram",
    type: "Booking",
    status: "Contacted",
    name: "Ahmed Al Kuwari",
  },
  {
    date: "29 Apr 2026",
    source: "Google",
    type: "Inquiry",
    status: "Converted",
    name: "Dana Al Mutairi",
  },
  {
    date: "29 Apr 2026",
    source: "WhatsApp",
    type: "Call",
    status: "New",
    name: "Saeed Al Dhaheri",
  },
];

const ROI_DATA = [
  { label: "Revenue from Leads", value: "8,400 AED" },
  { label: "Plan Cost", value: "699 AED" },
  { label: "Net Return", value: "7,701 AED" },
  { label: "ROI Multiplier", value: "12x" },
];

// ─── Sub-components ─────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: LeadStatus }) {
  const variants: Record<LeadStatus, string> = {
    New: "bg-secondary/15 text-secondary border-secondary/30",
    Contacted: "bg-primary/15 text-primary border-primary/30",
    Converted: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  };
  return (
    <Badge
      variant="outline"
      className={cn("font-medium text-xs border", variants[status])}
    >
      {status}
    </Badge>
  );
}

function SourceIcon({ source }: { source: LeadSource }) {
  const icons: Record<LeadSource, React.ReactNode> = {
    WhatsApp: <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />,
    Google: <Globe className="w-3.5 h-3.5 text-secondary" />,
    Instagram: <Instagram className="w-3.5 h-3.5 text-primary" />,
    Website: <Globe className="w-3.5 h-3.5 text-muted-foreground" />,
  };
  return (
    <span className="flex items-center gap-1.5">
      {icons[source]}
      <span className="text-sm">{source}</span>
    </span>
  );
}

function TrendIndicator({ trend }: { trend: number }) {
  const isPositive = trend >= 0;
  return (
    <span
      className={cn(
        "flex items-center gap-0.5 text-xs font-semibold",
        isPositive ? "text-emerald-600" : "text-destructive",
      )}
    >
      {isPositive ? (
        <ArrowUpRight className="w-3 h-3" />
      ) : (
        <ArrowDownRight className="w-3 h-3" />
      )}
      {isPositive ? "+" : ""}
      {trend}%
    </span>
  );
}

// Inline SVG sparkline
function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 32;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  const color = positive ? "oklch(0.75 0.14 71)" : "oklch(0.62 0.22 25)";
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="opacity-80"
      role="img"
      aria-label="sparkline chart"
    >
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Lead growth SVG chart
function LeadGrowthChart({ data }: { data: typeof LEAD_GROWTH_DATA }) {
  const max = Math.max(...data.map((d) => d.leads));
  const w = 100;
  const h = 100;
  const pts = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - (d.leads / max) * (h - 10);
      return `${x},${y}`;
    })
    .join(" ");
  const areaPath = `M0,${h} L${data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - (d.leads / max) * (h - 10);
      return `${x},${y}`;
    })
    .join(" L")} L${w},${h} Z`;
  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        className="w-full h-32"
        role="img"
        aria-label="lead growth chart"
      >
        <defs>
          <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="oklch(0.68 0.14 71)"
              stopOpacity="0.25"
            />
            <stop
              offset="100%"
              stopColor="oklch(0.68 0.14 71)"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#leadGrad)" />
        <polyline
          points={pts}
          fill="none"
          stroke="oklch(0.68 0.14 71)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
        {data.map((d) => (
          <span key={d.month}>{d.month}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const [range, setRange] = useState<DateRange>("30d");
  const metrics = RANGE_DATA[range];

  // Sparkline stub data sets
  const sparklines: Record<string, number[]> = {
    totalLeads: [80, 95, 88, 102, 115, 108, 120, 135, 128, 142],
    whatsappClicks: [55, 62, 58, 70, 75, 68, 82, 87, 80, 89],
    phoneCalls: [20, 24, 22, 27, 29, 25, 31, 33, 30, 34],
    websiteVisits: [700, 820, 780, 910, 990, 945, 1050, 1120, 1090, 1204],
    instagramGrowth: [450, 530, 510, 600, 650, 620, 700, 790, 760, 847],
    googleRanking: [8, 7, 7, 6, 5, 6, 5, 4, 4, 4],
  };

  if (isLoading) {
    return (
      <Layout hideFooter>
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["skel-a", "skel-b", "skel-c", "skel-d", "skel-e", "skel-f"].map(
              (id) => (
                <Skeleton key={id} className="h-36" />
              ),
            )}
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout hideFooter>
        <div
          data-ocid="dashboard.unauthenticated"
          className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              Sign in to access your dashboard
            </h2>
            <p className="text-muted-foreground max-w-md">
              Your business metrics, leads, and growth reports are waiting. Sign
              in with Internet Identity to continue.
            </p>
          </div>
          <Button
            data-ocid="dashboard.login_button"
            onClick={login}
            size="lg"
            className="gap-2"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <div
        data-ocid="dashboard.page"
        className="max-w-7xl mx-auto px-4 py-6 space-y-6"
      >
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              My Business Dashboard
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-muted-foreground text-sm">
                Welcome back! Here&apos;s your growth summary.
              </p>
              <Badge
                variant="outline"
                className="border-primary/40 bg-primary/10 text-primary font-semibold text-xs"
              >
                Growth Plan
              </Badge>
              <span className="text-muted-foreground text-xs hidden sm:inline">
                ·{" "}
                {new Date().toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Date range selector */}
            <div
              data-ocid="dashboard.date_range.tab"
              className="flex items-center rounded-lg border border-border bg-card p-1 gap-1"
            >
              {(["7d", "30d", "90d"] as DateRange[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  data-ocid={`dashboard.range_${r}.toggle`}
                  onClick={() => setRange(r)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
                    range === r
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "90 Days"}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              data-ocid="dashboard.settings_button"
              className="gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              Settings
            </Button>
          </div>
        </div>

        {/* ── Metrics Grid ── */}
        <div
          data-ocid="dashboard.metrics.section"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {[
            {
              ocid: "dashboard.metric_leads.card",
              icon: <Users className="w-5 h-5" />,
              label: "Total Leads",
              key: "totalLeads" as const,
              sparkKey: "totalLeads",
            },
            {
              ocid: "dashboard.metric_whatsapp.card",
              icon: <MessageCircle className="w-5 h-5" />,
              label: "WhatsApp Clicks",
              key: "whatsappClicks" as const,
              sparkKey: "whatsappClicks",
            },
            {
              ocid: "dashboard.metric_calls.card",
              icon: <Phone className="w-5 h-5" />,
              label: "Phone Calls",
              key: "phoneCalls" as const,
              sparkKey: "phoneCalls",
            },
            {
              ocid: "dashboard.metric_visits.card",
              icon: <Globe className="w-5 h-5" />,
              label: "Website Visits",
              key: "websiteVisits" as const,
              sparkKey: "websiteVisits",
            },
            {
              ocid: "dashboard.metric_instagram.card",
              icon: <Instagram className="w-5 h-5" />,
              label: "Instagram Growth",
              key: "instagramGrowth" as const,
              sparkKey: "instagramGrowth",
            },
            {
              ocid: "dashboard.metric_google.card",
              icon: <MapPin className="w-5 h-5" />,
              label: "Google Ranking",
              key: "googleRanking" as const,
              sparkKey: "googleRanking",
            },
          ].map((card, idx) => {
            const data = metrics[card.key];
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
              >
                <Card
                  data-ocid={card.ocid}
                  className="bg-card border border-border hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        {card.icon}
                      </div>
                      <Sparkline
                        data={sparklines[card.sparkKey]}
                        positive={data.trend >= 0}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {card.label}
                    </p>
                    <p className="font-display text-2xl font-bold text-foreground leading-none mb-2">
                      {data.value}
                    </p>
                    <div className="flex items-center justify-between">
                      <TrendIndicator trend={data.trend} />
                      <span className="text-[10px] text-muted-foreground">
                        {data.trendLabel}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* ── ROI Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.4 }}
        >
          <Card
            data-ocid="dashboard.roi.card"
            className="bg-gradient-to-r from-primary/5 via-card to-secondary/5 border border-primary/20"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Estimated Monthly ROI
                </CardTitle>
                <Badge className="bg-primary text-primary-foreground font-bold text-sm px-3">
                  12x Return
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {ROI_DATA.map((row) => (
                  <div key={row.label} className="text-center">
                    <p className="text-[11px] text-muted-foreground mb-1">
                      {row.label}
                    </p>
                    <p className="font-display font-bold text-lg text-foreground">
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border/60">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-border/60">
                    {[
                      [
                        "Revenue from 142 leads (avg. 59 AED each)",
                        "8,400 AED",
                      ],
                      ["Monthly Growth Plan cost", "− 699 AED"],
                      ["Net monthly gain", "7,701 AED"],
                    ].map(([label, val]) => (
                      <tr key={label}>
                        <td className="py-1.5 text-muted-foreground">
                          {label}
                        </td>
                        <td className="py-1.5 text-right font-semibold text-foreground">
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Charts Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Lead Growth Chart */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
          >
            <Card
              data-ocid="dashboard.lead_chart.card"
              className="bg-card border border-border"
            >
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Lead Growth — Last 12 Months
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LeadGrowthChart data={LEAD_GROWTH_DATA} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Lead Source Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
          >
            <Card
              data-ocid="dashboard.source_chart.card"
              className="bg-card border border-border"
            >
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  Lead Source Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                {SOURCE_BREAKDOWN.map((src) => (
                  <div key={src.label} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-foreground">
                        {src.label}
                      </span>
                      <span className="text-muted-foreground font-semibold">
                        {src.pct}%
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className={cn("h-full rounded-full", src.color)}
                        initial={{ width: 0 }}
                        animate={{ width: `${src.pct}%` }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ── Recent Leads Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.5 }}
        >
          <Card
            data-ocid="dashboard.leads_table.card"
            className="bg-card border border-border"
          >
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Recent Leads
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-xs font-semibold text-muted-foreground">
                        #
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground">
                        Date
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground">
                        Name
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground">
                        Source
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground">
                        Type
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_LEADS.map((lead, i) => (
                      <TableRow
                        key={lead.name}
                        data-ocid={`dashboard.leads_table.item.${i + 1}`}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <TableCell className="text-muted-foreground text-xs font-mono">
                          {i + 1}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {lead.date}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-foreground">
                          {lead.name}
                        </TableCell>
                        <TableCell>
                          <SourceIcon source={lead.source} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {lead.type}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={lead.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Quick Actions ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.55 }}
          data-ocid="dashboard.quick_actions.section"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            {
              ocid: "dashboard.update_profile.button",
              icon: <Settings className="w-5 h-5" />,
              label: "Update Business Profile",
              desc: "Edit your business details, services, and photos",
              href: "/onboarding",
              variant: "outline" as const,
            },
            {
              ocid: "dashboard.view_invoices.button",
              icon: <FileText className="w-5 h-5" />,
              label: "View Invoices",
              desc: "Download receipts and manage billing history",
              href: "/invoices",
              variant: "outline" as const,
            },
            {
              ocid: "dashboard.new_audit.button",
              icon: <BarChart3 className="w-5 h-5" />,
              label: "Get New Audit",
              desc: "Run a fresh growth audit for your business",
              href: "/#audit",
              variant: "default" as const,
            },
          ].map((action) => (
            <button
              key={action.label}
              type="button"
              data-ocid={action.ocid}
              onClick={() => {
                if (action.href.startsWith("/#")) {
                  window.location.href = action.href;
                } else {
                  void navigate({ to: action.href as "/" });
                }
              }}
              className={cn(
                "flex items-start gap-4 p-5 rounded-xl border text-left transition-all hover:shadow-md",
                action.variant === "default"
                  ? "bg-primary/5 border-primary/30 hover:bg-primary/10"
                  : "bg-card border-border hover:bg-muted/30",
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                  action.variant === "default"
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {action.icon}
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    "font-semibold text-sm",
                    action.variant === "default"
                      ? "text-primary"
                      : "text-foreground",
                  )}
                >
                  {action.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {action.desc}
                </p>
              </div>
            </button>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
}
