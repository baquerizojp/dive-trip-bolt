import React from 'react';
import { Button } from '@/components/ui/button';
import { Trip, Participant } from '@/types/trip';
import { useMobile } from '@/hooks/useMobile';
import MobileShare from './MobileShare';

interface WhatsAppButtonProps {
  type: 'broadcast' | 'personal' | 'reminder' | 'bulk-interested' | 'bulk-unpaid';
  trip: Trip;
  participant?: Participant;
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  type,
  trip,
  participant,
  children,
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const { isNative } = useMobile();

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

  const generateMessage = () => {
    const formattedDate = formatDate(trip.date);
    
    switch (type) {
      case 'broadcast':
        return `🤿 DIVE TRIP ANNOUNCEMENT 🤿

${trip.title}
📅 ${formattedDate}
📍 ${trip.location}
💰 $${trip.cost} per person

${trip.description}

Min ${trip.minParticipants} people, max ${trip.maxParticipants} people.
Currently ${trip.participants.filter(p => p.interest === 'confirmed').length} confirmed.

Let me know if you're interested! 🐠`;

      case 'personal':
        return `Hi ${participant?.name}! 👋

I'm organizing a dive trip and thought you might be interested:

🤿 ${trip.title}
📅 ${formattedDate}
📍 ${trip.location}
💰 $${trip.cost} per person

${trip.description}

Let me know if you'd like to join! 🐠`;

      case 'reminder':
        return `Hi ${participant?.name}! 👋

Just a friendly reminder about the payment for our upcoming dive trip:

🤿 ${trip.title}
📅 ${formattedDate}
💰 $${trip.cost} per person

Please let me know when you can send the payment. Thanks! 🐠`;

      case 'bulk-interested':
        const interestedNames = trip.participants
          .filter(p => p.interest === 'interested')
          .map(p => p.name)
          .join(', ');
        
        return `Hi everyone! 👋

Hope you're all doing well! I wanted to follow up about our upcoming dive trip:

🤿 ${trip.title}
📅 ${formattedDate}
📍 ${trip.location}
💰 $${trip.cost} per person

${trip.description}

Could you please let me know if you'd like to confirm your spot? We need ${trip.minParticipants} people minimum to make this trip happen.

Looking forward to hearing from you! 🐠

Currently interested: ${interestedNames}`;

      case 'bulk-unpaid':
        const unpaidNames = trip.participants
          .filter(p => p.interest === 'confirmed' && p.payment === 'unpaid')
          .map(p => p.name)
          .join(', ');
        
        return `Hi everyone! 👋

Hope you're all excited about our upcoming dive trip:

🤿 ${trip.title}
📅 ${formattedDate}
💰 $${trip.cost} per person

Just a friendly reminder about the payment. Please let me know when you can send it so we can finalize all the arrangements.

Thanks! 🐠

Pending payment: ${unpaidNames}`;

      default:
        return '';
    }
  };

  const handleClick = () => {
    const message = generateMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    console.log('Opening WhatsApp with message:', message);
    window.open(whatsappUrl, '_blank');
  };

  // Use native sharing for mobile when available
  if (isNative && (type === 'broadcast' || type === 'bulk-interested' || type === 'bulk-unpaid')) {
    return (
      <MobileShare
        trip={trip}
        message={generateMessage()}
        variant={variant}
        size={size}
        className={className}
      >
        {children}
      </MobileShare>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={className}
    >
      {children}
    </Button>
  );
};

export default WhatsAppButton;