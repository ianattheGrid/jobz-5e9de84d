import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsOfUseProps {
  agreed: boolean;
  onAgreeChange: (agreed: boolean) => void;
}

export const TermsOfUse = ({ agreed, onAgreeChange }: TermsOfUseProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-start space-x-2">
      <Checkbox
        id="terms"
        checked={agreed}
        onCheckedChange={(checked) => onAgreeChange(checked === true)}
      />
      <div className="space-y-1 leading-none">
        <Label
          htmlFor="terms"
          className="text-sm font-normal text-white cursor-pointer"
        >
          I agree to the{" "}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="text-primary [&]:!text-primary hover:underline font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(true);
                }}
              >
                Terms of Use
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="text-2xl">Jobz — Terms of Use</DialogTitle>
                <DialogDescription>
                  Please read these Terms of Use carefully
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-4 text-sm">
                  <p className="font-medium">
                    By creating an account or using Jobz, you agree to these terms.
                  </p>

                  <div>
                    <h3 className="font-semibold text-base mb-2">Who we are and what we do</h3>
                    <p className="text-muted-foreground">
                      Jobz is a platform that connects Employers with Candidates, facilitated by Connectors. We provide tools for job posting, profile creation, and communication.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      We are a connection platform, not an employment agency, recruiter, employer, or guarantor of employment.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      We do not arrange, control, supervise, or guarantee any employment outcomes. Any employment relationship is strictly between the Employer and Candidate.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">Your relationship with Jobz</h3>
                    <p className="text-muted-foreground">
                      Jobz provides a listing, discovery, and communication service only ("the Service").
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Jobz does not employ Candidates or Connectors.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Jobz does not process payments for salaries, commissions, or placement fees.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Any agreements, payments, or arrangements are strictly between users.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">Eligibility and accounts</h3>
                    <p className="text-muted-foreground">
                      You must be at least 18 years old and capable of entering a binding contract.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      You agree to provide accurate information and keep your account secure.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      One person, one account. You are responsible for all activity under your account.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">User roles and responsibilities</h3>
                    
                    <h4 className="font-medium mt-3 mb-1">Employers:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>You are solely responsible for your job postings, hiring decisions, and compliance with all employment laws (including fair hiring practices, wages, and working conditions).</li>
                      <li>You are responsible for any payments to Candidates (salaries) or Connectors (placement fees/commissions) as per your direct agreements. Jobz does not facilitate or guarantee these payments.</li>
                      <li>You agree to treat all Candidates and Connectors fairly and respectfully.</li>
                    </ul>

                    <h4 className="font-medium mt-3 mb-1">Candidates:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>You are responsible for the accuracy of your profile and application materials.</li>
                      <li>You are responsible for assessing job opportunities and employers.</li>
                      <li>You are responsible for your conduct during the application and interview process.</li>
                    </ul>

                    <h4 className="font-medium mt-3 mb-1">Connectors:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>You are responsible for the accuracy of information you provide about Candidates and for your interactions with both Employers and Candidates.</li>
                      <li>You are responsible for any agreements and payments (e.g., commissions) directly with Employers. Jobz does not facilitate or guarantee these payments.</li>
                      <li>You must comply with all applicable laws regarding recruitment and referrals.</li>
                    </ul>

                    <h4 className="font-medium mt-3 mb-1">All Users:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Treat others with respect. No abusive, discriminatory, or unlawful behaviour.</li>
                      <li>Comply with all laws and local regulations while using the Service.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">Payments are between users</h3>
                    <p className="text-muted-foreground">
                      Jobz does not process payments, handle money, provide escrow, or guarantee payments for salaries, commissions, or placement fees.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Employers, Candidates, and Connectors are solely responsible for agreeing upon and executing any payments directly between themselves.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Any disputes over payment are between the relevant users.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">Profiles and content</h3>
                    <p className="text-muted-foreground">
                      You are responsible for the accuracy and legality of your profile information, job postings, and any content you submit.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Jobz may remove content or suspend accounts for violations of these terms or for safety/integrity reasons.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">No monitoring; no guarantees</h3>
                    <p className="text-muted-foreground mb-2">
                      Jobz does not monitor user interactions or employment outcomes. We do not guarantee:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>the existence, quality, safety, or legality of any job posting or candidate;</li>
                      <li>the truth or accuracy of user content or profiles;</li>
                      <li>that any job will be filled, or that any user will be hired or paid.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">Disclaimers</h3>
                    <p className="text-muted-foreground">
                      To the maximum extent permitted by law, the Service is provided "as is" and "as available."
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Jobz disclaims all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">Limitation of liability</h3>
                    <p className="text-muted-foreground mb-2">
                      To the maximum extent permitted by law, Jobz and its affiliates will not be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages, or loss of profits, data, goodwill, or reputation, arising from or related to:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>your access to or use of, or inability to use, the Service;</li>
                      <li>any hiring decisions, employment relationships, or interactions between users;</li>
                      <li>any payments made between users.</li>
                    </ul>
                    <p className="text-muted-foreground mt-2">
                      In all cases, Jobz's total liability shall not exceed the greater of: (a) £50; or (b) the total fees paid by you to Jobz in the 3 months preceding the event giving rise to liability (if any).
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">Indemnity</h3>
                    <p className="text-muted-foreground">
                      You agree to indemnify and hold harmless Jobz and its affiliates, officers, employees, and agents from any claims, liabilities, damages, losses, and expenses (including legal fees) arising out of or related to your use of the Service, your content, your conduct, or your breach of these terms or applicable law.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">Privacy</h3>
                    <p className="text-muted-foreground">
                      Our Privacy Policy explains how we collect and use personal data. By using the Service, you consent to our data practices as described there.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">Termination and suspension</h3>
                    <p className="text-muted-foreground">
                      We may suspend or terminate your access if we believe you have violated these terms, posed a risk, or harmed other users or Jobz.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      You may stop using Jobz at any time. Employer subscriptions will continue until cancelled per your billing settings.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">Changes to the Service and Terms</h3>
                    <p className="text-muted-foreground">
                      We may modify the Service or these terms. If we make material changes, we will provide notice (e.g., in-app or email). Continued use after changes means you accept the updated terms.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">Governing law and disputes</h3>
                    <p className="text-muted-foreground">
                      These terms are governed by the laws of England and Wales. Courts of England and Wales shall have exclusive jurisdiction, unless mandatory local law states otherwise for consumers.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">Contact</h3>
                    <p className="text-muted-foreground">
                      For questions about these terms, please use the in-app help or support channels.
                    </p>
                  </div>

                  <div className="border-t pt-4 mt-6">
                    <h3 className="font-semibold text-base mb-2">Acceptance</h3>
                    <p className="text-muted-foreground mb-2">
                      By ticking "I agree" and using Jobz, you acknowledge that:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Jobz is a connection platform, not an employer, recruiter, or payment processor;</li>
                      <li>you are responsible for your own conduct, compliance with laws, and any direct agreements/payments with other users;</li>
                      <li>you accept these Terms of Use and our Privacy Policy.</li>
                    </ul>
                  </div>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </Label>
      </div>
    </div>
  );
};
