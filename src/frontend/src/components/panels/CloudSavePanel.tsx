import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Cloud, LogIn, LogOut, RefreshCw, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCloudSync } from "../../hooks/useCloudSync";

interface ProjectMetadata {
  name: string;
  elementCount: bigint;
}

interface CloudSavePanelProps {
  onClose: () => void;
}

export function CloudSavePanel({ onClose }: CloudSavePanelProps) {
  const { login, clear, isLoggingIn } = useInternetIdentity();
  const {
    isAuthenticated,
    principal,
    saveToCloud,
    loadFromCloud,
    listCloudProjects,
    deleteCloudProject,
  } = useCloudSync();
  const [projectName, setProjectName] = useState("Meridian House");
  const [projects, setProjects] = useState<ProjectMetadata[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  async function refreshProjects() {
    setLoadingProjects(true);
    const list = (await listCloudProjects()) as ProjectMetadata[];
    setProjects(list);
    setLoadingProjects(false);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: refreshProjects is stable async fn
  useEffect(() => {
    if (isAuthenticated) {
      refreshProjects();
    }
  }, [isAuthenticated]);

  function shortPrincipal(p: string | null): string {
    if (!p) return "";
    return `${p.slice(0, 8)}\u2026${p.slice(-4)}`;
  }

  return (
    <div
      ref={panelRef}
      data-ocid="cloud_save.panel"
      className="absolute right-0 top-full mt-1 z-50 rounded-lg overflow-hidden shadow-2xl"
      style={{
        background: "#1A1F26",
        border: "1px solid #3A424D",
        minWidth: 260,
        maxWidth: 300,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2.5"
        style={{ borderBottom: "1px solid #3A424D" }}
      >
        <div className="flex items-center gap-2">
          <Cloud size={13} style={{ color: "#2F7DFF" }} />
          <span className="text-xs font-semibold text-foreground">
            Cloud Save
          </span>
        </div>
        {isAuthenticated && (
          <button
            type="button"
            data-ocid="cloud_save.logout_button"
            onClick={() => clear()}
            className="p-1 rounded text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Log out"
          >
            <LogOut size={11} />
          </button>
        )}
      </div>

      <div className="p-3 space-y-3">
        {!isAuthenticated ? (
          <div className="space-y-2">
            <p className="text-[10px] text-muted-foreground">
              Log in with Internet Identity to save projects to the cloud.
            </p>
            <Button
              data-ocid="cloud_save.login_button"
              size="sm"
              className="w-full h-7 text-[11px]"
              onClick={() => login()}
              disabled={isLoggingIn}
              style={{ background: "#2F7DFF" }}
            >
              {isLoggingIn ? (
                <RefreshCw size={11} className="mr-1.5 animate-spin" />
              ) : (
                <LogIn size={11} className="mr-1.5" />
              )}
              {isLoggingIn ? "Connecting\u2026" : "Log In"}
            </Button>
          </div>
        ) : (
          <>
            <div
              className="px-2 py-1.5 rounded text-[10px]"
              style={{
                background: "rgba(47,125,255,0.08)",
                border: "1px solid rgba(47,125,255,0.2)",
              }}
            >
              <span className="text-muted-foreground">Principal: </span>
              <span className="text-blue-300 font-mono">
                {shortPrincipal(principal)}
              </span>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="cloud-project-name"
                className="text-[10px] text-muted-foreground uppercase tracking-wider"
              >
                Project Name
              </label>
              <Input
                id="cloud-project-name"
                data-ocid="cloud_save.project_name.input"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="My Project"
                className="h-7 text-[11px]"
                style={{ background: "#242930", border: "1px solid #3A424D" }}
              />
              <Button
                data-ocid="cloud_save.save_button"
                size="sm"
                className="w-full h-7 text-[11px]"
                onClick={() => saveToCloud(projectName)}
                disabled={!projectName.trim()}
                style={{ background: "#2F7DFF" }}
              >
                <Upload size={11} className="mr-1.5" />
                Save to Cloud
              </Button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Saved Projects
                </span>
                <button
                  type="button"
                  data-ocid="cloud_save.refresh_button"
                  onClick={refreshProjects}
                  className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors"
                  title="Refresh"
                >
                  <RefreshCw
                    size={10}
                    className={loadingProjects ? "animate-spin" : ""}
                  />
                </button>
              </div>

              {projects.length === 0 ? (
                <p
                  data-ocid="cloud_save.projects.empty_state"
                  className="text-[10px] text-muted-foreground py-1"
                >
                  {loadingProjects ? "Loading\u2026" : "No saved projects yet"}
                </p>
              ) : (
                <div className="space-y-1">
                  {projects.map((proj, i) => (
                    <div
                      key={proj.name}
                      data-ocid={`cloud_save.project.item.${i + 1}`}
                      className="flex items-center gap-1 px-2 py-1 rounded"
                      style={{
                        background: "#1F242B",
                        border: "1px solid #2A3038",
                      }}
                    >
                      <button
                        type="button"
                        data-ocid={`cloud_save.project.load_button.${i + 1}`}
                        onClick={() => {
                          loadFromCloud(proj.name);
                          onClose();
                        }}
                        className="flex-1 text-left text-[10px] text-foreground hover:text-blue-300 transition-colors truncate"
                        title={`Load "${proj.name}"`}
                      >
                        {proj.name}
                        <span className="ml-1.5 text-[9px] text-muted-foreground">
                          {Number(proj.elementCount)} elements
                        </span>
                      </button>
                      <button
                        type="button"
                        data-ocid={`cloud_save.project.delete_button.${i + 1}`}
                        onClick={() => {
                          deleteCloudProject(proj.name);
                          setProjects((p) =>
                            p.filter((x) => x.name !== proj.name),
                          );
                        }}
                        className="p-0.5 rounded text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title={`Delete "${proj.name}"`}
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
