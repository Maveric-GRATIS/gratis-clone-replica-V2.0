import SEO from "@/components/SEO";
import { VideoGrid } from "@/components/impactTV/VideoGrid";
import { VideoFilters } from "@/components/impactTV/VideoFilters";
import { VideoPlayer } from "@/components/impactTV/VideoPlayer";
import { FeaturedContent } from "@/components/impactTV/FeaturedContent";
import { iconContent, VideoContent } from "@/data/impactTVContent";
import { useState, useMemo } from "react";

export default function Icon() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    iconContent.forEach(video => video.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, []);

  const featuredVideo = useMemo(() => {
    return iconContent.find(v => v.featured) || iconContent[0];
  }, []);

  const seriesGroups = useMemo(() => {
    const groups = new Map<string, VideoContent[]>();
    iconContent.forEach(video => {
      if (video.series) {
        if (!groups.has(video.series)) {
          groups.set(video.series, []);
        }
        groups.get(video.series)!.push(video);
      }
    });
    
    // Sort episodes within each series
    groups.forEach((episodes) => {
      episodes.sort((a, b) => {
        if (a.season !== b.season) return (a.season || 0) - (b.season || 0);
        return (a.episode || 0) - (b.episode || 0);
      });
    });
    
    return groups;
  }, []);

  const filteredVideos = useMemo(() => {
    let filtered = iconContent.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          video.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.some(tag => video.tags.includes(tag));
      return matchesSearch && matchesTags;
    });

    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      case "duration-long":
        filtered.sort((a, b) => {
          const getDuration = (d?: string) => {
            if (!d) return 0;
            const parts = d.split(':');
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
          };
          return getDuration(b.duration) - getDuration(a.duration);
        });
        break;
      case "duration-short":
        filtered.sort((a, b) => {
          const getDuration = (d?: string) => {
            if (!d) return 0;
            const parts = d.split(':');
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
          };
          return getDuration(a.duration) - getDuration(b.duration);
        });
        break;
      default:
        filtered.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
    }

    return filtered;
  }, [searchQuery, selectedTags, sortBy]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="ICON: Series & Shows | GRATIS Impact TV" 
        description="Binge-worthy series from the front lines of culture. Watch our episodic content exploring cities, festivals, and communities worldwide."
        canonical={typeof window !== 'undefined' ? window.location.href : '/impact-tv/icon'}
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-primary/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
            ICON
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Series & shows. Binge-worthy content from the front lines of culture.
          </p>
        </div>
      </section>

      {/* Featured Video */}
      <section className="container max-w-7xl mx-auto px-4">
        <FeaturedContent video={featuredVideo} onClick={() => setSelectedVideo(featuredVideo)} />
      </section>

      {/* Series Collections */}
      <section className="container max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-3xl font-bold mb-8">Our Series</h2>
        
        {Array.from(seriesGroups.entries()).map(([seriesName, episodes]) => (
          <div key={seriesName} className="mb-12">
            <h3 className="text-2xl font-semibold mb-6">{seriesName}</h3>
            <VideoGrid 
              videos={episodes}
              onVideoClick={setSelectedVideo}
              columns={4}
            />
          </div>
        ))}
      </section>

      {/* All Episodes */}
      <section className="container max-w-7xl mx-auto px-4 py-12 border-t border-border">
        <h2 className="text-3xl font-bold mb-8">All Episodes</h2>
        
        <VideoFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          availableTags={availableTags}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onClearFilters={handleClearFilters}
        />

        <VideoGrid 
          videos={filteredVideos}
          onVideoClick={setSelectedVideo}
          columns={3}
          showLoadMore
        />
      </section>

      <VideoPlayer 
        video={selectedVideo}
        open={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
}
