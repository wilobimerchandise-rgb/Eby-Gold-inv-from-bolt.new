import type jsPDF from 'jspdf';
import nairaFontUrl from '@/assets/fonts/NotoSans-Regular.ttf';

const FONT_FILE = 'NotoSans-Regular.ttf';
const FONT_NAME = 'NotoSansNaira';

let cachedBase64: string | null = null;

async function arrayBufferToBase64(buffer: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000; // avoid call-stack overflow on large fonts
  let binary = '';
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

/**
 * Registers a Unicode-capable font (with a real ₦ glyph) on the given jsPDF
 * document. jsPDF's built-in Helvetica/Times/Courier fonts are WinAnsi-only
 * and cannot render the Naira sign (U+20A6) — this embeds a font that can.
 * Returns the font name to pass to doc.setFont().
 */
export async function ensureNairaFont(doc: jsPDF): Promise<string> {
  if (!cachedBase64) {
    const res = await fetch(nairaFontUrl);
    const buf = await res.arrayBuffer();
    cachedBase64 = await arrayBufferToBase64(buf);
  }
  doc.addFileToVFS(FONT_FILE, cachedBase64);
  doc.addFont(FONT_FILE, FONT_NAME, 'normal');
  return FONT_NAME;
}
