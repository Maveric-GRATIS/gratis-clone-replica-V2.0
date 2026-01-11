import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiCkqrHcBJZVcy6RXsBKeb-NZXnKsAD6s",
  authDomain: "gratis-ngo-7bb44.firebaseapp.com",
  projectId: "gratis-ngo-7bb44",
  storageBucket: "gratis-ngo-7bb44.firebasestorage.app",
  messagingSenderId: "659832345710",
  appId: "1:659832345710:web:8048362b3636c465f4c27f",
  measurementId: "G-LF6HJ0RP8D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const products = [
  // Water products - from ProductCarousel and Water page
  {
    id: 'water-500ml',
    name: 'W.A.T.E.R',
    description: 'Still Water. Pure. Simple. Mountain spring water in 100% recyclable tetrapack.',
    price: 4.97,
    original_price: null,
    image_url: '/lovable-uploads/c51ea472-b223-4a6a-934c-74b38370615e.png',
    additional_images: ['/lovable-uploads/gratis-canal-collection.jpg'],
    category: 'beverage',
    in_stock: true,
    featured: true,
    tier: 'standard',
    size: '500ML',
    flavor: 'still',
    subtitle: '500ML Tetrapack'
  },
  {
    id: 'theurgy-20oz',
    name: 'THEURGY',
    description: 'Sparkling Energy. Magic Bubbles. Refreshing sparkling water with natural carbonation.',
    price: 5.97,
    original_price: null,
    image_url: '/lovable-uploads/cdefb4a2-d74d-4f9f-be84-9100cb927d52.png',
    additional_images: ['/lovable-uploads/gratis-lifestyle-drink.jpg'],
    category: 'beverage',
    in_stock: true,
    featured: true,
    tier: 'standard',
    size: '20OZ',
    flavor: 'sparkling',
    subtitle: '20OZ Tetrapack'
  },
  {
    id: 'fu-1gal',
    name: 'F.U.',
    description: 'Flavored Attitude. Big Impact. Natural fruit flavors with zero artificial ingredients.',
    price: 12.97,
    original_price: null,
    image_url: '/lovable-uploads/5fb80093-c88d-4f40-87ed-593974c38b11.png',
    additional_images: ['/lovable-uploads/gratis-neon-tank.jpg'],
    category: 'beverage',
    in_stock: true,
    featured: true,
    tier: 'premium',
    size: '1 GAL',
    flavor: 'flavored',
    subtitle: '1 GAL Tetrapack'
  },
  // Additional size variations
  {
    id: 'water-750ml',
    name: 'W.A.T.E.R',
    description: 'Still Water. Pure. Simple. Mountain spring water in 100% recyclable tetrapack.',
    price: 6.47,
    original_price: null,
    image_url: '/lovable-uploads/c51ea472-b223-4a6a-934c-74b38370615e.png',
    category: 'beverage',
    in_stock: true,
    featured: false,
    tier: 'standard',
    size: '750ML',
    flavor: 'still',
    subtitle: '750ML Tetrapack'
  },
  {
    id: 'water-1l',
    name: 'W.A.T.E.R',
    description: 'Still Water. Pure. Simple. Mountain spring water in 100% recyclable tetrapack.',
    price: 7.97,
    original_price: null,
    image_url: '/lovable-uploads/c51ea472-b223-4a6a-934c-74b38370615e.png',
    category: 'beverage',
    in_stock: true,
    featured: false,
    tier: 'standard',
    size: '1L',
    flavor: 'still',
    subtitle: '1 Liter Tetrapack'
  },
  {
    id: 'theurgy-750ml',
    name: 'THEURGY',
    description: 'Sparkling Energy. Magic Bubbles. Refreshing sparkling water with natural carbonation.',
    price: 7.47,
    original_price: null,
    image_url: '/lovable-uploads/cdefb4a2-d74d-4f9f-be84-9100cb927d52.png',
    category: 'beverage',
    in_stock: true,
    featured: false,
    tier: 'standard',
    size: '750ML',
    flavor: 'sparkling',
    subtitle: '750ML Tetrapack'
  },
  {
    id: 'theurgy-1l',
    name: 'THEURGY',
    description: 'Sparkling Energy. Magic Bubbles. Refreshing sparkling water with natural carbonation.',
    price: 8.97,
    original_price: null,
    image_url: '/lovable-uploads/cdefb4a2-d74d-4f9f-be84-9100cb927d52.png',
    category: 'beverage',
    in_stock: true,
    featured: false,
    tier: 'premium',
    size: '1L',
    flavor: 'sparkling',
    subtitle: '1 Liter Tetrapack'
  },
  {
    id: 'fu-500ml',
    name: 'F.U.',
    description: 'Flavored Attitude. Big Impact. Natural fruit flavors with zero artificial ingredients.',
    price: 5.97,
    original_price: null,
    image_url: '/lovable-uploads/5fb80093-c88d-4f40-87ed-593974c38b11.png',
    category: 'beverage',
    in_stock: true,
    featured: false,
    tier: 'standard',
    size: '500ML',
    flavor: 'flavored',
    subtitle: '500ML Tetrapack'
  },
  {
    id: 'fu-750ml',
    name: 'F.U.',
    description: 'Flavored Attitude. Big Impact. Natural fruit flavors with zero artificial ingredients.',
    price: 7.97,
    original_price: null,
    image_url: '/lovable-uploads/5fb80093-c88d-4f40-87ed-593974c38b11.png',
    category: 'beverage',
    in_stock: true,
    featured: false,
    tier: 'standard',
    size: '750ML',
    flavor: 'flavored',
    subtitle: '750ML Tetrapack'
  }
];

async function addProducts() {
  try {
    console.log('Starting to add products to Firestore...\n');

    for (const product of products) {
      const productRef = doc(db, 'products', product.id);
      await setDoc(productRef, {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`✓ Added: ${product.name} (${product.id})`);
    }

    console.log('\n🎉 All products added successfully!');
    console.log('=======================================');
    console.log(`Total products: ${products.length}`);
    console.log('=======================================');
    console.log('\nYou can now view them in the admin dashboard at http://localhost:8080/admin/dashboard');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error adding products:', error.message);
    console.error(error);
    process.exit(1);
  }
}

addProducts();
