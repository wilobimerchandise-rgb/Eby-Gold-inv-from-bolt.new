import type jsPDF from 'jspdf';
import nairaFontUrl from '@/assets/fonts/DejaVuSans.ttf';

const FONT_FILE = 'DejaVuSans.ttf';
const FONT_NAME = 'DejaVuSansNaira';

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
 * Registers a Unicode-capable font (with a real ₦ glyph and a proper
 * Windows-Unicode cmap table) on the given jsPDF document. jsPDF's
 * built-in Helvetica/Times/Courier fonts are WinAnsi-only and cannot
 * render the Naira sign (U+20A6); DejaVu Sans is a static TTF known to
 * embed cleanly with jsPDF's own TrueType parser (variable fonts, such
 * as the default Google Fonts download, often fail with
 * "No unicode cmap for font"). Returns the font name for doc.setFont().
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
