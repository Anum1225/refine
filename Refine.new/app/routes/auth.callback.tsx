import { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { supabase } from '~/lib/supabase/client';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/?error=auth_error');
          return;
        }

        if (data.session) {
          // User is authenticated, redirect to main app
          navigate('/');
        } else {
          // No session, redirect to home with error
          navigate('/?error=no_session');
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        navigate('/?error=unexpected_error');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bolt-elements-bg-depth-1">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500 mx-auto mb-4"></div>
        <p className="text-bolt-elements-textSecondary">Completing authentication...</p>
      </div>
    </div>
  );
}
