import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { LanguageSwitcher } from "../LanguageSwitcher";

describe("LanguageSwitcher", () => {
  it("renders nothing (single language mode)", () => {
    const { container } = render(<LanguageSwitcher />);
    expect(container.firstChild).toBeNull();
  });
});
