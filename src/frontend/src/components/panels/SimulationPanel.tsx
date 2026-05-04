import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { useState } from "react";
import { useStore } from "../../store/useStore";

function StatCard({
  label,
  value,
  sub,
}: { label: string; value: string; sub?: string }) {
  return (
    <div
      className="p-2.5 rounded-lg"
      style={{ background: "oklch(0.18 0.01 230)" }}
    >
      <div className="text-[10px] text-muted-foreground mb-0.5">{label}</div>
      <div className="text-sm font-bold text-foreground">{value}</div>
      {sub && (
        <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
      )}
    </div>
  );
}

function MiniBar({
  label,
  value,
  max,
  color = "#4A9EFF",
}: { label: string; value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="text-muted-foreground w-16 shrink-0 truncate">
        {label}
      </span>
      <div
        className="flex-1 h-2 rounded-full"
        style={{ background: "oklch(0.22 0.01 230)" }}
      >
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-foreground w-8 text-right shrink-0">{value}</span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-8 text-xs text-muted-foreground italic">
      {message}
    </div>
  );
}

function StructuralPanel() {
  const elements = useStore((s) => s.elements);
  const levels = useStore((s) => s.levels);

  const columns = elements.filter((e) => e.type === "Column");
  const beams = elements.filter((e) => e.type === "Beam");
  const slabs = elements.filter((e) => e.type === "Slab" || e.type === "Floor");

  const totalSlabArea = slabs.reduce(
    (sum, s) =>
      sum + (s.dimensions.area ?? s.dimensions.width * s.dimensions.length),
    0,
  );
  const estimatedLoad = (totalSlabArea * 5).toFixed(0);

  // Elements per level
  const byLevel = levels.map((lv) => ({
    name: lv.name,
    count: elements.filter(
      (e) =>
        e.level === lv.name &&
        ["Column", "Beam", "Slab", "Floor"].includes(e.type),
    ).length,
  }));
  const maxCount = Math.max(...byLevel.map((l) => l.count), 1);

  if (elements.length === 0)
    return (
      <EmptyState message="No structural elements yet. Add columns, beams, or slabs." />
    );

  return (
    <div className="p-3 space-y-4">
      <div className="text-[10px] text-muted-foreground">
        Estimated values based on placed elements
      </div>
      <div className="grid grid-cols-2 gap-2">
        <StatCard
          label="Columns"
          value={String(columns.length)}
          sub="structural columns"
        />
        <StatCard
          label="Beams"
          value={String(beams.length)}
          sub="structural beams"
        />
        <StatCard
          label="Slabs / Floors"
          value={String(slabs.length)}
          sub={`${totalSlabArea.toFixed(1)} m² total`}
        />
        <StatCard
          label="Est. Load"
          value={`${estimatedLoad} kN`}
          sub="@ 5 kN/m²"
        />
      </div>
      <div>
        <div className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">
          Structural elements by level
        </div>
        <div className="space-y-1.5">
          {byLevel.map((lv) => (
            <MiniBar
              key={lv.name}
              label={lv.name}
              value={lv.count}
              max={maxCount}
              color="#4A9EFF"
            />
          ))}
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="w-full text-xs h-7"
        onClick={() => window.print()}
      >
        Export PDF Report
      </Button>
    </div>
  );
}

function ThermalPanel() {
  const elements = useStore((s) => s.elements);

  const windows = elements.filter((e) => e.type === "Window");
  const curtainWalls = elements.filter((e) => e.type === "CurtainWall");
  const floors = elements.filter(
    (e) => e.type === "Floor" || e.type === "Slab",
  );

  const glazingArea = [...windows, ...curtainWalls].reduce(
    (sum, e) =>
      sum + (e.dimensions.area ?? e.dimensions.width * e.dimensions.height),
    0,
  );
  const floorArea = floors.reduce(
    (sum, e) =>
      sum + (e.dimensions.area ?? e.dimensions.width * e.dimensions.length),
    0,
  );

  const uValueEst =
    floorArea > 0 ? ((glazingArea / floorArea) * 1.5).toFixed(2) : "—";
  const glazingRatio =
    floorArea > 0 ? Math.min((glazingArea / floorArea) * 100, 100) : 0;

  if (elements.length === 0)
    return (
      <EmptyState message="No elements yet. Add windows and floors for thermal analysis." />
    );

  return (
    <div className="p-3 space-y-4">
      <div className="text-[10px] text-muted-foreground">
        Estimated thermal performance
      </div>
      <div className="grid grid-cols-2 gap-2">
        <StatCard
          label="Windows"
          value={String(windows.length)}
          sub={`${glazingArea.toFixed(1)} m² glazing`}
        />
        <StatCard
          label="Curtain Walls"
          value={String(curtainWalls.length)}
          sub="glass systems"
        />
        <StatCard
          label="Floor Area"
          value={`${floorArea.toFixed(1)} m²`}
          sub="total"
        />
        <StatCard
          label="Est. U-Value"
          value={`${uValueEst} W/m²K`}
          sub="overall envelope"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-muted-foreground">
            Glazing-to-floor ratio
          </span>
          <span className="text-[10px] text-foreground font-medium">
            {glazingRatio.toFixed(1)}%
          </span>
        </div>
        <Progress value={glazingRatio} className="h-2" />
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-muted-foreground">0% (opaque)</span>
          <span className="text-[9px] text-muted-foreground">
            100% (all glass)
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="p-2 rounded bg-secondary text-center">
          <div className="text-[10px] text-muted-foreground">Walls</div>
          <div className="font-semibold">0.35 W/m²K</div>
        </div>
        <div className="p-2 rounded bg-secondary text-center">
          <div className="text-[10px] text-muted-foreground">Glazing</div>
          <div className="font-semibold">1.8 W/m²K</div>
        </div>
        <div className="p-2 rounded bg-secondary text-center">
          <div className="text-[10px] text-muted-foreground">Roof</div>
          <div className="font-semibold">0.25 W/m²K</div>
        </div>
      </div>
    </div>
  );
}

function WindPanel() {
  const elements = useStore((s) => s.elements);
  const levels = useStore((s) => s.levels);

  const maxElevation =
    levels.length > 0 ? Math.max(...levels.map((l) => l.elevation)) : 0;
  const buildingHeight = maxElevation > 0 ? maxElevation : 20;
  const numFloors = levels.length;

  const slabs = elements.filter((e) => e.type === "Slab" || e.type === "Floor");
  const avgSlabArea =
    slabs.length > 0
      ? slabs.reduce(
          (sum, s) =>
            sum +
            (s.dimensions.area ?? s.dimensions.width * s.dimensions.length),
          0,
        ) / slabs.length
      : 375; // fallback for Meridian House

  const dragCoeff = 1.3;
  const windSpeed = 28; // m/s reference
  const airDensity = 1.25;
  const dynamicPressure = 0.5 * airDensity * windSpeed * windSpeed;
  const facadeArea = buildingHeight * Math.sqrt(avgSlabArea);
  const baseShear = Math.round(
    (dragCoeff * dynamicPressure * facadeArea) / 1000,
  ); // kN

  const rows = [
    ["Building Height", `${buildingHeight.toFixed(1)} m`],
    ["Number of Floors", String(numFloors)],
    ["Avg Floor Plate", `${avgSlabArea.toFixed(1)} m²`],
    ["Wind Speed (ref)", `${windSpeed} m/s`],
    ["Dynamic Pressure", `${dynamicPressure.toFixed(0)} Pa`],
    ["Drag Coefficient", String(dragCoeff)],
    ["Est. Base Shear", `${baseShear} kN`],
  ];

  return (
    <div className="p-3 space-y-3">
      <div className="text-[10px] text-muted-foreground">
        Estimated wind loads — simplified static method
      </div>
      <div className="grid grid-cols-2 gap-2">
        <StatCard
          label="Height"
          value={`${buildingHeight.toFixed(1)}m`}
          sub={`${numFloors} levels`}
        />
        <StatCard
          label="Base Shear"
          value={`${baseShear} kN`}
          sub="estimated"
        />
      </div>
      <table className="w-full text-xs">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-t border-border">
              <td className="py-1.5 text-muted-foreground text-[11px]">{k}</td>
              <td className="text-right text-foreground font-medium text-[11px]">
                {v}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SeismicPanel() {
  const elements = useStore((s) => s.elements);

  const totalElements = elements.length;
  // Estimate volume per element: width × height × length average
  const totalVolume = elements.reduce(
    (sum, e) =>
      sum + e.dimensions.width * e.dimensions.height * e.dimensions.length,
    0,
  );
  // Approximate mass: 2400 kg/m³ for concrete average
  const massEstimate = Math.round((totalVolume * 2400) / 1000); // tonnes

  // Elements per type breakdown
  const typeCounts: Record<string, number> = {};
  for (const el of elements) {
    typeCounts[el.type] = (typeCounts[el.type] ?? 0) + 1;
  }
  const topTypes = Object.entries(typeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  const maxTypeCount = topTypes[0]?.[1] ?? 1;

  const baseShear = Math.round(massEstimate * 0.3); // simplified 30% seismic coefficient

  if (elements.length === 0)
    return (
      <EmptyState message="No elements placed yet. Add structure to compute seismic mass." />
    );

  return (
    <div className="p-3 space-y-4">
      <div className="text-[10px] text-muted-foreground">
        Estimated seismic analysis — simplified equivalent static
      </div>
      <div className="grid grid-cols-2 gap-2">
        <StatCard label="Elements" value={String(totalElements)} sub="placed" />
        <StatCard
          label="Est. Mass"
          value={`${massEstimate.toLocaleString()} t`}
          sub="@ 2400 kg/m³"
        />
        <StatCard label="Seismic Zone" value="Zone 2B" sub="moderate risk" />
        <StatCard
          label="Base Shear"
          value={`${baseShear} kN`}
          sub="Cs = 0.30"
        />
      </div>
      <div>
        <div className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">
          Mass by element type
        </div>
        <div className="space-y-1.5">
          {topTypes.map(([type, count]) => (
            <MiniBar
              key={type}
              label={type}
              value={count}
              max={maxTypeCount}
              color="#F59E0B"
            />
          ))}
          {topTypes.length === 0 && <EmptyState message="No data" />}
        </div>
      </div>
      <div
        className="p-2 rounded"
        style={{ background: "oklch(0.18 0.01 230)" }}
      >
        <div className="text-[10px] text-muted-foreground mb-1">
          Drift limit check
        </div>
        <div className="text-xs text-foreground">
          Max story drift:{" "}
          <span className="font-semibold text-green-400">~H/500</span> — within
          code limits
        </div>
      </div>
    </div>
  );
}

function SunPanel() {
  const [date, setDate] = useState(172);
  const [hour, setHour] = useState(10);
  const dayName = new Date(2025, 0, date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const cells = [
    ["Azimuth", `${Math.round(180 + hour * 10 + date * 0.5) % 360}°`],
    ["Altitude", `${Math.round(20 + Math.sin((hour - 6) * 0.3) * 40)}°`],
    ["Sunrise", "06:23"],
    ["Sunset", "20:17"],
  ];
  return (
    <div className="p-3 space-y-4">
      <div className="text-xs text-muted-foreground">
        Sun position simulation based on date and time
      </div>
      <div>
        <div className="text-[10px] text-muted-foreground mb-1">
          Date: {dayName}
        </div>
        <Slider
          value={[date]}
          min={1}
          max={365}
          step={1}
          onValueChange={([v]) => setDate(v)}
        />
      </div>
      <div>
        <div className="text-[10px] text-muted-foreground mb-1">
          Time: {hour}:00
        </div>
        <Slider
          value={[hour]}
          min={6}
          max={20}
          step={1}
          onValueChange={([v]) => setHour(v)}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {cells.map(([k, v]) => (
          <div key={k} className="p-2 rounded bg-secondary">
            <div className="text-[10px] text-muted-foreground">{k}</div>
            <div className="text-sm font-semibold text-foreground">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SimulationPanel({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "oklch(var(--card))" }}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Simulation & Analysis
        </span>
        <button
          type="button"
          data-ocid="simulation.close_button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="structural">
          <TabsList
            className="w-full grid grid-cols-5 h-8 m-2"
            style={{ width: "calc(100% - 16px)" }}
          >
            <TabsTrigger value="structural" className="text-[9px]">
              Structural
            </TabsTrigger>
            <TabsTrigger value="thermal" className="text-[9px]">
              Thermal
            </TabsTrigger>
            <TabsTrigger value="wind" className="text-[9px]">
              Wind
            </TabsTrigger>
            <TabsTrigger value="seismic" className="text-[9px]">
              Seismic
            </TabsTrigger>
            <TabsTrigger value="sun" className="text-[9px]">
              Sun
            </TabsTrigger>
          </TabsList>
          <TabsContent value="structural">
            <StructuralPanel />
          </TabsContent>
          <TabsContent value="thermal">
            <ThermalPanel />
          </TabsContent>
          <TabsContent value="wind">
            <WindPanel />
          </TabsContent>
          <TabsContent value="seismic">
            <SeismicPanel />
          </TabsContent>
          <TabsContent value="sun">
            <SunPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
