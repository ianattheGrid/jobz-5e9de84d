
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
    <Tabs defaultValue="scheduled" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="scheduled">Scheduled Interviews</TabsTrigger>
        <TabsTrigger value="proposals">Interview Offers</TabsTrigger>
      </TabsList>

      <TabsContent value="scheduled" className="mt-2">
        {interviews?.length > 0 ? (
          <InterviewsTable interviews={interviews} />
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-600">No interviews scheduled yet.</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="proposals" className="mt-2">
        {slots?.length > 0 ? (
          <InterviewSlots slots={slots} />
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-600">No interview offers yet.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default InterviewsTabs;
