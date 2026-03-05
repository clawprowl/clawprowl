import { describe, it, expect } from "vitest";
import { parseAgentEvent } from "@/gateway/event-parser";
import type { AgentEventPayload } from "@/gateway/types";
import i18n from "@/i18n";

function makeEvent(overrides: Partial<AgentEventPayload>): AgentEventPayload {
  return {
    runId: "run-1",
    seq: 1,
    stream: "lifecycle",
    ts: Date.now(),
    data: {},
    ...overrides,
  };
}

describe("parseAgentEvent", () => {
  describe("lifecycle stream", () => {
    it("phase=start → thinking", () => {
      const result = parseAgentEvent(makeEvent({ stream: "lifecycle", data: { phase: "start" } }));
      expect(result.status).toBe("thinking");
      expect(result.summary).toBe(i18n.t("common:events.startRunning"));
    });

    it("phase=thinking → thinking", () => {
      const result = parseAgentEvent(
        makeEvent({ stream: "lifecycle", data: { phase: "thinking" } }),
      );
      expect(result.status).toBe("thinking");
    });

    it("phase=end → idle + clear tool/speech", () => {
      const result = parseAgentEvent(makeEvent({ stream: "lifecycle", data: { phase: "end" } }));
      expect(result.status).toBe("idle");
      expect(result.clearTool).toBe(true);
      expect(result.clearSpeech).toBe(true);
    });

    it("phase=fallback → error", () => {
      const result = parseAgentEvent(
        makeEvent({ stream: "lifecycle", data: { phase: "fallback" } }),
      );
      expect(result.status).toBe("error");
    });
  });

  describe("tool stream", () => {
    it("phase=start → tool_calling with info", () => {
      const result = parseAgentEvent(
        makeEvent({
          stream: "tool",
          data: { phase: "start", name: "web_search", args: { q: "test" } },
        }),
      );
      expect(result.status).toBe("tool_calling");
      expect(result.currentTool?.name).toBe("web_search");
      expect(result.incrementToolCount).toBe(true);
      expect(result.toolRecord?.name).toBe("web_search");
    });

    it("phase=end → thinking + clear tool", () => {
      const result = parseAgentEvent(
        makeEvent({
          stream: "tool",
          data: { phase: "end", name: "web_search" },
        }),
      );
      expect(result.status).toBe("thinking");
      expect(result.clearTool).toBe(true);
    });
  });

  describe("assistant stream", () => {
    it("extracts text → speaking", () => {
      const result = parseAgentEvent(
        makeEvent({
          stream: "assistant",
          data: { text: "Hello world" },
        }),
      );
      expect(result.status).toBe("speaking");
      expect(result.speechBubble?.text).toBe("Hello world");
    });

    it("truncates long text in summary", () => {
      const longText = "A".repeat(60);
      const result = parseAgentEvent(
        makeEvent({
          stream: "assistant",
          data: { text: longText },
        }),
      );
      expect(result.summary.length).toBeLessThan(longText.length);
      expect(result.summary).toContain("...");
    });
  });

  describe("error stream", () => {
    it("extracts message → error", () => {
      const result = parseAgentEvent(
        makeEvent({
          stream: "error",
          data: { message: "Rate limit exceeded" },
        }),
      );
      expect(result.status).toBe("error");
      expect(result.summary).toContain("Rate limit exceeded");
    });
  });

  describe("edge cases", () => {
    it("unknown stream returns idle", () => {
      const result = parseAgentEvent(
        makeEvent({
          stream: "unknown" as AgentEventPayload["stream"],
          data: {},
        }),
      );
      expect(result.status).toBe("idle");
    });

    it("missing data fields handled gracefully", () => {
      const result = parseAgentEvent(makeEvent({ stream: "tool", data: {} }));
      expect(result.status).toBe("thinking");
    });

    it("preserves runId and sessionKey", () => {
      const result = parseAgentEvent(
        makeEvent({
          runId: "run-xyz",
          sessionKey: "session-abc",
          stream: "lifecycle",
          data: { phase: "start" },
        }),
      );
      expect(result.runId).toBe("run-xyz");
      expect(result.sessionKey).toBe("session-abc");
    });
  });
});
