// ============================================================================
// GRATIS.NGO — Organization Subscription Management Service
// ============================================================================

import { db } from '@/firebase';
import { doc, setDoc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import {
  OrgSubscription, OrgSubscriptionPlan, OrgSubscriptionStatus,
  BillingCycle, OrgInvoice, OrgPaymentMethod, ORG_PLANS, PlanLimits,
} from '@/types/org-subscription';

const SUBS_COL = 'org_subscriptions';
const INVOICES_COL = 'org_invoices';

// Get / Create Subscription

export async function getOrgSubscription(userId: string): Promise<OrgSubscription | null> {
  const q = query(collection(db, SUBS_COL), where('userId', '==', userId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as OrgSubscription;
}

export async function createOrgSubscription(params: {
  userId: string;
  plan: OrgSubscriptionPlan;
  billingCycle: BillingCycle;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  trialDays?: number;
}): Promise<OrgSubscription> {
  const planDef = ORG_PLANS.find((p) => p.id === params.plan)!;
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + (params.billingCycle === 'yearly' ? 12 : 1));

  const id = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const amount = params.billingCycle === 'yearly' ? planDef.yearlyPrice : planDef.monthlyPrice;

  const trialEnd = params.trialDays
    ? new Date(now.getTime() + params.trialDays * 86_400_000).toISOString()
    : undefined;

  const sub: OrgSubscription = {
    id,
    userId: params.userId,
    plan: params.plan,
    status: params.trialDays ? 'trialing' : 'active',
    billingCycle: params.billingCycle,
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: periodEnd.toISOString(),
    trialEnd,
    stripeSubscriptionId: params.stripeSubscriptionId,
    stripeCustomerId: params.stripeCustomerId,
    amount,
    currency: planDef.currency,
    features: planDef.limits,
    usage: { projects: 0, events: 0, storageUsed: 0, teamMembers: 1, emailsSent: 0, apiCalls: 0 },
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  await setDoc(doc(db, SUBS_COL, id), sub);
  return sub;
}

// Upgrade / Downgrade

export async function changeOrgPlan(
  subscriptionId: string,
  newPlan: OrgSubscriptionPlan,
  newCycle?: BillingCycle
): Promise<OrgSubscription> {
  const snap = await getDoc(doc(db, SUBS_COL, subscriptionId));
  if (!snap.exists()) throw new Error('Subscription not found');
  const sub = snap.data() as OrgSubscription;

  const planDef = ORG_PLANS.find((p) => p.id === newPlan)!;
  const cycle = newCycle || sub.billingCycle;
  const amount = cycle === 'yearly' ? planDef.yearlyPrice : planDef.monthlyPrice;

  await updateDoc(doc(db, SUBS_COL, subscriptionId), {
    plan: newPlan,
    billingCycle: cycle,
    amount,
    features: planDef.limits,
    updatedAt: new Date().toISOString(),
  });

  return { ...sub, plan: newPlan, billingCycle: cycle, amount, features: planDef.limits };
}

// Cancel / Pause / Resume

export async function cancelOrgSubscription(subscriptionId: string, cancelAtPeriodEnd = true): Promise<void> {
  const updates: Record<string, any> = { updatedAt: new Date().toISOString() };

  if (cancelAtPeriodEnd) {
    const snap = await getDoc(doc(db, SUBS_COL, subscriptionId));
    const sub = snap.data() as OrgSubscription;
    updates.cancelAt = sub.currentPeriodEnd;
    updates.cancelledAt = new Date().toISOString();
  } else {
    updates.status = 'cancelled';
    updates.cancelledAt = new Date().toISOString();
  }

  await updateDoc(doc(db, SUBS_COL, subscriptionId), updates);
}

export async function pauseOrgSubscription(subscriptionId: string): Promise<void> {
  await updateDoc(doc(db, SUBS_COL, subscriptionId), {
    status: 'paused',
    updatedAt: new Date().toISOString(),
  });
}

export async function resumeOrgSubscription(subscriptionId: string): Promise<void> {
  await updateDoc(doc(db, SUBS_COL, subscriptionId), {
    status: 'active',
    cancelAt: null,
    cancelledAt: null,
    updatedAt: new Date().toISOString(),
  });
}

// Usage Tracking

export async function incrementOrgUsage(
  userId: string,
  field: keyof OrgSubscription['usage'],
  amount = 1
): Promise<{ allowed: boolean; current: number; limit: number }> {
  const sub = await getOrgSubscription(userId);
  if (!sub) return { allowed: true, current: 0, limit: 9999 };

  const limitMap: Record<string, keyof PlanLimits> = {
    projects: 'projects',
    events: 'events',
    teamMembers: 'teamMembers',
    emailsSent: 'emailsPerMonth',
    apiCalls: 'apiCallsPerDay',
  };

  const limitKey = limitMap[field];
  const limit = limitKey ? (sub.features[limitKey] as number) : 99999;
  const current = sub.usage[field] || 0;

  if (current + amount > limit) {
    return { allowed: false, current, limit };
  }

  await updateDoc(doc(db, SUBS_COL, sub.id), {
    [`usage.${field}`]: current + amount,
    updatedAt: new Date().toISOString(),
  });

  return { allowed: true, current: current + amount, limit };
}

// Invoices

export async function listOrgInvoices(userId: string): Promise<OrgInvoice[]> {
  const q = query(collection(db, INVOICES_COL), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as OrgInvoice).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createOrgInvoice(params: {
  subscriptionId: string;
  userId: string;
  amount: number;
  currency: string;
  description: string;
  periodStart: string;
  periodEnd: string;
}): Promise<OrgInvoice> {
  const id = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const invoice: OrgInvoice = {
    id,
    subscriptionId: params.subscriptionId,
    userId: params.userId,
    number: `GRATIS-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
    status: 'open',
    amount: params.amount,
    currency: params.currency,
    description: params.description,
    periodStart: params.periodStart,
    periodEnd: params.periodEnd,
    lineItems: [{ description: params.description, quantity: 1, unitAmount: params.amount, amount: params.amount }],
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, INVOICES_COL, id), invoice);
  return invoice;
}
