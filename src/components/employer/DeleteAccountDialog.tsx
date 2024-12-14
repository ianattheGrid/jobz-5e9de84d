import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const DeleteAccountDialog = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDeleteAccount = async () => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getSession()).data.session?.user.id || ''
      );
      if (error) throw error;

      await supabase.auth.signOut();
      navigate('/');
      
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete account",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="text-white">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};