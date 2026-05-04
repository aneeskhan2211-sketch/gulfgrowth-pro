import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Sheet {
  id: string;
  number: string;
  name: string;
  scale: string;
  status: string;
}

const defaultSheets: Sheet[] = [
  {
    id: "s1",
    number: "A-101",
    name: "Floor Plans",
    scale: "1:100",
    status: "In Progress",
  },
  {
    id: "s2",
    number: "A-201",
    name: "Sections",
    scale: "1:100",
    status: "For Review",
  },
  {
    id: "s3",
    number: "A-301",
    name: "Elevations",
    scale: "1:100",
    status: "Approved",
  },
  {
    id: "s4",
    number: "A-401",
    name: "Details",
    scale: "1:20",
    status: "Draft",
  },
];

export function DocumentationPanel({ onClose }: { onClose: () => void }) {
  const [sheets, setSheets] = useState<Sheet[]>(defaultSheets);
  const [selectedSheets, setSelectedSheets] = useState<Set<string>>(new Set());
  const [paperSize, setPaperSize] = useState("A1");
  const [orientation, setOrientation] = useState("landscape");

  const addSheet = () => {
    const id = `s${Date.now()}`;
    setSheets((prev) => [
      ...prev,
      {
        id,
        number: `A-${prev.length + 101}`,
        name: "New Sheet",
        scale: "1:100",
        status: "Draft",
      },
    ]);
  };

  const deleteSheet = (id: string) =>
    setSheets((prev) => prev.filter((s) => s.id !== id));

  const updateSheet = (id: string, field: keyof Sheet, value: string) =>
    setSheets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );

  const toggleSheet = (id: string) =>
    setSelectedSheets((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const exportPDF = () => {
    toast.success("Exporting PDF...");
    window.print();
  };

  const exportSVG = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#fff"/><text x="400" y="300" text-anchor="middle" font-size="24">Meridian House</text></svg>`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    a.download = "meridian_house.svg";
    a.click();
    toast.success("SVG exported");
  };

  const exportDXF = () => {
    const dxf =
      "0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nENDSEC\n0\nEOF";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([dxf], { type: "text/plain" }));
    a.download = "meridian_house.dxf";
    a.click();
    toast.success("DXF exported");
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "oklch(var(--card))" }}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Documentation
        </span>
        <button
          type="button"
          data-ocid="documentation.close_button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="sheets">
          <TabsList
            className="w-full grid grid-cols-3 h-8 m-2"
            style={{ width: "calc(100% - 16px)" }}
          >
            <TabsTrigger value="sheets" className="text-[10px]">
              Sheets
            </TabsTrigger>
            <TabsTrigger value="print" className="text-[10px]">
              Print
            </TabsTrigger>
            <TabsTrigger value="export" className="text-[10px]">
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sheets" className="p-2">
            <div className="space-y-1 mb-2">
              {sheets.map((sheet, i) => (
                <div
                  key={sheet.id}
                  data-ocid={`sheets.item.${i + 1}`}
                  className="flex items-center gap-1 p-1.5 rounded hover:bg-secondary group"
                >
                  <input
                    type="checkbox"
                    data-ocid="sheets.checkbox"
                    checked={selectedSheets.has(sheet.id)}
                    onChange={() => toggleSheet(sheet.id)}
                    className="w-3 h-3"
                  />
                  <Input
                    value={sheet.number}
                    onChange={(e) =>
                      updateSheet(sheet.id, "number", e.target.value)
                    }
                    className="h-6 text-[10px] w-16 px-1"
                  />
                  <Input
                    value={sheet.name}
                    onChange={(e) =>
                      updateSheet(sheet.id, "name", e.target.value)
                    }
                    className="h-6 text-[10px] flex-1 px-1"
                  />
                  <span className="text-[10px] text-muted-foreground w-12">
                    {sheet.scale}
                  </span>
                  <button
                    type="button"
                    data-ocid={`sheets.delete_button.${i + 1}`}
                    onClick={() => deleteSheet(sheet.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>
            <Button
              data-ocid="sheets.add_button"
              size="sm"
              variant="outline"
              onClick={addSheet}
              className="w-full h-7 text-xs"
            >
              <Plus size={12} className="mr-1" /> Add Sheet
            </Button>
          </TabsContent>

          <TabsContent value="print" className="p-3 space-y-3">
            <div>
              <div className="text-[10px] text-muted-foreground mb-1">
                Paper Size
              </div>
              <Select value={paperSize} onValueChange={setPaperSize}>
                <SelectTrigger
                  className="h-7 text-xs"
                  data-ocid="print.paper_size.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["A0", "A1", "A2", "A3", "A4", "Letter", "Tabloid"].map(
                    (s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {s}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground mb-1">
                Orientation
              </div>
              <Select value={orientation} onValueChange={setOrientation}>
                <SelectTrigger
                  className="h-7 text-xs"
                  data-ocid="print.orientation.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="landscape" className="text-xs">
                    Landscape
                  </SelectItem>
                  <SelectItem value="portrait" className="text-xs">
                    Portrait
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              data-ocid="print.export_button"
              size="sm"
              onClick={exportPDF}
              className="w-full h-7 text-xs"
            >
              Export PDF
            </Button>
          </TabsContent>

          <TabsContent value="export" className="p-3 space-y-2">
            <Button
              data-ocid="export.svg_button"
              size="sm"
              variant="outline"
              onClick={exportSVG}
              className="w-full h-7 text-xs"
            >
              Export SVG
            </Button>
            <Button
              data-ocid="export.dxf_button"
              size="sm"
              variant="outline"
              onClick={exportDXF}
              className="w-full h-7 text-xs"
            >
              Export DXF
            </Button>
            <Button
              data-ocid="export.pdf_button"
              size="sm"
              variant="outline"
              onClick={exportPDF}
              className="w-full h-7 text-xs"
            >
              Export PDF
            </Button>
            <div className="pt-2 border-t border-border">
              <div className="text-[10px] text-muted-foreground mb-2">
                Import
              </div>
              <label className="block">
                <span className="text-[11px] text-muted-foreground">
                  Import OBJ/IFC file
                </span>
                <input
                  data-ocid="export.upload_button"
                  type="file"
                  accept=".obj,.ifc"
                  className="block mt-1 text-xs text-muted-foreground"
                  onChange={(e) => {
                    if (e.target.files?.[0])
                      toast.success(`Imported: ${e.target.files[0].name}`);
                  }}
                />
              </label>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
