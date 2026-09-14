const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen',
];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function twoDigits(n: number): string {
  if (n < 20) return ones[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return tens[t] + (o ? '-' + ones[o] : '');
}

function threeDigits(n: number): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  let s = '';
  if (h) s += ones[h] + ' Hundred';
  if (r) s += (h ? ' ' : '') + twoDigits(r);
  return s;
}

export function amountInWords(amount: number): string {
  const n = Math.floor(amount);
  const kobo = Math.round((amount - n) * 100);
  if (n === 0 && kobo === 0) return 'Zero Naira Only';

  const billions = Math.floor(n / 1_000_000_000);
  const millions = Math.floor((n % 1_000_000_000) / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1000);
  const rest = n % 1000;

  let words = '';
  if (billions) words += threeDigits(billions) + ' Billion ';
  if (millions) words += threeDigits(millions) + ' Million ';
  if (thousands) words += threeDigits(thousands) + ' Thousand ';
  if (rest) words += threeDigits(rest);

  words = words.trim() || 'Zero';
  words += ' Naira';
  if (kobo > 0) words += ', ' + twoDigits(kobo) + ' Kobo';
  words += ' Only';
  return words;
}
