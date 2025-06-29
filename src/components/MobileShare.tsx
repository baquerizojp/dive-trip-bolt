import React from 'react';
import { Share } from '@capacitor/share';
import { Button } from '@/components/ui/button';
import { Share as ShareIcon } from 'lucide-react';
import { Trip } from '@/types/trip';
import { useMobile } from '@/hooks/useMobile';

interface MobileShareProps {
  trip: Trip;
  message: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

const MobileShare: React.FC<MobileShareProps> = ({
  trip,
  message,
  variant = 'default',
  size = 'default',
  className = '',
  children
}) => {
  const { isNative } = useMobile();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleShare = async () => {
    const shareText = message || `🤿 ${trip.title}\n📅 ${formatDate(trip.date)}\n📍 ${trip.location}\n💰 $${trip.cost} per person\n\n${trip.description}`;

    if (isNative) {
      try {
        await Share.share({
          title: trip.title,
          text: shareText,
          dialogTitle: 'Share Dive Trip'
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to web sharing or WhatsApp
        fallbackShare(shareText);
      }
    } else {
      // Web fallback
      if (navigator.share) {
        try {
          await navigator.share({
            title: trip.title,
            text: shareText
          });
        } catch (error) {
          console.error('Error sharing:', error);
          fallbackShare(shareText);
        }
      } else {
        fallbackShare(shareText);
      }
    }
  };

  const fallbackShare = (text: string) => {
    const encodedMessage = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className={className}
    >
      {children || (
        <>
          <ShareIcon className="w-4 h-4 mr-2" />
          Share
        </>
      )}
    </Button>
  );
};

export default MobileShare;