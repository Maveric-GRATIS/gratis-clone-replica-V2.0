/**
 * Part 10 - Section 49: Inventory Management System
 * Types for product catalog, inventory tracking, warehouses, and purchase orders
 */

import type { Timestamp } from 'firebase/firestore';

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: 'bottle' | 'merchandise' | 'bundle' | 'digital';
  status: 'active' | 'inactive' | 'discontinued';
  images: string[];
  variants: ProductVariant[];
  basePrice: number;
  costPrice: number;
  currency: string;
  weight?: number; // grams
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  taxable: boolean;
  taxCategory?: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  options: Record<string, string>; // e.g., { color: 'blue', size: 'large' }
  price: number;
  costPrice: number;
  compareAtPrice?: number;
  weight?: number;
  barcode?: string;
  imageUrl?: string;
  isDefault: boolean;
}

export interface InventoryItem {
  id: string;
  productId: string;
  variantId: string;
  sku: string;
  warehouseId: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  reorderPoint: number;
  reorderQuantity: number;
  lastCountedAt?: Timestamp;
  updatedAt: Timestamp;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  type: 'main' | 'fulfillment' | 'dropship' | 'partner';
  address: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  isActive: boolean;
  priority: number;
  capabilities: ('storage' | 'shipping' | 'returns')[];
  createdAt: Timestamp;
}

export interface InventoryMovement {
  id: string;
  type: 'receipt' | 'shipment' | 'adjustment' | 'transfer' | 'return' | 'damage';
  productId: string;
  variantId: string;
  sku: string;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason?: string;
  referenceType?: 'order' | 'purchase_order' | 'return' | 'manual';
  referenceId?: string;
  cost?: number;
  performedBy: string;
  createdAt: Timestamp;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  warehouseId: string;
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'partial' | 'received' | 'cancelled';
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  expectedDeliveryDate?: Timestamp;
  actualDeliveryDate?: Timestamp;
  notes?: string;
  attachments?: string[];
  createdBy: string;
  approvedBy?: string;
  approvedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  variantId: string;
  sku: string;
  productName: string;
  quantity: number;
  receivedQuantity: number;
  unitCost: number;
  totalCost: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  paymentTerms: string;
  leadTimeDays: number;
  minimumOrderValue?: number;
  currency: string;
  notes?: string;
  isActive: boolean;
  rating?: number;
  createdAt: Timestamp;
}

export interface StockAlert {
  id: string;
  productId: string;
  variantId: string;
  sku: string;
  warehouseId: string;
  alertType: 'low_stock' | 'out_of_stock' | 'overstock';
  currentQuantity: number;
  threshold: number;
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledgedBy?: string;
  acknowledgedAt?: Timestamp;
  resolvedAt?: Timestamp;
  createdAt: Timestamp;
}
