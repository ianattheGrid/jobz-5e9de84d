
import { useState } from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Users, Briefcase, UserPlus } from "lucide-react";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";

export const FAQSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <HelpCircle className="h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className={`text-3xl font-bold mb-4 ${PRIMARY_COLOR_PATTERN}`}>
              Frequently Asked Questions
            </h2>
            <p className="text-foreground">
              Find answers to the most common questions about jobz
            </p>
          </div>

          <Tabs defaultValue="employers" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-lg overflow-hidden mb-8">
              <TabsTrigger 
                value="employers" 
                className="tab-trigger py-3"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Employers
              </TabsTrigger>
              <TabsTrigger 
                value="candidates"
                className="tab-trigger py-3"
              >
                <Users className="mr-2 h-4 w-4" />
                Candidates
              </TabsTrigger>
              <TabsTrigger 
                value="recruiters"
                className="tab-trigger py-3"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Virtual Recruiters
              </TabsTrigger>
            </TabsList>

            <TabsContent value="employers" className="mt-2">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">
                    How does the employer subscription work?
                  </AccordionTrigger>
                  <AccordionContent>
                    Content will be added soon.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
                    What is the 'You're Hired' bonus?
                  </AccordionTrigger>
                  <AccordionContent>
                    Content will be added soon.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
                    How do virtual recruiters help with my hiring?
                  </AccordionTrigger>
                  <AccordionContent>
                    Content will be added soon.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="candidates" className="mt-2">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">
                    How do I claim my bonus when I get hired?
                  </AccordionTrigger>
                  <AccordionContent>
                    Content will be added soon.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
                    Can I refer my friends to jobs?
                  </AccordionTrigger>
                  <AccordionContent>
                    Content will be added soon.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
                    How does the job matching process work?
                  </AccordionTrigger>
                  <AccordionContent>
                    Content will be added soon.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="recruiters" className="mt-2">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">
                    How do I become a virtual recruiter?
                  </AccordionTrigger>
                  <AccordionContent>
                    Content will be added soon.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
                    How much can I earn as a virtual recruiter?
                  </AccordionTrigger>
                  <AccordionContent>
                    Content will be added soon.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
                    What skills do I need to be successful?
                  </AccordionTrigger>
                  <AccordionContent>
                    Content will be added soon.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

