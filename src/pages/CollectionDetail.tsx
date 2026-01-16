import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { useProducts } from "@/hooks/useProducts";
import { useCartActions } from "@/hooks/useCartActions";
import {
  getCollectionBySlug,
  getProductsForCollection,
} from "@/data/rigCollections";
import { EmptyState } from "@/components/EmptyState";
import { LazyImage } from "@/components/LazyImage";
import { formatEuro } from "@/lib/currency";

export default function CollectionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const collection = slug ? getCollectionBySlug(slug) : null;
  const { products, loading, error } = useProducts("merch");
  const { addToCart } = useCartActions();

  if (!collection) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Collection Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The collection you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/rig-store">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Store
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Filter products for this collection
  const collectionProducts = slug
    ? getProductsForCollection(slug, products)
    : [];

  return (
    <>
      <SEO
        title={`${collection.name} - RIG Store`}
        description={collection.description}
      />

      <div className="min-h-screen bg-background">
        {/* Collection Hero */}
        <section
          className="relative bg-gradient-to-br from-gray-900 to-black py-20 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${collection.color}15 0%, #000000 100%)`,
          }}
        >
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
              style={{ backgroundColor: collection.color }}
            />
          </div>

          <div className="container relative z-10">
            <Button
              variant="ghost"
              className="mb-6 text-white hover:text-primary"
              asChild
            >
              <Link to="/rig-store">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Store
              </Link>
            </Button>

            <div className="max-w-4xl">
              {/* Acrostic Letter Badge */}
              <Badge
                className="mb-4 text-2xl font-black px-6 py-2"
                style={{ backgroundColor: collection.color, color: "#000" }}
              >
                {collection.acrosticLetter}
              </Badge>

              <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
                {collection.name}
              </h1>

              <p className="text-xl text-gray-300 mb-8">
                {collection.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  {collectionProducts.length}{" "}
                  {collectionProducts.length === 1 ? "Product" : "Products"}
                </Badge>

                {collection.featured && (
                  <Badge className="text-lg px-4 py-2 bg-primary text-black">
                    ⭐ Featured Collection
                  </Badge>
                )}

                {collection.mvpStatus === "YES" && (
                  <Badge
                    variant="outline"
                    className="text-lg px-4 py-2 border-primary text-primary"
                  >
                    Available Now
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-20">
          <div className="container">
            {error && (
              <div className="text-center py-12">
                <p className="text-red-500">Error loading products: {error}</p>
              </div>
            )}

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-muted rounded-lg mb-4" />
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : collectionProducts.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="No Products Yet"
                description={`The ${collection.name} collection is being stocked. Check back soon for new drops!`}
                actionLabel="Browse All Products"
                onAction={() => (window.location.href = "/rig-store")}
              />
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold">
                    Products in {collection.name}
                  </h2>
                  <p className="text-muted-foreground">
                    {collectionProducts.length}{" "}
                    {collectionProducts.length === 1 ? "item" : "items"}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {collectionProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="group overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <Link to={`/rig-store/${product.slug || product.id}`}>
                        <CardContent className="p-0">
                          <div className="aspect-square relative overflow-hidden bg-muted">
                            {product.image_url && (
                              <LazyImage
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            )}
                            {product.badge && (
                              <Badge className="absolute top-2 right-2">
                                {product.badge}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Link>
                      <CardFooter className="flex flex-col items-start p-4 gap-3">
                        <div className="flex-1 w-full">
                          <Link to={`/rig-store/${product.slug || product.id}`}>
                            <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-lg font-bold">
                              {formatEuro(Number(product.price))}
                            </p>
                            {product.original_price &&
                              Number(product.original_price) >
                                Number(product.price) && (
                                <p className="text-sm text-muted-foreground line-through">
                                  {formatEuro(Number(product.original_price))}
                                </p>
                              )}
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() =>
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: Number(product.price),
                              image: product.image_url || "",
                              category: product.category as
                                | "merch"
                                | "beverage",
                              variant: {},
                            })
                          }
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Related Collections */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">
              Explore More Collections
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* We'll add related collections here later */}
              <p className="col-span-full text-center text-muted-foreground">
                More collections coming soon...
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
