
interface JobsHeaderProps {
  userType: string | null;
}

const JobsHeader = ({ userType }: JobsHeaderProps) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">
        {userType === 'employer' ? 'Manage Jobs' : 'Browse Jobs'}
      </h1>
    </div>
  );
};

export default JobsHeader;
