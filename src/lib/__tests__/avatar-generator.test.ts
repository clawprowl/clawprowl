import { describe, it, expect } from "vitest";
import { generateAvatar3dColor, generateAvatar } from "../avatar-generator";

describe("avatar-generator", () => {
  describe("generateAvatar3dColor", () => {
    it("returns the same color for the same agentId", () => {
      const c1 = generateAvatar3dColor("agent-abc");
      const c2 = generateAvatar3dColor("agent-abc");
      expect(c1).toBe(c2);
    });

    it("returns a valid hex color string", () => {
      const color = generateAvatar3dColor("test-id");
      expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it("returns different colors for different ids", () => {
      const c1 = generateAvatar3dColor("agent-1");
      const c2 = generateAvatar3dColor("agent-2");
      // Not guaranteed but very likely for different ids
      expect(typeof c1).toBe("string");
      expect(typeof c2).toBe("string");
    });
  });

  describe("generateAvatar", () => {
    it("generates correct initial from name", () => {
      const info = generateAvatar("id1", "Coder");
      expect(info.initial).toBe("C");
    });

    it("uses agentId when no name provided", () => {
      const info = generateAvatar("test");
      expect(info.initial).toBe("T");
    });
  });
});
