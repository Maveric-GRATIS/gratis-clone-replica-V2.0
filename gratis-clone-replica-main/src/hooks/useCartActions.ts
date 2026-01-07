import { useCart } from '@/contexts/CartContext';
import { CartItem } from '@/types/cart';
import { useToast } from '@/hooks/use-toast';

export const useCartActions = () => {
  const cart = useCart();
  const { toast } = useToast();

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    cart.addItem(item);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (id: string, itemName?: string) => {
    cart.removeItem(id);
    toast({
      title: "Removed from cart",
      description: itemName ? `${itemName} has been removed from your cart.` : "Item removed from cart.",
    });
  };

  const updateCartQuantity = (id: string, quantity: number, itemName?: string) => {
    cart.updateQuantity(id, quantity);
    if (quantity === 0) {
      toast({
        title: "Removed from cart",
        description: itemName ? `${itemName} has been removed from your cart.` : "Item removed from cart.",
      });
    }
  };

  return {
    ...cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
  };
};