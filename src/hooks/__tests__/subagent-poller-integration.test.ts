import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SubAgentInfo } from "@/gateway/types";
import { diffSessions } from "@/hooks/useSubAgentPoller";
import { useOfficeStore } from "@/store/office-store";

beforeEach(() => {
  useOfficeStore.setState({
    agents: new Map(),
    links: [],
    globalMetrics: {
      activeAgents: 0,
      totalAgents: 0,
      totalTokens: 0,
      tokenRate: 0,
      collaborationHeat: 0,
    },
    connectionStatus: "disconnected",
    connectionError: null,
    selectedAgentId: null,
    viewMode: "2d",
    eventHistory: [],
    sidebarCollapsed: false,
    lastSessionsSnapshot: null,
    runIdMap: new Map(),
    sessionKeyMap: new Map(),
  });
});

function makeSub(agentId: string, sessionKey: string, requester?: string): SubAgentInfo {
  return {
    agentId,
    sessionKey,
    label: agentId,
    task: "",
    requesterSessionKey: requester ?? "parent-session",
    startedAt: Date.now(),
  };
}

describe("subagent-poller integration", () => {
  it("detects new sub-agents across two polling rounds", () => {
    const prev: SubAgentInfo[] = [];
    const next: SubAgentInfo[] = [makeSub("sub-1", "s2", "s1")];

    const diff = diffSessions(prev, next);
    expect(diff.added).toHaveLength(1);
    expect(diff.added[0].agentId).toBe("sub-1");
    expect(diff.removed).toHaveLength(0);
  });

  it("detects removed sub-agents", () => {
    const prev: SubAgentInfo[] = [makeSub("sub-1", "s2", "s1")];
    const next: SubAgentInfo[] = [];

    const diff = diffSessions(prev, next);
    expect(diff.added).toHaveLength(0);
    expect(diff.removed).toHaveLength(1);
    expect(diff.removed[0].agentId).toBe("sub-1");
  });

  it("triggers store addSubAgent when sub-agent appears", () => {
    useOfficeStore.getState().initAgents([{ id: "main", name: "Main" }]);
    const addSubAgentSpy = vi.spyOn(useOfficeStore.getState(), "addSubAgent");

    const sub = makeSub("sub-1", "s2", "s1");
    useOfficeStore.getState().addSubAgent("main", sub);

    expect(addSubAgentSpy).toHaveBeenCalledWith("main", sub);
    const subAgent = useOfficeStore.getState().agents.get("sub-1");
    expect(subAgent).toBeDefined();
    expect(subAgent?.isSubAgent).toBe(true);
    expect(subAgent?.parentAgentId).toBe("main");
  });

  it("full lifecycle: add then remove sub-agent", () => {
    useOfficeStore.getState().initAgents([{ id: "main", name: "Main" }]);

    const sub = makeSub("sub-1", "s2", "s1");
    useOfficeStore.getState().addSubAgent("main", sub);
    expect(useOfficeStore.getState().agents.has("sub-1")).toBe(true);

    useOfficeStore.getState().removeSubAgent("sub-1");
    expect(useOfficeStore.getState().agents.has("sub-1")).toBe(false);
    const parent = useOfficeStore.getState().agents.get("main");
    expect(parent?.childAgentIds).not.toContain("sub-1");
  });
});
