import { describe, it, expect } from "vitest";
import { SCALE_X_2D_TO_3D, SCALE_Z_2D_TO_3D } from "@/lib/constants";
import { position2dTo3d, allocateMeetingPositions } from "@/lib/position-allocator";

describe("position2dTo3d", () => {
  it("maps 2D SVG coordinates to 3D world coordinates", () => {
    const result = position2dTo3d({ x: 600, y: 350 });
    expect(result[0]).toBeCloseTo(600 * SCALE_X_2D_TO_3D);
    expect(result[1]).toBe(0);
    expect(result[2]).toBeCloseTo(350 * SCALE_Z_2D_TO_3D);
  });

  it("maps origin correctly", () => {
    const result = position2dTo3d({ x: 0, y: 0 });
    expect(result).toEqual([0, 0, 0]);
  });

  it("preserves relative distances", () => {
    const a = position2dTo3d({ x: 100, y: 200 });
    const b = position2dTo3d({ x: 200, y: 400 });
    expect(b[0] - a[0]).toBeCloseTo(100 * SCALE_X_2D_TO_3D);
    expect(b[2] - a[2]).toBeCloseTo(200 * SCALE_Z_2D_TO_3D);
  });
});

describe("allocateMeetingPositions", () => {
  const center = { x: 890, y: 190 };

  it("returns empty array for no agents", () => {
    expect(allocateMeetingPositions([], center)).toEqual([]);
  });

  it("allocates positions for a single agent", () => {
    const positions = allocateMeetingPositions(["a1"], center);
    expect(positions).toHaveLength(1);
  });

  it("allocates equi-angular positions for multiple agents", () => {
    const ids = ["a1", "a2", "a3", "a4"];
    const positions = allocateMeetingPositions(ids, center);
    expect(positions).toHaveLength(4);

    // Verify all positions are distinct and spread around center
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[i].x - positions[j].x;
        const dy = positions[i].y - positions[j].y;
        expect(Math.sqrt(dx * dx + dy * dy)).toBeGreaterThan(10);
      }
    }

    // Verify seats are around the center (in 3D world space, circle is uniform)
    for (const p of positions) {
      const dx3d = (p.x - center.x) * SCALE_X_2D_TO_3D;
      const dz3d = (p.y - center.y) * SCALE_Z_2D_TO_3D;
      const dist3d = Math.sqrt(dx3d * dx3d + dz3d * dz3d);
      expect(dist3d).toBeCloseTo(1.7, 0);
    }
  });

  it("avoids position collisions between seats", () => {
    const ids = ["a1", "a2", "a3"];
    const positions = allocateMeetingPositions(ids, center);

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[i].x - positions[j].x;
        const dy = positions[i].y - positions[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        expect(dist).toBeGreaterThan(10);
      }
    }
  });
});
