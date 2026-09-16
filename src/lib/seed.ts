import type { Customer, PaymentInfo, Product } from '@/types';
import { uid } from './storage';

export const seedProducts: Product[] = [
  { id: uid(), name: 'Morning Fresh-Big', sku: 'MRN-b', barcode: '6150001000012', price: 3700, cost: 3400, unit: 'btl', stock: 100 },
  { id: uid(), name: 'Harpic Toilet Wash-Big', sku: 'HRP-b', barcode: '6150001000029', price: 4700, cost: 4000, unit: 'btl', stock: 100 },
  { id: uid(), name: 'Hand Wash', sku: 'HND-w', barcode: '6150001000036', price: 1600, cost: 1300, unit: 'btl', stock: 100 },
  { id: uid(), name: 'Air freshener', sku: 'AIR-f', barcode: '6150001000043', price: 2200, cost: 2000, unit: 'can', stock: 100 },
  { id: uid(), name: 'Rose Tissue Paper (Bag)', sku: 'ROS-B', barcode: '6150001000050', price: 12500, cost: 11000, unit: 'bag', stock: 100 },
  { id: uid(), name: 'Peak Milk Powder- 800g', sku: 'PKM-8', barcode: '6150001000067', price: 10500, cost: 10000, unit: 'tin', stock: 100 },
  { id: uid(), name: 'Raid Insecticide', sku: 'RAD-i', barcode: '6150001000074', price: 3500, cost: 3000, unit: 'can', stock: 100 },
  { id: uid(), name: 'Dettol-500ml', sku: 'DET-500', barcode: '6150001000081', price: 9500, cost: 8900, unit: 'btl', stock: 100 },
  { id: uid(), name: 'Waste Bin Bag- Roll', sku: 'WST-R', barcode: '6150001000098', price: 1300, cost: 1000, unit: 'roll', stock: 100 },
  { id: uid(), name: 'Milo-800g', sku: 'MIL-8', barcode: '6150001000104', price: 9000, cost: 8000, unit: 'tin', stock: 100 },
  { id: uid(), name: 'St Louis Sugar- pkt', sku: 'STL-p', barcode: '6150001000111', price: 2100, cost: 1850, unit: 'pkt', stock: 100 },
  { id: uid(), name: 'Table Tissue Paper-pkt', sku: 'TBL-t', barcode: '6150001000128', price: 2500, cost: 2000, unit: 'pkt', stock: 100 },
  { id: uid(), name: 'DoubleA A4 Paper-pkt', sku: 'DA4-p', barcode: '6150001000135', price: 6600, cost: 6000, unit: 'pkt', stock: 100 },
  { id: uid(), name: 'Viva Detergent-1.6kg', sku: 'VIV-d', barcode: '6150001000142', price: 4600, cost: 4000, unit: 'pkt', stock: 100 },
];

export const seedCustomers: Customer[] = [
  { id: uid(), name: 'Walk-in Customer', phone: '—', address: 'In-store' },
  { id: uid(), name: 'Cargo Brokerage', phone: '_', address: '229 Moshood Abiola Way, Ijora Lagos.' },
  { id: uid(), name: 'Mr. Chinedu Eze', phone: '08052227788', address: '45 Market Square, Aba' },
  { id: uid(), name: 'Grace Boutique', phone: '07069990044', address: '3 Orlu Road, Owerri' },
  { id: uid(), name: "Tony's Mini Mart", phone: '08094441212', address: '78 MCC Road, Aba' },
];

export const defaultBranding = {
  brand: 'Eby-Gold Superstores',
  address: '19 Jejelaiye Street, Surulere, Lagos, Nigeria',
  phone: '+234 7058016395',
  email: 'ebereakaolisa5@gmail.com',
  logoDataUrl: null as string | null,
  userName: 'Cashier',
};

export const defaultPayment: PaymentInfo = {
  bankName: 'UBA',
  accountName: 'Ebere Favour Akaolisa',
  accountNumber: '2189015307',
};
