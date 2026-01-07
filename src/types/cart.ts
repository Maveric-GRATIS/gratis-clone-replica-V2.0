export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
    flavor?: string;
    material?: string;
  };
  image: string;
  category: 'beverage' | 'merch';
  description?: string;
  originalPrice?: number;
  badge?: string;
  rating?: number;
  reviews?: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
}

export interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}