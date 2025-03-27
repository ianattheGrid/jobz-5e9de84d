
interface JobsHeaderProps {
  userType: string | null;
}

const JobsHeader = ({ userType }: JobsHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-2 text-white">
        {userType === 'employer' ? 'Manage Jobs' : 'Browse Jobs'}
      </h1>
    </div>
  );
};

export default JobsHeader;
