// Core Application Types
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type AppRole = 'customer' | 'store_owner' | 'admin';
export type TimeSlotType = 'pre_order' | 'collection';

// Time Slot Interfaces
export interface TimeSlot {
  id: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  type: TimeSlotType;
  isAvailable: boolean;
  maxOrders?: number;
  currentOrders?: number;
}

export interface PreOrderTimeSlot extends TimeSlot {
  type: 'pre_order';
  // Pre-order slots: 9pm-9am (21:00-09:00)
  date: string; // YYYY-MM-DD format
}

export interface CollectionTimeSlot extends TimeSlot {
  type: 'collection';
  // Collection slots: 9am-2pm (09:00-14:00)
  date: string; // YYYY-MM-DD format
}

// Store Interfaces
export interface Store {
  id: string;
  name: string;
  description?: string;
  location: string;
  phone?: string;
  email?: string;
  image_url?: string;
  owner_id: string;
  is_active: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  // Extended for pre-order system
  accepts_pre_orders: boolean;
  pre_order_lead_time_hours: number; // Minimum hours needed for pre-orders
  collection_window_start: string; // HH:mm format
  collection_window_end: string; // HH:mm format
}

export interface StoreHours {
  id: string;
  store_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  open_time?: string; // HH:mm format
  close_time?: string; // HH:mm format
  is_closed: boolean;
  created_at: string;
}

// Food Item Interfaces
export interface FoodCategory {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface FoodItem {
  id: string;
  store_id: string;
  category_id?: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  preparation_time?: number; // in minutes
  created_at: string;
  updated_at: string;
  // Nested relations
  category?: FoodCategory;
  store?: Store;
  // Extended for pre-order system
  available_for_pre_order: boolean;
  max_daily_quantity?: number;
  min_order_quantity?: number;
}

// Cart Interfaces
export interface CartItem extends FoodItem {
  quantity: number;
  subtotal: number;
  scheduled_for?: string; // ISO date string for pre-orders
  collection_time_slot_id?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
  storeId: string | null;
  orderType: 'immediate' | 'pre_order';
  scheduledDate?: string; // YYYY-MM-DD for pre-orders
  collectionTimeSlotId?: string;
}

// Order Interfaces
export interface OrderItem {
  id: string;
  order_id: string;
  food_item_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
  // Relations
  food_item?: FoodItem;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  store_id: string;
  status: OrderStatus;
  total_amount: number;
  special_instructions?: string;
  pickup_time?: string; // ISO date string
  created_at: string;
  updated_at: string;
  // Relations
  items?: OrderItem[];
  store?: Store;
  customer?: UserProfile;
  // Extended for pre-order system
  order_type: 'immediate' | 'pre_order';
  scheduled_date?: string; // YYYY-MM-DD for pre-orders
  collection_time_slot_id?: string;
  collection_time_slot?: CollectionTimeSlot;
  pre_order_placed_at?: string; // ISO date string
}

// User Interfaces
export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  phone?: string;
  student_id?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

// API Response Interfaces
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Interfaces
export interface CheckoutFormData {
  specialInstructions?: string;
  orderType: 'immediate' | 'pre_order';
  scheduledDate?: string;
  collectionTimeSlotId?: string;
  phone?: string;
}

export interface PreOrderFormData {
  scheduledDate: string;
  collectionTimeSlotId: string;
  specialInstructions?: string;
}

// Time Slot Configuration
export interface TimeSlotConfig {
  preOrderSlots: {
    startHour: 21; // 9 PM
    endHour: 9; // 9 AM next day
    intervalMinutes: 30;
    daysInAdvance: 7; // How many days ahead can users pre-order
  };
  collectionSlots: {
    startHour: 9; // 9 AM
    endHour: 14; // 2 PM
    intervalMinutes: 15;
    maxOrdersPerSlot: 20;
  };
}

// Notification Interfaces
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'order_update' | 'pre_order_reminder' | 'collection_ready' | 'general';
  is_read: boolean;
  related_order_id?: string;
  created_at: string;
}

// Search and Filter Interfaces
export interface StoreFilters {
  location?: string;
  isActive?: boolean;
  acceptsPreOrders?: boolean;
  hasAvailableSlots?: boolean;
}

export interface FoodItemFilters {
  categoryId?: string;
  storeId?: string;
  isAvailable?: boolean;
  availableForPreOrder?: boolean;
  maxPrice?: number;
  minPrice?: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  orderType?: 'immediate' | 'pre_order';
  dateRange?: {
    start: string;
    end: string;
  };
  storeId?: string;
}