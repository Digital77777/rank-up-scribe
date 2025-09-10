import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Store {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  location: string;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  is_approved: boolean;
}

export interface FoodItem {
  id: string;
  store_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  preparation_time: number;
  category?: {
    name: string;
  };
}

export interface FoodCategory {
  id: string;
  name: string;
  description: string | null;
}

export const useStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('is_active', true)
        .eq('is_approved', true)
        .order('name');

      if (error) throw error;
      setStores(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return { stores, loading, error, refetch: fetchStores };
};

export const useStoreMenu = (storeId: string | null) => {
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = async () => {
    if (!storeId) {
      setMenuItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch menu items with categories
      const { data: items, error: itemsError } = await supabase
        .from('food_items')
        .select(`
          *,
          category:food_categories(name)
        `)
        .eq('store_id', storeId)
        .eq('is_available', true)
        .order('name');

      if (itemsError) throw itemsError;

      // Fetch all categories
      const { data: cats, error: catsError } = await supabase
        .from('food_categories')
        .select('*')
        .order('name');

      if (catsError) throw catsError;

      setMenuItems(items || []);
      setCategories(cats || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [storeId]);

  return { menuItems, categories, loading, error, refetch: fetchMenu };
};