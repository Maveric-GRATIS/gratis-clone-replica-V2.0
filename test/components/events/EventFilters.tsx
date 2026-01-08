import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface EventFiltersProps {
  selectedCity: string;
  selectedType: string;
  selectedStatus: string;
  searchQuery: string;
  resultCount: number;
  onCityChange: (city: string) => void;
  onTypeChange: (type: string) => void;
  onStatusChange: (status: string) => void;
  onSearchChange: (query: string) => void;
}

export const EventFilters = ({
  selectedCity,
  selectedType,
  selectedStatus,
  searchQuery,
  resultCount,
  onCityChange,
  onTypeChange,
  onStatusChange,
  onSearchChange,
}: EventFiltersProps) => {
  const cities = [
    "All Cities",
    "Amsterdam",
    "New York",
    "Los Angeles",
    "London",
    "Berlin",
    "Paris",
    "Brussels",
    "Barcelona",
  ];

  const types = [
    "All Types",
    "Music Festival",
    "Street Festival",
    "Cultural Celebration",
    "Art & Design",
  ];

  const statuses = [
    { value: "all", label: "All Events" },
    { value: "upcoming", label: "Upcoming" },
    { value: "live", label: "Live Now" },
    { value: "past", label: "Past Events" },
  ];

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-primary/20">
      <div className="container py-6">
        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* City Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">
              City
            </label>
            <Select value={selectedCity} onValueChange={onCityChange}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">
              Event Type
            </label>
            <Select value={selectedType} onValueChange={onTypeChange}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">
              Date
            </label>
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-semibold">
            {resultCount} {resultCount === 1 ? "Event" : "Events"}
          </Badge>
          {(selectedCity !== "All Cities" || selectedType !== "All Types" || selectedStatus !== "all" || searchQuery) && (
            <button
              onClick={() => {
                onCityChange("All Cities");
                onTypeChange("All Types");
                onStatusChange("all");
                onSearchChange("");
              }}
              className="text-xs text-muted-foreground hover:text-primary transition-colors story-link"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
