import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "clawprowl-sidebar-layout";

export interface SectionState {
  collapsed: boolean;
  /** Height in pixels when expanded; null = auto (use minHeight) */
  height: number | null;
}

export type SidebarLayoutState = Record<string, SectionState>;

const DEFAULT_STATE: SidebarLayoutState = {
  metrics: { collapsed: true, height: null },
  agents: { collapsed: false, height: null },
  subAgents: { collapsed: false, height: null },
  detail: { collapsed: false, height: null },
  timeline: { collapsed: false, height: null },
};

function loadState(): SidebarLayoutState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SidebarLayoutState;
      return { ...DEFAULT_STATE, ...parsed };
    }
  } catch {
    // corrupt storage
  }
  return { ...DEFAULT_STATE };
}

function saveState(state: SidebarLayoutState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable
  }
}

export function useSidebarLayout() {
  const [layout, setLayout] = useState<SidebarLayoutState>(loadState);
  const layoutRef = useRef(layout);
  layoutRef.current = layout;

  useEffect(() => {
    saveState(layout);
  }, [layout]);

  const toggleSection = useCallback((id: string) => {
    setLayout((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        collapsed: !prev[id]?.collapsed,
      },
    }));
  }, []);

  const setSectionHeight = useCallback((id: string, height: number) => {
    setLayout((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        height,
      },
    }));
  }, []);

  const getSection = useCallback(
    (id: string): SectionState => {
      return layout[id] ?? { collapsed: false, height: null };
    },
    [layout],
  );

  return { layout, toggleSection, setSectionHeight, getSection };
}
