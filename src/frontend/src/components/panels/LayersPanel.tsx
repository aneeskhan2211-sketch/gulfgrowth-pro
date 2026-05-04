import { Eye, EyeOff, Lock, Unlock } from "lucide-react";
import { useStore } from "../../store/useStore";

export function LayersPanel() {
  const layers = useStore((s) => s.layers);
  const elements = useStore((s) => s.elements);
  const updateLayer = useStore((s) => s.updateLayer);

  const countByLayer = (name: string) =>
    elements.filter((e) => e.layer === name).length;

  return (
    <div className="p-3 space-y-1">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        Layers
      </h3>
      {layers.map((layer) => (
        <div
          key={layer.id}
          data-ocid={`layers.item.${layer.id}`}
          className="flex items-center gap-2 px-2 py-2 rounded hover:bg-secondary group"
        >
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ background: layer.color }}
          />
          <span className="flex-1 text-xs text-foreground truncate">
            {layer.name}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {countByLayer(layer.name)}
          </span>
          <button
            type="button"
            data-ocid="layers.visibility.toggle"
            onClick={() => updateLayer(layer.id, { visible: !layer.visible })}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
          >
            {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
          </button>
          <button
            type="button"
            data-ocid="layers.lock.toggle"
            onClick={() => updateLayer(layer.id, { locked: !layer.locked })}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
          >
            {layer.locked ? <Lock size={12} /> : <Unlock size={12} />}
          </button>
        </div>
      ))}
    </div>
  );
}
