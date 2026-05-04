import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Palette, Plus, Trash2 } from "lucide-react";
import { type BuildingElement, useStore } from "../../store/useStore";

const IFC_TYPES = [
  "IfcWall",
  "IfcSlab",
  "IfcRoof",
  "IfcColumn",
  "IfcBeam",
  "IfcDoor",
  "IfcWindow",
  "IfcStair",
  "IfcRamp",
  "IfcSpace",
  "IfcCurtainWall",
  "IfcMember",
  "IfcFooting",
  "IfcDuctSegment",
  "IfcPipeSegment",
  "IfcFurnishingElement",
  "IfcBuildingElementProxy",
];

function ProjectStats() {
  const elements = useStore((s) => s.elements);
  const levels = useStore((s) => s.levels);

  const byType: Record<string, number> = {};
  for (const e of elements) {
    byType[e.type] = (byType[e.type] || 0) + 1;
  }

  const disciplines: Record<string, number> = {};
  for (const e of elements) {
    disciplines[e.discipline] = (disciplines[e.discipline] || 0) + 1;
  }

  return (
    <div className="p-3 space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Project Stats
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 rounded bg-secondary">
          <div className="text-lg font-bold text-foreground">
            {elements.length}
          </div>
          <div className="text-[10px] text-muted-foreground">
            Total Elements
          </div>
        </div>
        <div className="p-2 rounded bg-secondary">
          <div className="text-lg font-bold text-foreground">
            {levels.length}
          </div>
          <div className="text-[10px] text-muted-foreground">Levels</div>
        </div>
      </div>
      <div>
        <div className="text-[11px] font-medium text-muted-foreground mb-2">
          By Discipline
        </div>
        {Object.entries(disciplines).map(([d, c]) => (
          <div
            key={d}
            className="flex justify-between items-center py-1 border-b border-border"
          >
            <span className="text-xs text-foreground">{d}</span>
            <span className="text-xs font-medium text-blue-400">{c}</span>
          </div>
        ))}
      </div>
      <div>
        <div className="text-[11px] font-medium text-muted-foreground mb-2">
          By Type
        </div>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {Object.entries(byType)
            .slice(0, 12)
            .map(([t, c]) => (
              <div key={t} className="flex justify-between items-center">
                <span className="text-[11px] text-muted-foreground">{t}</span>
                <span className="text-[11px] font-medium text-foreground">
                  {c}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function BimTab({ element }: { element: BuildingElement }) {
  const updateElement = useStore((s) => s.updateElement);
  const props = element.properties ?? {};
  const propEntries = Object.entries(props);

  function updateProp(oldKey: string, newKey: string, value: string) {
    const next: Record<string, string> = {};
    for (const [k, v] of Object.entries(props)) {
      if (k === oldKey) {
        if (newKey.trim()) next[newKey] = value;
      } else {
        next[k] = v;
      }
    }
    updateElement(element.id, { properties: next });
  }

  function deleteProp(key: string) {
    const next = { ...props };
    delete next[key];
    updateElement(element.id, { properties: next });
  }

  function addProp() {
    const key = `property_${Date.now().toString(36).slice(-4)}`;
    updateElement(element.id, { properties: { ...props, [key]: "" } });
  }

  return (
    <div className="p-3 space-y-3">
      {/* IFC Type */}
      <div>
        <Label className="text-[10px] text-muted-foreground">IFC Type</Label>
        <select
          data-ocid="properties.ifc_type.select"
          value={element.ifcType ?? ""}
          onChange={(e) =>
            updateElement(element.id, { ifcType: e.target.value })
          }
          className="mt-1 w-full h-7 text-xs rounded border border-border bg-secondary text-foreground px-2 outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">— unset —</option>
          {IFC_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Classification */}
      <div>
        <Label className="text-[10px] text-muted-foreground">
          Classification
        </Label>
        <Input
          data-ocid="properties.classification.input"
          value={element.classification ?? ""}
          onChange={(e) =>
            updateElement(element.id, { classification: e.target.value })
          }
          placeholder="e.g. A-2010 Walls"
          className="h-7 text-xs mt-1"
        />
      </div>

      {/* Hosted wall */}
      {element.hostedWallId && (
        <div>
          <Label className="text-[10px] text-muted-foreground">
            Hosted In Wall
          </Label>
          <div className="text-xs text-foreground mt-1 px-2 py-1 bg-secondary rounded font-mono truncate">
            {element.hostedWallId}
          </div>
        </div>
      )}

      {/* Custom properties */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-[10px] text-muted-foreground">
            Custom Properties
          </Label>
          <button
            type="button"
            data-ocid="properties.add_property.button"
            onClick={addProp}
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] text-blue-400 hover:bg-blue-500/10 transition-colors"
          >
            <Plus size={10} /> Add
          </button>
        </div>

        {propEntries.length === 0 ? (
          <div className="text-[10px] text-muted-foreground italic px-1">
            No custom properties. Click Add to create one.
          </div>
        ) : (
          <div className="space-y-1.5">
            {propEntries.map(([key, val], idx) => (
              <div key={key} className="flex items-center gap-1">
                <input
                  data-ocid={`properties.prop_key.input.${idx + 1}`}
                  value={key}
                  onChange={(e) => updateProp(key, e.target.value, val)}
                  placeholder="Key"
                  className="flex-1 h-6 text-[10px] rounded border border-border bg-secondary text-foreground px-2 outline-none focus:border-blue-500 transition-colors min-w-0"
                />
                <input
                  data-ocid={`properties.prop_val.input.${idx + 1}`}
                  value={val}
                  onChange={(e) => updateProp(key, key, e.target.value)}
                  placeholder="Value"
                  className="flex-1 h-6 text-[10px] rounded border border-border bg-secondary text-foreground px-2 outline-none focus:border-blue-500 transition-colors min-w-0"
                />
                <button
                  type="button"
                  data-ocid={`properties.delete_prop.button.${idx + 1}`}
                  onClick={() => deleteProp(key)}
                  className="flex-shrink-0 p-1 rounded text-red-400 hover:bg-red-500/10 transition-colors"
                  aria-label="Delete property"
                >
                  <Trash2 size={9} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ElementProperties({ element }: { element: BuildingElement }) {
  const updateElement = useStore((s) => s.updateElement);
  const togglePanel = useStore((s) => s.togglePanel);

  const update = (updates: Partial<BuildingElement>) =>
    updateElement(element.id, updates);
  const updateMat = (updates: Partial<BuildingElement["material"]>) =>
    update({ material: { ...element.material, ...updates } });
  const updateDim = (updates: Partial<BuildingElement["dimensions"]>) =>
    update({ dimensions: { ...element.dimensions, ...updates } });

  return (
    <>
      {/* Material quick row */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: "1px solid oklch(var(--border))" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0"
            style={{ background: element.material.color }}
          />
          <span className="text-[10px] text-muted-foreground font-mono">
            {element.material.color}
          </span>
        </div>
        <button
          type="button"
          data-ocid="properties.material_library.button"
          onClick={() => togglePanel("materialLibrary")}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-blue-400 hover:bg-blue-500/10 transition-colors"
        >
          <Palette size={10} /> Change Material
        </button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full grid grid-cols-6 h-8">
          <TabsTrigger value="general" className="text-[10px]">
            General
          </TabsTrigger>
          <TabsTrigger value="dimensions" className="text-[10px]">
            Dims
          </TabsTrigger>
          <TabsTrigger value="material" className="text-[10px]">
            Mat
          </TabsTrigger>
          <TabsTrigger value="bim" className="text-[10px]">
            BIM
          </TabsTrigger>
          <TabsTrigger value="spec" className="text-[10px]">
            Spec
          </TabsTrigger>
          <TabsTrigger value="constraints" className="text-[10px]">
            Lock
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="p-3 space-y-2">
          <div>
            <Label className="text-[10px] text-muted-foreground">Name</Label>
            <Input
              data-ocid="properties.name.input"
              value={element.name}
              onChange={(e) => update({ name: e.target.value })}
              className="h-7 text-xs mt-1"
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">Type</Label>
            <div className="text-xs text-foreground mt-1 px-2 py-1 bg-secondary rounded">
              {element.type}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] text-muted-foreground">Level</Label>
              <div className="text-xs text-foreground mt-1 px-2 py-1 bg-secondary rounded">
                {element.level}
              </div>
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground">Layer</Label>
              <div className="text-xs text-foreground mt-1 px-2 py-1 bg-secondary rounded">
                {element.layer}
              </div>
            </div>
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">
              Discipline
            </Label>
            <div className="text-xs text-foreground mt-1 px-2 py-1 bg-secondary rounded">
              {element.discipline}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dimensions" className="p-3 space-y-2">
          {(["width", "height", "length"] as const).map((dim) => (
            <div key={dim}>
              <Label className="text-[10px] text-muted-foreground capitalize">
                {dim} (m)
              </Label>
              <Input
                data-ocid={`properties.${dim}.input`}
                type="number"
                value={element.dimensions[dim].toFixed(2)}
                onChange={(e) =>
                  updateDim({ [dim]: Number.parseFloat(e.target.value) || 0 })
                }
                className="h-7 text-xs mt-1"
              />
            </div>
          ))}
          {element.dimensions.area !== undefined && (
            <div>
              <Label className="text-[10px] text-muted-foreground">
                Area (m²)
              </Label>
              <div className="text-xs text-foreground mt-1 px-2 py-1 bg-secondary rounded">
                {element.dimensions.area.toFixed(2)}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="material" className="p-3 space-y-3">
          <div>
            <Label className="text-[10px] text-muted-foreground">Color</Label>
            <div className="flex items-center gap-2 mt-1">
              <input
                data-ocid="properties.material_color.input"
                type="color"
                value={element.material.color}
                onChange={(e) => updateMat({ color: e.target.value })}
                className="w-8 h-7 rounded cursor-pointer border border-border bg-transparent"
              />
              <span className="text-xs text-muted-foreground">
                {element.material.color}
              </span>
            </div>
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">
              Roughness: {element.material.roughness.toFixed(2)}
            </Label>
            <Slider
              data-ocid="properties.roughness.input"
              value={[element.material.roughness]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={([v]) => updateMat({ roughness: v })}
              className="mt-2"
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">
              Metalness: {element.material.metalness.toFixed(2)}
            </Label>
            <Slider
              data-ocid="properties.metalness.input"
              value={[element.material.metalness]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={([v]) => updateMat({ metalness: v })}
              className="mt-2"
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">
              Opacity: {element.material.opacity.toFixed(2)}
            </Label>
            <Slider
              data-ocid="properties.opacity.input"
              value={[element.material.opacity]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={([v]) => updateMat({ opacity: v })}
              className="mt-2"
            />
          </div>
          <button
            type="button"
            data-ocid="properties.open_material_library.button"
            onClick={() => togglePanel("materialLibrary")}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-medium text-blue-400 border border-blue-500/30 hover:bg-blue-500/10 transition-colors"
          >
            <Palette size={12} /> Open Material Library
          </button>
        </TabsContent>

        <TabsContent value="bim" className="overflow-y-auto">
          <BimTab element={element} />
        </TabsContent>

        <TabsContent value="spec" className="p-3 space-y-2">
          <div>
            <Label className="text-[10px] text-muted-foreground">
              Specification Notes
            </Label>
            <Textarea
              data-ocid="properties.spec.textarea"
              placeholder="Add specification notes..."
              className="mt-1 text-xs min-h-[80px]"
            />
          </div>
          <div className="text-[10px] text-muted-foreground mt-2">
            Custom fields coming soon
          </div>
        </TabsContent>

        <TabsContent value="constraints" className="p-3">
          <div className="text-xs text-muted-foreground">
            No parametric constraints defined.
          </div>
          <div className="text-[10px] text-muted-foreground mt-2">
            Constraints allow locking dimensions between elements.
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

export function PropertiesPanel() {
  const elements = useStore((s) => s.elements);
  const selectedIds = useStore((s) => s.selectedElementIds);

  const selectedElements = elements.filter((e) => selectedIds.has(e.id));
  const firstSelected = selectedElements[0];

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "oklch(var(--card))" }}
    >
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {firstSelected ? `Properties — ${firstSelected.type}` : "Project"}
        </span>
        {selectedElements.length > 1 && (
          <span className="text-[10px] text-blue-400">
            {selectedElements.length} selected
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {firstSelected ? (
          <ElementProperties element={firstSelected} />
        ) : (
          <ProjectStats />
        )}
      </div>
    </div>
  );
}
