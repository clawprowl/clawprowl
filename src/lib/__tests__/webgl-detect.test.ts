import { describe, it, expect, vi, afterEach } from "vitest";
import { isWebGLAvailable } from "../webgl-detect";

describe("isWebGLAvailable", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns false when getContext returns null", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    expect(isWebGLAvailable()).toBe(false);
  });

  it("returns false when getContext throws", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => {
      throw new Error("no webgl");
    });
    expect(isWebGLAvailable()).toBe(false);
  });

  it("returns true when getContext returns a context", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({} as never);
    expect(isWebGLAvailable()).toBe(true);
  });
});
