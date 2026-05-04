import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useStore } from "../../store/useStore";

const UNIT_COSTS: Record<string, number> = {
  Wall: 120,
  "Curtain Wall": 350,
  Floor: 180,
  Roof: 200,
  Door: 800,
  Window: 600,
  Stair: 2500,
  Column: 450,
  Beam: 280,
  Slab: 160,
  Duct: 95,
  Pipe: 75,
  "Cable Tray": 60,
  default: 500,
};

const CURRENCIES: Record<string, { symbol: string; rate: number }> = {
  USD: { symbol: "$", rate: 1 },
  GBP: { symbol: "\u00a3", rate: 0.79 },
  EUR: { symbol: "\u20ac", rate: 0.92 },
  CAD: { symbol: "CA$", rate: 1.36 },
};

const COLORS = ["#2F7DFF", "#FF6B35", "#4CAF50", "#9C27B0", "#FF9800"];

export function CostEstimator({ onClose }: { onClose: () => void }) {
  const elements = useStore((s) => s.elements);
  const [currency, setCurrency] = useState("USD");
  const curr = CURRENCIES[currency];

  const byDiscipline: Record<string, { count: number; cost: number }> = {};
  for (const el of elements) {
    const unitCost = UNIT_COSTS[el.type] ?? UNIT_COSTS.default;
    const area =
      el.dimensions.area ?? el.dimensions.width * el.dimensions.length;
    const cost = unitCost * Math.max(area, 1);
    if (!byDiscipline[el.discipline])
      byDiscipline[el.discipline] = { count: 0, cost: 0 };
    byDiscipline[el.discipline].count++;
    byDiscipline[el.discipline].cost += cost;
  }

  const total = Object.values(byDiscipline).reduce((s, d) => s + d.cost, 0);
  const chartData = Object.entries(byDiscipline).map(([name, d]) => ({
    name: name.slice(0, 6),
    cost: Math.round(d.cost * curr.rate),
  }));

  const byType: Record<string, { count: number; cost: number }> = {};
  for (const el of elements) {
    const unitCost = UNIT_COSTS[el.type] ?? UNIT_COSTS.default;
    const area =
      el.dimensions.area ?? el.dimensions.width * el.dimensions.length;
    const cost = unitCost * Math.max(area, 1);
    if (!byType[el.type]) byType[el.type] = { count: 0, cost: 0 };
    byType[el.type].count++;
    byType[el.type].cost += cost;
  }

  const exportCSV = () => {
    const rows = [
      ["Type", "Count", "Unit Cost", "Total Cost"],
      ...Object.entries(byType).map(([t, d]) => [
        t,
        d.count,
        UNIT_COSTS[t] ?? UNIT_COSTS.default,
        Math.round(d.cost * curr.rate),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "meridian_house_bq.csv";
    a.click();
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "oklch(var(--card))" }}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Cost Estimator
        </span>
        <div className="flex items-center gap-2">
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger
              className="h-6 text-[10px] w-16"
              data-ocid="cost.currency.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(CURRENCIES).map((c) => (
                <SelectItem key={c} value={c} className="text-xs">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="button"
            data-ocid="cost.close_button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="p-3 rounded bg-secondary flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Total Estimated Cost
          </span>
          <span className="text-xl font-bold text-foreground">
            {curr.symbol}
            {Math.round(total * curr.rate).toLocaleString()}
          </span>
        </div>

        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: "#A8B1BC" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "#2A313A",
                  border: "none",
                  fontSize: 11,
                  color: "#F2F5F7",
                }}
                formatter={(v: number) => [
                  `${curr.symbol}${v.toLocaleString()}`,
                  "Cost",
                ]}
              />
              <Bar dataKey="cost" radius={[2, 2, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
            By Discipline
          </div>
          {Object.entries(byDiscipline).map(([d, data]) => (
            <div
              key={d}
              className="flex justify-between items-center py-1.5 border-b border-border"
            >
              <span className="text-xs text-foreground">{d}</span>
              <div className="text-right">
                <div className="text-xs font-medium text-foreground">
                  {curr.symbol}
                  {Math.round(data.cost * curr.rate).toLocaleString()}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {data.count} elements
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
            Bill of Quantities
          </div>
          <div className="space-y-0.5 max-h-48 overflow-y-auto">
            {Object.entries(byType).map(([type, data], i) => (
              <div
                key={type}
                data-ocid={`cost.item.${i + 1}`}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-secondary text-[11px]"
              >
                <span className="flex-1 text-foreground">{type}</span>
                <span className="text-muted-foreground w-8 text-right">
                  {data.count}x
                </span>
                <span className="text-foreground font-medium w-20 text-right">
                  {curr.symbol}
                  {Math.round(data.cost * curr.rate).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Button
          data-ocid="cost.export_button"
          size="sm"
          variant="outline"
          onClick={exportCSV}
          className="w-full h-7 text-xs"
        >
          Export CSV
        </Button>
      </div>
    </div>
  );
}
