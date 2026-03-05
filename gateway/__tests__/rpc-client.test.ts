import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GatewayRpcClient, RpcError } from "@/gateway/rpc-client";
import type { GatewayResponseFrame } from "@/gateway/types";
import { GatewayWsClient } from "@/gateway/ws-client";

describe("GatewayRpcClient", () => {
  let wsClient: GatewayWsClient;
  let rpc: GatewayRpcClient;

  beforeEach(() => {
    vi.useFakeTimers();
    wsClient = new GatewayWsClient();
    rpc = new GatewayRpcClient(wsClient);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("rejects with NOT_CONNECTED when not connected", async () => {
    await expect(rpc.request("test")).rejects.toThrow("not connected");
  });

  it("rejects with TIMEOUT after timeout", async () => {
    vi.spyOn(wsClient, "isConnected").mockReturnValue(true);
    vi.spyOn(wsClient, "send").mockImplementation(() => {});
    vi.spyOn(wsClient, "onResponse").mockImplementation(() => {});

    const promise = rpc.request("slow.method", {}, 5000);
    vi.advanceTimersByTime(5001);

    await expect(promise).rejects.toThrow("timed out");
  });

  it("resolves with payload on success", async () => {
    vi.spyOn(wsClient, "isConnected").mockReturnValue(true);
    vi.spyOn(wsClient, "send").mockImplementation(() => {});

    let storedHandler: ((frame: GatewayResponseFrame) => void) | null = null;
    vi.spyOn(wsClient, "onResponse").mockImplementation((_id, handler) => {
      storedHandler = handler;
    });

    const promise = rpc.request("agents.list");

    storedHandler!({
      type: "res",
      id: "test",
      ok: true,
      payload: { agents: [] },
    });

    const result = await promise;
    expect(result).toEqual({ agents: [] });
  });

  it("rejects with RpcError on error response", async () => {
    vi.spyOn(wsClient, "isConnected").mockReturnValue(true);
    vi.spyOn(wsClient, "send").mockImplementation(() => {});

    let storedHandler: ((frame: GatewayResponseFrame) => void) | null = null;
    vi.spyOn(wsClient, "onResponse").mockImplementation((_id, handler) => {
      storedHandler = handler;
    });

    const promise = rpc.request("bad.method");

    storedHandler!({
      type: "res",
      id: "test",
      ok: false,
      error: { code: "INVALID", message: "bad request" },
    });

    await expect(promise).rejects.toBeInstanceOf(RpcError);
    await expect(promise).rejects.toThrow("bad request");
  });
});
