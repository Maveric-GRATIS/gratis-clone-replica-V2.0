/**
 * Global Search Component
 *
 * Part 7 - Section 32: Global Search & Discovery
 * Comprehensive search across partners, projects, events, and bottles
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Building,
  Globe,
  Calendar,
  Droplet,
  FileText,
  TrendingUp,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchResult {
  id: string;
  type: "partner" | "project" | "event" | "bottle" | "article";
  title: string;
  description: string;
  image?: string;
  url: string;
  metadata?: Record<string, any>;
}

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const typeIcons: Record<string, React.ElementType> = {
  partner: Building,
  project: Globe,
  event: Calendar,
  bottle: Droplet,
  article: FileText,
};

const typeLabels: Record<string, string> = {
  partner: "Partner",
  project: "Project",
  event: "Event",
  bottle: "Bottle",
  article: "Article",
};

const typeColors: Record<string, string> = {
  partner: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  project:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  event:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  bottle:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  article: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

// Mock search data
const MOCK_RESULTS: SearchResult[] = [
  {
    id: "1",
    type: "partner",
    title: "Water For Life Foundation",
    description:
      "Providing clean water access to underserved communities in Africa and Asia",
    url: "/partners/water-for-life",
  },
  {
    id: "2",
    type: "project",
    title: "Clean Water Wells in Rural Kenya",
    description: "Installing 10 water wells to provide clean drinking water",
    url: "/projects/1",
  },
  {
    id: "3",
    type: "bottle",
    title: "Ocean Blue Classic",
    description: "Premium stainless steel bottle, 500ml capacity",
    url: "/bottles",
    metadata: { price: "Free", inStock: true },
  },
  {
    id: "4",
    type: "event",
    title: "World Water Day Celebration",
    description: "Join us for a special event celebrating World Water Day",
    url: "/events/1",
    metadata: { date: "2024-03-22" },
  },
];

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load recent searches", e);
      }
    }
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      setFilter("all");
    }
  }, [open]);

  // Search when query changes
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery, filter]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 300));

      let filtered = MOCK_RESULTS.filter(
        (result) =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      if (filter !== "all") {
        filtered = filtered.filter((r) => r.type === filter);
      }

      setResults(filtered);
      setSelectedIndex(0);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecentSearch = (searchQuery: string) => {
    const updated = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleSelect = (result: SearchResult) => {
    saveRecentSearch(query);
    onOpenChange(false);
    navigate(result.url);
  };

  const handleRecentSearch = (search: string) => {
    setQuery(search);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case "Escape":
        onOpenChange(false);
        break;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center border-b dark:border-gray-700 px-4">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            ref={inputRef}
            placeholder="Search partners, projects, events, bottles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <kbd className="hidden md:flex items-center gap-1 rounded border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
            ESC
          </kbd>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 px-4 py-2 border-b dark:border-gray-700 overflow-x-auto">
          {["all", "partner", "project", "event", "bottle"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                "px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors",
                filter === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
              )}
            >
              {type === "all" ? "All" : typeLabels[type]}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {query.length < 2 ? (
            <div className="p-4 space-y-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Clock className="w-4 h-4" />
                      Recent Searches
                    </div>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((search, i) => (
                      <button
                        key={i}
                        onClick={() => handleRecentSearch(search)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Popular Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {["clean water", "education", "bottles", "events"].map(
                    (term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {term}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Quick Links
                </div>
                <div className="space-y-2">
                  {[
                    {
                      icon: Building,
                      label: "Browse Partners",
                      url: "/partners",
                    },
                    { icon: Globe, label: "View Projects", url: "/projects" },
                    {
                      icon: Droplet,
                      label: "Order Bottle",
                      url: "/bottles",
                    },
                    {
                      icon: Calendar,
                      label: "Upcoming Events",
                      url: "/events",
                    },
                  ].map((link) => (
                    <button
                      key={link.url}
                      onClick={() => {
                        onOpenChange(false);
                        navigate(link.url);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : isLoading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Searching...
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No results found for "
                <span className="font-semibold">{query}</span>"
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Try different keywords or browse categories
              </p>
            </div>
          ) : (
            <div className="p-2">
              {results.map((result, index) => {
                const Icon = typeIcons[result.type];
                return (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className={cn(
                      "w-full flex items-start gap-3 px-3 py-3 rounded-lg text-left transition-colors",
                      index === selectedIndex
                        ? "bg-blue-50 dark:bg-blue-950/30"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800",
                    )}
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white truncate">
                          {result.title}
                        </span>
                        <Badge
                          className={cn("text-xs", typeColors[result.type])}
                        >
                          {typeLabels[result.type]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                        {result.description}
                      </p>
                      {result.metadata && (
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-500">
                          {result.metadata.price && (
                            <span>{result.metadata.price}</span>
                          )}
                          {result.metadata.date && (
                            <span>{result.metadata.date}</span>
                          )}
                          {result.metadata.inStock && (
                            <span className="text-green-600 dark:text-green-400">
                              In Stock
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border dark:border-gray-700 bg-white dark:bg-gray-800">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded border dark:border-gray-700 bg-white dark:bg-gray-800">
                ↓
              </kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border dark:border-gray-700 bg-white dark:bg-gray-800">
                ↵
              </kbd>
              select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border dark:border-gray-700 bg-white dark:bg-gray-800">
                ESC
              </kbd>
              close
            </span>
          </div>
          <span>Powered by GRATIS.NGO</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
