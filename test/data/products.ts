import { CartItem } from '@/types/cart';

export interface Product extends Omit<CartItem, 'quantity'> {
  description: string;
  originalPrice?: number;
}

export const beverageProducts: Product[] = [
  {
    id: 'gratis-20oz',
    name: 'GRATIS Water',
    description: 'Pure mountain spring water in 100% recyclable tetrapack',
    price: 2.99,
    image: '/lovable-uploads/cdefb4a2-d74d-4f9f-be84-9100cb927d52.png',
    category: 'beverage',
    variant: { size: '20 oz' }
  },
  {
    id: 'gratis-500ml',
    name: 'GRATIS Water',
    description: 'Pure mountain spring water in 100% recyclable tetrapack',
    price: 1.99,
    image: '/lovable-uploads/c51ea472-b223-4a6a-934c-74b38370615e.png',
    category: 'beverage',
    variant: { size: '500 mL' }
  },
  {
    id: 'gratis-gallon',
    name: 'GRATIS Water',
    description: 'Pure mountain spring water in 100% recyclable tetrapack',
    price: 8.99,
    originalPrice: 12.99,
    image: '/lovable-uploads/5fb80093-c88d-4f40-87ed-593974c38b11.png',
    category: 'beverage',
    variant: { size: '1 gallon' }
  }
];