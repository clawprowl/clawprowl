import type { GatewayAdapter } from "./adapter";

let adapterInstance: GatewayAdapter | null = null;
let adapterReadyResolvers: Array<(adapter: GatewayAdapter) => void> = [];

export function getAdapter(): GatewayAdapter {
  if (adapterInstance) return adapterInstance;
  throw new Error("GatewayAdapter not initialized. Call initAdapter() first.");
}

/**
 * Wait for adapter to be initialized (resolves immediately if already ready).
 * Console pages call this before fetching data to handle the race condition
 * where the page mounts before the WebSocket connection establishes.
 */
export function waitForAdapter(timeoutMs = 15_000): Promise<GatewayAdapter> {
  if (adapterInstance) return Promise.resolve(adapterInstance);

  return new Promise<GatewayAdapter>((resolve, reject) => {
    const timer = setTimeout(() => {
      adapterReadyResolvers = adapterReadyResolvers.filter((r) => r !== resolve);
      reject(new Error("Adapter initialization timed out"));
    }, timeoutMs);

    const wrappedResolve = (adapter: GatewayAdapter) => {
      clearTimeout(timer);
      resolve(adapter);
    };
    adapterReadyResolvers.push(wrappedResolve);
  });
}

export async function initAdapter(
  mode: "mock" | "ws",
  deps?: { wsClient: unknown; rpcClient: unknown },
): Promise<GatewayAdapter> {
  if (adapterInstance) return adapterInstance;

  if (mode === "mock") {
    const { MockAdapter } = await import("./mock-adapter");
    adapterInstance = new MockAdapter();
  } else {
    if (!deps) throw new Error("WsAdapter requires wsClient and rpcClient");
    const { WsAdapter } = await import("./ws-adapter");
    const { GatewayWsClient } = await import("./ws-client");
    const { GatewayRpcClient } = await import("./rpc-client");

    if (!(deps.wsClient instanceof GatewayWsClient)) {
      throw new Error("Invalid wsClient");
    }
    if (!(deps.rpcClient instanceof GatewayRpcClient)) {
      throw new Error("Invalid rpcClient");
    }
    adapterInstance = new WsAdapter(deps.wsClient, deps.rpcClient);
  }

  await adapterInstance.connect();

  for (const resolve of adapterReadyResolvers) {
    resolve(adapterInstance);
  }
  adapterReadyResolvers = [];

  return adapterInstance;
}

export function isMockMode(): boolean {
  return import.meta.env.VITE_MOCK === "true";
}
