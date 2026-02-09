// ============================================================================
// GRATIS.NGO — Activity Timeline Component
// ============================================================================

import React, { useState, useEffect } from 'react';
import { RefreshCw, Pin, Loader2 } from 'lucide-react';
import { ActivityEntry, ActivityType, ACTIVITY_ICONS } from '@/types/activity-feed';

interface ActivityTimelineProps {
  userId?: string;
  visibility?: 'public' | 'team' | 'private';
  limit?: number;
  showFilters?: boolean;
}

export default function ActivityTimeline({ userId, visibility = 'public', limit = 30, showFilters = true }: ActivityTimelineProps) {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ActivityType | 'all'>('all');

  useEffect(() => { loadFeed(); }, [userId, visibility, filter]);

  async function loadFeed() {
    setLoading(true);
    try {
      // For now, use mock data (API routes would be Next.js specific)
      const mockEntries: ActivityEntry[] = [
        {
          id: '1',
          type: 'donation_received',
          title: 'New donation received',
          description: 'Sarah M. donated €50 to Clean Water Project',
          icon: ACTIVITY_ICONS.donation_received.icon,
          color: ACTIVITY_ICONS.donation_received.color,
          actor: { id: 'user1', name: 'Sarah M.', type: 'user' },
          target: { id: 'proj1', type: 'project', name: 'Clean Water Project' },
          visibility: 'public',
          reactions: [{ emoji: '💚', count: 5, userIds: [] }],
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '2',
          type: 'project_created',
          title: 'New project launched',
          description: 'Ocean Cleanup Initiative is now live',
          icon: ACTIVITY_ICONS.project_created.icon,
          color: ACTIVITY_ICONS.project_created.color,
          actor: { id: 'partner1', name: 'Ocean Conservation', type: 'partner' },
          visibility: 'public',
          pinned: true,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: '3',
          type: 'user_joined',
          title: 'New member joined',
          description: 'Alex joined the GRATIS community',
          icon: ACTIVITY_ICONS.user_joined.icon,
          color: ACTIVITY_ICONS.user_joined.color,
          actor: { id: 'user2', name: 'Alex', type: 'user' },
          visibility: 'public',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];

      let filtered = mockEntries;
      if (filter !== 'all') {
        filtered = mockEntries.filter(e => e.type === filter);
      }
      setEntries(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function formatTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60_000) return 'Just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;
    return new Date(iso).toLocaleDateString();
  }

  const pinned = entries.filter((e) => e.pinned);
  const regular = entries.filter((e) => !e.pinned);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Activity Feed</h3>
        <button onClick={loadFeed} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Pills */}
      {showFilters && (
        <div className="flex flex-wrap gap-2">
          {['all', 'donation_received', 'project_created', 'event_created', 'user_joined', 'partner_joined'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1 text-xs rounded-full transition ${
                filter === f ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : ACTIVITY_ICONS[f as ActivityType]?.icon} {f === 'all' ? '' : f.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin text-emerald-400 mx-auto" /></div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-700" />

          {/* Pinned */}
          {pinned.map((entry) => (
            <TimelineEntry key={entry.id} entry={entry} formatTime={formatTime} isPinned />
          ))}

          {/* Regular */}
          {regular.map((entry) => (
            <TimelineEntry key={entry.id} entry={entry} formatTime={formatTime} />
          ))}

          {entries.length === 0 && (
            <p className="text-center text-gray-500 py-8">No activity yet</p>
          )}
        </div>
      )}
    </div>
  );
}

function TimelineEntry({ entry, formatTime, isPinned }: { entry: ActivityEntry; formatTime: (iso: string) => string; isPinned?: boolean }) {
  return (
    <div className={`relative flex gap-4 pb-6 pl-2 ${isPinned ? 'bg-yellow-500/5 -mx-3 px-5 py-3 rounded-lg border border-yellow-500/20' : ''}`}>
      {/* Dot */}
      <div
        className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
        style={{ backgroundColor: entry.color + '20' }}
      >
        {entry.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm text-white font-medium">
              {isPinned && <Pin className="w-3 h-3 text-yellow-400 inline mr-1" />}
              {entry.title}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{entry.description}</p>
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap">{formatTime(entry.createdAt)}</span>
        </div>

        {/* Actor */}
        {entry.actor && (
          <div className="flex items-center gap-2 mt-2">
            {entry.actor.avatar ? (
              <img src={entry.actor.avatar} className="w-5 h-5 rounded-full" alt="" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center text-[10px] text-white">{entry.actor.name[0]}</div>
            )}
            <span className="text-xs text-gray-300">{entry.actor.name}</span>
          </div>
        )}

        {/* Reactions */}
        {entry.reactions && entry.reactions.length > 0 && (
          <div className="flex gap-2 mt-2">
            {entry.reactions.map((r) => (
              <span key={r.emoji} className="px-2 py-0.5 bg-gray-800 rounded-full text-xs">
                {r.emoji} {r.count}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export { ActivityTimeline };