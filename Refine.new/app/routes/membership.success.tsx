import { json, type MetaFunction, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { Header } from '~/components/header/Header';
import { Button } from '~/components/ui/Button';
import { Card } from '~/components/ui/Card';

export const meta: MetaFunction = () => {
  return [
    { title: 'Payment Successful - Refine.new' }, 
    { name: 'description', content: 'Your subscription has been activated successfully!' }
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');
  
  return json({ sessionId });
}

export default function MembershipSuccessPage() {
  const { sessionId } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col h-screen bg-refine-elements-bg-depth-1">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-refine-elements-textPrimary mb-2">
              Payment Successful!
            </h1>
            <p className="text-refine-elements-textSecondary">
              Your subscription has been activated and you can now enjoy all the benefits of your plan.
            </p>
          </div>

          {sessionId && (
            <div className="mb-6 p-3 bg-refine-elements-bg-depth-2 rounded-lg">
              <p className="text-xs text-refine-elements-textSecondary">
                Session ID: {sessionId}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              className="w-full" 
              onClick={() => window.location.href = '/'}
            >
              Start Building
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = '/membership'}
            >
              View Plans
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-refine-elements-borderColor">
            <p className="text-xs text-refine-elements-textSecondary">
              You will receive a confirmation email shortly with your subscription details.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}
