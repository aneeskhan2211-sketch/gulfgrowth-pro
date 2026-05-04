import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "../../store/useStore";

const COMPONENT_CATEGORIES = {
  Doors: [
    { id: "door_single", name: "Single Door", size: "0.9\u00d72.1m" },
    { id: "door_double", name: "Double Door", size: "1.8\u00d72.1m" },
    { id: "door_sliding", name: "Sliding Door", size: "1.5\u00d72.1m" },
    { id: "door_fire", name: "Fire Door", size: "0.9\u00d72.1m" },
  ],
  Windows: [
    { id: "win_casement", name: "Casement Window", size: "1.2\u00d71.5m" },
    { id: "win_fixed", name: "Fixed Glazing", size: "2.4\u00d72.4m" },
    { id: "win_awning", name: "Awning Window", size: "1.0\u00d70.6m" },
  ],
  Furniture: [
    { id: "furn_desk", name: "Office Desk", size: "1.6\u00d70.8m" },
    { id: "furn_chair", name: "Office Chair", size: "0.6\u00d70.6m" },
    { id: "furn_conf", name: "Conference Table", size: "3.6\u00d71.2m" },
    { id: "furn_sofa", name: "Sofa", size: "2.0\u00d70.9m" },
  ],
  "Structural Families": [
    { id: "str_ucol", name: "UC Column 203\u00d7203", size: "0.2\u00d70.2m" },
    { id: "str_hea", name: "HEA 200 Beam", size: "0.2\u00d70.18m" },
    { id: "str_rhs", name: "RHS 100\u00d750", size: "0.1\u00d70.05m" },
  ],
  "MEP Equipment": [
    {
      id: "mep_ahu",
      name: "Air Handling Unit",
      size: "2.5\u00d71.2\u00d71.8m",
    },
    {
      id: "mep_pump",
      name: "Circulation Pump",
      size: "0.4\u00d70.3\u00d70.4m",
    },
    {
      id: "mep_panel",
      name: "Electrical Panel",
      size: "0.6\u00d70.2\u00d71.8m",
    },
  ],
  Fixtures: [
    { id: "fix_toilet", name: "Toilet", size: "0.7\u00d70.4m" },
    { id: "fix_basin", name: "Basin", size: "0.6\u00d70.45m" },
    { id: "fix_shower", name: "Shower", size: "0.9\u00d70.9m" },
  ],
};

export function ComponentLibrary() {
  const [search, setSearch] = useState("");
  const addElement = useStore((s) => s.addElement);
  const activeLevel = useStore((s) => s.activeLevel);

  const placeComponent = (comp: { id: string; name: string }) => {
    addElement({
      id: `${comp.id}_${Date.now()}`,
      type: comp.name,
      discipline: "Architecture",
      level: activeLevel,
      layer: "Architecture",
      position: [0, 0, 0],
      dimensions: { width: 1, height: 1, length: 1 },
      material: {
        color: "#8090A0",
        roughness: 0.5,
        metalness: 0.2,
        opacity: 1,
      },
      name: comp.name,
      selected: false,
    });
    toast.success(`Placed ${comp.name}`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b border-border">
        <div className="relative">
          <Search
            size={12}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            data-ocid="library.search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search components..."
            className="pl-7 h-7 text-xs"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {Object.entries(COMPONENT_CATEGORIES).map(([cat, items]) => {
          const filtered = items.filter(
            (i) =>
              !search || i.name.toLowerCase().includes(search.toLowerCase()),
          );
          if (!filtered.length) return null;
          return (
            <div key={cat}>
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-background sticky top-0">
                {cat}
              </div>
              {filtered.map((item, i) => (
                <button
                  type="button"
                  key={item.id}
                  data-ocid={`library.item.${i + 1}`}
                  onClick={() => placeComponent(item)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-secondary transition-colors flex items-center gap-3 border-b border-border/50"
                >
                  <div className="w-7 h-7 rounded bg-muted flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 rounded-sm bg-muted-foreground/30" />
                  </div>
                  <div>
                    <div className="text-foreground">{item.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {item.size}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
