import type { ToolCallInfo } from "@/gateway/adapter-types";

export function generateMessageId(): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  return `msg-${ts}-${rand}`;
}

export function mergeDelta(existingContent: string, deltaText: string): string {
  if (!deltaText) return existingContent;
  return existingContent + deltaText;
}

export function updateToolCall(
  toolCalls: ToolCallInfo[],
  toolCallId: string,
  patch: Partial<ToolCallInfo>,
): ToolCallInfo[] {
  const idx = toolCalls.findIndex((tc) => tc.id === toolCallId);
  if (idx >= 0) {
    const updated = [...toolCalls];
    updated[idx] = { ...updated[idx], ...patch };
    return updated;
  }
  return [
    ...toolCalls,
    {
      id: toolCallId,
      name: patch.name ?? "unknown",
      status: patch.status ?? "pending",
      args: patch.args,
      result: patch.result,
    },
  ];
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}

type FlushFn = (accumulated: string) => void;

interface BatchSchedulerOptions {
  batchMs?: number;
  maxDelayMs?: number;
}

export interface BatchScheduler {
  push(delta: string): void;
  flush(): void;
  destroy(): void;
}

export function createBatchScheduler(
  flushFn: FlushFn,
  options: BatchSchedulerOptions = {},
): BatchScheduler {
  const batchMs = options.batchMs ?? 50;
  const maxDelayMs = options.maxDelayMs ?? 100;

  let accumulated = "";
  let batchTimer: ReturnType<typeof setTimeout> | null = null;
  let maxTimer: ReturnType<typeof setTimeout> | null = null;
  let destroyed = false;

  function flush() {
    if (destroyed) return;
    clearTimers();
    if (accumulated) {
      const data = accumulated;
      accumulated = "";
      flushFn(data);
    }
  }

  function clearTimers() {
    if (batchTimer) {
      clearTimeout(batchTimer);
      batchTimer = null;
    }
    if (maxTimer) {
      clearTimeout(maxTimer);
      maxTimer = null;
    }
  }

  function push(delta: string) {
    if (destroyed) return;
    accumulated += delta;

    if (batchTimer) clearTimeout(batchTimer);
    batchTimer = setTimeout(flush, batchMs);

    if (!maxTimer) {
      maxTimer = setTimeout(flush, maxDelayMs);
    }
  }

  function destroy() {
    clearTimers();
    if (accumulated) {
      const data = accumulated;
      accumulated = "";
      flushFn(data);
    }
    destroyed = true;
  }

  return { push, flush, destroy };
}
