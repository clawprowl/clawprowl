import type { AgentEventPayload } from "@/gateway/types";

const MAX_QUEUE_SIZE = 500;
const TRIM_TO_SIZE = 200;

function isHighPriority(event: AgentEventPayload): boolean {
  if (event.stream === "error") return true;
  if (event.stream === "lifecycle") {
    const phase = event.data.phase as string | undefined;
    return phase === "start" || phase === "end";
  }
  return false;
}

export class EventThrottle {
  private queue: AgentEventPayload[] = [];
  private rafId: number | null = null;
  private handler: ((events: AgentEventPayload[]) => void) | null = null;
  private immediateHandler: ((event: AgentEventPayload) => void) | null = null;

  onBatch(handler: (events: AgentEventPayload[]) => void): void {
    this.handler = handler;
  }

  onImmediate(handler: (event: AgentEventPayload) => void): void {
    this.immediateHandler = handler;
  }

  push(event: AgentEventPayload): void {
    if (isHighPriority(event)) {
      this.immediateHandler?.(event);
      return;
    }

    this.queue.push(event);

    if (this.queue.length > MAX_QUEUE_SIZE) {
      console.warn(
        `[EventThrottle] Queue overflow: ${this.queue.length} events, trimming to ${TRIM_TO_SIZE}`,
      );
      this.queue = this.queue.slice(-TRIM_TO_SIZE);
    }

    this.scheduleFlush();
  }

  private scheduleFlush(): void {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.flush();
    });
  }

  private flush(): void {
    this.rafId = null;
    if (this.queue.length === 0) return;

    const batch = this.queue;
    this.queue = [];
    this.handler?.(batch);
  }

  destroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.queue = [];
  }
}
