import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/contexts/AuthContext';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { formatEuro } from '@/lib/currency';
import { useCart } from '@/contexts/CartContext';
import SEO from '@/components/SEO';
import { PageHero } from '@/components/PageHero';
import { EmptyState } from '@/components/EmptyState';

export default function Wishlist() {
  const { user } = useAuth();
  const { wishlist, isLoading, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  if (!user) {
    return (
      <>
        <PageHero 
          title="My Wishlist" 
          subtitle="Save your favorite items for later"
        />
        <div className="container max-w-4xl mx-auto px-4 pb-16">
          <EmptyState
            icon={Heart}
            title="Sign In Required"
            description="Please sign in to view and manage your wishlist"
            actionLabel="Sign In"
            actionHref="/auth"
          />
        </div>
      </>
    );
  }

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      category: product.category
    });
  };

  return (
    <>
      <SEO 
        title="My Wishlist"
        description="View and manage your wishlist items"
      />
      
      <PageHero 
        title="My Wishlist" 
        subtitle="Save your favorite items for later"
      />

      <div className="bg-background pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-12">Loading wishlist...</p>
          ) : wishlist.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Your wishlist is empty"
              description="Start browsing and save your favorite items for later"
              actionLabel="Browse Products"
              actionHref="/rig"
            />
          ) : (
            <div className="space-y-4">
              {wishlist.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <img
                        src={item.products.image_url}
                        alt={item.products.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <Link to={`/rig/${item.product_id}`}>
                          <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                            {item.products.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {item.products.description}
                        </p>
                        <p className="text-xl font-bold mt-2">{formatEuro(item.products.price)}</p>
                      </div>
                      <div className="flex flex-col gap-2 justify-center">
                        <Button
                          variant="default"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleAddToCart(item.products)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() => removeFromWishlist.mutate(item.product_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
