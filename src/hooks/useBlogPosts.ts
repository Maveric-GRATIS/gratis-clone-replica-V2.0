import { useMemo } from "react";

export interface DbBlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  category: string;
  published_at: string | null;
  featured_image: string | null;
  views_count: number | null;
  tags: string[] | null;
}

export function useBlogPosts() {
  const posts = useMemo<DbBlogPost[]>(() => [], []);
  return { posts, loading: false };
}
