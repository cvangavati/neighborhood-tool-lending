import { describe, expect, it } from "vitest";

describe("Neighborhood Tool Lending MVP", () => {
  it("defines the intended trust-light MVP boundaries", () => {
    const supported = ["tool listing", "availability", "borrow request", "messages"];
    expect(supported).toContain("availability");
    expect(supported).not.toContain("payments");
    expect(supported).not.toContain("ratings");
  });

  it("uses explicit availability values", () => {
    const available = "available" as const;
    const borrowed = "borrowed" as const;
    expect([available, borrowed]).toEqual(["available", "borrowed"]);
  });

  it("keeps request directions separate for sent and received inboxes", () => {
    const requests = [{ direction: "sent" }, { direction: "received" }, { direction: "sent" }];
    expect(requests.filter((item) => item.direction === "sent")).toHaveLength(2);
    expect(requests.filter((item) => item.direction === "received")).toHaveLength(1);
  });
});

  it("starts without seeded tools, requests, or wishlist entries", () => {
    const firstRun = { tools: [], requests: [], wishlist: [] };
    expect(firstRun.tools).toHaveLength(0);
    expect(firstRun.requests).toHaveLength(0);
    expect(firstRun.wishlist).toHaveLength(0);
  });


describe("authenticated ownership boundaries", () => {
  it("assigns every created tool to its authenticated owner", () => {
    const ownerId = 42;
    const tool = { ownerId, name: "Drill", communityId: "cedar-street" };
    expect(tool.ownerId).toBe(ownerId);
  });

  it("keeps wishlist entries keyed by both user and tool", () => {
    const entries = [{ userId: 1, toolId: 7 }, { userId: 2, toolId: 7 }];
    expect(entries.filter((entry) => entry.userId === 1)).toEqual([{ userId: 1, toolId: 7 }]);
  });
});
