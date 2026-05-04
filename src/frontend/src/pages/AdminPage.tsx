import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  Globe,
  Home,
  Instagram,
  MapPin,
  MessageCircle,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type LeadSource = "WhatsApp" | "Google" | "Instagram" | "Website";
type LeadType = "Inquiry" | "Call" | "Booking";
type LeadStatus = "New" | "Contacted" | "Converted";
type SubStatus = "Active" | "Canceled" | "Expired";
type Plan = "Starter" | "Growth" | "Premium";

interface AdminLead {
  date: string;
  business: string;
  source: LeadSource;
  type: LeadType;
  status: LeadStatus;
}

interface DemoRequest {
  date: string;
  business: string;
  owner: string;
  country: string;
  service: string;
  whatsapp: string;
  budget: string;
}

interface SubscriptionRow {
  user: string;
  plan: Plan;
  status: SubStatus;
  startDate: string;
  amount: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────
const LEADS: AdminLead[] = [
  {
    date: "2026-05-03",
    business: "Al Noor Salon Dubai",
    source: "WhatsApp",
    type: "Inquiry",
    status: "New",
  },
  {
    date: "2026-05-03",
    business: "Gulf Auto Garage",
    source: "Google",
    type: "Call",
    status: "Contacted",
  },
  {
    date: "2026-05-02",
    business: "Muscat Coffee Roasters",
    source: "Instagram",
    type: "Inquiry",
    status: "Converted",
  },
  {
    date: "2026-05-02",
    business: "Riyadh Fit Gym",
    source: "Website",
    type: "Booking",
    status: "New",
  },
  {
    date: "2026-05-01",
    business: "Doha Dental Clinic",
    source: "Google",
    type: "Inquiry",
    status: "Contacted",
  },
  {
    date: "2026-05-01",
    business: "Manama Mobile Shop",
    source: "WhatsApp",
    type: "Call",
    status: "Converted",
  },
  {
    date: "2026-04-30",
    business: "Kuwait Fresh Laundry",
    source: "Instagram",
    type: "Booking",
    status: "New",
  },
  {
    date: "2026-04-30",
    business: "Sharjah Spice Café",
    source: "Google",
    type: "Inquiry",
    status: "Contacted",
  },
  {
    date: "2026-04-29",
    business: "Abu Dhabi Real Estate",
    source: "Website",
    type: "Call",
    status: "New",
  },
  {
    date: "2026-04-29",
    business: "Jeddah Beauty Studio",
    source: "WhatsApp",
    type: "Booking",
    status: "Converted",
  },
  {
    date: "2026-04-28",
    business: "Muscat Motors",
    source: "Google",
    type: "Inquiry",
    status: "New",
  },
  {
    date: "2026-04-28",
    business: "Dubai Pet Clinic",
    source: "Instagram",
    type: "Call",
    status: "Contacted",
  },
  {
    date: "2026-04-27",
    business: "Bahrain Print Hub",
    source: "Website",
    type: "Inquiry",
    status: "Converted",
  },
  {
    date: "2026-04-27",
    business: "Oman Optical Centre",
    source: "WhatsApp",
    type: "Booking",
    status: "New",
  },
  {
    date: "2026-04-26",
    business: "Qatar Tech Repairs",
    source: "Google",
    type: "Inquiry",
    status: "Contacted",
  },
];

const DEMO_REQUESTS: DemoRequest[] = [
  {
    date: "2026-05-03",
    business: "Pearl Tower Café",
    owner: "Khalid Al-Rashid",
    country: "Qatar",
    service: "Google Business Optimization",
    whatsapp: "+974 5512 3344",
    budget: "500-1000 AED",
  },
  {
    date: "2026-05-02",
    business: "Dunes Salon & Spa",
    owner: "Fatima Al-Khoury",
    country: "UAE",
    service: "Instagram Management",
    whatsapp: "+971 5011 2233",
    budget: "1000-2000 AED",
  },
  {
    date: "2026-05-02",
    business: "Al Baraka Pharmacy",
    owner: "Mohammed Al-Hamdan",
    country: "Saudi Arabia",
    service: "WhatsApp Lead Funnel",
    whatsapp: "+966 5088 9900",
    budget: "Under 500 AED",
  },
  {
    date: "2026-05-01",
    business: "Green Valley Gym",
    owner: "Omar Al-Nasser",
    country: "Kuwait",
    service: "Monthly Growth Plan",
    whatsapp: "+965 6611 4422",
    budget: "2000+ AED",
  },
  {
    date: "2026-04-30",
    business: "Muscat Gourmet",
    owner: "Laila Al-Balushi",
    country: "Oman",
    service: "Meta Ads Setup",
    whatsapp: "+968 9966 7788",
    budget: "500-1000 AED",
  },
  {
    date: "2026-04-29",
    business: "City Auto Service",
    owner: "Ahmad Al-Mansoori",
    country: "UAE",
    service: "Local SEO",
    whatsapp: "+971 5588 1122",
    budget: "1000-2000 AED",
  },
  {
    date: "2026-04-28",
    business: "Pearl Laundry",
    owner: "Nour Al-Farsi",
    country: "Bahrain",
    service: "Landing Page / Website",
    whatsapp: "+973 3344 5566",
    budget: "500-1000 AED",
  },
  {
    date: "2026-04-27",
    business: "Sunrise Clinic",
    owner: "Dr. Sara Al-Ghamdi",
    country: "Saudi Arabia",
    service: "Review & Rating Growth",
    whatsapp: "+966 5022 8899",
    budget: "1000-2000 AED",
  },
  {
    date: "2026-04-26",
    business: "Gulf Electronics",
    owner: "Hassan Al-Ali",
    country: "UAE",
    service: "Business Analytics Dashboard",
    whatsapp: "+971 5533 6677",
    budget: "2000+ AED",
  },
  {
    date: "2026-04-25",
    business: "Doha Barbershop",
    owner: "Tariq Al-Hajri",
    country: "Qatar",
    service: "Monthly Content Calendar",
    whatsapp: "+974 5544 1122",
    budget: "Under 500 AED",
  },
];

const SUBSCRIPTIONS: SubscriptionRow[] = [
  {
    user: "Khalid Al-Rashid",
    plan: "Premium",
    status: "Active",
    startDate: "2026-04-01",
    amount: "1,499 AED",
  },
  {
    user: "Fatima Al-Khoury",
    plan: "Growth",
    status: "Active",
    startDate: "2026-04-05",
    amount: "699 AED",
  },
  {
    user: "Mohammed Al-Hamdan",
    plan: "Starter",
    status: "Active",
    startDate: "2026-04-10",
    amount: "299 AED",
  },
  {
    user: "Omar Al-Nasser",
    plan: "Premium",
    status: "Active",
    startDate: "2026-03-15",
    amount: "1,499 AED",
  },
  {
    user: "Laila Al-Balushi",
    plan: "Growth",
    status: "Canceled",
    startDate: "2026-02-20",
    amount: "699 AED",
  },
  {
    user: "Ahmad Al-Mansoori",
    plan: "Growth",
    status: "Active",
    startDate: "2026-04-18",
    amount: "699 AED",
  },
  {
    user: "Nour Al-Farsi",
    plan: "Starter",
    status: "Expired",
    startDate: "2026-01-10",
    amount: "299 AED",
  },
  {
    user: "Dr. Sara Al-Ghamdi",
    plan: "Premium",
    status: "Active",
    startDate: "2026-04-22",
    amount: "1,499 AED",
  },
  {
    user: "Hassan Al-Ali",
    plan: "Growth",
    status: "Canceled",
    startDate: "2026-03-01",
    amount: "699 AED",
  },
  {
    user: "Tariq Al-Hajri",
    plan: "Starter",
    status: "Active",
    startDate: "2026-05-01",
    amount: "299 AED",
  },
];

// ─── Badge Helpers ────────────────────────────────────────────────────────────
const SOURCE_COLORS: Record<LeadSource, string> = {
  WhatsApp: "bg-green-500/15 text-green-700 border-green-200",
  Google: "bg-blue-500/15 text-blue-700 border-blue-200",
  Instagram: "bg-pink-500/15 text-pink-700 border-pink-200",
  Website: "bg-purple-500/15 text-purple-700 border-purple-200",
};

const SOURCE_ICONS: Record<LeadSource, React.ReactNode> = {
  WhatsApp: <MessageCircle size={12} />,
  Google: <MapPin size={12} />,
  Instagram: <Instagram size={12} />,
  Website: <Globe size={12} />,
};

const TYPE_COLORS: Record<LeadType, string> = {
  Inquiry: "bg-secondary/15 text-secondary border-secondary/30",
  Call: "bg-primary/15 text-primary border-primary/30",
  Booking: "bg-chart-3/20 text-chart-3 border-chart-3/30",
};

const STATUS_COLORS: Record<LeadStatus, string> = {
  New: "bg-blue-500/15 text-blue-700 border-blue-200",
  Contacted: "bg-amber-400/15 text-amber-700 border-amber-200",
  Converted: "bg-green-500/15 text-green-700 border-green-200",
};

const PLAN_COLORS: Record<Plan, string> = {
  Starter: "bg-muted text-muted-foreground border-border",
  Growth: "bg-secondary/15 text-secondary border-secondary/30",
  Premium: "bg-primary/15 text-primary border-primary/30",
};

const SUB_STATUS_COLORS: Record<SubStatus, string> = {
  Active: "bg-green-500/15 text-green-700 border-green-200",
  Canceled: "bg-red-500/15 text-red-700 border-red-200",
  Expired: "bg-muted text-muted-foreground border-border",
};

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
  index,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: "gold" | "blue" | "green";
  index: number;
}) {
  const accentClasses = {
    gold: "text-primary bg-primary/10",
    blue: "text-secondary bg-secondary/10",
    green: "text-green-600 bg-green-500/10",
  };
  const cls = accentClasses[accent ?? "blue"];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
    >
      <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                {label}
              </p>
              <p className="font-display text-2xl font-bold text-foreground truncate">
                {value}
              </p>
              {sub && (
                <p className="text-xs text-muted-foreground mt-1">{sub}</p>
              )}
            </div>
            <div className={`p-2.5 rounded-xl ${cls} flex-shrink-0 ml-3`}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({
  title,
  action,
}: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-display text-lg font-semibold text-foreground">
        {title}
      </h2>
      {action}
    </div>
  );
}

// ─── CSV Export helper ────────────────────────────────────────────────────────
function exportCSV(headers: string[], rows: string[][], filename: string) {
  const csvContent = [headers, ...rows]
    .map((r) => r.map((c) => `"${c}"`).join(","))
    .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const { isAuthenticated } = useAuth();

  // For MVP: simulate admin check via isAuthenticated
  // In a real app this would check role from backend
  const isAdmin = isAuthenticated;

  // Leads pagination + filters
  const [leadsPage, setLeadsPage] = useState(1);
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const LEADS_PER_PAGE = 10;

  const filteredLeads = LEADS.filter((l) => {
    const matchSrc = sourceFilter === "all" || l.source === sourceFilter;
    const matchSts = statusFilter === "all" || l.status === statusFilter;
    return matchSrc && matchSts;
  }).sort((a, b) => b.date.localeCompare(a.date));

  const totalLeadPages = Math.ceil(filteredLeads.length / LEADS_PER_PAGE);
  const pagedLeads = filteredLeads.slice(
    (leadsPage - 1) * LEADS_PER_PAGE,
    leadsPage * LEADS_PER_PAGE,
  );

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  function handleExportLeadsCSV() {
    exportCSV(
      ["Date", "Business", "Source", "Type", "Status"],
      filteredLeads.map((l) => [
        l.date,
        l.business,
        l.source,
        l.type,
        l.status,
      ]),
      "leads.csv",
    );
  }

  function handleExportDemoCSV() {
    exportCSV(
      ["Date", "Business", "Owner", "Country", "Service", "WhatsApp", "Budget"],
      DEMO_REQUESTS.map((d) => [
        d.date,
        d.business,
        d.owner,
        d.country,
        d.service,
        d.whatsapp,
        d.budget,
      ]),
      "demo-requests.csv",
    );
  }

  if (!isAdmin) {
    return (
      <Layout hideFooter>
        <div
          data-ocid="admin.access_denied"
          className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-5">
            <Shield size={32} className="text-destructive" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h1>
          <p className="text-muted-foreground max-w-sm mb-6">
            You don't have permission to access the admin dashboard. Please
            login with an admin account.
          </p>
          <Link to="/">
            <Button
              variant="outline"
              className="gap-2"
              data-ocid="admin.home_button"
            >
              <Home size={16} /> Go to Home
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <div
        data-ocid="admin.page"
        className="max-w-7xl mx-auto px-4 py-6 space-y-8"
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Admin Dashboard
                </h1>
                <Badge className="bg-primary/15 text-primary border-primary/30 text-xs font-semibold px-2">
                  ADMIN
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{today}</p>
            </div>
          </div>
          <Button
            data-ocid="admin.export_csv_button"
            variant="outline"
            size="sm"
            className="gap-2 self-start sm:self-auto"
            onClick={handleExportLeadsCSV}
          >
            <Download size={15} /> Export CSV
          </Button>
        </motion.div>

        {/* ── Top Stats ──────────────────────────────────────────────────── */}
        <section data-ocid="admin.stats_section">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              index={0}
              accent="blue"
              label="Total Users"
              value="48"
              sub="+6 this month"
              icon={<Users size={20} />}
            />
            <StatCard
              index={1}
              accent="green"
              label="Active Subscriptions"
              value="31"
              sub="82% retention rate"
              icon={<CreditCard size={20} />}
            />
            <StatCard
              index={2}
              accent="blue"
              label="Leads This Month"
              value="267"
              sub="+18% vs last month"
              icon={<TrendingUp size={20} />}
            />
            <StatCard
              index={3}
              accent="gold"
              label="Monthly Revenue"
              value="21,469 AED"
              sub="MRR target: 25,000"
              icon={<DollarSign size={20} />}
            />
          </div>
        </section>

        <Separator />

        {/* ── Leads Table ────────────────────────────────────────────────── */}
        <section data-ocid="admin.leads_section">
          <SectionHeader
            title="All Leads"
            action={
              <div className="flex items-center gap-2 flex-wrap">
                <Select
                  value={sourceFilter}
                  onValueChange={(v) => {
                    setSourceFilter(v);
                    setLeadsPage(1);
                  }}
                >
                  <SelectTrigger
                    className="w-36 h-8 text-xs"
                    data-ocid="admin.source_filter"
                  >
                    <SelectValue placeholder="Filter source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Google">Google</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={statusFilter}
                  onValueChange={(v) => {
                    setStatusFilter(v);
                    setLeadsPage(1);
                  }}
                >
                  <SelectTrigger
                    className="w-36 h-8 text-xs"
                    data-ocid="admin.status_filter"
                  >
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="Converted">Converted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
          />
          <Card className="border-border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="sticky left-0 bg-muted/40 px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide min-w-[110px]">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide min-w-[180px]">
                      Business Name
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide min-w-[120px]">
                      Source
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide min-w-[110px]">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide min-w-[110px]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pagedLeads.map((lead, i) => (
                    <motion.tr
                      key={`${lead.business}-${i}`}
                      data-ocid={`admin.leads_table.item.${(leadsPage - 1) * LEADS_PER_PAGE + i + 1}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="sticky left-0 bg-card px-4 py-3 text-muted-foreground font-mono text-xs">
                        {lead.date}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {lead.business}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${SOURCE_COLORS[lead.source]}`}
                        >
                          {SOURCE_ICONS[lead.source]}
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${TYPE_COLORS[lead.type]}`}
                        >
                          {lead.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[lead.status]}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                  {pagedLeads.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center text-muted-foreground text-sm"
                        data-ocid="admin.leads_table.empty_state"
                      >
                        No leads match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Showing{" "}
                {Math.min(
                  (leadsPage - 1) * LEADS_PER_PAGE + 1,
                  filteredLeads.length,
                )}
                –{Math.min(leadsPage * LEADS_PER_PAGE, filteredLeads.length)} of{" "}
                {filteredLeads.length} leads
              </span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setLeadsPage((p) => Math.max(1, p - 1))}
                  disabled={leadsPage === 1}
                  data-ocid="admin.leads_table.pagination_prev"
                  className="h-7 w-7 p-0"
                >
                  <ChevronLeft size={14} />
                </Button>
                <span className="text-xs font-medium px-2">
                  {leadsPage} / {totalLeadPages}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setLeadsPage((p) => Math.min(totalLeadPages, p + 1))
                  }
                  disabled={
                    leadsPage === totalLeadPages || totalLeadPages === 0
                  }
                  data-ocid="admin.leads_table.pagination_next"
                  className="h-7 w-7 p-0"
                >
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* ── Demo Requests ───────────────────────────────────────────────── */}
        <section data-ocid="admin.demo_requests_section">
          <SectionHeader
            title="Demo Requests"
            action={
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 h-8 text-xs"
                onClick={handleExportDemoCSV}
                data-ocid="admin.demo_requests.export_csv_button"
              >
                <Download size={13} /> Export CSV
              </Button>
            }
          />
          <Card className="border-border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="sticky left-0 bg-muted/40 px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide min-w-[110px]">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide min-w-[170px]">
                      Business
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide min-w-[150px]">
                      Owner
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide min-w-[120px]">
                      Country
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide min-w-[200px]">
                      Service Needed
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide min-w-[140px]">
                      WhatsApp
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide min-w-[120px]">
                      Budget
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide min-w-[80px]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_REQUESTS.map((req, i) => (
                    <motion.tr
                      key={req.business}
                      data-ocid={`admin.demo_requests.item.${i + 1}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="sticky left-0 bg-card px-4 py-3 text-muted-foreground font-mono text-xs">
                        {req.date}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {req.business}
                      </td>
                      <td className="px-4 py-3 text-foreground">{req.owner}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {req.country}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {req.service}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {req.whatsapp}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-primary/10 text-primary border-primary/25">
                          {req.budget}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 gap-1.5 text-xs"
                          data-ocid={`admin.demo_requests.view_button.${i + 1}`}
                        >
                          <Eye size={12} /> View
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* ── Subscription Overview ───────────────────────────────────────── */}
        <section data-ocid="admin.subscriptions_section">
          <SectionHeader title="Subscription Overview" />

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            {(
              [
                {
                  label: "Active",
                  count: 31,
                  cls: "bg-green-500/10 text-green-700 border-green-200",
                },
                {
                  label: "Canceled",
                  count: 4,
                  cls: "bg-red-500/10 text-red-700 border-red-200",
                },
                {
                  label: "Expired",
                  count: 2,
                  cls: "bg-muted text-muted-foreground border-border",
                },
              ] as const
            ).map(({ label, count, cls }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                data-ocid={`admin.subscription_overview.${label.toLowerCase()}_card`}
              >
                <Card className="border-border text-center">
                  <CardContent className="pt-5 pb-5">
                    <div
                      className={`text-3xl font-display font-bold mb-1 ${cls.split(" ")[1]}`}
                    >
                      {count}
                    </div>
                    <div
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}
                    >
                      {label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recent Subscriptions Table */}
          <Card className="border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Recent Subscriptions
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="sticky left-0 bg-muted/40 px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide min-w-[160px]">
                      User
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide min-w-[100px]">
                      Plan
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide min-w-[110px]">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide min-w-[110px]">
                      Start Date
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground text-xs uppercase tracking-wide min-w-[110px]">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide min-w-[100px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SUBSCRIPTIONS.map((sub, i) => (
                    <motion.tr
                      key={sub.user}
                      data-ocid={`admin.subscriptions_table.item.${i + 1}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.025 }}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="sticky left-0 bg-card px-4 py-3 font-medium text-foreground">
                        {sub.user}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${PLAN_COLORS[sub.plan]}`}
                        >
                          {sub.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${SUB_STATUS_COLORS[sub.status]}`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                        {sub.startDate}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">
                        {sub.amount}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1.5 text-xs"
                            data-ocid={`admin.subscriptions_table.edit_button.${i + 1}`}
                          >
                            Edit
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* bottom padding */}
        <div className="h-6" />
      </div>
    </Layout>
  );
}
