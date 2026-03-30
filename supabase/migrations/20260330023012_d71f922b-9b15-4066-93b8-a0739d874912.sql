
-- Pricing plans table (admin configurable monthly/yearly prices per plan)
CREATE TABLE public.pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_key TEXT NOT NULL UNIQUE,
  plan_name TEXT NOT NULL,
  description TEXT,
  monthly_price NUMERIC NOT NULL DEFAULT 0,
  yearly_price NUMERIC NOT NULL DEFAULT 0,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Discount codes / offers table
CREATE TABLE public.discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL DEFAULT 0,
  offer_type TEXT NOT NULL DEFAULT 'general' CHECK (offer_type IN ('general', 'early_bird', 'event', 'seasonal', 'referral')),
  applicable_plans TEXT[] DEFAULT '{}',
  max_uses INTEGER,
  current_uses INTEGER NOT NULL DEFAULT 0,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can view active pricing plans (public facing)
CREATE POLICY "Anyone can view active plans" ON public.pricing_plans FOR SELECT TO authenticated USING (true);
-- Admins can manage pricing plans
CREATE POLICY "Admins can manage plans" ON public.pricing_plans FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage discount codes
CREATE POLICY "Admins can manage discounts" ON public.discount_codes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
-- Authenticated users can view active discount codes (for validation)
CREATE POLICY "Users can view active discounts" ON public.discount_codes FOR SELECT TO authenticated USING (is_active = true);

-- Seed default pricing plans
INSERT INTO public.pricing_plans (plan_key, plan_name, description, monthly_price, yearly_price, features, is_active, is_popular, sort_order) VALUES
('free', 'Free', 'Get started with basic market data', 0, 0, '["Market Dashboard","Basic Watchlist (5 stocks)","Daily Market Brief","Basic Scanner"]'::jsonb, true, false, 0),
('pro', 'Pro', 'For serious traders who need an edge', 999, 9990, '["Everything in Free","Full Options Chain","OI Analysis","AI Stock Analysis","Advanced Screener","Price Alerts (20)","Unlimited Watchlist"]'::jsonb, true, true, 1),
('premium', 'Premium', 'Ultimate trading arsenal for professionals', 2499, 24990, '["Everything in Pro","AI Trading Agent","FII/DII Live Data","Sector Heatmaps","VWAP Scanner","Priority Support","Early Access Features","Unlimited Alerts"]'::jsonb, true, false, 2);
