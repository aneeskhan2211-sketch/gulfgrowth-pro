import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Download, X } from "lucide-react";
import { useStore } from "../../store/useStore";

function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function SchedulesPanel() {
  const showSchedules = useStore((s) => s.showSchedules);
  const togglePanel = useStore((s) => s.togglePanel);
  const elements = useStore((s) => s.elements);

  if (!showSchedules) return null;

  const doors = elements.filter((e) => e.type === "Door");
  const windows = elements.filter((e) => e.type === "Window");

  // Rooms tab — group by level
  const levelMap = new Map<
    string,
    { count: number; floorArea: number; wallArea: number }
  >();
  for (const el of elements) {
    const existing = levelMap.get(el.level) ?? {
      count: 0,
      floorArea: 0,
      wallArea: 0,
    };
    existing.count += 1;
    if (el.type === "Floor" || el.type === "Slab") {
      existing.floorArea +=
        el.dimensions.area ?? el.dimensions.width * el.dimensions.length;
    }
    if (el.type === "Wall" || el.type === "Curtain Wall") {
      existing.wallArea +=
        el.dimensions.area ?? el.dimensions.width * el.dimensions.height;
    }
    levelMap.set(el.level, existing);
  }
  const roomRows = Array.from(levelMap.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  function exportDoorsCSV() {
    const header = "ID,Name,Level,Width (m),Height (m)\n";
    const rows = doors
      .map(
        (d) =>
          `${d.id.slice(0, 8)},${d.name},${d.level},${d.dimensions.width.toFixed(2)},${d.dimensions.height.toFixed(2)}`,
      )
      .join("\n");
    downloadCSV(header + rows, "doors-schedule.csv");
  }

  function exportWindowsCSV() {
    const header = "ID,Name,Level,Width (m),Height (m)\n";
    const rows = windows
      .map(
        (w) =>
          `${w.id.slice(0, 8)},${w.name},${w.level},${w.dimensions.width.toFixed(2)},${w.dimensions.height.toFixed(2)}`,
      )
      .join("\n");
    downloadCSV(header + rows, "windows-schedule.csv");
  }

  function exportRoomsCSV() {
    const header = "Level,Element Count,Floor Area (m²),Wall Area (m²)\n";
    const rows = roomRows
      .map(
        ([level, data]) =>
          `${level},${data.count},${data.floorArea.toFixed(2)},${data.wallArea.toFixed(2)}`,
      )
      .join("\n");
    downloadCSV(header + rows, "rooms-schedule.csv");
  }

  return (
    <div
      data-ocid="schedules.panel"
      className="fixed right-4 top-16 z-40 flex flex-col rounded-lg border border-border shadow-2xl"
      style={{
        width: 340,
        maxHeight: "calc(100vh - 80px)",
        background: "rgba(20,26,34,0.97)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <CalendarDays size={14} className="text-primary" />
          <span className="text-xs font-semibold text-foreground">
            Schedules
          </span>
        </div>
        <button
          type="button"
          data-ocid="schedules.close_button"
          onClick={() => togglePanel("schedules")}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="doors" className="flex flex-col flex-1 min-h-0">
        <TabsList className="mx-3 mt-2 h-7 text-xs grid grid-cols-3">
          <TabsTrigger
            data-ocid="schedules.doors.tab"
            value="doors"
            className="text-xs"
          >
            Doors ({doors.length})
          </TabsTrigger>
          <TabsTrigger
            data-ocid="schedules.windows.tab"
            value="windows"
            className="text-xs"
          >
            Windows ({windows.length})
          </TabsTrigger>
          <TabsTrigger
            data-ocid="schedules.rooms.tab"
            value="rooms"
            className="text-xs"
          >
            Rooms
          </TabsTrigger>
        </TabsList>

        {/* Doors Tab */}
        <TabsContent
          value="doors"
          className="flex flex-col flex-1 min-h-0 mt-0"
        >
          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="text-[10px] text-muted-foreground">
              {doors.length} door{doors.length !== 1 ? "s" : ""}
            </span>
            <button
              type="button"
              data-ocid="schedules.doors.export_button"
              onClick={exportDoorsCSV}
              className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors"
            >
              <Download size={10} /> Export CSV
            </button>
          </div>
          <ScrollArea className="flex-1">
            {doors.length === 0 ? (
              <div
                data-ocid="schedules.doors.empty_state"
                className="px-3 py-6 text-center text-xs text-muted-foreground"
              >
                No door elements in the model.
                <br />
                Place Door elements to see them here.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[10px] h-7 px-2">ID</TableHead>
                    <TableHead className="text-[10px] h-7 px-2">Name</TableHead>
                    <TableHead className="text-[10px] h-7 px-2">
                      Level
                    </TableHead>
                    <TableHead className="text-[10px] h-7 px-2">W(m)</TableHead>
                    <TableHead className="text-[10px] h-7 px-2">H(m)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doors.map((d, i) => (
                    <TableRow
                      key={d.id}
                      data-ocid={`schedules.doors.item.${i + 1}`}
                    >
                      <TableCell className="text-[10px] px-2 py-1 font-mono">
                        {d.id.slice(0, 8)}
                      </TableCell>
                      <TableCell className="text-[10px] px-2 py-1">
                        {d.name}
                      </TableCell>
                      <TableCell className="text-[10px] px-2 py-1">
                        {d.level}
                      </TableCell>
                      <TableCell className="text-[10px] px-2 py-1">
                        {d.dimensions.width.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-[10px] px-2 py-1">
                        {d.dimensions.height.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </TabsContent>

        {/* Windows Tab */}
        <TabsContent
          value="windows"
          className="flex flex-col flex-1 min-h-0 mt-0"
        >
          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="text-[10px] text-muted-foreground">
              {windows.length} window{windows.length !== 1 ? "s" : ""}
            </span>
            <button
              type="button"
              data-ocid="schedules.windows.export_button"
              onClick={exportWindowsCSV}
              className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors"
            >
              <Download size={10} /> Export CSV
            </button>
          </div>
          <ScrollArea className="flex-1">
            {windows.length === 0 ? (
              <div
                data-ocid="schedules.windows.empty_state"
                className="px-3 py-6 text-center text-xs text-muted-foreground"
              >
                No window elements in the model.
                <br />
                Place Window elements to see them here.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[10px] h-7 px-2">ID</TableHead>
                    <TableHead className="text-[10px] h-7 px-2">Name</TableHead>
                    <TableHead className="text-[10px] h-7 px-2">
                      Level
                    </TableHead>
                    <TableHead className="text-[10px] h-7 px-2">W(m)</TableHead>
                    <TableHead className="text-[10px] h-7 px-2">H(m)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {windows.map((w, i) => (
                    <TableRow
                      key={w.id}
                      data-ocid={`schedules.windows.item.${i + 1}`}
                    >
                      <TableCell className="text-[10px] px-2 py-1 font-mono">
                        {w.id.slice(0, 8)}
                      </TableCell>
                      <TableCell className="text-[10px] px-2 py-1">
                        {w.name}
                      </TableCell>
                      <TableCell className="text-[10px] px-2 py-1">
                        {w.level}
                      </TableCell>
                      <TableCell className="text-[10px] px-2 py-1">
                        {w.dimensions.width.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-[10px] px-2 py-1">
                        {w.dimensions.height.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </TabsContent>

        {/* Rooms Tab */}
        <TabsContent
          value="rooms"
          className="flex flex-col flex-1 min-h-0 mt-0"
        >
          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="text-[10px] text-muted-foreground">
              {roomRows.length} level{roomRows.length !== 1 ? "s" : ""}
            </span>
            <button
              type="button"
              data-ocid="schedules.rooms.export_button"
              onClick={exportRoomsCSV}
              className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors"
            >
              <Download size={10} /> Export CSV
            </button>
          </div>
          <ScrollArea className="flex-1">
            {roomRows.length === 0 ? (
              <div
                data-ocid="schedules.rooms.empty_state"
                className="px-3 py-6 text-center text-xs text-muted-foreground"
              >
                No elements in the model.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[10px] h-7 px-2">
                      Level
                    </TableHead>
                    <TableHead className="text-[10px] h-7 px-2">
                      Elements
                    </TableHead>
                    <TableHead className="text-[10px] h-7 px-2">
                      Floor m²
                    </TableHead>
                    <TableHead className="text-[10px] h-7 px-2">
                      Wall m²
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roomRows.map(([level, data], i) => (
                    <TableRow
                      key={level}
                      data-ocid={`schedules.rooms.item.${i + 1}`}
                    >
                      <TableCell className="text-[10px] px-2 py-1 font-semibold">
                        {level}
                      </TableCell>
                      <TableCell className="text-[10px] px-2 py-1">
                        {data.count}
                      </TableCell>
                      <TableCell className="text-[10px] px-2 py-1">
                        {data.floorArea.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-[10px] px-2 py-1">
                        {data.wallArea.toFixed(1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
