import type { Customer, Product } from '@/types';
import { uid } from './storage';

export const seedProducts: Product[] = [
  { id: uid(), name: 'Royal Gold Rice 5kg', sku: 'RGR-5', barcode: '6001234500011', price: 8500, cost: 7100, unit: 'bag', stock: 120 },
  { id: uid(), name: 'Golden Cooking Oil 3.5L', sku: 'GCO-35', barcode: '6001234500028', price: 7200, cost: 6000, unit: 'btl', stock: 80 },
  { id: uid(), name: 'Eby Sugar 1kg', sku: 'ESG-1', barcode: '6001234500035', price: 1500, cost: 1200, unit: 'pkt', stock: 200 },
  { id: uid(), name: 'Superstores Spaghetti 500g', sku: 'SSP-5', barcode: '6001234500042', price: 900, cost: 700, unit: 'pkt', stock: 150 },
  { id: uid(), name: 'Tomato Paste 400g', sku: 'TMP-4', barcode: '6001234500059', price: 1100, cost: 850, unit: 'tin', stock: 90 },
  { id: uid(), name: 'Indomie Noodles (Carton)', sku: 'IND-C', barcode: '6001234500066', price: 9500, cost: 8000, unit: 'ctn', stock: 60 },
  { id: uid(), name: 'Peak Powdered Milk 400g', sku: 'PKM-4', barcode: '6001234500073', price: 4200, cost: 3500, unit: 'tin', stock: 75 },
  { id: uid(), name: 'Golden Penny Semovita 1kg', sku: 'GPS-1', barcode: '6001234500080', price: 1800, cost: 1400, unit: 'pkt', stock: 110 },
  { id: uid(), name: 'Dangote Salt 250g', sku: 'DGS-25', barcode: '6001234500097', price: 350, cost: 250, unit: 'pkt', stock: 300 },
  { id: uid(), name: 'Eby Laundry Soap 1kg', sku: 'ELS-1', barcode: '6001234500103', price: 1300, cost: 950, unit: 'bar', stock: 140 },
  { id: uid(), name: 'Royal Lux Toilet Roll (6)', sku: 'RLT-6', barcode: '6001234500110', price: 2600, cost: 2000, unit: 'pack', stock: 85 },
  { id: uid(), name: 'Gold Crown Detergent 1kg', sku: 'GCD-1', barcode: '6001234500127', price: 2100, cost: 1600, unit: 'pkt', stock: 95 },
];

export const seedCustomers: Customer[] = [
  { id: uid(), name: 'Walk-in Customer', phone: '—', address: 'In-store' },
  { id: uid(), name: 'Mrs. Adaeze Okoro', phone: '08035551122', address: '12 Aba Road, Port Harcourt' },
  { id: uid(), name: 'Mr. Chinedu Eze', phone: '08052227788', address: '45 Market Square, Aba' },
  { id: uid(), name: 'Grace Boutique', phone: '07069990044', address: '3 Orlu Road, Owerri' },
  { id: uid(), name: "Tony's Mini Mart", phone: '08094441212', address: '78 MCC Road, Aba' },
];

export const defaultBranding = {
  brand: 'Eby-Gold Superstores',
  address: '1 Gold Plaza, Aba Road, Port Harcourt, Nigeria',
  phone: '+234 803 000 0000',
  email: 'hello@ebygold.example',
  logoDataUrl: null as string | null,
  userName: 'Cashier',
};

export const defaultPayment: PaymentInfo = {
  bankName: 'First Bank of Nigeria',
  accountName: 'Eby-Gold Superstores Ltd',
  accountNumber: '3080 1234 5678',
};

import type { PaymentInfo } from '@/types';
