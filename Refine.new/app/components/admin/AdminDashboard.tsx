import { useAuth } from '~/lib/auth/AuthContext';
import { StatsCards } from './StatsCards';
import { UserChart } from './UserChart';
import { RevenueChart } from './RevenueChart';
import { UserTable } from './UserTable';
import { Card } from '~/components/ui/Card';

export function AdminDashboard() {
  const { profile } = useAuth();

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bolt-elements-bg-depth-1">
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-bolt-elements-textPrimary mb-2">
            Access Denied
          </h2>
          <p className="text-bolt-elements-textSecondary">
            You don't have permission to access the admin dashboard.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bolt-elements-bg-depth-1">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-bolt-elements-textPrimary mb-2">
            Admin Dashboard
          </h1>
          <p className="text-bolt-elements-textSecondary">
            Monitor user activity, revenue, and system performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <UserChart />
          <RevenueChart />
        </div>

        {/* User Management Table */}
        <div className="mb-8">
          <UserTable />
        </div>
      </div>
    </div>
  );
}
