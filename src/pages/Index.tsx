import React, { useState } from 'react';
import { Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClerk } from '@clerk/clerk-react';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import TripCard from '@/components/TripCard';
import CreateTripDialog from '@/components/CreateTripDialog';
import { Trip } from '@/types/trip';

const Index = () => {
  const { signOut } = useClerk();
  const { isAdmin, user } = useAuth();
  const { isNative } = useMobile();
  
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: '1',
      title: 'Weekend Dive - Coral Gardens',
      date: '2025-07-11',
      location: 'Coral Gardens',
      cost: 135,
      description: 'Amazing coral reef dive with morning departure. Equipment included, bring your certification.',
      minParticipants: 4,
      maxParticipants: 9,
      participants: [
        { id: '1', name: 'Maria Santos', interest: 'confirmed', payment: 'paid' },
        { id: '2', name: 'Carlos Rodriguez', interest: 'confirmed', payment: 'unpaid' },
        { id: '3', name: 'Ana Lopez', interest: 'interested', payment: 'unpaid' }
      ]
    }
  ]);
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const upcomingTrips = trips.filter(trip => trip.date >= today);
  const pastTrips = trips.filter(trip => trip.date < today);

  const addTrip = (newTrip: Omit<Trip, 'id'>) => {
    const trip: Trip = {
      ...newTrip,
      id: Date.now().toString(),
      participants: []
    };
    setTrips(prev => [...prev, trip]);
    setIsCreateDialogOpen(false);
  };

  const updateTrip = (updatedTrip: Trip) => {
    setTrips(prev => prev.map(trip => trip.id === updatedTrip.id ? updatedTrip : trip));
  };

  const deleteTrip = (tripId: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== tripId));
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 ${isNative ? 'safe-area-top safe-area-bottom' : ''}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🤿</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Dive Trip Organizer</h1>
                <p className="text-sm text-gray-600">
                  {isAdmin ? 'Admin Dashboard' : `Welcome, ${user?.firstName || 'User'}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900 min-h-[44px]"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="upcoming" className="w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <TabsList className="bg-white w-full sm:w-auto">
              <TabsTrigger value="upcoming" className="flex items-center gap-2 text-sm min-h-[44px]">
                Upcoming ({upcomingTrips.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="flex items-center gap-2 text-sm min-h-[44px]">
                Past ({pastTrips.length})
              </TabsTrigger>
            </TabsList>
            
            {isAdmin && (
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto min-h-[44px]"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="sm:hidden">New Trip</span>
                <span className="hidden sm:inline">Create Trip</span>
              </Button>
            )}
          </div>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {isAdmin ? 'Manage Dive Trips' : 'Upcoming Dive Trips'}
              </h2>
            </div>
            
            {upcomingTrips.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤿</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming trips</h3>
                  <p className="text-gray-600 mb-4">
                    {isAdmin ? 'Create your first dive trip to get started!' : 'No trips scheduled at the moment.'}
                  </p>
                  {isAdmin && (
                    <Button 
                      onClick={() => setIsCreateDialogOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 min-h-[44px]"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Trip
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingTrips.map(trip => (
                  <TripCard 
                    key={trip.id} 
                    trip={trip} 
                    onUpdate={updateTrip}
                    onDelete={deleteTrip}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastTrips.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📅</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No past trips</h3>
                  <p className="text-gray-600">Your completed trips will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pastTrips.map(trip => (
                  <TripCard 
                    key={trip.id} 
                    trip={trip} 
                    onUpdate={updateTrip}
                    onDelete={deleteTrip}
                    isPast={true}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {isAdmin && (
        <CreateTripDialog 
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreateTrip={addTrip}
        />
      )}
    </div>
  );
};

export default Index;