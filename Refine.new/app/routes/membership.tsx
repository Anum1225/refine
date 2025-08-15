import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { Header } from '~/components/header/Header';
import { MembershipPlans } from '~/components/membership/MembershipPlans.client';

export const meta: MetaFunction = () => {
  return [
    { title: 'Membership Plans - Refine.new' }, 
    { name: 'description', content: 'Choose your perfect plan - Basic, Standard, or Premium. Get AI-powered development assistance with flexible usage options.' }
  ];
};

export default function MembershipPage() {
  return (
    <div className="flex flex-col h-screen bg-refine-elements-bg-depth-1">
      <Header />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-refine-elements-textPrimary mb-4">
              Choose Your Plan
            </h1>
            <p className="text-lg lg:text-xl text-refine-elements-textSecondary max-w-3xl mx-auto">
              Get AI-powered development assistance with flexible usage options. 
              Start free or upgrade for enhanced features and usage credits.
            </p>
          </div>
          
          <ClientOnly>
            {() => <MembershipPlans />}
          </ClientOnly>
        </div>
      </main>
    </div>
  );
}
