import { useStore } from '@nanostores/react';
import { usageStore, getUsageMessage } from '~/lib/stores/usage';
import { Badge } from '~/components/ui/Badge';
import { Progress } from '~/components/ui/Progress';

export function UsageDisplay() {
  const usage = useStore(usageStore);
  const message = getUsageMessage();

  const getProgressValue = () => {
    if (usage.plan === 'basic' || usage.totalFreeUsage === 0) return 0;
    return ((usage.totalFreeUsage - usage.freeUsageRemaining) / usage.totalFreeUsage) * 100;
  };

  const getPlanColor = () => {
    switch (usage.plan) {
      case 'basic': return 'bg-gray-100 text-gray-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-refine-elements-bg-depth-2 rounded-lg p-4 border border-refine-elements-borderColor">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-refine-elements-textPrimary">
          Current Plan
        </h3>
        <Badge className={getPlanColor()}>
          {usage.plan.charAt(0).toUpperCase() + usage.plan.slice(1)}
        </Badge>
      </div>
      
      <p className="text-sm text-refine-elements-textSecondary mb-3">
        {message}
      </p>

      {usage.plan !== 'basic' && usage.totalFreeUsage > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-refine-elements-textSecondary">
            <span>Usage this month</span>
            <span>{usage.totalFreeUsage - usage.freeUsageRemaining} / {usage.totalFreeUsage}</span>
          </div>
          <Progress value={getProgressValue()} className="h-2" />
        </div>
      )}

      {usage.plan !== 'basic' && usage.freeUsageRemaining === 0 && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-800">
            You've used all your free credits for this month. You can still use the service with your own API keys.
          </p>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-refine-elements-borderColor">
        <a 
          href="/membership" 
          className="text-xs text-accent-600 hover:text-accent-700 transition-colors"
        >
          {usage.plan === 'basic' ? 'Upgrade Plan' : 'Manage Subscription'}
        </a>
      </div>
    </div>
  );
}
