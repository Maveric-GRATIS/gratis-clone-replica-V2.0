import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableTags: string[];
  sortBy: string;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
  showClearButton?: boolean;
}

export const VideoFilters = ({
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagToggle,
  availableTags,
  sortBy,
  onSortChange,
  onClearFilters,
  showClearButton = true
}: VideoFiltersProps) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="duration-long">Longest Duration</SelectItem>
            <SelectItem value="duration-short">Shortest Duration</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tags Row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground font-medium">Filter:</span>
        {availableTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer hover-scale"
            onClick={() => onTagToggle(tag)}
          >
            {tag}
          </Badge>
        ))}
        
        {showClearButton && (selectedTags.length > 0 || searchQuery) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="ml-2"
          >
            <X className="w-4 h-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Summary */}
      {(selectedTags.length > 0 || searchQuery) && (
        <div className="text-sm text-muted-foreground">
          {searchQuery && <span>Searching for "{searchQuery}" </span>}
          {selectedTags.length > 0 && (
            <span>• {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''} selected</span>
          )}
        </div>
      )}
    </div>
  );
};
