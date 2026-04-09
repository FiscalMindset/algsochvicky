import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from "react";
import { runAnywhereRuntimeManager } from "./runtime-manager";
import type { RuntimeBridge, RuntimeSnapshot } from "./types";

type RuntimeContextValue = {
  snapshot: RuntimeSnapshot;
  bridge: RuntimeBridge;
  activate: () => Promise<void>;
  release: () => Promise<void>;
  clearCache: () => Promise<void>;
};

const RuntimeContext = createContext<RuntimeContextValue | null>(null);

export function RuntimeProvider({ children }: PropsWithChildren) {
  const [snapshot, setSnapshot] = useState(runAnywhereRuntimeManager.getSnapshot());

  useEffect(() => {
    const unsubscribe = runAnywhereRuntimeManager.subscribe(setSnapshot);
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const start = () => {
      void runAnywhereRuntimeManager.initialize().catch(() => undefined);
    };

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(start, { timeout: 1600 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(start, 1200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const value = useMemo<RuntimeContextValue>(
    () => ({
      snapshot,
      bridge: runAnywhereRuntimeManager,
      activate: () => runAnywhereRuntimeManager.activate(),
      release: () => runAnywhereRuntimeManager.release(),
      clearCache: () => runAnywhereRuntimeManager.clearCache()
    }),
    [snapshot]
  );

  return <RuntimeContext.Provider value={value}>{children}</RuntimeContext.Provider>;
}

export function useRunAnywhereRuntime() {
  const context = useContext(RuntimeContext);

  if (!context) {
    throw new Error("useRunAnywhereRuntime must be used within RuntimeProvider");
  }

  return context;
}
