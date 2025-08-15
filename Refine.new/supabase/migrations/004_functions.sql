-- Function to increment user usage count
CREATE OR REPLACE FUNCTION increment_usage_count(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  current_count INTEGER;
  usage_limit INTEGER;
  reset_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get current usage data
  SELECT usage_count, usage_limit, usage_reset_date 
  INTO current_count, usage_limit, reset_date
  FROM public.users 
  WHERE id = user_id;
  
  -- Check if usage period has expired and reset if needed
  IF reset_date < NOW() THEN
    -- Reset usage count and set new reset date
    UPDATE public.users 
    SET 
      usage_count = 1,
      usage_reset_date = NOW() + INTERVAL '1 month'
    WHERE id = user_id;
    
    RETURN 1;
  ELSE
    -- Increment usage count
    UPDATE public.users 
    SET usage_count = usage_count + 1
    WHERE id = user_id;
    
    RETURN current_count + 1;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can use AI features
CREATE OR REPLACE FUNCTION can_use_ai(user_id UUID)
RETURNS JSONB AS $$
DECLARE
  user_plan plan_type;
  current_count INTEGER;
  usage_limit INTEGER;
  reset_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get user data
  SELECT plan, usage_count, usage_limit, usage_reset_date 
  INTO user_plan, current_count, usage_limit, reset_date
  FROM public.users 
  WHERE id = user_id;
  
  -- If user not found
  IF user_plan IS NULL THEN
    RETURN jsonb_build_object(
      'can_use', false,
      'reason', 'user_not_found'
    );
  END IF;
  
  -- Basic plan users always use their own API
  IF user_plan = 'basic' THEN
    RETURN jsonb_build_object(
      'can_use', true,
      'reason', 'basic_plan',
      'usage_count', current_count,
      'usage_limit', usage_limit
    );
  END IF;
  
  -- Check if usage period has expired
  IF reset_date < NOW() THEN
    -- Reset usage and allow
    PERFORM increment_usage_count(user_id);
    RETURN jsonb_build_object(
      'can_use', true,
      'reason', 'period_reset',
      'usage_count', 0,
      'usage_limit', usage_limit
    );
  END IF;
  
  -- Check if within usage limit
  IF current_count < usage_limit THEN
    RETURN jsonb_build_object(
      'can_use', true,
      'reason', 'within_limit',
      'usage_count', current_count,
      'usage_limit', usage_limit
    );
  ELSE
    RETURN jsonb_build_object(
      'can_use', false,
      'reason', 'limit_exceeded',
      'usage_count', current_count,
      'usage_limit', usage_limit
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user plan and usage limits
CREATE OR REPLACE FUNCTION update_user_plan(
  user_id UUID,
  new_plan plan_type,
  stripe_customer_id TEXT DEFAULT NULL,
  subscription_id TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  new_limit INTEGER;
BEGIN
  -- Set usage limits based on plan
  CASE new_plan
    WHEN 'basic' THEN new_limit := 0;
    WHEN 'standard' THEN new_limit := 150;
    WHEN 'premium' THEN new_limit := 750;
    ELSE new_limit := 0;
  END CASE;
  
  -- Update user plan and reset usage
  UPDATE public.users 
  SET 
    plan = new_plan,
    usage_limit = new_limit,
    usage_count = 0,
    usage_reset_date = NOW() + INTERVAL '1 month',
    stripe_customer_id = COALESCE(update_user_plan.stripe_customer_id, users.stripe_customer_id),
    updated_at = NOW()
  WHERE id = user_id;
  
  -- Log the plan change
  INSERT INTO public.usage_analytics (user_id, action_type, metadata)
  VALUES (
    user_id,
    'plan_change',
    jsonb_build_object(
      'new_plan', new_plan,
      'new_limit', new_limit,
      'subscription_id', subscription_id
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_usage_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION can_use_ai(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_plan(UUID, plan_type, TEXT, TEXT) TO authenticated;
