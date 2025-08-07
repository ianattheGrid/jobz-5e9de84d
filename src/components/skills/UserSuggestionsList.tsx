import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { useSkills } from '@/hooks/useSkills';

const UserSuggestionsList = () => {
  const { suggestions, loading } = useSkills();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Skill Suggestions</CardTitle>
          <CardDescription>Loading your suggestions...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Skill Suggestions</CardTitle>
          <CardDescription>You haven't suggested any skills yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getStatusIcon = (aiStatus: string, adminStatus: string) => {
    if (adminStatus === 'approved') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (adminStatus === 'rejected') return <XCircle className="w-4 h-4 text-red-500" />;
    if (aiStatus === 'rejected') return <AlertCircle className="w-4 h-4 text-orange-500" />;
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusText = (suggestion: any) => {
    if (suggestion.admin_status === 'approved') return 'Approved';
    if (suggestion.admin_status === 'rejected') return 'Rejected';
    if (suggestion.ai_validation_status === 'rejected') return 'AI Review Failed';
    if (suggestion.ai_validation_status === 'approved') return 'Pending Admin Review';
    return 'Under AI Review';
  };

  const getStatusVariant = (suggestion: any): "default" | "secondary" | "destructive" | "outline" => {
    if (suggestion.admin_status === 'approved') return 'default';
    if (suggestion.admin_status === 'rejected') return 'destructive';
    if (suggestion.ai_validation_status === 'rejected') return 'destructive';
    return 'secondary';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Skill Suggestions</CardTitle>
        <CardDescription>Track the status of your suggested skills</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{suggestion.skill_name}</span>
                <Badge variant="outline" className="text-xs">
                  {suggestion.work_area}
                  {suggestion.specialization && ` • ${suggestion.specialization}`}
                </Badge>
              </div>
              
              {suggestion.ai_validation_reason && (
                <p className="text-sm text-muted-foreground">
                  {suggestion.ai_validation_reason}
                </p>
              )}
              
              {suggestion.admin_notes && (
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Admin notes:</strong> {suggestion.admin_notes}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {suggestion.ai_validation_score && (
                <span className="text-sm text-muted-foreground">
                  Score: {suggestion.ai_validation_score}%
                </span>
              )}
              <div className="flex items-center gap-1">
                {getStatusIcon(suggestion.ai_validation_status, suggestion.admin_status)}
                <Badge variant={getStatusVariant(suggestion)} className="text-xs">
                  {getStatusText(suggestion)}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UserSuggestionsList;