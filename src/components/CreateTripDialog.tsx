import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trip } from '@/types/trip';

interface CreateTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTrip: (trip: Omit<Trip, 'id'>) => void;
}

const CreateTripDialog: React.FC<CreateTripDialogProps> = ({
  open,
  onOpenChange,
  onCreateTrip
}) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    cost: 135,
    description: '',
    minParticipants: 4,
    maxParticipants: 9
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location) {
      return;
    }
    
    // Fix date handling - ensure we use the exact date selected without timezone conversion
    const selectedDate = new Date(formData.date + 'T00:00:00');
    const formattedDate = selectedDate.toISOString().split('T')[0];
    
    onCreateTrip({
      ...formData,
      date: formattedDate,
      participants: []
    });
    
    // Reset form
    setFormData({
      title: '',
      date: '',
      location: '',
      cost: 135,
      description: '',
      minParticipants: 4,
      maxParticipants: 9
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Create New Dive Trip</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm">Trip Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Weekend Dive - Coral Gardens"
              required
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
                className="text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Coral Gardens"
                required
                className="text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost" className="text-sm">Cost per Person ($)</Label>
            <Input
              id="cost"
              type="number"
              value={formData.cost}
              onChange={(e) => setFormData(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
              min="0"
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minParticipants" className="text-sm">Min Participants</Label>
              <Input
                id="minParticipants"
                type="number"
                value={formData.minParticipants}
                onChange={(e) => setFormData(prev => ({ ...prev, minParticipants: parseInt(e.target.value) || 1 }))}
                min="1"
                max="20"
                className="text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxParticipants" className="text-sm">Max Participants</Label>
              <Input
                id="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 1 }))}
                min="1"
                max="20"
                className="text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Trip details, equipment notes, certification requirements, etc."
              rows={3}
              className="text-sm resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              Create Trip
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTripDialog;
