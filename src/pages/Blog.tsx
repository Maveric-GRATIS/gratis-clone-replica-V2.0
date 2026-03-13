import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useBlogPosts, DbBlogPost } from '@/hooks/useBlogPosts';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, FileText, Calendar, Eye, Newspaper, BookOpen } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { CmsEditButton } from '@/components/cms/CmsEditButton';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { BlogPostModal } from '@/components/blog/BlogPostModal';
import { NewsModal } from '@/components/blog/NewsModal';

interface PressRelease {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  published_date: string;
}

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab = tabParam === 'news' ? 'news' : 'blog';

  const { posts, loading } = useBlogPosts();
  const [search, setSearch] = useState('');
  const [newsItems, setNewsItems] = useState<PressRelease[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  // Modal state
  const [selectedPost, setSelectedPost] = useState<DbBlogPost | null>(null);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<PressRelease | null>(null);
  const [newsModalOpen, setNewsModalOpen] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase
        .from('press_releases')
        .select('id, title, excerpt, content, published_date')
        .eq('published', true)
        .order('published_date', { ascending: false });
      setNewsItems(data || []);
      setNewsLoading(false);
    };
    fetchNews();
  }, []);

  const filteredPosts = posts.filter(p =>
    !search ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.excerpt || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredNews = newsItems.filter(n =>
    !search ||
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    (n.excerpt || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleTabChange = (value: string) => {
    if (value === 'blog') {
      searchParams.delete('tab');
    } else {
      searchParams.set('tab', value);
    }
    setSearchParams(searchParams);
  };

  const openPost = (post: DbBlogPost) => {
    setSelectedPost(post);
    setPostModalOpen(true);
  };

  const openNews = (news: PressRelease) => {
    setSelectedNews(news);
    setNewsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={activeTab === 'news' ? "News — GRATIS" : "Blog — GRATIS"} 
        description={activeTab === 'news' ? "Latest news and press releases from GRATIS." : "Stories, updates, and insights from GRATIS."} 
        canonical="/blog" 
      />

      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
            {activeTab === 'news' ? 'NEWS' : 'BLOG'}
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            {activeTab === 'news' ? 'Latest announcements and press releases.' : 'Stories, updates, and insights from GRATIS.'}
          </p>
          <CmsEditButton to={activeTab === 'news' ? "/cms/press" : "/cms/blog"} label={activeTab === 'news' ? "Manage News" : "Manage Blog"} />
        </div>
      </section>

      <div className="container py-12">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="blog" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Blog
              </TabsTrigger>
              <TabsTrigger value="news" className="gap-2">
                <Newspaper className="h-4 w-4" />
                News
              </TabsTrigger>
            </TabsList>

            <div className="relative w-full sm:w-auto sm:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
          </div>

          {/* Blog Posts Tab */}
          <TabsContent value="blog" className="mt-0">
            {loading ? (
              <div className="text-center py-20 text-muted-foreground">Loading posts...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-center">
                <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-2xl font-bold mb-2">No Posts Yet</h3>
                <p className="text-muted-foreground">Check back soon for new articles!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, i) => (
                  <ScrollReveal key={post.id} delay={i * 80}>
                    <button type="button" className="text-left w-full" onClick={() => openPost(post)}>
                      <Card className="overflow-hidden group hover:border-primary/50 transition-all duration-300 h-full cursor-pointer">
                        {post.featured_image && (
                          <div className="aspect-video overflow-hidden">
                            <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                          </div>
                        )}
                        <div className="p-5 space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{post.category}</Badge>
                            {post.published_at && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(post.published_at), 'MMM d, yyyy')}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                          {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {post.views_count !== null && post.views_count > 0 && (
                              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.views_count} views</span>
                            )}
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex gap-1">
                                {post.tags.slice(0, 2).map(tag => <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>)}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </button>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news" className="mt-0">
            {newsLoading ? (
              <div className="text-center py-20 text-muted-foreground">Loading news...</div>
            ) : filteredNews.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-center">
                <Newspaper className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-2xl font-bold mb-2">No News Yet</h3>
                <p className="text-muted-foreground">Check back soon for announcements!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNews.map((news, i) => (
                  <ScrollReveal key={news.id} delay={i * 80}>
                    <button type="button" className="text-left w-full" onClick={() => openNews(news)}>
                      <Card className="overflow-hidden group hover:border-[hsl(var(--brand-pink))]/50 transition-all duration-300 h-full cursor-pointer">
                        <div className="p-5 space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">Press Release</Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(news.published_date), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold line-clamp-2 group-hover:text-[hsl(var(--brand-pink))] transition-colors">{news.title}</h3>
                          {news.excerpt && <p className="text-sm text-muted-foreground line-clamp-3">{news.excerpt}</p>}
                        </div>
                      </Card>
                    </button>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <BlogPostModal post={selectedPost} open={postModalOpen} onOpenChange={setPostModalOpen} />
      <NewsModal item={selectedNews} open={newsModalOpen} onOpenChange={setNewsModalOpen} />
    </div>
  );
}