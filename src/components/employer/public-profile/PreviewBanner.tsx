
interface PreviewBannerProps {
  isVisible: boolean;
}

export const PreviewBanner = ({ isVisible }: PreviewBannerProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
      <p className="text-amber-800">
        This is a preview of how your profile appears to candidates after they match with one of your vacancies.
      </p>
    </div>
  );
};
