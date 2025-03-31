
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CandidateFieldsProps {
  linkedinUrl: string;
  setLinkedinUrl: (value: string) => void;
  referralCode?: string;
  setReferralCode?: (value: string) => void;
}

export const CandidateFields = ({ linkedinUrl, setLinkedinUrl, referralCode = "", setReferralCode }: CandidateFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <FormLabel className="flex items-center gap-2">
          LinkedIn URL
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Adding your LinkedIn profile helps employers verify your experience.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </FormLabel>
        <Input
          type="url"
          placeholder="https://linkedin.com/in/yourname"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
        />
        <FormDescription>Optional but recommended</FormDescription>
      </div>
      
      {setReferralCode && (
        <div className="space-y-2">
          <FormLabel className="flex items-center gap-2">
            Referral Code
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">If you were referred by a Virtual Recruiter, please enter their referral code.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <Input
            type="text"
            placeholder="Enter referral code (e.g., REF-ABC12)"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
          />
          <FormDescription>Enter if you were referred by a Virtual Recruiter</FormDescription>
        </div>
      )}
    </>
  );
};
