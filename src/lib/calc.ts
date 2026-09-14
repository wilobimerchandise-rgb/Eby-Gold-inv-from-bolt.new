import type { LineItem, InvoiceState } from '@/types';

export function lineTotal(item: LineItem): number {
  return round2(item.price * item.quantity);
}

export function subtotal(items: LineItem[]): number {
  return round2(items.reduce((sum, i) => sum + lineTotal(i), 0));
}

export function discountAmount(state: InvoiceState): number {
  const sub = subtotal(state.items);
  if (state.discountType === 'percent') {
    return round2((sub * state.discountValue) / 100);
  }
  if (state.discountType === 'flat') {
    return round2(Math.min(state.discountValue, sub));
  }
  return 0;
}

export function taxableBase(state: InvoiceState): number {
  return round2(subtotal(state.items) - discountAmount(state));
}

export function taxAmount(state: InvoiceState): number {
  return round2((taxableBase(state) * state.taxRate) / 100);
}

export function grandTotal(state: InvoiceState): number {
  return round2(taxableBase(state) + taxAmount(state));
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function formatMoney(n: number, currency = '₦'): string {
  const value = Number.isFinite(n) ? n : 0;
  return currency + value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

let activeCurrency = '₦';
export function setCurrency(c: string) { activeCurrency = c; }
export function money(n: number): string { return formatMoney(n, activeCurrency); }

