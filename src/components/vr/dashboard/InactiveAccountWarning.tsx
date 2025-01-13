import { Card, CardContent } from "@/components/ui/card";

export const InactiveAccountWarning = () => {
  return (
    <Card className="mb-8 border-yellow-500 bg-yellow-50">
      <CardContent className="p-4">
        <p className="text-yellow-800">
          Your account is currently inactive. Please complete your profile setup or contact support.
        </p>
      </CardContent>
    </Card>
  );
};