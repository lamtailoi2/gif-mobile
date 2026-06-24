import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { offlineQueue } from "@/lib/offline-queue";
import { useNetwork } from "@/hooks/use-network";
import { saveWorkoutSession } from "@/features/workout-session/apis";

export function useSyncOfflineQueue() {
  const isOnline = useNetwork();
  const queryClient = useQueryClient();
  const syncingRef = useRef(false);

  useEffect(() => {
    if (!isOnline || syncingRef.current) return;
    syncingRef.current = true;

    (async () => {
      let mutation = await offlineQueue.dequeue();
      let hasSynced = false;

      while (mutation) {
        try {
          if (mutation.name === "saveWorkoutSession") {
            await saveWorkoutSession(mutation.payload as any);
            hasSynced = true;
          }
        } catch (e) {
          console.error("[sync] Failed to sync mutation:", mutation.name, e);
          break;
        }
        mutation = await offlineQueue.dequeue();
      }

      if (hasSynced) {
        queryClient.invalidateQueries();
      }
    })().finally(() => {
      syncingRef.current = false;
    });
  }, [isOnline, queryClient]);
}
