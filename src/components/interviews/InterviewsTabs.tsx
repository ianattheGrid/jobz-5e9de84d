
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InterviewsTable from "./InterviewsTable";
import InterviewSlots from "./InterviewSlots";

interface InterviewsTabsProps {
  interviews: any[];
  slots: any[];
}

const InterviewsTabs = ({ interviews: initialInterviews, slots: initialSlots }: InterviewsTabsProps) => {
  const [interviews, setInterviews] = useState(initialInterviews);
  const [slots, setSlots] = useState(initialSlots);

  const handleSlotAccepted = (acceptedSlot: any) => {
    // Remove the slot from slots
    setSlots(currentSlots => currentSlots.filter(slot => slot.id !== acceptedSlot.id));
    
    // Add it to interviews
    const newInterview = {
      id: acceptedSlot.id,
      scheduled_at: acceptedSlot.selected_time,
      interviewer_name: "TBD",
      status: "scheduled",
      interview_type: acceptedSlot.interview_type,
      job: acceptedSlot.job,
      selected_time: acceptedSlot.selected_time
    };
    setInterviews(currentInterviews => [...currentInterviews, newInterview]);
  };

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
          <InterviewSlots 
            slots={slots} 
            onSlotAccepted={handleSlotAccepted}
          />
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
