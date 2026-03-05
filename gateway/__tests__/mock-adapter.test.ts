import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { MockAdapter } from "../mock-adapter";

describe("MockAdapter", () => {
  let adapter: MockAdapter;

  beforeEach(() => {
    adapter = new MockAdapter();
  });

  afterEach(() => {
    adapter.disconnect();
  });

  it("connect resolves without error", async () => {
    await expect(adapter.connect()).resolves.toBeUndefined();
  });

  it("channelsStatus returns non-empty array with valid shape", async () => {
    const channels = await adapter.channelsStatus();
    expect(channels.length).toBeGreaterThan(0);
    for (const ch of channels) {
      expect(ch).toHaveProperty("id");
      expect(ch).toHaveProperty("type");
      expect(ch).toHaveProperty("name");
      expect(ch).toHaveProperty("status");
      expect(["connected", "disconnected", "connecting", "error"]).toContain(ch.status);
    }
  });

  it("skillsStatus returns non-empty array with valid shape", async () => {
    const skills = await adapter.skillsStatus();
    expect(skills.length).toBeGreaterThan(0);
    for (const sk of skills) {
      expect(sk).toHaveProperty("id");
      expect(sk).toHaveProperty("name");
      expect(sk).toHaveProperty("enabled");
      expect(typeof sk.enabled).toBe("boolean");
    }
  });

  it("cronList returns array with valid shape", async () => {
    const tasks = await adapter.cronList();
    expect(Array.isArray(tasks)).toBe(true);
    for (const t of tasks) {
      expect(t).toHaveProperty("id");
      expect(t).toHaveProperty("name");
      expect(t).toHaveProperty("schedule");
      expect(t).toHaveProperty("enabled");
    }
  });

  it("cronAdd returns task with generated id", async () => {
    const task = await adapter.cronAdd({
      name: "Test",
      schedule: { kind: "cron", expr: "0 * * * *" },
      sessionTarget: "isolated",
      wakeMode: "now",
      payload: { kind: "agentTurn", message: "hello" },
    });
    expect(task.id).toBeDefined();
    expect(task.name).toBe("Test");
  });

  it("agentsList returns valid response", async () => {
    const result = await adapter.agentsList();
    expect(result).toHaveProperty("defaultId");
    expect(result).toHaveProperty("agents");
    expect(result.agents.length).toBeGreaterThan(0);
  });

  it("usageStatus returns valid usage info", async () => {
    const usage = await adapter.usageStatus();
    expect(usage).toHaveProperty("updatedAt");
    expect(usage).toHaveProperty("providers");
    expect(Array.isArray(usage.providers)).toBe(true);
    expect(usage.providers.length).toBeGreaterThan(0);
  });

  it("onEvent returns unsubscribe function", async () => {
    await adapter.connect();
    const unsub = adapter.onEvent(() => {});
    expect(typeof unsub).toBe("function");
    unsub();
  });

  it("chatHistory returns array of messages", async () => {
    const messages = await adapter.chatHistory();
    expect(Array.isArray(messages)).toBe(true);
    expect(messages.length).toBeGreaterThan(0);
    expect(messages[0]).toHaveProperty("role");
    expect(messages[0]).toHaveProperty("content");
  });
});
