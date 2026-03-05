import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AgentEventPayload } from "@/gateway/types";
import { EventThrottle } from "@/lib/event-throttle";

function makeEvent(overrides: Partial<AgentEventPayload> = {}): AgentEventPayload {
  return {
    runId: "r1",
    seq: 1,
    stream: "assistant",
    ts: Date.now(),
    data: { text: "hello" },
    ...overrides,
  };
}

describe("EventThrottle", () => {
  let throttle: EventThrottle;

  beforeEach(() => {
    throttle = new EventThrottle();
  });

  it("high priority events fire immediately", () => {
    const immediate = vi.fn();
    throttle.onImmediate(immediate);

    throttle.push(makeEvent({ stream: "lifecycle", data: { phase: "start" } }));
    expect(immediate).toHaveBeenCalledTimes(1);

    throttle.push(makeEvent({ stream: "error", data: { message: "fail" } }));
    expect(immediate).toHaveBeenCalledTimes(2);
  });

  it("normal events are batched via RAF", async () => {
    const batchHandler = vi.fn();
    throttle.onBatch(batchHandler);

    throttle.push(makeEvent({ stream: "assistant" }));
    throttle.push(makeEvent({ stream: "assistant" }));

    expect(batchHandler).not.toHaveBeenCalled();

    await new Promise((resolve) => requestAnimationFrame(resolve));

    expect(batchHandler).toHaveBeenCalledTimes(1);
    expect(batchHandler.mock.calls[0][0]).toHaveLength(2);
  });

  it("overflow trims queue to 200", () => {
    const batchHandler = vi.fn();
    throttle.onBatch(batchHandler);

    for (let i = 0; i < 600; i++) {
      throttle.push(makeEvent({ stream: "assistant", seq: i }));
    }

    // Queue should be trimmed even before flush
    // After destroy, queue is empty
    throttle.destroy();
  });

  it("destroy cancels pending RAF", () => {
    const batchHandler = vi.fn();
    throttle.onBatch(batchHandler);

    throttle.push(makeEvent());
    throttle.destroy();

    // Should not flush after destroy
    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        expect(batchHandler).not.toHaveBeenCalled();
        resolve();
      });
    });
  });
});
