# ClawProwl

> [@ClawProwl](https://x.com/clawprowl).
> Visualize AI agent collaboration as a real-time digital twin office.

**ClawProwl** is the visual monitoring and management frontend for the [ClawProwl](https://github.com/clawprowl/clawprowl) Multi-Agent system. It renders Agent work status, collaboration links, tool calls, and resource consumption through an isometric-style virtual office scene, along with a full-featured console for system management.

**Core Metaphor:** Agent = Digital Employee | Office = Agent Runtime | Desk = Session | Meeting Pod = Collaboration Context

---

## Features

### Virtual Office

- **2D Floor Plan** — SVG-rendered isometric office with desk zones, hot desks, meeting areas, and rich furniture (desks, chairs, sofas, plants, coffee cups)
- **3D Scene** — React Three Fiber 3D office with character models, skill holograms, spawn portal effects, and post-processing
- **Agent Avatars** — Deterministically generated SVG avatars from agent IDs with real-time status animations (idle, working, speaking, tool calling, error)
- **Collaboration Lines** — Visual connections showing inter-Agent message flow
- **Speech Bubbles** — Live Markdown text streaming and tool call display
- **Side Panels** — Agent details, Token line charts, cost pie charts, activity heatmaps, SubAgent relationship graphs, event timelines

### Chat

- Bottom-docked chat bar for real-time conversations with Agents
- Agent selector, streaming message display, Markdown rendering
- Chat history drawer with timeline view

![office-2D](./assets/office-2d.png)

![office-3D](./assets/office-3d.png)

#### Demo Video

https://github.com/clawprowl/clawprowl/raw/main/assets/clawprowl-demo2D.mp4

### Console

Full system management interface with dedicated pages:

| Page          | Features                                                                                                                                                  |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dashboard** | Overview stats, alert banners, Channel/Skill overview, quick navigation                                                                                   |
| **Agents**    | Agent list/create/delete, detail tabs (Overview, Channels, Cron, Skills, Tools, Files)                                                                    |
| **Channels**  | Channel cards, configuration dialogs, stats, WhatsApp QR binding                                                                                          |
| **Skills**    | Skill marketplace, install options, skill detail dialogs                                                                                                  |
| **Cron**      | Scheduled task management and statistics                                                                                                                  |
| **Settings**  | Provider management (add/edit/model editor, system-discovered providers like OpenAI Codex OAuth), appearance, Gateway, developer, advanced, about, update |

![console-dashboard](./assets/console-dashboard.png)

![console-agent](./assets/console-agent.png)

![console-setting](./assets/console-setting.png)

### Other

- **i18n** — Full Chinese/English bilingual support with runtime language switching
- **Mock Mode** — Develop without a live Gateway connection
- **Responsive** — Mobile-optimized with automatic 2D fallback

---

## Tech Stack

| Layer            | Technology                                      |
| ---------------- | ----------------------------------------------- |
| Build Tool       | Vite 6                                          |
| UI Framework     | React 19                                        |
| 2D Rendering     | SVG + CSS Animations                            |
| 3D Rendering     | React Three Fiber (R3F) + @react-three/drei     |
| State Management | Zustand 5 + Immer                               |
| Styling          | Tailwind CSS 4                                  |
| Routing          | React Router 7                                  |
| Charts           | Recharts                                        |
| i18n             | i18next + react-i18next                         |
| Real-time        | Native WebSocket (connects to ClawProwl Gateway) |

---

## Prerequisites

- **Node.js 22+**
- **pnpm** (package manager)
- **[ClawProwl](https://github.com/clawprowl/clawprowl)** installed and configured

ClawProwl is a companion frontend that connects to a running ClawProwl Gateway. It does **not** start or manage the Gateway itself.

---

## Quick Launch

The fastest way to run ClawProwl — no cloning required:

```bash
# Run directly (one-time)
npx @clawprowl/clawprowl

# Or install globally
npm install -g @clawprowl/clawprowl
clawprowl
```

### Gateway Token Auto-Detection

If [ClawProwl](https://github.com/clawprowl/clawprowl) is installed locally, the Gateway auth token is **automatically detected** from `~/.clawprowl/clawprowl.json` — no manual configuration needed.

You can also provide the token explicitly:

```bash
clawprowl --token <your-gateway-token>
# or via environment variable
OPENCLAW_GATEWAY_TOKEN=<token> clawprowl
```

### CLI Options

| Flag                  | Description           | Default                |
| --------------------- | --------------------- | ---------------------- |
| `-t, --token <token>` | Gateway auth token    | auto-detected          |
| `-g, --gateway <url>` | Gateway WebSocket URL | `ws://localhost:18789` |
| `-p, --port <port>`   | Server port           | `5180`                 |
| `--host <host>`       | Bind address          | `0.0.0.0`              |
| `-h, --help`          | Show help             | —                      |

> **Note:** This serves the pre-built production bundle. For development with hot reload, see [Development](#development) below.

---

## Quick Start (from source)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Gateway Connection

Create a `.env.local` file (gitignored) with your Gateway connection details:

```bash
cat > .env.local << 'EOF'
VITE_GATEWAY_URL=ws://localhost:18789
VITE_GATEWAY_TOKEN=<your-gateway-token>
EOF
```

Get your Gateway token:

```bash
clawprowl config get gateway.auth.token
```

### 3. Enable Device Auth Bypass (Required)

ClawProwl is a pure web application and cannot provide Ed25519 device identity signatures that Gateway 2026.2.15+ requires for operator scopes. You must configure the Gateway to bypass this requirement:

```bash
clawprowl config set gateway.controlUi.dangerouslyDisableDeviceAuth true
```

**Restart the Gateway** after this configuration change.

> **Security Note:** This bypass is intended for local development. In production, use a reverse proxy or other secure authentication mechanism.

### 4. Start the Gateway

Ensure the ClawProwl Gateway is running on the configured address (default `localhost:18789`). You can start it via:

- The ClawProwl macOS app
- `clawprowl gateway run` CLI command
- Other deployment methods (see [ClawProwl documentation](https://github.com/clawprowl/clawprowl))

### 5. Start the Dev Server

```bash
pnpm dev
```

Open `http://localhost:5180` in your browser.

### Environment Variables

| Variable             | Required                              | Default                | Description                          |
| -------------------- | ------------------------------------- | ---------------------- | ------------------------------------ |
| `VITE_GATEWAY_URL`   | No                                    | `ws://localhost:18789` | Gateway WebSocket address            |
| `VITE_GATEWAY_TOKEN` | Yes (when connecting to real Gateway) | —                      | Gateway auth token                   |
| `VITE_MOCK`          | No                                    | `false`                | Enable mock mode (no Gateway needed) |

### Mock Mode (No Gateway)

To develop without a running Gateway, enable mock mode:

```bash
VITE_MOCK=true pnpm dev
```

This uses simulated Agent data for UI development.

---

## Project Structure

```
ClawProwl/
├── src/
│   ├── main.tsx / App.tsx           # Entry point and routing
│   ├── i18n/                        # Internationalization (zh/en)
│   ├── gateway/                     # Gateway communication layer
│   │   ├── ws-client.ts             # WebSocket client + auth + reconnect
│   │   ├── rpc-client.ts            # RPC request wrapper
│   │   ├── event-parser.ts          # Event parsing + state mapping
│   │   └── mock-adapter.ts          # Mock mode adapter
│   ├── store/                       # Zustand state management
│   │   ├── office-store.ts          # Main store (Agent state, connection, UI)
│   │   └── console-stores/          # Per-page console stores
│   ├── components/
│   │   ├── layout/                  # AppShell, ConsoleLayout, Sidebar, TopBar
│   │   ├── office-2d/               # 2D SVG floor plan + furniture
│   │   ├── office-3d/               # 3D R3F scene
│   │   ├── overlays/                # HTML overlays (speech bubbles)
│   │   ├── panels/                  # Detail/metrics/chart panels
│   │   ├── chat/                    # Chat dock bar
│   │   ├── console/                 # Console feature components
│   │   ├── pages/                   # Console route pages
│   │   └── shared/                  # Shared components
│   ├── hooks/                       # Custom React hooks
│   ├── lib/                         # Utility library
│   └── styles/                      # Global styles
├── public/                          # Static assets
├── tests/                           # Test files
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Development

### Commands

```bash
pnpm install              # Install dependencies
pnpm dev                  # Start dev server (port 5180)
pnpm build                # Production build
pnpm test                 # Run tests
pnpm test:watch           # Test watch mode
pnpm typecheck            # TypeScript type check
pnpm lint                 # Oxlint linting
pnpm format               # Oxfmt formatting
pnpm check                # lint + format check
```

### Architecture

ClawProwl connects to the Gateway via WebSocket and follows this data flow:

```
ClawProwl Gateway  ──WebSocket──>  ws-client.ts  ──>  event-parser.ts  ──>  Zustand Store  ──>  React Components
     │                                                                          │
     └── RPC (agents.list, chat.send, ...)  ──>  rpc-client.ts  ──────────────>─┘
```

The Gateway broadcasts real-time events (`agent`, `presence`, `health`, `heartbeat`) and responds to RPC requests. The frontend maps Agent lifecycle events to visual states (idle, working, speaking, tool_calling, error) and renders them in the office scene.

---

## Contributing

Contributions are welcome! Whether it's new visualization effects, 3D model improvements, console features, or performance optimizations.

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/cool-effect`)
3. Commit your changes (use [Conventional Commits](https://www.conventionalcommits.org/))
4. Open a Pull Request

---

## License

[MIT](./LICENSE)
