import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { CandidateProfile, EmployerProfile, VirtualRecruiterProfile } from "@/integrations/supabase/types/profiles";
import { format } from "date-fns";

interface UserDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  userType: 'candidate' | 'employer' | 'vr';
}

export const UserDetailDrawer = ({ open, onOpenChange, user, userType }: UserDetailDrawerProps) => {
  if (!user) return null;

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'PPP');
  };

  const renderCandidateDetails = (profile: CandidateProfile) => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Personal Information</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Email:</div><div>{profile.email}</div>
          <div>Phone:</div><div>{profile.phone_number || 'N/A'}</div>
          <div>Address:</div><div>{profile.address || 'N/A'}</div>
          <div>Postcode:</div><div>{profile.home_postcode || 'N/A'}</div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Professional</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Job Title:</div><div>{profile.job_title}</div>
          <div>Experience:</div><div>{profile.years_experience} years</div>
          <div>Current Employer:</div><div>{profile.current_employer || 'N/A'}</div>
          <div>Work Area:</div><div>{profile.workArea || 'N/A'}</div>
          <div>Specialization:</div><div>{profile.itSpecialization || 'N/A'}</div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Work Preferences</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Locations:</div><div>{profile.location?.join(', ') || 'N/A'}</div>
          <div>Work Type:</div><div>{profile.preferred_work_type || 'N/A'}</div>
          <div>Availability:</div><div>{profile.availability || 'N/A'}</div>
          <div>Travel Radius:</div><div>{profile.travel_radius || 'N/A'} miles</div>
          <div>Work Eligibility:</div><div>{profile.work_eligibility || 'N/A'}</div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Salary & Commission</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Salary Range:</div><div>£{profile.min_salary?.toLocaleString()} - £{profile.max_salary?.toLocaleString()}</div>
          <div>Commission:</div><div>{profile.commission_percentage || 'N/A'}%</div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Skills & Qualifications</h3>
        <div className="space-y-2">
          <div>
            <div className="text-sm font-medium">Skills:</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {profile.required_skills?.map((skill, i) => (
                <Badge key={i} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Qualifications:</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {profile.required_qualifications?.map((qual, i) => (
                <Badge key={i} variant="secondary">{qual}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {profile.cv_url && (
        <div>
          <h3 className="font-semibold mb-2">Documents</h3>
          <a href={profile.cv_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
            View CV
          </a>
        </div>
      )}

      {profile.linkedin_url && (
        <div>
          <h3 className="font-semibold mb-2">LinkedIn</h3>
          <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
            {profile.linkedin_url}
          </a>
        </div>
      )}

      {profile.ai_synopsis && (
        <div>
          <h3 className="font-semibold mb-2">AI Synopsis</h3>
          <p className="text-sm text-muted-foreground">{profile.ai_synopsis}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Status: {profile.ai_synopsis_status} | Last updated: {formatDate(profile.ai_synopsis_last_updated)}
          </p>
        </div>
      )}
    </div>
  );

  const renderEmployerDetails = (profile: EmployerProfile) => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Contact Person</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Name:</div><div>{profile.full_name}</div>
          <div>Job Title:</div><div>{profile.job_title}</div>
          <div>LinkedIn:</div><div>{profile.linkedin_url ? <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profile.linkedin_url}</a> : 'N/A'}</div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Company Information</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Company Name:</div><div>{profile.company_name}</div>
          <div>Website:</div><div>{profile.company_website ? <a href={profile.company_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profile.company_website}</a> : 'N/A'}</div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Dates</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Created:</div><div>{formatDate(profile.created_at)}</div>
          <div>Updated:</div><div>{formatDate(profile.updated_at)}</div>
        </div>
      </div>
    </div>
  );

  const renderVRDetails = (profile: VirtualRecruiterProfile) => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">VR Information</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>VR Number:</div><div className="font-mono">{profile.vr_number}</div>
          <div>Email:</div><div>{profile.email}</div>
          <div>Location:</div><div>{profile.location}</div>
          <div>Status:</div><div>{profile.is_active ? <Badge variant="default">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}</div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Performance</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Successful Placements:</div><div>{profile.successful_placements || 0}</div>
          <div>Recommendations:</div><div>{profile.recommendations_count || 0}</div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Banking</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Bank Verified:</div><div>{profile.bank_account_verified ? <Badge variant="default">Yes</Badge> : <Badge variant="secondary">No</Badge>}</div>
          <div>NI Number:</div><div>{profile.national_insurance_number ? '******' + profile.national_insurance_number.slice(-4) : 'N/A'}</div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Dates</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Created:</div><div>{formatDate(profile.created_at)}</div>
          <div>Updated:</div><div>{formatDate(profile.updated_at)}</div>
        </div>
      </div>
    </div>
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            {user.full_name || user.company_name || user.email}
            <Badge variant={
              userType === 'candidate' ? 'default' : 
              userType === 'employer' ? 'secondary' : 
              'outline'
            }>
              {userType === 'candidate' ? 'Candidate' : userType === 'employer' ? 'Employer' : 'Virtual Recruiter'}
            </Badge>
          </DrawerTitle>
          <DrawerDescription>
            Signed up: {formatDate(user.signup_date || user.created_at)}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-6 pb-6 overflow-y-auto">
          {userType === 'candidate' && renderCandidateDetails(user as CandidateProfile)}
          {userType === 'employer' && renderEmployerDetails(user as EmployerProfile)}
          {userType === 'vr' && renderVRDetails(user as VirtualRecruiterProfile)}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
