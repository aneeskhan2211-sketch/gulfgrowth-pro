import { History, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "../../store/useStore";

export function RevisionManager() {
  const showRevisionManager = useStore((s) => s.showRevisionManager);
  const togglePanel = useStore((s) => s.togglePanel);
  const revisions = useStore((s) => s.revisions);
  const saveRevision = useStore((s) => s.saveRevision);
  const restoreRevision = useStore((s) => s.restoreRevision);
  const deleteRevision = useStore((s) => s.deleteRevision);

  const [revName, setRevName] = useState("");

  if (!showRevisionManager) return null;

  const defaultName = `Revision ${revisions.length + 1}`;

  function handleSave() {
    const name = revName.trim() || defaultName;
    saveRevision(name);
    setRevName("");
    toast.success(`Snapshot "${name}" saved`);
  }

  function handleRestore(id: string, name: string) {
    restoreRevision(id);
    toast.success(`Restored "${name}"`);
  }

  function formatDate(ts: number) {
    return new Date(ts).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div
      data-ocid="revision_manager.modal"
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)" }}
    >
      <div
        className="flex flex-col rounded-xl overflow-hidden shadow-2xl"
        style={{
          width: 460,
          maxHeight: "80vh",
          background: "#1A1F26",
          border: "1px solid #3A424D",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid #3A424D" }}
        >
          <div className="flex items-center gap-2">
            <History size={14} style={{ color: "#2F7DFF" }} />
            <span className="text-sm font-semibold text-foreground">
              Revision Manager
            </span>
          </div>
          <button
            type="button"
            data-ocid="revision_manager.close_button"
            onClick={() => togglePanel("revisionManager")}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X size={13} />
          </button>
        </div>

        {/* Save section */}
        <div
          className="px-4 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid #3A424D" }}
        >
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Save Snapshot
          </div>
          <div className="flex gap-2">
            <input
              data-ocid="revision_manager.input"
              type="text"
              value={revName}
              onChange={(e) => setRevName(e.target.value)}
              placeholder={defaultName}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="flex-1 px-2 py-1.5 rounded text-xs bg-secondary border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
            />
            <button
              type="button"
              data-ocid="revision_manager.save_button"
              onClick={handleSave}
              className="px-3 py-1.5 rounded text-xs font-medium text-white transition-colors hover:opacity-90"
              style={{ background: "#2F7DFF" }}
            >
              Save Snapshot
            </button>
          </div>
        </div>

        {/* Revision list */}
        <div className="flex-1 overflow-y-auto">
          {revisions.length === 0 ? (
            <div
              data-ocid="revision_manager.empty_state"
              className="flex flex-col items-center justify-center py-10 text-muted-foreground"
            >
              <History size={28} className="mb-2 opacity-30" />
              <p className="text-xs">No revisions saved yet.</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {[...revisions].reverse().map((rev, i) => (
                <div
                  key={rev.id}
                  data-ocid={`revision_manager.item.${i + 1}`}
                  className="flex items-center gap-3 px-3 py-2 rounded"
                  style={{ background: "#1F242B" }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground truncate">
                      {rev.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {formatDate(rev.timestamp)} · {rev.elementCount} elements
                    </div>
                  </div>
                  <button
                    type="button"
                    data-ocid={`revision_manager.confirm_button.${i + 1}`}
                    onClick={() => handleRestore(rev.id, rev.name)}
                    className="px-2 py-1 rounded text-[10px] font-medium text-blue-400 hover:bg-blue-500/10 transition-colors"
                  >
                    Restore
                  </button>
                  <button
                    type="button"
                    data-ocid={`revision_manager.delete_button.${i + 1}`}
                    onClick={() => deleteRevision(rev.id)}
                    className="p-1 rounded text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete revision"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
