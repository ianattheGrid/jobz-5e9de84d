import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserSearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  userTypeFilter: string;
  onUserTypeChange: (value: string) => void;
  completionFilter: string;
  onCompletionChange: (value: string) => void;
}

export const UserSearchFilter = ({
  searchTerm,
  onSearchChange,
  userTypeFilter,
  onUserTypeChange,
  completionFilter,
  onCompletionChange,
}: UserSearchFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, company, or VR number..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={userTypeFilter} onValueChange={onUserTypeChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="User Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Users</SelectItem>
          <SelectItem value="candidate">Candidates</SelectItem>
          <SelectItem value="employer">Employers</SelectItem>
          <SelectItem value="vr">Virtual Recruiters</SelectItem>
        </SelectContent>
      </Select>

      <Select value={completionFilter} onValueChange={onCompletionChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Profile Completion" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Profiles</SelectItem>
          <SelectItem value="0-25">&lt; 25%</SelectItem>
          <SelectItem value="25-50">25% - 50%</SelectItem>
          <SelectItem value="50-75">50% - 75%</SelectItem>
          <SelectItem value="75-100">&gt; 75%</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
