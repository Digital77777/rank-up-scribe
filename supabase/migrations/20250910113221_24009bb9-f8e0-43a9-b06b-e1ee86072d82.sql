-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'store_owner', 'customer');

-- Create enum for order status
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'collected', 'cancelled');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  student_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create stores table
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  location TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create store_hours table
CREATE TABLE public.store_hours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create food_categories table
CREATE TABLE public.food_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create food_items table
CREATE TABLE public.food_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.food_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  preparation_time INTEGER DEFAULT 15, -- minutes
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,
  status order_status NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  pickup_time TIMESTAMP WITH TIME ZONE,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table (junction table)
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  food_item_id UUID NOT NULL REFERENCES public.food_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_order_number TEXT;
BEGIN
  new_order_number := 'ORD' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(NEXTVAL('order_number_seq')::TEXT, 4, '0');
  RETURN new_order_number;
END;
$$;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create function for order number trigger
CREATE OR REPLACE FUNCTION public.set_order_number_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := public.generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON public.stores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_food_items_updated_at
  BEFORE UPDATE ON public.food_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-generate order numbers
CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_order_number_trigger();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles FOR SELECT 
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" 
  ON public.user_roles FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for stores
CREATE POLICY "Everyone can view approved active stores" 
  ON public.stores FOR SELECT 
  USING (is_approved = true AND is_active = true);

CREATE POLICY "Store owners can view their own stores" 
  ON public.stores FOR SELECT 
  USING (auth.uid() = owner_id);

CREATE POLICY "Admins can view all stores" 
  ON public.stores FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Store owners can create stores" 
  ON public.stores FOR INSERT 
  WITH CHECK (auth.uid() = owner_id AND public.has_role(auth.uid(), 'store_owner'));

CREATE POLICY "Store owners can update their own stores" 
  ON public.stores FOR UPDATE 
  USING (auth.uid() = owner_id);

CREATE POLICY "Admins can update all stores" 
  ON public.stores FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for store_hours
CREATE POLICY "Everyone can view store hours for active stores" 
  ON public.store_hours FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE id = store_hours.store_id 
      AND is_approved = true AND is_active = true
    )
  );

CREATE POLICY "Store owners can manage their store hours" 
  ON public.store_hours FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE id = store_hours.store_id 
      AND owner_id = auth.uid()
    )
  );

-- RLS Policies for food_categories
CREATE POLICY "Everyone can view categories" 
  ON public.food_categories FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage categories" 
  ON public.food_categories FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for food_items
CREATE POLICY "Everyone can view available food items from active stores" 
  ON public.food_items FOR SELECT 
  USING (
    is_available = true AND
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE id = food_items.store_id 
      AND is_approved = true AND is_active = true
    )
  );

CREATE POLICY "Store owners can manage their food items" 
  ON public.food_items FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE id = food_items.store_id 
      AND owner_id = auth.uid()
    )
  );

-- RLS Policies for orders
CREATE POLICY "Customers can view their own orders" 
  ON public.orders FOR SELECT 
  USING (auth.uid() = customer_id);

CREATE POLICY "Store owners can view orders for their stores" 
  ON public.orders FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE id = orders.store_id 
      AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create their own orders" 
  ON public.orders FOR INSERT 
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Store owners can update orders for their stores" 
  ON public.orders FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE id = orders.store_id 
      AND owner_id = auth.uid()
    )
  );

-- RLS Policies for order_items
CREATE POLICY "Users can view order items for their orders" 
  ON public.order_items FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_items.order_id 
      AND (customer_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.stores 
        WHERE id = orders.store_id 
        AND owner_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Customers can insert order items for their orders" 
  ON public.order_items FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_items.order_id 
      AND customer_id = auth.uid()
    )
  );

-- Insert default food categories
INSERT INTO public.food_categories (name, description) VALUES
  ('Breakfast', 'Morning meals and beverages'),
  ('Lunch', 'Midday meals and combos'),
  ('Dinner', 'Evening meals and hearty options'),
  ('Snacks', 'Light bites and quick foods'),
  ('Beverages', 'Drinks, coffee, and refreshments'),
  ('Desserts', 'Sweet treats and desserts');

-- Create indexes for better performance
CREATE INDEX idx_stores_active_approved ON public.stores (is_active, is_approved);
CREATE INDEX idx_food_items_store_available ON public.food_items (store_id, is_available);
CREATE INDEX idx_orders_customer ON public.orders (customer_id);
CREATE INDEX idx_orders_store ON public.orders (store_id);
CREATE INDEX idx_orders_status ON public.orders (status);
CREATE INDEX idx_order_items_order ON public.order_items (order_id);
CREATE INDEX idx_user_roles_user ON public.user_roles (user_id);