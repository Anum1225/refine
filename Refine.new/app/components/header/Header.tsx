import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';

export function Header() {
  const chat = useStore(chatStore);

  return (
    <header
      className={classNames('flex items-center px-4 border-b h-[var(--header-height)]', {
        'border-transparent': !chat.started,
        'border-bolt-elements-borderColor': chat.started,
      })}
    >
      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer">
        <button
          className="i-ph:sidebar-simple-duotone text-xl hover:text-accent-500 transition-colors p-1 rounded-md hover:bg-bolt-elements-bg-depth-2"
          onClick={() => {
            // Trigger sidebar toggle
            window.dispatchEvent(new CustomEvent('toggleSidebar'));
          }}
          title="Toggle Sidebar (Ctrl+B)"
        />
        <a href="/" className="text-2xl font-semibold text-accent flex items-center">
          <img src="/bolt-logo.svg" alt="Bolt.new" className="h-8 inline-block dark:hidden" />
          <img src="/bolt-logo-dark.svg" alt="Bolt.new" className="h-8 inline-block hidden dark:block" />
        </a>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-6 ml-8">
        <a
          href="/membership"
          className="text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors"
        >
          Membership
        </a>
      </nav>

      <div className="flex-1" />
      {chat.started && ( // Display ChatDescription and HeaderActionButtons only when the chat has started.
        <>
          <span className="flex-1 px-4 truncate text-center text-refine-elements-textPrimary">
            <ClientOnly>{() => <ChatDescription />}</ClientOnly>
          </span>
          <ClientOnly>
            {() => (
              <div className="">
                <HeaderActionButtons chatStarted={chat.started} />
              </div>
            )}
          </ClientOnly>
        </>
      )}
    </header>
  );
}
