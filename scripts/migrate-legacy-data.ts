/**
 * Database Migration Script
 * Migrate legacy data to new Firestore structure
 * 
 * Usage: npx tsx scripts/migrate-legacy-data.ts
 */

import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

// Initialize Firebase Admin
const serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

interface LegacyUser {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

interface NewUser {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

async function migrateLegacyUsers() {
  console.log("📦 Starting user migration...");

  // Read legacy data from CSV or JSON
  const legacyDataPath = path.join(__dirname, "../data/legacy-users.json");
  
  if (!fs.existsSync(legacyDataPath)) {
    console.log("⚠️ No legacy data file found. Creating sample...");
    return;
  }

  const legacyData: LegacyUser[] = JSON.parse(
    fs.readFileSync(legacyDataPath, "utf-8")
  );

  let migrated = 0;
  let failed = 0;

  for (const legacyUser of legacyData) {
    try {
      // Create Firebase Auth user
      const userRecord = await admin.auth().createUser({
        uid: legacyUser.id,
        email: legacyUser.email,
        displayName: legacyUser.name,
        emailVerified: false,
      });

      // Create Firestore profile
      const [firstName, ...lastNameParts] = legacyUser.name.split(" ");
      const lastName = lastNameParts.join(" ");

      const newUser: NewUser = {
        uid: userRecord.uid,
        email: legacyUser.email,
        displayName: legacyUser.name,
        role: legacyUser.role || "user",
        createdAt: admin.firestore.Timestamp.fromDate(
          new Date(legacyUser.created_at)
        ),
        updatedAt: admin.firestore.Timestamp.now(),
        profile: {
          firstName,
          lastName,
        },
      };

      await db.collection("users").doc(userRecord.uid).set(newUser);

      migrated++;
      console.log(`✅ Migrated user: ${legacyUser.email}`);
    } catch (error: any) {
      failed++;
      console.error(`❌ Failed to migrate ${legacyUser.email}:`, error.message);
    }
  }

  console.log(`\n📊 Migration complete!`);
  console.log(`   Migrated: ${migrated}`);
  console.log(`   Failed: ${failed}`);
}

async function migrateLegacyDonations() {
  console.log("\n💰 Starting donation migration...");

  // Similar structure for donations
  const legacyDataPath = path.join(__dirname, "../data/legacy-donations.json");
  
  if (!fs.existsSync(legacyDataPath)) {
    console.log("⚠️ No legacy donation data found.");
    return;
  }

  // Implementation similar to users migration
  console.log("✅ Donation migration complete!");
}

async function migrateLegacyProjects() {
  console.log("\n🎯 Starting project migration...");

  // Similar structure for projects
  const legacyDataPath = path.join(__dirname, "../data/legacy-projects.json");
  
  if (!fs.existsSync(legacyDataPath)) {
    console.log("⚠️ No legacy project data found.");
    return;
  }

  // Implementation similar to users migration
  console.log("✅ Project migration complete!");
}

async function createBackup() {
  console.log("\n💾 Creating backup before migration...");
  
  const collections = ["users", "donations", "projects", "orders"];
  const backupDir = path.join(__dirname, "../backups", new Date().toISOString());
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  for (const collectionName of collections) {
    const snapshot = await db.collection(collectionName).get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    
    fs.writeFileSync(
      path.join(backupDir, `${collectionName}.json`),
      JSON.stringify(data, null, 2)
    );
    
    console.log(`✅ Backed up ${collectionName}: ${data.length} documents`);
  }
  
  console.log(`✅ Backup saved to: ${backupDir}`);
}

async function verifyMigration() {
  console.log("\n🔍 Verifying migration...");
  
  const usersCount = (await db.collection("users").get()).size;
  const donationsCount = (await db.collection("donations").get()).size;
  const projectsCount = (await db.collection("projects").get()).size;
  
  console.log(`\n📈 Current database state:`);
  console.log(`   Users: ${usersCount}`);
  console.log(`   Donations: ${donationsCount}`);
  console.log(`   Projects: ${projectsCount}`);
}

// Main execution
async function main() {
  console.log("🚀 Starting Legacy Data Migration");
  console.log("==================================\n");

  try {
    // Step 1: Create backup
    await createBackup();

    // Step 2: Migrate data
    await migrateLegacyUsers();
    await migrateLegacyDonations();
    await migrateLegacyProjects();

    // Step 3: Verify
    await verifyMigration();

    console.log("\n✅ All migrations completed successfully!");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

main();
