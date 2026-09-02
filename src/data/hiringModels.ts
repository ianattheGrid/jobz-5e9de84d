export interface HiringModel {
  id: string;
  name: string;
  whoPays: string;
  howMuch: string;
  whatHappensToYourCv: string;
  theCatch: string;
  highlight?: boolean;
}

/**
 * Pricing and behaviour described here reflect each model as publicly
 * described at the time of writing. They describe the model, not a quote.
 */
export const HIRING_MODELS: HiringModel[] = [
  {
    id: "agencies",
    name: "Recruitment agencies",
    whoPays: "Employer",
    howMuch: "Typically 15–25% of first-year salary, per hire",
    whatHappensToYourCv:
      "Held by the agency and pitched to whichever client pays them best",
    theCatch:
      "The fee is so large that many small employers simply never start the hire — so you never see the role.",
  },
  {
    id: "boards",
    name: "Job boards & recruiter licences",
    whoPays: "Employer",
    howMuch: "Often £5,000–£10,000+ a year just for the right to search",
    whatHappensToYourCv:
      "Sits in a database where visibility follows whoever paid for reach",
    theCatch:
      "You are competing inside a paid-visibility system, not on whether you can do the job.",
  },
  {
    id: "ai-agents",
    name: "AI recruiting agents",
    whoPays: "Employer",
    howMuch:
      "A per-hire fee, positioned at roughly half an agency's — commonly described as around 10% of first-year salary",
    whatHappensToYourCv:
      "Fed to an agent that decides which candidates get put in front of an employer",
    theCatch:
      "Cheaper than an agency, but it is still a percentage of your salary leaving the room — and a commission-earning agent chooses who gets shown.",
  },
  {
    id: "auto-apply",
    name: "AI auto-apply tools",
    whoPays: "Candidate (subscription)",
    howMuch: "Usually £15–£50 a month, paid by the job seeker",
    whatHappensToYourCv:
      "Rewritten by AI and fired at hundreds of roles, often without you reading what was sent",
    theCatch:
      "Employers get flooded with near-identical generated CVs, so genuine applicants get buried — including the person who paid for the tool.",
  },
  {
    id: "jobz",
    name: "Jobz",
    whoPays: "Employer",
    howMuch: "£9 flat. No per-hire cut, no percentage of your salary",
    whatHappensToYourCv:
      "Stays yours. Anonymous until you choose to be seen, and never auto-submitted",
    theCatch:
      "You apply yourself. Our AI helps you tailor and improve an application — it never sends one on your behalf.",
    highlight: true,
  },
];
