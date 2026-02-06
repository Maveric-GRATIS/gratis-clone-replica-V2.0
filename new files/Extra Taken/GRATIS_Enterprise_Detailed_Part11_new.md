# GRATIS.NGO Enterprise Development Prompts - PART 11
## Analytics, Compliance, Subscriptions, Payments, RBAC & Audit (Sections 43-48)
### Total Estimated Size: ~90,000 tokens | Complexity: HIGH

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 43: ADVANCED ANALYTICS DASHBOARD
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 43.1: Analytics Types & Data Models

Create the advanced analytics type system for GRATIS.NGO with real-time metrics, cohort analysis, funnel tracking, and geographic distribution.

### FILE: src/types/analytics-advanced.ts

```typescript
// ============================================================================
// ADVANCED ANALYTICS TYPE DEFINITIONS
// ============================================================================

export interface DateRange {
  startDate: Date;
  endDate: Date;
  label: string;
}

export interface DatePreset {
  label: string;
  getValue: () => DateRange;
}

export interface MetricCard {
  id: string;
  title: string;
  value: number;
  previousValue: number;
  changePercent: number;
  trend: 'up' | 'down' | 'flat';
  format: 'number' | 'currency' | 'percent';
  icon: string;
  color: string;
  sparklineData?: number[];
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ChartDataset {
  label: string;
  data: number[];
  color: string;
  type?: 'line' | 'bar' | 'area';
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface FunnelStep {
  name: string;
  count: number;
  conversionRate: number;
  dropoffRate: number;
  averageTime?: number; // seconds between this step and previous
}

export interface CohortData {
  cohort: string; // e.g., "2024-01", "2024-02"
  totalUsers: number;
  retentionByPeriod: Record<number, number>; // period → retention %
}

export interface GeographicData {
  country: string;
  countryCode: string;
  city?: string;
  donations: number;
  amount: number;
  donors: number;
  latitude?: number;
  longitude?: number;
}

export interface RealTimeMetrics {
  activeUsers: number;
  activeDonors: number;
  donationsLastHour: number;
  revenueLastHour: number;
  topPages: { path: string; visitors: number }[];
  recentDonations: {
    id: string;
    amount: number;
    currency: string;
    country: string;
    timestamp: Date;
  }[];
}

export interface AnalyticsReport {
  id: string;
  name: string;
  dateRange: DateRange;
  generatedAt: Date;
  generatedBy: string;
  format: 'pdf' | 'csv' | 'xlsx';
  downloadUrl: string;
  sections: string[];
  status: 'generating' | 'ready' | 'failed';
}

export interface DonorSegment {
  id: string;
  name: string;
  criteria: Record<string, any>;
  count: number;
  totalDonated: number;
  averageDonation: number;
  retentionRate: number;
}

export interface ConversionEvent {
  event: string;
  count: number;
  conversionRate: number;
  revenue: number;
}

export type AnalyticsTimeframe = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
export type AnalyticsMetric = 'donations' | 'revenue' | 'donors' | 'users' | 'events' | 'bottles';
```

---

## PROMPT 43.2: Analytics Aggregation Service

### FILE: src/lib/analytics/aggregation-service.ts

```typescript
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
  limit,
  getCountFromServer,
  AggregateField,
  getAggregateFromServer,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type {
  DateRange,
  MetricCard,
  TimeSeriesDataPoint,
  FunnelStep,
  CohortData,
  GeographicData,
  RealTimeMetrics,
  AnalyticsTimeframe,
} from '@/types/analytics-advanced';

// ============================================================================
// DATE PRESETS
// ============================================================================

export const DATE_PRESETS = {
  today: (): DateRange => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return { startDate: start, endDate: new Date(), label: 'Today' };
  },
  yesterday: (): DateRange => {
    const start = new Date();
    start.setDate(start.getDate() - 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    return { startDate: start, endDate: end, label: 'Yesterday' };
  },
  last7Days: (): DateRange => {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);
    return { startDate: start, endDate: new Date(), label: 'Last 7 Days' };
  },
  last30Days: (): DateRange => {
    const start = new Date();
    start.setDate(start.getDate() - 30);
    start.setHours(0, 0, 0, 0);
    return { startDate: start, endDate: new Date(), label: 'Last 30 Days' };
  },
  last90Days: (): DateRange => {
    const start = new Date();
    start.setDate(start.getDate() - 90);
    start.setHours(0, 0, 0, 0);
    return { startDate: start, endDate: new Date(), label: 'Last 90 Days' };
  },
  thisMonth: (): DateRange => {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return { startDate: start, endDate: new Date(), label: 'This Month' };
  },
  thisYear: (): DateRange => {
    const start = new Date();
    start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0);
    return { startDate: start, endDate: new Date(), label: 'This Year' };
  },
};

// ============================================================================
// METRIC CARDS
// ============================================================================

export async function getOverviewMetrics(dateRange: DateRange): Promise<MetricCard[]> {
  const { startDate, endDate } = dateRange;
  const startTs = Timestamp.fromDate(startDate);
  const endTs = Timestamp.fromDate(endDate);

  // Calculate previous period for comparison
  const periodMs = endDate.getTime() - startDate.getTime();
  const prevStart = new Date(startDate.getTime() - periodMs);
  const prevEnd = new Date(startDate.getTime());
  const prevStartTs = Timestamp.fromDate(prevStart);
  const prevEndTs = Timestamp.fromDate(prevEnd);

  // Current period donations
  const donationsQuery = query(
    collection(db, 'donations'),
    where('createdAt', '>=', startTs),
    where('createdAt', '<=', endTs),
    where('status', '==', 'completed')
  );
  const donationsSnap = await getDocs(donationsQuery);
  const currentDonations = donationsSnap.docs.map((d) => d.data());
  const totalRevenue = currentDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalDonations = currentDonations.length;
  const uniqueDonors = new Set(currentDonations.map((d) => d.userId)).size;

  // Previous period donations
  const prevDonationsQuery = query(
    collection(db, 'donations'),
    where('createdAt', '>=', prevStartTs),
    where('createdAt', '<=', prevEndTs),
    where('status', '==', 'completed')
  );
  const prevDonationsSnap = await getDocs(prevDonationsQuery);
  const prevDonations = prevDonationsSnap.docs.map((d) => d.data());
  const prevRevenue = prevDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const prevTotalDonations = prevDonations.length;
  const prevUniqueDonors = new Set(prevDonations.map((d) => d.userId)).size;

  // New users
  const usersQuery = query(
    collection(db, 'users'),
    where('createdAt', '>=', startTs),
    where('createdAt', '<=', endTs)
  );
  const usersSnap = await getCountFromServer(usersQuery);
  const newUsers = usersSnap.data().count;

  const prevUsersQuery = query(
    collection(db, 'users'),
    where('createdAt', '>=', prevStartTs),
    where('createdAt', '<=', prevEndTs)
  );
  const prevUsersSnap = await getCountFromServer(prevUsersQuery);
  const prevNewUsers = prevUsersSnap.data().count;

  // Average donation
  const avgDonation = totalDonations > 0 ? totalRevenue / totalDonations : 0;
  const prevAvgDonation =
    prevTotalDonations > 0 ? prevRevenue / prevTotalDonations : 0;

  function calcChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  function getTrend(change: number): 'up' | 'down' | 'flat' {
    if (change > 1) return 'up';
    if (change < -1) return 'down';
    return 'flat';
  }

  const revenueChange = calcChange(totalRevenue, prevRevenue);
  const donationsChange = calcChange(totalDonations, prevTotalDonations);
  const donorsChange = calcChange(uniqueDonors, prevUniqueDonors);
  const usersChange = calcChange(newUsers, prevNewUsers);
  const avgChange = calcChange(avgDonation, prevAvgDonation);

  return [
    {
      id: 'total-revenue',
      title: 'Total Revenue',
      value: totalRevenue,
      previousValue: prevRevenue,
      changePercent: Math.round(revenueChange * 10) / 10,
      trend: getTrend(revenueChange),
      format: 'currency',
      icon: 'DollarSign',
      color: '#10B981',
    },
    {
      id: 'total-donations',
      title: 'Donations',
      value: totalDonations,
      previousValue: prevTotalDonations,
      changePercent: Math.round(donationsChange * 10) / 10,
      trend: getTrend(donationsChange),
      format: 'number',
      icon: 'Heart',
      color: '#6366F1',
    },
    {
      id: 'unique-donors',
      title: 'Unique Donors',
      value: uniqueDonors,
      previousValue: prevUniqueDonors,
      changePercent: Math.round(donorsChange * 10) / 10,
      trend: getTrend(donorsChange),
      format: 'number',
      icon: 'Users',
      color: '#F59E0B',
    },
    {
      id: 'new-users',
      title: 'New Users',
      value: newUsers,
      previousValue: prevNewUsers,
      changePercent: Math.round(usersChange * 10) / 10,
      trend: getTrend(usersChange),
      format: 'number',
      icon: 'UserPlus',
      color: '#EC4899',
    },
    {
      id: 'avg-donation',
      title: 'Avg. Donation',
      value: avgDonation,
      previousValue: prevAvgDonation,
      changePercent: Math.round(avgChange * 10) / 10,
      trend: getTrend(avgChange),
      format: 'currency',
      icon: 'TrendingUp',
      color: '#8B5CF6',
    },
  ];
}

// ============================================================================
// TIME SERIES
// ============================================================================

export async function getDonationTimeSeries(
  dateRange: DateRange,
  timeframe: AnalyticsTimeframe = 'daily'
): Promise<TimeSeriesDataPoint[]> {
  const { startDate, endDate } = dateRange;
  const startTs = Timestamp.fromDate(startDate);
  const endTs = Timestamp.fromDate(endDate);

  const donationsQuery = query(
    collection(db, 'donations'),
    where('createdAt', '>=', startTs),
    where('createdAt', '<=', endTs),
    where('status', '==', 'completed'),
    orderBy('createdAt', 'asc')
  );

  const snap = await getDocs(donationsQuery);
  const donations = snap.docs.map((d) => ({
    amount: d.data().amount || 0,
    date: d.data().createdAt.toDate(),
  }));

  // Group by timeframe
  const buckets = new Map<string, number>();
  const current = new Date(startDate);

  while (current <= endDate) {
    const key = formatBucketKey(current, timeframe);
    buckets.set(key, 0);
    incrementDate(current, timeframe);
  }

  for (const donation of donations) {
    const key = formatBucketKey(donation.date, timeframe);
    buckets.set(key, (buckets.get(key) || 0) + donation.amount);
  }

  return Array.from(buckets.entries()).map(([date, value]) => ({
    date,
    value: Math.round(value * 100) / 100,
  }));
}

export async function getUserGrowthTimeSeries(
  dateRange: DateRange,
  timeframe: AnalyticsTimeframe = 'daily'
): Promise<TimeSeriesDataPoint[]> {
  const { startDate, endDate } = dateRange;
  const startTs = Timestamp.fromDate(startDate);
  const endTs = Timestamp.fromDate(endDate);

  const usersQuery = query(
    collection(db, 'users'),
    where('createdAt', '>=', startTs),
    where('createdAt', '<=', endTs),
    orderBy('createdAt', 'asc')
  );

  const snap = await getDocs(usersQuery);
  const users = snap.docs.map((d) => ({
    date: d.data().createdAt.toDate(),
  }));

  const buckets = new Map<string, number>();
  const current = new Date(startDate);

  while (current <= endDate) {
    const key = formatBucketKey(current, timeframe);
    buckets.set(key, 0);
    incrementDate(current, timeframe);
  }

  for (const user of users) {
    const key = formatBucketKey(user.date, timeframe);
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }

  return Array.from(buckets.entries()).map(([date, value]) => ({ date, value }));
}

// ============================================================================
// FUNNEL ANALYSIS
// ============================================================================

export async function getDonationFunnel(dateRange: DateRange): Promise<FunnelStep[]> {
  const { startDate, endDate } = dateRange;
  const startTs = Timestamp.fromDate(startDate);
  const endTs = Timestamp.fromDate(endDate);

  // Step 1: Page visits (users who visited)
  const visitorsQuery = query(
    collection(db, 'analytics_events'),
    where('event', '==', 'page_view'),
    where('page', 'in', ['/donate', '/bottles', '/']),
    where('timestamp', '>=', startTs),
    where('timestamp', '<=', endTs)
  );
  const visitorsSnap = await getDocs(visitorsQuery);
  const uniqueVisitors = new Set(visitorsSnap.docs.map((d) => d.data().userId || d.data().sessionId)).size;

  // Step 2: Bottle/donation page views
  const donatePageQuery = query(
    collection(db, 'analytics_events'),
    where('event', '==', 'page_view'),
    where('page', '==', '/donate'),
    where('timestamp', '>=', startTs),
    where('timestamp', '<=', endTs)
  );
  const donatePageSnap = await getDocs(donatePageQuery);
  const donatePageVisitors = new Set(donatePageSnap.docs.map((d) => d.data().userId || d.data().sessionId)).size;

  // Step 3: Initiated checkout
  const checkoutQuery = query(
    collection(db, 'analytics_events'),
    where('event', '==', 'checkout_started'),
    where('timestamp', '>=', startTs),
    where('timestamp', '<=', endTs)
  );
  const checkoutSnap = await getDocs(checkoutQuery);
  const checkoutUsers = new Set(checkoutSnap.docs.map((d) => d.data().userId)).size;

  // Step 4: Completed donation
  const completedQuery = query(
    collection(db, 'donations'),
    where('status', '==', 'completed'),
    where('createdAt', '>=', startTs),
    where('createdAt', '<=', endTs)
  );
  const completedSnap = await getDocs(completedQuery);
  const completedDonors = new Set(completedSnap.docs.map((d) => d.data().userId)).size;

  const steps = [
    { name: 'Site Visitors', count: uniqueVisitors },
    { name: 'Donate Page', count: donatePageVisitors },
    { name: 'Checkout Started', count: checkoutUsers },
    { name: 'Donation Completed', count: completedDonors },
  ];

  return steps.map((step, index) => ({
    name: step.name,
    count: step.count,
    conversionRate: index === 0 ? 100 : steps[0].count > 0 ? (step.count / steps[0].count) * 100 : 0,
    dropoffRate:
      index === 0
        ? 0
        : steps[index - 1].count > 0
          ? ((steps[index - 1].count - step.count) / steps[index - 1].count) * 100
          : 0,
  }));
}

// ============================================================================
// COHORT ANALYSIS
// ============================================================================

export async function getCohortRetention(
  dateRange: DateRange,
  periods: number = 6
): Promise<CohortData[]> {
  const { startDate, endDate } = dateRange;

  // Get all users created in the date range
  const usersQuery = query(
    collection(db, 'users'),
    where('createdAt', '>=', Timestamp.fromDate(startDate)),
    where('createdAt', '<=', Timestamp.fromDate(endDate)),
    orderBy('createdAt', 'asc')
  );

  const usersSnap = await getDocs(usersQuery);
  const users = usersSnap.docs.map((d) => ({
    id: d.id,
    createdAt: d.data().createdAt.toDate(),
  }));

  // Group users into monthly cohorts
  const cohortMap = new Map<string, string[]>();
  for (const user of users) {
    const cohortKey = `${user.createdAt.getFullYear()}-${String(user.createdAt.getMonth() + 1).padStart(2, '0')}`;
    if (!cohortMap.has(cohortKey)) cohortMap.set(cohortKey, []);
    cohortMap.get(cohortKey)!.push(user.id);
  }

  // Get all donations in extended range
  const extendedEnd = new Date(endDate);
  extendedEnd.setMonth(extendedEnd.getMonth() + periods);

  const donationsQuery = query(
    collection(db, 'donations'),
    where('createdAt', '>=', Timestamp.fromDate(startDate)),
    where('createdAt', '<=', Timestamp.fromDate(extendedEnd)),
    where('status', '==', 'completed')
  );

  const donationsSnap = await getDocs(donationsQuery);
  const donationsByUser = new Map<string, Date[]>();

  for (const doc of donationsSnap.docs) {
    const data = doc.data();
    const userId = data.userId;
    const date = data.createdAt.toDate();
    if (!donationsByUser.has(userId)) donationsByUser.set(userId, []);
    donationsByUser.get(userId)!.push(date);
  }

  // Calculate retention for each cohort
  const cohorts: CohortData[] = [];

  for (const [cohortKey, userIds] of cohortMap) {
    const [year, month] = cohortKey.split('-').map(Number);
    const cohortStart = new Date(year, month - 1, 1);
    const totalUsers = userIds.length;

    const retentionByPeriod: Record<number, number> = {};

    for (let period = 0; period <= periods; period++) {
      const periodStart = new Date(cohortStart);
      periodStart.setMonth(periodStart.getMonth() + period);
      const periodEnd = new Date(periodStart);
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      let activeUsers = 0;
      for (const userId of userIds) {
        const userDonations = donationsByUser.get(userId) || [];
        const hasActivity = userDonations.some(
          (d) => d >= periodStart && d < periodEnd
        );
        if (hasActivity) activeUsers++;
      }

      retentionByPeriod[period] = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
    }

    cohorts.push({ cohort: cohortKey, totalUsers, retentionByPeriod });
  }

  return cohorts;
}

// ============================================================================
// GEOGRAPHIC DISTRIBUTION
// ============================================================================

export async function getGeographicDistribution(
  dateRange: DateRange
): Promise<GeographicData[]> {
  const { startDate, endDate } = dateRange;
  const startTs = Timestamp.fromDate(startDate);
  const endTs = Timestamp.fromDate(endDate);

  const donationsQuery = query(
    collection(db, 'donations'),
    where('createdAt', '>=', startTs),
    where('createdAt', '<=', endTs),
    where('status', '==', 'completed')
  );

  const snap = await getDocs(donationsQuery);
  const countryMap = new Map<string, { donations: number; amount: number; donors: Set<string> }>();

  for (const doc of snap.docs) {
    const data = doc.data();
    const country = data.country || data.metadata?.country || 'Unknown';
    const countryCode = data.countryCode || data.metadata?.countryCode || 'XX';
    const key = `${country}|${countryCode}`;

    if (!countryMap.has(key)) {
      countryMap.set(key, { donations: 0, amount: 0, donors: new Set() });
    }
    const entry = countryMap.get(key)!;
    entry.donations++;
    entry.amount += data.amount || 0;
    if (data.userId) entry.donors.add(data.userId);
  }

  return Array.from(countryMap.entries())
    .map(([key, data]) => {
      const [country, countryCode] = key.split('|');
      return {
        country,
        countryCode,
        donations: data.donations,
        amount: Math.round(data.amount * 100) / 100,
        donors: data.donors.size,
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

// ============================================================================
// REAL-TIME METRICS
// ============================================================================

export async function getRealTimeMetrics(): Promise<RealTimeMetrics> {
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  const oneHourTs = Timestamp.fromDate(oneHourAgo);

  const fiveMinAgo = new Date();
  fiveMinAgo.setMinutes(fiveMinAgo.getMinutes() - 5);
  const fiveMinTs = Timestamp.fromDate(fiveMinAgo);

  // Active users (last 5 min)
  const activeQuery = query(
    collection(db, 'user_sessions'),
    where('lastActive', '>=', fiveMinTs)
  );
  const activeSnap = await getCountFromServer(activeQuery);

  // Donations last hour
  const donationsQuery = query(
    collection(db, 'donations'),
    where('createdAt', '>=', oneHourTs),
    where('status', '==', 'completed')
  );
  const donationsSnap = await getDocs(donationsQuery);
  const recentDonationsList = donationsSnap.docs.map((d) => ({
    id: d.id,
    amount: d.data().amount,
    currency: d.data().currency || 'EUR',
    country: d.data().country || 'NL',
    timestamp: d.data().createdAt.toDate(),
  }));

  const revenueLastHour = recentDonationsList.reduce((sum, d) => sum + d.amount, 0);

  // Top pages
  const pageViewsQuery = query(
    collection(db, 'analytics_events'),
    where('event', '==', 'page_view'),
    where('timestamp', '>=', fiveMinTs)
  );
  const pageViewsSnap = await getDocs(pageViewsQuery);
  const pageCount = new Map<string, number>();
  for (const doc of pageViewsSnap.docs) {
    const page = doc.data().page || '/';
    pageCount.set(page, (pageCount.get(page) || 0) + 1);
  }
  const topPages = Array.from(pageCount.entries())
    .map(([path, visitors]) => ({ path, visitors }))
    .sort((a, b) => b.visitors - a.visitors)
    .slice(0, 10);

  return {
    activeUsers: activeSnap.data().count,
    activeDonors: new Set(recentDonationsList.map((d) => d.country)).size,
    donationsLastHour: recentDonationsList.length,
    revenueLastHour: Math.round(revenueLastHour * 100) / 100,
    topPages,
    recentDonations: recentDonationsList.slice(0, 20),
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatBucketKey(date: Date, timeframe: AnalyticsTimeframe): string {
  switch (timeframe) {
    case 'hourly':
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:00`;
    case 'daily':
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    case 'weekly': {
      const weekStart = new Date(date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      return `${weekStart.getFullYear()}-W${pad(getWeekNumber(weekStart))}`;
    }
    case 'monthly':
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
    case 'yearly':
      return `${date.getFullYear()}`;
    default:
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }
}

function incrementDate(date: Date, timeframe: AnalyticsTimeframe): void {
  switch (timeframe) {
    case 'hourly':
      date.setHours(date.getHours() + 1);
      break;
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

// ============================================================================
// EXPORT FUNCTIONALITY
// ============================================================================

export async function exportAnalyticsReport(
  dateRange: DateRange,
  sections: string[],
  format: 'csv' | 'json'
): Promise<{ data: string; filename: string; mimeType: string }> {
  const results: Record<string, any> = {};

  if (sections.includes('overview')) {
    results.overview = await getOverviewMetrics(dateRange);
  }
  if (sections.includes('donations')) {
    results.donationTrends = await getDonationTimeSeries(dateRange);
  }
  if (sections.includes('users')) {
    results.userGrowth = await getUserGrowthTimeSeries(dateRange);
  }
  if (sections.includes('funnel')) {
    results.funnel = await getDonationFunnel(dateRange);
  }
  if (sections.includes('cohorts')) {
    results.cohorts = await getCohortRetention(dateRange);
  }
  if (sections.includes('geography')) {
    results.geography = await getGeographicDistribution(dateRange);
  }

  const dateStr = `${dateRange.startDate.toISOString().split('T')[0]}_${dateRange.endDate.toISOString().split('T')[0]}`;

  if (format === 'json') {
    return {
      data: JSON.stringify(results, null, 2),
      filename: `gratis_analytics_${dateStr}.json`,
      mimeType: 'application/json',
    };
  }

  // CSV: flatten the data
  let csv = '';
  for (const [section, data] of Object.entries(results)) {
    csv += `\n=== ${section.toUpperCase()} ===\n`;
    if (Array.isArray(data)) {
      if (data.length > 0) {
        const headers = Object.keys(data[0]).filter((k) => typeof data[0][k] !== 'object');
        csv += headers.join(',') + '\n';
        for (const row of data) {
          csv += headers.map((h) => JSON.stringify(row[h] ?? '')).join(',') + '\n';
        }
      }
    }
  }

  return {
    data: csv,
    filename: `gratis_analytics_${dateStr}.csv`,
    mimeType: 'text/csv',
  };
}
```

---

## PROMPT 43.3: Advanced Analytics Dashboard Component

### FILE: src/components/admin/AdvancedAnalyticsDashboard.tsx

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DollarSign,
  Heart,
  Users,
  UserPlus,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  RefreshCw,
  Globe,
  Activity,
  BarChart3,
  Filter,
  Calendar,
} from 'lucide-react';
import {
  DATE_PRESETS,
  getOverviewMetrics,
  getDonationTimeSeries,
  getUserGrowthTimeSeries,
  getDonationFunnel,
  getCohortRetention,
  getGeographicDistribution,
  getRealTimeMetrics,
  exportAnalyticsReport,
} from '@/lib/analytics/aggregation-service';
import type {
  DateRange,
  MetricCard,
  TimeSeriesDataPoint,
  FunnelStep,
  CohortData,
  GeographicData,
  RealTimeMetrics,
  AnalyticsTimeframe,
} from '@/types/analytics-advanced';

// ============================================================================
// METRIC CARD COMPONENT
// ============================================================================

function MetricCardDisplay({ metric }: { metric: MetricCard }) {
  const iconMap: Record<string, any> = {
    DollarSign,
    Heart,
    Users,
    UserPlus,
    TrendingUp,
  };
  const Icon = iconMap[metric.icon] || DollarSign;

  const formatValue = (val: number, fmt: string) => {
    switch (fmt) {
      case 'currency':
        return `€${val.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}`;
      case 'percent':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString();
    }
  };

  const TrendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-500';

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
            <p className="text-2xl font-bold mt-1">{formatValue(metric.value, metric.format)}</p>
            <div className={`flex items-center mt-1 text-sm ${trendColor}`}>
              <TrendIcon className="h-4 w-4 mr-1" />
              <span>{Math.abs(metric.changePercent).toFixed(1)}%</span>
              <span className="text-muted-foreground ml-1">vs prev period</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${metric.color}20` }}>
            <Icon className="h-6 w-6" style={{ color: metric.color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SIMPLE BAR CHART (CSS-BASED, NO EXTERNAL LIB)
// ============================================================================

function SimpleBarChart({
  data,
  height = 200,
  color = '#6366F1',
  formatLabel,
}: {
  data: TimeSeriesDataPoint[];
  height?: number;
  color?: string;
  formatLabel?: (v: number) => string;
}) {
  if (data.length === 0) return <p className="text-muted-foreground text-center py-8">No data available</p>;

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const labelFn = formatLabel || ((v: number) => v.toLocaleString());

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-end gap-1 min-w-full" style={{ height }}>
        {data.map((point, idx) => {
          const barHeight = (point.value / maxValue) * (height - 30);
          return (
            <div key={idx} className="flex flex-col items-center flex-1 min-w-[20px] group relative">
              <div
                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10"
              >
                {point.date}: {labelFn(point.value)}
              </div>
              <div
                className="w-full rounded-t transition-all hover:opacity-80"
                style={{
                  height: Math.max(barHeight, 2),
                  backgroundColor: color,
                  minWidth: 8,
                }}
              />
              {data.length <= 14 && (
                <span className="text-[10px] text-muted-foreground mt-1 truncate w-full text-center">
                  {point.date.split('-').slice(-1)[0]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// FUNNEL CHART
// ============================================================================

function FunnelChart({ steps }: { steps: FunnelStep[] }) {
  if (steps.length === 0) return null;
  const maxCount = Math.max(...steps.map((s) => s.count), 1);

  return (
    <div className="space-y-3">
      {steps.map((step, idx) => {
        const width = (step.count / maxCount) * 100;
        return (
          <div key={idx}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{step.name}</span>
              <span className="text-muted-foreground">
                {step.count.toLocaleString()} ({step.conversionRate.toFixed(1)}%)
              </span>
            </div>
            <div className="relative h-10 bg-muted rounded">
              <div
                className="h-full rounded transition-all"
                style={{
                  width: `${Math.max(width, 2)}%`,
                  backgroundColor: `hsl(${220 + idx * 30}, 70%, 55%)`,
                }}
              />
              {idx > 0 && step.dropoffRate > 0 && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-red-500 font-medium">
                  -{step.dropoffRate.toFixed(1)}% dropoff
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// COHORT TABLE
// ============================================================================

function CohortTable({ cohorts }: { cohorts: CohortData[] }) {
  if (cohorts.length === 0) return <p className="text-muted-foreground text-center py-8">No cohort data</p>;

  const maxPeriods = Math.max(...cohorts.map((c) => Object.keys(c.retentionByPeriod).length));

  const getRetentionColor = (rate: number): string => {
    if (rate >= 50) return 'bg-green-500/80 text-white';
    if (rate >= 30) return 'bg-green-400/60';
    if (rate >= 15) return 'bg-yellow-400/40';
    if (rate >= 5) return 'bg-orange-300/30';
    if (rate > 0) return 'bg-red-300/20';
    return 'bg-muted';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left p-2 font-medium">Cohort</th>
            <th className="text-center p-2 font-medium">Users</th>
            {Array.from({ length: maxPeriods }, (_, i) => (
              <th key={i} className="text-center p-2 font-medium">Month {i}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cohorts.map((cohort) => (
            <tr key={cohort.cohort} className="border-t">
              <td className="p-2 font-medium">{cohort.cohort}</td>
              <td className="p-2 text-center">{cohort.totalUsers}</td>
              {Array.from({ length: maxPeriods }, (_, i) => {
                const rate = cohort.retentionByPeriod[i] || 0;
                return (
                  <td key={i} className="p-1 text-center">
                    <div className={`rounded py-1 px-2 text-xs font-medium ${getRetentionColor(rate)}`}>
                      {rate > 0 ? `${rate.toFixed(0)}%` : '-'}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// GEOGRAPHIC TABLE
// ============================================================================

function GeoTable({ data }: { data: GeographicData[] }) {
  if (data.length === 0) return <p className="text-muted-foreground text-center py-8">No geographic data</p>;

  const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-2">
      {data.slice(0, 20).map((geo) => {
        const pct = totalAmount > 0 ? (geo.amount / totalAmount) * 100 : 0;
        return (
          <div key={geo.countryCode} className="flex items-center gap-3">
            <span className="text-lg w-8">{countryToFlag(geo.countryCode)}</span>
            <div className="flex-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{geo.country}</span>
                <span>€{geo.amount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="h-2 bg-muted rounded-full mt-1">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${Math.max(pct, 1)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
                <span>{geo.donations} donations</span>
                <span>{geo.donors} donors</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function countryToFlag(code: string): string {
  if (!code || code === 'XX') return '🌍';
  const codePoints = [...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...codePoints);
}

// ============================================================================
// REAL-TIME PANEL
// ============================================================================

function RealTimePanel({ metrics }: { metrics: RealTimeMetrics | null }) {
  if (!metrics) return <p className="text-muted-foreground text-center py-8">Loading real-time data...</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="h-6 w-6 mx-auto text-green-500" />
            <p className="text-2xl font-bold mt-1">{metrics.activeUsers}</p>
            <p className="text-xs text-muted-foreground">Active Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="h-6 w-6 mx-auto text-red-500" />
            <p className="text-2xl font-bold mt-1">{metrics.donationsLastHour}</p>
            <p className="text-xs text-muted-foreground">Donations (1h)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 mx-auto text-green-500" />
            <p className="text-2xl font-bold mt-1">
              €{metrics.revenueLastHour.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground">Revenue (1h)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Globe className="h-6 w-6 mx-auto text-blue-500" />
            <p className="text-2xl font-bold mt-1">{metrics.activeDonors}</p>
            <p className="text-xs text-muted-foreground">Countries (1h)</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {metrics.recentDonations.map((d) => (
              <div key={d.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-2">
                  <span>{countryToFlag(d.country)}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(d.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <span className="font-medium text-green-600">
                  +€{d.amount.toFixed(2)}
                </span>
              </div>
            ))}
            {metrics.recentDonations.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">No recent donations</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Top Pages (5 min)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {metrics.topPages.map((page) => (
              <div key={page.path} className="flex justify-between text-sm">
                <span className="font-mono text-muted-foreground">{page.path}</span>
                <Badge variant="secondary">{page.visitors}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// MAIN DASHBOARD
// ============================================================================

export default function AdvancedAnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>(DATE_PRESETS.last30Days());
  const [timeframe, setTimeframe] = useState<AnalyticsTimeframe>('daily');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Data states
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [donationTrends, setDonationTrends] = useState<TimeSeriesDataPoint[]>([]);
  const [userGrowth, setUserGrowth] = useState<TimeSeriesDataPoint[]>([]);
  const [funnel, setFunnel] = useState<FunnelStep[]>([]);
  const [cohorts, setCohorts] = useState<CohortData[]>([]);
  const [geoData, setGeoData] = useState<GeographicData[]>([]);
  const [realTime, setRealTime] = useState<RealTimeMetrics | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [m, dt, ug, f, c, g] = await Promise.all([
        getOverviewMetrics(dateRange),
        getDonationTimeSeries(dateRange, timeframe),
        getUserGrowthTimeSeries(dateRange, timeframe),
        getDonationFunnel(dateRange),
        getCohortRetention(dateRange),
        getGeographicDistribution(dateRange),
      ]);
      setMetrics(m);
      setDonationTrends(dt);
      setUserGrowth(ug);
      setFunnel(f);
      setCohorts(c);
      setGeoData(g);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange, timeframe]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time data polling
  useEffect(() => {
    if (activeTab === 'realtime') {
      const load = async () => {
        try {
          const rt = await getRealTimeMetrics();
          setRealTime(rt);
        } catch (e) {
          console.error('Real-time fetch error:', e);
        }
      };
      load();
      const interval = setInterval(load, 15000); // 15 sec refresh
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const handleExport = async (format: 'csv' | 'json') => {
    setExporting(true);
    try {
      const result = await exportAnalyticsReport(
        dateRange,
        ['overview', 'donations', 'users', 'funnel', 'cohorts', 'geography'],
        format
      );
      const blob = new Blob([result.data], { type: result.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed:', e);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Platform performance & insights</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value={dateRange.label}
            onValueChange={(val) => {
              const preset = Object.values(DATE_PRESETS).find((p) => p().label === val);
              if (preset) setDateRange(preset());
            }}
          >
            <SelectTrigger className="w-[160px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(DATE_PRESETS).map((preset) => (
                <SelectItem key={preset().label} value={preset().label}>
                  {preset().label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeframe} onValueChange={(v) => setTimeframe(v as AnalyticsTimeframe)}>
            <SelectTrigger className="w-[120px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={loadData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <Button variant="outline" onClick={() => handleExport('csv')} disabled={exporting}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('json')} disabled={exporting}>
            <Download className="h-4 w-4 mr-2" />
            JSON
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((m) => (
          <MetricCardDisplay key={m.id} metric={m} />
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-1" /> Overview
          </TabsTrigger>
          <TabsTrigger value="funnel">
            <Filter className="h-4 w-4 mr-1" /> Funnel
          </TabsTrigger>
          <TabsTrigger value="cohorts">
            <Users className="h-4 w-4 mr-1" /> Cohorts
          </TabsTrigger>
          <TabsTrigger value="geography">
            <Globe className="h-4 w-4 mr-1" /> Geography
          </TabsTrigger>
          <TabsTrigger value="realtime">
            <Activity className="h-4 w-4 mr-1" /> Real-Time
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Donation Trends</CardTitle>
                <CardDescription>Revenue over time ({timeframe})</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleBarChart
                  data={donationTrends}
                  color="#10B981"
                  formatLabel={(v) => `€${v.toFixed(2)}`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New registrations ({timeframe})</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleBarChart data={userGrowth} color="#6366F1" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnel">
          <Card>
            <CardHeader>
              <CardTitle>Donation Funnel</CardTitle>
              <CardDescription>Conversion from visitor to donor</CardDescription>
            </CardHeader>
            <CardContent>
              <FunnelChart steps={funnel} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cohorts">
          <Card>
            <CardHeader>
              <CardTitle>Cohort Retention</CardTitle>
              <CardDescription>Monthly donor retention by signup cohort</CardDescription>
            </CardHeader>
            <CardContent>
              <CohortTable cohorts={cohorts} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Donations by country</CardDescription>
            </CardHeader>
            <CardContent>
              <GeoTable data={geoData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime">
          <RealTimePanel metrics={realTime} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

## PROMPT 43.4: Analytics API Routes

### FILE: src/app/api/admin/analytics/overview/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getOverviewMetrics, DATE_PRESETS } from '@/lib/analytics/aggregation-service';
import { verifyAdminAuth } from '@/lib/auth/admin';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const preset = searchParams.get('preset') || 'last30Days';
    const startStr = searchParams.get('start');
    const endStr = searchParams.get('end');

    let dateRange;
    if (startStr && endStr) {
      dateRange = {
        startDate: new Date(startStr),
        endDate: new Date(endStr),
        label: 'Custom',
      };
    } else {
      const presetFn = DATE_PRESETS[preset as keyof typeof DATE_PRESETS];
      dateRange = presetFn ? presetFn() : DATE_PRESETS.last30Days();
    }

    const metrics = await getOverviewMetrics(dateRange);
    return NextResponse.json({ metrics, dateRange: { label: dateRange.label } });
  } catch (error) {
    console.error('Analytics overview error:', error);
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 });
  }
}
```

### FILE: src/app/api/admin/analytics/donation-trends/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getDonationTimeSeries, DATE_PRESETS } from '@/lib/analytics/aggregation-service';
import { verifyAdminAuth } from '@/lib/auth/admin';
import type { AnalyticsTimeframe } from '@/types/analytics-advanced';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const preset = searchParams.get('preset') || 'last30Days';
    const timeframe = (searchParams.get('timeframe') || 'daily') as AnalyticsTimeframe;

    const presetFn = DATE_PRESETS[preset as keyof typeof DATE_PRESETS];
    const dateRange = presetFn ? presetFn() : DATE_PRESETS.last30Days();

    const trends = await getDonationTimeSeries(dateRange, timeframe);
    return NextResponse.json({ trends });
  } catch (error) {
    console.error('Donation trends error:', error);
    return NextResponse.json({ error: 'Failed to load trends' }, { status: 500 });
  }
}
```

### FILE: src/app/api/admin/analytics/funnel/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getDonationFunnel, DATE_PRESETS } from '@/lib/analytics/aggregation-service';
import { verifyAdminAuth } from '@/lib/auth/admin';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const preset = searchParams.get('preset') || 'last30Days';

    const presetFn = DATE_PRESETS[preset as keyof typeof DATE_PRESETS];
    const dateRange = presetFn ? presetFn() : DATE_PRESETS.last30Days();

    const funnel = await getDonationFunnel(dateRange);
    return NextResponse.json({ funnel });
  } catch (error) {
    console.error('Funnel error:', error);
    return NextResponse.json({ error: 'Failed to load funnel' }, { status: 500 });
  }
}
```

### FILE: src/app/api/admin/analytics/cohorts/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getCohortRetention, DATE_PRESETS } from '@/lib/analytics/aggregation-service';
import { verifyAdminAuth } from '@/lib/auth/admin';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const preset = searchParams.get('preset') || 'last90Days';
    const periods = parseInt(searchParams.get('periods') || '6');

    const presetFn = DATE_PRESETS[preset as keyof typeof DATE_PRESETS];
    const dateRange = presetFn ? presetFn() : DATE_PRESETS.last90Days();

    const cohorts = await getCohortRetention(dateRange, periods);
    return NextResponse.json({ cohorts });
  } catch (error) {
    console.error('Cohorts error:', error);
    return NextResponse.json({ error: 'Failed to load cohorts' }, { status: 500 });
  }
}
```

### FILE: src/app/api/admin/analytics/geo/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getGeographicDistribution, DATE_PRESETS } from '@/lib/analytics/aggregation-service';
import { verifyAdminAuth } from '@/lib/auth/admin';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const preset = searchParams.get('preset') || 'last30Days';

    const presetFn = DATE_PRESETS[preset as keyof typeof DATE_PRESETS];
    const dateRange = presetFn ? presetFn() : DATE_PRESETS.last30Days();

    const geoData = await getGeographicDistribution(dateRange);
    return NextResponse.json({ geoData });
  } catch (error) {
    console.error('Geographic error:', error);
    return NextResponse.json({ error: 'Failed to load geo data' }, { status: 500 });
  }
}
```

### FILE: src/app/api/admin/analytics/realtime/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getRealTimeMetrics } from '@/lib/analytics/aggregation-service';
import { verifyAdminAuth } from '@/lib/auth/admin';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const metrics = await getRealTimeMetrics();
    return NextResponse.json({ metrics });
  } catch (error) {
    console.error('Real-time error:', error);
    return NextResponse.json({ error: 'Failed to load real-time data' }, { status: 500 });
  }
}
```

### FILE: src/app/api/admin/analytics/export/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { exportAnalyticsReport, DATE_PRESETS } from '@/lib/analytics/aggregation-service';
import { verifyAdminAuth } from '@/lib/auth/admin';

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { preset = 'last30Days', format = 'csv', sections = ['overview', 'donations', 'users'] } = body;

    const presetFn = DATE_PRESETS[preset as keyof typeof DATE_PRESETS];
    const dateRange = presetFn ? presetFn() : DATE_PRESETS.last30Days();

    const report = await exportAnalyticsReport(dateRange, sections, format);
    return new NextResponse(report.data, {
      headers: {
        'Content-Type': report.mimeType,
        'Content-Disposition': `attachment; filename="${report.filename}"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
```

### FILE: src/app/admin/analytics/page.tsx

```typescript
import AdvancedAnalyticsDashboard from '@/components/admin/AdvancedAnalyticsDashboard';

export const metadata = {
  title: 'Analytics | GRATIS.NGO Admin',
  description: 'Advanced analytics dashboard',
};

export default function AdminAnalyticsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <AdvancedAnalyticsDashboard />
    </div>
  );
}
```


---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 44: GDPR COMPLIANCE ENGINE
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 44.1: GDPR Types & Consent Manager

Create the GDPR compliance engine for GRATIS.NGO with consent tracking, data export, right to erasure, and cookie management. Must comply with Dutch GDPR (AVG) requirements and ANBI tax retention rules.

### FILE: src/types/gdpr.ts

```typescript
// ============================================================================
// GDPR COMPLIANCE TYPE DEFINITIONS
// ============================================================================

export type ConsentType =
  | 'essential'
  | 'analytics'
  | 'marketing'
  | 'personalization'
  | 'third_party'
  | 'newsletter'
  | 'profiling';

export type ConsentStatus = 'granted' | 'denied' | 'pending';

export interface ConsentRecord {
  id: string;
  userId: string;
  consentType: ConsentType;
  status: ConsentStatus;
  version: string; // Policy version
  grantedAt: Date | null;
  revokedAt: Date | null;
  ipAddress: string;
  userAgent: string;
  source: 'cookie_banner' | 'privacy_settings' | 'registration' | 'api';
}

export interface ConsentPreferences {
  essential: boolean; // Always true, cannot be disabled
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  thirdParty: boolean;
  newsletter: boolean;
  profiling: boolean;
}

export interface DataExportRequest {
  id: string;
  userId: string;
  requestedAt: Date;
  status: 'pending' | 'processing' | 'ready' | 'downloaded' | 'expired';
  format: 'json' | 'csv';
  downloadUrl?: string;
  downloadExpiry?: Date;
  completedAt?: Date;
  fileSize?: number;
}

export interface DataDeletionRequest {
  id: string;
  userId: string;
  requestedAt: Date;
  status: 'pending' | 'verification_sent' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  reason?: string;
  verificationToken?: string;
  verificationExpiry?: Date;
  confirmedAt?: Date;
  completedAt?: Date;
  retainedRecords?: string[]; // ANBI-required financial records
}

export interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  cookies: {
    name: string;
    provider: string;
    purpose: string;
    expiry: string;
    type: 'http' | 'local_storage' | 'session_storage';
  }[];
}

export interface DataBreachRecord {
  id: string;
  detectedAt: Date;
  reportedAt?: Date;
  description: string;
  affectedUsers: number;
  dataTypes: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'investigating' | 'contained' | 'resolved' | 'reported';
  notifiedAuthority: boolean; // Autoriteit Persoonsgegevens
  notifiedUsers: boolean;
}
```

---

## PROMPT 44.2: Consent Management Service

### FILE: src/lib/gdpr/consent.ts

```typescript
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ConsentType, ConsentStatus, ConsentRecord, ConsentPreferences } from '@/types/gdpr';

const CONSENT_POLICY_VERSION = '2.0';

const DEFAULT_PREFERENCES: ConsentPreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  personalization: false,
  thirdParty: false,
  newsletter: false,
  profiling: false,
};

// Map consent type to preferences key
const CONSENT_MAP: Record<ConsentType, keyof ConsentPreferences> = {
  essential: 'essential',
  analytics: 'analytics',
  marketing: 'marketing',
  personalization: 'personalization',
  third_party: 'thirdParty',
  newsletter: 'newsletter',
  profiling: 'profiling',
};

export class ConsentManager {
  /**
   * Record user consent for a specific type
   */
  static async recordConsent(
    userId: string,
    consentType: ConsentType,
    status: ConsentStatus,
    metadata: { ipAddress: string; userAgent: string; source: ConsentRecord['source'] }
  ): Promise<ConsentRecord> {
    const record: Omit<ConsentRecord, 'id'> = {
      userId,
      consentType,
      status,
      version: CONSENT_POLICY_VERSION,
      grantedAt: status === 'granted' ? new Date() : null,
      revokedAt: status === 'denied' ? new Date() : null,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      source: metadata.source,
    };

    const docRef = await addDoc(collection(db, 'consent_records'), {
      ...record,
      grantedAt: record.grantedAt ? Timestamp.fromDate(record.grantedAt) : null,
      revokedAt: record.revokedAt ? Timestamp.fromDate(record.revokedAt) : null,
      createdAt: Timestamp.now(),
    });

    // Update user preferences document
    const prefKey = CONSENT_MAP[consentType];
    if (prefKey && prefKey !== 'essential') {
      const prefsRef = doc(db, 'user_consent_preferences', userId);
      const currentPrefs = await getDoc(prefsRef);
      const existing = currentPrefs.exists() ? currentPrefs.data() : { ...DEFAULT_PREFERENCES };

      await setDoc(prefsRef, {
        ...existing,
        [prefKey]: status === 'granted',
        lastUpdated: Timestamp.now(),
        policyVersion: CONSENT_POLICY_VERSION,
      });
    }

    return { id: docRef.id, ...record };
  }

  /**
   * Record bulk consent (e.g., from cookie banner "Accept All")
   */
  static async recordBulkConsent(
    userId: string,
    preferences: Partial<ConsentPreferences>,
    metadata: { ipAddress: string; userAgent: string; source: ConsentRecord['source'] }
  ): Promise<void> {
    const consentTypes: ConsentType[] = [
      'analytics', 'marketing', 'personalization', 'third_party', 'newsletter', 'profiling',
    ];

    for (const type of consentTypes) {
      const prefKey = CONSENT_MAP[type];
      const status: ConsentStatus = preferences[prefKey] ? 'granted' : 'denied';
      await this.recordConsent(userId, type, status, metadata);
    }
  }

  /**
   * Get current user consent preferences
   */
  static async getPreferences(userId: string): Promise<ConsentPreferences> {
    const prefsRef = doc(db, 'user_consent_preferences', userId);
    const snap = await getDoc(prefsRef);

    if (!snap.exists()) return { ...DEFAULT_PREFERENCES };

    const data = snap.data();
    return {
      essential: true, // Always true
      analytics: data.analytics ?? false,
      marketing: data.marketing ?? false,
      personalization: data.personalization ?? false,
      thirdParty: data.thirdParty ?? false,
      newsletter: data.newsletter ?? false,
      profiling: data.profiling ?? false,
    };
  }

  /**
   * Get full consent history for a user (for GDPR access requests)
   */
  static async getConsentHistory(userId: string): Promise<ConsentRecord[]> {
    const q = query(
      collection(db, 'consent_records'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      grantedAt: d.data().grantedAt?.toDate() || null,
      revokedAt: d.data().revokedAt?.toDate() || null,
    })) as ConsentRecord[];
  }

  /**
   * Check if user has consented to a specific type
   */
  static async hasConsent(userId: string, consentType: ConsentType): Promise<boolean> {
    if (consentType === 'essential') return true;
    const prefs = await this.getPreferences(userId);
    const prefKey = CONSENT_MAP[consentType];
    return prefs[prefKey] ?? false;
  }
}
```

---

## PROMPT 44.3: Data Export & Deletion Services

### FILE: src/lib/gdpr/data-export.ts

```typescript
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { DataExportRequest } from '@/types/gdpr';

// All user data collections to export
const USER_COLLECTIONS = [
  'users',
  'donations',
  'orders',
  'subscriptions',
  'tribe_memberships',
  'event_registrations',
  'referrals',
  'user_badges',
  'user_levels',
  'user_streaks',
  'social_posts',
  'consent_records',
  'support_tickets',
];

export class DataExporter {
  /**
   * Create a new data export request
   */
  static async requestExport(
    userId: string,
    format: 'json' | 'csv' = 'json'
  ): Promise<DataExportRequest> {
    // Check for existing pending request
    const existingQuery = query(
      collection(db, 'data_export_requests'),
      where('userId', '==', userId),
      where('status', 'in', ['pending', 'processing'])
    );
    const existing = await getDocs(existingQuery);
    if (!existing.empty) {
      throw new Error('An export request is already in progress');
    }

    const request: Omit<DataExportRequest, 'id'> = {
      userId,
      requestedAt: new Date(),
      status: 'pending',
      format,
    };

    const docRef = doc(collection(db, 'data_export_requests'));
    await setDoc(docRef, {
      ...request,
      requestedAt: Timestamp.now(),
    });

    // Trigger background processing
    await this.processExport(docRef.id, userId, format);

    return { id: docRef.id, ...request };
  }

  /**
   * Process the export (gather all user data)
   */
  static async processExport(
    requestId: string,
    userId: string,
    format: 'json' | 'csv'
  ): Promise<void> {
    const requestRef = doc(db, 'data_export_requests', requestId);

    try {
      // Update status
      await setDoc(requestRef, { status: 'processing' }, { merge: true });

      const exportData: Record<string, any[]> = {};

      // Collect data from all user-related collections
      for (const collectionName of USER_COLLECTIONS) {
        try {
          let docs;
          if (collectionName === 'users') {
            // Direct document lookup
            const userDoc = await getDoc(doc(db, 'users', userId));
            docs = userDoc.exists() ? [{ id: userDoc.id, ...userDoc.data() }] : [];
          } else {
            const q = query(
              collection(db, collectionName),
              where('userId', '==', userId)
            );
            const snap = await getDocs(q);
            docs = snap.docs.map((d) => ({
              id: d.id,
              ...d.data(),
              // Convert Timestamps to ISO strings
              ...(d.data().createdAt && {
                createdAt: d.data().createdAt.toDate?.()?.toISOString() || d.data().createdAt,
              }),
              ...(d.data().updatedAt && {
                updatedAt: d.data().updatedAt.toDate?.()?.toISOString() || d.data().updatedAt,
              }),
            }));
          }

          if (docs.length > 0) {
            exportData[collectionName] = docs;
          }
        } catch (error) {
          console.error(`Error exporting ${collectionName}:`, error);
          exportData[collectionName] = [{ error: 'Failed to export this collection' }];
        }
      }

      // Format data
      let content: string;
      if (format === 'json') {
        content = JSON.stringify(
          {
            exportDate: new Date().toISOString(),
            userId,
            dataControllerInfo: {
              name: 'Stichting GRATIS',
              address: 'Amsterdam, Netherlands',
              email: 'privacy@gratis.ngo',
              kvkNumber: 'XXXXXXXXX',
            },
            data: exportData,
          },
          null,
          2
        );
      } else {
        // CSV format - create one CSV section per collection
        const sections: string[] = [];
        for (const [collName, records] of Object.entries(exportData)) {
          if (records.length === 0) continue;
          const headers = Object.keys(records[0]);
          const csvRows = records.map((r) =>
            headers.map((h) => {
              const val = r[h];
              if (val === null || val === undefined) return '';
              const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
              return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
            }).join(',')
          );
          sections.push(`=== ${collName} ===\n${headers.join(',')}\n${csvRows.join('\n')}`);
        }
        content = sections.join('\n\n');
      }

      // Upload to Firebase Storage with 7-day expiry
      const storageRef = ref(
        storage,
        `gdpr-exports/${userId}/${requestId}.${format}`
      );
      await uploadString(storageRef, content);
      const downloadUrl = await getDownloadURL(storageRef);

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);

      await setDoc(
        requestRef,
        {
          status: 'ready',
          downloadUrl,
          downloadExpiry: Timestamp.fromDate(expiryDate),
          completedAt: Timestamp.now(),
          fileSize: new Blob([content]).size,
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Export processing failed:', error);
      await setDoc(requestRef, { status: 'expired' }, { merge: true });
      throw error;
    }
  }
}
```

### FILE: src/lib/gdpr/data-deletion.ts

```typescript
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { deleteUser as deleteAuthUser } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { sendEmail } from '@/lib/email/resend';
import type { DataDeletionRequest } from '@/types/gdpr';
import crypto from 'crypto';

// Collections that contain user data
const DELETABLE_COLLECTIONS = [
  'social_posts',
  'comments',
  'event_registrations',
  'user_badges',
  'user_levels',
  'user_streaks',
  'user_challenges',
  'referrals',
  'support_tickets',
  'user_sessions',
  'analytics_events',
  'consent_records',
  'user_consent_preferences',
  'notifications',
];

// Collections with financial data (ANBI: 7-year retention)
const ANONYMIZE_COLLECTIONS = [
  'donations',
  'orders',
  'subscriptions',
  'tax_receipts',
  'invoices',
];

export class DataDeleter {
  /**
   * Request account deletion (sends verification email)
   */
  static async requestDeletion(
    userId: string,
    reason?: string
  ): Promise<DataDeletionRequest> {
    // Check for existing pending request
    const existingQuery = query(
      collection(db, 'data_deletion_requests'),
      where('userId', '==', userId),
      where('status', 'in', ['pending', 'verification_sent', 'confirmed', 'processing'])
    );
    const existing = await getDocs(existingQuery);
    if (!existing.empty) {
      throw new Error('A deletion request is already in progress');
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date();
    verificationExpiry.setHours(verificationExpiry.getHours() + 24); // 24h expiry

    const request: Omit<DataDeletionRequest, 'id'> = {
      userId,
      requestedAt: new Date(),
      status: 'verification_sent',
      reason,
      verificationToken,
      verificationExpiry,
    };

    const docRef = doc(collection(db, 'data_deletion_requests'));
    await setDoc(docRef, {
      ...request,
      requestedAt: Timestamp.now(),
      verificationExpiry: Timestamp.fromDate(verificationExpiry),
    });

    // Get user email
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userEmail = userDoc.data()?.email;

    if (userEmail) {
      await sendEmail({
        to: userEmail,
        subject: 'GRATIS.NGO - Confirm Account Deletion',
        html: `
          <h2>Account Deletion Request</h2>
          <p>We received a request to delete your GRATIS.NGO account and all associated data.</p>
          <p><strong>This action is irreversible.</strong></p>
          <p>If you want to proceed, click the link below within 24 hours:</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/account/delete/confirm?token=${verificationToken}&requestId=${docRef.id}">
            Confirm Account Deletion
          </a></p>
          <p>If you did not request this, please ignore this email.</p>
          <hr>
          <p><small>Per Dutch GDPR (AVG) law, financial records related to donations will be retained in anonymized form for 7 years (ANBI requirement).</small></p>
        `,
      });
    }

    return { id: docRef.id, ...request };
  }

  /**
   * Confirm deletion with verification token
   */
  static async confirmDeletion(requestId: string, token: string): Promise<void> {
    const requestRef = doc(db, 'data_deletion_requests', requestId);
    const requestDoc = await getDoc(requestRef);

    if (!requestDoc.exists()) throw new Error('Deletion request not found');

    const data = requestDoc.data();

    if (data.status !== 'verification_sent') {
      throw new Error('Request already processed or expired');
    }
    if (data.verificationToken !== token) {
      throw new Error('Invalid verification token');
    }
    if (data.verificationExpiry.toDate() < new Date()) {
      throw new Error('Verification token expired');
    }

    await setDoc(
      requestRef,
      { status: 'confirmed', confirmedAt: Timestamp.now() },
      { merge: true }
    );

    // Process deletion
    await this.processDeletion(requestId, data.userId);
  }

  /**
   * Process the actual data deletion
   */
  static async processDeletion(requestId: string, userId: string): Promise<void> {
    const requestRef = doc(db, 'data_deletion_requests', requestId);
    const retainedRecords: string[] = [];

    try {
      await setDoc(requestRef, { status: 'processing' }, { merge: true });

      // 1. Anonymize financial records (ANBI 7-year retention)
      for (const collName of ANONYMIZE_COLLECTIONS) {
        const q = query(collection(db, collName), where('userId', '==', userId));
        const snap = await getDocs(q);

        for (const docSnap of snap.docs) {
          await updateDoc(doc(db, collName, docSnap.id), {
            userId: 'DELETED_USER',
            email: null,
            name: 'Anonymous Donor',
            firstName: null,
            lastName: null,
            phone: null,
            address: null,
            ipAddress: null,
            userAgent: null,
            anonymizedAt: Timestamp.now(),
            anonymizationReason: 'gdpr_deletion',
          });
          retainedRecords.push(`${collName}/${docSnap.id}`);
        }
      }

      // 2. Delete personal data collections
      for (const collName of DELETABLE_COLLECTIONS) {
        const q = query(collection(db, collName), where('userId', '==', userId));
        const snap = await getDocs(q);

        const batch = writeBatch(db);
        let count = 0;
        for (const docSnap of snap.docs) {
          batch.delete(doc(db, collName, docSnap.id));
          count++;
          // Firestore batch limit is 500
          if (count >= 450) {
            await batch.commit();
            count = 0;
          }
        }
        if (count > 0) await batch.commit();
      }

      // 3. Delete user profile
      await deleteDoc(doc(db, 'users', userId));

      // 4. Cancel Stripe subscriptions
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        const stripeCustomerId = userDoc.data()?.stripeCustomerId;
        if (stripeCustomerId) {
          // Stripe cancellation would go here
          console.log(`Would cancel Stripe subscriptions for: ${stripeCustomerId}`);
        }
      } catch (e) {
        console.error('Stripe cancellation error:', e);
      }

      // 5. Delete Firebase Auth account
      try {
        const currentUser = auth.currentUser;
        if (currentUser && currentUser.uid === userId) {
          await deleteAuthUser(currentUser);
        }
      } catch (e) {
        console.error('Auth deletion error (may need admin SDK):', e);
      }

      // 6. Mark request complete
      await setDoc(
        requestRef,
        {
          status: 'completed',
          completedAt: Timestamp.now(),
          retainedRecords,
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Deletion processing failed:', error);
      await setDoc(requestRef, { status: 'pending', error: String(error) }, { merge: true });
      throw error;
    }
  }
}
```

---

## PROMPT 44.4: Cookie Consent Banner & Privacy Dashboard

### FILE: src/components/gdpr/CookieConsentBanner.tsx

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Shield, ChevronDown, ChevronUp, Cookie, X } from 'lucide-react';
import { ConsentManager } from '@/lib/gdpr/consent';
import { useAuth } from '@/hooks/useAuth';
import type { ConsentPreferences, CookieCategory } from '@/types/gdpr';

const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: 'essential',
    name: 'Essential Cookies',
    description: 'Required for the website to function. Cannot be disabled.',
    required: true,
    cookies: [
      { name: '__session', provider: 'GRATIS.NGO', purpose: 'User authentication', expiry: '30 days', type: 'http' },
      { name: 'csrf_token', provider: 'GRATIS.NGO', purpose: 'Security', expiry: 'Session', type: 'http' },
      { name: 'cookie_consent', provider: 'GRATIS.NGO', purpose: 'Store consent preferences', expiry: '1 year', type: 'local_storage' },
    ],
  },
  {
    id: 'analytics',
    name: 'Analytics Cookies',
    description: 'Help us understand how visitors interact with our website.',
    required: false,
    cookies: [
      { name: '_ga', provider: 'Google Analytics', purpose: 'Distinguish users', expiry: '2 years', type: 'http' },
      { name: '_ga_*', provider: 'Google Analytics', purpose: 'Session state', expiry: '2 years', type: 'http' },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing Cookies',
    description: 'Used to deliver relevant advertisements and track campaigns.',
    required: false,
    cookies: [
      { name: '_fbp', provider: 'Facebook', purpose: 'Ad targeting', expiry: '3 months', type: 'http' },
      { name: 'li_sugr', provider: 'LinkedIn', purpose: 'Browser ID', expiry: '3 months', type: 'http' },
    ],
  },
  {
    id: 'personalization',
    name: 'Personalization Cookies',
    description: 'Remember your preferences and personalize your experience.',
    required: false,
    cookies: [
      { name: 'user_prefs', provider: 'GRATIS.NGO', purpose: 'UI preferences', expiry: '1 year', type: 'local_storage' },
      { name: 'language', provider: 'GRATIS.NGO', purpose: 'Language preference', expiry: '1 year', type: 'local_storage' },
    ],
  },
];

export default function CookieConsentBanner() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    personalization: false,
    thirdParty: false,
    newsletter: false,
    profiling: false,
  });

  useEffect(() => {
    // Check if consent was already given
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setVisible(true);
    } else {
      try {
        setPreferences(JSON.parse(consent));
      } catch {
        setVisible(true);
      }
    }
  }, []);

  const getMetadata = () => ({
    ipAddress: 'client-side', // Server would capture real IP
    userAgent: navigator.userAgent,
    source: 'cookie_banner' as const,
  });

  const savePreferences = async (prefs: ConsentPreferences) => {
    localStorage.setItem('cookie_consent', JSON.stringify(prefs));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());

    if (user) {
      await ConsentManager.recordBulkConsent(user.uid, prefs, getMetadata());
    }

    setVisible(false);
    // Trigger analytics scripts based on consent
    if (prefs.analytics) enableAnalytics();
    if (prefs.marketing) enableMarketing();
  };

  const handleAcceptAll = () => {
    const allAccepted: ConsentPreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      personalization: true,
      thirdParty: true,
      newsletter: false, // Newsletter requires separate opt-in
      profiling: false,
    };
    setPreferences(allAccepted);
    savePreferences(allAccepted);
  };

  const handleRejectAll = () => {
    const allRejected: ConsentPreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      personalization: false,
      thirdParty: false,
      newsletter: false,
      profiling: false,
    };
    setPreferences(allRejected);
    savePreferences(allRejected);
  };

  const handleSaveCustom = () => {
    savePreferences(preferences);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur border-t shadow-lg">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-start gap-3">
          <Cookie className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Cookie Preferences</h3>
            <p className="text-sm text-muted-foreground mt-1">
              We use cookies to improve your experience, analyze site traffic, and for marketing purposes.
              You can choose which cookies to accept. Essential cookies cannot be disabled as they are
              required for the site to function.{' '}
              <a href="/legal/cookie-policy" className="underline">
                Read our Cookie Policy
              </a>
            </p>

            {showDetails && (
              <div className="mt-4 space-y-3">
                {COOKIE_CATEGORIES.map((category) => {
                  const prefKey = category.id as keyof ConsentPreferences;
                  const isExpanded = expandedCategory === category.id;

                  return (
                    <div key={category.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div
                          className="flex items-center gap-2 cursor-pointer flex-1"
                          onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          <span className="font-medium text-sm">{category.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({category.cookies.length} cookies)
                          </span>
                        </div>
                        <Switch
                          checked={category.required || preferences[prefKey]}
                          disabled={category.required}
                          onCheckedChange={(checked) => {
                            if (!category.required) {
                              setPreferences((p) => ({ ...p, [prefKey]: checked }));
                            }
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 ml-6">{category.description}</p>

                      {isExpanded && (
                        <div className="mt-2 ml-6">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-1">Cookie</th>
                                <th className="text-left py-1">Provider</th>
                                <th className="text-left py-1">Purpose</th>
                                <th className="text-left py-1">Expiry</th>
                              </tr>
                            </thead>
                            <tbody>
                              {category.cookies.map((cookie) => (
                                <tr key={cookie.name} className="border-b last:border-0">
                                  <td className="py-1 font-mono">{cookie.name}</td>
                                  <td className="py-1">{cookie.provider}</td>
                                  <td className="py-1">{cookie.purpose}</td>
                                  <td className="py-1">{cookie.expiry}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              <Button onClick={handleAcceptAll}>Accept All</Button>
              <Button variant="outline" onClick={handleRejectAll}>
                Reject Non-Essential
              </Button>
              {showDetails ? (
                <Button variant="outline" onClick={handleSaveCustom}>
                  Save Preferences
                </Button>
              ) : (
                <Button variant="ghost" onClick={() => setShowDetails(true)}>
                  Customize
                </Button>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRejectAll} className="flex-shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function enableAnalytics() {
  // Initialize Google Analytics
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_ID) {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
    script.async = true;
    document.head.appendChild(script);
  }
}

function enableMarketing() {
  // Initialize marketing pixels
  console.log('Marketing cookies enabled');
}
```

### FILE: src/components/gdpr/PrivacyDashboard.tsx

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Shield, Download, Trash2, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { ConsentManager } from '@/lib/gdpr/consent';
import { DataExporter } from '@/lib/gdpr/data-export';
import { DataDeleter } from '@/lib/gdpr/data-deletion';
import { useAuth } from '@/hooks/useAuth';
import type { ConsentPreferences, ConsentRecord, DataExportRequest } from '@/types/gdpr';
import { toast } from 'sonner';

export default function PrivacyDashboard() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(null);
  const [consentHistory, setConsentHistory] = useState<ConsentRecord[]>([]);
  const [exportRequests, setExportRequests] = useState<DataExportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [prefs, history] = await Promise.all([
        ConsentManager.getPreferences(user.uid),
        ConsentManager.getConsentHistory(user.uid),
      ]);
      setPreferences(prefs);
      setConsentHistory(history);
    } catch (e) {
      console.error('Failed to load privacy data:', e);
    } finally {
      setLoading(false);
    }
  };

  const updateConsent = async (key: keyof ConsentPreferences, value: boolean) => {
    if (!user || key === 'essential') return;

    const consentTypeMap: Record<string, string> = {
      analytics: 'analytics',
      marketing: 'marketing',
      personalization: 'personalization',
      thirdParty: 'third_party',
      newsletter: 'newsletter',
      profiling: 'profiling',
    };

    await ConsentManager.recordConsent(
      user.uid,
      consentTypeMap[key] as any,
      value ? 'granted' : 'denied',
      { ipAddress: 'client', userAgent: navigator.userAgent, source: 'privacy_settings' }
    );

    setPreferences((p) => p ? { ...p, [key]: value } : null);
    toast.success(`${key} cookies ${value ? 'enabled' : 'disabled'}`);
  };

  const requestDataExport = async () => {
    if (!user) return;
    try {
      const request = await DataExporter.requestExport(user.uid, 'json');
      toast.success('Data export request submitted. We will email you when it\'s ready.');
      setExportRequests((prev) => [request, ...prev]);
    } catch (e: any) {
      toast.error(e.message || 'Failed to request export');
    }
  };

  const requestAccountDeletion = async () => {
    if (!user || deleteConfirmText !== 'DELETE') return;
    try {
      await DataDeleter.requestDeletion(user.uid, deleteReason);
      toast.success('Deletion request submitted. Check your email to confirm.');
      setDeleteDialogOpen(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to request deletion');
    }
  };

  if (loading || !preferences) {
    return <div className="text-center py-8 text-muted-foreground">Loading privacy settings...</div>;
  }

  const consentItems: { key: keyof ConsentPreferences; label: string; description: string }[] = [
    { key: 'essential', label: 'Essential', description: 'Required for site functionality' },
    { key: 'analytics', label: 'Analytics', description: 'Help us improve our site' },
    { key: 'marketing', label: 'Marketing', description: 'Personalized advertisements' },
    { key: 'personalization', label: 'Personalization', description: 'Remember your preferences' },
    { key: 'thirdParty', label: 'Third-Party', description: 'Share data with partners' },
    { key: 'newsletter', label: 'Newsletter', description: 'Receive email updates' },
    { key: 'profiling', label: 'Profiling', description: 'Create a profile of your interests' },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Privacy Settings</h1>
          <p className="text-muted-foreground">Manage your data and consent preferences</p>
        </div>
      </div>

      {/* Consent Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Cookie & Data Consent</CardTitle>
          <CardDescription>Control how we use your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {consentItems.map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <Switch
                checked={preferences[item.key]}
                disabled={item.key === 'essential'}
                onCheckedChange={(v) => updateConsent(item.key, v)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" /> Export Your Data
          </CardTitle>
          <CardDescription>
            Download a copy of all your personal data (GDPR Article 20 - Right to Data Portability)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={requestDataExport}>
            <Download className="h-4 w-4 mr-2" /> Request Data Export
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            You will receive an email with a download link within 24 hours. The link expires after 7 days.
          </p>
        </CardContent>
      </Card>

      {/* Consent History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" /> Consent History
          </CardTitle>
          <CardDescription>Record of all your consent changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {consentHistory.slice(0, 20).map((record) => (
              <div key={record.id} className="flex items-center justify-between py-1.5 border-b last:border-0 text-sm">
                <div>
                  <span className="font-medium">{record.consentType}</span>
                  <Badge variant={record.status === 'granted' ? 'default' : 'secondary'} className="ml-2 text-xs">
                    {record.status}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {record.grantedAt
                    ? new Date(record.grantedAt).toLocaleDateString()
                    : record.revokedAt
                      ? new Date(record.revokedAt).toLocaleDateString()
                      : '-'}
                </span>
              </div>
            ))}
            {consentHistory.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">No consent history</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Deletion */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" /> Delete Account
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data (GDPR Article 17 - Right to Erasure)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950 rounded-md mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-200">Important Notice</p>
              <p className="text-amber-700 dark:text-amber-300">
                Per Dutch tax law (ANBI), financial records of donations will be retained in anonymized
                form for 7 years. All personal identifying information will be removed.
              </p>
            </div>
          </div>

          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" /> Request Account Deletion
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Your Account</DialogTitle>
                <DialogDescription>
                  This action is <strong>permanent and irreversible</strong>. All your data will be deleted,
                  except anonymized financial records required by Dutch law.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium">Reason (optional)</label>
                  <Textarea
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    placeholder="Help us improve by sharing why you're leaving..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Type <span className="font-mono text-destructive">DELETE</span> to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="mt-1 w-full border rounded px-3 py-2 text-sm"
                    placeholder="DELETE"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={requestAccountDeletion}
                  disabled={deleteConfirmText !== 'DELETE'}
                >
                  Permanently Delete Account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
```

### FILE: src/app/(dashboard)/privacy/page.tsx

```typescript
import PrivacyDashboard from '@/components/gdpr/PrivacyDashboard';

export const metadata = {
  title: 'Privacy Settings | GRATIS.NGO',
  description: 'Manage your privacy and data consent preferences',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <PrivacyDashboard />
    </div>
  );
}
```

### FILE: src/app/api/gdpr/consent/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { ConsentManager } from '@/lib/gdpr/consent';
import { verifyAuth } from '@/lib/auth/verify';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences = await ConsentManager.getPreferences(auth.userId);
    return NextResponse.json({ preferences });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { preferences } = body;

    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const ua = request.headers.get('user-agent') || 'unknown';

    await ConsentManager.recordBulkConsent(auth.userId, preferences, {
      ipAddress: ip,
      userAgent: ua,
      source: 'privacy_settings',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
}
```

### FILE: src/app/api/gdpr/export/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { DataExporter } from '@/lib/gdpr/data-export';
import { verifyAuth } from '@/lib/auth/verify';

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const format = body.format || 'json';

    const exportRequest = await DataExporter.requestExport(auth.userId, format);
    return NextResponse.json({ request: exportRequest }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Export failed' }, { status: 500 });
  }
}
```

### FILE: src/app/api/gdpr/deletion/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { DataDeleter } from '@/lib/gdpr/data-deletion';
import { verifyAuth } from '@/lib/auth/verify';

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Confirm deletion with token
    if (body.action === 'confirm') {
      await DataDeleter.confirmDeletion(body.requestId, body.token);
      return NextResponse.json({ success: true, message: 'Account deletion confirmed and processing' });
    }

    // Request deletion
    const deletionRequest = await DataDeleter.requestDeletion(auth.userId, body.reason);
    return NextResponse.json({ request: deletionRequest }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Deletion request failed' }, { status: 500 });
  }
}
```


---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 45: RECURRING DONATIONS & SUBSCRIPTION MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════════
#
# Subscription-based recurring donation system with full Stripe integration.
# Supports multiple plans, plan changes with proration, cancellation flows,
# and webhook-driven lifecycle management.
#
# Files:
#   - src/types/subscription.ts
#   - src/lib/subscriptions/plans.ts
#   - src/lib/subscriptions/service.ts
#   - src/components/donations/SubscriptionPlans.tsx
#   - src/components/donations/ManageSubscription.tsx
#   - src/app/api/subscriptions/route.ts
#   - src/app/api/subscriptions/[id]/route.ts
#   - src/app/api/webhooks/stripe-subscription/route.ts
#   - src/app/(dashboard)/donations/subscribe/page.tsx
#   - src/app/(dashboard)/donations/manage/page.tsx
# ═══════════════════════════════════════════════════════════════════════════════


### FILE: src/types/subscription.ts

```typescript
// ============================================================================
// SUBSCRIPTION & RECURRING DONATION TYPES
// ============================================================================

export type SubscriptionStatus =
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'unpaid'
  | 'paused';

export type SubscriptionInterval = 'month' | 'quarter' | 'year';

export type PlanTier = 'supporter' | 'champion' | 'guardian' | 'patron';

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  description: string;
  features: string[];
  pricing: {
    monthly: number;      // EUR cents
    quarterly: number;
    yearly: number;
  };
  stripePriceIds: {
    monthly: string;
    quarterly: string;
    yearly: string;
  };
  bottlesPerMonth: number;
  badgeId: string;
  color: string;
  icon: string;
  maxPauseDays: number;
  popular?: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: PlanTier;
  interval: SubscriptionInterval;
  status: SubscriptionStatus;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  cancelReason?: string;
  pausedAt?: string;
  resumeAt?: string;
  trialStart?: string;
  trialEnd?: string;
  amountCents: number;
  currency: string;
  totalDonated: number;       // lifetime in cents
  totalPayments: number;
  lastPaymentAt?: string;
  lastPaymentStatus?: 'succeeded' | 'failed' | 'pending';
  failedPaymentCount: number;
  metadata: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  stripePaymentMethodId: string;
  type: 'card' | 'sepa_debit' | 'ideal' | 'bancontact';
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  sepaDebit?: {
    bankCode: string;
    last4: string;
    country: string;
  };
  isDefault: boolean;
  createdAt: string;
}

export interface SubscriptionInvoice {
  id: string;
  subscriptionId: string;
  stripeInvoiceId: string;
  amountCents: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  invoicePdfUrl?: string;
  hostedInvoiceUrl?: string;
  periodStart: string;
  periodEnd: string;
  paidAt?: string;
  attemptCount: number;
  nextPaymentAttempt?: string;
  createdAt: string;
}

export interface DonationSchedule {
  id: string;
  userId: string;
  subscriptionId: string;
  projectId?: string;
  amount: number;          // cents
  currency: string;
  interval: SubscriptionInterval;
  nextDonationDate: string;
  totalDonations: number;
  isActive: boolean;
  allocations?: DonationAllocation[];
  createdAt: string;
}

export interface DonationAllocation {
  projectId: string;
  projectName: string;
  percentage: number;      // 0-100, must sum to 100
}

export interface SubscriptionEvent {
  id: string;
  subscriptionId: string;
  type: SubscriptionEventType;
  data: Record<string, any>;
  createdAt: string;
}

export type SubscriptionEventType =
  | 'created'
  | 'activated'
  | 'payment_succeeded'
  | 'payment_failed'
  | 'plan_changed'
  | 'interval_changed'
  | 'canceled'
  | 'reactivated'
  | 'paused'
  | 'resumed'
  | 'expired'
  | 'trial_started'
  | 'trial_ended';
```


---

### FILE: src/lib/subscriptions/plans.ts

```typescript
// ============================================================================
// SUBSCRIPTION PLANS CONFIGURATION
// ============================================================================

import { SubscriptionPlan, PlanTier, SubscriptionInterval } from '@/types/subscription';

export const SUBSCRIPTION_PLANS: Record<PlanTier, SubscriptionPlan> = {
  supporter: {
    id: 'supporter',
    name: 'Supporter',
    description: 'Start making a difference with consistent monthly giving.',
    features: [
      'Monthly impact report',
      'Supporter badge on profile',
      'Access to donor community',
      '5 bonus bottles per month',
      'Tax receipt (ANBI)',
    ],
    pricing: {
      monthly: 500,        // €5.00
      quarterly: 1350,     // €13.50 (10% discount)
      yearly: 4800,        // €48.00 (20% discount)
    },
    stripePriceIds: {
      monthly: process.env.STRIPE_PRICE_SUPPORTER_MONTHLY || '',
      quarterly: process.env.STRIPE_PRICE_SUPPORTER_QUARTERLY || '',
      yearly: process.env.STRIPE_PRICE_SUPPORTER_YEARLY || '',
    },
    bottlesPerMonth: 5,
    badgeId: 'recurring_supporter',
    color: '#10B981',
    icon: '💚',
    maxPauseDays: 30,
  },
  champion: {
    id: 'champion',
    name: 'Champion',
    description: 'Amplify your impact and unlock exclusive community features.',
    features: [
      'Everything in Supporter',
      'Champion badge & flair',
      'Priority event access',
      '15 bonus bottles per month',
      'Quarterly video updates',
      'Vote on project priorities',
    ],
    pricing: {
      monthly: 1500,       // €15.00
      quarterly: 4050,     // €40.50 (10% discount)
      yearly: 14400,       // €144.00 (20% discount)
    },
    stripePriceIds: {
      monthly: process.env.STRIPE_PRICE_CHAMPION_MONTHLY || '',
      quarterly: process.env.STRIPE_PRICE_CHAMPION_QUARTERLY || '',
      yearly: process.env.STRIPE_PRICE_CHAMPION_YEARLY || '',
    },
    bottlesPerMonth: 15,
    badgeId: 'recurring_champion',
    color: '#3B82F6',
    icon: '🏆',
    maxPauseDays: 60,
    popular: true,
  },
  guardian: {
    id: 'guardian',
    name: 'Guardian',
    description: 'Become a guardian of change with significant recurring support.',
    features: [
      'Everything in Champion',
      'Guardian badge & profile highlight',
      '50 bonus bottles per month',
      'Direct project allocation control',
      'Monthly 1:1 impact briefing',
      'Name on annual impact report',
      'Early access to new features',
    ],
    pricing: {
      monthly: 5000,       // €50.00
      quarterly: 13500,    // €135.00 (10% discount)
      yearly: 48000,       // €480.00 (20% discount)
    },
    stripePriceIds: {
      monthly: process.env.STRIPE_PRICE_GUARDIAN_MONTHLY || '',
      quarterly: process.env.STRIPE_PRICE_GUARDIAN_QUARTERLY || '',
      yearly: process.env.STRIPE_PRICE_GUARDIAN_YEARLY || '',
    },
    bottlesPerMonth: 50,
    badgeId: 'recurring_guardian',
    color: '#8B5CF6',
    icon: '🛡️',
    maxPauseDays: 90,
  },
  patron: {
    id: 'patron',
    name: 'Patron',
    description: 'Join an exclusive circle of philanthropists driving systemic change.',
    features: [
      'Everything in Guardian',
      'Patron badge & premium profile',
      '150 bonus bottles per month',
      'Invite to annual gala event',
      'Advisory board participation',
      'Custom project sponsorship',
      'Dedicated impact manager',
      'Logo on partner page',
    ],
    pricing: {
      monthly: 10000,      // €100.00
      quarterly: 27000,    // €270.00 (10% discount)
      yearly: 96000,       // €960.00 (20% discount)
    },
    stripePriceIds: {
      monthly: process.env.STRIPE_PRICE_PATRON_MONTHLY || '',
      quarterly: process.env.STRIPE_PRICE_PATRON_QUARTERLY || '',
      yearly: process.env.STRIPE_PRICE_PATRON_YEARLY || '',
    },
    bottlesPerMonth: 150,
    badgeId: 'recurring_patron',
    color: '#F59E0B',
    icon: '👑',
    maxPauseDays: 180,
  },
};

export function getPlan(planId: PlanTier): SubscriptionPlan {
  const plan = SUBSCRIPTION_PLANS[planId];
  if (!plan) throw new Error(`Unknown plan: ${planId}`);
  return plan;
}

export function getPlanPrice(planId: PlanTier, interval: SubscriptionInterval): number {
  const plan = getPlan(planId);
  return plan.pricing[interval === 'quarter' ? 'quarterly' : interval === 'year' ? 'yearly' : 'monthly'];
}

export function getStripePriceId(planId: PlanTier, interval: SubscriptionInterval): string {
  const plan = getPlan(planId);
  const key = interval === 'quarter' ? 'quarterly' : interval === 'year' ? 'yearly' : 'monthly';
  return plan.stripePriceIds[key];
}

export function calculateSavings(planId: PlanTier, interval: SubscriptionInterval): number {
  if (interval === 'month') return 0;
  const plan = getPlan(planId);
  const monthlyTotal = plan.pricing.monthly * (interval === 'quarter' ? 3 : 12);
  const discountedPrice = interval === 'quarter' ? plan.pricing.quarterly : plan.pricing.yearly;
  return monthlyTotal - discountedPrice;
}

export function getAllPlans(): SubscriptionPlan[] {
  return Object.values(SUBSCRIPTION_PLANS);
}

export function getIntervalLabel(interval: SubscriptionInterval): string {
  switch (interval) {
    case 'month': return 'Monthly';
    case 'quarter': return 'Quarterly';
    case 'year': return 'Yearly';
  }
}

export function getIntervalMonths(interval: SubscriptionInterval): number {
  switch (interval) {
    case 'month': return 1;
    case 'quarter': return 3;
    case 'year': return 12;
  }
}
```


---

### FILE: src/lib/subscriptions/service.ts

```typescript
// ============================================================================
// SUBSCRIPTION SERVICE - STRIPE INTEGRATION
// ============================================================================

import Stripe from 'stripe';
import { db } from '@/lib/firebase/admin';
import {
  Subscription,
  SubscriptionStatus,
  SubscriptionInterval,
  PlanTier,
  SubscriptionEvent,
  SubscriptionEventType,
  DonationSchedule,
  SubscriptionInvoice,
} from '@/types/subscription';
import { getPlan, getStripePriceId, getPlanPrice, getIntervalMonths } from './plans';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export class SubscriptionService {
  // ──────────────────────────────────────────────────────
  // CREATE SUBSCRIPTION
  // ──────────────────────────────────────────────────────
  static async createSubscription(
    userId: string,
    planId: PlanTier,
    interval: SubscriptionInterval,
    paymentMethodId: string,
    projectAllocations?: { projectId: string; percentage: number }[]
  ): Promise<Subscription> {
    // Validate no active subscription
    const existing = await this.getActiveSubscription(userId);
    if (existing) {
      throw new Error('User already has an active subscription. Cancel or change plan instead.');
    }

    // Get user data
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) throw new Error('User not found');
    const userData = userDoc.data()!;

    // Get or create Stripe customer
    let stripeCustomerId = userData.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userData.email,
        name: userData.displayName || undefined,
        metadata: { userId, platform: 'gratis_ngo' },
      });
      stripeCustomerId = customer.id;
      await db.collection('users').doc(userId).update({ stripeCustomerId });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId,
    });
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // Create Stripe subscription
    const plan = getPlan(planId);
    const stripePriceId = getStripePriceId(planId, interval);

    const stripeSubscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: stripePriceId }],
      default_payment_method: paymentMethodId,
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId,
        planId,
        interval,
        platform: 'gratis_ngo',
      },
    });

    // Store subscription in Firestore
    const subscriptionId = stripeSubscription.id;
    const now = new Date().toISOString();

    const subscription: Subscription = {
      id: subscriptionId,
      userId,
      planId,
      interval,
      status: stripeSubscription.status as SubscriptionStatus,
      stripeSubscriptionId: stripeSubscription.id,
      stripeCustomerId,
      stripePriceId,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      amountCents: getPlanPrice(planId, interval),
      currency: 'eur',
      totalDonated: 0,
      totalPayments: 0,
      failedPaymentCount: 0,
      metadata: {},
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('subscriptions').doc(subscriptionId).set(subscription);

    // Create donation schedule
    if (projectAllocations && projectAllocations.length > 0) {
      const totalPct = projectAllocations.reduce((sum, a) => sum + a.percentage, 0);
      if (totalPct !== 100) throw new Error('Allocations must sum to 100%');
    }

    const scheduleRef = db.collection('donation_schedules').doc();
    const schedule: DonationSchedule = {
      id: scheduleRef.id,
      userId,
      subscriptionId,
      amount: getPlanPrice(planId, interval),
      currency: 'eur',
      interval,
      nextDonationDate: subscription.currentPeriodEnd,
      totalDonations: 0,
      isActive: true,
      allocations: projectAllocations?.map(a => ({
        projectId: a.projectId,
        projectName: '', // resolved at donation time
        percentage: a.percentage,
      })),
      createdAt: now,
    };
    await scheduleRef.set(schedule);

    // Log event
    await this.logEvent(subscriptionId, 'created', { planId, interval });

    // Award badge
    await db.collection('user_badges').add({
      userId,
      badgeId: plan.badgeId,
      earnedAt: now,
      source: 'subscription',
      metadata: { planId, subscriptionId },
    });

    // Update user profile
    await db.collection('users').doc(userId).update({
      'subscription.planId': planId,
      'subscription.status': 'active',
      'subscription.subscriptionId': subscriptionId,
      updatedAt: now,
    });

    return subscription;
  }

  // ──────────────────────────────────────────────────────
  // CANCEL SUBSCRIPTION
  // ──────────────────────────────────────────────────────
  static async cancelSubscription(
    userId: string,
    subscriptionId: string,
    reason?: string,
    immediate: boolean = false
  ): Promise<Subscription> {
    const subscription = await this.getSubscription(subscriptionId);
    if (!subscription) throw new Error('Subscription not found');
    if (subscription.userId !== userId) throw new Error('Unauthorized');
    if (subscription.status === 'canceled') throw new Error('Already canceled');

    if (immediate) {
      // Cancel immediately
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    } else {
      // Cancel at end of billing period
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
    }

    const now = new Date().toISOString();
    const updates: Partial<Subscription> = {
      cancelAtPeriodEnd: !immediate,
      canceledAt: now,
      cancelReason: reason,
      status: immediate ? 'canceled' : subscription.status,
      updatedAt: now,
    };

    await db.collection('subscriptions').doc(subscriptionId).update(updates);
    await this.logEvent(subscriptionId, 'canceled', { reason, immediate });

    // Update user profile
    if (immediate) {
      await db.collection('users').doc(userId).update({
        'subscription.status': 'canceled',
        updatedAt: now,
      });
      // Deactivate schedule
      const schedules = await db.collection('donation_schedules')
        .where('subscriptionId', '==', subscriptionId)
        .get();
      for (const doc of schedules.docs) {
        await doc.ref.update({ isActive: false });
      }
    }

    return { ...subscription, ...updates };
  }

  // ──────────────────────────────────────────────────────
  // REACTIVATE SUBSCRIPTION
  // ──────────────────────────────────────────────────────
  static async reactivateSubscription(
    userId: string,
    subscriptionId: string
  ): Promise<Subscription> {
    const subscription = await this.getSubscription(subscriptionId);
    if (!subscription) throw new Error('Subscription not found');
    if (subscription.userId !== userId) throw new Error('Unauthorized');

    if (!subscription.cancelAtPeriodEnd) {
      throw new Error('Subscription is not pending cancellation');
    }

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    const now = new Date().toISOString();
    const updates: Partial<Subscription> = {
      cancelAtPeriodEnd: false,
      canceledAt: undefined,
      cancelReason: undefined,
      updatedAt: now,
    };

    await db.collection('subscriptions').doc(subscriptionId).update({
      ...updates,
      canceledAt: db.FieldValue?.delete?.() ?? null,
      cancelReason: db.FieldValue?.delete?.() ?? null,
    });

    await this.logEvent(subscriptionId, 'reactivated', {});

    return { ...subscription, ...updates };
  }

  // ──────────────────────────────────────────────────────
  // CHANGE PLAN (UPGRADE / DOWNGRADE)
  // ──────────────────────────────────────────────────────
  static async changePlan(
    userId: string,
    subscriptionId: string,
    newPlanId: PlanTier,
    newInterval?: SubscriptionInterval
  ): Promise<Subscription> {
    const subscription = await this.getSubscription(subscriptionId);
    if (!subscription) throw new Error('Subscription not found');
    if (subscription.userId !== userId) throw new Error('Unauthorized');
    if (subscription.status !== 'active') throw new Error('Can only change active subscriptions');

    const interval = newInterval || subscription.interval;
    const newPriceId = getStripePriceId(newPlanId, interval);

    // Get current Stripe subscription to find the item ID
    const stripeSub = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
    const itemId = stripeSub.items.data[0]?.id;
    if (!itemId) throw new Error('No subscription item found');

    // Update with proration
    const oldPlanId = subscription.planId;
    const isUpgrade = getPlanPrice(newPlanId, 'month') > getPlanPrice(oldPlanId, 'month');

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      items: [{
        id: itemId,
        price: newPriceId,
      }],
      proration_behavior: isUpgrade ? 'create_prorations' : 'none',
      metadata: { planId: newPlanId, interval },
    });

    const now = new Date().toISOString();
    const updates: Partial<Subscription> = {
      planId: newPlanId,
      interval,
      stripePriceId: newPriceId,
      amountCents: getPlanPrice(newPlanId, interval),
      updatedAt: now,
    };

    await db.collection('subscriptions').doc(subscriptionId).update(updates);

    // Update donation schedule
    const schedules = await db.collection('donation_schedules')
      .where('subscriptionId', '==', subscriptionId)
      .get();
    for (const doc of schedules.docs) {
      await doc.ref.update({
        amount: getPlanPrice(newPlanId, interval),
        interval,
      });
    }

    await this.logEvent(subscriptionId, 'plan_changed', {
      oldPlanId,
      newPlanId,
      oldInterval: subscription.interval,
      newInterval: interval,
      isUpgrade,
    });

    // Update badge
    const oldPlan = getPlan(oldPlanId);
    const newPlan = getPlan(newPlanId);
    if (oldPlan.badgeId !== newPlan.badgeId) {
      // Remove old badge
      const oldBadges = await db.collection('user_badges')
        .where('userId', '==', userId)
        .where('badgeId', '==', oldPlan.badgeId)
        .get();
      for (const doc of oldBadges.docs) {
        await doc.ref.delete();
      }
      // Award new badge
      await db.collection('user_badges').add({
        userId,
        badgeId: newPlan.badgeId,
        earnedAt: now,
        source: 'subscription_upgrade',
        metadata: { planId: newPlanId },
      });
    }

    // Update user profile
    await db.collection('users').doc(userId).update({
      'subscription.planId': newPlanId,
      updatedAt: now,
    });

    return { ...subscription, ...updates };
  }

  // ──────────────────────────────────────────────────────
  // PAUSE SUBSCRIPTION
  // ──────────────────────────────────────────────────────
  static async pauseSubscription(
    userId: string,
    subscriptionId: string,
    resumeDate: string
  ): Promise<Subscription> {
    const subscription = await this.getSubscription(subscriptionId);
    if (!subscription) throw new Error('Subscription not found');
    if (subscription.userId !== userId) throw new Error('Unauthorized');
    if (subscription.status !== 'active') throw new Error('Can only pause active subscriptions');

    const plan = getPlan(subscription.planId);
    const resumeDateObj = new Date(resumeDate);
    const now = new Date();
    const diffDays = Math.ceil((resumeDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays > plan.maxPauseDays) {
      throw new Error(`Maximum pause duration for ${plan.name} is ${plan.maxPauseDays} days`);
    }
    if (diffDays < 7) {
      throw new Error('Minimum pause duration is 7 days');
    }

    // Pause collection in Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      pause_collection: {
        behavior: 'void',
        resumes_at: Math.floor(resumeDateObj.getTime() / 1000),
      },
    });

    const nowISO = now.toISOString();
    const updates: Partial<Subscription> = {
      status: 'paused',
      pausedAt: nowISO,
      resumeAt: resumeDate,
      updatedAt: nowISO,
    };

    await db.collection('subscriptions').doc(subscriptionId).update(updates);
    await this.logEvent(subscriptionId, 'paused', { resumeDate, pauseDays: diffDays });

    // Deactivate schedule temporarily
    const schedules = await db.collection('donation_schedules')
      .where('subscriptionId', '==', subscriptionId)
      .get();
    for (const doc of schedules.docs) {
      await doc.ref.update({ isActive: false });
    }

    return { ...subscription, ...updates };
  }

  // ──────────────────────────────────────────────────────
  // RESUME SUBSCRIPTION (from pause)
  // ──────────────────────────────────────────────────────
  static async resumeSubscription(
    userId: string,
    subscriptionId: string
  ): Promise<Subscription> {
    const subscription = await this.getSubscription(subscriptionId);
    if (!subscription) throw new Error('Subscription not found');
    if (subscription.userId !== userId) throw new Error('Unauthorized');
    if (subscription.status !== 'paused') throw new Error('Subscription is not paused');

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      pause_collection: '',  // Remove pause
    });

    const now = new Date().toISOString();
    const updates: Partial<Subscription> = {
      status: 'active',
      pausedAt: undefined,
      resumeAt: undefined,
      updatedAt: now,
    };

    await db.collection('subscriptions').doc(subscriptionId).update({
      ...updates,
      pausedAt: null,
      resumeAt: null,
    });

    await this.logEvent(subscriptionId, 'resumed', {});

    // Reactivate schedule
    const schedules = await db.collection('donation_schedules')
      .where('subscriptionId', '==', subscriptionId)
      .get();
    for (const doc of schedules.docs) {
      await doc.ref.update({ isActive: true });
    }

    return { ...subscription, ...updates };
  }

  // ──────────────────────────────────────────────────────
  // WEBHOOK HANDLER
  // ──────────────────────────────────────────────────────
  static async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        await this.syncSubscriptionFromStripe(sub);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const subscriptionId = sub.id;
        const now = new Date().toISOString();

        await db.collection('subscriptions').doc(subscriptionId).update({
          status: 'canceled',
          canceledAt: now,
          updatedAt: now,
        });

        // Get userId from metadata or subscription doc
        const subDoc = await db.collection('subscriptions').doc(subscriptionId).get();
        if (subDoc.exists) {
          const data = subDoc.data()!;
          await db.collection('users').doc(data.userId).update({
            'subscription.status': 'canceled',
            updatedAt: now,
          });
          // Deactivate schedules
          const schedules = await db.collection('donation_schedules')
            .where('subscriptionId', '==', subscriptionId)
            .get();
          for (const doc of schedules.docs) {
            await doc.ref.update({ isActive: false });
          }
        }

        await this.logEvent(subscriptionId, 'expired', {});
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        if (!invoice.subscription) return;

        const subscriptionId = invoice.subscription as string;
        const subDoc = await db.collection('subscriptions').doc(subscriptionId).get();
        if (!subDoc.exists) return;

        const subscription = subDoc.data() as Subscription;
        const amountPaid = invoice.amount_paid;

        // Record payment
        const now = new Date().toISOString();
        await db.collection('subscriptions').doc(subscriptionId).update({
          lastPaymentAt: now,
          lastPaymentStatus: 'succeeded',
          totalDonated: (subscription.totalDonated || 0) + amountPaid,
          totalPayments: (subscription.totalPayments || 0) + 1,
          failedPaymentCount: 0,
          updatedAt: now,
        });

        // Record as donation
        const donationRef = db.collection('donations').doc();
        await donationRef.set({
          id: donationRef.id,
          userId: subscription.userId,
          type: 'recurring',
          amount: amountPaid,
          currency: subscription.currency,
          status: 'completed',
          source: 'subscription',
          subscriptionId,
          stripePaymentIntentId: invoice.payment_intent,
          stripeInvoiceId: invoice.id,
          metadata: {
            planId: subscription.planId,
            interval: subscription.interval,
          },
          createdAt: now,
        });

        // Store invoice record
        const invoiceRef = db.collection('subscription_invoices').doc(invoice.id);
        const invoiceRecord: SubscriptionInvoice = {
          id: invoice.id,
          subscriptionId,
          stripeInvoiceId: invoice.id,
          amountCents: amountPaid,
          currency: subscription.currency,
          status: 'paid',
          invoicePdfUrl: invoice.invoice_pdf || undefined,
          hostedInvoiceUrl: invoice.hosted_invoice_url || undefined,
          periodStart: new Date((invoice.period_start || 0) * 1000).toISOString(),
          periodEnd: new Date((invoice.period_end || 0) * 1000).toISOString(),
          paidAt: now,
          attemptCount: invoice.attempt_count || 1,
          createdAt: now,
        };
        await invoiceRef.set(invoiceRecord);

        // Award bottles
        const plan = getPlan(subscription.planId);
        await db.collection('users').doc(subscription.userId).update({
          bottleBalance: (subscription as any).bottleBalance || 0 + plan.bottlesPerMonth,
        });

        // Update donation schedule
        const schedules = await db.collection('donation_schedules')
          .where('subscriptionId', '==', subscriptionId)
          .get();
        for (const doc of schedules.docs) {
          await doc.ref.update({
            totalDonations: (doc.data().totalDonations || 0) + 1,
            nextDonationDate: subscription.currentPeriodEnd,
          });
        }

        await this.logEvent(subscriptionId, 'payment_succeeded', {
          amount: amountPaid,
          invoiceId: invoice.id,
        });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (!invoice.subscription) return;

        const subscriptionId = invoice.subscription as string;
        const subDoc = await db.collection('subscriptions').doc(subscriptionId).get();
        if (!subDoc.exists) return;

        const subscription = subDoc.data() as Subscription;
        const failedCount = (subscription.failedPaymentCount || 0) + 1;
        const now = new Date().toISOString();

        await db.collection('subscriptions').doc(subscriptionId).update({
          lastPaymentStatus: 'failed',
          failedPaymentCount: failedCount,
          status: failedCount >= 3 ? 'past_due' : subscription.status,
          updatedAt: now,
        });

        // Send notification
        await db.collection('notifications').add({
          userId: subscription.userId,
          type: 'payment_failed',
          title: 'Payment Failed',
          message: failedCount >= 3
            ? 'Your subscription payment has failed 3 times. Your subscription may be cancelled soon. Please update your payment method.'
            : `Your recurring donation payment failed. We'll retry automatically. (Attempt ${failedCount}/3)`,
          data: { subscriptionId, attemptCount: failedCount },
          read: false,
          createdAt: now,
        });

        await this.logEvent(subscriptionId, 'payment_failed', {
          attemptCount: failedCount,
          invoiceId: invoice.id,
          nextAttempt: invoice.next_payment_attempt
            ? new Date(invoice.next_payment_attempt * 1000).toISOString()
            : null,
        });
        break;
      }
    }
  }

  // ──────────────────────────────────────────────────────
  // HELPER: Sync subscription state from Stripe
  // ──────────────────────────────────────────────────────
  private static async syncSubscriptionFromStripe(stripeSub: Stripe.Subscription): Promise<void> {
    const subscriptionId = stripeSub.id;
    const now = new Date().toISOString();

    await db.collection('subscriptions').doc(subscriptionId).update({
      status: stripeSub.status as SubscriptionStatus,
      currentPeriodStart: new Date(stripeSub.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(stripeSub.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
      updatedAt: now,
    });
  }

  // ──────────────────────────────────────────────────────
  // QUERY HELPERS
  // ──────────────────────────────────────────────────────
  static async getSubscription(subscriptionId: string): Promise<Subscription | null> {
    const doc = await db.collection('subscriptions').doc(subscriptionId).get();
    return doc.exists ? (doc.data() as Subscription) : null;
  }

  static async getActiveSubscription(userId: string): Promise<Subscription | null> {
    const snapshot = await db.collection('subscriptions')
      .where('userId', '==', userId)
      .where('status', 'in', ['active', 'trialing', 'past_due', 'paused'])
      .limit(1)
      .get();
    return snapshot.empty ? null : (snapshot.docs[0].data() as Subscription);
  }

  static async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    const snapshot = await db.collection('subscriptions')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => doc.data() as Subscription);
  }

  static async getInvoices(subscriptionId: string): Promise<SubscriptionInvoice[]> {
    const snapshot = await db.collection('subscription_invoices')
      .where('subscriptionId', '==', subscriptionId)
      .orderBy('createdAt', 'desc')
      .limit(24)
      .get();
    return snapshot.docs.map(doc => doc.data() as SubscriptionInvoice);
  }

  static async getSchedule(subscriptionId: string): Promise<DonationSchedule | null> {
    const snapshot = await db.collection('donation_schedules')
      .where('subscriptionId', '==', subscriptionId)
      .limit(1)
      .get();
    return snapshot.empty ? null : (snapshot.docs[0].data() as DonationSchedule);
  }

  // ──────────────────────────────────────────────────────
  // EVENT LOGGING
  // ──────────────────────────────────────────────────────
  private static async logEvent(
    subscriptionId: string,
    type: SubscriptionEventType,
    data: Record<string, any>
  ): Promise<void> {
    const ref = db.collection('subscription_events').doc();
    const event: SubscriptionEvent = {
      id: ref.id,
      subscriptionId,
      type,
      data,
      createdAt: new Date().toISOString(),
    };
    await ref.set(event);
  }
}
```


---

### FILE: src/components/donations/SubscriptionPlans.tsx

```tsx
'use client';

// ============================================================================
// SUBSCRIPTION PLANS SELECTION UI
// ============================================================================

import React, { useState } from 'react';
import {
  PlanTier,
  SubscriptionInterval,
} from '@/types/subscription';
import {
  SUBSCRIPTION_PLANS,
  calculateSavings,
  getIntervalLabel,
} from '@/lib/subscriptions/plans';

interface SubscriptionPlansProps {
  onSelectPlan: (planId: PlanTier, interval: SubscriptionInterval) => void;
  currentPlan?: PlanTier;
  loading?: boolean;
}

export default function SubscriptionPlans({
  onSelectPlan,
  currentPlan,
  loading = false,
}: SubscriptionPlansProps) {
  const [interval, setInterval] = useState<SubscriptionInterval>('month');
  const plans = Object.values(SUBSCRIPTION_PLANS);

  const formatPrice = (cents: number): string => {
    return `€${(cents / 100).toFixed(2)}`;
  };

  const getPriceForInterval = (plan: typeof plans[0]): number => {
    switch (interval) {
      case 'month': return plan.pricing.monthly;
      case 'quarter': return plan.pricing.quarterly;
      case 'year': return plan.pricing.yearly;
    }
  };

  const getPerMonthPrice = (plan: typeof plans[0]): number => {
    switch (interval) {
      case 'month': return plan.pricing.monthly;
      case 'quarter': return Math.round(plan.pricing.quarterly / 3);
      case 'year': return Math.round(plan.pricing.yearly / 12);
    }
  };

  return (
    <div>
      {/* Interval Selector */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '4px',
        marginBottom: '32px',
        background: '#F3F4F6',
        borderRadius: '12px',
        padding: '4px',
        maxWidth: '400px',
        margin: '0 auto 32px',
      }}>
        {(['month', 'quarter', 'year'] as SubscriptionInterval[]).map((int) => (
          <button
            key={int}
            onClick={() => setInterval(int)}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: interval === int ? 600 : 400,
              background: interval === int ? '#FFFFFF' : 'transparent',
              color: interval === int ? '#111827' : '#6B7280',
              boxShadow: interval === int ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              fontSize: '14px',
              transition: 'all 0.2s',
              position: 'relative' as const,
            }}
          >
            {getIntervalLabel(int)}
            {int === 'year' && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-4px',
                background: '#10B981',
                color: 'white',
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '10px',
                fontWeight: 700,
              }}>
                -20%
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Plans Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const savings = calculateSavings(plan.id, interval);
          const isPopular = plan.popular;

          return (
            <div
              key={plan.id}
              style={{
                background: '#FFFFFF',
                border: isPopular ? `2px solid ${plan.color}` : '1px solid #E5E7EB',
                borderRadius: '16px',
                padding: '28px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              {isPopular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: plan.color,
                  color: 'white',
                  padding: '4px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '32px' }}>{plan.icon}</span>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#111827',
                  margin: '8px 0 4px',
                }}>
                  {plan.name}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  margin: 0,
                  lineHeight: '1.4',
                }}>
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{
                  fontSize: '36px',
                  fontWeight: 800,
                  color: plan.color,
                }}>
                  {formatPrice(getPriceForInterval(plan))}
                </div>
                <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
                  per {interval === 'quarter' ? 'quarter' : interval}
                </div>
                {interval !== 'month' && (
                  <div style={{
                    fontSize: '12px',
                    color: '#6B7280',
                    marginTop: '4px',
                  }}>
                    {formatPrice(getPerMonthPrice(plan))}/mo
                    {savings > 0 && (
                      <span style={{ color: '#10B981', fontWeight: 600 }}>
                        {' '}(save {formatPrice(savings)})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Features */}
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 24px',
                flex: 1,
              }}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    padding: '6px 0',
                    fontSize: '13px',
                    color: '#374151',
                  }}>
                    <span style={{ color: plan.color, flexShrink: 0, marginTop: '2px' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Bottles Bonus */}
              <div style={{
                background: `${plan.color}10`,
                borderRadius: '10px',
                padding: '10px',
                textAlign: 'center',
                marginBottom: '16px',
                fontSize: '13px',
              }}>
                🍾 <strong>{plan.bottlesPerMonth}</strong> bonus bottles/month
              </div>

              {/* CTA */}
              <button
                onClick={() => onSelectPlan(plan.id, interval)}
                disabled={loading || isCurrent}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isCurrent ? '#E5E7EB' : plan.color,
                  color: isCurrent ? '#6B7280' : '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: isCurrent ? 'default' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {isCurrent ? 'Current Plan' : loading ? 'Processing...' : 'Subscribe'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```


---

### FILE: src/components/donations/ManageSubscription.tsx

```tsx
'use client';

// ============================================================================
// MANAGE EXISTING SUBSCRIPTION
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Subscription,
  SubscriptionInvoice,
  PlanTier,
  SubscriptionInterval,
} from '@/types/subscription';
import { getPlan, getIntervalLabel, SUBSCRIPTION_PLANS } from '@/lib/subscriptions/plans';

export default function ManageSubscription() {
  const [subscription, setSub] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<SubscriptionInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [showChangePlan, setShowChangePlan] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [pauseDate, setPauseDate] = useState('');

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/subscriptions/me');
      if (res.ok) {
        const data = await res.json();
        setSub(data.subscription);
        setInvoices(data.invoices || []);
      }
    } catch (err) {
      setError('Failed to load subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string, body: Record<string, any> = {}) => {
    if (!subscription) return;
    try {
      setActionLoading(true);
      setError('');
      const res = await fetch(`/api/subscriptions/${subscription.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...body }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Action failed');
      }
      const data = await res.json();
      setSub(data.subscription);
      setShowCancel(false);
      setShowChangePlan(false);
      setShowPause(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>
        Loading subscription...
      </div>
    );
  }

  if (!subscription) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
      }}>
        <span style={{ fontSize: '48px' }}>💝</span>
        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '16px 0 8px', color: '#111827' }}>
          No Active Subscription
        </h2>
        <p style={{ color: '#6B7280', marginBottom: '24px' }}>
          Start a recurring donation to make a lasting impact.
        </p>
        <a
          href="/donations/subscribe"
          style={{
            display: 'inline-block',
            padding: '12px 32px',
            background: '#2563EB',
            color: '#FFFFFF',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          View Plans
        </a>
      </div>
    );
  }

  const plan = getPlan(subscription.planId);
  const isActive = ['active', 'trialing'].includes(subscription.status);
  const isPaused = subscription.status === 'paused';
  const isCanceling = subscription.cancelAtPeriodEnd;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {error && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          color: '#DC2626',
          padding: '12px 16px',
          borderRadius: '10px',
          marginBottom: '20px',
          fontSize: '14px',
        }}>
          {error}
        </div>
      )}

      {/* Subscription Overview Card */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <span style={{ fontSize: '28px' }}>{plan.icon}</span>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>
                {plan.name} Plan
              </h2>
            </div>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: '4px 0 0' }}>
              {getIntervalLabel(subscription.interval)} · €{(subscription.amountCents / 100).toFixed(2)} per {subscription.interval}
            </p>
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 600,
            background: isActive ? '#D1FAE5' : isPaused ? '#FEF3C7' : isCanceling ? '#FFE4E6' : '#F3F4F6',
            color: isActive ? '#065F46' : isPaused ? '#92400E' : isCanceling ? '#BE123C' : '#374151',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isActive ? '#10B981' : isPaused ? '#F59E0B' : isCanceling ? '#EF4444' : '#6B7280',
            }} />
            {isActive ? 'Active' : isPaused ? 'Paused' : isCanceling ? 'Canceling' : subscription.status}
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '16px',
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid #F3F4F6',
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Donated
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#111827' }}>
              €{((subscription.totalDonated || 0) / 100).toFixed(2)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Payments
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#111827' }}>
              {subscription.totalPayments || 0}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Next Payment
            </div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
              {isCanceling
                ? 'Ends ' + new Date(subscription.currentPeriodEnd).toLocaleDateString()
                : isPaused && subscription.resumeAt
                  ? 'Resumes ' + new Date(subscription.resumeAt).toLocaleDateString()
                  : new Date(subscription.currentPeriodEnd).toLocaleDateString()
              }
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Member Since
            </div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
              {new Date(subscription.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Warning Banners */}
        {isCanceling && (
          <div style={{
            background: '#FFF7ED',
            border: '1px solid #FDBA74',
            borderRadius: '10px',
            padding: '14px 16px',
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div>
              <div style={{ fontWeight: 600, color: '#9A3412', fontSize: '14px' }}>
                Subscription ending
              </div>
              <div style={{ fontSize: '13px', color: '#C2410C' }}>
                Your subscription will end on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
                You'll continue to have access until then.
              </div>
            </div>
            <button
              onClick={() => handleAction('reactivate')}
              disabled={actionLoading}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: '#EA580C',
                color: 'white',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                opacity: actionLoading ? 0.6 : 1,
              }}
            >
              Keep Subscription
            </button>
          </div>
        )}

        {/* Action Buttons */}
        {isActive && !isCanceling && (
          <div style={{
            display: 'flex',
            gap: '10px',
            marginTop: '20px',
            flexWrap: 'wrap',
          }}>
            <button
              onClick={() => setShowChangePlan(true)}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                color: '#374151',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Change Plan
            </button>
            <button
              onClick={() => setShowPause(true)}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                color: '#374151',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Pause
            </button>
            <button
              onClick={() => setShowCancel(true)}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: '1px solid #FCA5A5',
                background: '#FFF5F5',
                color: '#DC2626',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {isPaused && (
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => handleAction('resume')}
              disabled={actionLoading}
              style={{
                padding: '10px 24px',
                borderRadius: '10px',
                border: 'none',
                background: '#10B981',
                color: 'white',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                opacity: actionLoading ? 0.6 : 1,
              }}
            >
              Resume Now
            </button>
          </div>
        )}
      </div>

      {/* Cancel Dialog */}
      {showCancel && (
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #FCA5A5',
          borderRadius: '16px',
          padding: '28px',
          marginBottom: '20px',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#DC2626', margin: '0 0 12px' }}>
            Cancel Subscription
          </h3>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 16px' }}>
            Your access will continue until the end of the current billing period
            ({new Date(subscription.currentPeriodEnd).toLocaleDateString()}).
            You can reactivate anytime before then.
          </p>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Help us improve — why are you canceling? (optional)
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Your feedback helps us serve our community better..."
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '14px',
                minHeight: '80px',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => handleAction('cancel', { reason: cancelReason })}
              disabled={actionLoading}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                background: '#DC2626',
                color: 'white',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                opacity: actionLoading ? 0.6 : 1,
              }}
            >
              {actionLoading ? 'Canceling...' : 'Confirm Cancellation'}
            </button>
            <button
              onClick={() => setShowCancel(false)}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                background: 'transparent',
                color: '#374151',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Keep Subscription
            </button>
          </div>
        </div>
      )}

      {/* Pause Dialog */}
      {showPause && (
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #FDE68A',
          borderRadius: '16px',
          padding: '28px',
          marginBottom: '20px',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#92400E', margin: '0 0 12px' }}>
            Pause Subscription
          </h3>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 16px' }}>
            Payments will be paused until the resume date. Max pause: {plan.maxPauseDays} days.
          </p>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Resume Date
            </label>
            <input
              type="date"
              value={pauseDate}
              onChange={(e) => setPauseDate(e.target.value)}
              min={new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]}
              max={new Date(Date.now() + plan.maxPauseDays * 86400000).toISOString().split('T')[0]}
              style={{
                padding: '10px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => handleAction('pause', { resumeDate: pauseDate })}
              disabled={actionLoading || !pauseDate}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                background: '#F59E0B',
                color: 'white',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                opacity: actionLoading || !pauseDate ? 0.6 : 1,
              }}
            >
              {actionLoading ? 'Pausing...' : 'Pause Subscription'}
            </button>
            <button
              onClick={() => setShowPause(false)}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                background: 'transparent',
                color: '#374151',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Change Plan Dialog */}
      {showChangePlan && (
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '16px',
          padding: '28px',
          marginBottom: '20px',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>
            Change Plan
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
          }}>
            {Object.values(SUBSCRIPTION_PLANS).map((p) => {
              const isCurrent = p.id === subscription.planId;
              return (
                <button
                  key={p.id}
                  onClick={() => !isCurrent && handleAction('change_plan', { newPlanId: p.id })}
                  disabled={isCurrent || actionLoading}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: isCurrent ? `2px solid ${p.color}` : '1px solid #E5E7EB',
                    background: isCurrent ? `${p.color}08` : '#FFFFFF',
                    cursor: isCurrent ? 'default' : 'pointer',
                    textAlign: 'left',
                    opacity: actionLoading && !isCurrent ? 0.6 : 1,
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{p.icon}</div>
                  <div style={{ fontWeight: 700, color: '#111827', fontSize: '15px' }}>{p.name}</div>
                  <div style={{ color: p.color, fontWeight: 600, fontSize: '14px' }}>
                    €{(p.pricing.monthly / 100).toFixed(2)}/mo
                  </div>
                  {isCurrent && (
                    <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
                      Current plan
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setShowChangePlan(false)}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              background: 'transparent',
              color: '#6B7280',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Payment History */}
      {invoices.length > 0 && (
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '16px',
          padding: '28px',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>
            Payment History
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6B7280', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6B7280', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase' }}>Period</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', color: '#6B7280', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase' }}>Amount</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px', color: '#6B7280', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', color: '#6B7280', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase' }}>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '10px 12px' }}>
                      {inv.paidAt ? new Date(inv.paidAt).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#6B7280' }}>
                      {new Date(inv.periodStart).toLocaleDateString()} – {new Date(inv.periodEnd).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>
                      €{(inv.amountCents / 100).toFixed(2)}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: inv.status === 'paid' ? '#D1FAE5' : '#FEF3C7',
                        color: inv.status === 'paid' ? '#065F46' : '#92400E',
                      }}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      {inv.invoicePdfUrl && (
                        <a
                          href={inv.invoicePdfUrl}
                          target="_blank"
                          rel="noopener"
                          style={{ color: '#2563EB', fontSize: '13px', textDecoration: 'none' }}
                        >
                          PDF ↓
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
```


---

### FILE: src/app/api/subscriptions/route.ts

```typescript
// ============================================================================
// SUBSCRIPTIONS API - CREATE & LIST
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/lib/subscriptions/service';
import { verifyAuth } from '@/lib/auth/verify';
import { PlanTier, SubscriptionInterval } from '@/types/subscription';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscriptions = await SubscriptionService.getUserSubscriptions(auth.userId);
    return NextResponse.json({ subscriptions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { planId, interval, paymentMethodId, allocations } = body;

    if (!planId || !interval || !paymentMethodId) {
      return NextResponse.json(
        { error: 'planId, interval, and paymentMethodId are required' },
        { status: 400 }
      );
    }

    const validPlans: PlanTier[] = ['supporter', 'champion', 'guardian', 'patron'];
    const validIntervals: SubscriptionInterval[] = ['month', 'quarter', 'year'];

    if (!validPlans.includes(planId)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }
    if (!validIntervals.includes(interval)) {
      return NextResponse.json({ error: 'Invalid interval' }, { status: 400 });
    }

    const subscription = await SubscriptionService.createSubscription(
      auth.userId,
      planId,
      interval,
      paymentMethodId,
      allocations
    );

    return NextResponse.json({ subscription }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

### FILE: src/app/api/subscriptions/me/route.ts

```typescript
// ============================================================================
// CURRENT USER SUBSCRIPTION
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/lib/subscriptions/service';
import { verifyAuth } from '@/lib/auth/verify';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await SubscriptionService.getActiveSubscription(auth.userId);
    let invoices: any[] = [];

    if (subscription) {
      invoices = await SubscriptionService.getInvoices(subscription.id);
    }

    return NextResponse.json({ subscription, invoices });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

### FILE: src/app/api/subscriptions/[id]/route.ts

```typescript
// ============================================================================
// SUBSCRIPTION MANAGEMENT (CANCEL, CHANGE, PAUSE, RESUME, REACTIVATE)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/lib/subscriptions/service';
import { verifyAuth } from '@/lib/auth/verify';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;
    let result;

    switch (action) {
      case 'cancel':
        result = await SubscriptionService.cancelSubscription(
          auth.userId,
          params.id,
          body.reason,
          body.immediate
        );
        break;

      case 'reactivate':
        result = await SubscriptionService.reactivateSubscription(auth.userId, params.id);
        break;

      case 'change_plan':
        if (!body.newPlanId) {
          return NextResponse.json({ error: 'newPlanId required' }, { status: 400 });
        }
        result = await SubscriptionService.changePlan(
          auth.userId,
          params.id,
          body.newPlanId,
          body.newInterval
        );
        break;

      case 'pause':
        if (!body.resumeDate) {
          return NextResponse.json({ error: 'resumeDate required' }, { status: 400 });
        }
        result = await SubscriptionService.pauseSubscription(
          auth.userId,
          params.id,
          body.resumeDate
        );
        break;

      case 'resume':
        result = await SubscriptionService.resumeSubscription(auth.userId, params.id);
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ subscription: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

### FILE: src/app/api/webhooks/stripe-subscription/route.ts

```typescript
// ============================================================================
// STRIPE SUBSCRIPTION WEBHOOKS
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { SubscriptionService } from '@/lib/subscriptions/service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Process subscription-related events
    const subscriptionEvents = [
      'customer.subscription.created',
      'customer.subscription.updated',
      'customer.subscription.deleted',
      'invoice.payment_succeeded',
      'invoice.payment_failed',
    ];

    if (subscriptionEvents.includes(event.type)) {
      await SubscriptionService.handleWebhookEvent(event);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
```

---

### FILE: src/app/(dashboard)/donations/subscribe/page.tsx

```tsx
import SubscriptionPlans from '@/components/donations/SubscriptionPlans';

export const metadata = { title: 'Subscribe – GRATIS.NGO' };

export default function SubscribePage() {
  return (
    <div style={{ padding: '32px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
          Recurring Giving Plans
        </h1>
        <p style={{ fontSize: '16px', color: '#6B7280', maxWidth: '500px', margin: '0 auto' }}>
          Make a lasting impact with consistent monthly, quarterly, or yearly donations.
          Choose the plan that fits your generosity.
        </p>
      </div>
      <SubscriptionPlans onSelectPlan={(planId, interval) => {
        // In production, this would open Stripe Elements for payment method collection
        window.location.href = `/donations/checkout?plan=${planId}&interval=${interval}`;
      }} />
    </div>
  );
}
```

---

### FILE: src/app/(dashboard)/donations/manage/page.tsx

```tsx
import ManageSubscription from '@/components/donations/ManageSubscription';

export const metadata = { title: 'Manage Subscription – GRATIS.NGO' };

export default function ManageSubscriptionPage() {
  return (
    <div style={{ padding: '32px 20px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: '0 0 24px' }}>
        Manage Subscription
      </h1>
      <ManageSubscription />
    </div>
  );
}
```



---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 46: ADVANCED PAYMENT PROCESSING (REFUNDS, TAX RECEIPTS)
# ═══════════════════════════════════════════════════════════════════════════════
#
# Payment lifecycle management including refund processing, dispute handling,
# and ANBI-compliant tax receipt generation for Dutch charity requirements.
#
# Files:
#   - src/types/payment.ts
#   - src/lib/payments/refunds.ts
#   - src/lib/payments/tax-receipts.ts
#   - src/lib/payments/disputes.ts
#   - src/components/admin/RefundManager.tsx
#   - src/components/donations/TaxReceipts.tsx
#   - src/app/api/admin/refunds/route.ts
#   - src/app/api/donations/tax-receipts/route.ts
#   - src/app/api/webhooks/stripe-disputes/route.ts
# ═══════════════════════════════════════════════════════════════════════════════


### FILE: src/types/payment.ts

```typescript
// ============================================================================
// PAYMENT, REFUND, DISPUTE & TAX RECEIPT TYPES
// ============================================================================

export type PaymentStatus = 'succeeded' | 'pending' | 'failed' | 'refunded' | 'partially_refunded' | 'disputed';

export interface PaymentRecord {
  id: string;
  userId: string;
  donationId: string;
  stripePaymentIntentId: string;
  stripeChargeId?: string;
  amount: number;           // cents
  currency: string;
  status: PaymentStatus;
  paymentMethod: {
    type: 'card' | 'ideal' | 'sepa_debit' | 'bancontact';
    last4?: string;
    brand?: string;
  };
  refundedAmount: number;   // cents
  disputedAmount: number;   // cents
  metadata: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export type RefundStatus = 'pending' | 'succeeded' | 'failed' | 'canceled';
export type RefundReason = 'donor_request' | 'duplicate' | 'fraudulent' | 'project_canceled' | 'other';

export interface RefundRecord {
  id: string;
  paymentId: string;
  donationId: string;
  userId: string;
  stripeRefundId: string;
  amount: number;           // cents
  currency: string;
  status: RefundStatus;
  reason: RefundReason;
  notes?: string;
  processedBy: string;      // admin user ID
  createdAt: string;
  completedAt?: string;
}

export type DisputeStatus = 'warning_needs_response' | 'warning_under_review' | 'warning_closed'
  | 'needs_response' | 'under_review' | 'charge_refunded' | 'won' | 'lost';

export interface DisputeRecord {
  id: string;
  paymentId: string;
  donationId: string;
  userId: string;
  stripeDisputeId: string;
  amount: number;
  currency: string;
  status: DisputeStatus;
  reason: string;
  evidenceSubmitted: boolean;
  evidenceDueBy?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaxReceipt {
  id: string;
  userId: string;
  year: number;
  receiptNumber: string;    // e.g., "GRATIS-2025-00001"
  donorInfo: {
    name: string;
    email: string;
    address?: string;
    bsn?: string;           // Burgerservicenummer (encrypted, optional)
  };
  organizationInfo: {
    name: string;
    kvkNumber: string;
    rsinNumber: string;     // ANBI RSIN
    address: string;
    iban: string;
  };
  donations: TaxReceiptDonation[];
  totalAmount: number;      // cents
  currency: string;
  status: 'draft' | 'generated' | 'sent' | 'downloaded';
  pdfUrl?: string;
  pdfStoragePath?: string;
  generatedAt?: string;
  sentAt?: string;
  downloadedAt?: string;
  createdAt: string;
}

export interface TaxReceiptDonation {
  donationId: string;
  date: string;
  amount: number;
  type: 'one_time' | 'recurring';
  projectName?: string;
  paymentMethod: string;
}

export interface TaxReceiptGenerationRequest {
  userId: string;
  year: number;
  format: 'pdf' | 'html';
  includeAddress: boolean;
}
```


---

### FILE: src/lib/payments/refunds.ts

```typescript
// ============================================================================
// REFUND PROCESSING SERVICE
// ============================================================================

import Stripe from 'stripe';
import { db } from '@/lib/firebase/admin';
import { RefundRecord, RefundReason, RefundStatus, PaymentRecord } from '@/types/payment';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export class RefundService {
  /**
   * Process a refund for a donation payment.
   * Supports full and partial refunds with over-refund prevention.
   */
  static async processRefund(
    donationId: string,
    amount: number,            // cents to refund
    reason: RefundReason,
    processedBy: string,       // admin userId
    notes?: string
  ): Promise<RefundRecord> {
    // Get the donation
    const donationDoc = await db.collection('donations').doc(donationId).get();
    if (!donationDoc.exists) throw new Error('Donation not found');
    const donation = donationDoc.data()!;

    // Validate donation is refundable
    if (!['completed', 'partially_refunded'].includes(donation.status)) {
      throw new Error(`Cannot refund donation with status: ${donation.status}`);
    }

    // Get payment record
    const paymentSnap = await db.collection('payment_records')
      .where('donationId', '==', donationId)
      .limit(1)
      .get();

    let payment: PaymentRecord;
    if (paymentSnap.empty) {
      // Create payment record from donation data
      const paymentRef = db.collection('payment_records').doc();
      payment = {
        id: paymentRef.id,
        userId: donation.userId,
        donationId,
        stripePaymentIntentId: donation.stripePaymentIntentId,
        amount: donation.amount,
        currency: donation.currency || 'eur',
        status: 'succeeded',
        paymentMethod: { type: donation.paymentMethodType || 'card' },
        refundedAmount: 0,
        disputedAmount: 0,
        metadata: {},
        createdAt: donation.createdAt,
        updatedAt: donation.createdAt,
      };
      await paymentRef.set(payment);
    } else {
      payment = paymentSnap.docs[0].data() as PaymentRecord;
    }

    // Prevent over-refunding
    const maxRefundable = payment.amount - payment.refundedAmount;
    if (amount > maxRefundable) {
      throw new Error(
        `Refund amount €${(amount / 100).toFixed(2)} exceeds maximum refundable ` +
        `€${(maxRefundable / 100).toFixed(2)} (original: €${(payment.amount / 100).toFixed(2)}, ` +
        `already refunded: €${(payment.refundedAmount / 100).toFixed(2)})`
      );
    }

    if (amount <= 0) {
      throw new Error('Refund amount must be positive');
    }

    // Process refund via Stripe
    let stripeRefund: Stripe.Refund;
    try {
      stripeRefund = await stripe.refunds.create({
        payment_intent: payment.stripePaymentIntentId,
        amount,
        reason: reason === 'duplicate' ? 'duplicate' :
                reason === 'fraudulent' ? 'fraudulent' : 'requested_by_customer',
        metadata: {
          donationId,
          processedBy,
          platform: 'gratis_ngo',
        },
      });
    } catch (err: any) {
      throw new Error(`Stripe refund failed: ${err.message}`);
    }

    // Record refund in Firestore
    const refundRef = db.collection('refunds').doc();
    const now = new Date().toISOString();

    const refundRecord: RefundRecord = {
      id: refundRef.id,
      paymentId: payment.id,
      donationId,
      userId: donation.userId,
      stripeRefundId: stripeRefund.id,
      amount,
      currency: payment.currency,
      status: stripeRefund.status as RefundStatus || 'succeeded',
      reason,
      notes,
      processedBy,
      createdAt: now,
      completedAt: stripeRefund.status === 'succeeded' ? now : undefined,
    };

    await refundRef.set(refundRecord);

    // Update payment record
    const newRefundedTotal = payment.refundedAmount + amount;
    const isFullRefund = newRefundedTotal >= payment.amount;

    await db.collection('payment_records').doc(payment.id).update({
      refundedAmount: newRefundedTotal,
      status: isFullRefund ? 'refunded' : 'partially_refunded',
      updatedAt: now,
    });

    // Update donation status
    await db.collection('donations').doc(donationId).update({
      status: isFullRefund ? 'refunded' : 'partially_refunded',
      refundedAmount: newRefundedTotal,
      updatedAt: now,
    });

    // Log audit event
    await db.collection('audit_logs').add({
      category: 'donations',
      action: 'refund_processed',
      userId: processedBy,
      targetId: donationId,
      severity: 'high',
      details: {
        refundId: refundRef.id,
        amount,
        reason,
        isFullRefund,
        donorUserId: donation.userId,
      },
      createdAt: now,
    });

    // Notify donor
    await db.collection('notifications').add({
      userId: donation.userId,
      type: 'refund_processed',
      title: 'Refund Processed',
      message: `A refund of €${(amount / 100).toFixed(2)} has been processed for your donation. ` +
               `It may take 5-10 business days to appear on your statement.`,
      data: { refundId: refundRef.id, donationId, amount },
      read: false,
      createdAt: now,
    });

    return refundRecord;
  }

  /**
   * Get all refunds for a donation
   */
  static async getRefundsForDonation(donationId: string): Promise<RefundRecord[]> {
    const snapshot = await db.collection('refunds')
      .where('donationId', '==', donationId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => doc.data() as RefundRecord);
  }

  /**
   * Get recent refunds for admin dashboard
   */
  static async getRecentRefunds(limit: number = 50): Promise<RefundRecord[]> {
    const snapshot = await db.collection('refunds')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    return snapshot.docs.map(doc => doc.data() as RefundRecord);
  }

  /**
   * Get refund statistics
   */
  static async getRefundStats(startDate: string, endDate: string): Promise<{
    totalRefunds: number;
    totalAmount: number;
    byReason: Record<string, { count: number; amount: number }>;
  }> {
    const snapshot = await db.collection('refunds')
      .where('createdAt', '>=', startDate)
      .where('createdAt', '<=', endDate)
      .get();

    const stats = {
      totalRefunds: 0,
      totalAmount: 0,
      byReason: {} as Record<string, { count: number; amount: number }>,
    };

    for (const doc of snapshot.docs) {
      const refund = doc.data() as RefundRecord;
      stats.totalRefunds++;
      stats.totalAmount += refund.amount;

      if (!stats.byReason[refund.reason]) {
        stats.byReason[refund.reason] = { count: 0, amount: 0 };
      }
      stats.byReason[refund.reason].count++;
      stats.byReason[refund.reason].amount += refund.amount;
    }

    return stats;
  }
}
```


---

### FILE: src/lib/payments/tax-receipts.ts

```typescript
// ============================================================================
// TAX RECEIPT SERVICE - ANBI COMPLIANT (NETHERLANDS)
// ============================================================================

import { db, storage } from '@/lib/firebase/admin';
import { TaxReceipt, TaxReceiptDonation, TaxReceiptGenerationRequest } from '@/types/payment';

const ORGANIZATION_INFO = {
  name: 'Stichting GRATIS',
  kvkNumber: '12345678',
  rsinNumber: '123456789',
  address: 'Keizersgracht 100, 1015 AA Amsterdam, Netherlands',
  iban: 'NL00ABNA0123456789',
  email: 'info@gratis.ngo',
  website: 'https://gratis.ngo',
  anbiStatus: 'Approved ANBI Institution (Algemeen Nut Beogende Instelling)',
};

export class TaxReceiptService {
  /**
   * Generate annual tax receipt for a donor (ANBI-compliant)
   */
  static async generateAnnualReceipt(
    request: TaxReceiptGenerationRequest
  ): Promise<TaxReceipt> {
    const { userId, year, format } = request;

    // Check for existing receipt
    const existingSnap = await db.collection('tax_receipts')
      .where('userId', '==', userId)
      .where('year', '==', year)
      .where('status', 'in', ['generated', 'sent', 'downloaded'])
      .limit(1)
      .get();

    if (!existingSnap.empty) {
      return existingSnap.docs[0].data() as TaxReceipt;
    }

    // Get user info
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) throw new Error('User not found');
    const user = userDoc.data()!;

    // Get all completed donations for the year
    const yearStart = `${year}-01-01T00:00:00.000Z`;
    const yearEnd = `${year}-12-31T23:59:59.999Z`;

    const donationsSnap = await db.collection('donations')
      .where('userId', '==', userId)
      .where('status', '==', 'completed')
      .where('createdAt', '>=', yearStart)
      .where('createdAt', '<=', yearEnd)
      .orderBy('createdAt', 'asc')
      .get();

    if (donationsSnap.empty) {
      throw new Error(`No completed donations found for ${year}`);
    }

    // Map donations for receipt
    const donations: TaxReceiptDonation[] = donationsSnap.docs.map(doc => {
      const d = doc.data();
      return {
        donationId: doc.id,
        date: d.createdAt,
        amount: d.amount,
        type: d.type === 'recurring' ? 'recurring' : 'one_time',
        projectName: d.projectName || 'General Fund',
        paymentMethod: d.paymentMethodType || 'card',
      };
    });

    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

    // Generate receipt number
    const receiptNumber = await this.generateReceiptNumber(year);

    // Create receipt record
    const receiptRef = db.collection('tax_receipts').doc();
    const now = new Date().toISOString();

    const receipt: TaxReceipt = {
      id: receiptRef.id,
      userId,
      year,
      receiptNumber,
      donorInfo: {
        name: user.displayName || 'Unknown',
        email: user.email,
        address: user.address || undefined,
      },
      organizationInfo: ORGANIZATION_INFO,
      donations,
      totalAmount,
      currency: 'eur',
      status: 'draft',
      createdAt: now,
    };

    // Generate PDF/HTML
    const html = this.generateReceiptHTML(receipt);

    if (format === 'pdf') {
      // Convert HTML to PDF using puppeteer or similar
      const pdfBuffer = await this.htmlToPdf(html);
      const storagePath = `tax-receipts/${userId}/${year}/${receiptNumber}.pdf`;
      const file = storage.bucket().file(storagePath);

      await file.save(pdfBuffer, {
        contentType: 'application/pdf',
        metadata: {
          customMetadata: {
            userId,
            year: year.toString(),
            receiptNumber,
          },
        },
      });

      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
      });

      receipt.pdfUrl = signedUrl;
      receipt.pdfStoragePath = storagePath;
    }

    receipt.status = 'generated';
    receipt.generatedAt = now;

    await receiptRef.set(receipt);

    // Log
    await db.collection('audit_logs').add({
      category: 'donations',
      action: 'tax_receipt_generated',
      userId,
      targetId: receiptRef.id,
      severity: 'low',
      details: { year, receiptNumber, totalAmount, donationCount: donations.length },
      createdAt: now,
    });

    return receipt;
  }

  /**
   * Generate sequential receipt number for the year
   */
  private static async generateReceiptNumber(year: number): Promise<string> {
    const counterRef = db.collection('system_counters').doc(`tax_receipt_${year}`);

    const result = await db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      let nextNumber = 1;
      if (counterDoc.exists) {
        nextNumber = (counterDoc.data()?.value || 0) + 1;
      }
      transaction.set(counterRef, { value: nextNumber }, { merge: true });
      return nextNumber;
    });

    return `GRATIS-${year}-${String(result).padStart(5, '0')}`;
  }

  /**
   * Generate ANBI-compliant HTML receipt
   */
  private static generateReceiptHTML(receipt: TaxReceipt): string {
    const { donorInfo, organizationInfo, donations, totalAmount, year, receiptNumber } = receipt;

    const donationRows = donations.map(d => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #E5E7EB;">
          ${new Date(d.date).toLocaleDateString('nl-NL')}
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #E5E7EB;">
          ${d.projectName}
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #E5E7EB;">
          ${d.type === 'recurring' ? 'Periodiek' : 'Eenmalig'}
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #E5E7EB; text-align: right; font-weight: 600;">
          €${(d.amount / 100).toFixed(2)}
        </td>
      </tr>
    `).join('');

    return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <title>Giftenoverzicht ${year} - ${receiptNumber}</title>
  <style>
    body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1F2937; margin: 0; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 3px solid #2563EB; padding-bottom: 20px; }
    .logo { font-size: 28px; font-weight: 800; color: #2563EB; }
    .receipt-info { text-align: right; font-size: 13px; color: #6B7280; }
    .section { margin-bottom: 28px; }
    .section-title { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 12px; border-left: 4px solid #2563EB; padding-left: 12px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .info-block label { display: block; font-size: 11px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
    .info-block span { font-size: 14px; color: #374151; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    thead th { background: #F3F4F6; padding: 10px 12px; text-align: left; font-weight: 600; font-size: 12px; text-transform: uppercase; color: #6B7280; }
    .total-row td { font-weight: 700; font-size: 16px; padding: 14px 12px; border-top: 2px solid #2563EB; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #9CA3AF; }
    .anbi-badge { display: inline-block; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 8px 16px; font-size: 12px; color: #1D4ED8; margin-top: 12px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">🌍 GRATIS.NGO</div>
      <div style="font-size: 13px; color: #6B7280; margin-top: 4px;">
        ${organizationInfo.name}
      </div>
    </div>
    <div class="receipt-info">
      <div style="font-size: 18px; font-weight: 700; color: #111827;">Giftenoverzicht ${year}</div>
      <div>Kenmerk: ${receiptNumber}</div>
      <div>Datum: ${new Date().toLocaleDateString('nl-NL')}</div>
    </div>
  </div>

  <div class="info-grid section">
    <div>
      <div class="section-title">Donateur</div>
      <div class="info-block">
        <label>Naam</label>
        <span>${donorInfo.name}</span>
      </div>
      <div class="info-block" style="margin-top: 8px;">
        <label>E-mail</label>
        <span>${donorInfo.email}</span>
      </div>
      ${donorInfo.address ? `
      <div class="info-block" style="margin-top: 8px;">
        <label>Adres</label>
        <span>${donorInfo.address}</span>
      </div>` : ''}
    </div>
    <div>
      <div class="section-title">Ontvangende Instelling</div>
      <div class="info-block">
        <label>Naam</label>
        <span>${organizationInfo.name}</span>
      </div>
      <div class="info-block" style="margin-top: 8px;">
        <label>RSIN/Fiscaal nummer</label>
        <span>${organizationInfo.rsinNumber}</span>
      </div>
      <div class="info-block" style="margin-top: 8px;">
        <label>KVK-nummer</label>
        <span>${organizationInfo.kvkNumber}</span>
      </div>
      <div class="info-block" style="margin-top: 8px;">
        <label>Adres</label>
        <span>${organizationInfo.address}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Overzicht Giften ${year}</div>
    <table>
      <thead>
        <tr>
          <th>Datum</th>
          <th>Project</th>
          <th>Type</th>
          <th style="text-align: right;">Bedrag</th>
        </tr>
      </thead>
      <tbody>
        ${donationRows}
        <tr class="total-row">
          <td colspan="3">Totaal ${year}</td>
          <td style="text-align: right; color: #2563EB;">
            €${(totalAmount / 100).toFixed(2)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="anbi-badge">
      ✅ ${organizationInfo.anbiStatus}<br>
      <span style="font-size: 11px; color: #6B7280;">
        Giften aan ANBI-instellingen zijn aftrekbaar voor de inkomstenbelasting
        (periodieke giften) of als drempelgift (incidentele giften).
      </span>
    </div>
  </div>

  <div class="footer">
    <p>
      Dit overzicht is opgesteld ten behoeve van de aangifte inkomstenbelasting
      van bovengenoemde donateur. ${organizationInfo.name} verklaart hierbij dat
      bovengenoemde bedragen zijn ontvangen als giften.
    </p>
    <p style="margin-top: 12px;">
      ${organizationInfo.name} · ${organizationInfo.address}<br>
      KVK: ${organizationInfo.kvkNumber} · RSIN: ${organizationInfo.rsinNumber} · IBAN: ${organizationInfo.iban}<br>
      ${organizationInfo.email} · ${organizationInfo.website}
    </p>
  </div>
</body>
</html>`;
  }

  /**
   * Convert HTML to PDF buffer (using puppeteer or jsPDF fallback)
   */
  private static async htmlToPdf(html: string): Promise<Buffer> {
    // In production: use puppeteer, wkhtmltopdf, or a PDF generation service
    // Fallback: store HTML and convert server-side
    try {
      const puppeteer = require('puppeteer');
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
        printBackground: true,
      });
      await browser.close();
      return Buffer.from(pdfBuffer);
    } catch {
      // Fallback: return HTML as buffer for now
      return Buffer.from(html, 'utf-8');
    }
  }

  /**
   * Send tax receipt by email
   */
  static async sendReceipt(receiptId: string): Promise<void> {
    const receiptDoc = await db.collection('tax_receipts').doc(receiptId).get();
    if (!receiptDoc.exists) throw new Error('Receipt not found');
    const receipt = receiptDoc.data() as TaxReceipt;

    // Queue email via notification system
    await db.collection('email_queue').add({
      to: receipt.donorInfo.email,
      subject: `Giftenoverzicht ${receipt.year} - ${ORGANIZATION_INFO.name}`,
      template: 'tax_receipt',
      data: {
        donorName: receipt.donorInfo.name,
        year: receipt.year,
        totalAmount: (receipt.totalAmount / 100).toFixed(2),
        receiptNumber: receipt.receiptNumber,
        downloadUrl: receipt.pdfUrl,
        donationCount: receipt.donations.length,
      },
      attachments: receipt.pdfStoragePath ? [{
        filename: `Giftenoverzicht-${receipt.year}-${receipt.receiptNumber}.pdf`,
        storagePath: receipt.pdfStoragePath,
      }] : [],
      createdAt: new Date().toISOString(),
    });

    await receiptDoc.ref.update({
      status: 'sent',
      sentAt: new Date().toISOString(),
    });
  }

  /**
   * Get receipts for a user
   */
  static async getUserReceipts(userId: string): Promise<TaxReceipt[]> {
    const snapshot = await db.collection('tax_receipts')
      .where('userId', '==', userId)
      .orderBy('year', 'desc')
      .get();
    return snapshot.docs.map(doc => doc.data() as TaxReceipt);
  }

  /**
   * Bulk generate receipts for all eligible donors
   */
  static async bulkGenerateReceipts(year: number): Promise<{
    generated: number;
    skipped: number;
    errors: string[];
  }> {
    // Get all users with donations in the year
    const yearStart = `${year}-01-01T00:00:00.000Z`;
    const yearEnd = `${year}-12-31T23:59:59.999Z`;

    const donationsSnap = await db.collection('donations')
      .where('status', '==', 'completed')
      .where('createdAt', '>=', yearStart)
      .where('createdAt', '<=', yearEnd)
      .get();

    // Get unique user IDs
    const userIds = new Set<string>();
    for (const doc of donationsSnap.docs) {
      userIds.add(doc.data().userId);
    }

    const result = { generated: 0, skipped: 0, errors: [] as string[] };

    for (const userId of userIds) {
      try {
        await this.generateAnnualReceipt({ userId, year, format: 'pdf', includeAddress: true });
        result.generated++;
      } catch (err: any) {
        if (err.message.includes('already exists') || err.message.includes('No completed')) {
          result.skipped++;
        } else {
          result.errors.push(`${userId}: ${err.message}`);
        }
      }
    }

    return result;
  }
}
```


---

### FILE: src/lib/payments/disputes.ts

```typescript
// ============================================================================
// STRIPE DISPUTE HANDLING SERVICE
// ============================================================================

import Stripe from 'stripe';
import { db } from '@/lib/firebase/admin';
import { DisputeRecord, DisputeEvidence } from '@/types/payment';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' });

export class DisputeService {
  /**
   * Handle incoming dispute from Stripe webhook
   */
  static async handleDisputeCreated(dispute: Stripe.Dispute): Promise<DisputeRecord> {
    // Find related payment
    const chargeId = typeof dispute.charge === 'string' ? dispute.charge : dispute.charge.id;
    const paymentSnap = await db.collection('payments')
      .where('stripeChargeId', '==', chargeId)
      .limit(1)
      .get();

    const paymentDoc = paymentSnap.docs[0];
    const paymentData = paymentDoc?.data();

    const disputeRecord: DisputeRecord = {
      id: `dispute_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      paymentId: paymentDoc?.id || '',
      donationId: paymentData?.donationId || '',
      userId: paymentData?.userId || '',
      stripeDisputeId: dispute.id,
      stripeChargeId: chargeId,
      amount: dispute.amount,
      currency: dispute.currency,
      status: dispute.status as DisputeRecord['status'],
      reason: dispute.reason as DisputeRecord['reason'],
      evidenceDueBy: dispute.evidence_details?.due_by
        ? new Date(dispute.evidence_details.due_by * 1000).toISOString()
        : null,
      evidenceSubmitted: false,
      isRefundable: dispute.is_charge_refundable,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection('disputes').doc(disputeRecord.id).set(disputeRecord);

    // Update payment status
    if (paymentDoc) {
      await paymentDoc.ref.update({
        status: 'disputed',
        disputedAmount: dispute.amount,
        updatedAt: new Date().toISOString(),
      });
    }

    // Notify admin
    await db.collection('admin_notifications').add({
      type: 'dispute_created',
      title: `New Dispute: €${(dispute.amount / 100).toFixed(2)}`,
      message: `Dispute ${dispute.id} opened for reason: ${dispute.reason}. Evidence due by ${disputeRecord.evidenceDueBy || 'N/A'}.`,
      priority: 'high',
      read: false,
      link: `/admin/disputes/${disputeRecord.id}`,
      createdAt: new Date().toISOString(),
    });

    return disputeRecord;
  }

  /**
   * Handle dispute status updates
   */
  static async handleDisputeUpdated(dispute: Stripe.Dispute): Promise<void> {
    const disputeSnap = await db.collection('disputes')
      .where('stripeDisputeId', '==', dispute.id)
      .limit(1)
      .get();

    if (disputeSnap.empty) return;

    const docRef = disputeSnap.docs[0].ref;
    const newStatus = dispute.status as DisputeRecord['status'];

    await docRef.update({
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });

    // If dispute resolved, update payment
    const disputeData = disputeSnap.docs[0].data() as DisputeRecord;
    if (newStatus === 'won') {
      const paymentSnap = await db.collection('payments').doc(disputeData.paymentId).get();
      if (paymentSnap.exists) {
        await paymentSnap.ref.update({
          status: 'succeeded',
          disputedAmount: 0,
          updatedAt: new Date().toISOString(),
        });
      }
    } else if (newStatus === 'lost') {
      const paymentSnap = await db.collection('payments').doc(disputeData.paymentId).get();
      if (paymentSnap.exists) {
        await paymentSnap.ref.update({
          status: 'refunded',
          refundedAmount: disputeData.amount,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    await db.collection('admin_notifications').add({
      type: 'dispute_updated',
      title: `Dispute ${newStatus}: €${(disputeData.amount / 100).toFixed(2)}`,
      message: `Dispute ${dispute.id} status changed to ${newStatus}.`,
      priority: newStatus === 'lost' ? 'high' : 'medium',
      read: false,
      link: `/admin/disputes/${disputeData.id}`,
      createdAt: new Date().toISOString(),
    });
  }

  /**
   * Submit dispute evidence to Stripe
   */
  static async submitEvidence(
    disputeId: string,
    evidence: DisputeEvidence
  ): Promise<void> {
    const disputeDoc = await db.collection('disputes').doc(disputeId).get();
    if (!disputeDoc.exists) {
      throw new Error('Dispute not found');
    }

    const disputeData = disputeDoc.data() as DisputeRecord;

    // Build Stripe evidence object
    const stripeEvidence: Stripe.DisputeUpdateParams.Evidence = {};

    if (evidence.customerName) stripeEvidence.customer_name = evidence.customerName;
    if (evidence.customerEmail) stripeEvidence.customer_email_address = evidence.customerEmail;
    if (evidence.productDescription) stripeEvidence.product_description = evidence.productDescription;
    if (evidence.uncategorizedText) stripeEvidence.uncategorized_text = evidence.uncategorizedText;

    // For charity donations, build compelling narrative
    if (!evidence.uncategorizedText) {
      stripeEvidence.uncategorized_text = [
        'This transaction is a charitable donation to Stichting GRATIS (ANBI-registered Dutch charity).',
        `The donor (${evidence.customerName || 'anonymous'}) made this donation voluntarily.`,
        evidence.donationConfirmation
          ? `A donation confirmation was sent to ${evidence.customerEmail} on ${evidence.donationConfirmation}.`
          : '',
        evidence.receiptUrl
          ? `A tax receipt is available at: ${evidence.receiptUrl}`
          : '',
        'Stichting GRATIS is a registered ANBI institution and all donations are tax-deductible under Dutch law.',
      ].filter(Boolean).join(' ');
    }

    // Submit to Stripe
    await stripe.disputes.update(disputeData.stripeDisputeId, {
      evidence: stripeEvidence,
      submit: true,
    });

    // Update local record
    await disputeDoc.ref.update({
      evidenceSubmitted: true,
      evidence,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Accept a dispute (concede)
   */
  static async acceptDispute(disputeId: string): Promise<void> {
    const disputeDoc = await db.collection('disputes').doc(disputeId).get();
    if (!disputeDoc.exists) throw new Error('Dispute not found');

    const disputeData = disputeDoc.data() as DisputeRecord;

    await stripe.disputes.close(disputeData.stripeDisputeId);

    await disputeDoc.ref.update({
      status: 'lost',
      updatedAt: new Date().toISOString(),
    });

    // Update payment
    await db.collection('payments').doc(disputeData.paymentId).update({
      status: 'refunded',
      refundedAmount: disputeData.amount,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * List disputes with filters
   */
  static async listDisputes(params: {
    status?: DisputeRecord['status'];
    limit?: number;
    offset?: number;
  }): Promise<{ disputes: DisputeRecord[]; total: number }> {
    let query: FirebaseFirestore.Query = db.collection('disputes')
      .orderBy('createdAt', 'desc');

    if (params.status) {
      query = query.where('status', '==', params.status);
    }

    // Get total count
    const countSnap = await query.count().get();
    const total = countSnap.data().count;

    // Paginate
    if (params.offset) {
      query = query.offset(params.offset);
    }
    query = query.limit(params.limit || 20);

    const snapshot = await query.get();
    const disputes = snapshot.docs.map(doc => doc.data() as DisputeRecord);

    return { disputes, total };
  }

  /**
   * Get single dispute by ID
   */
  static async getDispute(disputeId: string): Promise<DisputeRecord | null> {
    const doc = await db.collection('disputes').doc(disputeId).get();
    return doc.exists ? (doc.data() as DisputeRecord) : null;
  }
}
```

---

### FILE: src/components/admin/RefundManager.tsx

```tsx
// ============================================================================
// ADMIN REFUND & DISPUTE MANAGEMENT DASHBOARD
// ============================================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatDate } from '@/lib/utils/format';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface RefundRecord {
  id: string;
  paymentId: string;
  donationId: string;
  userId: string;
  stripeRefundId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  reason: string;
  reasonNote?: string;
  requestedBy: string;
  approvedBy?: string;
  processedAt?: string;
  createdAt: string;
}

interface DisputeRecord {
  id: string;
  paymentId: string;
  donationId: string;
  userId: string;
  stripeDisputeId: string;
  amount: number;
  currency: string;
  status: string;
  reason: string;
  evidenceDueBy: string | null;
  evidenceSubmitted: boolean;
  createdAt: string;
}

interface PaymentSearch {
  donationId: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface RefundFormData {
  paymentId: string;
  amount: number;
  reason: 'donor_request' | 'duplicate' | 'fraudulent' | 'project_canceled' | 'other';
  reasonNote: string;
}

type ActiveTab = 'refunds' | 'disputes' | 'new-refund';

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export default function RefundManager() {
  const { user } = useAuth();

  // State
  const [activeTab, setActiveTab] = useState<ActiveTab>('refunds');
  const [refunds, setRefunds] = useState<RefundRecord[]>([]);
  const [disputes, setDisputes] = useState<DisputeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refundForm, setRefundForm] = useState<RefundFormData>({
    paymentId: '',
    amount: 0,
    reason: 'donor_request',
    reasonNote: '',
  });
  const [paymentSearch, setPaymentSearch] = useState('');
  const [foundPayment, setFoundPayment] = useState<PaymentSearch | null>(null);
  const [processing, setProcessing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // ------------------------------------------------------------------
  // Data fetching
  // ------------------------------------------------------------------
  const fetchRefunds = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      params.set('limit', '50');

      const res = await fetch(`/api/admin/refunds?${params}`);
      if (!res.ok) throw new Error('Failed to fetch refunds');
      const data = await res.json();
      setRefunds(data.refunds);
    } catch (err) {
      console.error('Error fetching refunds:', err);
    }
  }, [statusFilter]);

  const fetchDisputes = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/disputes');
      if (!res.ok) throw new Error('Failed to fetch disputes');
      const data = await res.json();
      setDisputes(data.disputes);
    } catch (err) {
      console.error('Error fetching disputes:', err);
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await Promise.all([fetchRefunds(), fetchDisputes()]);
      setLoading(false);
    }
    loadData();
  }, [fetchRefunds, fetchDisputes]);

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------
  const searchPayment = async () => {
    if (!paymentSearch.trim()) return;
    try {
      const res = await fetch(`/api/admin/payments/search?q=${encodeURIComponent(paymentSearch)}`);
      if (!res.ok) throw new Error('Payment not found');
      const data = await res.json();
      setFoundPayment(data.payment);
      setRefundForm(prev => ({
        ...prev,
        paymentId: data.payment.donationId,
        amount: data.payment.amount / 100,
      }));
    } catch {
      setToast({ message: 'Payment not found. Check the donation ID or Stripe charge ID.', type: 'error' });
    }
  };

  const processRefund = async () => {
    if (!refundForm.paymentId || refundForm.amount <= 0) {
      setToast({ message: 'Please provide a valid payment and amount.', type: 'error' });
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch('/api/admin/refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donationId: refundForm.paymentId,
          amount: Math.round(refundForm.amount * 100), // convert to cents
          reason: refundForm.reason,
          reasonNote: refundForm.reasonNote,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Refund failed');
      }

      setToast({ message: 'Refund processed successfully!', type: 'success' });
      setRefundForm({ paymentId: '', amount: 0, reason: 'donor_request', reasonNote: '' });
      setFoundPayment(null);
      setPaymentSearch('');
      setActiveTab('refunds');
      fetchRefunds();
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  const submitDisputeEvidence = async (disputeId: string) => {
    const note = prompt('Enter evidence description for Stripe:');
    if (!note) return;

    try {
      const res = await fetch(`/api/admin/disputes/${disputeId}/evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uncategorizedText: note }),
      });
      if (!res.ok) throw new Error('Failed to submit evidence');
      setToast({ message: 'Evidence submitted to Stripe.', type: 'success' });
      fetchDisputes();
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const acceptDispute = async (disputeId: string) => {
    if (!confirm('Accept this dispute? The donor will be refunded and you lose the chargeback. This cannot be undone.')) return;

    try {
      const res = await fetch(`/api/admin/disputes/${disputeId}/accept`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to accept dispute');
      setToast({ message: 'Dispute accepted. Refund issued.', type: 'success' });
      fetchDisputes();
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------
  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      succeeded: '#22c55e',
      pending: '#eab308',
      failed: '#ef4444',
      canceled: '#6b7280',
      won: '#22c55e',
      lost: '#ef4444',
      needs_response: '#f97316',
      under_review: '#3b82f6',
      warning_needs_response: '#f97316',
    };
    const bg = colors[status] || '#6b7280';
    return (
      <span style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        color: '#fff',
        backgroundColor: bg,
        textTransform: 'capitalize',
      }}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <div style={{
          width: 40, height: 40, border: '3px solid #e5e7eb',
          borderTopColor: '#2563eb', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed', top: 20, right: 20, zIndex: 1000,
            padding: '12px 20px', borderRadius: 8,
            backgroundColor: toast.type === 'success' ? '#22c55e' : '#ef4444',
            color: '#fff', fontWeight: 500, fontSize: 14,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            cursor: 'pointer',
          }}
          onClick={() => setToast(null)}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Payment Management</h1>
        <p style={{ color: '#6b7280', marginTop: 4 }}>Manage refunds, disputes, and chargebacks</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Pending Refunds', value: refunds.filter(r => r.status === 'pending').length, color: '#eab308' },
          { label: 'Completed Refunds', value: refunds.filter(r => r.status === 'succeeded').length, color: '#22c55e' },
          { label: 'Active Disputes', value: disputes.filter(d => ['needs_response', 'under_review', 'warning_needs_response'].includes(d.status)).length, color: '#f97316' },
          { label: 'Total Refunded', value: `€${(refunds.filter(r => r.status === 'succeeded').reduce((sum, r) => sum + r.amount, 0) / 100).toFixed(2)}`, color: '#6b7280' },
        ].map((card, i) => (
          <div key={i} style={{
            padding: 20, borderRadius: 12, backgroundColor: '#fff',
            border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{card.label}</p>
            <p style={{ fontSize: 28, fontWeight: 700, margin: '4px 0 0', color: card.color }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 24, borderBottom: '2px solid #e5e7eb' }}>
        {([
          { key: 'refunds', label: 'Refund History' },
          { key: 'disputes', label: `Disputes (${disputes.filter(d => d.status !== 'won' && d.status !== 'lost').length})` },
          { key: 'new-refund', label: '+ New Refund' },
        ] as { key: ActiveTab; label: string }[]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 20px', border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 14,
              backgroundColor: activeTab === tab.key ? '#fff' : 'transparent',
              color: activeTab === tab.key ? '#2563eb' : '#6b7280',
              borderBottom: activeTab === tab.key ? '2px solid #2563eb' : '2px solid transparent',
              marginBottom: -2,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Refund History */}
      {activeTab === 'refunds' && (
        <div>
          <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
            {['all', 'pending', 'succeeded', 'failed'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '6px 14px', borderRadius: 20, border: '1px solid #e5e7eb',
                  fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  backgroundColor: statusFilter === s ? '#2563eb' : '#fff',
                  color: statusFilter === s ? '#fff' : '#374151',
                }}
              >
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px', color: '#6b7280', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '10px 12px', color: '#6b7280', fontWeight: 600 }}>Donation ID</th>
                  <th style={{ padding: '10px 12px', color: '#6b7280', fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: '10px 12px', color: '#6b7280', fontWeight: 600 }}>Reason</th>
                  <th style={{ padding: '10px 12px', color: '#6b7280', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '10px 12px', color: '#6b7280', fontWeight: 600 }}>Requested By</th>
                </tr>
              </thead>
              <tbody>
                {refunds.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
                      No refunds found
                    </td>
                  </tr>
                ) : (
                  refunds.map(refund => (
                    <tr key={refund.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '10px 12px' }}>{formatDate(refund.createdAt)}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 12 }}>
                        {refund.donationId.substring(0, 16)}...
                      </td>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>
                        €{(refund.amount / 100).toFixed(2)}
                      </td>
                      <td style={{ padding: '10px 12px', textTransform: 'capitalize' }}>
                        {refund.reason.replace(/_/g, ' ')}
                      </td>
                      <td style={{ padding: '10px 12px' }}>{statusBadge(refund.status)}</td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>
                        {refund.requestedBy.substring(0, 12)}...
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Disputes */}
      {activeTab === 'disputes' && (
        <div>
          {disputes.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#9ca3af' }}>
              <p style={{ fontSize: 48, margin: 0 }}>✓</p>
              <p style={{ fontSize: 16, fontWeight: 500 }}>No disputes</p>
              <p>All payments are in good standing.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {disputes.map(dispute => (
                <div key={dispute.id} style={{
                  padding: 20, borderRadius: 12, border: '1px solid #e5e7eb',
                  backgroundColor: '#fff',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 18 }}>€{(dispute.amount / 100).toFixed(2)}</span>
                      <span style={{ color: '#6b7280', marginLeft: 8, fontSize: 13 }}>
                        {dispute.stripeDisputeId}
                      </span>
                    </div>
                    {statusBadge(dispute.status)}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
                    <div>
                      <strong>Reason:</strong> {dispute.reason.replace(/_/g, ' ')}
                    </div>
                    <div>
                      <strong>Opened:</strong> {formatDate(dispute.createdAt)}
                    </div>
                    <div>
                      <strong>Evidence Due:</strong>{' '}
                      {dispute.evidenceDueBy ? formatDate(dispute.evidenceDueBy) : 'N/A'}
                    </div>
                  </div>

                  {dispute.status === 'needs_response' || dispute.status === 'warning_needs_response' ? (
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button
                        onClick={() => submitDisputeEvidence(dispute.id)}
                        style={{
                          padding: '8px 16px', borderRadius: 8, border: 'none',
                          backgroundColor: '#2563eb', color: '#fff',
                          fontWeight: 600, fontSize: 13, cursor: 'pointer',
                        }}
                      >
                        Submit Evidence
                      </button>
                      <button
                        onClick={() => acceptDispute(dispute.id)}
                        style={{
                          padding: '8px 16px', borderRadius: 8,
                          border: '1px solid #e5e7eb', backgroundColor: '#fff',
                          color: '#ef4444', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                        }}
                      >
                        Accept (Concede)
                      </button>
                    </div>
                  ) : dispute.evidenceSubmitted ? (
                    <p style={{ fontSize: 13, color: '#22c55e', marginTop: 8 }}>
                      ✓ Evidence submitted — awaiting Stripe review
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: New Refund */}
      {activeTab === 'new-refund' && (
        <div style={{ maxWidth: 600 }}>
          {/* Payment Search */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
              Find Payment
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={paymentSearch}
                onChange={e => setPaymentSearch(e.target.value)}
                placeholder="Donation ID or Stripe charge ID..."
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: 8,
                  border: '1px solid #d1d5db', fontSize: 14,
                }}
                onKeyDown={e => e.key === 'Enter' && searchPayment()}
              />
              <button
                onClick={searchPayment}
                style={{
                  padding: '10px 20px', borderRadius: 8, border: 'none',
                  backgroundColor: '#374151', color: '#fff',
                  fontWeight: 600, cursor: 'pointer',
                }}
              >
                Search
              </button>
            </div>
          </div>

          {/* Found Payment Info */}
          {foundPayment && (
            <div style={{
              padding: 16, borderRadius: 8, backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0', marginBottom: 24,
            }}>
              <p style={{ margin: 0, fontWeight: 600 }}>Payment Found</p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
                {foundPayment.donationId} — €{(foundPayment.amount / 100).toFixed(2)} {foundPayment.currency.toUpperCase()} — {foundPayment.status}
              </p>
            </div>
          )}

          {/* Refund Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                Refund Amount (€)
              </label>
              <input
                type="number"
                value={refundForm.amount || ''}
                onChange={e => setRefundForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                min={0}
                step={0.01}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8,
                  border: '1px solid #d1d5db', fontSize: 14,
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                Reason
              </label>
              <select
                value={refundForm.reason}
                onChange={e => setRefundForm(prev => ({ ...prev, reason: e.target.value as RefundFormData['reason'] }))}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8,
                  border: '1px solid #d1d5db', fontSize: 14,
                }}
              >
                <option value="donor_request">Donor Request</option>
                <option value="duplicate">Duplicate Payment</option>
                <option value="fraudulent">Fraudulent</option>
                <option value="project_canceled">Project Canceled</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                Note (optional)
              </label>
              <textarea
                value={refundForm.reasonNote}
                onChange={e => setRefundForm(prev => ({ ...prev, reasonNote: e.target.value }))}
                rows={3}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8,
                  border: '1px solid #d1d5db', fontSize: 14, resize: 'vertical',
                }}
              />
            </div>

            <button
              onClick={processRefund}
              disabled={processing || !refundForm.paymentId || refundForm.amount <= 0}
              style={{
                padding: '12px 24px', borderRadius: 8, border: 'none',
                backgroundColor: processing ? '#9ca3af' : '#dc2626',
                color: '#fff', fontWeight: 700, fontSize: 15,
                cursor: processing ? 'not-allowed' : 'pointer',
              }}
            >
              {processing ? 'Processing Refund...' : `Process Refund — €${refundForm.amount.toFixed(2)}`}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
```

---

### FILE: src/components/donations/TaxReceipts.tsx

```tsx
// ============================================================================
// USER-FACING TAX RECEIPTS COMPONENT
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatDate } from '@/lib/utils/format';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface TaxReceipt {
  id: string;
  userId: string;
  year: number;
  totalAmount: number;
  totalDonations: number;
  currency: string;
  format: 'pdf' | 'csv';
  status: 'generating' | 'ready' | 'sent' | 'failed';
  downloadUrl?: string;
  generatedAt: string;
}

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export default function TaxReceipts() {
  const { user } = useAuth();

  const [receipts, setReceipts] = useState<TaxReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() - 1);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Available years (last 5 years)
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - 1 - i);

  // ------------------------------------------------------------------
  // Fetch receipts
  // ------------------------------------------------------------------
  useEffect(() => {
    async function fetchReceipts() {
      if (!user) return;
      try {
        const res = await fetch('/api/donations/tax-receipts');
        if (!res.ok) throw new Error('Failed to load receipts');
        const data = await res.json();
        setReceipts(data.receipts);
      } catch (err) {
        console.error('Error loading tax receipts:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReceipts();
  }, [user]);

  // ------------------------------------------------------------------
  // Generate receipt
  // ------------------------------------------------------------------
  const generateReceipt = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/donations/tax-receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: selectedYear, format: 'pdf', includeAddress: true }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate receipt');
      }

      const data = await res.json();
      setReceipts(prev => [data.receipt, ...prev]);
      setToast({ message: `Tax receipt for ${selectedYear} generated successfully!`, type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <div style={{
          width: 36, height: 36, border: '3px solid #e5e7eb',
          borderTopColor: '#2563eb', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed', top: 20, right: 20, zIndex: 1000,
            padding: '12px 20px', borderRadius: 8,
            backgroundColor: toast.type === 'success' ? '#22c55e' : '#ef4444',
            color: '#fff', fontWeight: 500, cursor: 'pointer',
          }}
          onClick={() => setToast(null)}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Tax Receipts</h2>
        <p style={{ color: '#6b7280', marginTop: 4, fontSize: 14 }}>
          Download your ANBI tax-deductible donation receipts. These are valid for your Dutch or EU tax return.
        </p>
      </div>

      {/* ANBI info card */}
      <div style={{
        padding: 16, borderRadius: 12, marginBottom: 24,
        backgroundColor: '#eff6ff', border: '1px solid #bfdbfe',
      }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#1e40af' }}>
          🏛️ ANBI Tax Deduction
        </p>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: '#3b82f6' }}>
          Stichting GRATIS is a registered ANBI institution. Your donations are tax-deductible
          under Dutch law. Keep this receipt with your tax records for verification by the Belastingdienst.
        </p>
      </div>

      {/* Generate new receipt */}
      <div style={{
        padding: 20, borderRadius: 12, border: '1px solid #e5e7eb',
        backgroundColor: '#fff', marginBottom: 24,
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 12px' }}>Generate Receipt</h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4, color: '#6b7280' }}>
              Tax Year
            </label>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(parseInt(e.target.value))}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8,
                border: '1px solid #d1d5db', fontSize: 14,
              }}
            >
              {availableYears.map(year => (
                <option key={year} value={year}>
                  {year} {receipts.some(r => r.year === year) ? '(already generated)' : ''}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={generateReceipt}
            disabled={generating}
            style={{
              padding: '10px 24px', borderRadius: 8, border: 'none',
              backgroundColor: generating ? '#9ca3af' : '#2563eb',
              color: '#fff', fontWeight: 600, fontSize: 14,
              cursor: generating ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {generating ? 'Generating...' : 'Generate PDF'}
          </button>
        </div>
      </div>

      {/* Receipts list */}
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Your Receipts</h3>

        {receipts.length === 0 ? (
          <div style={{
            padding: 40, textAlign: 'center', color: '#9ca3af',
            borderRadius: 12, border: '1px dashed #d1d5db',
          }}>
            <p style={{ fontSize: 32, margin: 0 }}>📄</p>
            <p style={{ fontWeight: 500, marginTop: 8 }}>No receipts yet</p>
            <p style={{ fontSize: 13 }}>Generate your first tax receipt using the form above.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {receipts.map(receipt => (
              <div key={receipt.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: 16, borderRadius: 12, border: '1px solid #e5e7eb',
                backgroundColor: '#fff',
              }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>
                    Tax Year {receipt.year}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
                    {receipt.totalDonations} donation{receipt.totalDonations !== 1 ? 's' : ''} —{' '}
                    €{(receipt.totalAmount / 100).toFixed(2)} total —{' '}
                    Generated {formatDate(receipt.generatedAt)}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {receipt.status === 'ready' || receipt.status === 'sent' ? (
                    <a
                      href={receipt.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '8px 16px', borderRadius: 8,
                        backgroundColor: '#2563eb', color: '#fff',
                        textDecoration: 'none', fontWeight: 600, fontSize: 13,
                      }}
                    >
                      ↓ Download PDF
                    </a>
                  ) : receipt.status === 'generating' ? (
                    <span style={{
                      padding: '8px 16px', borderRadius: 8,
                      backgroundColor: '#fef3c7', color: '#92400e',
                      fontSize: 13, fontWeight: 500,
                    }}>
                      Generating...
                    </span>
                  ) : (
                    <span style={{
                      padding: '8px 16px', borderRadius: 8,
                      backgroundColor: '#fef2f2', color: '#991b1b',
                      fontSize: 13, fontWeight: 500,
                    }}>
                      Failed — retry above
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
```

---

### FILE: src/app/api/admin/refunds/route.ts

```typescript
// ============================================================================
// ADMIN REFUND API ROUTES
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { RefundService } from '@/lib/payments/refunds';

async function requireAdmin(req: NextRequest): Promise<string> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  const token = authHeader.substring(7);
  const decoded = await adminAuth.verifyIdToken(token);

  // Verify admin role
  if (!decoded.admin && !decoded.role?.includes('admin')) {
    throw new Error('Forbidden: Admin access required');
  }
  return decoded.uid;
}

/**
 * GET /api/admin/refunds
 * List refunds with optional filters
 */
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as any;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const result = await RefundService.listRefunds({ status, limit, offset });
    return NextResponse.json(result);
  } catch (err: any) {
    if (err.message === 'Unauthorized' || err.message.includes('Forbidden')) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/refunds
 * Process a new refund
 */
export async function POST(req: NextRequest) {
  try {
    const adminId = await requireAdmin(req);
    const body = await req.json();

    const { donationId, amount, reason, reasonNote } = body;
    if (!donationId || !amount || !reason) {
      return NextResponse.json(
        { error: 'donationId, amount, and reason are required' },
        { status: 400 }
      );
    }

    const refund = await RefundService.processRefund({
      donationId,
      amount, // already in cents from frontend
      reason,
      reasonNote,
      requestedBy: adminId,
    });

    return NextResponse.json({ refund }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
```

---

### FILE: src/app/api/donations/tax-receipts/route.ts

```typescript
// ============================================================================
// USER TAX RECEIPT API ROUTES
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { TaxReceiptService } from '@/lib/payments/tax-receipts';

async function requireAuth(req: NextRequest): Promise<string> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  const token = authHeader.substring(7);
  const decoded = await adminAuth.verifyIdToken(token);
  return decoded.uid;
}

/**
 * GET /api/donations/tax-receipts
 * Get all receipts for authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    const receipts = await TaxReceiptService.getUserReceipts(userId);
    return NextResponse.json({ receipts });
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/donations/tax-receipts
 * Generate a new tax receipt for a given year
 */
export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    const body = await req.json();

    const { year, format, includeAddress } = body;
    if (!year) {
      return NextResponse.json({ error: 'year is required' }, { status: 400 });
    }

    // Validate year range
    const currentYear = new Date().getFullYear();
    if (year < 2020 || year >= currentYear) {
      return NextResponse.json(
        { error: `Year must be between 2020 and ${currentYear - 1}` },
        { status: 400 }
      );
    }

    const receipt = await TaxReceiptService.generateAnnualReceipt({
      userId,
      year,
      format: format || 'pdf',
      includeAddress: includeAddress !== false,
    });

    return NextResponse.json({ receipt }, { status: 201 });
  } catch (err: any) {
    if (err.message.includes('already exists')) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
```

---

### FILE: src/app/api/webhooks/stripe-disputes/route.ts

```typescript
// ============================================================================
// STRIPE DISPUTE WEBHOOK HANDLER
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { DisputeService } from '@/lib/payments/disputes';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' });
const webhookSecret = process.env.STRIPE_DISPUTE_WEBHOOK_SECRET!;

/**
 * POST /api/webhooks/stripe-disputes
 * Handle Stripe dispute lifecycle events
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute;
        await DisputeService.handleDisputeCreated(dispute);
        console.log(`[Dispute] Created: ${dispute.id}`);
        break;
      }

      case 'charge.dispute.updated': {
        const dispute = event.data.object as Stripe.Dispute;
        await DisputeService.handleDisputeUpdated(dispute);
        console.log(`[Dispute] Updated: ${dispute.id} → ${dispute.status}`);
        break;
      }

      case 'charge.dispute.closed': {
        const dispute = event.data.object as Stripe.Dispute;
        await DisputeService.handleDisputeUpdated(dispute);
        console.log(`[Dispute] Closed: ${dispute.id} → ${dispute.status}`);
        break;
      }

      case 'charge.dispute.funds_withdrawn': {
        const dispute = event.data.object as Stripe.Dispute;
        console.log(`[Dispute] Funds withdrawn: ${dispute.id} — €${(dispute.amount / 100).toFixed(2)}`);
        break;
      }

      case 'charge.dispute.funds_reinstated': {
        const dispute = event.data.object as Stripe.Dispute;
        console.log(`[Dispute] Funds reinstated: ${dispute.id} — €${(dispute.amount / 100).toFixed(2)}`);
        break;
      }

      default:
        console.log(`[Dispute Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`[Dispute Webhook] Error processing ${event.type}:`, err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Disable body parsing for webhook signature verification
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
```



---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 47: ROLE-BASED ACCESS CONTROL (RBAC)
# ═══════════════════════════════════════════════════════════════════════════════
#
# Comprehensive role and permission system for managing platform access.
# Supports hierarchical roles, granular permissions, custom roles, and
# middleware-based route protection for both API and page-level guards.
#
# Files:
#   - src/types/rbac.ts
#   - src/lib/rbac/permissions.ts
#   - src/lib/rbac/service.ts
#   - src/lib/rbac/middleware.ts
#   - src/components/admin/RoleManager.tsx
#   - src/components/shared/PermissionGate.tsx
#   - src/app/api/admin/roles/route.ts
#   - src/app/api/admin/roles/[id]/route.ts
#   - src/app/api/admin/users/[id]/role/route.ts
# ═══════════════════════════════════════════════════════════════════════════════


### FILE: src/types/rbac.ts

```typescript
// ============================================================================
// ROLE-BASED ACCESS CONTROL TYPE DEFINITIONS
// ============================================================================

/**
 * Platform resources that can be protected
 */
export type Resource =
  | 'donations'
  | 'users'
  | 'projects'
  | 'partners'
  | 'events'
  | 'content'
  | 'reports'
  | 'analytics'
  | 'settings'
  | 'roles'
  | 'subscriptions'
  | 'refunds'
  | 'disputes'
  | 'webhooks'
  | 'audit_logs'
  | 'gdpr'
  | 'tribe'
  | 'bottles'
  | 'social'
  | 'messaging'
  | 'support';

/**
 * Actions that can be performed on resources
 */
export type Action = 'create' | 'read' | 'update' | 'delete' | 'export' | 'approve' | 'manage';

/**
 * Permission string format: "resource:action"
 */
export type Permission = `${Resource}:${Action}`;

/**
 * Built-in system roles
 */
export type SystemRole = 'super_admin' | 'admin' | 'moderator' | 'partner_admin' | 'partner_user' | 'tribe_leader' | 'member' | 'guest';

/**
 * Role definition with permissions
 */
export interface RoleDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;        // System roles cannot be deleted
  isCustom: boolean;        // Custom roles created by admins
  inheritsFrom?: string;    // Role ID to inherit permissions from
  maxUsers?: number;        // Maximum users that can have this role (null = unlimited)
  priority: number;         // Higher number = higher priority in conflict resolution
  metadata: {
    color: string;          // Badge color
    icon: string;           // Display icon
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

/**
 * User role assignment
 */
export interface UserRole {
  userId: string;
  roleId: string;
  roleName: string;
  assignedAt: string;
  assignedBy: string;
  expiresAt?: string;       // Optional expiry for temporary roles
  scope?: {
    type: 'global' | 'partner' | 'project' | 'event';
    entityId?: string;      // If scoped, the entity ID
  };
}

/**
 * Role change audit entry
 */
export interface RoleChangeLog {
  id: string;
  userId: string;
  previousRoleId: string | null;
  newRoleId: string;
  changedBy: string;
  reason?: string;
  timestamp: string;
}

/**
 * Permission check result
 */
export interface PermissionCheckResult {
  allowed: boolean;
  role: string;
  missingPermissions: Permission[];
  reason?: string;
}
```

---

### FILE: src/lib/rbac/permissions.ts

```typescript
// ============================================================================
// DEFAULT ROLE DEFINITIONS AND PERMISSION MATRIX
// ============================================================================

import { Permission, RoleDefinition, SystemRole, Resource, Action } from '@/types/rbac';

// ------------------------------------------------------------------
// All possible permissions
// ------------------------------------------------------------------
const ALL_RESOURCES: Resource[] = [
  'donations', 'users', 'projects', 'partners', 'events', 'content',
  'reports', 'analytics', 'settings', 'roles', 'subscriptions', 'refunds',
  'disputes', 'webhooks', 'audit_logs', 'gdpr', 'tribe', 'bottles',
  'social', 'messaging', 'support',
];

const ALL_ACTIONS: Action[] = ['create', 'read', 'update', 'delete', 'export', 'approve', 'manage'];

/**
 * Generate all possible permissions
 */
export function getAllPermissions(): Permission[] {
  const perms: Permission[] = [];
  for (const resource of ALL_RESOURCES) {
    for (const action of ALL_ACTIONS) {
      perms.push(`${resource}:${action}`);
    }
  }
  return perms;
}

/**
 * Get all resources
 */
export function getAllResources(): Resource[] {
  return [...ALL_RESOURCES];
}

/**
 * Get all actions
 */
export function getAllActions(): Action[] {
  return [...ALL_ACTIONS];
}

// ------------------------------------------------------------------
// Default system roles
// ------------------------------------------------------------------
export const DEFAULT_ROLES: Record<SystemRole, Omit<RoleDefinition, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>> = {
  super_admin: {
    name: 'Super Administrator',
    slug: 'super_admin',
    description: 'Full platform access. Can manage all settings, users, roles, and data. Only assigned to platform founders.',
    permissions: getAllPermissions(), // All permissions
    isSystem: true,
    isCustom: false,
    priority: 100,
    metadata: { color: '#dc2626', icon: '🛡️' },
  },

  admin: {
    name: 'Administrator',
    slug: 'admin',
    description: 'Platform administrator with access to most management functions. Cannot modify system roles or critical settings.',
    permissions: [
      // Full access to operational resources
      ...(['donations', 'users', 'projects', 'partners', 'events', 'content',
           'reports', 'analytics', 'subscriptions', 'refunds', 'disputes',
           'tribe', 'bottles', 'social', 'messaging', 'support'] as Resource[])
        .flatMap(r => ALL_ACTIONS.map(a => `${r}:${a}` as Permission)),
      // Limited settings and roles
      'settings:read', 'settings:update',
      'roles:read',
      'audit_logs:read',
      'gdpr:read', 'gdpr:export',
      'webhooks:read', 'webhooks:update',
    ],
    isSystem: true,
    isCustom: false,
    priority: 90,
    metadata: { color: '#7c3aed', icon: '👑' },
  },

  moderator: {
    name: 'Moderator',
    slug: 'moderator',
    description: 'Content moderation and community management. Can review user content, manage support tickets, and moderate social features.',
    permissions: [
      'content:read', 'content:update', 'content:approve',
      'social:read', 'social:update', 'social:delete', 'social:approve',
      'support:read', 'support:update', 'support:create',
      'messaging:read', 'messaging:update',
      'users:read',
      'events:read',
      'reports:read',
      'tribe:read',
    ],
    isSystem: true,
    isCustom: false,
    priority: 60,
    metadata: { color: '#2563eb', icon: '🔧' },
  },

  partner_admin: {
    name: 'Partner Administrator',
    slug: 'partner_admin',
    description: 'NGO partner organization administrator. Full access to their own partner dashboard, projects, and payouts.',
    permissions: [
      'projects:create', 'projects:read', 'projects:update',
      'events:create', 'events:read', 'events:update',
      'content:create', 'content:read', 'content:update',
      'reports:read', 'reports:export',
      'analytics:read',
      'donations:read',
      'users:read',
      'partners:read', 'partners:update',
      'support:create', 'support:read',
    ],
    isSystem: true,
    isCustom: false,
    priority: 50,
    metadata: { color: '#059669', icon: '🏢' },
  },

  partner_user: {
    name: 'Partner Team Member',
    slug: 'partner_user',
    description: 'NGO partner team member with read access to partner dashboard and limited editing capabilities.',
    permissions: [
      'projects:read',
      'events:read',
      'content:read', 'content:create',
      'reports:read',
      'analytics:read',
      'donations:read',
      'partners:read',
      'support:create', 'support:read',
    ],
    isSystem: true,
    isCustom: false,
    inheritsFrom: undefined,
    priority: 40,
    metadata: { color: '#10b981', icon: '👤' },
  },

  tribe_leader: {
    name: 'TRIBE Leader',
    slug: 'tribe_leader',
    description: 'Community leader within the TRIBE membership program. Can organize events, create content, and manage community features.',
    permissions: [
      'events:create', 'events:read', 'events:update',
      'content:create', 'content:read',
      'social:create', 'social:read', 'social:update',
      'messaging:create', 'messaging:read',
      'tribe:read', 'tribe:update',
      'reports:read',
      'support:create', 'support:read',
    ],
    isSystem: true,
    isCustom: false,
    priority: 35,
    metadata: { color: '#f59e0b', icon: '⭐' },
  },

  member: {
    name: 'Member',
    slug: 'member',
    description: 'Registered platform member. Can donate, join events, participate in social features, and access TRIBE content.',
    permissions: [
      'donations:create', 'donations:read',
      'events:read',
      'content:read',
      'social:create', 'social:read',
      'messaging:create', 'messaging:read',
      'tribe:read',
      'bottles:read',
      'reports:read',
      'support:create', 'support:read',
      'subscriptions:create', 'subscriptions:read', 'subscriptions:update',
    ],
    isSystem: true,
    isCustom: false,
    priority: 20,
    metadata: { color: '#6b7280', icon: '🙂' },
  },

  guest: {
    name: 'Guest',
    slug: 'guest',
    description: 'Unauthenticated visitor. Read-only access to public content, events, and project listings.',
    permissions: [
      'content:read',
      'events:read',
      'projects:read',
      'bottles:read',
      'partners:read',
    ],
    isSystem: true,
    isCustom: false,
    priority: 0,
    metadata: { color: '#d1d5db', icon: '👁️' },
  },
};

/**
 * Group permissions by resource for display
 */
export function groupPermissionsByResource(permissions: Permission[]): Record<string, Action[]> {
  const grouped: Record<string, Action[]> = {};
  for (const perm of permissions) {
    const [resource, action] = perm.split(':') as [Resource, Action];
    if (!grouped[resource]) grouped[resource] = [];
    grouped[resource].push(action);
  }
  return grouped;
}

/**
 * Check if a permission set includes a specific permission
 */
export function hasPermission(permissions: Permission[], required: Permission): boolean {
  return permissions.includes(required);
}

/**
 * Check if a permission set includes ALL of the required permissions
 */
export function hasAllPermissions(permissions: Permission[], required: Permission[]): boolean {
  return required.every(p => permissions.includes(p));
}

/**
 * Check if a permission set includes ANY of the required permissions
 */
export function hasAnyPermission(permissions: Permission[], required: Permission[]): boolean {
  return required.some(p => permissions.includes(p));
}

/**
 * Get missing permissions from a required set
 */
export function getMissingPermissions(permissions: Permission[], required: Permission[]): Permission[] {
  return required.filter(p => !permissions.includes(p));
}
```

---

### FILE: src/lib/rbac/service.ts

```typescript
// ============================================================================
// RBAC SERVICE - ROLE & PERMISSION MANAGEMENT
// ============================================================================

import { db, adminAuth } from '@/lib/firebase/admin';
import {
  RoleDefinition, UserRole, Permission, PermissionCheckResult,
  RoleChangeLog, SystemRole,
} from '@/types/rbac';
import { DEFAULT_ROLES, hasPermission, getMissingPermissions } from './permissions';

export class RBACService {
  // ------------------------------------------------------------------
  // Role CRUD
  // ------------------------------------------------------------------

  /**
   * Initialize default system roles (run once during setup)
   */
  static async initializeDefaultRoles(): Promise<void> {
    const batch = db.batch();

    for (const [slug, roleDef] of Object.entries(DEFAULT_ROLES)) {
      const roleId = `role_${slug}`;
      const docRef = db.collection('roles').doc(roleId);
      const existing = await docRef.get();

      if (!existing.exists) {
        batch.set(docRef, {
          ...roleDef,
          id: roleId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'system',
        });
      }
    }

    await batch.commit();
    console.log('[RBAC] Default roles initialized');
  }

  /**
   * Get all roles
   */
  static async getAllRoles(): Promise<RoleDefinition[]> {
    const snapshot = await db.collection('roles')
      .orderBy('priority', 'desc')
      .get();
    return snapshot.docs.map(doc => doc.data() as RoleDefinition);
  }

  /**
   * Get a role by ID
   */
  static async getRole(roleId: string): Promise<RoleDefinition | null> {
    const doc = await db.collection('roles').doc(roleId).get();
    return doc.exists ? (doc.data() as RoleDefinition) : null;
  }

  /**
   * Get a role by slug
   */
  static async getRoleBySlug(slug: string): Promise<RoleDefinition | null> {
    const snapshot = await db.collection('roles')
      .where('slug', '==', slug)
      .limit(1)
      .get();
    return snapshot.empty ? null : (snapshot.docs[0].data() as RoleDefinition);
  }

  /**
   * Create a custom role
   */
  static async createRole(params: {
    name: string;
    slug: string;
    description: string;
    permissions: Permission[];
    inheritsFrom?: string;
    maxUsers?: number;
    color?: string;
    icon?: string;
    createdBy: string;
  }): Promise<RoleDefinition> {
    // Check slug uniqueness
    const existing = await this.getRoleBySlug(params.slug);
    if (existing) {
      throw new Error(`Role with slug "${params.slug}" already exists`);
    }

    // Resolve inherited permissions
    let allPermissions = [...params.permissions];
    if (params.inheritsFrom) {
      const parentRole = await this.getRole(params.inheritsFrom);
      if (parentRole) {
        allPermissions = [...new Set([...parentRole.permissions, ...params.permissions])];
      }
    }

    const roleId = `role_custom_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const role: RoleDefinition = {
      id: roleId,
      name: params.name,
      slug: params.slug,
      description: params.description,
      permissions: allPermissions,
      isSystem: false,
      isCustom: true,
      inheritsFrom: params.inheritsFrom,
      maxUsers: params.maxUsers,
      priority: 30, // Custom roles default to priority between partner_user and tribe_leader
      metadata: {
        color: params.color || '#8b5cf6',
        icon: params.icon || '🔑',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: params.createdBy,
    };

    await db.collection('roles').doc(roleId).set(role);
    return role;
  }

  /**
   * Update a custom role
   */
  static async updateRole(roleId: string, updates: Partial<Pick<
    RoleDefinition, 'name' | 'description' | 'permissions' | 'maxUsers' | 'metadata'
  >>): Promise<RoleDefinition> {
    const role = await this.getRole(roleId);
    if (!role) throw new Error('Role not found');
    if (role.isSystem) throw new Error('Cannot modify system roles');

    const updatedRole = {
      ...role,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await db.collection('roles').doc(roleId).update(updatedRole);
    return updatedRole;
  }

  /**
   * Delete a custom role
   */
  static async deleteRole(roleId: string): Promise<void> {
    const role = await this.getRole(roleId);
    if (!role) throw new Error('Role not found');
    if (role.isSystem) throw new Error('Cannot delete system roles');

    // Check if any users have this role
    const usersWithRole = await db.collection('user_roles')
      .where('roleId', '==', roleId)
      .limit(1)
      .get();

    if (!usersWithRole.empty) {
      throw new Error('Cannot delete role that is assigned to users. Reassign users first.');
    }

    await db.collection('roles').doc(roleId).delete();
  }

  // ------------------------------------------------------------------
  // User role assignment
  // ------------------------------------------------------------------

  /**
   * Assign a role to a user
   */
  static async assignRole(params: {
    userId: string;
    roleId: string;
    assignedBy: string;
    reason?: string;
    expiresAt?: string;
    scope?: UserRole['scope'];
  }): Promise<UserRole> {
    const role = await this.getRole(params.roleId);
    if (!role) throw new Error('Role not found');

    // Check max users limit
    if (role.maxUsers) {
      const currentCount = await db.collection('user_roles')
        .where('roleId', '==', params.roleId)
        .count()
        .get();
      if (currentCount.data().count >= role.maxUsers) {
        throw new Error(`Role "${role.name}" has reached its maximum user limit (${role.maxUsers})`);
      }
    }

    // Get current role for audit log
    const currentRole = await this.getUserRole(params.userId);

    // Remove previous role assignment (for same scope)
    if (currentRole) {
      await db.collection('user_roles')
        .where('userId', '==', params.userId)
        .where('scope.type', '==', params.scope?.type || 'global')
        .get()
        .then(snap => {
          const batch = db.batch();
          snap.docs.forEach(doc => batch.delete(doc.ref));
          return batch.commit();
        });
    }

    // Create new assignment
    const assignment: UserRole = {
      userId: params.userId,
      roleId: params.roleId,
      roleName: role.name,
      assignedAt: new Date().toISOString(),
      assignedBy: params.assignedBy,
      expiresAt: params.expiresAt,
      scope: params.scope || { type: 'global' },
    };

    await db.collection('user_roles').add(assignment);

    // Update Firebase Auth custom claims
    await adminAuth.setCustomUserClaims(params.userId, {
      role: role.slug,
      roleId: role.id,
      permissions: role.permissions,
    });

    // Update user document
    await db.collection('users').doc(params.userId).update({
      role: role.slug,
      roleId: role.id,
      updatedAt: new Date().toISOString(),
    });

    // Audit log
    const logEntry: RoleChangeLog = {
      id: `rcl_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      userId: params.userId,
      previousRoleId: currentRole?.roleId || null,
      newRoleId: params.roleId,
      changedBy: params.assignedBy,
      reason: params.reason,
      timestamp: new Date().toISOString(),
    };
    await db.collection('role_change_logs').add(logEntry);

    return assignment;
  }

  /**
   * Get a user's current role
   */
  static async getUserRole(userId: string, scope?: string): Promise<UserRole | null> {
    let query: FirebaseFirestore.Query = db.collection('user_roles')
      .where('userId', '==', userId);

    if (scope) {
      query = query.where('scope.type', '==', scope);
    } else {
      query = query.where('scope.type', '==', 'global');
    }

    const snapshot = await query.limit(1).get();
    if (snapshot.empty) return null;

    const userRole = snapshot.docs[0].data() as UserRole;

    // Check expiry
    if (userRole.expiresAt && new Date(userRole.expiresAt) < new Date()) {
      // Role expired — remove it
      await snapshot.docs[0].ref.delete();
      return null;
    }

    return userRole;
  }

  /**
   * Get all roles for a user (across different scopes)
   */
  static async getUserRoles(userId: string): Promise<UserRole[]> {
    const snapshot = await db.collection('user_roles')
      .where('userId', '==', userId)
      .get();

    const roles: UserRole[] = [];
    for (const doc of snapshot.docs) {
      const role = doc.data() as UserRole;
      // Filter out expired
      if (role.expiresAt && new Date(role.expiresAt) < new Date()) {
        await doc.ref.delete();
        continue;
      }
      roles.push(role);
    }
    return roles;
  }

  /**
   * Get all users with a specific role
   */
  static async getUsersWithRole(roleId: string, limit = 50, offset = 0): Promise<{
    users: UserRole[];
    total: number;
  }> {
    const countSnap = await db.collection('user_roles')
      .where('roleId', '==', roleId)
      .count()
      .get();

    let query: FirebaseFirestore.Query = db.collection('user_roles')
      .where('roleId', '==', roleId)
      .orderBy('assignedAt', 'desc');

    if (offset > 0) query = query.offset(offset);
    query = query.limit(limit);

    const snapshot = await query.get();
    return {
      users: snapshot.docs.map(doc => doc.data() as UserRole),
      total: countSnap.data().count,
    };
  }

  // ------------------------------------------------------------------
  // Permission checking
  // ------------------------------------------------------------------

  /**
   * Check if a user has a specific permission
   */
  static async checkPermission(
    userId: string,
    permission: Permission,
    scope?: string
  ): Promise<PermissionCheckResult> {
    const userRole = await this.getUserRole(userId, scope);

    if (!userRole) {
      // No role assigned — use guest permissions
      const guestRole = await this.getRoleBySlug('guest');
      if (guestRole && hasPermission(guestRole.permissions, permission)) {
        return { allowed: true, role: 'guest', missingPermissions: [] };
      }
      return {
        allowed: false,
        role: 'none',
        missingPermissions: [permission],
        reason: 'No role assigned to user',
      };
    }

    const role = await this.getRole(userRole.roleId);
    if (!role) {
      return {
        allowed: false,
        role: userRole.roleName,
        missingPermissions: [permission],
        reason: 'Role definition not found',
      };
    }

    if (hasPermission(role.permissions, permission)) {
      return { allowed: true, role: role.slug, missingPermissions: [] };
    }

    return {
      allowed: false,
      role: role.slug,
      missingPermissions: [permission],
      reason: `Role "${role.name}" does not have permission "${permission}"`,
    };
  }

  /**
   * Check multiple permissions at once
   */
  static async checkPermissions(
    userId: string,
    permissions: Permission[],
    requireAll = true
  ): Promise<PermissionCheckResult> {
    const userRole = await this.getUserRole(userId);
    const role = userRole ? await this.getRole(userRole.roleId) : null;
    const rolePermissions = role?.permissions || [];

    const missing = getMissingPermissions(rolePermissions, permissions);

    if (requireAll) {
      return {
        allowed: missing.length === 0,
        role: role?.slug || 'none',
        missingPermissions: missing,
        reason: missing.length > 0
          ? `Missing permissions: ${missing.join(', ')}`
          : undefined,
      };
    }

    // requireAny mode
    const hasAny = permissions.some(p => rolePermissions.includes(p));
    return {
      allowed: hasAny,
      role: role?.slug || 'none',
      missingPermissions: hasAny ? [] : missing,
      reason: !hasAny ? 'No matching permissions found' : undefined,
    };
  }

  // ------------------------------------------------------------------
  // Role change audit history
  // ------------------------------------------------------------------

  /**
   * Get role change history for a user
   */
  static async getRoleHistory(userId: string, limit = 20): Promise<RoleChangeLog[]> {
    const snapshot = await db.collection('role_change_logs')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
    return snapshot.docs.map(doc => doc.data() as RoleChangeLog);
  }

  /**
   * Get all recent role changes (for admin overview)
   */
  static async getRecentRoleChanges(limit = 50): Promise<RoleChangeLog[]> {
    const snapshot = await db.collection('role_change_logs')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
    return snapshot.docs.map(doc => doc.data() as RoleChangeLog);
  }
}
```


---

### FILE: src/lib/rbac/middleware.ts

```typescript
// ============================================================================
// RBAC MIDDLEWARE — ROUTE & API PROTECTION
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { RBACService } from './service';
import { Permission } from '@/types/rbac';

/**
 * Extract and verify user from request
 */
async function extractUser(req: NextRequest): Promise<{
  uid: string;
  role?: string;
  permissions?: Permission[];
} | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  try {
    const token = authHeader.substring(7);
    const decoded = await adminAuth.verifyIdToken(token);
    return {
      uid: decoded.uid,
      role: decoded.role as string | undefined,
      permissions: decoded.permissions as Permission[] | undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Require authentication — returns user ID or 401
 */
export async function requireAuth(req: NextRequest): Promise<string> {
  const user = await extractUser(req);
  if (!user) {
    throw new AuthError('Authentication required', 401);
  }
  return user.uid;
}

/**
 * Require specific role — returns user ID or 403
 */
export async function requireRole(
  req: NextRequest,
  allowedRoles: string[]
): Promise<string> {
  const user = await extractUser(req);
  if (!user) {
    throw new AuthError('Authentication required', 401);
  }

  // Check cached role from JWT claims first (fast path)
  if (user.role && allowedRoles.includes(user.role)) {
    return user.uid;
  }

  // Fall back to DB check (handles claim propagation delay)
  const userRole = await RBACService.getUserRole(user.uid);
  if (!userRole) {
    throw new AuthError('No role assigned', 403);
  }

  // Get role definition to check slug
  const roleDef = await RBACService.getRole(userRole.roleId);
  if (!roleDef || !allowedRoles.includes(roleDef.slug)) {
    throw new AuthError(
      `Access denied. Required roles: ${allowedRoles.join(', ')}. Your role: ${roleDef?.slug || 'unknown'}`,
      403
    );
  }

  return user.uid;
}

/**
 * Require specific permissions — returns user ID or 403
 */
export async function requirePermission(
  req: NextRequest,
  ...permissions: Permission[]
): Promise<string> {
  const user = await extractUser(req);
  if (!user) {
    throw new AuthError('Authentication required', 401);
  }

  // Fast path: check JWT claims
  if (user.permissions) {
    const hasAll = permissions.every(p => user.permissions!.includes(p));
    if (hasAll) return user.uid;
  }

  // Slow path: check DB
  const result = await RBACService.checkPermissions(user.uid, permissions, true);
  if (!result.allowed) {
    throw new AuthError(
      `Permission denied. Missing: ${result.missingPermissions.join(', ')}`,
      403
    );
  }

  return user.uid;
}

/**
 * Require any of the specified permissions
 */
export async function requireAnyPermission(
  req: NextRequest,
  ...permissions: Permission[]
): Promise<string> {
  const user = await extractUser(req);
  if (!user) {
    throw new AuthError('Authentication required', 401);
  }

  // Fast path
  if (user.permissions) {
    const hasAny = permissions.some(p => user.permissions!.includes(p));
    if (hasAny) return user.uid;
  }

  // Slow path
  const result = await RBACService.checkPermissions(user.uid, permissions, false);
  if (!result.allowed) {
    throw new AuthError(`Permission denied. Requires one of: ${permissions.join(', ')}`, 403);
  }

  return user.uid;
}

/**
 * Custom auth error with status code
 */
export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

/**
 * Handle auth errors in API routes
 */
export function handleAuthError(err: unknown): NextResponse {
  if (err instanceof AuthError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error('[RBAC] Unexpected error:', err);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

/**
 * Middleware wrapper for protected API routes
 *
 * Usage:
 * export const GET = withPermission('analytics:read', async (req, userId) => {
 *   // userId is verified and authorized
 *   return NextResponse.json({ data: '...' });
 * });
 */
export function withPermission(
  permission: Permission,
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const userId = await requirePermission(req, permission);
      return await handler(req, userId);
    } catch (err) {
      return handleAuthError(err);
    }
  };
}

/**
 * Middleware wrapper requiring specific roles
 */
export function withRole(
  roles: string[],
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const userId = await requireRole(req, roles);
      return await handler(req, userId);
    } catch (err) {
      return handleAuthError(err);
    }
  };
}

/**
 * Middleware wrapper requiring authentication only
 */
export function withAuth(
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const userId = await requireAuth(req);
      return await handler(req, userId);
    } catch (err) {
      return handleAuthError(err);
    }
  };
}
```

---

### FILE: src/components/shared/PermissionGate.tsx

```tsx
// ============================================================================
// CLIENT-SIDE PERMISSION GATE COMPONENT
// ============================================================================
//
// Usage:
//   <PermissionGate permissions={['analytics:read']}>
//     <AnalyticsDashboard />
//   </PermissionGate>
//
//   <PermissionGate roles={['admin', 'super_admin']} fallback={<AccessDenied />}>
//     <AdminPanel />
//   </PermissionGate>
//

'use client';

import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

// ------------------------------------------------------------------
// Permission context
// ------------------------------------------------------------------
interface PermissionContextValue {
  role: string | null;
  permissions: string[];
  loading: boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasRole: (roles: string[]) => boolean;
}

const PermissionContext = createContext<PermissionContextValue>({
  role: null,
  permissions: [],
  loading: true,
  hasPermission: () => false,
  hasAnyPermission: () => false,
  hasAllPermissions: () => false,
  hasRole: () => false,
});

export function usePermissions() {
  return useContext(PermissionContext);
}

// ------------------------------------------------------------------
// Provider
// ------------------------------------------------------------------
export function PermissionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPermissions() {
      if (!user) {
        setRole('guest');
        setPermissions([]);
        setLoading(false);
        return;
      }

      try {
        // Get token claims which include role & permissions
        const tokenResult = await user.getIdTokenResult(true);
        const claims = tokenResult.claims;

        setRole((claims.role as string) || 'member');
        setPermissions((claims.permissions as string[]) || []);
      } catch (err) {
        console.error('Error loading permissions:', err);
        setRole('member');
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    }

    loadPermissions();
  }, [user]);

  const value: PermissionContextValue = {
    role,
    permissions,
    loading,
    hasPermission: (perm) => permissions.includes(perm),
    hasAnyPermission: (perms) => perms.some(p => permissions.includes(p)),
    hasAllPermissions: (perms) => perms.every(p => permissions.includes(p)),
    hasRole: (roles) => role !== null && roles.includes(role),
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

// ------------------------------------------------------------------
// Gate component
// ------------------------------------------------------------------
interface PermissionGateProps {
  children: ReactNode;
  permissions?: string[];
  roles?: string[];
  requireAll?: boolean;       // For permissions: require ALL (default) or ANY
  fallback?: ReactNode;       // What to show when access denied
  loading?: ReactNode;        // What to show while checking
  hideWhenDenied?: boolean;   // If true, render nothing when denied (no fallback)
}

export default function PermissionGate({
  children,
  permissions: requiredPerms,
  roles: requiredRoles,
  requireAll = true,
  fallback,
  loading: loadingElement,
  hideWhenDenied = false,
}: PermissionGateProps) {
  const { loading, hasPermission, hasAnyPermission, hasAllPermissions, hasRole } = usePermissions();

  if (loading) {
    return <>{loadingElement || null}</>;
  }

  let allowed = true;

  // Check role requirement
  if (requiredRoles && requiredRoles.length > 0) {
    if (!hasRole(requiredRoles)) {
      allowed = false;
    }
  }

  // Check permission requirement
  if (allowed && requiredPerms && requiredPerms.length > 0) {
    if (requireAll) {
      allowed = hasAllPermissions(requiredPerms);
    } else {
      allowed = hasAnyPermission(requiredPerms);
    }
  }

  if (!allowed) {
    if (hideWhenDenied) return null;
    return <>{fallback || <DefaultAccessDenied />}</>;
  }

  return <>{children}</>;
}

// ------------------------------------------------------------------
// Default access denied
// ------------------------------------------------------------------
function DefaultAccessDenied() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 60, textAlign: 'center',
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Access Denied</h2>
      <p style={{ color: '#6b7280', marginTop: 8, maxWidth: 400 }}>
        You don&apos;t have permission to view this content. Contact your administrator
        if you believe this is an error.
      </p>
    </div>
  );
}

// ------------------------------------------------------------------
// Inline permission check hook
// ------------------------------------------------------------------
/**
 * Hook for inline permission checks
 *
 * Usage:
 *   const canEdit = useHasPermission('content:update');
 *   const isAdmin = useHasRole(['admin', 'super_admin']);
 */
export function useHasPermission(permission: string): boolean {
  const { hasPermission, loading } = usePermissions();
  if (loading) return false;
  return hasPermission(permission);
}

export function useHasRole(roles: string[]): boolean {
  const { hasRole, loading } = usePermissions();
  if (loading) return false;
  return hasRole(roles);
}
```

---

### FILE: src/components/admin/RoleManager.tsx

```tsx
// ============================================================================
// ADMIN ROLE MANAGEMENT DASHBOARD
// ============================================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface RoleDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  isCustom: boolean;
  priority: number;
  metadata: { color: string; icon: string };
  createdAt: string;
}

interface UserWithRole {
  userId: string;
  email: string;
  displayName: string;
  roleId: string;
  roleName: string;
  assignedAt: string;
}

type ActiveView = 'roles' | 'users' | 'create-role';

const ALL_RESOURCES = [
  'donations', 'users', 'projects', 'partners', 'events', 'content',
  'reports', 'analytics', 'settings', 'roles', 'subscriptions', 'refunds',
  'disputes', 'webhooks', 'audit_logs', 'gdpr', 'tribe', 'bottles',
  'social', 'messaging', 'support',
];

const ALL_ACTIONS = ['create', 'read', 'update', 'delete', 'export', 'approve', 'manage'];

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export default function RoleManager() {
  const { user } = useAuth();

  const [activeView, setActiveView] = useState<ActiveView>('roles');
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<RoleDefinition | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Create role form
  const [newRole, setNewRole] = useState({
    name: '',
    slug: '',
    description: '',
    permissions: [] as string[],
    color: '#8b5cf6',
    icon: '🔑',
  });

  // User assignment
  const [userEmail, setUserEmail] = useState('');
  const [assignRoleId, setAssignRoleId] = useState('');
  const [assignReason, setAssignReason] = useState('');

  // ------------------------------------------------------------------
  // Data loading
  // ------------------------------------------------------------------
  const fetchRoles = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/roles');
      if (!res.ok) throw new Error('Failed to load roles');
      const data = await res.json();
      setRoles(data.roles);
    } catch (err) {
      console.error('Error loading roles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------
  const createRole = async () => {
    if (!newRole.name || !newRole.slug) {
      setToast({ message: 'Name and slug are required', type: 'error' });
      return;
    }

    try {
      const res = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRole),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }

      setToast({ message: `Role "${newRole.name}" created successfully`, type: 'success' });
      setNewRole({ name: '', slug: '', description: '', permissions: [], color: '#8b5cf6', icon: '🔑' });
      setActiveView('roles');
      fetchRoles();
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const deleteRole = async (roleId: string) => {
    if (!confirm('Delete this custom role? Users with this role will need to be reassigned.')) return;

    try {
      const res = await fetch(`/api/admin/roles/${roleId}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      setToast({ message: 'Role deleted', type: 'success' });
      fetchRoles();
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const assignUserRole = async () => {
    if (!userEmail || !assignRoleId) {
      setToast({ message: 'Email and role are required', type: 'error' });
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/by-email/role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          roleId: assignRoleId,
          reason: assignReason,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }

      setToast({ message: `Role assigned to ${userEmail}`, type: 'success' });
      setUserEmail('');
      setAssignRoleId('');
      setAssignReason('');
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const togglePermission = (perm: string) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  const toggleResourceAll = (resource: string) => {
    const resourcePerms = ALL_ACTIONS.map(a => `${resource}:${a}`);
    const allSelected = resourcePerms.every(p => newRole.permissions.includes(p));

    setNewRole(prev => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter(p => !resourcePerms.includes(p))
        : [...new Set([...prev.permissions, ...resourcePerms])],
    }));
  };

  // ------------------------------------------------------------------
  // Render helpers
  // ------------------------------------------------------------------
  const roleBadge = (role: RoleDefinition) => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
      backgroundColor: `${role.metadata.color}20`,
      color: role.metadata.color,
      border: `1px solid ${role.metadata.color}40`,
    }}>
      {role.metadata.icon} {role.name}
    </span>
  );

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <div style={{
          width: 40, height: 40, border: '3px solid #e5e7eb',
          borderTopColor: '#2563eb', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      {/* Toast */}
      {toast && (
        <div
          onClick={() => setToast(null)}
          style={{
            position: 'fixed', top: 20, right: 20, zIndex: 1000,
            padding: '12px 20px', borderRadius: 8, cursor: 'pointer',
            backgroundColor: toast.type === 'success' ? '#22c55e' : '#ef4444',
            color: '#fff', fontWeight: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Role Management</h1>
          <p style={{ color: '#6b7280', marginTop: 4 }}>Manage roles, permissions, and user access</p>
        </div>
        <button
          onClick={() => setActiveView('create-role')}
          style={{
            padding: '10px 20px', borderRadius: 8, border: 'none',
            backgroundColor: '#2563eb', color: '#fff', fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Create Custom Role
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 24, borderBottom: '2px solid #e5e7eb' }}>
        {([
          { key: 'roles', label: `Roles (${roles.length})` },
          { key: 'users', label: 'Assign Roles' },
          { key: 'create-role', label: 'Create Role' },
        ] as { key: ActiveView; label: string }[]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveView(tab.key)}
            style={{
              padding: '10px 20px', border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 14,
              backgroundColor: activeView === tab.key ? '#fff' : 'transparent',
              color: activeView === tab.key ? '#2563eb' : '#6b7280',
              borderBottom: activeView === tab.key ? '2px solid #2563eb' : '2px solid transparent',
              marginBottom: -2,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* View: Roles List */}
      {activeView === 'roles' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {roles.map(role => (
            <div key={role.id} style={{
              padding: 20, borderRadius: 12, border: '1px solid #e5e7eb',
              backgroundColor: '#fff',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    {roleBadge(role)}
                    {role.isSystem && (
                      <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>SYSTEM</span>
                    )}
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>Priority: {role.priority}</span>
                  </div>
                  <p style={{ margin: '6px 0 0', fontSize: 13, color: '#6b7280', maxWidth: 600 }}>
                    {role.description}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setSelectedRole(selectedRole?.id === role.id ? null : role)}
                    style={{
                      padding: '6px 12px', borderRadius: 6, border: '1px solid #e5e7eb',
                      backgroundColor: '#fff', fontSize: 12, cursor: 'pointer',
                    }}
                  >
                    {selectedRole?.id === role.id ? 'Hide' : 'View'} Permissions
                  </button>
                  {role.isCustom && (
                    <button
                      onClick={() => deleteRole(role.id)}
                      style={{
                        padding: '6px 12px', borderRadius: 6, border: '1px solid #fecaca',
                        backgroundColor: '#fff', color: '#ef4444', fontSize: 12, cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded permissions */}
              {selectedRole?.id === role.id && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f3f4f6' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                    Permissions ({role.permissions.length})
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {role.permissions.sort().map(perm => (
                      <span key={perm} style={{
                        padding: '2px 8px', borderRadius: 4, fontSize: 11,
                        backgroundColor: '#f3f4f6', color: '#374151',
                        fontFamily: 'monospace',
                      }}>
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* View: Assign Roles */}
      {activeView === 'users' && (
        <div style={{ maxWidth: 600 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Assign Role to User</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                User Email
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                placeholder="user@example.com"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8,
                  border: '1px solid #d1d5db', fontSize: 14,
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                Role
              </label>
              <select
                value={assignRoleId}
                onChange={e => setAssignRoleId(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8,
                  border: '1px solid #d1d5db', fontSize: 14,
                }}
              >
                <option value="">Select a role...</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.metadata.icon} {role.name} (Priority {role.priority})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                Reason (optional)
              </label>
              <input
                type="text"
                value={assignReason}
                onChange={e => setAssignReason(e.target.value)}
                placeholder="Promoted to moderator..."
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8,
                  border: '1px solid #d1d5db', fontSize: 14,
                }}
              />
            </div>

            <button
              onClick={assignUserRole}
              style={{
                padding: '12px 24px', borderRadius: 8, border: 'none',
                backgroundColor: '#2563eb', color: '#fff', fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Assign Role
            </button>
          </div>
        </div>
      )}

      {/* View: Create Custom Role */}
      {activeView === 'create-role' && (
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Create Custom Role</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                Role Name
              </label>
              <input
                type="text"
                value={newRole.name}
                onChange={e => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Finance Manager"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8,
                  border: '1px solid #d1d5db', fontSize: 14,
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                Slug (unique identifier)
              </label>
              <input
                type="text"
                value={newRole.slug}
                onChange={e => setNewRole(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '_') }))}
                placeholder="finance_manager"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8,
                  border: '1px solid #d1d5db', fontSize: 14, fontFamily: 'monospace',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
              Description
            </label>
            <textarea
              value={newRole.description}
              onChange={e => setNewRole(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8,
                border: '1px solid #d1d5db', fontSize: 14, resize: 'vertical',
              }}
            />
          </div>

          {/* Permission matrix */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
              Permissions ({newRole.permissions.length} selected)
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>Resource</th>
                    {ALL_ACTIONS.map(action => (
                      <th key={action} style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 600, textTransform: 'capitalize' }}>
                        {action}
                      </th>
                    ))}
                    <th style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 600 }}>All</th>
                  </tr>
                </thead>
                <tbody>
                  {ALL_RESOURCES.map(resource => {
                    const resourcePerms = ALL_ACTIONS.map(a => `${resource}:${a}`);
                    const allChecked = resourcePerms.every(p => newRole.permissions.includes(p));

                    return (
                      <tr key={resource} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '6px 12px', fontWeight: 500, textTransform: 'capitalize' }}>
                          {resource.replace(/_/g, ' ')}
                        </td>
                        {ALL_ACTIONS.map(action => {
                          const perm = `${resource}:${action}`;
                          return (
                            <td key={action} style={{ padding: '6px', textAlign: 'center' }}>
                              <input
                                type="checkbox"
                                checked={newRole.permissions.includes(perm)}
                                onChange={() => togglePermission(perm)}
                                style={{ cursor: 'pointer', width: 16, height: 16 }}
                              />
                            </td>
                          );
                        })}
                        <td style={{ padding: '6px', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={allChecked}
                            onChange={() => toggleResourceAll(resource)}
                            style={{ cursor: 'pointer', width: 16, height: 16, accentColor: '#2563eb' }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={createRole}
            style={{
              padding: '12px 32px', borderRadius: 8, border: 'none',
              backgroundColor: '#2563eb', color: '#fff',
              fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}
          >
            Create Role
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
```


---

### FILE: src/app/api/admin/roles/route.ts

```typescript
// ============================================================================
// ADMIN ROLE MANAGEMENT API
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, handleAuthError } from '@/lib/rbac/middleware';
import { RBACService } from '@/lib/rbac/service';

/**
 * GET /api/admin/roles
 * List all roles
 */
export async function GET(req: NextRequest) {
  try {
    await requirePermission(req, 'roles:read');
    const roles = await RBACService.getAllRoles();
    return NextResponse.json({ roles });
  } catch (err) {
    return handleAuthError(err);
  }
}

/**
 * POST /api/admin/roles
 * Create a new custom role
 */
export async function POST(req: NextRequest) {
  try {
    const userId = await requirePermission(req, 'roles:manage');
    const body = await req.json();

    const { name, slug, description, permissions, inheritsFrom, maxUsers, color, icon } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'name and slug are required' }, { status: 400 });
    }

    // Validate slug format
    if (!/^[a-z][a-z0-9_]{2,30}$/.test(slug)) {
      return NextResponse.json(
        { error: 'Slug must be lowercase letters, numbers, underscores. 3-31 chars, start with letter.' },
        { status: 400 }
      );
    }

    const role = await RBACService.createRole({
      name,
      slug,
      description: description || '',
      permissions: permissions || [],
      inheritsFrom,
      maxUsers,
      color,
      icon,
      createdBy: userId,
    });

    return NextResponse.json({ role }, { status: 201 });
  } catch (err: any) {
    if (err.message?.includes('already exists')) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    return handleAuthError(err);
  }
}
```

---

### FILE: src/app/api/admin/roles/[id]/route.ts

```typescript
// ============================================================================
// ADMIN SINGLE ROLE API
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, handleAuthError } from '@/lib/rbac/middleware';
import { RBACService } from '@/lib/rbac/service';

/**
 * GET /api/admin/roles/:id
 * Get a single role by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requirePermission(req, 'roles:read');
    const role = await RBACService.getRole(params.id);

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Also get user count for this role
    const { total } = await RBACService.getUsersWithRole(params.id, 0, 0);

    return NextResponse.json({ role, userCount: total });
  } catch (err) {
    return handleAuthError(err);
  }
}

/**
 * PATCH /api/admin/roles/:id
 * Update a custom role
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requirePermission(req, 'roles:manage');
    const body = await req.json();

    const updatedRole = await RBACService.updateRole(params.id, {
      name: body.name,
      description: body.description,
      permissions: body.permissions,
      maxUsers: body.maxUsers,
      metadata: body.metadata,
    });

    return NextResponse.json({ role: updatedRole });
  } catch (err: any) {
    if (err.message?.includes('system roles')) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    return handleAuthError(err);
  }
}

/**
 * DELETE /api/admin/roles/:id
 * Delete a custom role
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requirePermission(req, 'roles:manage');
    await RBACService.deleteRole(params.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.message?.includes('system roles') || err.message?.includes('assigned to users')) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return handleAuthError(err);
  }
}
```

---

### FILE: src/app/api/admin/users/[id]/role/route.ts

```typescript
// ============================================================================
// USER ROLE ASSIGNMENT API
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, handleAuthError } from '@/lib/rbac/middleware';
import { RBACService } from '@/lib/rbac/service';
import { db, adminAuth } from '@/lib/firebase/admin';

/**
 * GET /api/admin/users/:id/role
 * Get user's current role assignment
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requirePermission(req, 'users:read');

    const roles = await RBACService.getUserRoles(params.id);
    const history = await RBACService.getRoleHistory(params.id, 10);

    return NextResponse.json({ roles, history });
  } catch (err) {
    return handleAuthError(err);
  }
}

/**
 * POST /api/admin/users/:id/role
 * Assign a role to a user
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminId = await requirePermission(req, 'roles:manage');
    const body = await req.json();

    const { roleId, reason, expiresAt, scope } = body;
    if (!roleId) {
      return NextResponse.json({ error: 'roleId is required' }, { status: 400 });
    }

    // If email-based lookup is needed
    let userId = params.id;
    if (params.id.includes('@')) {
      try {
        const userRecord = await adminAuth.getUserByEmail(params.id);
        userId = userRecord.uid;
      } catch {
        return NextResponse.json({ error: 'User not found with that email' }, { status: 404 });
      }
    }

    // Prevent self-demotion from super_admin
    if (userId === adminId) {
      const currentRole = await RBACService.getUserRole(userId);
      if (currentRole) {
        const currentRoleDef = await RBACService.getRole(currentRole.roleId);
        const newRoleDef = await RBACService.getRole(roleId);
        if (currentRoleDef?.slug === 'super_admin' && newRoleDef?.slug !== 'super_admin') {
          return NextResponse.json(
            { error: 'Cannot demote yourself from Super Administrator. Another super admin must do this.' },
            { status: 403 }
          );
        }
      }
    }

    const assignment = await RBACService.assignRole({
      userId,
      roleId,
      assignedBy: adminId,
      reason,
      expiresAt,
      scope,
    });

    return NextResponse.json({ assignment }, { status: 201 });
  } catch (err: any) {
    if (err.message?.includes('maximum user limit')) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    return handleAuthError(err);
  }
}
```



---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 48: AUDIT LOGGING & ACTIVITY TRACKING
# ═══════════════════════════════════════════════════════════════════════════════
#
# Comprehensive audit logging system that tracks all critical platform actions
# for compliance, debugging, and security monitoring. Supports structured logs,
# admin audit trail, user activity feeds, and log export for ANBI reporting.
#
# Files:
#   - src/types/audit.ts
#   - src/lib/audit/logger.ts
#   - src/lib/audit/query.ts
#   - src/lib/audit/retention.ts
#   - src/components/admin/AuditLogViewer.tsx
#   - src/components/shared/ActivityFeed.tsx
#   - src/app/api/admin/audit-logs/route.ts
#   - src/app/api/admin/audit-logs/export/route.ts
#   - src/app/api/user/activity/route.ts
# ═══════════════════════════════════════════════════════════════════════════════


### FILE: src/types/audit.ts

```typescript
// ============================================================================
// AUDIT LOG TYPE DEFINITIONS
// ============================================================================

/**
 * Categories of auditable events
 */
export type AuditCategory =
  | 'auth'
  | 'donation'
  | 'subscription'
  | 'refund'
  | 'user'
  | 'role'
  | 'partner'
  | 'project'
  | 'content'
  | 'event'
  | 'admin'
  | 'gdpr'
  | 'system'
  | 'security'
  | 'payment'
  | 'webhook';

/**
 * Severity levels for audit entries
 */
export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Core audit log entry
 */
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  category: AuditCategory;
  action: string;            // e.g., "user.login", "donation.created", "role.assigned"
  severity: AuditSeverity;
  actorId: string;           // Who performed the action (userId or "system")
  actorEmail?: string;
  actorRole?: string;
  targetType?: string;       // What entity was affected (e.g., "user", "donation")
  targetId?: string;         // ID of the affected entity
  description: string;       // Human-readable description
  metadata: Record<string, any>;  // Additional structured data
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;        // Correlate with request logs
  changes?: {
    field: string;
    previousValue: any;
    newValue: any;
  }[];
  result: 'success' | 'failure' | 'partial';
  errorMessage?: string;
}

/**
 * Audit log query filters
 */
export interface AuditQueryParams {
  category?: AuditCategory;
  action?: string;
  severity?: AuditSeverity;
  actorId?: string;
  targetType?: string;
  targetId?: string;
  startDate?: string;
  endDate?: string;
  result?: 'success' | 'failure';
  search?: string;
  limit?: number;
  offset?: number;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Audit log statistics
 */
export interface AuditStats {
  totalEntries: number;
  byCategory: Record<string, number>;
  bySeverity: Record<string, number>;
  byResult: Record<string, number>;
  recentFailures: number;
  recentCritical: number;
}

/**
 * User activity entry (simplified view for users)
 */
export interface UserActivity {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  icon: string;
  type: 'donation' | 'event' | 'social' | 'account' | 'tribe' | 'achievement';
}

/**
 * Retention policy definition
 */
export interface RetentionPolicy {
  category: AuditCategory;
  retentionDays: number;
  archiveBeforeDelete: boolean;
  description: string;
}
```

---

### FILE: src/lib/audit/logger.ts

```typescript
// ============================================================================
// AUDIT LOGGER — STRUCTURED EVENT LOGGING
// ============================================================================

import { db } from '@/lib/firebase/admin';
import { AuditLogEntry, AuditCategory, AuditSeverity } from '@/types/audit';

/**
 * Central audit logger for all platform events
 */
export class AuditLogger {
  /**
   * Log an audit event
   */
  static async log(params: {
    category: AuditCategory;
    action: string;
    severity?: AuditSeverity;
    actorId: string;
    actorEmail?: string;
    actorRole?: string;
    targetType?: string;
    targetId?: string;
    description: string;
    metadata?: Record<string, any>;
    changes?: AuditLogEntry['changes'];
    result?: AuditLogEntry['result'];
    errorMessage?: string;
    ipAddress?: string;
    userAgent?: string;
    requestId?: string;
  }): Promise<AuditLogEntry> {
    const entry: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
      timestamp: new Date().toISOString(),
      category: params.category,
      action: params.action,
      severity: params.severity || 'info',
      actorId: params.actorId,
      actorEmail: params.actorEmail,
      actorRole: params.actorRole,
      targetType: params.targetType,
      targetId: params.targetId,
      description: params.description,
      metadata: params.metadata || {},
      changes: params.changes,
      result: params.result || 'success',
      errorMessage: params.errorMessage,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      requestId: params.requestId,
    };

    // Write to Firestore
    await db.collection('audit_logs').doc(entry.id).set(entry);

    // If critical, also write to a separate alerts collection
    if (entry.severity === 'critical') {
      await db.collection('audit_alerts').add({
        auditLogId: entry.id,
        action: entry.action,
        description: entry.description,
        actorId: entry.actorId,
        acknowledged: false,
        createdAt: entry.timestamp,
      });
    }

    return entry;
  }

  // ------------------------------------------------------------------
  // Convenience methods for common audit events
  // ------------------------------------------------------------------

  /** Auth events */
  static async logLogin(userId: string, email: string, ip?: string, ua?: string) {
    return this.log({
      category: 'auth',
      action: 'auth.login',
      actorId: userId,
      actorEmail: email,
      description: `User ${email} logged in`,
      ipAddress: ip,
      userAgent: ua,
    });
  }

  static async logLogout(userId: string, email: string) {
    return this.log({
      category: 'auth',
      action: 'auth.logout',
      actorId: userId,
      actorEmail: email,
      description: `User ${email} logged out`,
    });
  }

  static async logLoginFailed(email: string, reason: string, ip?: string) {
    return this.log({
      category: 'auth',
      action: 'auth.login_failed',
      severity: 'warning',
      actorId: 'unknown',
      actorEmail: email,
      description: `Failed login attempt for ${email}: ${reason}`,
      result: 'failure',
      errorMessage: reason,
      ipAddress: ip,
    });
  }

  static async logPasswordReset(userId: string, email: string) {
    return this.log({
      category: 'auth',
      action: 'auth.password_reset',
      actorId: userId,
      actorEmail: email,
      description: `Password reset requested for ${email}`,
    });
  }

  /** Donation events */
  static async logDonation(params: {
    userId: string;
    email: string;
    donationId: string;
    amount: number;
    currency: string;
    projectId?: string;
  }) {
    return this.log({
      category: 'donation',
      action: 'donation.created',
      actorId: params.userId,
      actorEmail: params.email,
      targetType: 'donation',
      targetId: params.donationId,
      description: `Donation of €${(params.amount / 100).toFixed(2)} ${params.currency} received`,
      metadata: {
        amount: params.amount,
        currency: params.currency,
        projectId: params.projectId,
      },
    });
  }

  static async logRefund(params: {
    adminId: string;
    donationId: string;
    amount: number;
    reason: string;
  }) {
    return this.log({
      category: 'refund',
      action: 'refund.processed',
      severity: 'warning',
      actorId: params.adminId,
      targetType: 'donation',
      targetId: params.donationId,
      description: `Refund of €${(params.amount / 100).toFixed(2)} processed for donation ${params.donationId}`,
      metadata: { amount: params.amount, reason: params.reason },
    });
  }

  /** User management events */
  static async logUserCreated(userId: string, email: string, createdBy?: string) {
    return this.log({
      category: 'user',
      action: 'user.created',
      actorId: createdBy || userId,
      targetType: 'user',
      targetId: userId,
      description: `User account created for ${email}`,
      metadata: { email },
    });
  }

  static async logUserUpdated(params: {
    userId: string;
    updatedBy: string;
    changes: AuditLogEntry['changes'];
  }) {
    return this.log({
      category: 'user',
      action: 'user.updated',
      actorId: params.updatedBy,
      targetType: 'user',
      targetId: params.userId,
      description: `User profile updated`,
      changes: params.changes,
    });
  }

  static async logUserDeleted(userId: string, deletedBy: string, reason?: string) {
    return this.log({
      category: 'user',
      action: 'user.deleted',
      severity: 'warning',
      actorId: deletedBy,
      targetType: 'user',
      targetId: userId,
      description: `User account deleted${reason ? ': ' + reason : ''}`,
      metadata: { reason },
    });
  }

  /** Role events */
  static async logRoleAssigned(params: {
    userId: string;
    roleId: string;
    roleName: string;
    assignedBy: string;
    previousRole?: string;
    reason?: string;
  }) {
    return this.log({
      category: 'role',
      action: 'role.assigned',
      actorId: params.assignedBy,
      targetType: 'user',
      targetId: params.userId,
      description: `Role "${params.roleName}" assigned to user ${params.userId}`,
      changes: params.previousRole ? [{
        field: 'role',
        previousValue: params.previousRole,
        newValue: params.roleName,
      }] : undefined,
      metadata: { roleId: params.roleId, reason: params.reason },
    });
  }

  /** Partner events */
  static async logPartnerApproved(partnerId: string, approvedBy: string) {
    return this.log({
      category: 'partner',
      action: 'partner.approved',
      actorId: approvedBy,
      targetType: 'partner',
      targetId: partnerId,
      description: `Partner application approved`,
    });
  }

  static async logPartnerPayout(params: {
    partnerId: string;
    amount: number;
    processedBy: string;
  }) {
    return this.log({
      category: 'partner',
      action: 'partner.payout',
      actorId: params.processedBy,
      targetType: 'partner',
      targetId: params.partnerId,
      description: `Partner payout of €${(params.amount / 100).toFixed(2)} processed`,
      metadata: { amount: params.amount },
    });
  }

  /** GDPR events */
  static async logDataExport(userId: string) {
    return this.log({
      category: 'gdpr',
      action: 'gdpr.data_export',
      actorId: userId,
      targetType: 'user',
      targetId: userId,
      description: `Data export requested (GDPR Article 20)`,
    });
  }

  static async logDataDeletion(userId: string, retainedRecords: number) {
    return this.log({
      category: 'gdpr',
      action: 'gdpr.data_deletion',
      severity: 'warning',
      actorId: userId,
      targetType: 'user',
      targetId: userId,
      description: `Account deletion processed (GDPR Article 17). ${retainedRecords} financial records anonymized for ANBI compliance.`,
      metadata: { retainedRecords },
    });
  }

  static async logConsentChanged(userId: string, consentType: string, granted: boolean) {
    return this.log({
      category: 'gdpr',
      action: 'gdpr.consent_changed',
      actorId: userId,
      targetType: 'consent',
      targetId: consentType,
      description: `Consent "${consentType}" ${granted ? 'granted' : 'revoked'}`,
      metadata: { consentType, granted },
    });
  }

  /** Security events */
  static async logSuspiciousActivity(params: {
    userId?: string;
    description: string;
    metadata?: Record<string, any>;
    ip?: string;
  }) {
    return this.log({
      category: 'security',
      action: 'security.suspicious_activity',
      severity: 'critical',
      actorId: params.userId || 'unknown',
      description: params.description,
      metadata: params.metadata || {},
      ipAddress: params.ip,
    });
  }

  /** Admin actions */
  static async logAdminAction(params: {
    adminId: string;
    action: string;
    description: string;
    targetType?: string;
    targetId?: string;
    metadata?: Record<string, any>;
  }) {
    return this.log({
      category: 'admin',
      action: `admin.${params.action}`,
      actorId: params.adminId,
      actorRole: 'admin',
      targetType: params.targetType,
      targetId: params.targetId,
      description: params.description,
      metadata: params.metadata || {},
    });
  }

  /** System events */
  static async logSystemEvent(action: string, description: string, metadata?: Record<string, any>) {
    return this.log({
      category: 'system',
      action: `system.${action}`,
      actorId: 'system',
      description,
      metadata: metadata || {},
    });
  }

  static async logSystemError(action: string, error: string, metadata?: Record<string, any>) {
    return this.log({
      category: 'system',
      action: `system.${action}`,
      severity: 'error',
      actorId: 'system',
      description: `System error: ${error}`,
      result: 'failure',
      errorMessage: error,
      metadata: metadata || {},
    });
  }
}
```


---

### FILE: src/lib/audit/query.ts

```typescript
// ============================================================================
// AUDIT LOG QUERY SERVICE
// ============================================================================

import { db } from '@/lib/firebase/admin';
import { AuditLogEntry, AuditQueryParams, AuditStats, UserActivity } from '@/types/audit';

export class AuditQuery {
  /**
   * Query audit logs with filters and pagination
   */
  static async query(params: AuditQueryParams): Promise<{
    entries: AuditLogEntry[];
    total: number;
    hasMore: boolean;
  }> {
    let query: FirebaseFirestore.Query = db.collection('audit_logs');

    // Apply filters
    if (params.category) {
      query = query.where('category', '==', params.category);
    }
    if (params.action) {
      query = query.where('action', '==', params.action);
    }
    if (params.severity) {
      query = query.where('severity', '==', params.severity);
    }
    if (params.actorId) {
      query = query.where('actorId', '==', params.actorId);
    }
    if (params.targetType) {
      query = query.where('targetType', '==', params.targetType);
    }
    if (params.targetId) {
      query = query.where('targetId', '==', params.targetId);
    }
    if (params.result) {
      query = query.where('result', '==', params.result);
    }
    if (params.startDate) {
      query = query.where('timestamp', '>=', params.startDate);
    }
    if (params.endDate) {
      query = query.where('timestamp', '<=', params.endDate);
    }

    // Sort
    query = query.orderBy('timestamp', params.sortDirection === 'asc' ? 'asc' : 'desc');

    // Get total count (limited to avoid perf issues)
    const countSnap = await query.count().get();
    const total = countSnap.data().count;

    // Paginate
    const limit = params.limit || 50;
    if (params.offset) {
      query = query.offset(params.offset);
    }
    query = query.limit(limit + 1); // +1 to check if there's more

    const snapshot = await query.get();
    const entries = snapshot.docs
      .slice(0, limit)
      .map(doc => doc.data() as AuditLogEntry);

    // Text search filter (post-query, since Firestore doesn't support full-text)
    let filtered = entries;
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = entries.filter(e =>
        e.description.toLowerCase().includes(searchLower) ||
        e.action.toLowerCase().includes(searchLower) ||
        (e.actorEmail && e.actorEmail.toLowerCase().includes(searchLower)) ||
        (e.targetId && e.targetId.toLowerCase().includes(searchLower))
      );
    }

    return {
      entries: filtered,
      total,
      hasMore: snapshot.docs.length > limit,
    };
  }

  /**
   * Get audit statistics for admin dashboard
   */
  static async getStats(startDate?: string, endDate?: string): Promise<AuditStats> {
    let query: FirebaseFirestore.Query = db.collection('audit_logs');

    if (startDate) query = query.where('timestamp', '>=', startDate);
    if (endDate) query = query.where('timestamp', '<=', endDate);

    // Total count
    const totalSnap = await query.count().get();
    const totalEntries = totalSnap.data().count;

    // By category (sample-based for performance)
    const sampleSnap = await query
      .orderBy('timestamp', 'desc')
      .limit(1000)
      .get();
    const samples = sampleSnap.docs.map(d => d.data() as AuditLogEntry);

    const byCategory: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    const byResult: Record<string, number> = {};
    let recentFailures = 0;
    let recentCritical = 0;

    for (const entry of samples) {
      byCategory[entry.category] = (byCategory[entry.category] || 0) + 1;
      bySeverity[entry.severity] = (bySeverity[entry.severity] || 0) + 1;
      byResult[entry.result] = (byResult[entry.result] || 0) + 1;

      if (entry.result === 'failure') recentFailures++;
      if (entry.severity === 'critical') recentCritical++;
    }

    return {
      totalEntries,
      byCategory,
      bySeverity,
      byResult,
      recentFailures,
      recentCritical,
    };
  }

  /**
   * Get activity feed for a specific user (simplified view)
   */
  static async getUserActivity(userId: string, limit = 30): Promise<UserActivity[]> {
    const snapshot = await db.collection('audit_logs')
      .where('actorId', '==', userId)
      .where('result', '==', 'success')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => {
      const entry = doc.data() as AuditLogEntry;
      return {
        id: entry.id,
        timestamp: entry.timestamp,
        action: entry.action,
        description: entry.description,
        icon: getActivityIcon(entry.category),
        type: mapCategoryToActivityType(entry.category),
      };
    });
  }

  /**
   * Get entries for a specific target (entity history)
   */
  static async getEntityHistory(
    targetType: string,
    targetId: string,
    limit = 50
  ): Promise<AuditLogEntry[]> {
    const snapshot = await db.collection('audit_logs')
      .where('targetType', '==', targetType)
      .where('targetId', '==', targetId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => doc.data() as AuditLogEntry);
  }

  /**
   * Export audit logs as structured data
   */
  static async exportLogs(params: AuditQueryParams & { format: 'json' | 'csv' }): Promise<string> {
    // Override limit for export
    const allParams = { ...params, limit: 10000, offset: 0 };
    const { entries } = await this.query(allParams);

    if (params.format === 'json') {
      return JSON.stringify({
        exportedAt: new Date().toISOString(),
        totalEntries: entries.length,
        filters: params,
        entries,
      }, null, 2);
    }

    // CSV format
    const headers = [
      'Timestamp', 'Category', 'Action', 'Severity', 'Actor ID', 'Actor Email',
      'Target Type', 'Target ID', 'Description', 'Result', 'IP Address',
    ];

    const rows = entries.map(e => [
      e.timestamp,
      e.category,
      e.action,
      e.severity,
      e.actorId,
      e.actorEmail || '',
      e.targetType || '',
      e.targetId || '',
      `"${e.description.replace(/"/g, '""')}"`,
      e.result,
      e.ipAddress || '',
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
  }
}

// ------------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------------
function getActivityIcon(category: string): string {
  const icons: Record<string, string> = {
    auth: '🔐',
    donation: '💝',
    subscription: '🔄',
    refund: '↩️',
    user: '👤',
    role: '🛡️',
    partner: '🏢',
    project: '📋',
    content: '📝',
    event: '📅',
    admin: '⚙️',
    gdpr: '🔒',
    system: '🖥️',
    security: '🚨',
    payment: '💳',
    webhook: '🔗',
  };
  return icons[category] || '📌';
}

function mapCategoryToActivityType(category: string): UserActivity['type'] {
  const mapping: Record<string, UserActivity['type']> = {
    donation: 'donation',
    subscription: 'donation',
    refund: 'donation',
    payment: 'donation',
    event: 'event',
    social: 'social',
    auth: 'account',
    user: 'account',
    gdpr: 'account',
    tribe: 'tribe',
  };
  return mapping[category] || 'account';
}
```

---

### FILE: src/lib/audit/retention.ts

```typescript
// ============================================================================
// AUDIT LOG RETENTION POLICY MANAGEMENT
// ============================================================================

import { db } from '@/lib/firebase/admin';
import { AuditCategory, RetentionPolicy } from '@/types/audit';
import { AuditLogger } from './logger';

/**
 * Default retention policies per category
 * ANBI requires 7-year financial record retention
 */
const DEFAULT_RETENTION_POLICIES: RetentionPolicy[] = [
  { category: 'auth', retentionDays: 365, archiveBeforeDelete: false, description: 'Authentication events kept for 1 year' },
  { category: 'donation', retentionDays: 2557, archiveBeforeDelete: true, description: 'Donation records kept 7 years (ANBI compliance)' },
  { category: 'subscription', retentionDays: 2557, archiveBeforeDelete: true, description: 'Subscription records kept 7 years (ANBI)' },
  { category: 'refund', retentionDays: 2557, archiveBeforeDelete: true, description: 'Refund records kept 7 years (ANBI)' },
  { category: 'payment', retentionDays: 2557, archiveBeforeDelete: true, description: 'Payment records kept 7 years (ANBI)' },
  { category: 'user', retentionDays: 730, archiveBeforeDelete: true, description: 'User management events kept 2 years' },
  { category: 'role', retentionDays: 730, archiveBeforeDelete: true, description: 'Role changes kept 2 years' },
  { category: 'partner', retentionDays: 2557, archiveBeforeDelete: true, description: 'Partner events kept 7 years (ANBI)' },
  { category: 'project', retentionDays: 1095, archiveBeforeDelete: true, description: 'Project events kept 3 years' },
  { category: 'content', retentionDays: 365, archiveBeforeDelete: false, description: 'Content events kept 1 year' },
  { category: 'event', retentionDays: 730, archiveBeforeDelete: false, description: 'Event logs kept 2 years' },
  { category: 'admin', retentionDays: 1095, archiveBeforeDelete: true, description: 'Admin actions kept 3 years' },
  { category: 'gdpr', retentionDays: 2557, archiveBeforeDelete: true, description: 'GDPR events kept 7 years (regulatory compliance)' },
  { category: 'system', retentionDays: 180, archiveBeforeDelete: false, description: 'System events kept 6 months' },
  { category: 'security', retentionDays: 1095, archiveBeforeDelete: true, description: 'Security events kept 3 years' },
  { category: 'webhook', retentionDays: 180, archiveBeforeDelete: false, description: 'Webhook events kept 6 months' },
];

export class AuditRetention {
  /**
   * Get retention policies
   */
  static getRetentionPolicies(): RetentionPolicy[] {
    return [...DEFAULT_RETENTION_POLICIES];
  }

  /**
   * Run retention cleanup — delete logs past their retention period
   * Should be scheduled as a daily cron job
   */
  static async runRetentionCleanup(): Promise<{
    processed: number;
    archived: number;
    deleted: number;
    errors: string[];
  }> {
    const result = { processed: 0, archived: 0, deleted: 0, errors: [] as string[] };

    for (const policy of DEFAULT_RETENTION_POLICIES) {
      try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - policy.retentionDays);
        const cutoffISO = cutoffDate.toISOString();

        // Find expired entries
        const expiredSnap = await db.collection('audit_logs')
          .where('category', '==', policy.category)
          .where('timestamp', '<', cutoffISO)
          .limit(500) // Process in batches
          .get();

        if (expiredSnap.empty) continue;

        result.processed += expiredSnap.docs.length;

        // Archive if required
        if (policy.archiveBeforeDelete) {
          const batch = db.batch();
          for (const doc of expiredSnap.docs) {
            const archiveRef = db.collection('audit_logs_archive').doc(doc.id);
            batch.set(archiveRef, {
              ...doc.data(),
              archivedAt: new Date().toISOString(),
              retentionPolicy: policy.category,
            });
          }
          await batch.commit();
          result.archived += expiredSnap.docs.length;
        }

        // Delete expired entries
        const deleteBatch = db.batch();
        for (const doc of expiredSnap.docs) {
          deleteBatch.delete(doc.ref);
        }
        await deleteBatch.commit();
        result.deleted += expiredSnap.docs.length;

      } catch (err: any) {
        result.errors.push(`${policy.category}: ${err.message}`);
      }
    }

    // Log the cleanup itself
    await AuditLogger.logSystemEvent('retention_cleanup',
      `Retention cleanup completed. Processed: ${result.processed}, Archived: ${result.archived}, Deleted: ${result.deleted}`,
      result
    );

    return result;
  }

  /**
   * Get retention statistics
   */
  static async getRetentionStats(): Promise<{
    totalLogs: number;
    totalArchived: number;
    oldestEntry: string | null;
    newestEntry: string | null;
    sizeByCategory: Record<string, number>;
  }> {
    // Total active logs
    const totalSnap = await db.collection('audit_logs').count().get();
    const totalLogs = totalSnap.data().count;

    // Total archived
    const archivedSnap = await db.collection('audit_logs_archive').count().get();
    const totalArchived = archivedSnap.data().count;

    // Oldest entry
    const oldestSnap = await db.collection('audit_logs')
      .orderBy('timestamp', 'asc')
      .limit(1)
      .get();
    const oldestEntry = oldestSnap.empty ? null : (oldestSnap.docs[0].data() as any).timestamp;

    // Newest entry
    const newestSnap = await db.collection('audit_logs')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();
    const newestEntry = newestSnap.empty ? null : (newestSnap.docs[0].data() as any).timestamp;

    // Approximate counts by category (sample first 2000)
    const sampleSnap = await db.collection('audit_logs')
      .orderBy('timestamp', 'desc')
      .limit(2000)
      .get();

    const sizeByCategory: Record<string, number> = {};
    for (const doc of sampleSnap.docs) {
      const cat = (doc.data() as any).category;
      sizeByCategory[cat] = (sizeByCategory[cat] || 0) + 1;
    }

    return { totalLogs, totalArchived, oldestEntry, newestEntry, sizeByCategory };
  }
}
```


---

### FILE: src/components/admin/AuditLogViewer.tsx

```tsx
// ============================================================================
// ADMIN AUDIT LOG VIEWER
// ============================================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatDate } from '@/lib/utils/format';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface AuditLogEntry {
  id: string;
  timestamp: string;
  category: string;
  action: string;
  severity: string;
  actorId: string;
  actorEmail?: string;
  actorRole?: string;
  targetType?: string;
  targetId?: string;
  description: string;
  metadata: Record<string, any>;
  changes?: { field: string; previousValue: any; newValue: any }[];
  result: string;
  errorMessage?: string;
  ipAddress?: string;
}

interface AuditStats {
  totalEntries: number;
  byCategory: Record<string, number>;
  bySeverity: Record<string, number>;
  recentFailures: number;
  recentCritical: number;
}

interface Filters {
  category: string;
  severity: string;
  result: string;
  search: string;
  startDate: string;
  endDate: string;
}

// ------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------
const CATEGORIES = [
  'auth', 'donation', 'subscription', 'refund', 'user', 'role',
  'partner', 'project', 'content', 'event', 'admin', 'gdpr',
  'system', 'security', 'payment', 'webhook',
];

const SEVERITY_COLORS: Record<string, string> = {
  info: '#3b82f6',
  warning: '#f59e0b',
  error: '#ef4444',
  critical: '#dc2626',
};

const CATEGORY_ICONS: Record<string, string> = {
  auth: '🔐', donation: '💝', subscription: '🔄', refund: '↩️',
  user: '👤', role: '🛡️', partner: '🏢', project: '📋',
  content: '📝', event: '📅', admin: '⚙️', gdpr: '🔒',
  system: '🖥️', security: '🚨', payment: '💳', webhook: '🔗',
};

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export default function AuditLogViewer() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    category: '',
    severity: '',
    result: '',
    search: '',
    startDate: '',
    endDate: '',
  });
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [total, setTotal] = useState(0);
  const LIMIT = 50;

  // ------------------------------------------------------------------
  // Data fetching
  // ------------------------------------------------------------------
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.set('category', filters.category);
      if (filters.severity) params.set('severity', filters.severity);
      if (filters.result) params.set('result', filters.result);
      if (filters.search) params.set('search', filters.search);
      if (filters.startDate) params.set('startDate', new Date(filters.startDate).toISOString());
      if (filters.endDate) params.set('endDate', new Date(filters.endDate).toISOString());
      params.set('limit', String(LIMIT));
      params.set('offset', String(page * LIMIT));

      const res = await fetch(`/api/admin/audit-logs?${params}`);
      if (!res.ok) throw new Error('Failed to fetch logs');
      const data = await res.json();

      setEntries(data.entries);
      setHasMore(data.hasMore);
      setTotal(data.total);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/audit-logs?stats=true');
      if (!res.ok) return;
      const data = await res.json();
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  // ------------------------------------------------------------------
  // Export
  // ------------------------------------------------------------------
  const exportLogs = async (format: 'json' | 'csv') => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.set('category', filters.category);
      if (filters.severity) params.set('severity', filters.severity);
      params.set('format', format);

      const res = await fetch(`/api/admin/audit-logs/export?${params}`);
      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Audit Logs</h1>
          <p style={{ color: '#6b7280', marginTop: 4 }}>
            Platform activity trail — {total.toLocaleString()} total entries
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => exportLogs('csv')}
            disabled={exporting}
            style={{
              padding: '8px 16px', borderRadius: 8, border: '1px solid #e5e7eb',
              backgroundColor: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            }}
          >
            {exporting ? 'Exporting...' : '↓ Export CSV'}
          </button>
          <button
            onClick={() => exportLogs('json')}
            disabled={exporting}
            style={{
              padding: '8px 16px', borderRadius: 8, border: '1px solid #e5e7eb',
              backgroundColor: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            }}
          >
            ↓ Export JSON
          </button>
        </div>
      </div>

      {/* Stats cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
          <div style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Total Entries</p>
            <p style={{ fontSize: 24, fontWeight: 700, margin: '4px 0 0' }}>{stats.totalEntries.toLocaleString()}</p>
          </div>
          <div style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Recent Failures</p>
            <p style={{ fontSize: 24, fontWeight: 700, margin: '4px 0 0', color: stats.recentFailures > 0 ? '#ef4444' : '#22c55e' }}>
              {stats.recentFailures}
            </p>
          </div>
          <div style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Critical Events</p>
            <p style={{ fontSize: 24, fontWeight: 700, margin: '4px 0 0', color: stats.recentCritical > 0 ? '#dc2626' : '#22c55e' }}>
              {stats.recentCritical}
            </p>
          </div>
          <div style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Categories Active</p>
            <p style={{ fontSize: 24, fontWeight: 700, margin: '4px 0 0' }}>
              {Object.keys(stats.byCategory).length}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20,
        padding: 16, borderRadius: 12, backgroundColor: '#f9fafb', border: '1px solid #e5e7eb',
      }}>
        <input
          type="text"
          value={filters.search}
          onChange={e => { setFilters(f => ({ ...f, search: e.target.value })); setPage(0); }}
          placeholder="Search logs..."
          style={{
            flex: '1 1 200px', padding: '8px 12px', borderRadius: 8,
            border: '1px solid #d1d5db', fontSize: 13,
          }}
        />
        <select
          value={filters.category}
          onChange={e => { setFilters(f => ({ ...f, category: e.target.value })); setPage(0); }}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13 }}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
          ))}
        </select>
        <select
          value={filters.severity}
          onChange={e => { setFilters(f => ({ ...f, severity: e.target.value })); setPage(0); }}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13 }}
        >
          <option value="">All Severities</option>
          <option value="info">ℹ️ Info</option>
          <option value="warning">⚠️ Warning</option>
          <option value="error">❌ Error</option>
          <option value="critical">🚨 Critical</option>
        </select>
        <select
          value={filters.result}
          onChange={e => { setFilters(f => ({ ...f, result: e.target.value })); setPage(0); }}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13 }}
        >
          <option value="">All Results</option>
          <option value="success">✓ Success</option>
          <option value="failure">✗ Failure</option>
        </select>
        <input
          type="date"
          value={filters.startDate}
          onChange={e => { setFilters(f => ({ ...f, startDate: e.target.value })); setPage(0); }}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13 }}
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={e => { setFilters(f => ({ ...f, endDate: e.target.value })); setPage(0); }}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13 }}
        />
        <button
          onClick={() => { setFilters({ category: '', severity: '', result: '', search: '', startDate: '', endDate: '' }); setPage(0); }}
          style={{
            padding: '8px 14px', borderRadius: 8, border: '1px solid #e5e7eb',
            backgroundColor: '#fff', fontSize: 13, cursor: 'pointer',
          }}
        >
          Clear
        </button>
      </div>

      {/* Log entries */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div style={{
            width: 40, height: 40, border: '3px solid #e5e7eb',
            borderTopColor: '#2563eb', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
        </div>
      ) : entries.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center', color: '#9ca3af' }}>
          <p style={{ fontSize: 32, margin: 0 }}>📋</p>
          <p style={{ fontWeight: 500, marginTop: 8 }}>No audit entries found</p>
          <p style={{ fontSize: 13 }}>Adjust your filters or check a different date range.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {entries.map(entry => (
            <div
              key={entry.id}
              onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
              style={{
                padding: '12px 16px', borderRadius: 8,
                border: `1px solid ${expandedId === entry.id ? '#bfdbfe' : '#e5e7eb'}`,
                backgroundColor: expandedId === entry.id ? '#f0f9ff' : '#fff',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {/* Entry header row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Severity dot */}
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  backgroundColor: SEVERITY_COLORS[entry.severity] || '#6b7280',
                  flexShrink: 0,
                }} />

                {/* Category icon */}
                <span style={{ fontSize: 16, flexShrink: 0 }}>
                  {CATEGORY_ICONS[entry.category] || '📌'}
                </span>

                {/* Time */}
                <span style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'monospace', minWidth: 140, flexShrink: 0 }}>
                  {formatDate(entry.timestamp)}
                </span>

                {/* Action */}
                <span style={{
                  fontSize: 11, fontFamily: 'monospace', padding: '2px 6px',
                  borderRadius: 4, backgroundColor: '#f3f4f6', color: '#374151',
                  flexShrink: 0,
                }}>
                  {entry.action}
                </span>

                {/* Description */}
                <span style={{ fontSize: 13, color: '#374151', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {entry.description}
                </span>

                {/* Result badge */}
                <span style={{
                  padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                  backgroundColor: entry.result === 'success' ? '#dcfce7' : entry.result === 'failure' ? '#fef2f2' : '#fef3c7',
                  color: entry.result === 'success' ? '#166534' : entry.result === 'failure' ? '#991b1b' : '#92400e',
                  flexShrink: 0,
                }}>
                  {entry.result}
                </span>
              </div>

              {/* Expanded details */}
              {expandedId === entry.id && (
                <div style={{
                  marginTop: 12, paddingTop: 12, borderTop: '1px solid #e5e7eb',
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13,
                }}>
                  <div><strong>Actor:</strong> {entry.actorEmail || entry.actorId}</div>
                  <div><strong>Role:</strong> {entry.actorRole || 'N/A'}</div>
                  <div><strong>Target:</strong> {entry.targetType ? `${entry.targetType}/${entry.targetId}` : 'N/A'}</div>
                  <div><strong>IP:</strong> {entry.ipAddress || 'N/A'}</div>
                  {entry.errorMessage && (
                    <div style={{ gridColumn: '1 / -1', color: '#ef4444' }}>
                      <strong>Error:</strong> {entry.errorMessage}
                    </div>
                  )}
                  {entry.changes && entry.changes.length > 0 && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <strong>Changes:</strong>
                      <div style={{ marginTop: 4 }}>
                        {entry.changes.map((change, i) => (
                          <div key={i} style={{ fontSize: 12, fontFamily: 'monospace', marginTop: 2 }}>
                            <span style={{ color: '#6b7280' }}>{change.field}:</span>{' '}
                            <span style={{ color: '#ef4444', textDecoration: 'line-through' }}>
                              {JSON.stringify(change.previousValue)}
                            </span>{' → '}
                            <span style={{ color: '#22c55e' }}>
                              {JSON.stringify(change.newValue)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {Object.keys(entry.metadata).length > 0 && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <strong>Metadata:</strong>
                      <pre style={{
                        backgroundColor: '#f3f4f6', padding: 8, borderRadius: 6,
                        fontSize: 11, overflow: 'auto', marginTop: 4,
                      }}>
                        {JSON.stringify(entry.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                  <div style={{ gridColumn: '1 / -1', fontSize: 11, color: '#9ca3af', fontFamily: 'monospace' }}>
                    ID: {entry.id}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && entries.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20, alignItems: 'center' }}>
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{
              padding: '8px 16px', borderRadius: 8, border: '1px solid #e5e7eb',
              backgroundColor: '#fff', cursor: page === 0 ? 'not-allowed' : 'pointer',
              opacity: page === 0 ? 0.5 : 1, fontSize: 13,
            }}
          >
            ← Previous
          </button>
          <span style={{ fontSize: 13, color: '#6b7280' }}>
            Page {page + 1} of {Math.ceil(total / LIMIT)}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!hasMore}
            style={{
              padding: '8px 16px', borderRadius: 8, border: '1px solid #e5e7eb',
              backgroundColor: '#fff', cursor: !hasMore ? 'not-allowed' : 'pointer',
              opacity: !hasMore ? 0.5 : 1, fontSize: 13,
            }}
          >
            Next →
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
```


---

### FILE: src/components/shared/ActivityFeed.tsx

```tsx
// ============================================================================
// USER ACTIVITY FEED COMPONENT
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils/format';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface UserActivity {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  icon: string;
  type: 'donation' | 'event' | 'social' | 'account' | 'tribe' | 'achievement';
}

// ------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------
const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  donation: { bg: '#fdf2f8', text: '#be185d', border: '#fbcfe8' },
  event: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
  social: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  account: { bg: '#f9fafb', text: '#374151', border: '#e5e7eb' },
  tribe: { bg: '#fffbeb', text: '#92400e', border: '#fde68a' },
  achievement: { bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff' },
};

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
interface ActivityFeedProps {
  userId?: string;      // If not provided, shows current user
  limit?: number;
  compact?: boolean;    // Compact view for sidebar/widget
  showFilter?: boolean;
  title?: string;
}

export default function ActivityFeed({
  userId,
  limit = 20,
  compact = false,
  showFilter = true,
  title = 'Recent Activity',
}: ActivityFeedProps) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchActivity() {
      const targetId = userId || user?.uid;
      if (!targetId) return;

      try {
        const res = await fetch(`/api/user/activity?userId=${targetId}&limit=${limit}`);
        if (!res.ok) throw new Error('Failed to fetch activity');
        const data = await res.json();
        setActivities(data.activities);
      } catch (err) {
        console.error('Error loading activity:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchActivity();
  }, [userId, user, limit]);

  // Filter
  const filtered = typeFilter === 'all'
    ? activities
    : activities.filter(a => a.type === typeFilter);

  // Group by date
  const grouped: Record<string, UserActivity[]> = {};
  for (const activity of filtered) {
    const dateKey = new Date(activity.timestamp).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(activity);
  }

  // Time formatting
  const formatTime = (ts: string) => {
    return new Date(ts).toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
  };

  // Relative time
  const relativeTime = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(ts);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: compact ? 20 : 40 }}>
        <div style={{
          width: 28, height: 28, border: '2px solid #e5e7eb',
          borderTopColor: '#2563eb', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  // ------------------------------------------------------------------
  // Compact view (sidebar / widget)
  // ------------------------------------------------------------------
  if (compact) {
    return (
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 12px' }}>{title}</h3>
        {filtered.length === 0 ? (
          <p style={{ fontSize: 13, color: '#9ca3af' }}>No activity yet</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.slice(0, 8).map(activity => (
              <div key={activity.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{activity.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    margin: 0, fontSize: 12, color: '#374151',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {activity.description}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9ca3af' }}>
                    {relativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // Full view
  // ------------------------------------------------------------------
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{title}</h2>
        <span style={{ fontSize: 13, color: '#9ca3af' }}>{filtered.length} activities</span>
      </div>

      {/* Type filter */}
      {showFilter && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          {['all', 'donation', 'event', 'social', 'account', 'tribe', 'achievement'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              style={{
                padding: '5px 12px', borderRadius: 16,
                border: typeFilter === type ? 'none' : '1px solid #e5e7eb',
                backgroundColor: typeFilter === type ? '#2563eb' : '#fff',
                color: typeFilter === type ? '#fff' : '#6b7280',
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {type === 'all' ? 'All' : type}
            </button>
          ))}
        </div>
      )}

      {/* Activity timeline */}
      {Object.keys(grouped).length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
          <p style={{ fontSize: 32, margin: 0 }}>📭</p>
          <p style={{ fontWeight: 500, marginTop: 8 }}>No activity found</p>
        </div>
      ) : (
        <div>
          {Object.entries(grouped).map(([dateLabel, dayActivities]) => (
            <div key={dateLabel} style={{ marginBottom: 24 }}>
              <p style={{
                fontSize: 12, fontWeight: 600, color: '#9ca3af',
                textTransform: 'uppercase', letterSpacing: 0.5,
                margin: '0 0 10px',
              }}>
                {dateLabel}
              </p>

              <div style={{ position: 'relative', paddingLeft: 24 }}>
                {/* Vertical timeline line */}
                <div style={{
                  position: 'absolute', left: 7, top: 4, bottom: 4,
                  width: 2, backgroundColor: '#e5e7eb',
                }} />

                {dayActivities.map((activity, index) => {
                  const colors = TYPE_COLORS[activity.type] || TYPE_COLORS.account;
                  return (
                    <div key={activity.id} style={{
                      position: 'relative', marginBottom: index === dayActivities.length - 1 ? 0 : 12,
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                    }}>
                      {/* Timeline dot */}
                      <div style={{
                        position: 'absolute', left: -20, top: 6,
                        width: 12, height: 12, borderRadius: '50%',
                        backgroundColor: colors.bg, border: `2px solid ${colors.border}`,
                        zIndex: 1,
                      }} />

                      {/* Activity card */}
                      <div style={{
                        flex: 1, padding: '10px 14px', borderRadius: 8,
                        backgroundColor: colors.bg, border: `1px solid ${colors.border}`,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 14 }}>{activity.icon}</span>
                            <span style={{ fontSize: 13, fontWeight: 500, color: colors.text }}>
                              {activity.description}
                            </span>
                          </div>
                          <span style={{ fontSize: 11, color: '#9ca3af', flexShrink: 0 }}>
                            {formatTime(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
```

---

### FILE: src/app/api/admin/audit-logs/route.ts

```typescript
// ============================================================================
// ADMIN AUDIT LOGS API
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, handleAuthError } from '@/lib/rbac/middleware';
import { AuditQuery } from '@/lib/audit/query';
import { AuditCategory, AuditSeverity } from '@/types/audit';

/**
 * GET /api/admin/audit-logs
 * Query audit logs with filters
 */
export async function GET(req: NextRequest) {
  try {
    await requirePermission(req, 'audit_logs:read');

    const { searchParams } = new URL(req.url);

    // Stats mode
    if (searchParams.get('stats') === 'true') {
      const stats = await AuditQuery.getStats(
        searchParams.get('startDate') || undefined,
        searchParams.get('endDate') || undefined
      );
      return NextResponse.json({ stats });
    }

    // Query mode
    const params = {
      category: searchParams.get('category') as AuditCategory | undefined,
      action: searchParams.get('action') || undefined,
      severity: searchParams.get('severity') as AuditSeverity | undefined,
      actorId: searchParams.get('actorId') || undefined,
      targetType: searchParams.get('targetType') || undefined,
      targetId: searchParams.get('targetId') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      result: searchParams.get('result') as 'success' | 'failure' | undefined,
      search: searchParams.get('search') || undefined,
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
      sortDirection: (searchParams.get('sort') || 'desc') as 'asc' | 'desc',
    };

    const result = await AuditQuery.query(params);
    return NextResponse.json(result);
  } catch (err) {
    return handleAuthError(err);
  }
}
```

---

### FILE: src/app/api/admin/audit-logs/export/route.ts

```typescript
// ============================================================================
// AUDIT LOG EXPORT API
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, handleAuthError } from '@/lib/rbac/middleware';
import { AuditQuery } from '@/lib/audit/query';
import { AuditLogger } from '@/lib/audit/logger';
import { AuditCategory, AuditSeverity } from '@/types/audit';

/**
 * GET /api/admin/audit-logs/export
 * Export audit logs as CSV or JSON
 */
export async function GET(req: NextRequest) {
  try {
    const userId = await requirePermission(req, 'audit_logs:export');

    const { searchParams } = new URL(req.url);
    const format = (searchParams.get('format') || 'csv') as 'json' | 'csv';

    const params = {
      category: searchParams.get('category') as AuditCategory | undefined,
      severity: searchParams.get('severity') as AuditSeverity | undefined,
      actorId: searchParams.get('actorId') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      result: searchParams.get('result') as 'success' | 'failure' | undefined,
      format,
    };

    const data = await AuditQuery.exportLogs(params);

    // Log the export
    await AuditLogger.logAdminAction({
      adminId: userId,
      action: 'audit_export',
      description: `Exported audit logs as ${format.toUpperCase()}`,
      metadata: {
        format,
        filters: {
          category: params.category,
          severity: params.severity,
          startDate: params.startDate,
          endDate: params.endDate,
        },
      },
    });

    const contentType = format === 'json' ? 'application/json' : 'text/csv';
    const filename = `audit_logs_${new Date().toISOString().split('T')[0]}.${format}`;

    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    return handleAuthError(err);
  }
}
```

---

### FILE: src/app/api/user/activity/route.ts

```typescript
// ============================================================================
// USER ACTIVITY FEED API
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleAuthError } from '@/lib/rbac/middleware';
import { AuditQuery } from '@/lib/audit/query';

/**
 * GET /api/user/activity
 * Get activity feed for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth(req);

    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get('userId') || userId;
    const limit = parseInt(searchParams.get('limit') || '30');

    // Users can only view their own activity unless they have admin access
    if (targetUserId !== userId) {
      // Check if requester is admin
      const { RBACService } = await import('@/lib/rbac/service');
      const check = await RBACService.checkPermission(userId, 'users:read');
      if (!check.allowed) {
        return NextResponse.json(
          { error: 'You can only view your own activity' },
          { status: 403 }
        );
      }
    }

    const activities = await AuditQuery.getUserActivity(targetUserId, limit);
    return NextResponse.json({ activities });
  } catch (err) {
    return handleAuthError(err);
  }
}
```


---

# ═══════════════════════════════════════════════════════════════════════════════
# END OF PART 9 — ENTERPRISE FEATURES COMPLETE
# ═══════════════════════════════════════════════════════════════════════════════
#
# SECTIONS COVERED:
#   43. Advanced Analytics Dashboard
#   44. GDPR Compliance Engine
#   45. Recurring Donations & Subscription Management
#   46. Advanced Payment Processing (Refunds, Tax Receipts)
#   47. Role-Based Access Control (RBAC)
#   48. Audit Logging & Activity Tracking
#
# TOTAL FILES: 39 TypeScript/React files
#
# NEXT: Part 10 — Deployment, CI/CD & Platform Optimization
# ═══════════════════════════════════════════════════════════════════════════════

