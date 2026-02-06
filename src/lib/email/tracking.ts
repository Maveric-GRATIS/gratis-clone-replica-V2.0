/**
 * Email Tracking System
 * Track opens, clicks, and engagement
 */

import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export interface EmailEvent {
  id?: string;
  emailId: string;
  recipientEmail: string;
  eventType: "sent" | "delivered" | "opened" | "clicked" | "bounced" | "complained";
  timestamp: Date;
  metadata?: {
    link?: string;
    userAgent?: string;
    ip?: string;
    location?: string;
  };
}

export const emailTracking = {
  /**
   * Track email event
   */
  async trackEvent(event: Omit<EmailEvent, "id" | "timestamp">) {
    await addDoc(collection(db, "email_events"), {
      ...event,
      timestamp: new Date(),
    });
  },

  /**
   * Track email open
   */
  async trackOpen(emailId: string, recipientEmail: string, metadata?: EmailEvent["metadata"]) {
    await this.trackEvent({
      emailId,
      recipientEmail,
      eventType: "opened",
      metadata,
    });
  },

  /**
   * Track link click
   */
  async trackClick(
    emailId: string,
    recipientEmail: string,
    link: string,
    metadata?: EmailEvent["metadata"]
  ) {
    await this.trackEvent({
      emailId,
      recipientEmail,
      eventType: "clicked",
      metadata: {
        ...metadata,
        link,
      },
    });
  },

  /**
   * Get email statistics
   */
  async getEmailStats(emailId: string) {
    const q = query(collection(db, "email_events"), where("emailId", "==", emailId));
    const snapshot = await getDocs(q);
    const events = snapshot.docs.map((doc) => doc.data() as EmailEvent);

    const opens = events.filter((e) => e.eventType === "opened").length;
    const clicks = events.filter((e) => e.eventType === "clicked").length;
    const bounces = events.filter((e) => e.eventType === "bounced").length;

    return {
      sent: events.filter((e) => e.eventType === "sent").length,
      delivered: events.filter((e) => e.eventType === "delivered").length,
      opens,
      clicks,
      bounces,
      openRate: opens > 0 ? (opens / events.length) * 100 : 0,
      clickRate: clicks > 0 ? (clicks / events.length) * 100 : 0,
    };
  },

  /**
   * Get campaign analytics
   */
  async getCampaignStats(campaignId: string) {
    // Query emails by campaign ID (assuming campaign field in email_queue)
    const q = query(
      collection(db, "email_queue"),
      where("data.campaignId", "==", campaignId)
    );
    const emailsSnapshot = await getDocs(q);
    const emailIds = emailsSnapshot.docs.map((doc) => doc.id);

    // Get all events for these emails
    const allEvents: EmailEvent[] = [];
    for (const emailId of emailIds) {
      const eventsQ = query(
        collection(db, "email_events"),
        where("emailId", "==", emailId)
      );
      const eventsSnapshot = await getDocs(eventsQ);
      allEvents.push(...eventsSnapshot.docs.map((doc) => doc.data() as EmailEvent));
    }

    const uniqueOpens = new Set(
      allEvents.filter((e) => e.eventType === "opened").map((e) => e.recipientEmail)
    ).size;
    const uniqueClicks = new Set(
      allEvents.filter((e) => e.eventType === "clicked").map((e) => e.recipientEmail)
    ).size;

    return {
      totalSent: emailIds.length,
      uniqueOpens,
      uniqueClicks,
      bounces: allEvents.filter((e) => e.eventType === "bounced").length,
      complaints: allEvents.filter((e) => e.eventType === "complained").length,
      openRate: uniqueOpens > 0 ? (uniqueOpens / emailIds.length) * 100 : 0,
      clickRate: uniqueClicks > 0 ? (uniqueClicks / emailIds.length) * 100 : 0,
    };
  },

  /**
   * Get user engagement history
   */
  async getUserEngagement(recipientEmail: string) {
    const q = query(
      collection(db, "email_events"),
      where("recipientEmail", "==", recipientEmail)
    );
    const snapshot = await getDocs(q);
    const events = snapshot.docs.map((doc) => doc.data() as EmailEvent);

    return {
      totalEmails: new Set(events.map((e) => e.emailId)).size,
      opens: events.filter((e) => e.eventType === "opened").length,
      clicks: events.filter((e) => e.eventType === "clicked").length,
      lastEngagement: events.length > 0 
        ? events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0].timestamp
        : null,
    };
  },
};

/**
 * Generate tracking pixel URL
 */
export function generateTrackingPixel(emailId: string, recipientEmail: string): string {
  const params = new URLSearchParams({
    eid: emailId,
    r: btoa(recipientEmail),
  });
  return `${window.location.origin}/api/track/open?${params}`;
}

/**
 * Generate tracked link
 */
export function generateTrackedLink(
  emailId: string,
  recipientEmail: string,
  originalUrl: string
): string {
  const params = new URLSearchParams({
    eid: emailId,
    r: btoa(recipientEmail),
    url: originalUrl,
  });
  return `${window.location.origin}/api/track/click?${params}`;
}
