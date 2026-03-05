import { describe, it, expect } from "vitest";
import type { SubAgentInfo } from "@/gateway/types";
import { diffSessions } from "@/hooks/useSubAgentPoller";

function mkSub(key: string, agentId = `agent-${key}`): SubAgentInfo {
  return {
    sessionKey: key,
    agentId,
    label: `Sub-${key}`,
    task: "test task",
    requesterSessionKey: "parent-session",
    startedAt: Date.now(),
  };
}

describe("diffSessions", () => {
  it("detects newly added sessions", () => {
    const prev = [mkSub("s1")];
    const next = [mkSub("s1"), mkSub("s2")];
    const { added, removed } = diffSessions(prev, next);
    expect(added).toHaveLength(1);
    expect(added[0].sessionKey).toBe("s2");
    expect(removed).toHaveLength(0);
  });

  it("detects removed sessions", () => {
    const prev = [mkSub("s1"), mkSub("s2")];
    const next = [mkSub("s1")];
    const { added, removed } = diffSessions(prev, next);
    expect(added).toHaveLength(0);
    expect(removed).toHaveLength(1);
    expect(removed[0].sessionKey).toBe("s2");
  });

  it("handles no changes", () => {
    const prev = [mkSub("s1"), mkSub("s2")];
    const next = [mkSub("s1"), mkSub("s2")];
    const { added, removed } = diffSessions(prev, next);
    expect(added).toHaveLength(0);
    expect(removed).toHaveLength(0);
  });

  it("handles empty prev and next", () => {
    const { added, removed } = diffSessions([], []);
    expect(added).toHaveLength(0);
    expect(removed).toHaveLength(0);
  });

  it("handles full replacement", () => {
    const prev = [mkSub("s1"), mkSub("s2")];
    const next = [mkSub("s3"), mkSub("s4")];
    const { added, removed } = diffSessions(prev, next);
    expect(added).toHaveLength(2);
    expect(removed).toHaveLength(2);
  });
});
