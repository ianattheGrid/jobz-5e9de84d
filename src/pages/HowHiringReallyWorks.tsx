import { useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HIRING_MODELS } from "@/data/hiringModels";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";

const FAQ_ITEMS = [
  {
    question: "What does a recruitment agency cost an employer?",
    answer:
      "A placement fee of typically 15–25% of the first-year salary. On a £45,000 role that is roughly £6,750–£11,250 for a single hire.",
  },
  {
    question: "What do AI recruiting agents charge?",
    answer:
      "They are usually positioned at about half an agency fee — commonly described as around 10% of first-year salary, paid per hire. On a £45,000 role that is about £4,500.",
  },
  {
    question: "Do AI auto-apply tools help you get hired?",
    answer:
      "They increase volume, not quality. The candidate pays a monthly subscription and the tool sends large numbers of AI-generated applications, which employers increasingly filter out because they all look the same.",
  },
  {
    question: "What does Jobz cost?",
    answer:
      "£9 flat to the employer. There is no percentage of salary, no per-hire fee and no charge to candidates.",
  },
];

const HowHiringReallyWorks = () => {
  useEffect(() => {
    document.title = "How Hiring Really Works: Agency, AI and Auto-Apply Fees | Jobz";
    const desc = document.querySelector('meta[name="description"]');
    const previous = desc?.getAttribute("content") ?? null;
    desc?.setAttribute(
      "content",
      "What recruitment agencies, job boards, AI recruiting agents and AI auto-apply tools really cost candidates and employers — and why Jobz charges £9 flat."
    );
    return () => {
      if (previous !== null) desc?.setAttribute("content", previous);
    };
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl space-y-14">
          <header className="space-y-4">
            <h1 className={`text-4xl md:text-5xl font-bold leading-tight ${PRIMARY_COLOR_PATTERN}`}>
              How hiring really works
            </h1>
            <p className="text-lg text-foreground">
              Every hiring middleman takes something. Agencies and job boards take money
              from employers. The newer AI platforms take a percentage of your salary, or
              take a subscription from you and spray your CV across the internet. Here is
              the whole picture, plainly.
            </p>
          </header>

          {/* Models */}
          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              The five models, side by side
            </h2>
            <div className="grid gap-4">
              {HIRING_MODELS.map((model) => (
                <Card
                  key={model.id}
                  className={`p-6 space-y-3 ${model.highlight ? "border-primary bg-primary/10" : ""}`}
                >
                  <h3 className="text-xl font-bold text-foreground">{model.name}</h3>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Who pays: </span>
                      {model.whoPays}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">How much: </span>
                      {model.howMuch}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Your CV: </span>
                      {model.whatHappensToYourCv}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">The catch: </span>
                      {model.theCatch}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Pricing described as publicly stated by each type of platform at the time of
              writing. Figures describe the charging model rather than a quote from any one
              provider.
            </p>
          </section>

          {/* Candidates */}
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              If you are looking for a job
            </h2>
            <p className="text-foreground">
              <strong>200 auto-sent applications do not beat five good ones.</strong> Tools
              that apply for you charge a monthly fee and measure success in volume. But
              employers on the other end are receiving dozens of near-identical,
              AI-written applications for the same role. The predictable response is to
              filter harder — which means the generated applications get binned first, and
              real applicants sitting in the same pile get binned with them. You also lose
              control: if you did not read what was sent in your name, you cannot defend it
              in an interview.
            </p>
            <p className="text-foreground">
              <strong>A commission changes who gets shown.</strong> When an AI agent earns
              roughly 10% of your first-year salary for a placement, the roles it pushes you
              towards are the roles that pay it. That may line up with what you want. It may
              not. Either way, that money comes out of the same budget as your salary — and
              a smaller employer that cannot afford the fee never gets to meet you at all.
            </p>
            <p className="text-foreground">
              On Jobz you apply yourself. Our AI reads the vacancy and helps you tailor your
              CV, spot honest gaps and draft a cover letter you can edit — then you decide
              whether to send it. Nothing goes out automatically, and you are anonymous
              until you choose otherwise.
            </p>
          </section>

          {/* Employers */}
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              If you are hiring
            </h2>
            <p className="text-foreground">
              <strong>AI-blasted volume makes hiring harder, not easier.</strong> Auto-apply
              subscriptions have pushed application counts up while signal has gone down.
              More CVs, more of them generated, fewer of them from people who actually want
              your specific role. Screening cost rises and good candidates are lost in the
              noise.
            </p>
            <p className="text-foreground">
              <strong>Do the maths on a percentage.</strong> On a £45,000 hire an agency at
              20% costs about £9,000. An AI agent at around 10% costs about £4,500. A
              recruiter licence costs thousands a year before you have hired anyone. Jobz
              costs £9. That difference is not a discount — it is the difference between
              being able to hire and putting the hire off for another quarter.
            </p>
            <p className="text-foreground">
              Jobz matches on the criteria you set, shows candidates who have chosen to be
              visible for roles like yours, and lets you offer a "You're Hired" bonus that
              goes to the candidate and whoever referred them, instead of to a middleman.
            </p>
          </section>

          {/* FAQ */}
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Common questions
            </h2>
            <div className="grid gap-4">
              {FAQ_ITEMS.map((item) => (
                <Card key={item.question} className="p-5 space-y-2">
                  <h3 className="font-semibold text-foreground">{item.question}</h3>
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </Card>
              ))}
            </div>
          </section>

          <section className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/candidate/signup">Create a candidate profile</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/employer/signup">Post a role for £9</Link>
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HowHiringReallyWorks;
