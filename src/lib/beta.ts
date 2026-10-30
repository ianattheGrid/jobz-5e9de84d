import { z } from "zod";

export const BETA_PREVIEW = true;
export const launchInterestSchema = z.object({
  name: z.string().trim().max(100, "Name must be 100 characters or fewer.").optional(),
  email: z.string().trim().max(255).email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  consent: z.literal(true, { errorMap: () => ({ message: "Please agree to receive the launch email." }) }),
});

export const isBetaAccountPath = (pathname: string) =>
  /^\/(signup|signin|sign-up|sign-in|join(?:\/.*)?|(?:candidate|employer|vr)\/(?:signup|signin))(?:\/)?$/.test(pathname);

export const isBetaPrivatePath = (pathname: string) =>
  /^\/(?:candidate|employer|vr)(?:\/|$)/.test(pathname) && !/\/profile\/preview\/?$/.test(pathname)
  || /^\/(?:webby-candidate|webby-employer|external-jobs|swipe|cv-view|p)(?:\/|$)/.test(pathname);