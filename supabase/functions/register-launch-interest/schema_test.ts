import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { registrationSchema } from "./schema.ts";

Deno.test("launch email requires consent", () => {
  assertEquals(registrationSchema.safeParse({ email: "qa@example.com", consent: false }).success, false);
});
Deno.test("launch email must be valid", () => {
  assertEquals(registrationSchema.safeParse({ email: "invalid", consent: true }).success, false);
});
Deno.test("app identity cannot be supplied by a visitor", () => {
  assertEquals(registrationSchema.safeParse({ email: "qa@example.com", consent: true, app_name: "other" }).success, false);
});
Deno.test("case variants are the same registration email", () => {
  assertEquals(registrationSchema.parse({ email: " QA@Example.com ", consent: true }).email, "qa@example.com");
});