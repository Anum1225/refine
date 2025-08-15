import { useState } from 'react';
import { Dialog, DialogRoot } from '~/components/ui/Dialog';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  const toggleMode = () => {
    setMode(prev => prev === 'signin' ? 'signup' : 'signin');
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={onClose}>
      <Dialog>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute -top-2 -right-2 w-8 h-8 bg-bolt-elements-bg-depth-1 border border-bolt-elements-borderColor rounded-full flex items-center justify-center text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors z-10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {mode === 'signin' ? (
              <SignInForm onToggleMode={toggleMode} onClose={onClose} />
            ) : (
              <SignUpForm onToggleMode={toggleMode} onClose={onClose} />
            )}
          </div>
        </div>
      </Dialog>
    </DialogRoot>
  );
}
