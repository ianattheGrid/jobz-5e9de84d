
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteFileButtonProps {
  deleting: boolean;
  onDelete: () => void;
  disabled?: boolean;
}

export const DeleteFileButton = ({
  deleting,
  onDelete,
  disabled = false
}: DeleteFileButtonProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onDelete}
      disabled={deleting || disabled}
      className="bg-red-50 hover:bg-red-100 border-red-200"
      title="Delete file"
    >
      {deleting ? (
        <Loader2 className="h-4 w-4 animate-spin text-red-500" />
      ) : (
        <Trash2 className="h-4 w-4 text-red-500" />
      )}
    </Button>
  );
};
