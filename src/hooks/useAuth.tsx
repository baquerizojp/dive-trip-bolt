
import { useUser } from '@clerk/clerk-react';

export const useAuth = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  
  const isAdmin = user?.publicMetadata?.role === 'admin' || user?.emailAddresses?.[0]?.emailAddress === 'admin@example.com';
  
  return {
    user,
    isLoaded,
    isSignedIn,
    isAdmin,
    userRole: isAdmin ? 'admin' : 'user'
  };
};
