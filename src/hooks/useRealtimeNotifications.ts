// src/hooks/useRealtimeNotifications.ts
// React hook for SSE real-time notifications

import { useState, useEffect, useCallback, useRef } from "react";
import type { RealtimeNotification } from "@/types/realtime";

interface UseRealtimeOptions {
  channels?: string[];
  onNotification?: (notification: RealtimeNotification) => void;
  enabled?: boolean;
}

export function useRealtimeNotifications(options: UseRealtimeOptions = {}) {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const reconnectAttempts = useRef(0);

  const connect = useCallback(() => {
    if(options.enabled === false) return;

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const channels = options.channels || ["global"];
    // Mock SSE connection for development
    // In production, this would connect to /api/realtime/stream

    // Simulate connected state
    setConnected(true);
    setError(null);
    reconnectAttempts.current = 0;

    // Simulate periodic notifications (for demo)
    const mockInterval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance
        const mockNotification: RealtimeNotification = {
          id: `notif_${Date.now()}`,
          channel: "global",
          type: "info",
          title: "New Update",
          message: "A new feature has been released!",
          priority: "medium",
          createdAt: new Date().toISOString(),
        };

        setNotifications((prev) => [mockNotification, ...prev].slice(0, 50));
        options.onNotification?.(mockNotification);
      }
    }, 30000); // Every 30 seconds

    return () => {
      clearInterval(mockInterval);
    };
  }, [options]);

  useEffect(() => {
    const cleanup = connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (cleanup) {
        cleanup();
      }
    };
  }, [connect]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notifications,
    connected,
    error,
    unreadCount: notifications.length,
    clearNotifications,
    dismissNotification,
  };
}
