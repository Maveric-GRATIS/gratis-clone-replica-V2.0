import SEO from "@/components/SEO";
import { VideoGrid } from "@/components/impactTV/VideoGrid";
import { VideoFilters } from "@/components/impactTV/VideoFilters";
import { VideoPlayer } from "@/components/impactTV/VideoPlayer";
import { talesContent, VideoContent } from "@/data/impactTVContent";
import { useState, useMemo } from "react";

export default function Tales() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    talesContent.forEach(video => video.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, []);

  const filteredVideos = useMemo(() => {
    let filtered = talesContent.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          video.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.some(tag => video.tags.includes(tag));
      return matchesSearch && matchesTags;
    });

    // Sort
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
      default: // newest
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
        title="TALES: Quick Clips & Moments | GRATIS Impact TV" 
        description="Bite-sized stories from our global movement. Watch quick clips from festivals, street culture, and community moments."
        canonical={typeof window !== 'undefined' ? window.location.href : '/impact-tv/tales'}
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            TALES
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Quick moments. Big impact. Bite-sized stories from our global movement.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="container max-w-7xl mx-auto px-4 py-12">
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
          columns={4}
          showLoadMore
          initialCount={16}
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
