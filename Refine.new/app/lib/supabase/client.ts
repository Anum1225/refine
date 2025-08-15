import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper function to get the current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Helper function to get user profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

// Helper function to update user profile
export const updateUserProfile = async (userId: string, updates: Partial<Database['public']['Tables']['users']['Update']>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Helper function to track usage
export const trackUsage = async (actionType: string, metadata: Record<string, any> = {}) => {
  const user = await getCurrentUser();
  if (!user) return;

  const { error } = await supabase
    .from('usage_analytics')
    .insert({
      user_id: user.id,
      action_type: actionType,
      metadata,
    });

  if (error) {
    console.error('Error tracking usage:', error);
  }
};

// Helper function to increment user usage count
export const incrementUsageCount = async (userId: string) => {
  const { data, error } = await supabase.rpc('increment_usage_count', {
    user_id: userId
  });
  
  if (error) throw error;
  return data;
};

// Helper function to check if user can use AI features
export const canUseAI = async (userId: string) => {
  const profile = await getUserProfile(userId);
  
  if (profile.plan === 'basic') {
    return { canUse: true, reason: 'basic_plan' };
  }
  
  if (profile.usage_count < profile.usage_limit) {
    return { canUse: true, reason: 'within_limit' };
  }
  
  return { canUse: false, reason: 'limit_exceeded' };
};
