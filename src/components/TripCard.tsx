
import React, { useState } from 'react';
import { Calendar, Users, DollarSign, MessageCircle, UserPlus, Edit, Trash2, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trip, TripStatus } from '@/types/trip';
import { useAuth } from '@/hooks/useAuth';
import ParticipantList from './ParticipantList';
import AddParticipantDialog from './AddParticipantDialog';
import EditTripDialog from './EditTripDialog';
import WhatsAppButton from './WhatsAppButton';

interface TripCardProps {
  trip: Trip;
  onUpdate: (trip: Trip) => void;
  onDelete: (tripId: string) => void;
  isPast?: boolean;
  isAdmin?: boolean;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onUpdate, onDelete, isPast = false, isAdmin = false }) => {
  const { user } = useAuth();
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [isEditTripOpen, setIsEditTripOpen] = useState(false);

  const confirmedParticipants = trip.participants.filter(p => p.interest === 'confirmed');
  const interestedParticipants = trip.participants.filter(p => p.interest === 'interested');
  const unpaidParticipants = trip.participants.filter(p => p.interest === 'confirmed' && p.payment === 'unpaid');
  const tripStatus: TripStatus = confirmedParticipants.length >= trip.minParticipants ? 'confirmed' : 'pending';
  const spotsLeft = trip.maxParticipants - confirmedParticipants.length;

  // Check if current user is already in the trip
  const currentUserInTrip = trip.participants.find(p => 
    p.name === user?.firstName + ' ' + user?.lastName || 
    p.name === user?.firstName ||
    p.name === user?.fullName
  );

  const formatDate = (dateString: string) => {
    // Fix date formatting to avoid timezone issues
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const addParticipant = (name: string) => {
    const newParticipant = {
      id: Date.now().toString(),
      name,
      interest: 'interested' as const,
      payment: 'unpaid' as const
    };
    onUpdate({
      ...trip,
      participants: [...trip.participants, newParticipant]
    });
    setIsAddParticipantOpen(false);
  };

  const handleUserInterest = () => {
    if (currentUserInTrip) return;
    
    const userName = user?.firstName + ' ' + user?.lastName || user?.firstName || user?.fullName || 'Anonymous User';
    const newParticipant = {
      id: Date.now().toString(),
      name: userName,
      interest: 'interested' as const,
      payment: 'unpaid' as const
    };
    
    onUpdate({
      ...trip,
      participants: [...trip.participants, newParticipant]
    });
  };

  const updateParticipant = (participantId: string, updates: Partial<{ interest: 'interested' | 'confirmed'; payment: 'paid' | 'unpaid' }>) => {
    onUpdate({
      ...trip,
      participants: trip.participants.map(p => 
        p.id === participantId ? { ...p, ...updates } : p
      )
    });
  };

  const removeParticipant = (participantId: string) => {
    onUpdate({
      ...trip,
      participants: trip.participants.filter(p => p.id !== participantId)
    });
  };

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{trip.title}</h3>
              <Badge 
                variant={tripStatus === 'confirmed' ? 'default' : 'secondary'}
                className={tripStatus === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
              >
                {tripStatus === 'confirmed' ? 'Confirmed' : 'Pending'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 gap-2 sm:gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{formatDate(trip.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>{confirmedParticipants.length}/{trip.minParticipants} confirmed • {spotsLeft} spots left</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 flex-shrink-0" />
                <span>${trip.cost} per person</span>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-gray-700 mt-3 text-sm sm:text-base">{trip.description}</p>
      </CardHeader>

      <CardContent className="pt-0">
        {/* User Interest Button for non-admin users */}
        {!isAdmin && !isPast && (
          <div className="mb-4">
            {currentUserInTrip ? (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <Heart className="w-4 h-4 text-green-600" />
                <span className="text-green-700 font-medium">
                  You're registered as {currentUserInTrip.interest} 
                  {currentUserInTrip.interest === 'confirmed' && (
                    <span className="ml-2 text-sm">
                      ({currentUserInTrip.payment === 'paid' ? 'Paid' : 'Payment pending'})
                    </span>
                  )}
                </span>
              </div>
            ) : (
              <Button
                onClick={handleUserInterest}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={spotsLeft <= 0}
              >
                <Heart className="w-4 h-4 mr-2" />
                {spotsLeft <= 0 ? 'Trip Full' : "I'm Interested"}
              </Button>
            )}
          </div>
        )}

        {/* Admin Controls */}
        {isAdmin && (
          <div className="flex flex-col gap-2 mb-4">
            {/* Bulk WhatsApp Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <WhatsAppButton
                type="broadcast"
                trip={trip}
                variant="default"
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                <span className="sm:hidden">Broadcast</span>
                <span className="hidden sm:inline">Broadcast Trip</span>
              </WhatsAppButton>
              
              {interestedParticipants.length > 0 && (
                <WhatsAppButton
                  type="bulk-interested"
                  trip={trip}
                  variant="outline"
                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                  size="sm"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span className="sm:hidden">Interested ({interestedParticipants.length})</span>
                  <span className="hidden sm:inline">Message Interested ({interestedParticipants.length})</span>
                </WhatsAppButton>
              )}
              
              {unpaidParticipants.length > 0 && (
                <WhatsAppButton
                  type="bulk-unpaid"
                  trip={trip}
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  size="sm"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="sm:hidden">Unpaid ({unpaidParticipants.length})</span>
                  <span className="hidden sm:inline">Message Unpaid ({unpaidParticipants.length})</span>
                </WhatsAppButton>
              )}
            </div>
            
            {/* Admin Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddParticipantOpen(true)}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                <span className="sm:hidden">Add</span>
                <span className="hidden sm:inline">Add Person</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditTripOpen(true)}
                className="text-gray-600 hover:bg-gray-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(trip.id)}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                <span className="sm:hidden">Del</span>
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          </div>
        )}

        <ParticipantList
          participants={trip.participants}
          onUpdateParticipant={updateParticipant}
          onRemoveParticipant={removeParticipant}
          trip={trip}
          isAdmin={isAdmin}
        />
      </CardContent>

      {isAdmin && (
        <>
          <AddParticipantDialog
            open={isAddParticipantOpen}
            onOpenChange={setIsAddParticipantOpen}
            onAddParticipant={addParticipant}
          />

          <EditTripDialog
            open={isEditTripOpen}
            onOpenChange={setIsEditTripOpen}
            trip={trip}
            onUpdateTrip={onUpdate}
          />
        </>
      )}
    </Card>
  );
};

export default TripCard;
