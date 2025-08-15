import { useDailyRevenue } from '~/lib/hooks/useAnalytics';
import { Card } from '~/components/ui/Card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { format } from 'date-fns';
import { useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function RevenueChart() {
  const { data: revenue, loading } = useDailyRevenue();
  const [chartType, setChartType] = useState<'line' | 'bar'>('bar');

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-bolt-elements-bg-depth-3 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-bolt-elements-bg-depth-3 rounded"></div>
        </div>
      </Card>
    );
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const chartData = {
    labels: revenue.map(item => format(new Date(item.date), 'MMM dd')),
    datasets: [
      {
        label: 'Daily Revenue',
        data: revenue.map(item => item.revenue_cents / 100), // Convert to dollars
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `Revenue: ${formatCurrency(context.parsed.y * 100)}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 10,
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value * 100);
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const ChartComponent = chartType === 'line' ? Line : Bar;

  const totalRevenue = revenue.reduce((sum, item) => sum + item.revenue_cents, 0);
  const totalPayments = revenue.reduce((sum, item) => sum + item.payment_count, 0);
  const avgPayment = totalPayments > 0 ? totalRevenue / totalPayments : 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">
          Daily Revenue
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              chartType === 'line'
                ? 'bg-accent-500 text-white'
                : 'bg-bolt-elements-bg-depth-2 text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary'
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              chartType === 'bar'
                ? 'bg-accent-500 text-white'
                : 'bg-bolt-elements-bg-depth-2 text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary'
            }`}
          >
            Bar
          </button>
        </div>
      </div>
      
      <div className="h-64">
        <ChartComponent data={chartData} options={options} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(totalRevenue)}
          </p>
          <p className="text-sm text-bolt-elements-textSecondary">Total Revenue</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-bolt-elements-textPrimary">
            {totalPayments}
          </p>
          <p className="text-sm text-bolt-elements-textSecondary">Total Payments</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(avgPayment)}
          </p>
          <p className="text-sm text-bolt-elements-textSecondary">Avg Payment</p>
        </div>
      </div>
    </Card>
  );
}
