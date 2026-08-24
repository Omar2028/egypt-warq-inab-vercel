import { describe, expect, it } from "vitest";

describe("Google OAuth redirect configuration", () => {
  it("uses the published Manus callback URL", () => {
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;
    expect(redirectUri).toBe("https://delishgrape-virjwpuy.manus.space/api/admin/google/callback");
  });
});
