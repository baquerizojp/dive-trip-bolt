
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddParticipantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddParticipant: (name: string) => void;
}

const AddParticipantDialog: React.FC<AddParticipantDialogProps> = ({
  open,
  onOpenChange,
  onAddParticipant
}) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onAddParticipant(name.trim());
    setName('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[350px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg">Add Participant</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="participantName" className="text-sm">Name</Label>
            <Input
              id="participantName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter participant name"
              autoFocus
              className="text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              Add Person
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddParticipantDialog;
