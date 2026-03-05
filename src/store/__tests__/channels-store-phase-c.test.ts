import { describe, it, expect, beforeEach } from "vitest";
import { initAdapter } from "@/gateway/adapter-provider";
import { useChannelsStore } from "../console-stores/channels-store";

describe("Channels Store - Phase C", () => {
  beforeEach(async () => {
    await initAdapter("mock");
    useChannelsStore.setState({
      channels: [],
      isLoading: false,
      error: null,
      selectedChannel: null,
      configDialogOpen: false,
      configDialogChannelType: null,
      qrState: "idle",
      qrDataUrl: null,
      qrError: null,
    });
  });

  it("fetchChannels() loads channels with extended fields", async () => {
    await useChannelsStore.getState().fetchChannels();
    const s = useChannelsStore.getState();
    expect(s.channels.length).toBeGreaterThanOrEqual(4);
    expect(s.channels.some((c) => c.status === "error")).toBe(true);
    for (const ch of s.channels) {
      expect(typeof ch.configured).toBe("boolean");
    }
  });

  it("logoutChannel() calls adapter and refreshes", async () => {
    await useChannelsStore.getState().fetchChannels();
    const before = useChannelsStore.getState().channels.length;
    await useChannelsStore.getState().logoutChannel("telegram");
    expect(useChannelsStore.getState().channels.length).toBe(before);
    expect(useChannelsStore.getState().error).toBeNull();
  });

  it("openConfigDialog() sets dialog state", () => {
    useChannelsStore.getState().openConfigDialog("telegram");
    const s = useChannelsStore.getState();
    expect(s.configDialogOpen).toBe(true);
    expect(s.configDialogChannelType).toBe("telegram");
  });

  it("closeConfigDialog() resets dialog state", () => {
    useChannelsStore.getState().openConfigDialog("discord");
    useChannelsStore.getState().closeConfigDialog();
    const s = useChannelsStore.getState();
    expect(s.configDialogOpen).toBe(false);
    expect(s.configDialogChannelType).toBeNull();
    expect(s.qrState).toBe("idle");
  });

  it("QR pairing flow reaches success", async () => {
    useChannelsStore.getState().openConfigDialog("whatsapp");
    await useChannelsStore.getState().startQrPairing();
    const s = useChannelsStore.getState();
    expect(s.qrState).toBe("success");
  });

  it("cancelQrPairing resets QR state", () => {
    useChannelsStore.setState({ qrState: "qr", qrDataUrl: "data:image/png;base64,..." });
    useChannelsStore.getState().cancelQrPairing();
    const s = useChannelsStore.getState();
    expect(s.qrState).toBe("idle");
    expect(s.qrDataUrl).toBeNull();
  });
});
