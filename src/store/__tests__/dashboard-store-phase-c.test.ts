import { describe, it, expect, beforeEach } from "vitest";
import { initAdapter } from "@/gateway/adapter-provider";
import { useDashboardStore } from "../console-stores/dashboard-store";

describe("Dashboard Store - Phase C", () => {
  beforeEach(async () => {
    await initAdapter("mock");
    useDashboardStore.setState({
      channelsSummary: [],
      skillsSummary: [],
      usage: null,
      uptime: 0,
      isLoading: false,
      error: null,
    });
  });

  it("refresh() loads channels, skills, and usage in parallel", async () => {
    await useDashboardStore.getState().refresh();
    const s = useDashboardStore.getState();

    expect(s.isLoading).toBe(false);
    expect(s.channelsSummary.length).toBeGreaterThan(0);
    expect(s.skillsSummary.length).toBeGreaterThan(0);
    expect(s.usage).not.toBeNull();
    expect(s.usage!.providers.length).toBeGreaterThan(0);
    expect(s.error).toBeNull();
  });

  it("refresh() sets isLoading to true while loading", async () => {
    const promise = useDashboardStore.getState().refresh();
    expect(useDashboardStore.getState().isLoading).toBe(true);
    await promise;
    expect(useDashboardStore.getState().isLoading).toBe(false);
  });

  it("usage has providers with windows", async () => {
    await useDashboardStore.getState().refresh();
    const { usage } = useDashboardStore.getState();
    expect(usage).not.toBeNull();
    for (const p of usage!.providers) {
      expect(p.provider).toBeTruthy();
      expect(p.displayName).toBeTruthy();
      expect(p.windows.length).toBeGreaterThan(0);
    }
  });
});
