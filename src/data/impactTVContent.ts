export interface VideoContent {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  duration?: string;
  category: "nexus" | "yarns" | "unveil" | "icon" | "tales";
  tags: string[];
  publishedDate: string;
  viewCount?: number;
  featured?: boolean;
  videoUrl?: string;
  socialPlatform?: "YouTube" | "Instagram" | "TikTok" | "Vimeo";
  series?: string;
  episode?: number;
  season?: number;
}

export interface LiveEvent {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  startDate: string;
  endDate?: string;
  status: "upcoming" | "live" | "replay";
  streamUrl?: string;
  location?: string;
  viewCount?: number;
}

// Nexus (Discover) - Long-form content
export const nexusContent: VideoContent[] = [
  {
    id: "nexus-1",
    title: "The Water Crisis in Amsterdam: A Multicultural Response",
    slug: "water-crisis-amsterdam",
    description: "Exploring how diverse communities unite to tackle water sustainability challenges in the Netherlands' capital.",
    thumbnail: "/lovable-uploads/0496b1d0-a122-41f7-8391-2e759e99a770.png",
    duration: "15:42",
    category: "nexus",
    tags: ["Culture", "Sustainability", "Amsterdam"],
    publishedDate: "2025-09-15",
    viewCount: 12500,
    featured: true,
    socialPlatform: "YouTube"
  },
  {
    id: "nexus-2",
    title: "Behind the Scenes: GRATIS at ADE 2025",
    slug: "gratis-ade-2025",
    description: "An exclusive look at how we brought free water and cultural connection to Amsterdam Dance Event.",
    thumbnail: "/lovable-uploads/04b91434-502b-42c5-842d-c4e359e816c9.png",
    duration: "22:18",
    category: "nexus",
    tags: ["Events", "Culture", "Music"],
    publishedDate: "2025-10-20",
    viewCount: 8900,
    featured: true,
    socialPlatform: "YouTube"
  },
  {
    id: "nexus-3",
    title: "Street Art Meets Hydration: Berlin's Creative Revolution",
    slug: "berlin-street-art",
    description: "How local artists are transforming the conversation around free water access through powerful murals.",
    thumbnail: "/lovable-uploads/1253d645-9ac6-4d39-bd24-3d3901f39cd7.png",
    duration: "18:35",
    category: "nexus",
    tags: ["Culture", "Art", "Berlin"],
    publishedDate: "2025-08-10",
    viewCount: 15200,
    socialPlatform: "YouTube"
  },
  {
    id: "nexus-4",
    title: "Sustainability in Action: Our Paris Fashion Week Journey",
    slug: "paris-fashion-week",
    description: "Bringing eco-conscious hydration to the world's most glamorous runway shows.",
    thumbnail: "/lovable-uploads/1788a965-772c-43e2-af66-c9ed8ffc22aa.png",
    duration: "20:05",
    category: "nexus",
    tags: ["Fashion", "Sustainability", "Paris"],
    publishedDate: "2025-09-28",
    viewCount: 19400,
    socialPlatform: "Vimeo"
  }
];

// Yarns (Live Events)
export const yarnsContent: LiveEvent[] = [
  {
    id: "yarns-1",
    title: "LIVE: GRATIS at Notting Hill Carnival 2026",
    description: "Join us live as we hydrate Europe's biggest street festival with free water and positive vibes.",
    thumbnail: "/lovable-uploads/26d32706-4163-476d-b0c4-932c669daf09.png",
    startDate: "2026-08-30T10:00:00",
    endDate: "2026-08-31T22:00:00",
    status: "upcoming",
    location: "London, UK",
    streamUrl: "https://youtube.com/live/example"
  },
  {
    id: "yarns-2",
    title: "REPLAY: Karneval der Kulturen Berlin Highlights",
    description: "Relive the best moments from Berlin's massive multicultural celebration.",
    thumbnail: "/lovable-uploads/31e8a7ae-19a2-4f28-b5f0-bb8e49fef455.png",
    startDate: "2025-06-07T12:00:00",
    endDate: "2025-06-07T20:00:00",
    status: "replay",
    location: "Berlin, Germany",
    streamUrl: "https://youtube.com/watch/example",
    viewCount: 45000
  },
  {
    id: "yarns-3",
    title: "UPCOMING: Coachella Desert Hydration Activation",
    description: "We're heading to the desert! Watch our team set up the ultimate free water experience.",
    thumbnail: "/lovable-uploads/48ce1e2e-0cbc-49f2-b2d0-0a2d372b640d.png",
    startDate: "2026-04-10T15:00:00",
    status: "upcoming",
    location: "Indio, California",
    streamUrl: "https://youtube.com/live/example2"
  },
  {
    id: "yarns-4",
    title: "REPLAY: Amsterdam Light Festival Launch",
    description: "Our glowing water installation brought together thousands under the city lights.",
    thumbnail: "/lovable-uploads/5fb80093-c88d-4f40-87ed-593974c38b11.png",
    startDate: "2024-12-01T18:00:00",
    status: "replay",
    location: "Amsterdam, Netherlands",
    streamUrl: "https://vimeo.com/example",
    viewCount: 32100
  }
];

// Unveil (Films)
export const unveilContent: VideoContent[] = [
  {
    id: "unveil-1",
    title: "Free Water Revolution: The Documentary",
    slug: "free-water-revolution",
    description: "A 45-minute journey through the global movement to make clean water accessible to all, told through the lens of street culture.",
    thumbnail: "/lovable-uploads/62f5c8a0-3d3d-468c-bbac-754523d00d9f.png",
    duration: "45:12",
    category: "unveil",
    tags: ["Documentary", "Water", "Global"],
    publishedDate: "2025-07-15",
    viewCount: 87000,
    featured: true,
    socialPlatform: "YouTube"
  },
  {
    id: "unveil-2",
    title: "Cultures United: A GRATIS Story",
    slug: "cultures-united",
    description: "How one bottle of water can bridge languages, backgrounds, and communities across Europe.",
    thumbnail: "/lovable-uploads/82428317-889f-4b40-9f0d-e35a6a8bb7b6.png",
    duration: "32:48",
    category: "unveil",
    tags: ["Culture", "Community", "Documentary"],
    publishedDate: "2025-05-22",
    viewCount: 54300,
    featured: true,
    socialPlatform: "Vimeo"
  },
  {
    id: "unveil-3",
    title: "From Street to Stage: Multicultural Festivals",
    slug: "street-to-stage",
    description: "Following the incredible journeys of grassroots cultural festivals that grew into global phenomena.",
    thumbnail: "/lovable-uploads/9ac6ca6a-c33b-407e-ae9d-d71edd6d1a95.png",
    duration: "28:20",
    category: "unveil",
    tags: ["Festivals", "Culture", "Music"],
    publishedDate: "2025-08-05",
    viewCount: 41200,
    socialPlatform: "YouTube"
  }
];

// Icon (Shows/Series)
export const iconContent: VideoContent[] = [
  {
    id: "icon-1",
    title: "Amsterdam: Where It All Began",
    slug: "hydrate-culture-ep1",
    description: "Episode 1 of our city-by-city series exploring how GRATIS brings communities together.",
    thumbnail: "/lovable-uploads/c51ea472-b223-4a6a-934c-74b38370615e.png",
    duration: "12:30",
    category: "icon",
    tags: ["Series", "Amsterdam", "Culture"],
    publishedDate: "2025-09-01",
    viewCount: 28000,
    series: "Hydrate the Culture",
    episode: 1,
    season: 1,
    socialPlatform: "YouTube"
  },
  {
    id: "icon-2",
    title: "New York: The Melting Pot",
    slug: "hydrate-culture-ep2",
    description: "Episode 2 takes us to NYC where diversity and hydration meet on every corner.",
    thumbnail: "/lovable-uploads/cdefb4a2-d74d-4f9f-be84-9100cb927d52.png",
    duration: "14:15",
    category: "icon",
    tags: ["Series", "New York", "Culture"],
    publishedDate: "2025-09-08",
    viewCount: 31500,
    series: "Hydrate the Culture",
    episode: 2,
    season: 1,
    socialPlatform: "YouTube"
  },
  {
    id: "icon-3",
    title: "The Source: Where Our Water Comes From",
    slug: "behind-bottle-ep1",
    description: "Season 1, Episode 1: Journey to the spring and discover the purity behind every bottle.",
    thumbnail: "/lovable-uploads/0496b1d0-a122-41f7-8391-2e759e99a770.png",
    duration: "10:45",
    category: "icon",
    tags: ["Series", "Sustainability", "Production"],
    publishedDate: "2025-07-10",
    viewCount: 22400,
    series: "Behind the Bottle",
    episode: 1,
    season: 1,
    socialPlatform: "YouTube"
  },
  {
    id: "icon-4",
    title: "Glastonbury: Mud, Music, and Hydration",
    slug: "festival-diaries-glastonbury",
    description: "Festival Diaries Special: 48 hours at the UK's legendary music festival.",
    thumbnail: "/lovable-uploads/04b91434-502b-42c5-842d-c4e359e816c9.png",
    duration: "18:22",
    category: "icon",
    tags: ["Series", "Festivals", "Music"],
    publishedDate: "2025-06-28",
    viewCount: 39200,
    series: "Festival Diaries",
    episode: 1,
    season: 1,
    featured: true,
    socialPlatform: "YouTube"
  }
];

// Tales (Clips)
export const talesContent: VideoContent[] = [
  {
    id: "tales-1",
    title: "30 Seconds of Impact: King's Day",
    slug: "kings-day-30sec",
    description: "Orange everywhere! A quick glimpse of Amsterdam's wildest celebration.",
    thumbnail: "/lovable-uploads/1253d645-9ac6-4d39-bd24-3d3901f39cd7.png",
    duration: "0:30",
    category: "tales",
    tags: ["Festival", "Amsterdam", "Quick"],
    publishedDate: "2025-04-27",
    viewCount: 15600,
    socialPlatform: "Instagram"
  },
  {
    id: "tales-2",
    title: "Quick Sip: Pride Amsterdam",
    slug: "pride-amsterdam-clip",
    description: "Love, water, and rainbows on the canals.",
    thumbnail: "/lovable-uploads/1788a965-772c-43e2-af66-c9ed8ffc22aa.png",
    duration: "0:45",
    category: "tales",
    tags: ["Pride", "Amsterdam", "LGBTQ+"],
    publishedDate: "2025-08-03",
    viewCount: 24800,
    featured: true,
    socialPlatform: "TikTok"
  },
  {
    id: "tales-3",
    title: "Festival Moment: Primavera Sound",
    slug: "primavera-moment",
    description: "That moment when the beat drops and the water flows.",
    thumbnail: "/lovable-uploads/26d32706-4163-476d-b0c4-932c669daf09.png",
    duration: "0:25",
    category: "tales",
    tags: ["Music", "Barcelona", "Festival"],
    publishedDate: "2025-06-02",
    viewCount: 18200,
    socialPlatform: "Instagram"
  },
  {
    id: "tales-4",
    title: "Street Team Stories: NYC Pride",
    slug: "nyc-pride-street",
    description: "Our team hits the streets of Manhattan with free water and good vibes.",
    thumbnail: "/lovable-uploads/31e8a7ae-19a2-4f28-b5f0-bb8e49fef455.png",
    duration: "1:15",
    category: "tales",
    tags: ["Pride", "NYC", "Street Team"],
    publishedDate: "2025-06-25",
    viewCount: 32100,
    socialPlatform: "TikTok"
  },
  {
    id: "tales-5",
    title: "Behind the Scenes: Bottle Design",
    slug: "bottle-design-bts",
    description: "Watch our iconic bottle design come to life in 60 seconds.",
    thumbnail: "/lovable-uploads/48ce1e2e-0cbc-49f2-b2d0-0a2d372b640d.png",
    duration: "1:00",
    category: "tales",
    tags: ["Design", "Product", "BTS"],
    publishedDate: "2025-07-12",
    viewCount: 21500,
    socialPlatform: "YouTube"
  },
  {
    id: "tales-6",
    title: "Skate Culture x Hydration",
    slug: "skate-culture",
    description: "Catching air and staying hydrated at Berlin's best skate spots.",
    thumbnail: "/lovable-uploads/5fb80093-c88d-4f40-87ed-593974c38b11.png",
    duration: "0:50",
    category: "tales",
    tags: ["Skate", "Berlin", "Culture"],
    publishedDate: "2025-08-18",
    viewCount: 19700,
    socialPlatform: "Instagram"
  }
];

export const allContent = [...nexusContent, ...unveilContent, ...iconContent, ...talesContent];
