
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="today"
            className="data-[state=active]:bg-white data-[state=active]:text-[#FF69B4] data-[state=active]:shadow-sm"
          >
            Today's Interviews ({today.length})
          </TabsTrigger>
          <TabsTrigger 
            value="upcoming"
            className="data-[state=active]:bg-white data-[state=active]:text-[#FF69B4] data-[state=active]:shadow-sm"
          >
            Upcoming Interviews ({future.length})
          </TabsTrigger>
          <TabsTrigger 
            value="past"
            className="data-[state=active]:bg-white data-[state=active]:text-[#FF69B4] data-[state=active]:shadow-sm"
          >
            Past Interviews ({past.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          {today.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No interviews scheduled for today</p>
              <p className="text-gray-400 text-sm mt-1">Check your upcoming interviews or schedule new ones</p>
            </div>
          ) : (
            <InterviewTable interviews={today} />
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {future.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No upcoming interviews scheduled</p>
              <p className="text-gray-400 text-sm mt-1">Schedule interviews with your candidates</p>
            </div>
          ) : (
            <InterviewTable interviews={future} />
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {past.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No past interviews</p>
              <p className="text-gray-400 text-sm mt-1">Completed interviews will appear here</p>
            </div>
          ) : (
            <InterviewTable interviews={past} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InterviewTabs;
