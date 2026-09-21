/**
 * Remembers where somebody came from so we can tell, later, which of our
 * growth efforts actually brought people in. No personal data is stored.
 */
const KEY = "jobz_signup_source";
const DETAIL_KEY = "jobz_signup_source_detail";
const INVITE_KEY = "jobz_invite_code";

export type SignupSource =
  | "invite_link"
  | "cv_review"
  | "salary_tool"
  | "employer_email"
  | "shared_profile"
  | "claimed_advert"
  | "direct";

/** Call this on a public tool or landing page to note how somebody arrived. */
export const rememberSource = (source: SignupSource, detail?: string) => {
  try {
    // An invite link is the strongest signal — never overwrite it.
    if (localStorage.getItem(KEY) === "invite_link") return;
    localStorage.setItem(KEY, source);
    if (detail) localStorage.setItem(DETAIL_KEY, detail);
  } catch {
    /* storage blocked — we simply lose the attribution */
  }
};

/** Works out the best available source at the moment somebody registers. */
export const readSource = (): { signup_source: SignupSource; signup_source_detail: string | null } => {
  try {
    if (localStorage.getItem(INVITE_KEY)) {
      return { signup_source: "invite_link", signup_source_detail: localStorage.getItem(INVITE_KEY) };
    }

    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    if (from) return { signup_source: from as SignupSource, signup_source_detail: params.get("ref") };

    const stored = localStorage.getItem(KEY) as SignupSource | null;
    if (stored) return { signup_source: stored, signup_source_detail: localStorage.getItem(DETAIL_KEY) };

    const referrer = document.referrer;
    if (referrer && !referrer.includes(window.location.host)) {
      return { signup_source: "direct", signup_source_detail: new URL(referrer).hostname };
    }
  } catch {
    /* fall through */
  }

  return { signup_source: "direct", signup_source_detail: null };
};

export const clearSource = () => {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(DETAIL_KEY);
  } catch {
    /* ignore */
  }
};

export const SOURCE_LABELS: Record<string, string> = {
  invite_link: "Invite link",
  cv_review: "Free CV review",
  salary_tool: "Salary check",
  employer_email: "Our email to them",
  shared_profile: "A shared profile",
  claimed_advert: "Claimed their own advert",
  direct: "Came straight to the site",
};
