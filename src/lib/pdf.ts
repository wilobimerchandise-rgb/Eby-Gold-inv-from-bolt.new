import jsPDF from 'jspdf';
import type { Branding, InvoiceState, Product } from '@/types';
import { discountAmount, grandTotal, lineTotal, subtotal, taxAmount } from './calc';
import { amountInWords } from './words';
import { ensureNairaFont } from './fonts';

function money(n: number): string {
  const v = Number.isFinite(n) ? n : 0;
  return '₦' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Column layout (M=15, W=210, CW=180):
// S/N(12) | Item(90) | Qty(18) | Unit Price(33) | Total(27) = 180 ✓
const COL_X = [15, 27, 117, 135, 168, 195] as const;
const COL_W = [12, 90, 18, 33, 27] as const;

// ---- watermark tuning ----
// NOTE: no rotation is applied — jsPDF v4's addImage rotation parameter
// appears to behave differently from earlier versions and was silently
// failing every tile. Straight grid for now; can revisit rotation later
// once we confirm the base pattern renders.
const WM_OPACITY = 0.14;    // lower = fainter. Once confirmed visible, try 0.05–0.10.
const WM_TILE_SPACING = 50; // mm between tile centers — bigger = sparser
const WM_TILE_SIZE = 30;    // mm — each logo instance's size

let wmWarned = false;

function drawWatermarkPattern(doc: jsPDF, logoDataUrl: string, pageW: number, pageH: number) {
  try {
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: WM_OPACITY }));
    for (let yy = -WM_TILE_SPACING; yy < pageH + WM_TILE_SPACING; yy += WM_TILE_SPACING) {
      for (let xx = -WM_TILE_SPACING; xx < pageW + WM_TILE_SPACING; xx += WM_TILE_SPACING) {
        try {
          doc.addImage(logoDataUrl, 'PNG', xx, yy, WM_TILE_SIZE, WM_TILE_SIZE, undefined, 'FAST');
        } catch (err) {
          if (!wmWarned) {
            console.warn('Watermark tile failed to render:', err);
            wmWarned = true;
          }
        }
      }
    }
    doc.restoreGraphicsState();
  } catch (err) {
    console.warn('Watermark pattern failed entirely:', err);
  }
}

export async function generatePdf(
  state: InvoiceState,
  branding: Branding,
  _products: Product[],
): Promise<jsPDF> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const H = 297;
  const M = 15;
  const CW = W - M * 2; // 180

  const NAIRA_FONT = await ensureNairaFont(doc);

  function printMoney(text: string, x: number, y: number, opts?: { align?: 'left' | 'center' | 'right' }) {
    const prev = doc.getFont();
    doc.setFont(NAIRA_FONT, 'normal');
    doc.text(text, x, y, opts);
    doc.setFont(prev.fontName, prev.fontStyle);
  }

  // ---- watermark (spread across the page, drawn first so it sits behind everything) ----
  if (branding.logoDataUrl) {
    drawWatermarkPattern(doc, branding.logoDataUrl, W, H);
  }

  // ---- header ----
  let y = M;
  if (branding.logoDataUrl) {
    try {
      doc.addImage(branding.logoDataUrl, 'PNG', M, y, 18, 18, undefined, 'FAST');
    } catch { /* ignore */ }
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(180, 120, 20);
  doc.text(branding.brand || '—', M + 22, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(90, 90, 90);
  doc.text(branding.address || '', M + 22, y + 12);
  doc.text(`Tel: ${branding.phone || ''}  ·  ${branding.email || ''}`, M + 22, y + 16.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(180, 120, 20);
  doc.text('INVOICE', W - M, y + 7, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text(`#${state.invoiceNumber || ''}`, W - M, y + 13, { align: 'right' });
  doc.text(`Date: ${state.date || ''}`, W - M, y + 18, { align: 'right' });

  y += 24;
  doc.setDrawColor(200, 160, 60);
  doc.setLineWidth(0.8);
  doc.line(M, y, W - M, y);
  y += 6;

  // ---- bill to ----
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(180, 120, 20);
  doc.text('BILL TO', M, y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text(state.customer?.name || '—', M, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(90, 90, 90);
  doc.text(state.customer?.phone || '', M, y + 10);
  const addrLines = doc.splitTextToSize(state.customer?.address || '', 80);
  doc.text(addrLines, M, y + 15);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(180, 120, 20);
  doc.text('PAYMENT', W - M, y, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text(state.paymentMethod || '—', W - M, y + 5, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(90, 90, 90);
  doc.text(`Due: ${state.dueDate || ''}`, W - M, y + 10, { align: 'right' });

  y += Math.max(22, 8 + addrLines.length * 4);
  y += 4;

  // ---- items table ----
  const tableTop = y;

  doc.setFillColor(180, 120, 20);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.rect(M, y, CW, 8, 'F');
  doc.text('S/N',          COL_X[0] + 2,  y + 5.5);
  doc.text('Item Name',    COL_X[1] + 2,  y + 5.5);
  doc.text('Qty',          COL_X[3] - 2,  y + 5.5, { align: 'right' });
  doc.text('Unit Price',   COL_X[4] - 2,  y + 5.5, { align: 'right' });
  doc.text('Total',        COL_X[5] - 2,  y + 5.5, { align: 'right' });
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);
  if (state.items.length === 0) {
    doc.text('No items', M + 2, y + 5);
    y += 8;
  }
  state.items.forEach((item, idx) => {
    const rowH = 8;
    if (idx % 2 === 0) {
      doc.setFillColor(252, 247, 235);
      doc.rect(M, y, CW, rowH, 'F');
    }
    doc.setFontSize(8);
    doc.text(String(idx + 1),              COL_X[0] + 2,  y + 5.5);
    const nameLines = doc.splitTextToSize(item.name || '—', COL_W[1] - 4);
    doc.text(nameLines[0] || '',           COL_X[1] + 2,  y + 5.5);
    doc.text(String(item.quantity),        COL_X[3] - 2,  y + 5.5, { align: 'right' });
    printMoney(money(item.price),          COL_X[4] - 2,  y + 5.5, { align: 'right' });
    printMoney(money(lineTotal(item)),     COL_X[5] - 2,  y + 5.5, { align: 'right' });
    y += rowH;
  });

  const tableBottom = y;

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.rect(M, tableTop, CW, tableBottom - tableTop);
  let acc = M;
  COL_W.forEach((w) => {
    acc += w;
    doc.line(acc, tableTop, acc, tableBottom);
  });
  doc.line(M, tableTop + 8, W - M, tableTop + 8);
  for (let i = 1; i <= state.items.length; i++) {
    doc.line(M, tableTop + 8 + i * 8, W - M, tableTop + 8 + i * 8);
  }

  y += 6;

  // ---- totals ----
  const sub = subtotal(state.items);
  const disc = discountAmount(state);
  const tax = taxAmount(state);
  const total = grandTotal(state);

  const tx = W - M - 80;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(90, 90, 90);
  doc.text('Subtotal', tx, y);
  printMoney(money(sub), W - M, y, { align: 'right' });
  y += 6;
  if (disc > 0) {
    doc.setTextColor(180, 120, 20);
    doc.text('Discount', tx, y);
    printMoney('- ' + money(disc), W - M, y, { align: 'right' });
    y += 6;
  }
  if (state.taxRate > 0) {
    doc.setTextColor(90, 90, 90);
    doc.text(`Tax (${state.taxRate}%)`, tx, y);
    printMoney(money(tax), W - M, y, { align: 'right' });
    y += 6;
  }

  const barW = 84;
  doc.setFillColor(180, 120, 20);
  doc.rect(tx - 4, y - 2, barW, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Grand Total', tx, y + 4);
  printMoney(money(total), W - M, y + 4, { align: 'right' });
  y += 14;

  // amount in words
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  const words = `Amount in Words: ${amountInWords(total)}`;
  const wordsLines = doc.splitTextToSize(words, CW);
  doc.text(wordsLines, M, y);
  y += wordsLines.length * 4 + 4;

  // ---- payment information (bordered table) ----
  y += 4;
  doc.setDrawColor(200, 160, 60);
  doc.setLineWidth(0.4);
  doc.line(M, y, W - M, y);
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(180, 120, 20);
  doc.text('PAYMENT INFORMATION', M, y);
  y += 4;

  const pay = state.payment ?? { bankName: '', accountName: '', accountNumber: '' };
  const payRows: [string, string][] = [
    ['Bank', pay.bankName || '—'],
    ['Account Name', pay.accountName || '—'],
    ['Account Number', pay.accountNumber || '—'],
  ];
  const payLabelW = 45;
  const payRowH = 7;
  const payTop = y;

  payRows.forEach(([label, value], idx) => {
    const ry = payTop + idx * payRowH;
    if (idx % 2 === 0) {
      doc.setFillColor(252, 247, 235);
      doc.rect(M, ry, CW, payRowH, 'F');
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(90, 90, 90);
    doc.text(label, M + 2, ry + 5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text(value, M + payLabelW + 2, ry + 5);
  });

  const payBottom = payTop + payRows.length * payRowH;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.rect(M, payTop, CW, payBottom - payTop);
  doc.line(M + payLabelW, payTop, M + payLabelW, payBottom);
  for (let i = 1; i < payRows.length; i++) {
    doc.line(M, payTop + i * payRowH, W - M, payTop + i * payRowH);
  }

  // ---- footer ----
  const fy = 285;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(M, fy, W - M, fy);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(120, 80, 20);
  doc.text(`Thank you for shopping with ${branding.brand || 'us'}.`, W / 2, fy + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(`Created by: ${branding.userName || ''}`, W / 2, fy + 10, { align: 'center' });

  return doc;
}

export async function downloadPdf(state: InvoiceState, branding: Branding, products: Product[]): Promise<Blob> {
  const doc = await generatePdf(state, branding, products);
  return doc.output('blob');
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
