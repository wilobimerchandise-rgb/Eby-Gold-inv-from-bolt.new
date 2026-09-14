export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  price: number;
  cost: number;
  unit: string;
  stock: number;
}

export interface LineItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  barcode: string;
  price: number;
  quantity: number;
  unit: string;
}

export type DiscountType = 'percent' | 'flat' | 'none';

export interface PaymentInfo {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface Branding {
  brand: string;
  address: string;
  phone: string;
  email: string;
  logoDataUrl: string | null;
  userName: string;
}

export interface InvoiceState {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customer: Customer;
  items: LineItem[];
  discountType: DiscountType;
  discountValue: number;
  taxRate: number;
  paymentMethod: string;
  notes: string;
  payment: PaymentInfo;
}

export type FormatMode = 'invoice' | 'receipt';
export type AppTab = 'invoice' | 'inventory' | 'settings';
