import { useState, useContext, createContext, ReactNode } from 'react';
import { FoodItem } from './useStores';

export interface CartItem extends FoodItem {
  quantity: number;
  subtotal: number;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (item: FoodItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  storeId: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);

  const addItem = (item: FoodItem, quantity = 1) => {
    // If cart is empty or contains items from same store, proceed
    if (items.length === 0 || storeId === item.store_id) {
      setStoreId(item.store_id);
      
      setItems(prev => {
        const existingItem = prev.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
          return prev.map(cartItem =>
            cartItem.id === item.id
              ? {
                  ...cartItem,
                  quantity: cartItem.quantity + quantity,
                  subtotal: (cartItem.quantity + quantity) * cartItem.price
                }
              : cartItem
          );
        }
        
        return [...prev, {
          ...item,
          quantity,
          subtotal: quantity * item.price
        }];
      });
    } else {
      // Different store - would need confirmation dialog in real app
      throw new Error('Cannot add items from different stores to cart');
    }
  };

  const removeItem = (itemId: string) => {
    setItems(prev => {
      const newItems = prev.filter(item => item.id !== itemId);
      if (newItems.length === 0) {
        setStoreId(null);
      }
      return newItems;
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.price
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setStoreId(null);
  };

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items,
    storeId,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};