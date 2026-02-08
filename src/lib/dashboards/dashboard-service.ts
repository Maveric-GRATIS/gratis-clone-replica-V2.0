// ============================================================================
// GRATIS.NGO — Custom Dashboard Builder Service
// ============================================================================

import { db } from '@/firebase';
import {
  doc, setDoc, getDoc, updateDoc, deleteDoc,
  collection, getDocs, query, where,
} from 'firebase/firestore';
import {
  Dashboard, DashboardWidget, WidgetType,
  WIDGET_PRESETS,
} from '@/types/dashboard-builder';

const DASHBOARDS_COL = 'dashboards';

// ── Dashboard CRUD ───────────────────────────────────────────────────────────

export async function createDashboard(params: {
  name: string;
  description?: string;
  createdBy: string;
  theme?: string;
  shared?: boolean;
}): Promise<Dashboard> {
  const id = `dash_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const dashboard: Dashboard = {
    id,
    name: params.name,
    description: params.description,
    widgets: [],
    layout: {
      type: 'grid',
      columns: 12,
      rowHeight: 50,
      gap: 16,
      padding: 16,
    },
    theme: params.theme || 'light',
    isPublic: params.shared || false,
    sharedWith: [],
    ownerId: params.createdBy,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, DASHBOARDS_COL, id), dashboard);
  return dashboard;
}

export async function getDashboard(dashboardId: string): Promise<Dashboard | null> {
  const snap = await getDoc(doc(db, DASHBOARDS_COL, dashboardId));
  return snap.exists() ? (snap.data() as Dashboard) : null;
}

export async function listDashboards(userId: string): Promise<Dashboard[]> {
  const q = query(
    collection(db, DASHBOARDS_COL),
    where('ownerId', '==', userId)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => d.data() as Dashboard)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function updateDashboard(
  dashboardId: string,
  updates: Partial<Dashboard>
): Promise<void> {
  await updateDoc(doc(db, DASHBOARDS_COL, dashboardId), {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteDashboard(dashboardId: string): Promise<void> {
  await deleteDoc(doc(db, DASHBOARDS_COL, dashboardId));
}

// ── Widget Management ────────────────────────────────────────────────────────

export async function addWidget(
  dashboardId: string,
  widgetType: WidgetType,
  position?: { x: number; y: number; width: number; height: number }
): Promise<DashboardWidget> {
  const preset = WIDGET_PRESETS.find((p) => p.type === widgetType);
  if (!preset) throw new Error(`Unknown widget type: ${widgetType}`);

  const widget: DashboardWidget = {
    id: `widget_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type: widgetType,
    title: preset.label,
    position: position || {
      x: 0,
      y: 0,
      width: preset.defaultSize.width,
      height: preset.defaultSize.height,
    },
    config: {},
    style: {},
  };

  const dashboard = await getDashboard(dashboardId);
  if (!dashboard) throw new Error('Dashboard not found');

  const updatedWidgets = [...dashboard.widgets, widget];

  await updateDoc(doc(db, DASHBOARDS_COL, dashboardId), {
    widgets: updatedWidgets,
    updatedAt: new Date().toISOString(),
  });

  return widget;
}

export async function removeWidget(
  dashboardId: string,
  widgetId: string
): Promise<void> {
  const dashboard = await getDashboard(dashboardId);
  if (!dashboard) throw new Error('Dashboard not found');

  const updatedWidgets = dashboard.widgets.filter((w) => w.id !== widgetId);

  await updateDoc(doc(db, DASHBOARDS_COL, dashboardId), {
    widgets: updatedWidgets,
    updatedAt: new Date().toISOString(),
  });
}

export async function updateWidget(
  dashboardId: string,
  widgetId: string,
  updates: Partial<DashboardWidget>
): Promise<void> {
  const dashboard = await getDashboard(dashboardId);
  if (!dashboard) throw new Error('Dashboard not found');

  const updatedWidgets = dashboard.widgets.map((w) =>
    w.id === widgetId ? { ...w, ...updates } : w
  );

  await updateDoc(doc(db, DASHBOARDS_COL, dashboardId), {
    widgets: updatedWidgets,
    updatedAt: new Date().toISOString(),
  });
}

// ── Widget Data Fetchers ─────────────────────────────────────────────────────

export async function getWidgetData(
  widgetType: WidgetType,
  config: Record<string, any>
): Promise<any> {
  // In a real implementation, this would query actual collections
  // For now, return mock data based on widget type

  switch (widgetType) {
    case 'metric':
      return {
        totalDonations: 125000,
        totalEvents: 42,
        activeVolunteers: 156,
        avgDonationAmount: 89.5,
      };

    case 'chart':
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Donations',
            data: [12000, 15000, 13500, 18000, 21000, 19500],
          },
        ],
      };

    case 'calendar':
      return {
        events: [
          { id: '1', title: 'Charity Run', date: '2024-03-15', type: 'fundraiser' },
          { id: '2', title: 'Food Drive', date: '2024-03-22', type: 'community' },
        ],
      };

    case 'activity_feed':
      return {
        activities: [
          { id: '1', type: 'donation', user: 'John Doe', amount: 50, timestamp: new Date() },
          { id: '2', type: 'volunteer_signup', user: 'Jane Smith', event: 'Food Drive', timestamp: new Date() },
        ],
      };

    case 'leaderboard':
      return {
        donors: [
          { name: 'Alice Johnson', totalDonations: 5000, donationCount: 12 },
          { name: 'Bob Williams', totalDonations: 4500, donationCount: 9 },
        ],
      };

    default:
      return {};
  }
}
