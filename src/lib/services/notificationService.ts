import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  writeBatch,
  Timestamp,
  onSnapshot,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/firebase';
import { toast } from 'sonner';
import { Notification, NotificationType, NotificationPriority, NotificationTemplate, NOTIFICATION_TEMPLATES } from '@/types/notification';

// =============================================================================
// NOTIFICATION SERVICE
// =============================================================================

class NotificationService {
  private userId: string | null = null;
  private unsubscribe: (() => void) | null = null;

  /**
   * Initialize notification service for a user
   */
  initialize(userId: string): void {
    this.userId = userId;
    this.setupRealtimeListener();
  }

  /**
   * Cleanup listeners
   */
  cleanup(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.userId = null;
  }

  /**
   * Setup realtime listener for new notifications
   */
  private setupRealtimeListener(): void {
    if (!this.userId) return;

    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', this.userId),
      where('read', '==', false),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    this.unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const notification = { id: change.doc.id, ...change.doc.data() } as Notification;
          this.showToast(notification);
        }
      });
    });
  }

  /**
   * Create a new notification
   */
  async create(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    options: {
      priority?: NotificationPriority;
      actionUrl?: string;
      actionLabel?: string;
      imageUrl?: string;
    } = {}
  ): Promise<string> {
    const notification: Omit<Notification, 'id'> = {
      userId,
      type,
      priority: options.priority || 'normal',
      title,
      message,
      actionUrl: options.actionUrl,
      actionLabel: options.actionLabel,
      imageUrl: options.imageUrl,
      read: false,
      archived: false,
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'notifications'), {
      ...notification,
      createdAt: Timestamp.now(),
    });

    return docRef.id;
  }

  /**
   * Create notification from template
   */
  async createFromTemplate(
    userId: string,
    templateKey: keyof typeof NOTIFICATION_TEMPLATES,
    variables: Record<string, string>,
    options: {
      actionUrl?: string;
      priority?: NotificationPriority;
      imageUrl?: string;
    } = {}
  ): Promise<string> {
    const template = (NOTIFICATION_TEMPLATES as any)[templateKey];

    if (!template) {
      throw new Error(`Template ${templateKey} not found`);
    }

    // Replace variables in title and message
    let title = template.title;
    let message = template.message;

    Object.entries(variables).forEach(([key, value]) => {
      title = title.replace(`{${key}}`, value);
      message = message.replace(`{${key}}`, value);
    });

    return this.create(userId, template.type, title, message, {
      ...options,
      actionLabel: template.actionLabel,
    });
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(
    userId: string,
    options: {
      unreadOnly?: boolean;
      types?: NotificationType[];
      limit?: number;
    } = {}
  ): Promise<Notification[]> {
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
    ];

    if (options.unreadOnly) {
      constraints.push(where('read', '==', false));
    }

    if (options.types && options.types.length > 0) {
      constraints.push(where('type', 'in', options.types));
    }

    if (options.limit) {
      constraints.push(limit(options.limit));
    }

    const q = query(collection(db, 'notifications'), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      readAt: doc.data().readAt?.toDate(),
    })) as Notification[];
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true,
      readAt: Timestamp.now(),
    });
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    const notifications = await this.getUserNotifications(userId, { unreadOnly: true });

    if (notifications.length === 0) return;

    const batch = writeBatch(db);

    notifications.forEach(notification => {
      const ref = doc(db, 'notifications', notification.id);
      batch.update(ref, {
        read: true,
        readAt: Timestamp.now(),
      });
    });

    await batch.commit();
  }

  /**
   * Archive notification
   */
  async archive(notificationId: string): Promise<void> {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      archived: true,
    });
  }

  /**
   * Delete notification
   */
  async delete(notificationId: string): Promise<void> {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      archived: true,
    });
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string): Promise<number> {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  }

  /**
   * Show toast notification
   */
  private showToast(notification: Notification): void {
    const toastOptions: any = {
      description: notification.message,
      duration: notification.priority === 'urgent' ? 10000 : 5000,
    };

    if (notification.actionUrl && notification.actionLabel) {
      toastOptions.action = {
        label: notification.actionLabel,
        onClick: () => window.location.href = notification.actionUrl!,
      };
    }

    switch (notification.priority) {
      case 'urgent':
      case 'high':
        toast.error(notification.title, toastOptions);
        break;
      case 'normal':
        toast.success(notification.title, toastOptions);
        break;
      case 'low':
        toast.info(notification.title, toastOptions);
        break;
    }
  }
}

export const notificationService = new NotificationService();
