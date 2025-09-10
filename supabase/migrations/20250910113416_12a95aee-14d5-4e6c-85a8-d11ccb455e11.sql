-- Fix search_path for existing functions
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_order_number TEXT;
BEGIN
  new_order_number := 'ORD' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(NEXTVAL('order_number_seq')::TEXT, 4, '0');
  RETURN new_order_number;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_order_number_trigger()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := public.generate_order_number();
  END IF;
  RETURN NEW;
END;
$$;