interface MatchWarningContentProps {
  matchScore: number;
  matchThreshold: number;
  onProceed: () => void;
}

const MatchWarningContent = ({ matchScore, matchThreshold, onProceed }: MatchWarningContentProps) => {
  return (
    <div className="mt-6 space-y-4">
      <p className="text-sm text-amber-600">
        Your match score ({matchScore}%) is below the job's threshold ({matchThreshold}%).
        You can still proceed, but you might not be the best fit for this role.
      </p>
      <button
        onClick={onProceed}
        className="w-full bg-amber-600 text-white py-2 px-4 rounded hover:bg-amber-700 transition-colors"
      >
        Proceed Anyway
      </button>
    </div>
  );
};

export default MatchWarningContent;