import type { Customer } from '@/types';

export function normalizeNigerianPhone(raw: string): string {
  let p = raw.replace(/\D/g, '');
  if (!p) return '';
  if (p.startsWith('234')) p = p.slice(3);
  else if (p.startsWith('0')) p = p.slice(1);
  if (p.length === 10) p = p;
  return '234' + p;
}

export function whatsappUrl(customer: Customer, brand: string): string {
  const name = customer.name || 'Customer';
  const msg = `Hello ${name}, please find your invoice from ${brand} attached.`;
  const phone = normalizeNigerianPhone(customer.phone);
  const base = phone ? `https://wa.me/${phone}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(msg)}`;
}
