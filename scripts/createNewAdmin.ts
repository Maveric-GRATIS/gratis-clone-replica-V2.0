import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';
import * as fs from 'fs';

// Initialize Firebase Admin SDK
// You need to download the service account key from Firebase Console
// Go to: Project Settings > Service Accounts > Generate New Private Key
// Save as service-account.json in the scripts folder

try {
  const serviceAccountPath = path.join(process.cwd(), 'scripts', 'service-account.json');
  console.log(`Looking for service account at: ${serviceAccountPath}`);
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  initializeApp({
    credential: cert(serviceAccount)
  });
} catch (error) {
  console.error('❌ Could not load service account credentials.');
  console.error('Please download service-account.json from Firebase Console:');
  console.error('1. Go to https://console.firebase.google.com/project/gratis-ngo-7bb44/settings/serviceaccounts/adminsdk');
  console.error('2. Click "Generate New Private Key"');
  console.error('3. Save as scripts/service-account.json');
  process.exit(1);
}

const auth = getAuth();
const db = getFirestore();

async function createAdminUser(email: string, password: string, displayName: string) {
  try {
    console.log(`Creating admin user: ${email}...`);

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
      emailVerified: true, // Auto-verify for admin
    });

    console.log(`✓ User created in Firebase Auth`);
    console.log(`  UID: ${userRecord.uid}`);

    // Set custom claims for admin role
    await auth.setCustomUserClaims(userRecord.uid, { admin: true, role: 'admin' });
    console.log(`✓ Admin custom claims set`);

    // Create user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: email,
      displayName: displayName,
      role: 'admin',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`✓ User document created in Firestore`);

    // Create admin role in user_roles collection
    await db.collection('user_roles').doc(userRecord.uid).set({
      user_id: userRecord.uid,
      role: 'admin',
      createdAt: new Date(),
    });

    console.log(`✓ Admin role assigned in user_roles collection`);

    console.log("\n🎉 Admin user created successfully!");
    console.log("=======================================");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`UID: ${userRecord.uid}`);
    console.log(`Role: admin`);
    console.log("=======================================");
    console.log("\nYou can now login at http://localhost:8080/auth");

    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error creating admin user:", error.message);
    console.error(error);
    process.exit(1);
  }
}

// Get email and password from command line or use defaults
const email = process.argv[2] || 'sami-admin@gratis.ngo';
const password = process.argv[3] || 'Admin123!@#';
const displayName = process.argv[4] || 'Sami Admin';

createAdminUser(email, password, displayName);
