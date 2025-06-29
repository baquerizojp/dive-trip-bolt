import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trip } from '@/types/trip';
import MobileOptimizedInput from './MobileOptimizedInput';

interface EditTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: Trip;
  onUpdateTrip: (trip: Trip) => void;
}

const EditTripDialog: React.FC<EditTripDialogProps> = ({
  open,
  onOpenChange,
  trip,
  onUpdateTrip
}) => {
  const [formData, setFormData] = useState({
    title: trip.title,
    date: trip.date,
    location: trip.location,
    cost: trip.cost,
    description: trip.description,
    minParticipants: trip.minParticipants,
    maxParticipants: trip.maxParticipants
  });

  useEffect(() => {
    setFormData({
      title: trip.title,
      date: trip.date,
      location: trip.location,
      cost: trip.cost,
      description: trip.description,
      minParticipants: trip.minParticipants,
      maxParticipants: trip.maxParticipants
    });
  }, [trip]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location) {
      return;
    }
    
    onUpdateTrip({
      ...trip,
      ...formData
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Trip</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Trip Title *</Label>
            <MobileOptimizedInput
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Weekend Dive - Coral Gardens"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <MobileOptimizedInput
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <MobileOptimizedInput
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Coral Gardens"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">Cost per Person ($)</Label>
            <MobileOptimizedInput
              id="cost"
              type="number"
              value={formData.cost}
              onChange={(e) => setFormData(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
              min="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minParticipants">Min Participants</Label>
              <MobileOptimizedInput
                id="minParticipants"
                type="number"
                value={formData.minParticipants}
                onChange={(e) => setFormData(prev => ({ ...prev, minParticipants: parseInt(e.target.value) || 1 }))}
                min="1"
                max="20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Max Participants</Label>
              <MobileOptimizedInput
                id="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 1 }))}
                min="1"
                max="20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Trip details, equipment notes, certification requirements, etc."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Update Trip
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTripDialog;