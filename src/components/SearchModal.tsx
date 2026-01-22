import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { Badge } from "@/components/ui/badge";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const POPULAR_SEARCHES = [
  "Water bottles",
  "T-shirts",
  "Hoodies",
  "Caps",
  "Stickers",
  "Donate",
];

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { products } = useProducts({});

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveSearch = (searchTerm: string) => {
    const updated = [
      searchTerm,
      ...recentSearches.filter((s) => s !== searchTerm),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const filteredProducts = query.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            (p as any).description
              ?.toLowerCase()
              .includes(query.toLowerCase()) ||
            p.category?.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 6)
    : [];

  const handleSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);
    saveSearch(searchTerm);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <div className="border-b border-border p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search products, collections, pages..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-base"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {!query.trim() ? (
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground/80">
                      Recent Searches
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSearchClick(search)}
                        className="px-3 py-1.5 rounded-full bg-muted hover:bg-accent text-sm transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground/80">
                    Popular Searches
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearchClick(search)}
                      className="px-3 py-1.5 rounded-full bg-muted hover:bg-accent text-sm transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-sm font-semibold text-foreground/80 mb-3">
                  Quick Links
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/rig-store"
                    onClick={() => onOpenChange(false)}
                    className="p-3 rounded-lg bg-muted hover:bg-accent transition-colors"
                  >
                    <div className="font-semibold text-sm mb-1">RIG Store</div>
                    <div className="text-xs text-muted-foreground">
                      Shop all merchandise
                    </div>
                  </Link>
                  <Link
                    to="/spark/verve"
                    onClick={() => onOpenChange(false)}
                    className="p-3 rounded-lg bg-muted hover:bg-accent transition-colors"
                  >
                    <div className="font-semibold text-sm mb-1">Donate</div>
                    <div className="text-xs text-muted-foreground">
                      Support the mission
                    </div>
                  </Link>
                  <Link
                    to="/water"
                    onClick={() => onOpenChange(false)}
                    className="p-3 rounded-lg bg-muted hover:bg-accent transition-colors"
                  >
                    <div className="font-semibold text-sm mb-1">Free Water</div>
                    <div className="text-xs text-muted-foreground">
                      Learn about our program
                    </div>
                  </Link>
                  <Link
                    to="/spark/blaze"
                    onClick={() => onOpenChange(false)}
                    className="p-3 rounded-lg bg-muted hover:bg-accent transition-colors"
                  >
                    <div className="font-semibold text-sm mb-1">Volunteer</div>
                    <div className="text-xs text-muted-foreground">
                      Join the movement
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold text-foreground/80 mb-3">
                Products ({filteredProducts.length})
              </h3>
              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={() => {
                      saveSearch(query);
                      onOpenChange(false);
                    }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                  >
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={
                          (product as any).images?.[0] ||
                          (product as any).image_url ||
                          "https://via.placeholder.com/100"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm mb-1 truncate">
                        {product.name}
                      </div>
                      <div className="text-xs text-muted-foreground mb-1">
                        €{product.price?.toFixed(2)}
                      </div>
                      {product.in_stock && (
                        <Badge variant="secondary" className="text-xs">
                          In Stock
                        </Badge>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">
                No results found for "{query}"
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try different keywords
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
