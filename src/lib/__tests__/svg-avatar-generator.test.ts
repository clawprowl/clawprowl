import { describe, it, expect } from "vitest";
import { generateSvgAvatar, generateAvatar3dColor } from "@/lib/avatar-generator";

describe("generateSvgAvatar", () => {
  it("returns deterministic results for the same agentId", () => {
    const a = generateSvgAvatar("agent-alpha");
    const b = generateSvgAvatar("agent-alpha");
    expect(a).toEqual(b);
  });

  it("generates diverse outputs across 20 agents", () => {
    const ids = Array.from({ length: 20 }, (_, i) => `agent-${i}`);
    const avatars = ids.map((id) => generateSvgAvatar(id));

    const faceShapes = new Set(avatars.map((a) => a.faceShape));
    const hairStyles = new Set(avatars.map((a) => a.hairStyle));

    expect(faceShapes.size).toBeGreaterThanOrEqual(3);
    expect(hairStyles.size).toBeGreaterThanOrEqual(4);
  });

  it("shirtColor matches generateAvatar3dColor", () => {
    const testIds = ["main", "coder", "reviewer", "tester", "agent-x"];
    for (const id of testIds) {
      const avatar = generateSvgAvatar(id);
      const color3d = generateAvatar3dColor(id);
      expect(avatar.shirtColor).toBe(color3d);
    }
  });

  it("all color fields are valid hex strings", () => {
    const avatar = generateSvgAvatar("test-agent");
    const hexPattern = /^#[0-9a-fA-F]{6}$/;
    expect(avatar.skinColor).toMatch(hexPattern);
    expect(avatar.hairColor).toMatch(hexPattern);
    expect(avatar.shirtColor).toMatch(hexPattern);
  });
});
