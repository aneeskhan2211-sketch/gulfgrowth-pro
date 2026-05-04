import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";
import { useState } from "react";
import { useStore } from "../../store/useStore";

const SAMPLE_SCRIPTS: Record<string, string> = {
  "Batch Rename": `// Batch rename all walls
const walls = api.elements.filter(e => e.type === 'Wall');
walls.forEach((wall, i) => {
  api.update(wall.id, { name: 'Wall-' + String(i+1).padStart(3,'0') });
});
console.log('Renamed', walls.length, 'walls');`,
  "Export JSON": `// Export all elements as JSON
const data = JSON.stringify(api.elements, null, 2);
const blob = new Blob([data], {type:'application/json'});
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = 'elements.json';
a.click();
console.log('Exported', api.elements.length, 'elements');`,
  "Highlight Long Walls": `// Select all walls over 5m
const longWalls = api.elements.filter(
  e => e.type === 'Wall' && e.dimensions.width > 5
);
api.select(longWalls.map(e => e.id));
console.log('Found', longWalls.length, 'walls over 5m');`,
};

export function PluginPanel({ onClose }: { onClose: () => void }) {
  const [code, setCode] = useState(SAMPLE_SCRIPTS["Batch Rename"]);
  const [output, setOutput] = useState("");
  const elements = useStore((s) => s.elements);
  const updateElement = useStore((s) => s.updateElement);
  const selectElements = useStore((s) => s.selectElements);

  const runScript = () => {
    const logs: string[] = [];
    const api = {
      elements,
      update: (id: string, updates: any) => updateElement(id, updates),
      select: (ids: string[]) => selectElements(ids),
    };
    const origLog = console.log;
    console.log = (...args) => logs.push(args.join(" "));
    try {
      // eslint-disable-next-line no-new-func
      new Function("api", code)(api);
      setOutput(logs.join("\n") || "Script executed successfully");
    } catch (err) {
      setOutput(`Error: ${err}`);
    } finally {
      console.log = origLog;
    }
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "oklch(var(--card))" }}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Plugin Editor
        </span>
        <button
          type="button"
          data-ocid="plugin.close_button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex gap-1 p-2 border-b border-border overflow-x-auto">
        {Object.keys(SAMPLE_SCRIPTS).map((name) => (
          <button
            type="button"
            key={name}
            onClick={() => setCode(SAMPLE_SCRIPTS[name])}
            className="text-[10px] px-2 py-1 rounded bg-secondary text-muted-foreground hover:text-foreground whitespace-nowrap"
          >
            {name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full p-3 text-xs font-mono bg-background text-foreground resize-none outline-none"
          spellCheck={false}
        />
      </div>

      <div className="border-t border-border">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-[10px] text-muted-foreground">
            Output Console
          </span>
          <Button
            data-ocid="plugin.run.button"
            size="sm"
            onClick={runScript}
            className="h-6 text-[10px] px-2"
          >
            <Play size={10} className="mr-1" /> Run
          </Button>
        </div>
        <pre className="px-3 pb-2 text-[10px] font-mono text-green-400 min-h-[40px] max-h-24 overflow-y-auto">
          {output || "// Output will appear here"}
        </pre>
      </div>
    </div>
  );
}
