import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartActions } from "@/hooks/useCartActions";
import { useProducts } from "@/hooks/useProducts";
import {
  ShoppingBag,
  Filter,
  Star,
  Droplets,
  TrendingUp,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatEuro } from "@/lib/currency";
import SEO from "@/components/SEO";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Water product categories
const waterCategories = [
  "SHOP ALL",
  "BEST SELLERS",
  "W.A.T.E.R",
  "THEURGY",
  "F.U.",
  "LIMITED EDITIONS",
  "BUNDLES",
];

export default function HydrationStore() {
  const [selectedCategory, setSelectedCategory] = useState("SHOP ALL");
  const [sortBy, setSortBy] = useState("featured");
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const { addToCart } = useCartActions();
  const { products, loading, error } = useProducts("beverage");

  // Filter products based on selected category
  const filteredProducts = React.useMemo(() => {
    let filtered = products;

    if (selectedCategory !== "SHOP ALL") {
      const categoryMap: Record<string, (product: any) => boolean> = {
        "BEST SELLERS": (p) => p.featured || p.tier === "bestseller",
        "W.A.T.E.R": (p) =>
          p.name.toLowerCase().includes("water") ||
          p.series_name === "W.A.T.E.R",
        THEURGY: (p) =>
          p.name.toLowerCase().includes("theurgy") ||
          p.series_name === "THEURGY",
        "F.U.": (p) =>
          p.name.toLowerCase().includes("f.u.") || p.series_name === "F.U.",
        "LIMITED EDITIONS": (p) =>
          p.tier === "limited" || p.edition_size !== null,
        BUNDLES: (p) =>
          p.name.toLowerCase().includes("bundle") ||
          p.name.toLowerCase().includes("pack"),
      };

      const filterFn = categoryMap[selectedCategory];
      filtered = filterFn ? products.filter(filterFn) : products;
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        return [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
      case "price-high":
        return [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
      case "rating":
        return [...filtered].sort(
          (a, b) => Number(b.rating || 0) - Number(a.rating || 0),
        );
      case "newest":
        return [...filtered].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      case "featured":
      default:
        return filtered;
    }
  }, [products, selectedCategory, sortBy]);

  // Helper function to determine product status
  const getProductStatus = (product: any) => {
    if (product.stock === 0)
      return { label: "Sold Out", variant: "destructive" as const, icon: null };
    if (product.tier === "limited" || product.edition_size)
      return {
        label: "Limited",
        variant: "default" as const,
        icon: <Sparkles className="h-3 w-3" />,
      };
    if (product.is_preorder)
      return {
        label: "Pre-order",
        variant: "secondary" as const,
        icon: <Clock className="h-3 w-3" />,
      };
    if (product.featured)
      return {
        label: "Bestseller",
        variant: "default" as const,
        icon: <TrendingUp className="h-3 w-3" />,
      };
    return {
      label: "In Stock",
      variant: "outline" as const,
      icon: <CheckCircle2 className="h-3 w-3" />,
    };
  };

  return (
    <div className="min-h-screen bg-black">
      <SEO
        title="GRATIS Hydration | Premium Water Collection"
        description="Pure mountain spring water in 100% recyclable tetrapacks. Shop our W.A.T.E.R, Theurgy, and F.U. collections."
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 to-black py-20">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-accent/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container relative z-10">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Droplets className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              GRATIS{" "}
              <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                HYDRATION
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Pure mountain spring water in 100% recyclable tetrapacks. Hydrate
              with purpose.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-gradient-to-r from-yellow-400 to-pink-500 text-black font-bold">
                100% SUSTAINABLE
              </Badge>
              <Badge className="bg-gradient-to-r from-pink-500 to-cyan-400 text-black font-bold">
                MOUNTAIN SPRING
              </Badge>
              <Badge className="bg-gradient-to-r from-cyan-400 to-yellow-400 text-black font-bold">
                FREE DISTRIBUTION
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-[72px] z-50">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
            <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide w-full md:w-auto">
              <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
              {waterCategories.map((category) => {
                const count =
                  category === "SHOP ALL"
                    ? products.length
                    : products.filter((p) => {
                        const categoryMap: Record<
                          string,
                          (product: any) => boolean
                        > = {
                          "BEST SELLERS": (p) =>
                            p.featured || p.tier === "bestseller",
                          "W.A.T.E.R": (p) =>
                            p.name.toLowerCase().includes("water") ||
                            p.series_name === "W.A.T.E.R",
                          THEURGY: (p) =>
                            p.name.toLowerCase().includes("theurgy") ||
                            p.series_name === "THEURGY",
                          "F.U.": (p) =>
                            p.name.toLowerCase().includes("f.u.") ||
                            p.series_name === "F.U.",
                          "LIMITED EDITIONS": (p) =>
                            p.tier === "limited" || p.edition_size !== null,
                          BUNDLES: (p) =>
                            p.name.toLowerCase().includes("bundle") ||
                            p.name.toLowerCase().includes("pack"),
                        };
                        const filterFn = categoryMap[category];
                        return filterFn ? filterFn(p) : false;
                      }).length;

                return (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "ghost"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap font-bold text-xs tracking-wide transition-all ${
                      selectedCategory === category
                        ? "bg-primary text-black hover:bg-primary/90"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {category} {!loading && `(${count})`}
                  </Button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 whitespace-nowrap">
                Sort by:
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] border-gray-700 bg-gray-900/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active filters display */}
          {selectedCategory !== "SHOP ALL" && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-gray-400">Active filter:</span>
              <Badge variant="secondary" className="gap-1">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("SHOP ALL")}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-black">
        <div className="container">
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading products: {error}</p>
            </div>
          )}

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-900 rounded-3xl overflow-hidden"
                >
                  <Skeleton className="aspect-square w-full bg-gray-800" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4 bg-gray-800" />
                    <Skeleton className="h-4 w-full bg-gray-800" />
                    <Skeleton className="h-4 w-1/2 bg-gray-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-white mb-4">
                No products found
              </h3>
              <p className="text-gray-400 mb-8">
                No products match the "{selectedCategory}" category yet. Check
                back soon!
              </p>
              <Button
                variant="outline"
                onClick={() => setSelectedCategory("SHOP ALL")}
                className="border-primary text-primary hover:bg-primary hover:text-black"
              >
                View All Products
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <Link
                  key={product.id}
                  to={`/hydration/${product.id}`}
                  className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 block"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-8">
                    <img
                      src={product.image_url || ""}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Floating Action Button */}
                    <Button
                      size="sm"
                      className={`absolute top-4 right-4 rounded-full bg-primary text-black hover:bg-primary/90 transition-all duration-300 ${
                        hoveredProduct === product.id
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-2"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: Number(product.price),
                          image: product.image_url || "",
                          category: product.category as "merch" | "beverage",
                          variant: {},
                        });
                      }}
                    >
                      <ShoppingBag className="w-4 h-4 mr-1" />
                      Add
                    </Button>

                    {/* Discount Badge */}
                    {product.original_price && (
                      <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-bold">
                        -
                        {Math.round(
                          ((Number(product.original_price) -
                            Number(product.price)) /
                            Number(product.original_price)) *
                            100,
                        )}
                        %
                      </div>
                    )}

                    {/* Status Badge */}
                    {(() => {
                      const status = getProductStatus(product);
                      return (
                        <Badge
                          variant={status.variant}
                          className="absolute top-4 left-4 gap-1 font-bold"
                        >
                          {status.icon}
                          {status.label}
                        </Badge>
                      );
                    })()}

                    {/* Series Badge */}
                    {product.series_name && (
                      <div className="absolute bottom-4 left-4 bg-gray-900/90 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/30">
                        {product.series_name}
                      </div>
                    )}

                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Product Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                        {product.name}
                      </h3>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(Number(product.rating || 0))
                                ? "text-yellow-400 fill-current"
                                : "text-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-yellow-400 text-sm font-bold">
                        {Number(product.rating || 0).toFixed(1)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({product.reviews_count || 0})
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-primary">
                            {formatEuro(Number(product.price))}
                          </span>
                          {product.original_price && (
                            <span className="text-lg text-gray-500 line-through">
                              {formatEuro(Number(product.original_price))}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-black transition-all duration-300"
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart({
                            id: product.id,
                            name: product.name,
                            price: Number(product.price),
                            image: product.image_url || "",
                            category: product.category as "merch" | "beverage",
                            variant: {},
                          });
                        }}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Load More */}
          <div className="text-center mt-16">
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black font-bold"
            >
              Load More Hydration
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 py-16">
        <div className="container text-center">
          <h2 className="text-4xl font-black text-black mb-4">
            JOIN THE HYDRATION MOVEMENT
          </h2>
          <p className="text-black/80 mb-8 max-w-2xl mx-auto">
            Every bottle you purchase funds free water distribution to
            communities in need.
          </p>
          <div className="flex max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg bg-black/20 text-black placeholder:text-black/60 border border-black/30 focus:outline-none focus:border-black"
            />
            <Button className="bg-black text-white hover:bg-black/80 px-8 font-bold">
              JOIN NOW
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
