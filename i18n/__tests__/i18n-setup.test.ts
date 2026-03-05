import { describe, it, expect } from "vitest";
import i18n, { supportedLngs, namespaces } from "../index";

describe("i18n setup", () => {
  it("supports English only", () => {
    expect(supportedLngs).toContain("en");
    expect(supportedLngs).not.toContain("zh");
  });

  it("has English resource bundles for all namespaces", () => {
    for (const ns of namespaces) {
      expect(i18n.hasResourceBundle("en", ns)).toBe(true);
    }
  });

  it("falls back to English", () => {
    expect(i18n.options.fallbackLng).toBe("en");
  });
});
