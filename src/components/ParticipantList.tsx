
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Participant, Trip } from '@/types/trip';

interface ParticipantListProps {
  participants: Participant[];
  onUpdateParticipant: (id: string, updates: Partial<Participant>) => void;
  onRemoveParticipant: (id: string) => void;
  trip: Trip;
  isAdmin?: boolean;
}

const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  onUpdateParticipant,
  onRemoveParticipant,
  trip,
  isAdmin = false
}) => {
  if (participants.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p className="text-sm sm:text-base">No participants yet. {isAdmin ? 'Add people to get started!' : ''}</p>
      </div>
    );
  }

  // Sort participants: confirmed+paid first, then confirmed+unpaid, then interested
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.interest === 'confirmed' && a.payment === 'paid' && !(b.interest === 'confirmed' && b.payment === 'paid')) return -1;
    if (b.interest === 'confirmed' && b.payment === 'paid' && !(a.interest === 'confirmed' && a.payment === 'paid')) return 1;
    if (a.interest === 'confirmed' && b.interest === 'interested') return -1;
    if (b.interest === 'confirmed' && a.interest === 'interested') return 1;
    return 0;
  });

  const toggleInterest = (participant: Participant) => {
    if (!isAdmin) return;
    const newInterest = participant.interest === 'interested' ? 'confirmed' : 'interested';
    onUpdateParticipant(participant.id, { interest: newInterest });
  };

  const togglePayment = (participant: Participant) => {
    if (!isAdmin) return;
    const newPayment = participant.payment === 'unpaid' ? 'paid' : 'unpaid';
    onUpdateParticipant(participant.id, { payment: newPayment });
  };

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900 flex items-center gap-2 text-sm sm:text-base">
        Participants ({participants.length})
      </h4>
      
      {sortedParticipants.map((participant) => (
        <div key={participant.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <span className="font-medium text-gray-900 truncate text-sm sm:text-base">{participant.name}</span>
              <div className="flex gap-2">
                <Badge
                  variant={participant.interest === 'confirmed' ? 'default' : 'secondary'}
                  className={`text-xs ${isAdmin ? 'cursor-pointer' : 'cursor-default'} transition-colors ${
                    participant.interest === 'confirmed' 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  }`}
                  onClick={() => toggleInterest(participant)}
                >
                  {participant.interest}
                </Badge>
                <Badge
                  variant={participant.payment === 'paid' ? 'default' : 'secondary'}
                  className={`text-xs ${isAdmin ? 'cursor-pointer' : 'cursor-default'} transition-colors ${
                    participant.payment === 'paid' 
                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                  onClick={() => togglePayment(participant)}
                >
                  {participant.payment}
                </Badge>
              </div>
            </div>
          </div>
          
          {isAdmin && (
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveParticipant(participant.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ParticipantList;
