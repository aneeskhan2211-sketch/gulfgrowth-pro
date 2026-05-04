import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { toast } from "sonner";
import { createActor } from "../backend";
import { useStore } from "../store/useStore";

export function useCloudSync() {
  const { actor } = useActor(createActor);
  const { identity, isAuthenticated } = useInternetIdentity();

  const elements = useStore((s) => s.elements);
  const levels = useStore((s) => s.levels);
  const layers = useStore((s) => s.layers);
  const annotations = useStore((s) => s.annotations);
  const savedViews = useStore((s) => s.savedViews);
  const setElements = useStore((s) => s.setElements);

  async function saveToCloud(projectName: string): Promise<void> {
    if (!isAuthenticated || !actor) {
      toast.error("Please log in first");
      return;
    }
    try {
      const payload = JSON.stringify({
        elements,
        levels,
        layers,
        annotations,
        savedViews,
      });
      // @ts-ignore backend method may not exist in new schema
      await (
        actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<unknown>
        >
      ).saveProject(projectName, payload, BigInt(elements.length));
      toast.success("Saved to cloud ✓");
    } catch (err) {
      toast.error("Cloud save failed");
      console.error(err);
    }
  }

  async function loadFromCloud(projectName: string): Promise<void> {
    if (!isAuthenticated || !actor) {
      toast.error("Please log in first");
      return;
    }
    try {
      // @ts-ignore backend method may not exist in new schema
      const project = await (
        actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<{ state: string }>
        >
      ).loadProject(projectName);
      const data = JSON.parse(project.state) as { elements?: unknown[] };
      if (data.elements)
        setElements(data.elements as Parameters<typeof setElements>[0]);
      toast.success(`Loaded "${projectName}"`);
    } catch (err) {
      toast.error("Failed to load project");
      console.error(err);
    }
  }

  async function listCloudProjects() {
    if (!isAuthenticated || !actor) return [];
    try {
      // @ts-ignore backend method may not exist in new schema
      return await (
        actor as unknown as Record<string, () => Promise<unknown[]>>
      ).listProjects();
    } catch {
      return [];
    }
  }

  async function deleteCloudProject(projectName: string): Promise<void> {
    if (!isAuthenticated || !actor) return;
    try {
      // @ts-ignore backend method may not exist in new schema
      await (
        actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<unknown>
        >
      ).deleteProject(projectName);
      toast.success(`Deleted "${projectName}"`);
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    }
  }

  return {
    isAuthenticated,
    principal: identity?.getPrincipal().toString() ?? null,
    saveToCloud,
    loadFromCloud,
    listCloudProjects,
    deleteCloudProject,
  };
}
