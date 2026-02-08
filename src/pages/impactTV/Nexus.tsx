import SEO from "@/components/SEO";
import { VideoGrid } from "@/components/impactTV/VideoGrid";
import { VideoFilters } from "@/components/impactTV/VideoFilters";
import { VideoPlayer } from "@/components/impactTV/VideoPlayer";
import { FeaturedContent } from "@/components/impactTV/FeaturedContent";
import { nexusContent, VideoContent } from "@/data/impactTVContent";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock } from "lucide-react";

export default function Nexus() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    nexusContent.forEach((video) => video.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, []);

  const featuredArticle = useMemo(() => {
    return nexusContent.find((v) => v.featured) || nexusContent[0];
  }, []);

  const trendingContent = useMemo(() => {
    return [...nexusContent]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5);
  }, []);

  const latestContent = useMemo(() => {
    return [...nexusContent]
      .sort(
        (a, b) =>
          new Date(b.publishedDate).getTime() -
          new Date(a.publishedDate).getTime(),
      )
      .slice(0, 5);
  }, []);

  const filteredVideos = useMemo(() => {
    const filtered = nexusContent.filter((video) => {
      const matchesSearch =
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => video.tags.includes(tag));
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
            const parts = d.split(":");
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
          };
          return getDuration(b.duration) - getDuration(a.duration);
        });
        break;
      case "duration-short":
        filtered.sort((a, b) => {
          const getDuration = (d?: string) => {
            if (!d) return 0;
            const parts = d.split(":");
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
          };
          return getDuration(a.duration) - getDuration(b.duration);
        });
        break;
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.publishedDate).getTime() -
            new Date(a.publishedDate).getTime(),
        );
    }

    return filtered;
  }, [searchQuery, selectedTags, sortBy]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="NEXUS: Discover Our World | GRATIS Impact TV"
        description="Stories, culture, and impact from every corner of the globe. Explore long-form content about water sustainability, festivals, and community."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : "/impact-tv/nexus"
        }
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            NEXUS
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Discover our world. Stories, culture, and impact from every corner
            of the globe.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="container max-w-7xl mx-auto px-4">
        <FeaturedContent
          video={featuredArticle}
          onClick={() => setSelectedVideo(featuredArticle)}
        />
      </section>

      {/* Main Content Grid with Sidebar */}
      <section className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-8">All Stories</h2>

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
              columns={2}
              showLoadMore
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Trending */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trendingContent.map((video, index) => (
                  <div
                    key={video.id}
                    className="flex gap-3 cursor-pointer group"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded flex items-center justify-center font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {video.viewCount &&
                          `${(video.viewCount / 1000).toFixed(1)}K views`}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Latest Uploads */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Latest Uploads
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {latestContent.map((video) => (
                  <div
                    key={video.id}
                    className="cursor-pointer group"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="aspect-video bg-secondary rounded-lg overflow-hidden mb-2">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(video.publishedDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Categories Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedTags.includes(tag)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <VideoPlayer
        video={selectedVideo}
        open={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
}
