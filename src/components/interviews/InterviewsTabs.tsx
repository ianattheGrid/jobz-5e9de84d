
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InterviewsTable from "./InterviewsTable";
import InterviewSlots from "./InterviewSlots";

interface InterviewsTabsProps {
  interviews: any[];
  slots: any[];
}

const InterviewsTabs = ({ interviews, slots }: InterviewsTabsProps) => {
  return (
    <Tabs defaultValue="scheduled">
      <TabsList>
        <TabsTrigger value="scheduled">Scheduled Interviews</TabsTrigger>
        <TabsTrigger value="proposals">Interview Proposals</TabsTrigger>
      </TabsList>

      <TabsContent value="scheduled">
        {interviews && interviews.length > 0 ? (
          <InterviewsTable interviews={interviews} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No interviews scheduled yet.</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="proposals">
        {slots && slots.length > 0 ? (
          <InterviewSlots slots={slots} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No interview proposals yet.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default InterviewsTabs;
