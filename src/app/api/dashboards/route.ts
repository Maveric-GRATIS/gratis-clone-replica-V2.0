// ============================================================================
// GRATIS.NGO — Dashboard API Routes
// ============================================================================

import { Dashboard, DEFAULT_THEMES } from '@/types/dashboard-builder';

// Mock dashboards
const mockDashboards: Dashboard[] = [
  {
    id: 'dash_001',
    name: 'Fundraising Overview',
    description: 'Track donations, campaigns, and donor engagement',
    ownerId: 'user123',
    layout: {
      type: 'grid',
      columns: 12,
      rowHeight: 80,
      gap: 16,
      padding: 24,
    },
    widgets: [
      {
        id: 'widget_1',
        type: 'metric',
        title: 'Total Donations',
        position: { x: 0, y: 0, width: 3, height: 2 },
        config: {
          value: 45620,
          label: 'This Month',
          format: 'currency',
          trend: 12.5,
          icon: '💰',
        },
        style: {
          backgroundColor: '#1e293b',
          textColor: '#f1f5f9',
          borderRadius: 12,
          shadow: true,
        },
      },
      {
        id: 'widget_2',
        type: 'metric',
        title: 'Active Donors',
        position: { x: 3, y: 0, width: 3, height: 2 },
        config: {
          value: 342,
          label: 'This Month',
          format: 'number',
          trend: 8.3,
          icon: '👥',
        },
        style: {
          backgroundColor: '#1e293b',
          textColor: '#f1f5f9',
          borderRadius: 12,
          shadow: true,
        },
      },
      {
        id: 'widget_3',
        type: 'chart',
        title: 'Donations Over Time',
        position: { x: 0, y: 2, width: 6, height: 4 },
        config: {
          chartType: 'line',
          xAxis: 'date',
          yAxis: 'amount',
        },
        dataSource: {
          type: 'firestore',
          collection: 'donations',
          limit: 30,
        },
        style: {
          backgroundColor: '#1e293b',
          textColor: '#f1f5f9',
          borderRadius: 12,
          shadow: true,
        },
      },
    ],
    theme: 'dark',
    isPublic: false,
    sharedWith: [],
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// GET /api/dashboards
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const userId = url.searchParams.get('userId');
  const action = url.searchParams.get('action');

  if (action === 'themes') {
    return Response.json({ themes: DEFAULT_THEMES });
  }

  if (id) {
    const dashboard = mockDashboards.find(d => d.id === id);
    if (!dashboard) {
      return Response.json({ error: 'Dashboard not found' }, { status: 404 });
    }
    return Response.json({ dashboard });
  }

  if (userId) {
    const dashboards = mockDashboards.filter(d =>
      d.ownerId === userId || d.sharedWith.includes(userId)
    );
    return Response.json({ dashboards });
  }

  return Response.json({ error: 'userId or id required' }, { status: 400 });
}

// POST /api/dashboards
export async function POST(req: Request) {
  const body = await req.json();
  const { action, name, description, ownerId, layout, theme, widget, dashboardId } = body;

  if (action === 'create') {
    const newDashboard: Dashboard = {
      id: `dash_${Date.now()}`,
      name: name || 'New Dashboard',
      description: description || '',
      ownerId: ownerId || 'user123',
      layout: layout || {
        type: 'grid',
        columns: 12,
        rowHeight: 80,
        gap: 16,
        padding: 24,
      },
      widgets: [],
      theme: theme || 'dark',
      isPublic: false,
      sharedWith: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return Response.json({ dashboard: newDashboard });
  }

  if (action === 'add_widget') {
    if (!dashboardId || !widget) {
      return Response.json({ error: 'dashboardId and widget required' }, { status: 400 });
    }

    const dashboard = mockDashboards.find(d => d.id === dashboardId);
    if (!dashboard) {
      return Response.json({ error: 'Dashboard not found' }, { status: 404 });
    }

    const newWidget = {
      ...widget,
      id: widget.id || `widget_${Date.now()}`,
    };

    return Response.json({ success: true, widget: newWidget });
  }

  if (action === 'widget_data') {
    const { widgetId } = body;
    // Mock widget data
    const mockData = {
      value: Math.floor(Math.random() * 10000),
      trend: Math.random() * 20 - 10,
      data: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
        value: Math.floor(Math.random() * 5000) + 1000,
      })),
    };

    return Response.json({ data: mockData });
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 });
}

// PATCH /api/dashboards
export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, updates } = body;

  if (!id) return Response.json({ error: 'id required' }, { status: 400 });

  const dashboard = mockDashboards.find(d => d.id === id);
  if (!dashboard) {
    return Response.json({ error: 'Dashboard not found' }, { status: 404 });
  }

  return Response.json({ success: true });
}

// DELETE /api/dashboards
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) return Response.json({ error: 'id required' }, { status: 400 });

  return Response.json({ success: true });
}
