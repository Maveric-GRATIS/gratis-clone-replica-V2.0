import { useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProductDetail } from "@/hooks/useProductDetail";
import { useCartActions } from "@/hooks/useCartActions";
import { ImageGallery } from "@/components/product/ImageGallery";
import { VariantSelector } from "@/components/product/VariantSelector";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProducts";
import CompleteTheLook from "@/components/product/CompleteTheLook";
import { ProductReviews } from "@/components/ProductReviews";
import { PageLoader } from "@/components/LoadingSpinner";
import { SEO } from "@/components/SEO";
import { useCurrency } from "@/contexts/CurrencyContext";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { product, variants, reviews, relatedProducts, loading, error } =
    useProductDetail(slug || "");
  const { addToCart } = useCartActions();
  const { formatPrice } = useCurrency();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (loading) return <PageLoader text="Loading product..." />;
  if (error || !product) return <Navigate to="/not-found" replace />;

  const handleAddToCart = () => {
    if (!product) return;

    const variant: any = {};
    if (selectedSize) variant.size = selectedSize;
    if (selectedColor) variant.color = selectedColor;
    if (selectedMaterial) variant.material = selectedMaterial;

    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image_url || "/placeholder.svg",
      category: product.category as "beverage" | "merch",
      variant: Object.keys(variant).length > 0 ? variant : undefined,
      description: product.description,
      originalPrice: product.original_price
        ? Number(product.original_price)
        : undefined,
      rating: Number(product.rating),
      reviews: product.reviews_count || 0,
    });
  };

  const canAddToCart = product.in_stock;

  const finalPrice = Number(product.price);
  const originalPrice = product.original_price
    ? Number(product.original_price)
    : null;
  const savings =
    originalPrice && originalPrice > finalPrice
      ? originalPrice - finalPrice
      : null;

  return (
    <>
      <SEO title={product.name} description={product.description || ""} />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b">
          <div className="container mx-auto px-4 py-4">
            <Link
              to="/rig"
              className="inline-flex items-center gap-2 text-sm hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Store
            </Link>
          </div>
        </div>

        {/* Product Detail */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Images */}
            <div>
              <ImageGallery
                images={
                  product.additional_images?.length
                    ? product.additional_images
                    : [product.image_url || "/placeholder.svg"]
                }
                productName={product.name}
              />
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-6">
              {/* Product Header */}
              <div>
                <h1 className="text-4xl font-bold mb-2">{product.name}</h1>

                {/* Rating */}
                {product.reviews_count > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < Math.round(Number(product.rating))
                              ? "text-primary"
                              : "text-muted-foreground"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-muted-foreground">
                      ({product.reviews_count} reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">
                  {formatPrice(finalPrice)}
                </span>
                {originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(originalPrice)}
                    </span>
                    {savings && (
                      <Badge variant="destructive">
                        Save {formatPrice(savings)}
                      </Badge>
                    )}
                  </>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-muted-foreground">
                  {product.description.substring(0, 150)}...
                </p>
              )}

              {/* Stock Status */}
              <div>
                {product.in_stock ? (
                  <Badge
                    variant="secondary"
                    className="bg-green-500/10 text-green-600"
                  >
                    In Stock ({product.stock_quantity} available)
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="py-4 border-y">
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  maxQuantity={product.stock_quantity}
                />
              </div>

              {/* Add to Cart */}
              <div className="space-y-3">
                <Button
                  size="xl"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={!canAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.in_stock ? "Add to Cart" : "Out of Stock"}
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="flex-1">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="flex-1">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck className="h-6 w-6 text-primary" />
                  <span className="text-xs text-muted-foreground">
                    Free Shipping Over €50
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RotateCcw className="h-6 w-6 text-primary" />
                  <span className="text-xs text-muted-foreground">
                    30-Day Returns
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="text-xs text-muted-foreground">
                    Secure Checkout
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mt-12">
            <ProductTabs
              description={product.description || ""}
              specifications={product.variants as any}
              materialSpecs={product.material_specs || undefined}
              careInstructions={product.care_instructions || undefined}
              category={product.subcategory || product.category}
            />
          </div>

          {/* Complete the Look - Only show for merch products */}
          {product.category === "merch" && (
            <div className="mt-16">
              <CompleteTheLook currentProduct={product} />
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <RelatedProducts products={relatedProducts} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
