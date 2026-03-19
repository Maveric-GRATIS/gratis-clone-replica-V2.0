/**
 * RIG Collections — Clothing Seed Script
 *
 * Writes all 32 RIG clothing items (8 collections × 4 items) to the
 * Firestore `rig_products` collection.
 *
 * Usage:
 *   npx tsx scripts/seedRigProducts.ts
 *   npx tsx scripts/seedRigProducts.ts --clean   (deletes existing docs first)
 */

import admin from "firebase-admin";
import * as path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Firebase Admin init (same pattern as seed-database.ts) ──────────────────
const serviceAccountPath = path.join(__dirname, "service-account.local.json");

let serviceAccount: object | null = null;
try {
  if (fs.existsSync(serviceAccountPath)) {
    serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
  } else if (
    process.env.FIREBASE_ADMIN_PROJECT_ID
    && process.env.FIREBASE_ADMIN_CLIENT_EMAIL
    && process.env.FIREBASE_ADMIN_PRIVATE_KEY
  ) {
    serviceAccount = {
      project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
      client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
  }

  if (!serviceAccount) {
    throw new Error("Missing credentials");
  }
} catch {
  console.error("❌  service-account credentials not found");
  console.error("    Use scripts/service-account.local.json or env vars FIREBASE_ADMIN_PROJECT_ID/FIREBASE_ADMIN_CLIENT_EMAIL/FIREBASE_ADMIN_PRIVATE_KEY");
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount as admin.ServiceAccount) });
const db = admin.firestore();

// ── Load product data ────────────────────────────────────────────────────────
const productsPath = path.join(__dirname, "rig-products.json");
const products: RigProduct[] = JSON.parse(fs.readFileSync(productsPath, "utf8"));

interface RigProduct {
  item_name:       string;
  description:     string;
  color_options:   string[];
  sizes_available: string[];
  price:           number;
  collection_id:   string;
  category:        string;
  in_stock:        boolean;
  featured:        boolean;
}

const COLLECTION = "rig_products";
const CLEAN      = process.argv.includes("--clean");

// ── Helpers ──────────────────────────────────────────────────────────────────
const log = {
  info:    (msg: string) => console.log(`\x1b[36m${msg}\x1b[0m`),
  success: (msg: string) => console.log(`\x1b[32m${msg}\x1b[0m`),
  warn:    (msg: string) => console.log(`\x1b[33m${msg}\x1b[0m`),
  error:   (msg: string) => console.error(`\x1b[31m${msg}\x1b[0m`),
};

// ── Main ─────────────────────────────────────────────────────────────────────
async function seed() {
  log.info(`\n🚀  RIG Products Seed — ${products.length} items across 8 collections\n`);

  // Optional: wipe existing docs before seeding
  if (CLEAN) {
    log.warn("  --clean flag detected. Deleting existing rig_products...");
    const existing = await db.collection(COLLECTION).listDocuments();
    const deleteBatch = db.batch();
    existing.forEach((ref) => deleteBatch.delete(ref));
    await deleteBatch.commit();
    log.warn(`  Deleted ${existing.length} existing document(s).\n`);
  }

  // Group by collection for cleaner console output
  const collections = [...new Set(products.map((p) => p.collection_id))];

  let written = 0;

  for (const collectionId of collections) {
    const items = products.filter((p) => p.collection_id === collectionId);
    const batch = db.batch();

    log.info(`  📦  ${collectionId} (${items.length} items)`);

    for (const item of items) {
      const ref = db.collection(COLLECTION).doc();
      batch.set(ref, {
        ...item,
        source:    "rig",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      log.success(`       ✓  ${item.item_name}  €${item.price}`);
      written++;
    }

    await batch.commit();
  }

  log.success(
    `\n✅  Done — ${written} products written to Firestore collection "${COLLECTION}".\n`
  );
  process.exit(0);
}

seed().catch((err) => {
  log.error(`\n❌  Seed failed: ${err.message}`);
  console.error(err);
  process.exit(1);
});
