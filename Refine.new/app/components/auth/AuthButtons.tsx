import { useState } from 'react';
import { useAuth } from '~/lib/auth/AuthContext';
import { Button } from '~/components/ui/Button';
import { AuthModal } from './AuthModal';

export function AuthButtons() {
  const { user, profile, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {/* User Menu */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-bolt-elements-bg-depth-2 transition-colors">
            <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </div>
            <span className="hidden md:block text-sm text-bolt-elements-textPrimary">
              {profile?.full_name || user.email}
            </span>
            <svg className="w-4 h-4 text-bolt-elements-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-bolt-elements-bg-depth-1 border border-bolt-elements-borderColor rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="py-1">
              <div className="px-4 py-2 border-b border-bolt-elements-borderColor">
                <p className="text-sm font-medium text-bolt-elements-textPrimary">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-bolt-elements-textSecondary">
                  {user.email}
                </p>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    profile?.plan === 'basic' ? 'bg-gray-100 text-gray-800' :
                    profile?.plan === 'standard' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {profile?.plan?.charAt(0).toUpperCase()}{profile?.plan?.slice(1)} Plan
                  </span>
                </div>
              </div>
              
              <a
                href="/membership"
                className="block px-4 py-2 text-sm text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-bg-depth-2 transition-colors"
              >
                Manage Subscription
              </a>
              
              {profile?.is_admin && (
                <a
                  href="/admin"
                  className="block px-4 py-2 text-sm text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-bg-depth-2 transition-colors"
                >
                  Admin Dashboard
                </a>
              )}
              
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-bg-depth-2 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => openAuthModal('signin')}
        >
          Sign In
        </Button>
        <Button
          size="sm"
          onClick={() => openAuthModal('signup')}
        >
          Sign Up
        </Button>
      </div>
      
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
