import type { ParsedAgentEvent } from "@/gateway/event-parser";
import type { VisualAgent } from "@/gateway/types";

export function applyEventToAgent(agent: VisualAgent, parsed: ParsedAgentEvent): void {
  agent.status = parsed.status;
  agent.lastActiveAt = Date.now();

  if (parsed.currentTool) {
    agent.currentTool = parsed.currentTool;
  }
  if (parsed.clearTool) {
    agent.currentTool = null;
  }

  if (parsed.speechBubble) {
    agent.speechBubble = parsed.speechBubble;
  }
  if (parsed.clearSpeech) {
    agent.speechBubble = null;
  }

  if (parsed.incrementToolCount) {
    agent.toolCallCount++;
  }

  if (parsed.toolRecord) {
    agent.toolCallHistory = [parsed.toolRecord, ...agent.toolCallHistory.slice(0, 9)];
  }

  if (parsed.runId && !agent.runId) {
    agent.runId = parsed.runId;
  }
}
