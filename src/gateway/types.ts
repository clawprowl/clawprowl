// Gateway WebSocket protocol type definitions
// Aligned with ClawProwl Gateway source (protocol v3)

// --- Request/Response Frames ---

export interface GatewayRequest {
  type: "req";
  id: string;
  method: string;
  params?: Record<string, unknown>;
}

export interface GatewayResponseOk<T = unknown> {
  type: "res";
  id: string;
  ok: true;
  payload: T;
}

export interface GatewayResponseError {
  type: "res";
  id: string;
  ok: false;
  error: ErrorShape;
}

export type GatewayResponseFrame<T = unknown> = GatewayResponseOk<T> | GatewayResponseError;

export interface GatewayEventFrame<T = unknown> {
  type: "event";
  event: string;
  payload: T;
}

export type GatewayFrame = GatewayRequest | GatewayResponseFrame | GatewayEventFrame;

// --- Authentication ---

export interface ConnectParams {
  minProtocol: number;
  maxProtocol: number;
  client: {
    id: string;
    version: string;
    platform: string;
    mode: string;
  };
  caps: string[];
  scopes?: string[];
  auth?: {
    token: string;
  };
}

export interface HealthAgentInfo {
  agentId: string;
  isDefault?: boolean;
  heartbeat?: Record<string, unknown>;
  sessions?: Record<string, unknown>;
}

export interface HealthSnapshot {
  ok: boolean;
  ts: number;
  agents?: HealthAgentInfo[];
  defaultAgentId?: string;
  channels?: Record<string, unknown>;
  sessions?: Record<string, unknown>;
}

export interface HelloOk {
  type: "hello-ok";
  protocol: number;
  server: {
    version: string;
    connId?: string;
  };
  features?: Record<string, unknown>;
  snapshot?: {
    presence?: unknown;
    health?: HealthSnapshot;
    sessionDefaults?: unknown;
    uptimeMs?: number;
    configPath?: string;
    stateDir?: string;
    authMode?: string;
  };
  policy?: Record<string, unknown>;
}

// --- Agent Events ---

export type AgentStream = "lifecycle" | "tool" | "assistant" | "error";

export interface AgentEventPayload {
  runId: string;
  seq: number;
  stream: AgentStream;
  ts: number;
  data: Record<string, unknown>;
  sessionKey?: string;
}

// --- Visual State ---

export type AgentVisualStatus =
  | "idle"
  | "thinking"
  | "tool_calling"
  | "speaking"
  | "spawning"
  | "error"
  | "offline";

export interface ToolInfo {
  name: string;
  args?: Record<string, unknown>;
  startedAt: number;
}

export interface SpeechBubble {
  text: string;
  timestamp: number;
}

export type AgentZone = "desk" | "meeting" | "hotDesk" | "lounge" | "corridor";

export interface MovementState {
  path: Array<{ x: number; y: number }>;
  progress: number;
  duration: number;
  startTime: number;
  fromZone: AgentZone;
  toZone: AgentZone;
}

export interface VisualAgent {
  id: string;
  name: string;
  status: AgentVisualStatus;
  position: { x: number; y: number };
  currentTool: ToolInfo | null;
  speechBubble: SpeechBubble | null;
  lastActiveAt: number;
  toolCallCount: number;
  toolCallHistory: ToolCallRecord[];
  runId: string | null;
  isSubAgent: boolean;
  isPlaceholder: boolean;
  parentAgentId: string | null;
  childAgentIds: string[];
  zone: AgentZone;
  originalPosition: { x: number; y: number } | null;
  movement: MovementState | null;
  confirmed: boolean;
  avatarUrl?: string;
}

export interface ToolCallRecord {
  name: string;
  timestamp: number;
}

export interface CollaborationLink {
  sourceId: string;
  targetId: string;
  sessionKey: string;
  strength: number;
  lastActivityAt: number;
}

export interface EventHistoryItem {
  timestamp: number;
  agentId: string;
  agentName: string;
  stream: AgentStream;
  summary: string;
}

// --- Sub-Agent Polling ---

export interface SubAgentInfo {
  sessionKey: string;
  agentId: string;
  label: string;
  task: string;
  requesterSessionKey: string;
  startedAt: number;
}

export interface SessionSnapshot {
  sessions: SubAgentInfo[];
  fetchedAt: number;
}

// --- Global Metrics ---

export interface GlobalMetrics {
  activeAgents: number;
  totalAgents: number;
  totalTokens: number;
  tokenRate: number;
  collaborationHeat: number;
}

// --- Connection State ---

export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "error";

// --- Config Awareness ---

export interface AgentToAgentConfig {
  enabled: boolean;
  allow: string[];
}

// --- Store ---

export type ViewMode = "2d" | "3d";
export type ThemeMode = "light" | "dark";
export type PageId =
  | "office"
  | "dashboard"
  | "agents"
  | "channels"
  | "skills"
  | "cron"
  | "settings";

export interface TokenSnapshot {
  timestamp: number;
  total: number;
  byAgent: Record<string, number>;
}

export interface OfficeStore {
  agents: Map<string, VisualAgent>;
  links: CollaborationLink[];
  globalMetrics: GlobalMetrics;
  connectionStatus: ConnectionStatus;
  connectionError: string | null;
  selectedAgentId: string | null;
  viewMode: ViewMode;
  eventHistory: EventHistoryItem[];
  sidebarCollapsed: boolean;
  lastSessionsSnapshot: SessionSnapshot | null;
  theme: ThemeMode;
  bloomEnabled: boolean;
  operatorScopes: string[];
  tokenHistory: TokenSnapshot[];
  agentCosts: Record<string, number>;
  currentPage: PageId;
  chatDockHeight: number;

  // Config awareness
  maxSubAgents: number;
  agentToAgentConfig: AgentToAgentConfig;

  // runId → agentId mapping
  runIdMap: Map<string, string>;
  // sessionKey → agentId[] mapping
  sessionKeyMap: Map<string, string[]>;

  // Agent CRUD
  addAgent: (agent: VisualAgent) => void;
  updateAgent: (id: string, patch: Partial<VisualAgent>) => void;
  removeAgent: (id: string) => void;
  initAgents: (agents: AgentSummary[]) => void;

  // Sub-Agent management
  addSubAgent: (parentId: string, info: SubAgentInfo) => void;
  removeSubAgent: (subAgentId: string) => void;

  // Meeting zone position management
  moveToMeeting: (agentId: string, meetingPosition: { x: number; y: number }) => void;
  returnFromMeeting: (agentId: string) => void;

  // Walking animation
  startMovement: (agentId: string, toZone: AgentZone, targetPos?: { x: number; y: number }) => void;
  tickMovement: (agentId: string, deltaTime: number) => void;
  completeMovement: (agentId: string) => void;

  // Agent confirmation (unconfirmed → confirmed)
  confirmAgent: (agentId: string, role: "main" | "sub", parentId?: string) => void;

  // Lounge pre-fill
  prefillLoungePlaceholders: (count: number) => void;

  // Sessions polling
  setSessionsSnapshot: (snapshot: SessionSnapshot) => void;

  // Event handling
  processAgentEvent: (event: AgentEventPayload) => void;
  initEventHistory: () => Promise<void>;

  // UI actions
  selectAgent: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setConnectionStatus: (status: ConnectionStatus, error?: string) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
  setBloomEnabled: (enabled: boolean) => void;

  // Config awareness
  setMaxSubAgents: (n: number) => void;
  setAgentToAgentConfig: (config: AgentToAgentConfig) => void;

  // Scopes & Metrics
  setOperatorScopes: (scopes: string[]) => void;
  pushTokenSnapshot: (snapshot: TokenSnapshot) => void;
  setAgentCosts: (costs: Record<string, number>) => void;
  setCurrentPage: (page: PageId) => void;
  setChatDockHeight: (height: number) => void;

  // Metrics
  updateMetrics: () => void;
}

// --- Errors ---

export interface ErrorShape {
  code: string;
  message: string;
  retryable?: boolean;
  retryAfterMs?: number;
}

// --- RPC Data ---

export interface AgentSummary {
  id: string;
  name: string;
  default?: boolean;
  identity?: {
    name?: string;
    theme?: string;
    emoji?: string;
    avatar?: string;
    avatarUrl?: string;
  };
}

export interface AgentsListResponse {
  defaultId: string;
  mainKey: string;
  scope: string;
  agents: AgentSummary[];
}
