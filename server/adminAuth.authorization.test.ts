import { describe, expect, it } from "vitest";
import { isAuthorizedAdminEmail } from "./adminAuth";

describe("Google admin allowlist", () => {
  it("accepts only the configured administrator email", () => {
    expect(isAuthorizedAdminEmail("owner@example.com", "OWNER@example.com")).toBe(true);
    expect(isAuthorizedAdminEmail("other@example.com", "owner@example.com")).toBe(false);
  });
});
