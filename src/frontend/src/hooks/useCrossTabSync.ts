import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";

export function useCrossTabSync() {
  const [isLive, setIsLive] = useState(false);
  const setElements = useStore((s) => s.setElements);

  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("frameworks_sync");
      setIsLive(true);

      channel.onmessage = (event) => {
        if (event.data?.type === "elements_update") {
          setElements(event.data.elements);
        }
      };
    } catch {
      // BroadcastChannel not available
    }

    return () => {
      channel?.close();
    };
  }, [setElements]);

  return { isLive };
}
