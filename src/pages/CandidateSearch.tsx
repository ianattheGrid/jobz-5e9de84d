import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Job description must be at least 10 characters.",
  }),
  salary: z.string().min(1, {
    message: "Salary is required",
  }),
  type: z.string().min(1, {
    message: "Job type is required",
  }),
  offerCandidateCommission: z.boolean().default(false),
  candidateCommission: z.string().optional(),
  offerReferralCommission: z.boolean().default(false),
  referralCommission: z.string().optional(),
});

export default function CandidateSearch() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      offerCandidateCommission: false,
      offerReferralCommission: false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Transform the data to include commission values only if they're enabled
    const jobData = {
      ...values,
      candidateCommission: values.offerCandidateCommission ? values.candidateCommission : undefined,
      referralCommission: values.offerReferralCommission ? values.referralCommission : undefined,
    };

    console.log(jobData);
    toast({
      title: "Job Posted Successfully",
      description: "Your job listing has been created.",
    });
  };

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Post a New Job</h1>
          <p className="text-muted-foreground">Create a new job listing for candidates</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Senior React Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. San Francisco, CA or Remote" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Full-time, Contract, Part-time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary Range</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. $100,000 - $130,000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the role, requirements, and benefits..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="offerCandidateCommission"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Offer Candidate Commission
                        </FormLabel>
                        <FormDescription>
                          Offer a signing bonus to successful candidates
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("offerCandidateCommission") && (
                  <FormField
                    control={form.control}
                    name="candidateCommission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Candidate Commission Amount</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. $5,000 signing bonus" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="offerReferralCommission"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Offer Referral Commission
                        </FormLabel>
                        <FormDescription>
                          Offer a bonus for successful referrals
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("offerReferralCommission") && (
                  <FormField
                    control={form.control}
                    name="referralCommission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referral Commission Amount</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. $2,500 for successful referrals" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <Button type="submit">Post Job</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}