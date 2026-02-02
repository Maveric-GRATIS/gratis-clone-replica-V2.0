/**
 * Part 10 - Section 50: Tax Receipt Generation
 * Types for automated tax receipt generation and management
 */

import type { Timestamp } from 'firebase/firestore';

export interface TaxReceipt {
  id: string;
  receiptNumber: string;
  donorId: string;
  donorInfo: {
    firstName: string;
    lastName: string;
    email: string;
    address?: {
      street: string;
      city: string;
      state?: string;
      postalCode: string;
      country: string;
    };
    taxId?: string; // For business donations
  };
  organizationInfo: {
    name: string;
    registrationNumber: string;
    taxExemptNumber: string;
    address: string;
    country: string;
  };
  donations: TaxReceiptDonation[];
  totalAmount: number;
  currency: string;
  taxYear: number;
  type: 'single' | 'annual' | 'consolidated';
  status: 'draft' | 'issued' | 'sent' | 'voided';
  fileUrl?: string;
  sentAt?: Timestamp;
  voidedAt?: Timestamp;
  voidReason?: string;
  issuedAt: Timestamp;
  createdAt: Timestamp;
}

export interface TaxReceiptDonation {
  donationId: string;
  date: Timestamp;
  amount: number;
  currency: string;
  paymentMethod: string;
  projectName?: string;
  isRecurring: boolean;
}

export interface TaxReceiptTemplate {
  id: string;
  name: string;
  country: string;
  language: string;
  htmlTemplate: string;
  cssStyles: string;
  headerLogo?: string;
  footerText?: string;
  requiredFields: string[];
  isDefault: boolean;
  createdAt: Timestamp;
}

export interface TaxReceiptSettings {
  organizationName: string;
  registrationNumber: string;
  taxExemptNumber: string;
  address: string;
  country: string;
  logoUrl?: string;
  signatureUrl?: string;
  signerName: string;
  signerTitle: string;
  autoSendEnabled: boolean;
  autoSendThreshold: number; // Minimum donation amount
  receiptNumberPrefix: string;
  fiscalYearEnd: { month: number; day: number };
}

export interface TaxDeductibility {
  country: string;
  isDeductible: boolean;
  maxDeductionPercent?: number;
  maxDeductionAmount?: number;
  requiresDocumentation: boolean;
  notes: string;
  lastUpdated: Timestamp;
}
