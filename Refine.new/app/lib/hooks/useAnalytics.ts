import { useState, useEffect } from 'react';
import { supabase } from '~/lib/supabase/client';

export interface UserStats {
  total_users: number;
  free_users: number;
  standard_users: number;
  premium_users: number;
  new_users_30d: number;
  active_users_7d: number;
  active_users_30d: number;
}

export interface RevenueStats {
  total_payments: number;
  total_revenue_cents: number;
  avg_payment_cents: number;
  payments_30d: number;
  revenue_30d_cents: number;
  payments_7d: number;
  revenue_7d_cents: number;
}

export interface ProjectStats {
  total_projects: number;
  users_with_projects: number;
  avg_files_per_project: number;
  total_storage_bytes: number;
  projects_created_30d: number;
  active_projects_7d: number;
}

export interface DailyRegistration {
  date: string;
  registrations: number;
  free_registrations: number;
  paid_registrations: number;
}

export interface DailyRevenue {
  date: string;
  payment_count: number;
  revenue_cents: number;
}

export interface UserEngagement {
  id: string;
  email: string;
  plan: string;
  created_at: string;
  last_sign_in_at: string | null;
  project_count: number;
  total_actions: number;
  last_action_at: string | null;
  total_spent_cents: number;
}

export function useUserStats() {
  const [data, setData] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: stats, error } = await supabase
          .from('user_stats')
          .select('*')
          .single();

        if (error) throw error;
        setData(stats);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

export function useRevenueStats() {
  const [data, setData] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: stats, error } = await supabase
          .from('revenue_stats')
          .select('*')
          .single();

        if (error) throw error;
        setData(stats);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

export function useProjectStats() {
  const [data, setData] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: stats, error } = await supabase
          .from('project_stats')
          .select('*')
          .single();

        if (error) throw error;
        setData(stats);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

export function useDailyRegistrations() {
  const [data, setData] = useState<DailyRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: registrations, error } = await supabase
          .from('daily_registrations')
          .select('*')
          .order('date', { ascending: true });

        if (error) throw error;
        setData(registrations || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

export function useDailyRevenue() {
  const [data, setData] = useState<DailyRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: revenue, error } = await supabase
          .from('daily_revenue')
          .select('*')
          .order('date', { ascending: true });

        if (error) throw error;
        setData(revenue || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

export function useUserEngagement() {
  const [data, setData] = useState<UserEngagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const { data: engagement, error } = await supabase
        .from('user_engagement')
        .select('*')
        .order('total_spent_cents', { ascending: false })
        .limit(100);

      if (error) throw error;
      setData(engagement || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}
