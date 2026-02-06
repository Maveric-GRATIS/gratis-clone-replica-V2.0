/**
 * Email Queue System
 * Handle email delivery with retry logic
 */

import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";

export interface QueuedEmail {
  id?: string;
  to: string;
  template: string;
  subject: string;
  data: Record<string, any>;
  status: "queued" | "sending" | "sent" | "failed" | "bounced";
  attempts: number;
  maxAttempts: number;
  scheduledFor?: Date;
  sentAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const emailQueue = {
  /**
   * Add email to queue
   */
  async enqueue(email: Omit<QueuedEmail, "id" | "status" | "attempts" | "createdAt" | "updatedAt">) {
    const queuedEmail: Omit<QueuedEmail, "id"> = {
      ...email,
      status: "queued",
      attempts: 0,
      maxAttempts: email.maxAttempts || 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "email_queue"), queuedEmail);
    return docRef.id;
  },

  /**
   * Process queued emails
   */
  async processQueue() {
    const now = new Date();
    const q = query(
      collection(db, "email_queue"),
      where("status", "==", "queued"),
      where("attempts", "<", 3)
    );

    const snapshot = await getDocs(q);
    const emails = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as QueuedEmail[];

    // Process emails that are scheduled for now or past
    const readyEmails = emails.filter(
      (email) => !email.scheduledFor || email.scheduledFor <= now
    );

    return readyEmails;
  },

  /**
   * Mark email as sent
   */
  async markAsSent(emailId: string) {
    const emailRef = doc(db, "email_queue", emailId);
    await updateDoc(emailRef, {
      status: "sent",
      sentAt: new Date(),
      updatedAt: new Date(),
    });
  },

  /**
   * Mark email as failed
   */
  async markAsFailed(emailId: string, error: string) {
    const emailRef = doc(db, "email_queue", emailId);
    const emailDoc = await getDocs(query(collection(db, "email_queue"), where("__name__", "==", emailId)));
    
    if (emailDoc.empty) return;
    
    const email = emailDoc.docs[0].data() as QueuedEmail;
    const attempts = email.attempts + 1;
    const status = attempts >= (email.maxAttempts || 3) ? "failed" : "queued";

    await updateDoc(emailRef, {
      status,
      attempts,
      error,
      updatedAt: new Date(),
    });
  },

  /**
   * Retry failed emails
   */
  async retryFailed() {
    const q = query(
      collection(db, "email_queue"),
      where("status", "==", "failed"),
      where("attempts", "<", 5)
    );

    const snapshot = await getDocs(q);
    
    for (const emailDoc of snapshot.docs) {
      await updateDoc(doc(db, "email_queue", emailDoc.id), {
        status: "queued",
        updatedAt: new Date(),
      });
    }
  },

  /**
   * Get queue statistics
   */
  async getStats() {
    const allEmails = await getDocs(collection(db, "email_queue"));
    const emails = allEmails.docs.map((doc) => doc.data() as QueuedEmail);

    return {
      total: emails.length,
      queued: emails.filter((e) => e.status === "queued").length,
      sent: emails.filter((e) => e.status === "sent").length,
      failed: emails.filter((e) => e.status === "failed").length,
      bounced: emails.filter((e) => e.status === "bounced").length,
    };
  },
};
