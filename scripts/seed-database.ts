/**
 * Enhanced Database Seeding Script
 * Comprehensive seeding for dev/staging environments
 *
 * Usage:
 *   npx tsx scripts/seed-database.ts
 *   npx tsx scripts/seed-database.ts --clean  (clear before seeding)
 *
 * Part 13 - Section 56: Database Seeding & Migration
 */

import admin from "firebase-admin";
import * as path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, "service-account.json");
let serviceAccount;

try {
  const fileContent = fs.readFileSync(serviceAccountPath, 'utf8');
  serviceAccount = JSON.parse(fileContent);
} catch {
  console.error("⚠️  service-account.json not found. Please download from Firebase Console.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Parse CLI arguments
const CLEAN = process.argv.includes('--clean');

// Colors for console output
const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

// Helper: Log with emoji
const log = (emoji: string, message: string) => {
  console.log(`${emoji}  ${message}`);
};

// Helper: Check if collection is empty
async function isCollectionEmpty(collectionName: string): Promise<boolean> {
  const snapshot = await db.collection(collectionName).limit(1).get();
  return snapshot.empty;
}

// Helper: Random date between two dates
const randomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
};

// Helper: Random amount
const randomAmount = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper: Random choice from array
const randomChoice = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

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

// New seed functions for empty collections
async function seedPartners() {
  console.log("\n🤝 Seeding partners...");

  const partners = [
    {
      name: "Dutch Water Alliance",
      logo: "/lovable-uploads/partner-water.jpg",
      website: "https://dutchwateralliance.org",
      description: "Leading consortium for water & sanitation projects",
      type: "Strategic Partner",
      active: true,
      createdAt: admin.firestore.Timestamp.now(),
    },
    {
      name: "European Education Fund",
      logo: "/lovable-uploads/partner-edu.jpg",
      website: "https://eef-europe.org",
      description: "Supporting education initiatives across Europe",
      type: "Funding Partner",
      active: true,
      createdAt: admin.firestore.Timestamp.now(),
    },
    {
      name: "Tech for Good Foundation",
      logo: "/lovable-uploads/partner-tech.jpg",
      website: "https://techforgood.io",
      description: "Technology solutions for NGOs",
      type: "Technology Partner",
      active: true,
      createdAt: admin.firestore.Timestamp.now(),
    },
  ];

  for (const partner of partners) {
    await db.collection("partners").add(partner);
    console.log(`✅ Added partner: ${partner.name}`);
  }
}

async function seedDonations() {
  console.log("\n💰 Seeding donations...");

  const projectsSnapshot = await db.collection("projects").limit(3).get();
  const projectIds = projectsSnapshot.docs.map(doc => doc.id);

  if (projectIds.length === 0) {
    console.log("⚠️ No projects found, skipping donations");
    return;
  }

  const donations = [
    {
      amount: 100,
      currency: "EUR",
      projectId: projectIds[0] || "sample-project-1",
      donorEmail: "donor1@example.com",
      donorName: "John Doe",
      status: "completed",
      paymentMethod: "card",
      anonymous: false,
      createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000 * 5)),
    },
    {
      amount: 250,
      currency: "EUR",
      projectId: projectIds[1] || "sample-project-2",
      donorEmail: "donor2@example.com",
      donorName: "Jane Smith",
      status: "completed",
      paymentMethod: "ideal",
      anonymous: false,
      createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000 * 3)),
    },
    {
      amount: 50,
      currency: "EUR",
      projectId: projectIds[2] || "sample-project-3",
      donorEmail: "donor3@example.com",
      donorName: "Anonymous",
      status: "completed",
      paymentMethod: "card",
      anonymous: true,
      createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000 * 1)),
    },
  ];

  for (const donation of donations) {
    await db.collection("donations").add(donation);
    console.log(`✅ Added donation: €${donation.amount} to project`);
  }
}

async function seedEvents() {
  console.log("\n📅 Seeding events...");

  const futureDate1 = new Date(Date.now() + 86400000 * 7);
  const futureDate2 = new Date(Date.now() + 86400000 * 14);
  const futureDate3 = new Date(Date.now() + 86400000 * 21);

  const events = [
    {
      title: "TRIBE Community Meetup - Amsterdam",
      description: "Monthly gathering of TRIBE members to discuss impact and vote on projects",
      location: "Amsterdam, Netherlands",
      locationDetails: "Impact Hub Amsterdam, Haarlemmerweg 10",
      date: admin.firestore.Timestamp.fromDate(futureDate1),
      endDate: admin.firestore.Timestamp.fromDate(new Date(futureDate1.getTime() + 7200000)),
      capacity: 50,
      registered: 23,
      type: "meetup",
      status: "published",
      imageUrl: "/lovable-uploads/event-meetup.jpg",
      createdAt: admin.firestore.Timestamp.now(),
    },
    {
      title: "Impact Webinar: Water Crisis Solutions",
      description: "Learn about innovative solutions for the global water crisis",
      location: "Online",
      locationDetails: "Zoom link will be sent before event",
      date: admin.firestore.Timestamp.fromDate(futureDate2),
      endDate: admin.firestore.Timestamp.fromDate(new Date(futureDate2.getTime() + 3600000)),
      capacity: 200,
      registered: 87,
      type: "webinar",
      status: "published",
      imageUrl: "/lovable-uploads/event-webinar.jpg",
      createdAt: admin.firestore.Timestamp.now(),
    },
    {
      title: "Annual GRATIS Gala 2026",
      description: "Celebrate a year of impact with the GRATIS community",
      location: "Rotterdam, Netherlands",
      locationDetails: "De Doelen Concert Hall",
      date: admin.firestore.Timestamp.fromDate(futureDate3),
      endDate: admin.firestore.Timestamp.fromDate(new Date(futureDate3.getTime() + 14400000)),
      capacity: 300,
      registered: 156,
      type: "gala",
      status: "published",
      imageUrl: "/lovable-uploads/event-gala.jpg",
      featured: true,
      createdAt: admin.firestore.Timestamp.now(),
    },
  ];

  for (const event of events) {
    await db.collection("events").add(event);
    console.log(`✅ Added event: ${event.title}`);
  }
}

async function seedRegistrations() {
  console.log("\n📝 Seeding event registrations...");

  const eventsSnapshot = await db.collection("events").limit(2).get();
  const eventIds = eventsSnapshot.docs.map(doc => doc.id);

  if (eventIds.length === 0) {
    console.log("⚠️ No events found, skipping registrations");
    return;
  }

  const registrations = [
    {
      eventId: eventIds[0] || "sample-event-1",
      attendeeName: "Sarah Johnson",
      attendeeEmail: "sarah@example.com",
      attendeePhone: "+31612345678",
      status: "confirmed",
      numberOfTickets: 1,
      createdAt: admin.firestore.Timestamp.now(),
    },
    {
      eventId: eventIds[0] || "sample-event-1",
      attendeeName: "Michael Brown",
      attendeeEmail: "michael@example.com",
      attendeePhone: "+31698765432",
      status: "confirmed",
      numberOfTickets: 2,
      createdAt: admin.firestore.Timestamp.now(),
    },
    {
      eventId: eventIds[1] || "sample-event-2",
      attendeeName: "Emily Chen",
      attendeeEmail: "emily@example.com",
      status: "confirmed",
      numberOfTickets: 1,
      createdAt: admin.firestore.Timestamp.now(),
    },
  ];

  for (const registration of registrations) {
    await db.collection("registrations").add(registration);
    console.log(`✅ Added registration for event`);
  }
}

async function seedOrders() {
  console.log("\n🛒 Seeding shop orders...");

  const productsSnapshot = await db.collection("products").limit(3).get();
  const productIds = productsSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));

  if (productIds.length === 0) {
    console.log("⚠️ No products found, skipping orders");
    return;
  }

  const orders = [
    {
      orderNumber: `ORD-${Date.now()}-001`,
      customerEmail: "customer1@example.com",
      customerName: "Alex Turner",
      items: [
        {
          productId: productIds[0]?.id || "product-1",
          productName: productIds[0]?.name || "Product 1",
          quantity: 2,
          price: 25,
        },
      ],
      subtotal: 50,
      shipping: 5,
      total: 55,
      status: "delivered",
      shippingAddress: {
        street: "Keizersgracht 123",
        city: "Amsterdam",
        postalCode: "1015 CJ",
        country: "Netherlands",
      },
      createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000 * 10)),
      updatedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000 * 7)),
    },
    {
      orderNumber: `ORD-${Date.now()}-002`,
      customerEmail: "customer2@example.com",
      customerName: "Lisa Martinez",
      items: [
        {
          productId: productIds[1]?.id || "product-2",
          productName: productIds[1]?.name || "Product 2",
          quantity: 1,
          price: 30,
        },
      ],
      subtotal: 30,
      shipping: 5,
      total: 35,
      status: "shipped",
      shippingAddress: {
        street: "Herengracht 456",
        city: "Amsterdam",
        postalCode: "1017 BX",
        country: "Netherlands",
      },
      createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000 * 3)),
      updatedAt: admin.firestore.Timestamp.now(),
    },
  ];

  for (const order of orders) {
    await db.collection("orders").add(order);
    console.log(`✅ Added order: ${order.orderNumber}`);
  }
}

async function seedSubscriptions() {
  console.log("\n🔄 Seeding subscriptions...");

  const subscriptions = [
    {
      userId: "sample-user-1",
      userEmail: "tribe-member1@example.com",
      userName: "David Smith",
      plan: "tribe-monthly",
      status: "active",
      amount: 10,
      currency: "EUR",
      interval: "month",
      currentPeriodStart: admin.firestore.Timestamp.now(),
      currentPeriodEnd: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 86400000 * 30)),
      stripeSubscriptionId: "sub_sample_1",
      createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000 * 60)),
      updatedAt: admin.firestore.Timestamp.now(),
    },
    {
      userId: "sample-user-2",
      userEmail: "tribe-member2@example.com",
      userName: "Rachel Green",
      plan: "tribe-monthly",
      status: "active",
      amount: 10,
      currency: "EUR",
      interval: "month",
      currentPeriodStart: admin.firestore.Timestamp.now(),
      currentPeriodEnd: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 86400000 * 30)),
      stripeSubscriptionId: "sub_sample_2",
      createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000 * 45)),
      updatedAt: admin.firestore.Timestamp.now(),
    },
  ];

  for (const subscription of subscriptions) {
    await db.collection("subscriptions").add(subscription);
    console.log(`✅ Added subscription for ${subscription.userName}`);
  }
}

async function seedVideos() {
  console.log("\n🎥 Seeding videos...");

  const videos = [
    {
      title: "GRATIS Platform Overview 2026",
      description: "Learn how GRATIS connects NGOs with supporters",
      duration: 180,
      thumbnailUrl: "/lovable-uploads/video-thumb-1.jpg",
      videoUrl: "https://example.com/video-1.mp4",
      category: "Platform",
      status: "published",
      views: 1243,
      likes: 87,
      createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000 * 30)),
      publishedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000 * 30)),
    },
    {
      title: "Water Project Impact - Kenya 2025",
      description: "See the impact of clean water projects in Kenya",
      duration: 240,
      thumbnailUrl: "/lovable-uploads/video-thumb-2.jpg",
      videoUrl: "https://example.com/video-2.mp4",
      category: "Impact Stories",
      status: "published",
      views: 2156,
      likes: 234,
      featured: true,
      createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000 * 20)),
      publishedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000 * 20)),
    },
    {
      title: "How to Join TRIBE Membership",
      description: "Step-by-step guide to becoming a TRIBE member",
      duration: 120,
      thumbnailUrl: "/lovable-uploads/video-thumb-3.jpg",
      videoUrl: "https://example.com/video-3.mp4",
      category: "Tutorial",
      status: "published",
      views: 892,
      likes: 56,
      createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000 * 10)),
      publishedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000 * 10)),
    },
  ];

  for (const video of videos) {
    await db.collection("videos").add(video);
    console.log(`✅ Added video: ${video.title}`);
  }
}

async function seedNotifications() {
  console.log("\n🔔 Seeding notifications...");

  const notifications = [
    {
      userId: "sample-user-1",
      type: "donation_received",
      title: "Thank you for your donation!",
      message: "Your €50 donation to Clean Water Project was successful",
      read: false,
      actionUrl: "/donations",
      createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000 * 2)),
    },
    {
      userId: "sample-user-1",
      type: "event_reminder",
      title: "Upcoming Event Reminder",
      message: "TRIBE Community Meetup starts in 3 days",
      read: false,
      actionUrl: "/events",
      createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000 * 1)),
    },
    {
      userId: "sample-user-2",
      type: "order_shipped",
      title: "Your order has been shipped",
      message: "Track your order #ORD-2026-002",
      read: true,
      actionUrl: "/orders",
      createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000 * 5)),
    },
  ];

  for (const notification of notifications) {
    await db.collection("notifications").add(notification);
    console.log(`✅ Added notification`);
  }
}

async function seedAuditLogs() {
  console.log("\n📊 Seeding audit logs...");

  const logs = [
    {
      action: "user_login",
      userId: "sample-user-1",
      userEmail: "admin@gratis.ngo",
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      details: { method: "email" },
      timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000 * 1)),
    },
    {
      action: "project_created",
      userId: "admin-user-id",
      userEmail: "admin@gratis.ngo",
      ipAddress: "192.168.1.1",
      details: { projectId: "sample-project-1", projectName: "Clean Water Initiative" },
      timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000 * 5)),
    },
    {
      action: "donation_completed",
      userId: "donor-user-id",
      userEmail: "donor@example.com",
      ipAddress: "10.0.0.1",
      details: { amount: 100, currency: "EUR", projectId: "sample-project-1" },
      timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000 * 3)),
    },
  ];

  for (const log of logs) {
    await db.collection("audit_logs").add(log);
    console.log(`✅ Added audit log: ${log.action}`);
  }
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

    // Track what we seed
    const seeded: string[] = [];

    // Check and seed each collection only if empty
    console.log("🔍 Checking which collections need data...\n");

    // Users (skip - may contain existing accounts)
    if (await isCollectionEmpty("users")) {
      console.log("👤 Users collection is empty, adding admin user...");
      await seedAdminUser();
      seeded.push("users (1 admin)");
    } else {
      console.log("✅ Users collection has data, skipping");
    }

    // NGOs
    if (await isCollectionEmpty("ngos")) {
      console.log("\n🏢 NGOs collection is empty, seeding...");
      await seedNGOs();
      seeded.push(`ngos (${sampleNGOs.length})`);
    } else {
      console.log("✅ NGOs collection has data, skipping");
    }

    // Projects
    if (await isCollectionEmpty("projects")) {
      console.log("\n🎯 Projects collection is empty, seeding...");
      await seedProjects();
      seeded.push(`projects (${sampleProjects.length})`);
    } else {
      console.log("✅ Projects collection has data, skipping");
    }

    // Products (skip - may have existing products)
    if (await isCollectionEmpty("products")) {
      console.log("\n🛍️ Products collection is empty, seeding...");
      await seedProducts();
      seeded.push(`products (${sampleProducts.length})`);
    } else {
      console.log("✅ Products collection has data, skipping");
    }

    // Partners
    if (await isCollectionEmpty("partners")) {
      await seedPartners();
      seeded.push("partners (3)");
    } else {
      console.log("✅ Partners collection has data, skipping");
    }

    // Donations
    if (await isCollectionEmpty("donations")) {
      await seedDonations();
      seeded.push("donations (3)");
    } else {
      console.log("✅ Donations collection has data, skipping");
    }

    // Events
    if (await isCollectionEmpty("events")) {
      await seedEvents();
      seeded.push("events (3)");
    } else {
      console.log("✅ Events collection has data, skipping");
    }

    // Registrations
    if (await isCollectionEmpty("registrations")) {
      await seedRegistrations();
      seeded.push("registrations (3)");
    } else {
      console.log("✅ Registrations collection has data, skipping");
    }

    // Orders
    if (await isCollectionEmpty("orders")) {
      await seedOrders();
      seeded.push("orders (2)");
    } else {
      console.log("✅ Orders collection has data, skipping");
    }

    // Subscriptions
    if (await isCollectionEmpty("subscriptions")) {
      await seedSubscriptions();
      seeded.push("subscriptions (2)");
    } else {
      console.log("✅ Subscriptions collection has data, skipping");
    }

    // Videos
    if (await isCollectionEmpty("videos")) {
      await seedVideos();
      seeded.push("videos (3)");
    } else {
      console.log("✅ Videos collection has data, skipping");
    }

    // Notifications
    if (await isCollectionEmpty("notifications")) {
      await seedNotifications();
      seeded.push("notifications (3)");
    } else {
      console.log("✅ Notifications collection has data, skipping");
    }

    // Audit Logs
    if (await isCollectionEmpty("audit_logs")) {
      await seedAuditLogs();
      seeded.push("audit_logs (3)");
    } else {
      console.log("✅ Audit logs collection has data, skipping");
    }

    // Voting Periods
    if (await isCollectionEmpty("voting_periods")) {
      console.log("\n🗳️ Voting periods collection is empty, seeding...");
      await seedVotingPeriod();
      seeded.push("voting_periods (1)");
    } else {
      console.log("✅ Voting periods collection has data, skipping");
    }

    console.log("\n" + "=".repeat(50));
    console.log("✅ Database seeding completed successfully!");
    console.log("=".repeat(50));

    if (seeded.length > 0) {
      console.log("\n📊 Collections seeded:");
      seeded.forEach(item => console.log(`   ✓ ${item}`));
    } else {
      console.log("\n💡 All collections already had data - nothing was added");
    }

    console.log("\n🔗 View your data:");
    console.log("   https://console.firebase.google.com/project/gratis-ngo-7bb44/firestore");
    console.log("\n✨ Ready to test your app with real Firebase data!");

  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

main();
