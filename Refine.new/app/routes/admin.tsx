import { type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { Header } from '~/components/header/Header';
import { AdminDashboard } from '~/components/admin/AdminDashboard';

export const meta: MetaFunction = () => {
  return [
    { title: 'Admin Dashboard - Bolt.new' },
    { name: 'description', content: 'Admin dashboard for managing users, analytics, and system performance' }
  ];
};

export default function AdminPage() {
  return (
    <div className="flex flex-col h-screen bg-refine-elements-bg-depth-1">
      <Header />
      <main className="flex-1 overflow-auto">
        <ClientOnly>
          {() => <AdminDashboard />}
        </ClientOnly>
      </main>
    </div>
  );
}
