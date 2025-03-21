
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InterviewTable from "./InterviewTable";

interface Interview {
  id: number;
  job: {
    id: number;
    title: string;
    company: string;
  };
  candidate_id: string;
  candidate_email: string;
  interviewer_name: string;
  scheduled_at: string;
  status: string;
}

interface InterviewGroupsProps {
  past: Interview[];
  today: Interview[];
  future: Interview[];
}

const InterviewTabs = ({ past, today, future }: InterviewGroupsProps) => {
  return (
    <Tabs defaultValue="today" className="space-y-6">
      <TabsList className="bg-red-50">
        <TabsTrigger 
          value="today"
          className="data-[state=active]:bg-primary data-[state=active]:text-white"
        >
          Today's Interviews ({today.length})
        </TabsTrigger>
        <TabsTrigger 
          value="upcoming"
          className="data-[state=active]:bg-primary data-[state=active]:text-white"
        >
          Upcoming Interviews ({future.length})
        </TabsTrigger>
        <TabsTrigger 
          value="past"
          className="data-[state=active]:bg-primary data-[state=active]:text-white"
        >
          Past Interviews ({past.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="today">
        {today.length === 0 ? (
          <p className="text-gray-500">No interviews scheduled for today.</p>
        ) : (
          <InterviewTable interviews={today} />
        )}
      </TabsContent>

      <TabsContent value="upcoming">
        {future.length === 0 ? (
          <p className="text-gray-500">No upcoming interviews scheduled.</p>
        ) : (
          <InterviewTable interviews={future} />
        )}
      </TabsContent>

      <TabsContent value="past">
        {past.length === 0 ? (
          <p className="text-gray-500">No past interviews.</p>
        ) : (
          <InterviewTable interviews={past} />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default InterviewTabs;
