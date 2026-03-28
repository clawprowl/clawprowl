import type { GatewayAdapter, AdapterEventHandler, SkillUpdatePatch } from "./adapter";
import type {
  AgentCreateParams,
  AgentCreateResult,
  AgentDeleteParams,
  AgentDeleteResult,
  AgentFileContent,
  AgentFilesListResult,
  AgentFileSetResult,
  AgentUpdateParams,
  AgentUpdateResult,
  ChannelInfo,
  ChatMessage,
  ChatSendParams,
  ConfigPatchResult,
  ConfigSchemaResponse,
  ConfigSnapshot,
  CronTask,
  CronTaskInput,
  ModelCatalogEntry,
  SessionInfo,
  SessionPreview,
  SkillInfo,
  SkillInstallResult,
  StatusSummary,
  ToolCatalog,
  UpdateRunResult,
  UsageInfo,
} from "./adapter-types";
import type { AgentsListResponse } from "./types";

const MOCK_CHANNELS: ChannelInfo[] = [
  {
    id: "telegram:bot1",
    type: "telegram",
    name: "MyBot",
    status: "connected",
    accountId: "bot1",
    configured: true,
    linked: true,
    running: true,
    lastConnectedAt: Date.now() - 60_000,
  },
  {
    id: "discord:srv1",
    type: "discord",
    name: "Dev Server",
    status: "connected",
    accountId: "srv1",
    configured: true,
    linked: true,
    running: true,
    lastConnectedAt: Date.now() - 120_000,
  },
  {
    id: "whatsapp:wa1",
    type: "whatsapp",
    name: "WhatsApp",
    status: "disconnected",
    accountId: "wa1",
    configured: true,
    linked: false,
    running: false,
  },
  {
    id: "signal:sig1",
    type: "signal",
    name: "Signal",
    status: "error",
    accountId: "sig1",
    configured: true,
    linked: false,
    running: false,
    error: "Session expired",
  },
];

const MOCK_SKILLS: SkillInfo[] = [
  {
    id: "web-search",
    slug: "web-search",
    name: "Web Search",
    description: "Search the internet for real-time information",
    enabled: true,
    icon: "🔍",
    version: "1.0.0",
    isCore: true,
    isBundled: true,
    source: "core",
    always: true,
    eligible: true,
    requirements: { bins: ["curl"] },
    missing: { bins: [] },
    configChecks: [{ path: "SEARCH_API_KEY", satisfied: true }],
    primaryEnv: "SEARCH_API_KEY",
  },
  {
    id: "code-interpreter",
    slug: "code-interpreter",
    name: "Code Interpreter",
    description: "Execute code and return results",
    enabled: true,
    icon: "💻",
    version: "1.2.0",
    isCore: true,
    isBundled: true,
    source: "core",
    always: true,
    eligible: true,
  },
  {
    id: "file-editor",
    slug: "file-editor",
    name: "File Editor",
    description: "Read and write local files",
    enabled: true,
    icon: "📝",
    version: "1.0.0",
    isCore: true,
    isBundled: true,
    source: "core",
    always: true,
    eligible: true,
  },
  {
    id: "image-gen",
    slug: "image-gen",
    name: "Image Generation",
    description: "Generate images using AI",
    enabled: true,
    icon: "🎨",
    version: "0.9.0",
    isBundled: false,
    source: "marketplace",
    eligible: true,
    installOptions: [{ id: "node", kind: "npm", label: "npm install" }],
    homepage: "https://github.com/clawprowl/image-gen",
  },
  {
    id: "playwright",
    slug: "playwright",
    name: "Playwright",
    description: "Browser automation and testing",
    enabled: true,
    icon: "🎭",
    version: "1.1.0",
    isBundled: false,
    source: "marketplace",
    eligible: true,
    installOptions: [
      { id: "brew", kind: "brew", label: "Homebrew" },
      { id: "npm", kind: "npm", label: "npm install" },
    ],
    requirements: { bins: ["playwright"] },
    missing: { bins: [] },
  },
  {
    id: "voice-call",
    slug: "voice-call",
    name: "Voice Call",
    description: "Voice call skill",
    enabled: false,
    icon: "📞",
    version: "0.5.0",
    isBundled: false,
    source: "marketplace",
    eligible: false,
    blockedByAllowlist: true,
  },
];

const MOCK_CRON_TASKS: CronTask[] = [
  {
    id: "cron-1",
    name: "Daily Summary",
    description: "Generate work summary at 6pm every day",
    schedule: { kind: "cron", expr: "0 18 * * *" },
    enabled: true,
    createdAtMs: Date.now() - 7 * 86400_000,
    updatedAtMs: Date.now() - 86400_000,
    sessionTarget: "main",
    wakeMode: "now",
    payload: { kind: "agentTurn", message: "Generate today work summary" },
    delivery: { mode: "notify", channel: "telegram", target: "bot1" },
    state: {
      lastRunAtMs: Date.now() - 86400_000,
      lastRunStatus: "ok",
      nextRunAtMs: Date.now() + 3600_000,
    },
  },
  {
    id: "cron-2",
    name: "Weekly Report Reminder",
    description: "Send weekly report reminder every Monday at 9am",
    schedule: { kind: "cron", expr: "0 9 * * 1" },
    enabled: false,
    createdAtMs: Date.now() - 14 * 86400_000,
    updatedAtMs: Date.now() - 3 * 86400_000,
    sessionTarget: "isolated",
    wakeMode: "next-heartbeat",
    payload: { kind: "agentTurn", message: "Please submit this week report" },
    state: { lastRunAtMs: Date.now() - 7 * 86400_000, lastRunStatus: "ok" },
  },
  {
    id: "cron-3",
    name: "Health Check",
    schedule: { kind: "every", everyMs: 1800_000 },
    enabled: true,
    createdAtMs: Date.now() - 30 * 86400_000,
    updatedAtMs: Date.now(),
    sessionTarget: "main",
    wakeMode: "now",
    payload: { kind: "agentTurn", message: "Execute system health check" },
    state: {
      lastRunAtMs: Date.now() - 1200_000,
      lastRunStatus: "error",
      lastError: "Agent timeout",
      nextRunAtMs: Date.now() + 600_000,
    },
  },
];

const REDACTED = "__OPENCLAW_REDACTED__";

function mockConfigData(): Record<string, unknown> {
  return {
    models: {
      providers: {
        bankr: {
          baseUrl: "https://llm.bankr.bot",
          apiKey: REDACTED,
          api: "openai-completions",
          models: [
            // --- NEW models (announced 2026-03-08) ---
            { id: "gpt-5.4",       name: "GPT-5.4",       reasoning: true,  input: ["text"], contextWindow: 262144, maxTokens: 32768, isNew: true },
            { id: "grok-4.1-fast", name: "Grok 4.1 Fast", reasoning: true,  input: ["text"], contextWindow: 131072, maxTokens: 16384, isNew: true },
            { id: "deepseek-v3.2", name: "DeepSeek V3.2", reasoning: false, input: ["text"], contextWindow: 131072, maxTokens: 8192 , isNew: true },
            { id: "qwen3.5-plus",  name: "Qwen 3.5 Plus",  reasoning: true,  input: ["text"], contextWindow: 131072, maxTokens: 16384, isNew: true },
            { id: "qwen3.5-flash", name: "Qwen 3.5 Flash", reasoning: false, input: ["text"], contextWindow: 131072, maxTokens: 8192 , isNew: true },
            { id: "minimax-m2.5",  name: "MiniMax M2.5",   reasoning: false, input: ["text", "image"], contextWindow: 1000000, maxTokens: 16384, isNew: true },
            // Anthropic — docs.bankr.bot/llm-gateway/models
            { id: "claude-opus-4.6",   name: "Claude Opus 4.6",   reasoning: true,  input: ["text", "image"], contextWindow: 200000,  maxTokens: 32768 },
            { id: "claude-opus-4.5",   name: "Claude Opus 4.5",   reasoning: true,  input: ["text", "image"], contextWindow: 200000,  maxTokens: 32768 },
            { id: "claude-sonnet-4.6", name: "Claude Sonnet 4.6", reasoning: true,  input: ["text", "image"], contextWindow: 200000,  maxTokens: 16384 },
            { id: "claude-sonnet-4.5", name: "Claude Sonnet 4.5", reasoning: false, input: ["text", "image"], contextWindow: 200000,  maxTokens: 16384 },
            { id: "claude-haiku-4.5",  name: "Claude Haiku 4.5",  reasoning: false, input: ["text", "image"], contextWindow: 200000,  maxTokens: 8192  },
            // Google
            { id: "gemini-3-pro",   name: "Gemini 3 Pro",   reasoning: true,  input: ["text", "image"], contextWindow: 2097152, maxTokens: 65536 },
            { id: "gemini-3-flash", name: "Gemini 3 Flash", reasoning: false, input: ["text", "image"], contextWindow: 1048576, maxTokens: 65535 },
            { id: "gemini-2.5-pro",   name: "Gemini 2.5 Pro",   reasoning: true,  input: ["text", "image"], contextWindow: 1048576, maxTokens: 65536 },
            { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", reasoning: false, input: ["text", "image"], contextWindow: 1048576, maxTokens: 65535 },
            // OpenAI
            { id: "gpt-5.2",       name: "GPT-5.2",       reasoning: true,  input: ["text"], contextWindow: 262144, maxTokens: 32768 },
            { id: "gpt-5.2-codex", name: "GPT-5.2 Codex", reasoning: true,  input: ["text"], contextWindow: 262144, maxTokens: 32768 },
            { id: "gpt-5-mini",    name: "GPT-5 Mini",    reasoning: false, input: ["text"], contextWindow: 128000, maxTokens: 16384 },
            { id: "gpt-5-nano",    name: "GPT-5 Nano",    reasoning: false, input: ["text"], contextWindow: 128000, maxTokens: 8192  },
            // Kimi (Moonshot AI)
            { id: "kimi-k2.5", name: "Kimi K2.5", reasoning: true, input: ["text"], contextWindow: 131072, maxTokens: 16384 },
            // Qwen (Alibaba)
            { id: "qwen3-coder", name: "Qwen3 Coder", reasoning: true, input: ["text"], contextWindow: 131072, maxTokens: 16384 },
          ],
        },
        anthropic: {
          baseUrl: "https://api.anthropic.com",
          apiKey: REDACTED,
          api: "anthropic-messages",
          models: [
            {
              id: "claude-sonnet-4-20250514",
              name: "Claude Sonnet 4",
              reasoning: true,
              input: ["text", "image"],
              contextWindow: 200000,
              maxTokens: 16384,
            },
            {
              id: "claude-opus-4-20250514",
              name: "Claude Opus 4",
              reasoning: true,
              input: ["text", "image"],
              contextWindow: 200000,
              maxTokens: 32768,
            },
            {
              id: "claude-3-5-haiku-20241022",
              name: "Claude 3.5 Haiku",
              reasoning: false,
              input: ["text", "image"],
              contextWindow: 200000,
              maxTokens: 8192,
            },
          ],
        },
        openai: {
          baseUrl: "https://api.openai.com/v1",
          apiKey: REDACTED,
          api: "openai-responses",
          models: [
            {
              id: "gpt-4o",
              name: "GPT-4o",
              reasoning: false,
              input: ["text", "image"],
              contextWindow: 128000,
              maxTokens: 16384,
            },
            {
              id: "o3",
              name: "o3",
              reasoning: true,
              input: ["text", "image"],
              contextWindow: 200000,
              maxTokens: 100000,
            },
            {
              id: "gpt-4o-mini",
              name: "GPT-4o Mini",
              reasoning: false,
              input: ["text", "image"],
              contextWindow: 128000,
              maxTokens: 16384,
            },
          ],
        },
      },
    },
    agents: {
      defaults: {
        subagents: { maxConcurrent: 3, maxSpawnDepth: 1 },
      },
    },
    tools: {
      agentToAgent: { enabled: true, allow: ["main", "coder", "ai-researcher", "ecommerce"] },
    },
    update: { channel: "stable" },
    gateway: { auth: { token: REDACTED } },
  };
}

function deepMergePatch(
  target: Record<string, unknown>,
  patch: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...target };
  for (const [key, value] of Object.entries(patch)) {
    if (value === null) {
      delete result[key];
    } else if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      typeof result[key] === "object" &&
      !Array.isArray(result[key]) &&
      result[key] !== null
    ) {
      result[key] = deepMergePatch(
        result[key] as Record<string, unknown>,
        value as Record<string, unknown>,
      );
    } else {
      result[key] = value;
    }
  }
  return result;
}

function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

class SubAgentSimulator {
  private timers: ReturnType<typeof setTimeout>[] = [];
  private activeSubAgents = new Set<string>();
  private subCounter = 0;
  private running = false;

  constructor(
    private emit: (event: string, payload: unknown) => void,
    private maxConcurrent: number = 3,
  ) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.scheduleNextSpawn(5000);
    this.scheduleAgentToAgentComm(20_000);
  }

  stop(): void {
    this.running = false;
    for (const t of this.timers) clearTimeout(t);
    this.timers = [];
    this.activeSubAgents.clear();
  }

  private schedule(fn: () => void, ms: number): void {
    const t = setTimeout(fn, ms);
    this.timers.push(t);
  }

  private scheduleNextSpawn(delayMs: number): void {
    this.schedule(() => {
      if (!this.running) return;
      if (this.activeSubAgents.size < this.maxConcurrent) {
        this.spawnSubAgent();
      }
      this.scheduleNextSpawn(randRange(15000, 30000));
    }, delayMs);
  }

  private spawnSubAgent(): void {
    this.subCounter++;
    const subId = `mock-sub-${this.subCounter}`;
    const runId = `mock-run-sub-${this.subCounter}`;
    const sessionKey = `mock-session-sub-${this.subCounter}`;

    this.activeSubAgents.add(subId);

    // lifecycle start
    this.emit("agent", {
      runId,
      seq: 1,
      stream: "lifecycle",
      ts: Date.now(),
      data: { phase: "start", agentId: subId, parentAgentId: "main" },
      sessionKey,
    });

    // thinking phase
    this.schedule(() => {
      if (!this.running) return;
      this.emit("agent", {
        runId,
        seq: 2,
        stream: "assistant",
        ts: Date.now(),
        data: { text: `Sub-agent ${subId} is analyzing task...` },
        sessionKey,
      });
    }, randRange(1000, 2000));

    // tool calling phase
    this.schedule(() => {
      if (!this.running) return;
      const tools = ["web_search", "code_exec", "file_read", "analyze_data"];
      const tool = tools[Math.floor(Math.random() * tools.length)];
      this.emit("agent", {
        runId,
        seq: 3,
        stream: "tool",
        ts: Date.now(),
        data: { name: tool, phase: "start" },
        sessionKey,
      });
    }, randRange(3000, 5000));

    // speaking phase
    this.schedule(() => {
      if (!this.running) return;
      this.emit("agent", {
        runId,
        seq: 4,
        stream: "assistant",
        ts: Date.now(),
        data: { text: `Sub-agent ${subId} has completed task analysis.` },
        sessionKey,
      });
    }, randRange(6000, 9000));

    // lifecycle end
    const endDelay = randRange(8000, 15_000);
    this.schedule(() => {
      if (!this.running) return;
      this.emit("agent", {
        runId,
        seq: 5,
        stream: "lifecycle",
        ts: Date.now(),
        data: { phase: "end", agentId: subId },
        sessionKey,
      });
      this.activeSubAgents.delete(subId);
    }, endDelay);
  }

  private scheduleAgentToAgentComm(delayMs: number): void {
    this.schedule(() => {
      if (!this.running) return;
      const agents = ["main", "coder", "ai-researcher", "ecommerce"];
      const a = agents[Math.floor(Math.random() * agents.length)];
      let b = a;
      while (b === a) b = agents[Math.floor(Math.random() * agents.length)];

      const sessionKey = `a2a-${Date.now()}`;
      const runIdA = `a2a-run-${a}-${Date.now()}`;
      const runIdB = `a2a-run-${b}-${Date.now()}`;

      // Both agents start in the same session (triggers collaboration link)
      this.emit("agent", {
        runId: runIdA,
        seq: 1,
        stream: "lifecycle",
        ts: Date.now(),
        data: { phase: "start", agentId: a },
        sessionKey,
      });
      this.emit("agent", {
        runId: runIdB,
        seq: 1,
        stream: "lifecycle",
        ts: Date.now(),
        data: { phase: "start", agentId: b },
        sessionKey,
      });

      // End communication after some time
      const commDuration = randRange(10_000, 20_000);
      this.schedule(() => {
        if (!this.running) return;
        this.emit("agent", {
          runId: runIdA,
          seq: 2,
          stream: "lifecycle",
          ts: Date.now(),
          data: { phase: "end", agentId: a },
          sessionKey,
        });
        this.emit("agent", {
          runId: runIdB,
          seq: 2,
          stream: "lifecycle",
          ts: Date.now(),
          data: { phase: "end", agentId: b },
          sessionKey,
        });
      }, commDuration);

      this.scheduleAgentToAgentComm(randRange(15_000, 30_000));
    }, delayMs);
  }
}

export class MockAdapter implements GatewayAdapter {
  private handlers: Set<AdapterEventHandler> = new Set();
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private pendingTimers: ReturnType<typeof setTimeout>[] = [];
  private mockConfig: Record<string, unknown> = mockConfigData();
  private mockHash = Date.now().toString(36);
  private subAgentSimulator: SubAgentSimulator | null = null;

  async connect(): Promise<void> {
    this.heartbeatTimer = setInterval(() => {
      for (const h of this.handlers) {
        h("heartbeat", { ts: Date.now() });
      }
    }, 30_000);

    // Start sub-agent simulator after connection
    this.subAgentSimulator = new SubAgentSimulator(
      (event, payload) => this.emit(event, payload),
      3,
    );
    this.subAgentSimulator.start();
  }

  disconnect(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    this.subAgentSimulator?.stop();
    this.subAgentSimulator = null;
    this.cancelPendingTimers();
    this.handlers.clear();
  }

  onEvent(handler: AdapterEventHandler): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  private emit(event: string, payload: unknown): void {
    for (const h of this.handlers) {
      h(event, payload);
    }
  }

  private cancelPendingTimers(): void {
    for (const t of this.pendingTimers) {
      clearTimeout(t);
    }
    this.pendingTimers = [];
  }

  private scheduleTimer(fn: () => void, ms: number): void {
    const t = setTimeout(fn, ms);
    this.pendingTimers.push(t);
  }

  async chatHistory(): Promise<ChatMessage[]> {
    return [
      {
        id: "msg-hist-1",
        role: "user",
        content: "Hello, tell me about ClawProwl",
        timestamp: Date.now() - 120_000,
      },
      {
        id: "msg-hist-2",
        role: "assistant",
        content:
          "**ClawProwl** is a multi-agent collaboration system that supports:\n\n- Multi-channel messaging (Telegram, Discord, WhatsApp, etc.)\n- Tool calling and skill extensions\n- Scheduled task management\n- Real-time visual monitoring\n\nYou can observe agent collaboration behavior through ClawProwl.",
        timestamp: Date.now() - 110_000,
      },
    ];
  }

  async chatSend(params: ChatSendParams): Promise<void> {
    const runId = `mock-run-${Date.now()}`;
    const responseText = `Message received: "${params.text}"\n\nThis is a simulated response in Mock mode. Once connected to a real Gateway, Agent responses will appear here.`;

    // Simulate Gateway chat events: delta → delta → final
    this.scheduleTimer(() => {
      this.emit("chat", {
        type: "event",
        event: "chat",
        payload: {
          runId,
          state: "delta",
          message: {
            role: "assistant",
            content: responseText.slice(0, Math.floor(responseText.length / 2)),
          },
        },
      });
    }, 300);

    this.scheduleTimer(() => {
      this.emit("chat", {
        type: "event",
        event: "chat",
        payload: {
          runId,
          state: "delta",
          message: {
            role: "assistant",
            content: responseText,
          },
        },
      });
    }, 800);

    this.scheduleTimer(() => {
      this.emit("chat", {
        type: "event",
        event: "chat",
        payload: {
          runId,
          state: "final",
          message: {
            role: "assistant",
            content: responseText,
            id: `mock-msg-${Date.now()}`,
            stopReason: "end_turn",
          },
        },
      });
    }, 1200);
  }

  async chatAbort(_runId: string): Promise<void> {
    this.cancelPendingTimers();
    this.emit("chat", {
      type: "event",
      event: "chat",
      payload: { state: "aborted" },
    });
  }

  async sessionsList(): Promise<SessionInfo[]> {
    return [
      {
        key: "agent:main:main",
        agentId: "agent-main",
        label: "Default Session",
        createdAt: Date.now() - 3600_000,
        lastActiveAt: Date.now(),
        messageCount: 12,
      },
    ];
  }

  async sessionsPreview(sessionKey: string): Promise<SessionPreview> {
    return { key: sessionKey, messages: await this.chatHistory() };
  }

  async channelsStatus(): Promise<ChannelInfo[]> {
    return [...MOCK_CHANNELS];
  }

  async skillsStatus(): Promise<SkillInfo[]> {
    return [...MOCK_SKILLS];
  }

  async cronList(): Promise<CronTask[]> {
    return [...MOCK_CRON_TASKS];
  }

  async channelsLogout(_channel: string, _accountId?: string): Promise<{ cleared: boolean }> {
    return { cleared: true };
  }

  async webLoginStart(_force?: boolean): Promise<{ qrDataUrl?: string; message: string }> {
    return {
      qrDataUrl:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      message: "Scan QR code with WhatsApp",
    };
  }

  async webLoginWait(): Promise<{ connected: boolean; message: string }> {
    await new Promise((r) => setTimeout(r, 2000));
    return { connected: true, message: "WhatsApp connected successfully" };
  }

  async skillsInstall(_name: string, _installId: string): Promise<SkillInstallResult> {
    return {
      ok: true,
      message: "Mock install completed",
      stdout: "mock: skill installed successfully",
      code: 0,
    };
  }

  async skillsUpdate(_skillKey: string, _patch: SkillUpdatePatch): Promise<{ ok: boolean }> {
    return { ok: true };
  }

  async cronAdd(input: CronTaskInput): Promise<CronTask> {
    const now = Date.now();
    return {
      id: `cron-${now}`,
      name: input.name,
      description: input.description,
      schedule: input.schedule,
      enabled: input.enabled ?? true,
      createdAtMs: now,
      updatedAtMs: now,
      sessionTarget: input.sessionTarget,
      wakeMode: input.wakeMode,
      payload: input.payload,
      delivery: input.delivery,
      agentId: input.agentId,
      sessionKey: input.sessionKey,
      state: {},
    };
  }

  async cronUpdate(id: string, patch: Partial<CronTaskInput>): Promise<CronTask> {
    const existing = MOCK_CRON_TASKS.find((t) => t.id === id);
    if (!existing) throw new Error(`Cron task not found: ${id}`);
    return { ...existing, ...patch, updatedAtMs: Date.now() };
  }

  async cronRemove(_id: string): Promise<void> {}

  async cronRun(_id: string): Promise<void> {}

  async agentsList(): Promise<AgentsListResponse> {
    return {
      defaultId: "main",
      mainKey: "agent:main:main",
      scope: "global",
      agents: [
        { id: "main", name: "PROWL", default: true, identity: { name: "PROWL", emoji: "🐾", avatarUrl: "https://pbs.twimg.com/profile_images/2029487683278708736/JqpyzvWW_400x400.jpg" } },
        {
          id: "ai-researcher",
          name: "0xDeployer",
          identity: { name: "0xDeployer", emoji: "🚀", avatarUrl: "https://pbs.twimg.com/profile_images/1816688728951476224/PkVN69ln_400x400.jpg" },
        },
        { id: "coder", name: "FINN", identity: { name: "FINN", emoji: "⚡", avatarUrl: "https://pbs.twimg.com/profile_images/2003998762503745536/jDpf21Ig_400x400.jpg" } },
        { id: "ecommerce", name: "BANKR", identity: { name: "BANKR", emoji: "🏦", avatarUrl: "https://pbs.twimg.com/profile_images/1951545493936545792/AriqgxQN_400x400.jpg" } },
      ],
    };
  }

  async agentsCreate(params: AgentCreateParams): Promise<AgentCreateResult> {
    return {
      ok: true,
      agentId: `agent-${Date.now()}`,
      name: params.name,
      workspace: params.workspace,
    };
  }

  async agentsUpdate(params: AgentUpdateParams): Promise<AgentUpdateResult> {
    return { ok: true, agentId: params.agentId };
  }

  async agentsDelete(params: AgentDeleteParams): Promise<AgentDeleteResult> {
    return { ok: true, agentId: params.agentId, removedBindings: 0 };
  }

  async agentsFilesList(_agentId: string): Promise<AgentFilesListResult> {
    const now = new Date().toISOString();
    return {
      agentId: _agentId,
      workspace: `~/.clawprowl/workspace`,
      files: [
        { name: "AGENTS.md", size: 7900, modifiedAt: now },
        { name: "SOUL.md", size: 2048, modifiedAt: now },
        { name: "TOOLS.md", size: 860, modifiedAt: now },
        { name: "IDENTITY.md", size: 759, modifiedAt: now },
        { name: "USER.md", size: 1800, modifiedAt: now },
        { name: "HEARTBEAT.md", size: 512, modifiedAt: now },
      ],
    };
  }

  async agentsFilesGet(agentId: string, name: string): Promise<AgentFileContent> {
    return {
      agentId,
      workspace: `~/.clawprowl/workspace`,
      file: {
        name,
        content: `# ${name}\n\nMock content for ${name}`,
        size: 128,
        modifiedAt: new Date().toISOString(),
      },
    };
  }

  async agentsFilesSet(
    agentId: string,
    name: string,
    content: string,
  ): Promise<AgentFileSetResult> {
    return {
      ok: true,
      agentId,
      workspace: `~/.clawprowl/workspace`,
      file: { name, size: content.length, modifiedAt: new Date().toISOString() },
    };
  }

  async toolsCatalog(): Promise<ToolCatalog> {
    return {
      tools: [
        { name: "web_search", description: "Search internet" },
        { name: "code_exec", description: "Execute code" },
      ],
    };
  }

  async usageStatus(): Promise<UsageInfo> {
    return {
      updatedAt: Date.now(),
      providers: [
        {
          provider: "bankr",
          displayName: "Bankr LLM Gateway",
          plan: "credits",
          windows: [
            { label: "daily", usedPercent: 30, resetAt: Date.now() + 12 * 3600_000 },
            { label: "monthly", usedPercent: 15 },
          ],
        },
        {
          provider: "anthropic",
          displayName: "Anthropic",
          plan: "pro",
          windows: [
            { label: "daily", usedPercent: 45, resetAt: Date.now() + 12 * 3600_000 },
            { label: "monthly", usedPercent: 22 },
          ],
        },
        {
          provider: "openai",
          displayName: "OpenAI",
          plan: "tier-3",
          windows: [{ label: "daily", usedPercent: 12 }],
        },
      ],
    };
  }

  async modelsList(): Promise<ModelCatalogEntry[]> {
    // Mirrors mockConfigData() bankr models — docs.bankr.bot/llm-gateway/models + 2026-03-08 additions
    return [
      // NEW — 2026-03-08
      { id: "gpt-5.4",            name: "GPT-5.4",           provider: "bankr", reasoning: true,  input: ["text"], contextWindow: 262144, isNew: true },
      { id: "grok-4.1-fast",      name: "Grok 4.1 Fast",     provider: "bankr", reasoning: true,  input: ["text"], contextWindow: 131072, isNew: true },
      { id: "deepseek-v3.2",      name: "DeepSeek V3.2",     provider: "bankr", reasoning: false, input: ["text"], contextWindow: 131072, isNew: true },
      { id: "qwen3.5-plus",       name: "Qwen 3.5 Plus",     provider: "bankr", reasoning: true,  input: ["text"], contextWindow: 131072, isNew: true },
      { id: "qwen3.5-flash",      name: "Qwen 3.5 Flash",    provider: "bankr", reasoning: false, input: ["text"], contextWindow: 131072, isNew: true },
      { id: "minimax-m2.5",       name: "MiniMax M2.5",      provider: "bankr", reasoning: false, input: ["text", "image"], contextWindow: 1000000, isNew: true },
      // Anthropic
      { id: "claude-opus-4.6",    name: "Claude Opus 4.6",   provider: "bankr", reasoning: true,  input: ["text", "image"], contextWindow: 200000  },
      { id: "claude-opus-4.5",    name: "Claude Opus 4.5",   provider: "bankr", reasoning: true,  input: ["text", "image"], contextWindow: 200000  },
      { id: "claude-sonnet-4.6",  name: "Claude Sonnet 4.6", provider: "bankr", reasoning: true,  input: ["text", "image"], contextWindow: 200000  },
      { id: "claude-sonnet-4.5",  name: "Claude Sonnet 4.5", provider: "bankr", reasoning: false, input: ["text", "image"], contextWindow: 200000  },
      { id: "claude-haiku-4.5",   name: "Claude Haiku 4.5",  provider: "bankr", reasoning: false, input: ["text", "image"], contextWindow: 200000  },
      // Google
      { id: "gemini-3-pro",       name: "Gemini 3 Pro",      provider: "bankr", reasoning: true,  input: ["text", "image"], contextWindow: 2097152 },
      { id: "gemini-3-flash",     name: "Gemini 3 Flash",    provider: "bankr", reasoning: false, input: ["text", "image"], contextWindow: 1048576 },
      { id: "gemini-2.5-pro",     name: "Gemini 2.5 Pro",    provider: "bankr", reasoning: true,  input: ["text", "image"], contextWindow: 1048576 },
      { id: "gemini-2.5-flash",   name: "Gemini 2.5 Flash",  provider: "bankr", reasoning: false, input: ["text", "image"], contextWindow: 1048576 },
      // OpenAI
      { id: "gpt-5.2",            name: "GPT-5.2",           provider: "bankr", reasoning: true,  input: ["text"], contextWindow: 262144 },
      { id: "gpt-5.2-codex",      name: "GPT-5.2 Codex",     provider: "bankr", reasoning: true,  input: ["text"], contextWindow: 262144 },
      { id: "gpt-5-mini",         name: "GPT-5 Mini",        provider: "bankr", reasoning: false, input: ["text"], contextWindow: 128000 },
      { id: "gpt-5-nano",         name: "GPT-5 Nano",        provider: "bankr", reasoning: false, input: ["text"], contextWindow: 128000 },
      // Kimi
      { id: "kimi-k2.5",          name: "Kimi K2.5",         provider: "bankr", reasoning: true,  input: ["text"], contextWindow: 131072 },
      // Qwen
      { id: "qwen3-coder",        name: "Qwen3 Coder",       provider: "bankr", reasoning: true,  input: ["text"], contextWindow: 131072 },
    ];
  }

  async configGet(): Promise<ConfigSnapshot> {
    return {
      config: this.mockConfig,
      hash: this.mockHash,
      raw: JSON.stringify(this.mockConfig, null, 2),
      valid: true,
      path: "~/.clawprowl/clawprowl.json",
    };
  }

  async configPatch(raw: string, baseHash?: string): Promise<ConfigPatchResult> {
    if (baseHash && baseHash !== this.mockHash) {
      return {
        ok: false,
        config: this.mockConfig,
        error: "config changed since last load; re-run config.get and retry",
      };
    }
    const patch = JSON.parse(raw) as Record<string, unknown>;
    this.mockConfig = deepMergePatch(this.mockConfig, patch);
    this.mockHash = Date.now().toString(36);
    return { ok: true, config: this.mockConfig, restart: { scheduled: true, delayMs: 2000 } };
  }

  async configSchema(): Promise<ConfigSchemaResponse> {
    return {
      schema: {},
      uiHints: {
        "models.providers.*.apiKey": { sensitive: true, label: "API Key" },
        "gateway.auth.token": { sensitive: true, label: "Gateway Token" },
      },
      version: "mock",
    };
  }

  async statusSummary(): Promise<StatusSummary> {
    return {
      version: "2026.2.27-mock",
      port: 18789,
      uptime: 86400,
      mode: "local",
      pid: 12345,
      nodeVersion: "v22.0.0",
      platform: "darwin",
    };
  }

  async updateRun(_params?: { restartDelayMs?: number }): Promise<UpdateRunResult> {
    return {
      ok: true,
      result: {
        status: "noop",
        mode: "npm",
        reason: "already up to date",
        steps: [],
        durationMs: 1200,
      },
      restart: null,
    };
  }
}
