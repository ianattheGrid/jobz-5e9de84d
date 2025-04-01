
import { ProtectedRoute } from "./ProtectedRoute";
import { SessionTimeoutHandler } from "./SessionTimeoutHandler";

interface ProtectedRouteWithTimeoutProps {
  children: React.ReactNode;
  userType: string;
}

export const ProtectedRouteWithTimeout = ({ children, userType }: ProtectedRouteWithTimeoutProps) => {
  return (
    <ProtectedRoute userType={userType}>
      <SessionTimeoutHandler />
      {children}
    </ProtectedRoute>
  );
};
