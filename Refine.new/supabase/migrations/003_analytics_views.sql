-- Analytics views for admin dashboard

-- User statistics view
CREATE VIEW public.user_stats AS
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN plan = 'basic' THEN 1 END) as free_users,
  COUNT(CASE WHEN plan = 'standard' THEN 1 END) as standard_users,
  COUNT(CASE WHEN plan = 'premium' THEN 1 END) as premium_users,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_users_30d,
  COUNT(CASE WHEN last_sign_in_at >= NOW() - INTERVAL '7 days' THEN 1 END) as active_users_7d,
  COUNT(CASE WHEN last_sign_in_at >= NOW() - INTERVAL '30 days' THEN 1 END) as active_users_30d
FROM public.users;

-- Revenue statistics view
CREATE VIEW public.revenue_stats AS
SELECT 
  COUNT(*) as total_payments,
  SUM(amount) as total_revenue_cents,
  AVG(amount) as avg_payment_cents,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as payments_30d,
  SUM(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN amount ELSE 0 END) as revenue_30d_cents,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as payments_7d,
  SUM(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN amount ELSE 0 END) as revenue_7d_cents
FROM public.payment_history
WHERE status = 'succeeded';

-- Project statistics view
CREATE VIEW public.project_stats AS
SELECT 
  COUNT(*) as total_projects,
  COUNT(DISTINCT user_id) as users_with_projects,
  AVG(file_count) as avg_files_per_project,
  SUM(size_bytes) as total_storage_bytes,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as projects_created_30d,
  COUNT(CASE WHEN last_accessed_at >= NOW() - INTERVAL '7 days' THEN 1 END) as active_projects_7d
FROM public.projects;

-- Usage analytics view
CREATE VIEW public.usage_stats AS
SELECT 
  action_type,
  COUNT(*) as total_actions,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as actions_30d,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as actions_7d
FROM public.usage_analytics
GROUP BY action_type;

-- Daily user registrations view
CREATE VIEW public.daily_registrations AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as registrations,
  COUNT(CASE WHEN plan = 'basic' THEN 1 END) as free_registrations,
  COUNT(CASE WHEN plan != 'basic' THEN 1 END) as paid_registrations
FROM public.users
WHERE created_at >= NOW() - INTERVAL '90 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Daily revenue view
CREATE VIEW public.daily_revenue AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as payment_count,
  SUM(amount) as revenue_cents
FROM public.payment_history
WHERE status = 'succeeded' AND created_at >= NOW() - INTERVAL '90 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Monthly active users view
CREATE VIEW public.monthly_active_users AS
SELECT 
  DATE_TRUNC('month', last_sign_in_at) as month,
  COUNT(DISTINCT id) as active_users,
  COUNT(CASE WHEN plan = 'basic' THEN 1 END) as free_active_users,
  COUNT(CASE WHEN plan != 'basic' THEN 1 END) as paid_active_users
FROM public.users
WHERE last_sign_in_at >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', last_sign_in_at)
ORDER BY month DESC;

-- User engagement metrics
CREATE VIEW public.user_engagement AS
SELECT 
  u.id,
  u.email,
  u.plan,
  u.created_at,
  u.last_sign_in_at,
  COUNT(p.id) as project_count,
  COUNT(ua.id) as total_actions,
  MAX(ua.created_at) as last_action_at,
  COALESCE(SUM(ph.amount), 0) as total_spent_cents
FROM public.users u
LEFT JOIN public.projects p ON u.id = p.user_id
LEFT JOIN public.usage_analytics ua ON u.id = ua.user_id
LEFT JOIN public.payment_history ph ON u.id = ph.user_id AND ph.status = 'succeeded'
GROUP BY u.id, u.email, u.plan, u.created_at, u.last_sign_in_at;

-- Subscription analytics
CREATE VIEW public.subscription_analytics AS
SELECT 
  s.plan,
  s.status,
  COUNT(*) as subscription_count,
  COUNT(CASE WHEN s.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_subscriptions_30d,
  COUNT(CASE WHEN s.canceled_at >= NOW() - INTERVAL '30 days' THEN 1 END) as canceled_subscriptions_30d,
  AVG(EXTRACT(EPOCH FROM (COALESCE(s.canceled_at, NOW()) - s.created_at))/86400) as avg_lifetime_days
FROM public.subscriptions s
GROUP BY s.plan, s.status;

-- Grant access to views for admins
GRANT SELECT ON public.user_stats TO authenticated;
GRANT SELECT ON public.revenue_stats TO authenticated;
GRANT SELECT ON public.project_stats TO authenticated;
GRANT SELECT ON public.usage_stats TO authenticated;
GRANT SELECT ON public.daily_registrations TO authenticated;
GRANT SELECT ON public.daily_revenue TO authenticated;
GRANT SELECT ON public.monthly_active_users TO authenticated;
GRANT SELECT ON public.user_engagement TO authenticated;
GRANT SELECT ON public.subscription_analytics TO authenticated;
