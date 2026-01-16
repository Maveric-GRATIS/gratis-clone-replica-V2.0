// RIG Store Collections - PAIDCONNECT Acrostic
// Based on GRATIS Wireframe Specifications v1.0

export interface RigCollection {
  id: string;
  name: string;
  slug: string;
  acrosticLetter: string;
  description: string;
  image: string;
  productCount: number;
  mvpStatus: 'YES' | 'PHASE 2';
  featured?: boolean;
  color?: string; // Theme color for the collection
}

export const rigCollections: RigCollection[] = [
  {
    id: 'prime-picks',
    name: 'Prime Picks',
    slug: 'prime-picks',
    acrosticLetter: 'P',
    description: 'Best sellers and fan favorites that everyone loves',
    image: '/lovable-uploads/collections/prime-picks.jpg',
    productCount: 12,
    mvpStatus: 'YES',
    featured: true,
    color: '#C1FF00', // Hot Lime Green
  },
  {
    id: 'apex-arrivals',
    name: 'Apex Arrivals',
    slug: 'apex-arrivals',
    acrosticLetter: 'A',
    description: 'Newest drops and latest releases from GRATIS',
    image: '/lovable-uploads/collections/apex-arrivals.jpg',
    productCount: 8,
    mvpStatus: 'YES',
    featured: true,
    color: '#00AFFF', // Electric Blue
  },
  {
    id: 'imbued-icons',
    name: 'Imbued Icons',
    slug: 'imbued-icons',
    acrosticLetter: 'I',
    description: 'Iconic graphic tees with bold statements',
    image: '/lovable-uploads/collections/imbued-icons.jpg',
    productCount: 15,
    mvpStatus: 'YES',
    featured: true,
    color: '#FF0077', // Hot Magenta
  },
  {
    id: 'dazzle-drip',
    name: 'Dazzle Drip',
    slug: 'dazzle-drip',
    acrosticLetter: 'D',
    description: 'Premium drinkware and lifestyle accessories',
    image: '/lovable-uploads/collections/dazzle-drip.jpg',
    productCount: 10,
    mvpStatus: 'YES',
    featured: false,
    color: '#FF5F00', // Solar Orange
  },
  {
    id: 'charmed-cozies',
    name: 'Charmed Cozies',
    slug: 'charmed-cozies',
    acrosticLetter: 'C',
    description: 'Cozy sweatshirts, hoodies, and comfort wear',
    image: '/lovable-uploads/collections/charmed-cozies.jpg',
    productCount: 8,
    mvpStatus: 'YES',
    featured: false,
    color: '#C1FF00', // Hot Lime Green
  },
  {
    id: 'occult-originals',
    name: 'Occult Originals',
    slug: 'occult-originals',
    acrosticLetter: 'O',
    description: 'Exclusive bottoms collection with unique designs',
    image: '/lovable-uploads/collections/occult-originals.jpg',
    productCount: 6,
    mvpStatus: 'YES',
    featured: false,
    color: '#00AFFF', // Electric Blue
  },
  {
    id: 'nexus-noggin',
    name: 'Nexus Noggin',
    slug: 'nexus-noggin',
    acrosticLetter: 'N',
    description: 'Hats, caps, and headwear to complete your look',
    image: '/lovable-uploads/collections/nexus-noggin.jpg',
    productCount: 10,
    mvpStatus: 'YES',
    featured: false,
    color: '#FF0077', // Hot Magenta
  },
  {
    id: 'nebula-novelties',
    name: 'Nebula Novelties',
    slug: 'nebula-novelties',
    acrosticLetter: 'N',
    description: 'Unique lifestyle items and novelty accessories',
    image: '/lovable-uploads/collections/nebula-novelties.jpg',
    productCount: 12,
    mvpStatus: 'YES',
    featured: false,
    color: '#FF5F00', // Solar Orange
  },
  // Phase 2 Collections
  {
    id: 'enchanted-exclusives',
    name: 'Enchanted Exclusives',
    slug: 'enchanted-exclusives',
    acrosticLetter: 'E',
    description: 'Limited editions and special releases',
    image: '/lovable-uploads/collections/enchanted-exclusives.jpg',
    productCount: 0,
    mvpStatus: 'PHASE 2',
    featured: false,
    color: '#C1FF00',
  },
  {
    id: 'cursed-countdown',
    name: 'Cursed Countdown',
    slug: 'cursed-countdown',
    acrosticLetter: 'C',
    description: 'Last chance items and clearance deals',
    image: '/lovable-uploads/collections/cursed-countdown.jpg',
    productCount: 0,
    mvpStatus: 'PHASE 2',
    featured: false,
    color: '#FF0077',
  },
  {
    id: 'thaumaturge-trove',
    name: 'Thaumaturge Trove',
    slug: 'thaumaturge-trove',
    acrosticLetter: 'T',
    description: 'Artist collaborations and special partnerships',
    image: '/lovable-uploads/collections/thaumaturge-trove.jpg',
    productCount: 0,
    mvpStatus: 'PHASE 2',
    featured: false,
    color: '#00AFFF',
  },
];

// Get only MVP collections (for launch)
export const getMVPCollections = () =>
  rigCollections.filter(c => c.mvpStatus === 'YES');

// Get featured collections
export const getFeaturedCollections = () =>
  rigCollections.filter(c => c.featured && c.mvpStatus === 'YES');

// Get collection by slug
export const getCollectionBySlug = (slug: string) =>
  rigCollections.find(c => c.slug === slug);

// Collection to category mapping for filtering products
export const collectionCategoryMap: Record<string, string[]> = {
  'prime-picks': ['BESTSELLER', 'bestseller'],
  'apex-arrivals': ['NEW DROP', 'new drop', 'NEW'],
  'imbued-icons': ['TANKS + TOPS', 'tank', 'tee', 'shirt'],
  'dazzle-drip': ['DRINKWARE', 'bottle', 'cup', 'tumbler', 'flask'],
  'charmed-cozies': ['HOODIES + TRACKSUITS', 'hoodie', 'sweatshirt', 'tracksuit'],
  'occult-originals': ['BOTTOMS', 'short', 'pant', 'jogger'],
  'nexus-noggin': ['CAPS + BEANIES', 'cap', 'hat', 'beanie'],
  'nebula-novelties': ['LIFESTYLE', 'accessory', 'bag', 'sticker'],
};

// Get products for a specific collection
export const getProductsForCollection = (slug: string, products: any[]) => {
  const keywords = collectionCategoryMap[slug];
  if (!keywords) return [];

  return products.filter(product => {
    const searchText = `${product.name} ${product.category} ${product.subcategory} ${product.badge || ''}`.toLowerCase();
    return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
  });
};
