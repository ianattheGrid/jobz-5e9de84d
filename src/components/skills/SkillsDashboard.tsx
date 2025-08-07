import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SkillSuggestionForm from './SkillSuggestionForm';
import UserSuggestionsList from './UserSuggestionsList';
import { useSkills } from '@/hooks/useSkills';

const SkillsDashboard = () => {
  const { refetch } = useSkills();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Skills Management</h1>
          <p className="text-muted-foreground">
            Manage and suggest skills for our platform
          </p>
        </div>
      </div>

      <Tabs defaultValue="suggestions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="suggestions">My Suggestions</TabsTrigger>
          <TabsTrigger value="suggest">Suggest New Skill</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-6">
          <UserSuggestionsList />
        </TabsContent>

        <TabsContent value="suggest" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Suggest a New Skill</CardTitle>
              <CardDescription>
                Help us improve our skills database by suggesting relevant professional skills
                that aren't currently listed. All suggestions are reviewed by our AI system
                and then by our admin team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <SkillSuggestionForm 
                  workArea="IT" 
                  onSuggestionSubmitted={refetch}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SkillsDashboard;