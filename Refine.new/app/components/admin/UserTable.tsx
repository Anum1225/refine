import { useState, useEffect } from 'react';
import { useUserEngagement } from '~/lib/hooks/useAnalytics';
import { Card } from '~/components/ui/Card';
import { Badge } from '~/components/ui/Badge';
import { Button } from '~/components/ui/Button';
import { supabase } from '~/lib/supabase/client';
import { format } from 'date-fns';

export function UserTable() {
  const { data: users, loading, refetch } = useUserEngagement();
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState<'all' | 'basic' | 'standard' | 'premium'>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'total_spent_cents' | 'project_count'>('total_spent_cents');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlan = planFilter === 'all' || user.plan === planFilter;
      return matchesSearch && matchesPlan;
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-gray-100 text-gray-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-bolt-elements-bg-depth-3 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-bolt-elements-bg-depth-3 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">
          User Management
        </h3>
        <Button onClick={refetch} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-bolt-elements-borderColor rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent bg-bolt-elements-bg-depth-1 text-bolt-elements-textPrimary"
          />
        </div>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value as any)}
          className="px-3 py-2 border border-bolt-elements-borderColor rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent bg-bolt-elements-bg-depth-1 text-bolt-elements-textPrimary"
        >
          <option value="all">All Plans</option>
          <option value="basic">Basic</option>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-bolt-elements-borderColor">
              <th className="text-left py-3 px-4 font-medium text-bolt-elements-textSecondary">
                Email
              </th>
              <th className="text-left py-3 px-4 font-medium text-bolt-elements-textSecondary">
                Plan
              </th>
              <th 
                className="text-left py-3 px-4 font-medium text-bolt-elements-textSecondary cursor-pointer hover:text-bolt-elements-textPrimary"
                onClick={() => handleSort('project_count')}
              >
                Projects {sortBy === 'project_count' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="text-left py-3 px-4 font-medium text-bolt-elements-textSecondary cursor-pointer hover:text-bolt-elements-textPrimary"
                onClick={() => handleSort('total_spent_cents')}
              >
                Total Spent {sortBy === 'total_spent_cents' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="text-left py-3 px-4 font-medium text-bolt-elements-textSecondary cursor-pointer hover:text-bolt-elements-textPrimary"
                onClick={() => handleSort('created_at')}
              >
                Joined {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="text-left py-3 px-4 font-medium text-bolt-elements-textSecondary">
                Last Active
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-bolt-elements-borderColor hover:bg-bolt-elements-bg-depth-2">
                <td className="py-3 px-4">
                  <div className="text-bolt-elements-textPrimary font-medium">
                    {user.email}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge className={getPlanBadgeColor(user.plan)}>
                    {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-bolt-elements-textPrimary">
                  {user.project_count}
                </td>
                <td className="py-3 px-4 text-bolt-elements-textPrimary">
                  {formatCurrency(user.total_spent_cents)}
                </td>
                <td className="py-3 px-4 text-bolt-elements-textSecondary">
                  {format(new Date(user.created_at), 'MMM dd, yyyy')}
                </td>
                <td className="py-3 px-4 text-bolt-elements-textSecondary">
                  {user.last_sign_in_at 
                    ? format(new Date(user.last_sign_in_at), 'MMM dd, yyyy')
                    : 'Never'
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-bolt-elements-textSecondary">
            No users found matching your criteria.
          </p>
        </div>
      )}

      <div className="mt-4 text-sm text-bolt-elements-textSecondary">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </Card>
  );
}
