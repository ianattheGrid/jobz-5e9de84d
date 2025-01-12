interface JobsHeaderProps {
  userType: string | null;
  jobCount: number;
}

const JobsHeader = ({ userType, jobCount }: JobsHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-2 text-white">
        {userType === 'employer' ? 'Manage Jobs' : 'Browse Jobs'}
      </h1>
      <p className="text-muted-foreground">
        {jobCount} {jobCount === 1 ? 'job' : 'jobs'} available
      </p>
    </div>
  );
};

export default JobsHeader;