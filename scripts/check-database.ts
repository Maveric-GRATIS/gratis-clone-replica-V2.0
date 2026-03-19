/**
 * Quick script to check what's in the Firestore database
 * Run: npx tsx scripts/check-database.ts
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SERVICE_ACCOUNT_PATH = path.join(__dirname, 'service-account.local.json');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function checkDatabase() {
  try {
    // Initialize Firebase Admin from local file or environment variables
    let serviceAccount: Record<string, string> | null = null;

    if (fs.existsSync(SERVICE_ACCOUNT_PATH)) {
      serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
    } else if (
      process.env.FIREBASE_ADMIN_PROJECT_ID
      && process.env.FIREBASE_ADMIN_CLIENT_EMAIL
      && process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ) {
      serviceAccount = {
        project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
        client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };
    }

    if (!serviceAccount) {
      log('\n❌ Service account credentials not found!', colors.red);
      log('\nUse one of these options:', colors.yellow);
      log('1. Create scripts/service-account.local.json (ignored by git)');
      log('2. Set env vars FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY\n');
      process.exit(1);
    }

    initializeApp({
      credential: cert(serviceAccount),
    });

    const db = getFirestore();

    log('\n🔍 Checking Firestore Database...', colors.cyan);
    log('━'.repeat(60), colors.blue);

    // List of collections to check
    const collectionsToCheck = [
      'users',
      'partners',
      'projects',
      'donations',
      'events',
      'registrations',
      'products',
      'orders',
      'subscriptions',
      'videos',
      'notifications',
      'audit_logs',
      'api_keys',
    ];

    let totalDocs = 0;
    const foundCollections: { name: string; count: number }[] = [];

    for (const collectionName of collectionsToCheck) {
      try {
        const snapshot = await db.collection(collectionName).count().get();
        const count = snapshot.data().count;

        if (count > 0) {
          foundCollections.push({ name: collectionName, count });
          totalDocs += count;
          log(`✅ ${collectionName.padEnd(20)} ${count} documents`, colors.green);

          // Show sample document
          const sampleDoc = await db.collection(collectionName).limit(1).get();
          if (!sampleDoc.empty) {
            const doc = sampleDoc.docs[0];
            const data = doc.data();
            const keys = Object.keys(data);
            log(`   └─ Fields: ${keys.slice(0, 5).join(', ')}${keys.length > 5 ? '...' : ''}`, colors.cyan);
          }
        } else {
          log(`⚠️  ${collectionName.padEnd(20)} empty`, colors.yellow);
        }
      } catch (error) {
        log(`❌ ${collectionName.padEnd(20)} error checking`, colors.red);
      }
    }

    log('━'.repeat(60), colors.blue);

    if (totalDocs === 0) {
      log('\n📭 Database is EMPTY!', colors.yellow);
      log('\nRun this to add test data:', colors.cyan);
      log('   npx tsx scripts/seed-database.ts\n', colors.green);
    } else {
      log(`\n✅ Total: ${foundCollections.length} collections, ${totalDocs} documents`, colors.green);

      // Show largest collections
      if (foundCollections.length > 0) {
        log('\n📊 Largest Collections:', colors.cyan);
        foundCollections
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
          .forEach((col, index) => {
            log(`   ${index + 1}. ${col.name}: ${col.count} documents`, colors.blue);
          });
      }
    }

    log('\n💡 Firestore Console:', colors.cyan);
    log('   https://console.firebase.google.com/project/gratis-ngo-7bb44/firestore\n', colors.blue);

    process.exit(0);
  } catch (error) {
    log('\n❌ Error checking database:', colors.red);
    console.error(error);
    process.exit(1);
  }
}

checkDatabase();
