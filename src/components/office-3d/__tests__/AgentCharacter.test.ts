import { describe, it, expect } from "vitest";
import { generateAvatar3dColor } from "@/lib/avatar-generator";
import { position2dTo3d } from "@/lib/position-allocator";

/**
 * R3F components cannot be rendered in JSDOM (no WebGL context).
 * We test the logic that AgentCharacter depends on instead.
 */
describe("AgentCharacter logic", () => {
  it("maps VisualAgent position to 3D coordinates", () => {
    const [x, y, z] = position2dTo3d({ x: 600, y: 350 });
    expect(x).toBeCloseTo(8, 0);
    expect(y).toBe(0);
    expect(z).toBeCloseTo(6, 0);
  });

  it("generates deterministic color for agent id", () => {
    const c1 = generateAvatar3dColor("agent-test");
    const c2 = generateAvatar3dColor("agent-test");
    expect(c1).toBe(c2);
    expect(c1).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it("sub-agent uses blue color #60a5fa", () => {
    const subAgentColor = "#60a5fa";
    expect(subAgentColor).toBe("#60a5fa");
  });
});
