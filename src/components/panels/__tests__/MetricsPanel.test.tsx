import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MetricsPanel } from "@/components/panels/MetricsPanel";
import { useOfficeStore } from "@/store/office-store";

describe("MetricsPanel", () => {
  beforeEach(() => {
    useOfficeStore.setState({
      globalMetrics: {
        activeAgents: 3,
        totalAgents: 8,
        totalTokens: 87200,
        tokenRate: 42,
        collaborationHeat: 65,
      },
    });
  });

  it("displays active agents ratio", () => {
    render(<MetricsPanel />);
    expect(screen.getByText("3/8")).toBeInTheDocument();
  });

  it("displays formatted token count", () => {
    render(<MetricsPanel />);
    expect(screen.getByText("87.2k")).toBeInTheDocument();
  });

  it("displays collaboration heat", () => {
    render(<MetricsPanel />);
    expect(screen.getByText("65%")).toBeInTheDocument();
  });

  it("displays token rate", () => {
    render(<MetricsPanel />);
    expect(screen.getByText("42/min")).toBeInTheDocument();
  });
});
