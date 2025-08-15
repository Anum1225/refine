import { atom } from 'nanostores';

export interface UsageData {
  plan: 'basic' | 'standard' | 'premium';
  freeUsageRemaining: number;
  totalFreeUsage: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  subscriptionId?: string;
  customerId?: string;
}

export const DEFAULT_USAGE: UsageData = {
  plan: 'basic',
  freeUsageRemaining: 0,
  totalFreeUsage: 0,
  currentPeriodStart: new Date().toISOString(),
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
};

export const usageStore = atom<UsageData>(initUsageStore());

function initUsageStore(): UsageData {
  if (!import.meta.env.SSR) {
    const storedUsage = localStorage.getItem('refine_usage');
    if (storedUsage) {
      try {
        return JSON.parse(storedUsage);
      } catch (error) {
        console.error('Error parsing stored usage data:', error);
      }
    }
  }
  return DEFAULT_USAGE;
}

export function updateUsage(usage: Partial<UsageData>) {
  const currentUsage = usageStore.get();
  const newUsage = { ...currentUsage, ...usage };
  
  usageStore.set(newUsage);
  
  if (!import.meta.env.SSR) {
    localStorage.setItem('refine_usage', JSON.stringify(newUsage));
  }
}

export function decrementUsage() {
  const currentUsage = usageStore.get();
  
  if (currentUsage.freeUsageRemaining > 0) {
    updateUsage({
      freeUsageRemaining: currentUsage.freeUsageRemaining - 1
    });
    return true; // Used free credit
  }
  
  return false; // No free credits remaining
}

export function setPlan(plan: 'basic' | 'standard' | 'premium', subscriptionId?: string, customerId?: string) {
  const freeUsage = {
    basic: 0,
    standard: 150,
    premium: 750,
  };

  const now = new Date();
  const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

  updateUsage({
    plan,
    freeUsageRemaining: freeUsage[plan],
    totalFreeUsage: freeUsage[plan],
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: periodEnd.toISOString(),
    subscriptionId,
    customerId,
  });
}

export function resetUsageForNewPeriod() {
  const currentUsage = usageStore.get();
  const freeUsage = {
    basic: 0,
    standard: 150,
    premium: 750,
  };

  const now = new Date();
  const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  updateUsage({
    freeUsageRemaining: freeUsage[currentUsage.plan],
    totalFreeUsage: freeUsage[currentUsage.plan],
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: periodEnd.toISOString(),
  });
}

export function canUseAI(): boolean {
  const usage = usageStore.get();
  return usage.plan === 'basic' || usage.freeUsageRemaining > 0;
}

export function getUsageMessage(): string {
  const usage = usageStore.get();
  
  if (usage.plan === 'basic') {
    return 'Using your own API keys';
  }
  
  if (usage.freeUsageRemaining > 0) {
    return `${usage.freeUsageRemaining} free uses remaining this month`;
  }
  
  return 'Free usage exhausted - using your own API keys';
}
