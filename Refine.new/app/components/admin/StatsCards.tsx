import { useUserStats, useRevenueStats, useProjectStats } from '~/lib/hooks/useAnalytics';
import { Card } from '~/components/ui/Card';

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  loading = false 
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string; 
  icon: React.ReactNode; 
  loading?: boolean;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-bolt-elements-textSecondary">
            {title}
          </p>
          <div className="mt-2">
            {loading ? (
              <div className="h-8 w-20 bg-bolt-elements-bg-depth-3 rounded animate-pulse" />
            ) : (
              <p className="text-3xl font-bold text-bolt-elements-textPrimary">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
            )}
            {subtitle && (
              <p className="text-sm text-bolt-elements-textSecondary mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="p-3 bg-accent-100 rounded-full">
          {icon}
        </div>
      </div>
    </Card>
  );
}

export function StatsCards() {
  const { data: userStats, loading: userLoading } = useUserStats();
  const { data: revenueStats, loading: revenueLoading } = useRevenueStats();
  const { data: projectStats, loading: projectLoading } = useProjectStats();

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Users"
        value={userStats?.total_users || 0}
        subtitle={`${userStats?.new_users_30d || 0} new this month`}
        loading={userLoading}
        icon={
          <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        }
      />

      <StatCard
        title="Monthly Revenue"
        value={revenueStats ? formatCurrency(revenueStats.revenue_30d_cents) : '$0'}
        subtitle={`${revenueStats?.payments_30d || 0} payments`}
        loading={revenueLoading}
        icon={
          <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        }
      />

      <StatCard
        title="Active Users"
        value={userStats?.active_users_7d || 0}
        subtitle="Last 7 days"
        loading={userLoading}
        icon={
          <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        }
      />

      <StatCard
        title="Total Projects"
        value={projectStats?.total_projects || 0}
        subtitle={`${formatBytes(projectStats?.total_storage_bytes || 0)} storage`}
        loading={projectLoading}
        icon={
          <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        }
      />

      {/* Plan Distribution */}
      <StatCard
        title="Free Users"
        value={userStats?.free_users || 0}
        subtitle={`${Math.round(((userStats?.free_users || 0) / (userStats?.total_users || 1)) * 100)}% of total`}
        loading={userLoading}
        icon={
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      />

      <StatCard
        title="Standard Users"
        value={userStats?.standard_users || 0}
        subtitle={`${Math.round(((userStats?.standard_users || 0) / (userStats?.total_users || 1)) * 100)}% of total`}
        loading={userLoading}
        icon={
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        }
      />

      <StatCard
        title="Premium Users"
        value={userStats?.premium_users || 0}
        subtitle={`${Math.round(((userStats?.premium_users || 0) / (userStats?.total_users || 1)) * 100)}% of total`}
        loading={userLoading}
        icon={
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        }
      />

      <StatCard
        title="Total Revenue"
        value={revenueStats ? formatCurrency(revenueStats.total_revenue_cents) : '$0'}
        subtitle={`${revenueStats?.total_payments || 0} total payments`}
        loading={revenueLoading}
        icon={
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
      />
    </div>
  );
}
