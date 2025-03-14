
import { useState } from 'react';
import { InterviewSlot } from '../types';

interface DialogState {
  isOpen: boolean;
  slot: InterviewSlot | null;
}

interface ResponseDialogState {
  isOpen: boolean;
  slotId: string | null;
  mode: 'unavailable' | 'suggest' | 'decline';
}

export const useInterviewDialogs = () => {
  const [timeSelectionDialog, setTimeSelectionDialog] = useState<DialogState>({
    isOpen: false,
    slot: null
  });

  const [responseDialog, setResponseDialog] = useState<ResponseDialogState>({
    isOpen: false,
    slotId: null,
    mode: 'unavailable'
  });

  const openTimeSelection = (slot: InterviewSlot) => {
    setTimeSelectionDialog({ isOpen: true, slot });
  };

  const closeTimeSelection = () => {
    setTimeSelectionDialog({ isOpen: false, slot: null });
  };

  const openResponseDialog = (slotId: string, mode: ResponseDialogState['mode']) => {
    setResponseDialog({ isOpen: true, slotId, mode });
  };

  const closeResponseDialog = () => {
    setResponseDialog({ isOpen: false, slotId: null, mode: 'unavailable' });
  };

  return {
    timeSelectionDialog,
    responseDialog,
    openTimeSelection,
    closeTimeSelection,
    openResponseDialog,
    closeResponseDialog
  };
};
