// ============================================================================
// GRATIS.NGO — Social Authentication Service (Firebase Auth)
// ============================================================================

import { auth, db } from '@/firebase';
import {
  signInWithPopup, signInWithRedirect, getRedirectResult,
  GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider,
  OAuthProvider, linkWithPopup, unlink, UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import {
  SocialProvider, SocialProfile, LinkedAccount, AuthResult,
} from '@/types/social-auth';

const USERS_COL = 'users';

// ── Provider Factory ─────────────────────────────────────────────────────────

function createProvider(provider: SocialProvider): any {
  switch (provider) {
    case 'google': {
      const p = new GoogleAuthProvider();
      p.addScope('email');
      p.addScope('profile');
      p.setCustomParameters({ prompt: 'select_account' });
      return p;
    }
    case 'facebook': {
      const p = new FacebookAuthProvider();
      p.addScope('email');
      p.addScope('public_profile');
      return p;
    }
    case 'github': {
      const p = new GithubAuthProvider();
      p.addScope('user:email');
      return p;
    }
    case 'apple': {
      const p = new OAuthProvider('apple.com');
      p.addScope('email');
      p.addScope('name');
      return p;
    }
    case 'twitter': {
      return new OAuthProvider('twitter.com');
    }
    case 'linkedin': {
      const p = new OAuthProvider('linkedin.com');
      p.addScope('openid');
      p.addScope('profile');
      p.addScope('email');
      return p;
    }
    case 'microsoft': {
      const p = new OAuthProvider('microsoft.com');
      p.addScope('openid');
      p.addScope('profile');
      p.addScope('email');
      return p;
    }
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

// ── Extract Profile ──────────────────────────────────────────────────────────

function extractProfile(credential: UserCredential, provider: SocialProvider): SocialProfile {
  const user = credential.user;
  const providerData = user.providerData.find((p) =>
    p.providerId.includes(provider) || p.providerId === `${provider}.com`
  ) || user.providerData[0];

  return {
    provider,
    providerId: providerData?.uid || user.uid,
    email: user.email || providerData?.email || '',
    name: user.displayName || providerData?.displayName || '',
    firstName: user.displayName?.split(' ')[0],
    lastName: user.displayName?.split(' ').slice(1).join(' '),
    avatar: user.photoURL || providerData?.photoURL || undefined,
    verified: user.emailVerified,
  };
}

// ── Sign In with Social Provider ─────────────────────────────────────────────

export async function signInWithSocial(
  provider: SocialProvider,
  useRedirect = false
): Promise<AuthResult> {
  try {
    const authProvider = createProvider(provider);

    let credential: UserCredential;
    if (useRedirect) {
      await signInWithRedirect(auth, authProvider);
      // Result handled by getRedirectResult on page load
      return { success: true, isNewUser: false, userId: '', email: '', linkedAccounts: [] };
    } else {
      credential = await signInWithPopup(auth, authProvider);
    }

    const profile = extractProfile(credential, provider);
    const isNewUser = await ensureUserProfile(credential.user.uid, profile);

    // Track linked account
    await trackLinkedAccount(credential.user.uid, profile);

    const linkedAccounts = await getLinkedAccounts(credential.user.uid);

    return {
      success: true,
      isNewUser,
      userId: credential.user.uid,
      email: profile.email,
      linkedAccounts,
    };
  } catch (error: any) {
    // Handle account-exists-with-different-credential
    if (error.code === 'auth/account-exists-with-different-credential') {
      return {
        success: false,
        isNewUser: false,
        userId: '',
        email: error.customData?.email || '',
        linkedAccounts: [],
        error: 'An account already exists with this email. Please sign in with your original method and link this provider from settings.',
      };
    }

    return {
      success: false,
      isNewUser: false,
      userId: '',
      email: '',
      linkedAccounts: [],
      error: error.message || 'Social login failed',
    };
  }
}

// ── Handle Redirect Result ───────────────────────────────────────────────────

export async function handleRedirectResult(): Promise<AuthResult | null> {
  try {
    const result = await getRedirectResult(auth);
    if (!result) return null;

    const providerIdStr = result.providerId || '';
    const provider = providerIdStr.replace('.com', '') as SocialProvider;
    const profile = extractProfile(result, provider);
    const isNewUser = await ensureUserProfile(result.user.uid, profile);
    await trackLinkedAccount(result.user.uid, profile);
    const linkedAccounts = await getLinkedAccounts(result.user.uid);

    return {
      success: true,
      isNewUser,
      userId: result.user.uid,
      email: profile.email,
      linkedAccounts,
    };
  } catch (error: any) {
    return {
      success: false,
      isNewUser: false,
      userId: '',
      email: '',
      linkedAccounts: [],
      error: error.message,
    };
  }
}

// ── Link / Unlink Additional Provider ────────────────────────────────────────

export async function linkProvider(provider: SocialProvider): Promise<LinkedAccount> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const authProvider = createProvider(provider);
  const credential = await linkWithPopup(user, authProvider);
  const profile = extractProfile(credential, provider);
  await trackLinkedAccount(user.uid, profile);

  return {
    provider: profile.provider,
    providerId: profile.providerId,
    email: profile.email,
    name: profile.name,
    avatar: profile.avatar,
    linkedAt: new Date().toISOString(),
  };
}

export async function unlinkProvider(provider: SocialProvider): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  // Ensure at least one auth method remains
  if (user.providerData.length <= 1) {
    throw new Error('Cannot unlink the only authentication method. Add a password or link another provider first.');
  }

  const providerId = provider === 'apple' ? 'apple.com'
    : provider === 'twitter' ? 'twitter.com'
    : provider === 'linkedin' ? 'linkedin.com'
    : provider === 'microsoft' ? 'microsoft.com'
    : `${provider}.com`;

  await unlink(user, providerId);

  // Remove from Firestore tracking
  const userDoc = await getDoc(doc(db, USERS_COL, user.uid));
  if (userDoc.exists()) {
    const linkedAccounts = (userDoc.data().linkedAccounts || []) as LinkedAccount[];
    const updated = linkedAccounts.filter((a) => a.provider !== provider);
    await updateDoc(doc(db, USERS_COL, user.uid), { linkedAccounts: updated });
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function ensureUserProfile(uid: string, profile: SocialProfile): Promise<boolean> {
  const userRef = doc(db, USERS_COL, uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      id: uid,
      email: profile.email,
      name: profile.name,
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      avatar: profile.avatar || '',
      role: 'donor',
      emailVerified: profile.verified,
      authProvider: profile.provider,
      linkedAccounts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return true; // New user
  }

  // Update avatar and verification if missing
  const data = snap.data();
  const updates: Record<string, any> = { updatedAt: new Date().toISOString() };
  if (!data.avatar && profile.avatar) updates.avatar = profile.avatar;
  if (!data.emailVerified && profile.verified) updates.emailVerified = true;
  if (Object.keys(updates).length > 1) {
    await updateDoc(userRef, updates);
  }

  return false; // Existing user
}

async function trackLinkedAccount(uid: string, profile: SocialProfile): Promise<void> {
  const userRef = doc(db, USERS_COL, uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  const existing = (snap.data().linkedAccounts || []) as LinkedAccount[];
  const idx = existing.findIndex((a) => a.provider === profile.provider);

  const account: LinkedAccount = {
    provider: profile.provider,
    providerId: profile.providerId,
    email: profile.email,
    name: profile.name,
    avatar: profile.avatar,
    linkedAt: idx >= 0 ? existing[idx].linkedAt : new Date().toISOString(),
    lastUsed: new Date().toISOString(),
  };

  if (idx >= 0) {
    existing[idx] = account;
  } else {
    existing.push(account);
  }

  await updateDoc(userRef, { linkedAccounts: existing });
}

export async function getLinkedAccounts(uid: string): Promise<LinkedAccount[]> {
  const snap = await getDoc(doc(db, USERS_COL, uid));
  return snap.exists() ? (snap.data().linkedAccounts || []) : [];
}
