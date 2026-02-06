// ============================================================================
// PAYMENT, REFUND, DISPUTE & TAX RECEIPT TYPES
// ============================================================================

export type PaymentStatus = 'succeeded' | 'pending' | 'failed' | 'refunded' | 'partially_refunded' | 'disputed';

export interface PaymentRecord {
  id: string;
  userId: string;
  donationId?: string;
  subscriptionId?: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  description?: string;
  receiptUrl?: string;
  refundedAmount?: number;
  disputeId?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export type RefundStatus = 'pending' | 'succeeded' | 'failed' | 'canceled';
export type RefundReason = 'donor_request' | 'duplicate' | 'fraudulent' | 'project_canceled' | 'other';

export interface RefundRecord {
  id: string;
  paymentId: string;
  stripeRefundId: string;
  amount: number;
  currency: string;
  reason: RefundReason;
  reasonNote?: string;
  status: RefundStatus;
  initiatedBy: string;
  approvedBy?: string;
  createdAt: Date;
  completedAt?: Date;
}

export type DisputeStatus = 'warning_needs_response' | 'warning_under_review' | 'warning_closed'
  | 'needs_response' | 'under_review' | 'charge_refunded' | 'won' | 'lost';

export interface DisputeRecord {
  id: string;
  paymentId: string;
  stripeDisputeId: string;
  amount: number;
  currency: string;
  reason: string;
  status: DisputeStatus;
  evidenceDueBy?: Date;
  evidenceSubmitted: boolean;
  isChargeable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaxReceipt {
  id: string;
  userId: string;
  receiptNumber: string;
  fiscalYear: number;
  totalAmount: number;
  currency: string;
  donations: TaxReceiptDonation[];
  organizationInfo: {
    name: string;
    address: string;
    kvkNumber: string;
    rsinNumber: string;
    anbiNumber: string;
  };
  donorInfo: {
    name: string;
    email: string;
    address?: string;
  };
  issueDate: Date;
  pdfUrl?: string;
  status: 'draft' | 'issued' | 'sent' | 'voided';
  sentAt?: Date;
  voidedAt?: Date;
  voidReason?: string;
  createdAt: Date;
}

export interface TaxReceiptDonation {
  donationId: string;
  date: Date;
  amount: number;
  projectName: string;
  paymentMethod: string;
}

export interface TaxReceiptGenerationRequest {
  userId: string;
  fiscalYear: number;
  email: boolean;
  includeAddress: boolean;
}

export interface DisputeEvidence {
  customerName?: string;
  customerEmailAddress?: string;
  customerPurchaseIp?: string;
  billingAddress?: string;
  receipt?: string;
  customerSignature?: string;
  uncategorizedText?: string;
  productDescription?: string;
  shippingDocumentation?: string;
  refundPolicy?: string;
  cancellationPolicy?: string;
  customerCommunication?: string;
}
