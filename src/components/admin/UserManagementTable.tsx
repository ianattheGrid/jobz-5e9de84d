import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface User {
  id: string;
  full_name: string | null;
  email: string;
  user_type: 'candidate' | 'employer' | 'vr';
  signup_date: string;
  updated_at: string;
  profile_completion: number;
  [key: string]: any;
}

interface UserManagementTableProps {
  users: User[];
  onViewDetails: (user: User) => void;
}

export const UserManagementTable = ({ users, onViewDetails }: UserManagementTableProps) => {
  const getUserTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      candidate: "default",
      employer: "secondary",
      vr: "outline",
    };
    const labels: Record<string, string> = {
      candidate: "Candidate",
      employer: "Employer",
      vr: "Virtual Recruiter",
    };
    return <Badge variant={variants[type]}>{labels[type]}</Badge>;
  };

  const getCompletionBadge = (completion: number) => {
    if (completion >= 75) return <Badge variant="default">{completion}%</Badge>;
    if (completion >= 50) return <Badge variant="secondary">{completion}%</Badge>;
    return <Badge variant="outline">{completion}%</Badge>;
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Signup Date</TableHead>
            <TableHead>Completion</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.profile_picture_url || user.company_logo_url} />
                    <AvatarFallback>{getInitials(user.full_name || user.company_name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.full_name || user.company_name || 'Unnamed'}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getUserTypeBadge(user.user_type)}</TableCell>
              <TableCell>
                <div className="text-sm">
                  {user.user_type === 'candidate' && (
                    <>
                      <div className="font-medium">{user.job_title}</div>
                      <div className="text-muted-foreground">{user.years_experience} yrs exp</div>
                    </>
                  )}
                  {user.user_type === 'employer' && (
                    <>
                      <div className="font-medium">{user.company_name}</div>
                      <div className="text-muted-foreground">{user.job_title}</div>
                    </>
                  )}
                  {user.user_type === 'vr' && (
                    <>
                      <div className="font-medium font-mono">{user.vr_number}</div>
                      <div className="text-muted-foreground">{user.location}</div>
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {format(new Date(user.signup_date || user.created_at), 'PP')}
              </TableCell>
              <TableCell>{getCompletionBadge(user.profile_completion)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(user)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Notification
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
