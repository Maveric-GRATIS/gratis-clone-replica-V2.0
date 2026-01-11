import { CartItem } from '@/types/cart';
import { db } from '@/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const CART_STORAGE_KEY = 'liquid-death-cart';

export const saveCartToStorage = (items: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

export const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return [];
  }
};

export const clearCartStorage = (): void => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear cart from localStorage:', error);
  }
};

// Save cart to Firestore for logged-in users
export const saveCartToFirestore = async (userId: string, items: CartItem[]): Promise<void> => {
  try {
    const cartRef = doc(db, 'carts', userId);
    await setDoc(cartRef, {
      items,
      updatedAt: new Date().toISOString(),
    });
    console.log('Cart saved to Firestore');
  } catch (error) {
    console.error('Failed to save cart to Firestore:', error);
  }
};

// Load cart from Firestore for logged-in users
export const loadCartFromFirestore = async (userId: string): Promise<CartItem[]> => {
  try {
    const cartRef = doc(db, 'carts', userId);
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) {
      const data = cartDoc.data();
      console.log('Cart loaded from Firestore:', data.items?.length || 0, 'items');
      return data.items || [];
    }

    console.log('No cart found in Firestore');
    return [];
  } catch (error) {
    console.error('Failed to load cart from Firestore:', error);
    return [];
  }
};