import { describe, expect, it } from "vitest";
import { isBetaAccountPath, isBetaPrivatePath, launchInterestSchema } from "./beta";

describe("beta access rules", () => {
  it("blocks all public signup and signin entrypoints", () => {
    for (const path of ["/signup", "/candidate/signup", "/employer/signup", "/vr/signup", "/candidate/signin", "/employer/signin", "/vr/signin", "/join/invite"]) expect(isBetaAccountPath(path)).toBe(true);
    expect(isBetaAccountPath("/admin/signin")).toBe(false);
  });
  it("preserves public demos but blocks personal profiles", () => {
    for (const path of ["/", "/jobs", "/demo/candidate", "/preview/candidate-demo", "/candidate/profile/preview"]) expect(isBetaPrivatePath(path)).toBe(false);
    for (const path of ["/candidate/dashboard", "/employer/candidate/123", "/vr/settings", "/p/private-person", "/cv-view"]) expect(isBetaPrivatePath(path)).toBe(true);
  });
});
describe("launch interest validation", () => {
  it("requires a valid email", () => { expect(launchInterestSchema.safeParse({ email: "invalid", consent: true }).success).toBe(false); });
  it("requires explicit email consent", () => { expect(launchInterestSchema.safeParse({ email: "person@example.com", consent: false }).success).toBe(false); });
  it("allows no name and normalises duplicate emails", () => { expect(launchInterestSchema.parse({ email: " PERSON@Example.com ", consent: true })).toEqual({ email: "person@example.com", consent: true }); });
});