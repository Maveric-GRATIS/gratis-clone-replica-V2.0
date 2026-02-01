/**
 * Social Feed API Route
 * Aggregates posts from Twitter, Instagram, Facebook, and YouTube
 *
 * Note: Requires API keys in .env:
 * - TWITTER_BEARER_TOKEN
 * - INSTAGRAM_ACCESS_TOKEN
 * - FACEBOOK_ACCESS_TOKEN
 * - YOUTUBE_API_KEY
 */

import { NextRequest, NextResponse } from "next/server";

interface SocialPost {
  id: string;
  platform: "twitter" | "instagram" | "facebook" | "youtube";
  content: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  media?: {
    type: "image" | "video";
    url: string;
    thumbnail?: string;
  }[];
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
  url: string;
  publishedAt: Date;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "12");
    const platform = searchParams.get("platform");

    const posts: SocialPost[] = [];

    // Fetch from each platform
    if (!platform || platform === "all" || platform === "twitter") {
      const twitterPosts = await fetchTwitterPosts(limit);
      posts.push(...twitterPosts);
    }

    if (!platform || platform === "all" || platform === "instagram") {
      const instagramPosts = await fetchInstagramPosts(limit);
      posts.push(...instagramPosts);
    }

    if (!platform || platform === "all" || platform === "facebook") {
      const facebookPosts = await fetchFacebookPosts(limit);
      posts.push(...facebookPosts);
    }

    if (!platform || platform === "all" || platform === "youtube") {
      const youtubePosts = await fetchYouTubePosts(limit);
      posts.push(...youtubePosts);
    }

    // Sort by publishedAt
    posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Limit results
    const limitedPosts = posts.slice(0, limit);

    return NextResponse.json({
      success: true,
      posts: limitedPosts,
      count: limitedPosts.length,
    });
  } catch (error) {
    console.error("Social feed API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch social posts" },
      { status: 500 }
    );
  }
}

// Twitter API v2
async function fetchTwitterPosts(limit: number): Promise<SocialPost[]> {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  if (!bearerToken) return [];

  try {
    const response = await fetch(
      `https://api.twitter.com/2/tweets/search/recent?query=from:gratisngo&max_results=${limit}&expansions=author_id,attachments.media_keys&tweet.fields=created_at,public_metrics&user.fields=profile_image_url&media.fields=url,preview_image_url`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.status}`);
    }

    const data = await response.json();
    const { data: tweets, includes } = data;

    return (tweets || []).map((tweet: any) => {
      const author = includes?.users?.find((u: any) => u.id === tweet.author_id);
      const media = tweet.attachments?.media_keys?.map((key: string) => {
        const mediaItem = includes?.media?.find((m: any) => m.media_key === key);
        return mediaItem ? {
          type: mediaItem.type === "photo" ? "image" : "video",
          url: mediaItem.url || mediaItem.preview_image_url,
          thumbnail: mediaItem.preview_image_url,
        } : null;
      }).filter(Boolean);

      return {
        id: tweet.id,
        platform: "twitter",
        content: tweet.text,
        author: {
          name: author?.name || "GRATIS",
          username: author?.username || "gratisngo",
          avatar: author?.profile_image_url || "",
        },
        media,
        stats: {
          likes: tweet.public_metrics?.like_count || 0,
          comments: tweet.public_metrics?.reply_count || 0,
          shares: tweet.public_metrics?.retweet_count || 0,
        },
        url: `https://twitter.com/gratisngo/status/${tweet.id}`,
        publishedAt: new Date(tweet.created_at),
      };
    });
  } catch (error) {
    console.error("Twitter fetch error:", error);
    return [];
  }
}

// Instagram Graph API
async function fetchInstagramPosts(limit: number): Promise<SocialPost[]> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!accessToken) return [];

  try {
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&access_token=${accessToken}&limit=${limit}`,
      {
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status}`);
    }

    const data = await response.json();

    return (data.data || []).map((post: any) => ({
      id: post.id,
      platform: "instagram",
      content: post.caption || "",
      author: {
        name: "GRATIS Foundation",
        username: "gratisngo",
        avatar: "/images/logo.png",
      },
      media: post.media_url ? [{
        type: post.media_type === "VIDEO" ? "video" : "image",
        url: post.media_url,
        thumbnail: post.thumbnail_url,
      }] : undefined,
      stats: {
        likes: post.like_count || 0,
        comments: post.comments_count || 0,
        shares: 0,
      },
      url: post.permalink,
      publishedAt: new Date(post.timestamp),
    }));
  } catch (error) {
    console.error("Instagram fetch error:", error);
    return [];
  }
}

// Facebook Graph API
async function fetchFacebookPosts(limit: number): Promise<SocialPost[]> {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  if (!accessToken) return [];

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/gratisngo/posts?fields=id,message,created_time,attachments,reactions.summary(true),comments.summary(true),shares&access_token=${accessToken}&limit=${limit}`,
      {
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error(`Facebook API error: ${response.status}`);
    }

    const data = await response.json();

    return (data.data || []).map((post: any) => ({
      id: post.id,
      platform: "facebook",
      content: post.message || "",
      author: {
        name: "GRATIS Foundation",
        username: "gratisngo",
        avatar: "/images/logo.png",
      },
      media: post.attachments?.data?.[0]?.media ? [{
        type: post.attachments.data[0].type === "video" ? "video" : "image",
        url: post.attachments.data[0].media.image?.src || "",
        thumbnail: post.attachments.data[0].media.image?.src,
      }] : undefined,
      stats: {
        likes: post.reactions?.summary?.total_count || 0,
        comments: post.comments?.summary?.total_count || 0,
        shares: post.shares?.count || 0,
      },
      url: `https://facebook.com/${post.id}`,
      publishedAt: new Date(post.created_time),
    }));
  } catch (error) {
    console.error("Facebook fetch error:", error);
    return [];
  }
}

// YouTube Data API
async function fetchYouTubePosts(limit: number): Promise<SocialPost[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  try {
    // First, get channel ID
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=gratisngo&key=${apiKey}`,
      {
        next: { revalidate: 300 },
      }
    );

    const channelData = await channelResponse.json();
    const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) return [];

    // Get recent videos
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=${limit}&key=${apiKey}`,
      {
        next: { revalidate: 300 },
      }
    );

    const videosData = await videosResponse.json();

    // Get video statistics
    const videoIds = (videosData.items || []).map((item: any) => item.contentDetails.videoId).join(",");
    const statsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${apiKey}`,
      {
        next: { revalidate: 300 },
      }
    );

    const statsData = await statsResponse.json();

    return (videosData.items || []).map((item: any, index: number) => {
      const stats = statsData.items?.[index]?.statistics;

      return {
        id: item.contentDetails.videoId,
        platform: "youtube",
        content: item.snippet.title,
        author: {
          name: "GRATIS Foundation",
          username: "gratisngo",
          avatar: item.snippet.thumbnails.default.url,
        },
        media: [{
          type: "video",
          url: `https://www.youtube.com/watch?v=${item.contentDetails.videoId}`,
          thumbnail: item.snippet.thumbnails.high.url,
        }],
        stats: {
          likes: parseInt(stats?.likeCount || "0"),
          comments: parseInt(stats?.commentCount || "0"),
          shares: 0,
          views: parseInt(stats?.viewCount || "0"),
        },
        url: `https://www.youtube.com/watch?v=${item.contentDetails.videoId}`,
        publishedAt: new Date(item.snippet.publishedAt),
      };
    });
  } catch (error) {
    console.error("YouTube fetch error:", error);
    return [];
  }
}
