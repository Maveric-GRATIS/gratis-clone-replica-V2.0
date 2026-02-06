/**
 * Database Seeding Script
 * Populate database with sample/test data
 * 
 * Usage: npx tsx scripts/seed-database.ts
 */

import * as admin from "firebase-admin";

// Initialize Firebase Admin
const serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Sample data
const sampleProjects = [
  {
    title: "Clean Water for Rural Communities",
    description: "Providing clean water access to 500 families",
    goal: 50000,
    raised: 35000,
    category: "Water",
    status: "active",
    ngoId: "sample-ngo-1",
    images: ["/lovable-uploads/water-project.jpg"],
    createdAt: admin.firestore.Timestamp.now(),
  },
  {
    title: "Education for All Initiative",
    description: "Building schools in underserved areas",
    goal: 100000,
    raised: 72000,
    category: "Education",
    status: "active",
    ngoId: "sample-ngo-2",
    images: ["/lovable-uploads/education-project.jpg"],
    createdAt: admin.firestore.Timestamp.now(),
  },
  {
    title: "Healthcare Mobile Clinics",
    description: "Bringing medical care to remote villages",
    goal: 75000,
    raised: 48000,
    category: "Healthcare",
    status: "active",
    ngoId: "sample-ngo-3",
    images: ["/lovable-uploads/health-project.jpg"],
    createdAt: admin.firestore.Timestamp.now(),
  },
];

const sampleNGOs = [
  {
    id: "sample-ngo-1",
    name: "Water for Life Foundation",
    description: "Dedicated to providing clean water worldwide",
    website: "https://waterforlife.org",
    email: "contact@waterforlife.org",
    status: "active",
    verified: true,
    category: "Water & Sanitation",
  },
  {
    id: "sample-ngo-2",
    name: "Global Education Network",
    description: "Building educational opportunities globally",
    website: "https://globaledu.org",
    email: "info@globaledu.org",
    status: "active",
    verified: true,
    category: "Education",
  },
  {
    id: "sample-ngo-3",
    name: "Medical Relief International",
    description: "Emergency and long-term healthcare solutions",
    website: "https://medicalrelief.org",
    email: "contact@medicalrelief.org",
    status: "active",
    verified: true,
    category: "Healthcare",
  },
];

const sampleProducts = [
  {
    name: "GRATIS Water Bottle - Blue",
    slug: "gratis-water-bottle-blue",
    price: 25,
    description: "Eco-friendly reusable water bottle",
    category: "Hydration",
    images: ["/lovable-uploads/bottle-blue.jpg"],
    stock: 100,
    featured: true,
  },
  {
    name: "GRATIS T-Shirt - Impact",
    slug: "gratis-tshirt-impact",
    price: 30,
    description: "Organic cotton t-shirt with impact design",
    category: "Apparel",
    images: ["/lovable-uploads/tshirt-impact.jpg"],
    stock: 50,
    featured: true,
  },
  {
    name: "TRIBE Membership - Monthly",
    slug: "tribe-monthly",
    price: 10,
    description: "Monthly TRIBE subscription",
    category: "Membership",
    images: ["/lovable-uploads/tribe-badge.jpg"],
    stock: 999,
    recurring: true,
  },
];

async function seedProjects() {
  console.log("🎯 Seeding projects...");

  for (const project of sampleProjects) {
    const docRef = await db.collection("projects").add(project);
    console.log(`✅ Added project: ${project.title} (${docRef.id})`);
  }
}

async function seedNGOs() {
  console.log("\n🏢 Seeding NGOs...");

  for (const ngo of sampleNGOs) {
    await db.collection("ngos").doc(ngo.id).set(ngo);
    console.log(`✅ Added NGO: ${ngo.name}`);
  }
}

async function seedProducts() {
  console.log("\n🛍️ Seeding products...");

  for (const product of sampleProducts) {
    await db.collection("products").add(product);
    console.log(`✅ Added product: ${product.name}`);
  }
}

async function seedAdminUser() {
  console.log("\n👤 Creating admin user...");

  const adminEmail = "admin@gratis.ngo";
  const adminPassword = "Admin123!"; // Change in production!

  try {
    // Create auth user
    const userRecord = await admin.auth().createUser({
      email: adminEmail,
      password: adminPassword,
      displayName: "Admin User",
      emailVerified: true,
    });

    // Set custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      admin: true,
      superAdmin: true,
    });

    // Create Firestore profile
    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: adminEmail,
      displayName: "Admin User",
      role: "admin",
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    });

    console.log(`✅ Admin user created: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   ⚠️ Change this password immediately!`);
  } catch (error: any) {
    if (error.code === "auth/email-already-exists") {
      console.log(`⚠️ Admin user already exists: ${adminEmail}`);
    } else {
      throw error;
    }
  }
}

async function seedVotingPeriod() {
  console.log("\n🗳️ Creating voting period...");

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);

  await db.collection("voting_periods").add({
    title: "February 2026 TRIBE Voting",
    description: "Vote on project funding for February",
    startDate: admin.firestore.Timestamp.fromDate(startDate),
    endDate: admin.firestore.Timestamp.fromDate(endDate),
    status: "active",
    totalVotes: 0,
    createdAt: admin.firestore.Timestamp.now(),
  });

  console.log("✅ Voting period created");
}

async function clearDatabase() {
  console.log("\n🗑️ Clearing existing data...");

  const collections = ["projects", "ngos", "products", "voting_periods"];

  for (const collectionName of collections) {
    const snapshot = await db.collection(collectionName).get();
    const batch = db.batch();

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`✅ Cleared ${collectionName}: ${snapshot.size} documents`);
  }
}

// Main execution
async function main() {
  console.log("🌱 Starting Database Seeding");
  console.log("===========================\n");

  const args = process.argv.slice(2);
  const clearFirst = args.includes("--clear");

  try {
    if (clearFirst) {
      await clearDatabase();
    }

    await seedNGOs();
    await seedProjects();
    await seedProducts();
    await seedAdminUser();
    await seedVotingPeriod();

    console.log("\n✅ Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   NGOs: ${sampleNGOs.length}`);
    console.log(`   Projects: ${sampleProjects.length}`);
    console.log(`   Products: ${sampleProducts.length}`);
    console.log(`   Admin user: 1`);
    console.log(`   Voting periods: 1`);
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

main();
