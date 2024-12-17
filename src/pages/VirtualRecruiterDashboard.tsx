import { ReferralsList } from "@/components/vr/ReferralsList";
import { ReferralInvite } from "@/components/vr/ReferralInvite";

const VirtualRecruiterDashboard = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Virtual Recruiter Dashboard</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Invite Candidates</h2>
            <ReferralInvite />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <ReferralsList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualRecruiterDashboard;