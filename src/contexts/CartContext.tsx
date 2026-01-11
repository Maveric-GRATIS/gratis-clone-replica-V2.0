import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartItem, CartState, CartContextType } from "@/types/cart";
import {
  saveCartToStorage,
  loadCartFromStorage,
  clearCartStorage,
  saveCartToFirestore,
  loadCartFromFirestore,
} from "@/lib/cart-storage";
import { useAuth } from "@/contexts/AuthContext";

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return { totalItems, totalPrice };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.id === action.payload.id &&
          JSON.stringify(item.variant) ===
            JSON.stringify(action.payload.variant)
      );

      let newItems: CartItem[];
      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      const totals = calculateTotals(newItems);
      return { ...state, items: newItems, ...totals };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      const totals = calculateTotals(newItems);
      return { ...state, items: newItems, ...totals };
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        )
        .filter((item) => item.quantity > 0);

      const totals = calculateTotals(newItems);
      return { ...state, items: newItems, ...totals };
    }

    case "CLEAR_CART":
      return { ...state, items: [], totalItems: 0, totalPrice: 0 };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "OPEN_CART":
      return { ...state, isOpen: true };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    case "LOAD_CART": {
      const totals = calculateTotals(action.payload);
      return { ...state, items: action.payload, ...totals };
    }

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  // Load cart on mount and when user changes
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        // User is logged in - load from Firestore
        const firestoreItems = await loadCartFromFirestore(user.uid);
        if (firestoreItems.length > 0) {
          dispatch({ type: "LOAD_CART", payload: firestoreItems });
          // Also save to localStorage for offline access
          saveCartToStorage(firestoreItems);
        } else {
          // No cart in Firestore, check localStorage
          const localItems = loadCartFromStorage();
          if (localItems.length > 0) {
            dispatch({ type: "LOAD_CART", payload: localItems });
            // Save to Firestore
            await saveCartToFirestore(user.uid, localItems);
          }
        }
      } else {
        // User is not logged in - load from localStorage only
        const savedItems = loadCartFromStorage();
        if (savedItems.length > 0) {
          dispatch({ type: "LOAD_CART", payload: savedItems });
        }
      }
    };

    loadCart();
  }, [user]);

  // Save cart to localStorage and Firestore whenever items change
  useEffect(() => {
    saveCartToStorage(state.items);

    // If user is logged in, also save to Firestore
    if (user) {
      saveCartToFirestore(user.uid, state.items);
    }
  }, [state.items, user]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    clearCartStorage();
  };

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" });
  };

  const openCart = () => {
    dispatch({ type: "OPEN_CART" });
  };

  const closeCart = () => {
    dispatch({ type: "CLOSE_CART" });
  };

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
