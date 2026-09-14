import type { InvoiceState } from '@/types';
import { uid } from './storage';
import { defaultPayment } from './seed';

export function blankInvoice(number: string): InvoiceState {
  return {
    invoiceNumber: number,
    date: new Date().toISOString().slice(0, 10),
    dueDate: new Date().toISOString().slice(0, 10),
    customer: { id: '', name: '', phone: '', address: '' },
    items: [],
    discountType: 'none',
    discountValue: 0,
    taxRate: 7.5,
    paymentMethod: 'Cash',
    notes: 'Thank you for shopping with us!',
    payment: { ...defaultPayment },
  };
}

export function nextInvoiceNumber(existing: string): string {
  const year = new Date().getFullYear();
  if (!existing) return `EGS-${year}-0001`;
  const match = existing.match(/(\d+)$/);
  const n = match ? parseInt(match[1], 10) + 1 : 1;
  return `EGS-${year}-${String(n).padStart(4, '0')}`;
}

export function newLineItem() {
  return {
    id: uid(),
    productId: '',
    name: '',
    sku: '',
    barcode: '',
    price: 0,
    quantity: 1,
    unit: 'pc',
  };
}
