import { useState } from 'react';
import { Button } from '~/components/ui/Button';
import { Card } from '~/components/ui/Card';
import { Badge } from '~/components/ui/Badge';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: PlanFeature[];
  buttonText: string;
  buttonVariant: 'default' | 'outline' | 'secondary';
  popular?: boolean;
  apiUsage: string;
  stripeProductId?: string;
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 'Free',
    period: 'forever',
    description: 'Perfect for getting started with AI development assistance',
    apiUsage: 'Bring your own API keys',
    features: [
      { text: 'Unlimited projects', included: true },
      { text: 'Code generation & editing', included: true },
      { text: 'Terminal access', included: true },
      { text: 'File management', included: true },
      { text: 'Bring your own API keys', included: true },
      { text: 'Community support', included: true },
      { text: 'Free usage credits', included: false },
      { text: 'Priority support', included: false },
      { text: 'Advanced features', included: false },
    ],
    buttonText: 'Get Started Free',
    buttonVariant: 'outline',
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '$19',
    period: 'per month',
    description: 'Great for regular developers who want convenience',
    apiUsage: '150 free uses/month + your own API',
    popular: true,
    features: [
      { text: 'Everything in Basic', included: true },
      { text: '150 free AI requests/month', included: true },
      { text: 'Multiple AI providers', included: true },
      { text: 'Priority processing', included: true },
      { text: 'Email support', included: true },
      { text: 'Usage analytics', included: true },
      { text: 'Bring your own API for extra usage', included: true },
      { text: 'Advanced features', included: false },
      { text: 'Custom integrations', included: false },
    ],
    buttonText: 'Start Standard Plan',
    buttonVariant: 'default',
    stripeProductId: 'price_standard_monthly',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$49',
    period: 'per month',
    description: 'For power users and teams who need maximum flexibility',
    apiUsage: '750 free uses/month + your own API',
    features: [
      { text: 'Everything in Standard', included: true },
      { text: '750 free AI requests/month', included: true },
      { text: 'All AI providers', included: true },
      { text: 'Fastest processing', included: true },
      { text: 'Priority support', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Team collaboration', included: true },
      { text: 'API access', included: true },
    ],
    buttonText: 'Start Premium Plan',
    buttonVariant: 'default',
    stripeProductId: 'price_premium_monthly',
  },
];

export function MembershipPlans() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handlePlanSelect = async (plan: Plan) => {
    if (plan.id === 'basic') {
      // Set basic plan and redirect to main app
      const { setPlan } = await import('~/lib/stores/usage');
      setPlan('basic');
      window.location.href = '/';
      return;
    }

    setIsLoading(plan.id);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: plan.stripeProductId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json() as { url: string };

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error starting checkout:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {plans.map((plan) => (
        <Card 
          key={plan.id} 
          className={`relative p-8 ${plan.popular ? 'ring-2 ring-accent-500 shadow-lg' : ''}`}
        >
          {plan.popular && (
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent-500 text-white">
              Most Popular
            </Badge>
          )}
          
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-refine-elements-textPrimary mb-2">
              {plan.name}
            </h3>
            <div className="mb-2">
              <span className="text-4xl font-bold text-refine-elements-textPrimary">
                {plan.price}
              </span>
              {plan.period && (
                <span className="text-refine-elements-textSecondary ml-2">
                  {plan.period}
                </span>
              )}
            </div>
            <p className="text-refine-elements-textSecondary mb-4">
              {plan.description}
            </p>
            <div className="bg-refine-elements-bg-depth-2 rounded-lg p-3 mb-6">
              <p className="text-sm font-medium text-accent-600">
                {plan.apiUsage}
              </p>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                  feature.included 
                    ? 'bg-accent-100 text-accent-600' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {feature.included ? '✓' : '×'}
                </div>
                <span className={`text-sm ${
                  feature.included 
                    ? 'text-refine-elements-textPrimary' 
                    : 'text-refine-elements-textTertiary'
                }`}>
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>

          <Button
            variant={plan.buttonVariant}
            className="w-full"
            onClick={() => handlePlanSelect(plan)}
            disabled={isLoading === plan.id}
          >
            {isLoading === plan.id ? 'Processing...' : plan.buttonText}
          </Button>
        </Card>
      ))}
    </div>
  );
}
