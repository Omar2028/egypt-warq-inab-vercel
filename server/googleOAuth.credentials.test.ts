import { describe, expect, it } from "vitest";

describe("Google OAuth credentials", () => {
  it("does not receive invalid_client from Google's token endpoint", async () => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    expect(clientId, "GOOGLE_CLIENT_ID must be configured").toBeTruthy();
    expect(clientSecret, "GOOGLE_CLIENT_SECRET must be configured").toBeTruthy();

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        code: "credential-validation-placeholder",
        grant_type: "authorization_code",
        redirect_uri: "https://example.invalid/google-oauth-validation",
      }),
    });
    const payload = await response.json() as { error?: string };

    // A valid confidential client rejects the synthetic code as invalid_grant.
    // invalid_client would indicate a bad or revoked ID/secret pair.
    expect(payload.error).not.toBe("invalid_client");
  }, 20_000);
});
